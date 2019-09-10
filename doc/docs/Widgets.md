# Widgets inside the DOM

This document describes briefly how toolkit widgets can be used inside of a HTML layout.

Widgets are organized in a tree. This tree will usually be similar to the DOM
tree, where each widget consists of at least one DOM element. There may be
several disconnected widget trees at the same time. The root of a widget tree
should always be a widget which is a subclass of Root. The Root widget takes
care of tracking resize events and (possibly) document visibility changes.

By default all Widgets are represented by DOM Elements with `display: inline-block`.
When layouting an interface they can therefore be absolutely positioned inside 
a container.
Alternatively, they can also simply be floating, which makes it easier to build grid-like layouts
which reorganize themselves depending on window size.

However, utilizing CSS features like grid and flexbox is recommended.

All widgets can be given a size using CSS alone. 
This makes it possible to build fully responsive layouts by using CSS only.
Some widgets need to redraw parts of themselves when they are resized.
The Root widgets therefore fires a `resize` event on the full widget tree.
In cases where the size of widgets is purely determined by CSS, this is sufficient.
If however, parts of the layout require dynamic resizing using Javascript, there are simple
techniques that need to be used.

The simplest case is when a widget should be resized using javascript whenever the window size changes.
There are certain situations in which purely relying on CSS is not enough.
In that case, the way to do that is to register for the `resize` even on the widget to be resized
and set the appropriate style attributes when the resize event occurs.

For example:

    chart.add_event('resize', function() {
        var width, height;
        /* calculate new size */

        this.set_style('width', width);
        this.set_style('height', height);
    });

This way the widget itself (and all its children) will be able to correctly determine their new size
and redraw themselves if necessary.

In the more general case when widgets are resized dynamically in the absense of window resize events,
it is necessary to call the `resize()` method on that part of the widget tree, which is affected by
the size change.

For example:

    function shrink_chart() {
        chart.set_style('width', 400);
        chart.set_style('height', 200);

        chart.resize();
    }

    function grow_chart() {
        chart.set_style('width', 400);
        chart.set_style('height', 400);

        chart.resize();
    }
