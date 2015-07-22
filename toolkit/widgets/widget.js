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
    fire_event : function(type, a) {
        var c, i, args;

        BASE.prototype.fire_event.call(this, type, a);

        if (this.shared_events[type]) {
            c = this.children;
            if (a) args = [ this ].concat(a);
            else args = [ this ];
            for (i = 0; i < c.length; i++) {
                c[i].fire_event(type, args);
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
        this.fire_event("initialize", this);
        this.set_options(options);
        if (!this.options.id)
            this.options.id = String.uniqueID();
        if (this.resize)
            this.add_event("resize", this.resize)
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
        this.__events = null;
        BASE.prototype.destroy.call(this);
        return this;
    },
    delegate: function (element) {
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
        this.setStyles   = toolkit.set_styles.bind(toolkit, element);
        this.getStyle    = function (c) { return element.getStyle(c); }.bind(this);
        this.__classified = element;
        this.fire_event("classified", [element, this]);
        return element;
    },
    stylize: function (element) {
        // Marks a DOM element as receiver for the "styles" options
        this.__stylized = element;
        if (this.options.styles) {
            toolkit.set_styles(element, this.options.styles);
        }
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
                    this.options.container.appendChild(this.element);
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
                    toolkit.set_styles(this.__stylized, value);
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
