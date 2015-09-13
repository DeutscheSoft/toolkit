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
var mixin = function(dst, src, warn) {
    var fun, key;
    for (key in src) if (!dst[key]) {
        if (key === "constructor" ||
            key === "_class" ||
            key === "Extends" ||
            key === "Implements" ||
            key === "options") continue;
        if (!src.hasOwnProperty(key)) continue;

        fun = src[key];

        if (warn && typeof(fun) == "object") {
            //console.log("static variable", key, ":", fun);
        }
        if (warn && dst.hasOwnProperty(key)) {
            //console.log("overwriting", key, "in", dst, "with", fun);
        }
        dst[key] = fun;
    }

    return dst;
};
if (typeof(Object.setPrototypeOf) != "function") {
    Object.setPrototypeOf = function(o, proto) {
        o.__proto__= proto;
        return o;
    };
}
w.$mixin = merge;
w.$class = function(o) {
    var constructor;
    var methods;
    var tmp, i, c, key;

    constructor = o.initialize || (function() {});

    if (tmp = o.Extends) {
        if (typeof(tmp) == "function") {
            tmp = tmp.prototype;
        }
        if (typeof(o.options) == "object" &&
            typeof(tmp.options) == "object") {
            o.options = Object.setPrototypeOf(o.options, tmp.options);
        }
        methods = Object.setPrototypeOf(o, tmp);
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
    DOMMouseScroll : true
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
};
w.BASE = $class({
    // Events provide an API for adding, removing and firing events.
    initialize : function() {
        if (!this.___events) {
            this.__events = {};
            this.__event_target = false;
        }
        this.__event_target = null;
    },
    destroy : function() {
        this.__events = null;
        this.__event_target = null;
        this.options = null;
    },
    set_options : function(o) {
        var opt = this.options;
        var key, a, b;
        if (typeof(o) != "object") {
            delete this.options;
            o = {};
        } else if (typeof(opt) == "object") for (key in o) if (o.hasOwnProperty(key)) {
            a = o[key];
            b = opt[key];
            if (typeof a == "object" &&
                Object.getPrototypeOf(Object.getPrototypeOf(a)) === null &&
                typeof b == "object" &&
                Object.getPrototypeOf(Object.getPrototypeOf(b)) === null
                ) {
                o[key] = $mixin({}, b, a);
            }
        }
        if (this.hasOwnProperty("options") && typeof(opt) == "object") {
            this.options = $mixin(opt, o);
        } else {
            this.options = Object.setPrototypeOf(o, opt);
        }
        for (key in this.options) if (key.indexOf("on") == 0) {
            this.add_event(key.substr(2).toLowerCase(), this.options[key]);
        }
    },
    delegate_events: function (element) {
        // hand over a DOM element all native events will be bound to
        var ev = this.__events;
        var old_target = this.__event_target;
        this.fire_event("delegated", [element, this]);

        for (var e in ev) if (ev.hasOwnProperty(e) && __native_events[e]) {
            if (element) element.addEventListener(e, ev[e].callback);
            if (old_target) old_target.removeEventListener(e, ev[e].callback);
        }

        this.__event_target = element;

        return element;
    },
    add_event: function (e, fun, prevent, stop) {
        var ev;
        var cb;
        // add an event listener to a widget. These can be native DOM
        // events if the widget has a delegated element and the widgets
        // native events.
        if (__event_replacements.hasOwnProperty(e)) {
            // it's a native event which needs one or more replacement
            // events like pointerdown -> mousedown/touchstart as
            // stated in the list below
            ev = __event_replacements[e];
            for (var i = 0; i < ev.length; i++)
                this.add_event(ev[i].event, fun, ev[i].prevent, ev[i].stop);
            return;
        }
        // handle resize events globally since there's no resize event
        // for DOM elements
        if (e == "resize") {
            TK.add_resize_event(this);
            return;
        }
        ev = this.__events;
        if (!ev.hasOwnProperty(e)) {
            if (__native_events[e]) {
                // seems it's a DOM event and there's no callback bound
                // to this event by now
                //
                // we create a callback even if we have no DOM element currently
                // the necessary callbacks will be bound on delegate_events()
                cb = function (event) {
                    /* just in case fire_event throws an exception,
                     * we make sure to do the preventDefault, etc first
                     */
                    if (stop) event.stopPropagation();
                    if (prevent) event.preventDefault();

                    this.fire_event("" + e, [event]);

                    if (prevent) return false;
                }.bind(this)
                if (this.__event_target)
                    this.__event_target.addEventListener(e, cb);
            }
            // add to the internal __events list
            ev[e] = { callback: cb, queue: [] };
        }
        ev[e].queue.push(fun);
    },
    remove_event: function (e, fun) {
        // remove an event from the list. If it is a native DOM event,
        // remove the DOM event listener as well.
        if (__event_replacements.hasOwnProperty(e)) {
            // it is an event which has one or more replacement events
            // so remove all those replacements
            var ev = __event_replacements[e];
            for (var i = 0; i < ev.length; i++)
                this.remove_event(ev[i].event, fun);
            return;
        }
        // handle resize events globally since there's no resize event
        // for DOM elements
        if (event == "resize") {
            TK.remove_resize_event(this);
            return;
        }
        ev = this.__events;
        if (ev.hasOwnProperty(e)) {
            for (var j = ev[e].queue.length - 1; j >= 0; j--) {
                // loop over the callback list of the event
                if (ev[e].queue[j] === fun)
                    // remove the callback
                    ev[e].queue.splice(j, 1);
            }
            if (!ev[e].queue.length) {
                // no callbacks left
                if (__native_events[e]
                && this.__event_target
                && ev[e].callback)
                    // remove native DOM event listener from __event_target
                    this.__event_target.removeEventListener(e, ev[e].callback);
                // delete event from the list
                delete ev[e];
            }
        }
    },
    fire_event: function (e, args) {
        var ev = this.__events;
        if (!ev.hasOwnProperty(e))
            // unknown event, return.
            return;
        if (!(args instanceof Array))
            // we need an array containing all arguments
            args = Array(args);
        args.push(this);
        ev = ev[e].queue;
        for (var i = 0; i < ev.length; i++)
            // run callbacks in a loop
            ev[i].apply(this, args);
    },
    add_events: function (events, fun) {
        var i;
        if (events instanceof Array) {
            for (i = 0; i < events.length; i++)
                this.add_event(events[i], fun);
        } else {
            for (i in events) 
                if (events.hasOwnProperty(i))
                    this.add_event(i, events[i]);
        }
    },
    remove_events: function (events, fun) {
        var i;
        if (events instanceof Array) {
            for (i = 0; i < events.length; i++)
                this.remove_event(events[i], fun);
        } else {
            for (i in events)
                if (events.hasOwnProperty(i))
                    this.remove_event(i, events[i]);
        }
    },
    fire_events: function (events) {
        for (var i in events) {
            if (events.hasOwnProperty(i))
                this.fire_event(i, events[i]);
        }
    }
});
})(this);
