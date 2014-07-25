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
 
Widget = $class({
    // Widget is the base class for all widgets drawing DOM elements. It
    // provides basic functionality like delegating events, setting options and
    // firing some events.Widget implements AudioMath, Options and Events.
    Extends : BASE,
    _class: "Widget",
    options: {
        // these options are of less use and only here to show what we need
        container: false, // A DOM element as container to inject the element
                          // into
        id:        "",    // a id toset on the element. If omitted a random
                          // string is generated.
        "class":   "",    // A CSS class to add to the main element
        styles:    {},    // If an element was stylized, styles can be applied
        disabled:  false  // Widgets can be disabled by setting this to true
    },
    Implements: [AudioMath],
    initialize: function (options) {
        BASE.prototype.initialize.call(this);
        // Main actions every widget needs to take
        this.fire_event("initialize", this);
        this.setOptions(options);
        if (!this.options.id)
            this.options.id = String.uniqueID();
        return this;
    },
    initialized: function () {
        // Main actions every widget needs to take
        this.fire_event("initialized", this);
        return this;
    },
    redraw: function () {
        this.fire_event("redraw", this);
        return this;
    },
    destroy: function () {
        this.fire_event("destroy", this);
        return this;
    },
    delegate: function (element) {
        //element.addEvents({
            //"mouseenter" : function (e) {
                //this.fire_event("mouseenter", [e, this, element]); }.bind(this),
            //"mouseleave" : function (e) {
                //this.fire_event("mouseleave", [e, this, element]); }.bind(this),
            //"mousewheel"  : function (e) {
                //this.fire_event("mousewheel", [e, this, element]); }.bind(this),
            //"click"      : function (e) {
                //this.fire_event("click",      [e, this, element]); }.bind(this),
            //"mousedown"  : function (e) {
                //this.fire_event("mousedown",  [e, this, element]); }.bind(this),
            //"mouseup"    : function (e) {
                //this.fire_event("mouseup",    [e, this, element]); }.bind(this),
            //"mousemove"  : function (e) {
                //this.fire_event("mousemove",  [e, this, element]); }.bind(this),
            //"startdrag"  : function (e) {
                //this.fire_event("startdrag",  [e, this, element]); }.bind(this),
            //"stopdrag"  : function (e) {
                //this.fire_event("stopdrag",   [e, this, element]); }.bind(this),
            //"touchstart" : function (e) {
                //this.fire_event("touchstart", [e, this, element]); }.bind(this),
            //"touchend"   : function (e) {
                //this.fire_event("touchend",   [e, this, element]); }.bind(this),
            //"touchmove"  : function (e) {
                //this.fire_event("touchmove",  [e, this, element]); }.bind(this),
            //"dblclick"   : function (e) {
                //this.fire_event("dblclick",   [e, this, element]); }.bind(this),
            //"keydown"    : function (e) {
                //this.fire_event("keydown",    [e, this, element]); }.bind(this),
            //"keypress"   : function (e) {
                //this.fire_event("keypress",   [e, this, element]); }.bind(this),
            //"keyup"      : function (e) {
                //this.fire_event("keyup",      [e, this, element]); }.bind(this),
            //"scroll"     : function (e) {
                //this.fire_event("scroll",     [e, this, element]); }.bind(this),
            //"focus"      : function (e) {
                //this.fire_event("focus",      [e, this, element]); }.bind(this),
            //"blur"       : function (e) {
                //this.fire_event("blur",       [e, this, element]); }.bind(this)
        //});
        
        //var orig = element.addEvent.bind(element);
        //element.addEvent = function(name, cb) {
            //if (native_events.hasOwnProperty(name)) {
                //orig(name, function(ev) {
                    //cb(ev, self, element);
                //});
            //} else orig(name, cb);
        //};
        this.delegate_events(element);
        this.__delegated = element;
        this.fire_event("delegated", [element, this]);
        return element;
    },
    classify: function (element) {
        // Takes a DOM element and adds its CSS functionality to the
        // widget instance
        this.addClass    = function (c) { element.classList.add(c); }.bind(this);
        this.removeClass = function (c) { element.classList.remove(c); }.bind(this);
        this.setStyle    = function (c, d) { element.style[c] = d; }.bind(this);
        this.setStyles   = function (c) { for (var i in c) element.style[i] = c[i]; }.bind(this);
        this.getStyle    = function (c) { return element.getStyle(c); }.bind(this);
        this.__classified = element;
        this.fire_event("classified", [element, this]);
        return element;
    },
    stylize: function (element) {
        // Marks a DOM element as receiver for the "styles" options
        this.__stylized = element;
        this.set("styles", this.options.styles);
        this.fire_event("stylized", [element, this]);
        return element;
    },
    widgetize: function (element, delegate, classify, stylize) {
        // create a widget from a DOM element. Basically it means to add the id
        // from options and set a basic CSS class. If delegate is true, basic
        // events will be delegated from the element to the widget instance
        // if classify is true, CSS functions will be bound to the widget
        // instance
        element.classList.add("toolkit-widget");
        if (this.options.id)
            element.set("id", this.options.id);
        if (this.options["class"])
            element.classList.add(this.options["class"]);
        if (delegate)
            this.delegate(element);
        if (classify)
            this.classify(element);
        if (stylize)
            this.stylize(element);
        this.__widgetized = element;
        this.fire_event("widgetized", [element, this]);
        return element;
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
                    this.__classified.classList.add(this.options["class"]);
                break;
            case "styles":
                if (!hold && this.__stylized)
                    this.__stylized.setStyles(this.options.styles);
                break;
            case "active":
                if (!hold && this.__stylized)
                    if (value)
                        this.__stylized.classList.remove("toolkit-inactive")
                    else
                        this.__stylized.classList.add("toolkit-inactive")
            case "disabled":
                if (!hold && this.__stylized)
                    if (value)
                        this.__stylized.classList.add("toolkit-disabled")
                    else
                        this.__stylized.classList.remove("toolkit-disabled")
        }
        this.fire_event("set", [key, value, hold, this]);
        this.fire_event("set_" + key, [value, hold, this]);
        return this;
    },
    get: function (key) {
        this.fire_event("get", [key, this.options[key], this]);
        return this.options[key];
    }
});
