# Rendering in toolkit

This document describes how the toolkit library renders widgets. The different
techniques used are important to understand when using toolkit widgets within
other applications. This is especially true when widgets are dynamically resized
or their style sheets are changes dynamically.
This document also details some optimizations to increase DOM performance, which
might be of interest to others.

## The Widget Tree

Widgets are organized in a tree. This tree will usually be similar to the DOM
tree, where each widgets consists of at least one DOM elements. There may be
several disconnected widget trees at the same time. The root of a widget tree
should always be a widget which is a subclass of Root. The Root widget takes
care of tracking resize events and (possibly) document visibility changes.

## DOM manipulations and scheduling

The appearance of a widget is determined by the values of its options and
CSS declarations. By design it does not matter in which order options
in a widget are set. This allows us to delay and reorder DOM manipulations
arbitrarily. In particular, DOM manipulations are usually not performed when
an option is modified using the `set()` method. Instead, widgets will simply
record which options have changed and (in case they are visible) register
themselves to be rendered in the next animation frame.
The rendering is done by calling a method called `redraw()`.
This method checks which options have been modified since the last time a
widget was rendered and perform all necessary modifications to the DOM.
Delaying the actual DOM modifications has several advantages from a performance
perspective. It also allows us to apply other optimizations, which we will go
into later.

The main advantage of delaying DOM modifications is that it makes performance
much more reliable. This is particularly important on slow devices in applications
which have a very high update frequency. One example is an application displaying
audio levels, where update intervals of 20 ms are not uncommon.
When using several level meters in parallel, the cost of DOM manipulations might
prevent a slow device from keeping up with all the modifications. This would lead to
high delays and possibly make the application completely unresponsive.
On the other hand, when DOM manipulations are delayed to a rendering frame, the
application is guaranteed to display the latest data at the highest frame rate it
can achieve.

There are several other optimizations which can be used when DOM manipulations
are not performed immediately.

* DOM manipulations can be completely disabled for widgets, which are not currently
  visible
* In modern browsers (especially on tablets and phones) rendering can be completely
  turned off when the application window is in the background. Note that this can
  not be easily done by completely disabling the application, since the application
  logic might need to continue running.

toolkit furthermore employs a technique which we will explain in the following. We
call this technique **DOM scheduling**.

The run time performance of code operating on the DOM tree can be substantially
influenced by the amount of reflows and style recalculations which it
triggers. Style recalculations might be triggered by asking for the value of
a computed style of an element. Likewise reflow operations might be necessary
when asking for pixel positions or dimensions of an element, e.g. by reading 
`element.offsetWidth`. Ideally, these kind of operations are avoided entirely,
however in some situations that might not be possible. Inside of toolkit there
are several widgets which need to measure dimensions when rendering, for instance
the `toolkit.Fader` element, which needs to measure the size of the fader handle,
in order to position the scale and background correctly. In order to reduce the
performance impact of reflows and style recalculations 

On the other hand, the operations which might trigger reflows and style
recalculations do so only if the DOM tree has been previously modified. If the DOM
tree is *clean*, these operations are relatively cheap. Therefore the obvious
way to improve the performance of code which triggers many reflows is to reorder
operations on the DOM in such a way as to reduce reflows to a minimum. It is rather
straightforward to apply this technique to individual pieces of code, however that
might not be sufficient when different parts of an application modify the DOM
in parallel. If each of these pieces of code is optimized to trigger just **one** reflow,
the whole application will still trigger as many reflows as the number of individual
pieces of code. In other words, reducing the number of reflows locally does not scale.
This performance problem might not be a serious one in simple application or web sites.
However, in complex applications which might consist of 1000s of widgets it can seriously
degrade performance.

Consider this rather artificial example:

    function autosize(node) {
        // might trigger reflow
        var size = Math.min(node.parentNode.innerWidth,
                            node.parentNode.innerHeight);

        // invalidates the DOM
        node.style.width = size + "px";
        node.style.height = size + "px";
    }

    function autosize_all(nodes) {
        for (var i = i; i < nodes.length; i++)
            autosize(nodes[i]);
    }

In the above example `autosize()` will measure the size of the parent of `node` and
resize `node` such that it fills its parent while staying quadratic. When called on
several nodes it will force a reflow once for each node. The number of reflows can be
reduced to one by doing all the measurements before resizing all the nodes.

    function measure(node) {
        return Math.min(node.parentNode.innerWidth,
                        node.parentNode.innerHeight);
    }

    function resize(node, size) {
        node.style.width = size + "px";
        node.style.height = size + "px";
    }

    function autosize_all(nodes) {
        var sizes = [];

        for (var i = i; i < nodes.length; i++)
            sizes[i] = measure(nodes[i]);

        for (var i = i; i < nodes.length; i++)
            resize(nodes[i], sizes[i]);
    }

Unfortunately most real world situations are considerably more complex than this example
and therefore this problem can not be solved by reordering DOM manipulations manually.

**DOM scheduling** is a technique which addresses this problem in a way which
can be practically implemented inside of complex applications. A requirement
for it to work is that the individual modifications are independent of each
other. As explained in the beginning of this document, this is the case for
toolkit widgets. The central component of DOM scheduling is the scheduler. It
is a simple global object which executes a series of functions in a certain order.
The order of execution is determined by a priority. Without going into the details of
the implementation we can illustrate this by our example:

    var S = new DOMScheduler();

    function autosize(node) {
        // might trigger reflow
        var size = Math.min(node.parentNode.innerWidth,
                            node.parentNode.innerHeight);


        // run the following with priority 1
        S.add(function() {
            // invalidates the DOM
            node.style.width = size + "px";
            node.style.height = size + "px";
        }, 1);
    }

    function autosize_all(nodes) {
        for (var i = i; i < nodes.length; i++)
            S.add(autosize.bind(window, nodes[i]), 0);

        S.run();
    }

A similar thing happens inside of toolkit. Different `redraw()` methods
in widgets are added for the next scheduler run if their options have
been modified. The DOMScheduler eventually runs during the next animation
frame. The individual `redraw()` methods will schedule certain parts of the
DOM manipulation to be run at different priorities. This guarantees that
operations of different widgets which would trigger a reflow are run at the
same time.

Note that the above code can be more elegantly implemented using ECMAScript 6 Generators,
which makes the necessary code modifications even less invasive.

## Resizing

The Root widget registers for window resize events. If a resize event occurs,
the resize() method will be scheduled for the next animation frame. The resize
method will recursively be called on all widgets in the tree, which are
currently visible. For invisible widgets the resize method will be postponed
until they become visible again.
