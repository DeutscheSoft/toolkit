 /* toolkit. provides different widgets, implements and modules for 
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

(function() {

var __native_events = {
    mouseenter : true,
    mouseleave : true,
    mousewheel : true,
    click      : true,
    mousedown  : true,
    mouseup    : true,
    mousemove  : true,
    startdrag  : true,
    stopdrag   : true,
    touchstart : true,
    touchend   : true,
    touchmove  : true,
    dblclick   : true,
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
BASE = $class({
    // Events provide an API for adding, removing and firing events.
    initialize : function() {
        if (!this.___events) {
            this.__events = {};
            this.__event_target = false;
        }
    },
    setOptions : function(o) {
        var opt = this.options;
        var key, a, b;
        if (typeof(o) != "object") {
            delete this.optios;
            o = {};
        } else if (typeof(opt) == "object") for (key in o) if (o.hasOwnProperty(key)) {
            a = o[key];
            b = opt[key];
            if (typeof(a) == "object" &&
                Object.getPrototypeOf(Object.getPrototypeOf(a)) === null &&
                typeof(b) == "object" &&
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
        this.__event_target = element;
        this.fire_event("delegated", [element, this]);
        return element;
    },
    add_event: function (e, fun, prevent, stop) {
        // add an event listener to a widget. These can be native DOM
        // events if the widget has a delegated element and the widgets
        // native events.
        if (__event_replacements.hasOwnProperty(e)) {
            // it's a native event which needs one or more replacement
            // events like pointerdown -> mousedown/touchstart as
            // stated in the list below
            var ev = __event_replacements[e];
            for (var i = 0; i < ev.length; i++)
                this.add_event(ev[i].event, fun, ev[i].prevent, ev[i].stop);
            return;
        }
        cb = null;
        ev = this.__events;
        if (this.__event_target
        && __native_events[e]
        && !ev.hasOwnProperty(e)) {
            // seems it's a DOM event and we have a delegation and
            // there's no callback bound to this event by now, so add
            // a "real" event listener to the delegated DOM element
            var p = prevent;
            var s = stop;
            cb = function (event) {
                this.fire_event("" + e, [event]);
                if (s) event.stopPropagation();
                if (p) {
                    event.preventDefault();
                    return false;
                }
            }.bind(this)
            this.__event_target.addEventListener(e, cb);
        }
        if (!ev.hasOwnProperty(e))
            // add to the internal __events list
            ev[e] = { callback: cb, queue: [] };
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
        var ev;
        // fire all bound callbacks on a event. If the event isn't
        // specified, nothing will happen at all.
        if (__event_replacements.hasOwnProperty(e)) {
            // it is an event which has one or more replacement events
            // so fire all those replacements
            ev = __event_replacements[e];
            for (var i = 0; i < ev.length; i++)
                this.fire_event(ev[i].event, args);
            return;
        }
        ev = this.__events;
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

})();
