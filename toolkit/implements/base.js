/*
 * This file is part of toolkit.
 *
 * toolkit is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * toolkit is distributed in the hope that it will be useful,
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
function dispatch_events(handlers, args) {
    for (var i = 0; i < handlers.length; i++) {
        try {
            handlers[i].apply(this, args);
        } catch (e) {
            TK.warn("event handler", handlers[i], "threw", e);
        }
    }
}
w.$class = function(o) {
    var constructor;
    var methods;
    var tmp, i, c, key;

    if (tmp = o.Extends) {
        if (typeof(tmp) === "function") {
            tmp = tmp.prototype;
        }
        if (typeof(o.options) === "object" &&
            typeof(tmp.options) === "object") {
            o.options = Object.assign(Object.create(tmp.options), o.options);
        }
        methods = Object.assign(Object.create(tmp), o);
    } else {
        methods = o;
    }

    // mixins
    if (tmp = o.Implements) {
        if (!Array.isArray(tmp)) {
            tmp = [ tmp ];
        }

        for (i = 0; i < tmp.length; i++) {
            if (typeof(tmp[i]) === "function") {
                c = tmp[i].prototype;
            } else c = tmp[i];

            if (typeof(c.options) === "object") {
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
    contextmenu: true,
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
/**
 * This is the base class for all widgets in toolkit.
 * It provides an API for event handling and other basic implementations.
 *
 * @class TK.Base
 */
