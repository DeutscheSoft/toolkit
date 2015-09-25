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
(function(w){ 
w.Widget = $class({
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
    register_children : function(a) {
        if (!(a instanceof Array)) {
            this.children.push(a);
        } else {
            this.children = this.children.concat(a);
        }
    },
    unregister_children : function() {
    },
    share_event : function(type) {
        this.shared_events[type] = true;
        var a, i;
        a = this.children;

        for (i = 0; i < a.length; i++) {
            a[i].share_event(type);
        }
    },
    unshare_event : function(type) {
        this.shared_events[type] = false;

        for (i = 0; i < a.length; i++) {
            a[i].unshare_event(type);
        }
    },
    fire_event : function(type) {
        var c, i;

        BASE.prototype.fire_event.apply(this, arguments);

        if (this.shared_events[type]) {
            c = this.children;
            if (a) args = [ this ].concat(a);
            else args = [ this ];
            for (i = 0; i < c.length; i++) {
                c[i].fire_event.apply(c[i], arguments);
            }
        }
    },
    shared_events : { "resize" : true },
    initialize: function (options) {
        BASE.prototype.initialize.call(this);
        this.children = [];
        if (this.shared_events) {
            this.shared_events = Object.create(this.shared_events);
        }
        // Main actions every widget needs to take
        this.fire_event("initialize");
        this.set_options(options);
        if (!this.options.id)
            this.options.id = TK.unique_id();
        if (this.resize)
            this.add_event("resize", this.resize)
        this.__classified = null;
        this.__stylized = null;
        this.__delegated = null;
        this.__widgetized = null;
        this.invalid = Object.create(null);
        this.value_time = Object.create(null);
        this.will_draw = false;
        this._redraw = this.redraw.bind(this);
        return this;
    },

    invalidate_all: function() {
        for (var key in this.options) {
            this.invalid[key] = true;
        }
    },
    
    trigger_draw : function() {
        if (!this.will_draw) {
            this.will_draw = true;
            TK.S.enqueue(this._redraw);
        }
    },

    initialized: function () {
        // Main actions every widget needs to take
        this.fire_event("initialized");
        this.invalidate_all();
        this.trigger_draw();
        return this;
    },
    redraw: function () {
        this.fire_event("redraw");
        this.will_draw = false;
        var I = this.invalid;
        var O = this.options;
        var E = this.element;

        if (E) {
            if (I.id) {
                I.id = false;
                E.setAttribute("id", O.id);
            }

            if (I.container) {
                I.container = false;
                if (O.container) O.container.appendChild(E);
            }
        }

    },
    destroy: function () {
        this.fire_event("destroy");
        this.__events = null;
        if (this.will_draw) TK.S.dequeue(this._redraw);
        BASE.prototype.destroy.call(this);
        return this;
    },
    delegate: function (element) {
        this.delegate_events(element);
        this.__delegated = element;
        this.fire_event("delegated", element);
        return element;
    },
    add_class: function (cls) {
        TK.add_class(this.__classified, cls);
    },
    remove_class: function (cls) {
        TK.remove_class(this.__classified, cls);
    },
    has_class: function (cls) {
        return TK.has_class(this.__classified, cls);
    },
    classify: function (element) {
        // Takes a DOM element and adds its CSS functionality to the
        // widget instance
        this.__classified = element;
        this.fire_event("classified", element);
        return element;
    },
    set_style: function (name, value) {
        TK.set_style(this.__stylized, name, value);
    },
    set_styles: function (styles) {
        TK.set_styles(this.__stylized, styles);
    },
    get_style: function (name) {
        return TK.get_style(this.__stylized, name);
    },
    stylize: function (element) {
        // Marks a DOM element as receiver for the "styles" options
        this.__stylized = element;
        if (this.options.styles) {
            TK.set_styles(element, this.options.styles);
        }
        this.fire_event("stylized", element);
        return element;
    },
    widgetize: function (element, delegate, classify, stylize) {
        // create a widget from a DOM element. Basically it means to add the id
        // from options and set a basic CSS class. If delegate is true, basic
        // events will be delegated from the element to the widget instance
        // if classify is true, CSS functions will be bound to the widget
        // instance
        TK.add_class(element, "toolkit-widget");
        if (this.options.id)
            element.setAttribute("id", this.options.id);
        if (this.options["class"])
            TK.add_class(element, this.options["class"]);
        if (delegate)
            this.delegate(element);
        if (classify)
            this.classify(element);
        if (stylize)
            this.stylize(element);
        this.__widgetized = element;
        this.fire_event("widgetized", element);
        return element;
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        this.value_time[key] = Date.now();
        this.invalid[key] = true;
        this.trigger_draw();
        switch (key) {
            case "container":
                if (!hold && this.element)
                    this.options.container.appendChild(this.element);
                break;
            case "id":
                if (!hold && this.element)
                    this.element.set("id", this.options.id);
                break;
            case "class":
                if (!hold && this.__classified)
                    TK.add_class(this.__classified, this.options["class"]);
                break;
            case "styles":
                if (!hold && this.__stylized)
                    TK.set_styles(this.__stylized, value);
                break;
            case "active":
                if (!hold && this.__stylized)
                    if (value)
                        TK.remove_class(this.__stylized, "toolkit-inactive")
                    else
                        TK.add_class(this.__stylized, "toolkit-inactive")
            case "disabled":
                if (!hold && this.__stylized)
                    if (value)
                        TK.add_class(this.__stylized, "toolkit-disabled")
                    else
                        TK.remove_class(this.__stylized, "toolkit-disabled")
        }
        this.fire_event("set", key, value, hold);
        this.fire_event("set_" + key, value, hold);
        return this;
    },
    get: function (key) {
        this.fire_event("get", key, this.options[key]);
        return this.options[key];
    }
});
})(this);
