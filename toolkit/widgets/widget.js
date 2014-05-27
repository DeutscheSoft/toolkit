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
 
Widget = new Class({
    // Widget is the base class for all widgets drawing DOM elements. It
    // provides basic functionality like delegating events, setting options and
    // firing some events.Widget implements AudioMath, Options and Events.
    _class: "Widget",
    __options__: {
        // these options are of less use and only here to show what we need
        container: false, // A DOM element as container to inject the element
                          // into
        id:        "",    // a id toset on the element. If omitted a random
                          // string is generated.
        "class":   "",    // A CSS class to add to the main element
        styles:    {},    // If an element was stylized, styles can be applied
        disabled:  false  // Widgets can be disabled by setting this to true
    },
    Implements: [AudioMath, Options, Events],
    initialize: function (options) {
        // Main actions every widget needs to take
        this.fireEvent("initialize", this);
        this.setOptions(Object.merge(this.__options__, options));
        if (!this.options.id)
            this.options.id = String.uniqueID();
        return this;
    },
    initialized: function () {
        // Main actions every widget needs to take
        this.fireEvent("initialized", this);
        return this;
    },
    redraw: function () {
        this.fireEvent("redraw", this);
        return this;
    },
    destroy: function () {
        this.fireEvent("destroy", this);
        return this;
    },
    delegate: function (element) {
        element.addEvents({
            "mouseenter" : function (e) {
                this.fireEvent("mouseenter", [e, this, element]); }.bind(this),
            "mouseleave" : function (e) {
                this.fireEvent("mouseleave", [e, this, element]); }.bind(this),
            "mousewheel"  : function (e) {
                this.fireEvent("mousewheel", [e, this, element]); }.bind(this),
            "click"      : function (e) {
                this.fireEvent("click",      [e, this, element]); }.bind(this),
            "mousedown"  : function (e) {
                this.fireEvent("mousedown",  [e, this, element]); }.bind(this),
            "mouseup"    : function (e) {
                this.fireEvent("mouseup",    [e, this, element]); }.bind(this),
            "mousemove"  : function (e) {
                this.fireEvent("mousemove",  [e, this, element]); }.bind(this),
            "startdrag"  : function (e) {
                this.fireEvent("startdrag",  [e, this, element]); }.bind(this),
            "stopdrag"  : function (e) {
                this.fireEvent("stopdrag",   [e, this, element]); }.bind(this),
            "touchstart" : function (e) {
                this.fireEvent("touchstart", [e, this, element]); }.bind(this),
            "touchend"   : function (e) {
                this.fireEvent("touchend",   [e, this, element]); }.bind(this),
            "touchmove"  : function (e) {
                this.fireEvent("touchmove",  [e, this, element]); }.bind(this),
            "dblclick"   : function (e) {
                this.fireEvent("dblclick",   [e, this, element]); }.bind(this),
            "keydown"    : function (e) {
                this.fireEvent("keydown",    [e, this, element]); }.bind(this),
            "keypress"   : function (e) {
                this.fireEvent("keypress",   [e, this, element]); }.bind(this),
            "keyup"      : function (e) {
                this.fireEvent("keyup",      [e, this, element]); }.bind(this),
            "scroll"     : function (e) {
                this.fireEvent("scroll",     [e, this, element]); }.bind(this),
            "focus"      : function (e) {
                this.fireEvent("focus",      [e, this, element]); }.bind(this),
            "blur"       : function (e) {
                this.fireEvent("blur",       [e, this, element]); }.bind(this)
        });
        
        //var orig = element.addEvent.bind(element);
        //element.addEvent = function(name, cb) {
            //if (native_events.hasOwnProperty(name)) {
                //orig(name, function(ev) {
                    //cb(ev, self, element);
                //});
            //} else orig(name, cb);
        //};
        this.__delegated = element;
        this.fireEvent("delegated", [element, this]);
        return element;
    },
    classify: function (element) {
        // Takes a DOM element and adds its CSS functionality to the
        // widget instance
        this.addClass    = function (c) { element.addClass(c); }.bind(this);
        this.removeClass = function (c) { element.removeClass(c); }.bind(this);
        this.setStyle    = function (c, d) { element.style[c] = d; }.bind(this);
        this.setStyles   = function (c) { for (var i in c) element.style[i] = c[i]; }.bind(this);
        this.getStyle    = function (c) { return element.getStyle(c); }.bind(this);
        this.__classified = element;
        this.fireEvent("classified", [element, this]);
        return element;
    },
    stylize: function (element) {
        // Marks a DOM element as receiver for the "styles" options
        this.__stylized = element;
        this.set("styles", this.options.styles);
        this.fireEvent("stylized", [element, this]);
        return element;
    },
    widgetize: function (element, delegate, classify, stylize) {
        // create a widget from a DOM element. Basically it means to add the id
        // from options and set a basic CSS class. If delegate is true, basic
        // events will be delegated from the element to the widget instance
        // if classify is true, CSS functions will be bound to the widget
        // instance
        element.addClass("toolkit-widget");
        if (this.options.id)
            element.set("id", this.options.id);
        if (this.options["class"])
            element.addClass(this.options["class"]);
        if (delegate)
            this.delegate(element);
        if (classify)
            this.classify(element);
        if (stylize)
            this.stylize(element);
        this.__widgetized = element;
        this.fireEvent("widgetized", [element, this]);
        return element;
    },
    
    // EVENTS
    add_event: function (e, fun, prevent, stop) {
        // add an event listener to a widget. These can be native DOM
        // events if the widget has a delegated element and the widgets
        // native events.
        if (this.__event_replacements.hasOwnProperty(e)) {
            // it's a native event which needs one or more replacement
            // events like pointerdown -> mousedown/touchstart as
            // stated in the list below
            for (var i = 0; i < this.__event_replacements[e].length; i++) {
                this.add_event(this.__event_replacements[e][i].event,
                               fun,
                               this.__event_replacements[e][i].prevent,
                               this.__event_replacements[e][i].stop);
            }
            return;
        }
        cb = null;
        ev = this.__events;
        if (this.__delegated
        && this.__native_events[e]
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
            this.__delegated.addEventListener(e, cb);
        }
        if (!ev.hasOwnProperty(e))
            // add to the internal __events list
            ev[e] = { callback: cb, queue: [] };
        ev[e].queue.push(fun);
    },
    remove_event: function (e, fun) {
        // remove an event from the list. If it is a native DOM event,
        // remove the DOM event listener as well.
        if (this.__event_replacements.hasOwnProperty(e)) {
            // it is an event which has one or more replacement events
            // so remove all those replacements
            for (var i = 0; i < this.__event_replacements[e].length; i++)
                this.remove_event(this.__event_replacements[e][i].event, fun);
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
                if (this.__native_events[e]
                && this.__delegated
                && ev[e].callback)
                    // remove native DOM event listener from __delegated
                    this.__delegated.removeEventListener(e, ev[e].callback);
                // delete event from the list
                delete ev[e];
            }
        }
    },
    fire_event: function (e, args) {
        // fire all bound callbacks on a event. If the event isn't
        // specified, nothing will happen at all.
        if (this.__event_replacements.hasOwnProperty(e)) {
            // it is an event which has one or more replacement events
            // so fire all those replacements
            for (var i = 0; i < this.__event_replacements[e].length; i++)
                this.fire_event(this.__event_replacements[e][i].event, args);
            return;
        }
        var ev = this.__events;
        if (!this.__events.hasOwnProperty(e))
            // unknown event, return.
            return;
        if (!(args instanceof Array))
            // we need an array containing all arguments
            args = Array(args);
        args.push(this);
        for (var i = 0; i < ev[e].queue.length; i++)
            // run callbacks in a loop
            ev[e].queue[i].apply(this, args);
    },
    __events: {},
    __native_events: {
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
        blur       : true
    },
    __event_replacements: {
        pointerdown: [
            { event: "mousedown", prevent: false, stop: false },
            { event: "touchstart", prevent: true, stop: false }
        ],
        pointerup: [
            { event: "mouseup", prevent: false, stop: false },
            { event: "touchend", prevent: true, stop: false }
        ]
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "container":
                if (!hold && this.element)
                    this.element.inject(this.options.container);
                break;
            case "id":
                if (!hold && this.element)
                    this.element.set("id", this.options.id);
                break;
            case "class":
                if (!hold && this.__classified)
                    this.__classified.addClass(this.options["class"]);
                break;
            case "styles":
                if (!hold && this.__stylized)
                    this.__stylized.setStyles(this.options.styles);
                break;
            case "active":
                if (!hold && this.__stylized)
                    if (value)
                        this.__stylized.removeClass("toolkit-inactive")
                    else
                        this.__stylized.addClass("toolkit-inactive")
            case "disabled":
                if (!hold && this.__stylized)
                    if (value)
                        this.__stylized.addClass("toolkit-disabled")
                    else
                        this.__stylized.removeClass("toolkit-disabled")
        }
        this.fireEvent("set", [key, value, hold, this]);
        this.fireEvent("set_" + key, [value, hold, this]);
        return this;
    },
    get: function (key) {
        this.fireEvent("get", [key, this.options[key], this]);
        return this.options[key];
    }
})