TK.Base = w.BASE = $class({
    initialize : function(options) {
        this.__events = {};
        this.__event_target = null;
        this.set_options(options);
    },
    initialized : function() {
        /**
         * Is fired when an instance is initialized.
         * 
         * @event TK.Base#initialized
         */
        this.fire_event("initialized");
    },
    /**
     * Destroys all event handlers and the options object.
     *
     * @method TK.Base#destroy
     */
    destroy : function() {
        if (this.__event_target) {
            remove_native_events(this.__event_target, this.__events);
        }

        this.__events = null;
        this.__event_target = null;
        this.options = null;
    },
    /**
     * Merges a new options object into the existing one
     * including deep copies of objects. If an option key begins with
     * the string "on" it is considered as event handler. In this case
     * the value should be the handler function for the event with
     * the corresponding name without the first "on" characters.
     *
     * @method TK.Base#set_options(options)
     * 
     * @param {Object} [options={ }] - An object containing initial options.
     */
    set_options : function(o) {
        var opt = this.options;
        var key, a, b;
        if (typeof(o) !== "object") {
            delete this.options;
            o = {};
        } else if (typeof(opt) === "object") for (key in o) if (o.hasOwnProperty(key)) {
            a = o[key];
            b = opt[key];
            if (typeof a === "object" && a &&
                Object.getPrototypeOf(Object.getPrototypeOf(a)) === null &&
                typeof b === "object" && b &&
                Object.getPrototypeOf(Object.getPrototypeOf(b)) === null
                ) {
                o[key] = merge({}, b, a);
            }
        }
        if (this.hasOwnProperty("options") && typeof(opt) === "object") {
            this.options = merge(opt, o);
        } else {
            this.options = Object.assign(Object.create(opt), o);
        }
        for (key in this.options) if (key.startsWith("on")) {
            this.add_event(key.substr(2).toLowerCase(), this.options[key]);
            delete this.options[key];
        }
    },
    /**
     * Get the value of an option.
     *
     * @method TK.Base#get
     * 
     * @param {string} key - The option name.
     */
    get: function (key) {
        return this.options[key];
    },
    /**
     * Sets an option. Fires both the events <code>set</code> with arguments <code>key</code>
     * and <code>value</code>; and the event <code>'set_'+key</code> with arguments <code>value</code>
     * and <code>key</code>.
     *
     * @method TK.Base#set
     * 
     * @param {string} key - The name of the option.
     * @param {mixed} value - The value of the option.
     * 
     * @emits TK.Base#set
     * @emits TK.Base#set_[option]
     */
    set: function (key, value) {
        this.options[key] = value;
        /**
         * Is fired when an option is set.
         * 
         * @event TK.Base#set
         * 
         * @param {string} name - The name of the option.
         * @param {mixed} value - The value of the option.
         */
        if (this.__events.set)
            this.fire_event("set", key, value);
        /**
         * Is fired when an option is set.
         * 
         * @event TK.Base#set_[option]
         * 
         * @param {mixed} value - The value of the option.
         */
        if (this.__events["set_" + key])
            this.fire_event("set_" + key, value, key);
        return value;
    },
    /**
     * Delegates all occuring DOM events of a specific DOM node to the widget.
     * This way the widget fires e.g. a click event if someone clicks on the
     * given DOM node.
     * 
     * @method TK.Base#delegate_events
     * 
     * @param {HTMLElement} element - The element all native events of the widget should be bound to.
     * 
     * @returns {HTMLElement} The element
     * 
     * @emits TK.Base#delegated
     */
    delegate_events: function (element) {
        var ev = this.__events;
        var old_target = this.__event_target;
        /**
         * Is fired when an element is delegated.
         * 
         * @event TK.Base#delegated
         * 
         * @param {HTMLElement} element - The element which receives all native DOM events.
         */
        this.fire_event("delegated", element);

        if (old_target) remove_native_events(old_target, ev);
        if (element) add_native_events(element, ev);

        this.__event_target = element;

        return element;
    },
    /**
     * Register an event handler.
     *
     * @method TK.Base#add_event
     * 
     * @param {string} event - The event descriptor.
     * @param {Function} func - The function to call when the event happens.
     * @param {boolean} prevent - Set to true if the event should prevent the default behavior.
     * @param {boolean} stop - Set to true if the event should stop bubbling up the tree.
     */
    add_event: function (event, func, prevent, stop) {
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
    /**
     * Removes the given function from the event queue.
     * If it is a native DOM event, it removes the DOM event listener
     * as well.
     *
     * @method TK.Base#remove_event
     * 
     * @param {string} event - The event descriptor.
     * @param {Function} func - The function to remove.
     */
    remove_event: function (event, func) {
        var ev;
        if (__event_replacements.hasOwnProperty(event)) {
            // it is an event which has one or more replacement events
            // so remove all those replacements
            ev = __event_replacements[event];
            for (var i = 0; i < ev.length; i++)
                this.remove_event(ev[i].event, func);
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
    /**
     * Fires an event.
     *
     * @method TK.Base#fire_event
     * 
     * @param {string} event - The event descriptor.
     * @param {...*} args - Event arguments.
     */
    fire_event: function (event) {
        var ev = this.__events;

        if (!ev.hasOwnProperty(event)) return;

        ev = ev[event].queue;

        if (!ev.length) return;

        var args = new Array(arguments.length-1);

        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i+1];
        }

        dispatch_events.call(this, ev, args);
    },
    /**
     * Test if the event descriptor has some handler functions in the queue.
     *
     * @method TK.Base#has_event_listeners
     * 
     * @param {string} event - The event desriptor.
     * 
     * @returns {boolean} True if the event has some handler functions in the queue, false if not.
     */
    has_event_listeners: function (event) {
        var ev = this.__events;

        if (!ev.hasOwnProperty(event)) return false;

        ev = ev[event].queue;

        if (!ev.length) return false;
        return true;
    },
    /**
     * Add multiple event handlers at once, either as dedicated event handlers or a list of event
     * descriptors with a single handler function.
     *
     * @method TK.Base#add_events
     * 
     * @param {Object | Array} events - Object with event descriptors as keys and functions as
     *   values or Array of event descriptors. The latter requires a handler function as the
     *   second argument.
     * @param {Function} func - A function to add as event handler if the first argument is an
     *   array of event desriptors
     */
    add_events: function (events, func) {
        var i;
        if (Array.isArray(events)) {
            for (i = 0; i < events.length; i++)
                this.add_event(events[i], func);
        } else {
            for (i in events) 
                if (events.hasOwnProperty(i))
                    this.add_event(i, events[i]);
        }
    },
    /**
     * Remove multiple event handlers at once, either as dedicated event handlers or a list of
     * event descriptors with a single handler function.
     *
     * @method TK.Base#remove_events
     * 
     * @param {Object | Array} events - Object with event descriptors as keys and functions as
     *   values or Array of event descriptors. The latter requires the handler function as the
     *   second argument.
     * @param {Function} func - A function to remove from event handler queue if the first
     *   argument is an array of event desriptors.
     */
    remove_events: function (events, func) {
        var i;
        if (Array.isArray(events)) {
            for (i = 0; i < events.length; i++)
                this.remove_event(events[i], func);
        } else {
            for (i in events)
                if (events.hasOwnProperty(i))
                    this.remove_event(i, events[i]);
        }
    },
    /**
     * Fires several events.
     *
     * @method TK.Base#fire_events
     * 
     * @param {Array.<string>} events - A list of event names to fire.
     */
    fire_events: function (events) {
        for (var i in events) {
            if (events.hasOwnProperty(i))
                this.fire_event(i, events[i]);
        }
    }
});
})(this);
