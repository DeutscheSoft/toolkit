 /* toolkit provides different widgets, implements and modules for 
 * building audio based applications in webbrowsers.
 * 
 * Invented 2013 by Markus Schmidt <schmidt@boomshop.net>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General
 * Public License along with this program; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, 
 * Boston, MA  02110-1301  USA
 */
"use strict";
(function(w) {
var merge = function(dst) {
    //console.log("merging", src, "into", dst);
    var key, i, src;
    for (i = 1; i < arguments.length; i++) {
        src = arguments[i];
        for (key in src) {
            dst[key] = src[key];
        }
    }
    return dst;
};
var mixin = function(dst, src) {
    var fun, key;
    for (key in src) if (!dst[key]) {
        if (key === "constructor" ||
            key === "_class" ||
            key === "Extends" ||
            key === "Implements" ||
            key === "options") continue;
        if (!src.hasOwnProperty(key)) continue;

        fun = src[key];

        dst[key] = fun;
    }

    return dst;
};
w.$mixin = merge;
w.$class = function(o) {
    var constructor;
    var methods;
    var tmp, i, c, key;

    if (tmp = o.Extends) {
        if (typeof(tmp) == "function") {
            tmp = tmp.prototype;
        }
        if (typeof(o.options) == "object" &&
            typeof(tmp.options) == "object") {
            o.options = Object.assign(Object.create(tmp.options), o.options);
        }
        methods = Object.assign(Object.create(tmp), o);
    } else {
        methods = o;
    }

    // mixins
    if (tmp = o.Implements) {
        if (!(typeof(tmp) == "object" && tmp instanceof Array)) {
            tmp = [ tmp ];
        }

        for (i = 0; i < tmp.length; i++) {
            if (typeof(tmp[i]) == "function") {
                c = tmp[i].prototype;
            } else c = tmp[i];

            if (typeof(c.options) == "object") {
                if (!methods.hasOwnProperty("options")) {
                    methods.options = Object.create(methods.options || null);
                }
                methods.options = merge({}, c.options, methods.options);
            }

            methods = mixin(methods, c, true);
        }
    }

    var init = methods.initialize;
    var post_init = methods.initialized;

    if (post_init) {
        constructor = function() {
            init.apply(this, arguments);
            post_init.call(this);
        };
    } else constructor = init || (function() {});

    constructor.prototype = methods;
    methods.constructor = constructor;
    return constructor;
};
var __native_events = {
    // mouse
    mouseenter : true,
    mouseleave : true,
    mousewheel : true,
    mousedown  : true,
    mouseup    : true,
    mousemove  : true,
    mouseover  : true,

    click      : true,
    dblclick   : true,

    startdrag  : true,
    stopdrag   : true,
    drag       : true,
    dragenter  : true,
    dragleave  : true,
    dragover   : true,
    drop       : true,
    dragend    : true,

    // tourch
    touchstart : true,
    touchend   : true,
    touchmove  : true,
    touchenter : true,
    touchleave : true,
    touchcancel: true,

    keydown    : true,
    keypress   : true,
    keyup      : true,
    scroll     : true,
    focus      : true,
    blur       : true,
    DOMMouseScroll : true,

    submit     : true,
};
var __event_replacements = {
    pointerdown: [
        { event: "mousedown", prevent: false, stop: false },
        { event: "touchstart", prevent: true, stop: false }
    ],
    pointerup: [
        { event: "mouseup", prevent: false, stop: false },
        { event: "touchend", prevent: true, stop: false }
    ]
}
function remove_native_events(element, events) {
    var type;
    for (type in events) if (events.hasOwnProperty(type) && __native_events.hasOwnProperty(type))
        element.removeEventListener(type, events[type].callback);
}
function add_native_events(element, events) {
    var type;
    for (type in events) if (events.hasOwnProperty(type) && __native_events.hasOwnProperty(type))
        element.addEventListener(type, events[type].callback);
}
w.BASE = $class({
    /* @class: BASE
     * @description: This is the base class for all widgets in toolkit.
     * It provides an API for event handling and other basic implementations.
     */
    initialize : function() {
        if (!this.___events) {
            this.__events = {};
            this.__event_target = false;
        }
        this.__event_target = null;
    },
    destroy : function() {
        /* @method: destroy()
         * @description: Destroys all event handlers and the options object
         */
        if (this.__event_target) {
            remove_native_events(this.__event_target, this.__events);
        }

        this.__events = null;
        this.__event_target = null;
        this.options = null;
    },
    set_options : function(o) {
        /* @method: set_options(options)
         * @parameter: options; Object; { }; An object containing initial options
         * @description: merges a new options object into the existing one
         * including deep copies of objects. If an option key begins with
         * the string "on" it is considered as event handler. In this case
         * the value should be the handler function for the event with
         * the corresponding name without the first "on" characters.
         */
        var opt = this.options;
        var key, a, b;
        if (typeof(o) != "object") {
            delete this.options;
            o = {};
        } else if (typeof(opt) == "object") for (key in o) if (o.hasOwnProperty(key)) {
            a = o[key];
            b = opt[key];
            if (typeof a == "object" && a &&
                Object.getPrototypeOf(Object.getPrototypeOf(a)) === null &&
                typeof b == "object" && b &&
                Object.getPrototypeOf(Object.getPrototypeOf(b)) === null
                ) {
                o[key] = $mixin({}, b, a);
            }
        }
        if (this.hasOwnProperty("options") && typeof(opt) == "object") {
            this.options = $mixin(opt, o);
        } else {
            this.options = Object.assign(Object.create(opt), o);
        }
        for (key in this.options) if (key.indexOf("on") == 0) {
            this.add_event(key.substr(2).toLowerCase(), this.options[key]);
            delete this.options[key];
        }
    },
    delegate_events: function (element) {
        /* @method: delegate_events(element)
         * @parameter: element; HTMLElement; undefined; The element all native events should be bound to
         * @returns: HTMLElement; The element */
        var ev = this.__events;
        var old_target = this.__event_target;
        this.fire_event("delegated", element);

        if (old_target) remove_native_events(old_target, ev);
        if (element) add_native_events(element, ev);

        this.__event_target = element;

        return element;
    },
    add_event: function (event, func, prevent, stop) {
        /* @method: add_event(event, func, prevent, stop)
         * @parameter: event; String; undefined; The event descriptor
         * @parameter: func; Function; undefined; The function to call when the event happens
         * @parameter: prevent; Bool; undefined; Set to true if the event should prevent the default behavior
         * @parameter: stop; Bool; undefined; Set to true if the event should stop bubbling up the tree */
        var ev;
        var cb;

        if (typeof event !== "string")
            throw new TypeError("Expected string.");

        if (typeof func !== "function")
            throw new TypeError("Expected function.");

        // add an event listener to a widget. These can be native DOM
        // events if the widget has a delegated element and the widgets
        // native events.
        if (__event_replacements.hasOwnProperty(event)) {
            // it's a native event which needs one or more replacement
            // events like pointerdown -> mousedown/touchstart as
            // stated in the list below
            ev = __event_replacements[event];
            for (var i = 0; i < ev.length; i++)
                this.add_event(ev[i].event, func, ev[i].prevent, ev[i].stop);
            return;
        }
        ev = this.__events;
        if (!ev.hasOwnProperty(event)) {
            if (__native_events[event]) {
                // seems it's a DOM event and there's no callback bound
                // to this event by now
                //
                // we create a callback even if we have no DOM element currently
                // the necessary callbacks will be bound on delegate_events()
                cb = function (evnt) {
                    /* just in case fire_event throws an exception,
                     * we make sure to do the preventDefault, etc first
                     */
                    if (stop) evnt.stopPropagation();
                    if (prevent) evnt.preventDefault();

                    this.fire_event(event, evnt);

                    if (prevent) return false;
                }.bind(this)
                if (this.__event_target)
                    this.__event_target.addEventListener(event, cb);
            }
            // add to the internal __events list
            ev[event] = { callback: cb, queue: [] };
        }
        ev[event].queue.push(func);
    },
    remove_event: function (event, func) {
        /* @method: remove_event(event, func)
         * @parameter: event; String; undefined; The event descriptor
         * @parameter: func; Function; undefined; The function to remove
         * @description: Removes the given function from the event queue.
         * If it is a native DOM event, it removes the DOM event listener
         * as well. */
        if (__event_replacements.hasOwnProperty(event)) {
            // it is an event which has one or more replacement events
            // so remove all those replacements
            var ev = __event_replacements[event];
            for (var i = 0; i < ev.length; i++)
                this.remove_event(ev[i].event, func);
            return;
        }
        // handle resize events globally since there's no resize event
        // for DOM elements
        if (event == "resize") {
            TK.remove_resize_event(this);
            return;
        }
        ev = this.__events;
        if (ev.hasOwnProperty(event)) {
            for (var j = ev[event].queue.length - 1; j >= 0; j--) {
                // loop over the callback list of the event
                if (ev[event].queue[j] === func)
                    // remove the callback
                    ev[event].queue.splice(j, 1);
            }
            if (!ev[event].queue.length) {
                // no callbacks left
                if (__native_events[event]
                && this.__event_target
                && ev[event].callback)
                    // remove native DOM event listener from __event_target
                    this.__event_target.removeEventListener(event, ev[event].callback);
                // delete event from the list
                delete ev[event];
            }
        }
    },
    fire_event: function (event) {
        /* @method: fire_event(event)
         * @parameter: event; String; undefined; The event descriptor
         * @description: Calls all functions in the events queue */
        var ev = this.__events;

        if (!ev.hasOwnProperty(event)) return;

        ev = ev[event].queue;

        if (!ev.length) return;

        var args = new Array(arguments.length-1);

        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i+1];
        }
        for (var i = 0; i < ev.length; i++) {
            try {
                ev[i].apply(this, args);
            } catch (e) {
                console.log("event handler", ev[i], "threw", e);
            }
        }
    },

    has_event_listeners: function (event) {
        /* @method: has_event_listeners(event)
         * @parameter: event; String; undefined; The event desriptor
         * @returns: Bool; True if the event has some handler functions in the queue, false if not
         * @description: Test if the event descriptor has some handler functions in the queue */
        var ev = this.__events;

        if (!ev.hasOwnProperty(event)) return false;

        ev = ev[event].queue;

        if (!ev.length) return false;
        return true;
    },
    add_events: function (events, func) {
        /* @method: add_events(events, func)
         * @parameter: events; Object | Array; undefined; Object with event descriptors as keys and functions as values or Array of event descriptors. The latter requires a handler function as the second argument.
         * @parameter: func; Function; undefined; A function to add as event handler if the first argument is an array of event desriptors
         * @description: Add multiple event handlers at once, either as dedicated event handlers or a list of event descriptors with a single handler function */
        var i;
        if (events instanceof Array) {
            for (i = 0; i < events.length; i++)
                this.add_event(events[i], func);
        } else {
            for (i in events) 
                if (events.hasOwnProperty(i))
                    this.add_event(i, events[i]);
        }
    },
    remove_events: function (events, func) {
        /* @method: remove_events(events, func)
         * @parameter: events; Object | Array; undefined; Object with event descriptors as keys and functions as values or Array of event descriptors. The latter requires the handler function as the second argument.
         * @parameter: func; Function; undefined; A function to remove from event handler queue if the first argument is an array of event desriptors
         * @description: Remove multiple event handlers at once, either as dedicated event handlers or a list of event descriptors with a single handler function */
        var i;
        if (events instanceof Array) {
            for (i = 0; i < events.length; i++)
                this.remove_event(events[i], func);
        } else {
            for (i in events)
                if (events.hasOwnProperty(i))
                    this.remove_event(i, events[i]);
        }
    },
    fire_events: function (events) {
        /* @method: fire_events(events)
         * @parameter: events; Array; undefined; A list of event descriptors to fire
         * @description: Calls the event handler functions of multiple events */
        for (var i in events) {
            if (events.hasOwnProperty(i))
                this.fire_event(i, events[i]);
        }
    }
});
})(this);
