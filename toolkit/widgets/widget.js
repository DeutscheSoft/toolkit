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

var invalid_prototype = {
    validate : function() {
        var i = 0, key;
        var ret = false;
        for (i = 0; i < arguments.length; i++) {
            key = arguments[i];
            if (this.hasOwnProperty(key) && this[key]) {
                this[key] = false;
                ret = true;
            }
        }

        return ret;
    },
    test : function() {
        var i = 0, key;
        for (i = 0; i < arguments.length; i++) {
            key = arguments[i];
            if (this.hasOwnProperty(key) && this[key]) {
                return true;
            }
        }
    }
};
function redraw() {
    this.needs_redraw = false;
    this.redraw();
}
w.Widget = $class({
    /* @class: Widget
     * @description: Widget is the base class for all widgets drawing DOM elements. It
     * provides basic functionality like delegating events, setting options and
     * firing some events.Widget implements AudioMath, Options and Events.
     */
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
        this.fire_event("initialize");
        this.set_options(options);
        if (!this.options.id)
            this.options.id = TK.unique_id();
        this.__classified = null;
        this.__stylized = null;
        this.__delegated = null;
        this.__widgetized = null;
        this.invalid = Object.create(invalid_prototype);
        this.value_time = Object.create(null);
        this.needs_redraw = false;
        this._redraw = redraw.bind(this);
        this.__hidden = true;
        this.parent = null;
        this.children = [];
    },

    invalidate_all: function() {
        for (var key in this.options) {
            this.invalid[key] = true;
        }
    },

    assert_none_invalid: function() {
        var warn = [];
        for (var key in this.invalid) {
            if (this.invalid[key]) {
                warn.push(key);
            }
        }

        if (warn.length) {
            console.log("found", warn.length, "invalid in", this, ":", warn);
        }
    },

    resize: function() {
        var C = this.children;
        this.fire_event("resize");
        this.invalid.resize = true;
        this.trigger_draw();
        for (var i = 0; i < C.length; i++) {
            C[i].resize();
        }
    },

    trigger_draw : function() {
        if (!this.needs_redraw) {
            this.needs_redraw = true;
            if (!this.__hidden) TK.S.add(this._redraw);
        }
    },

    trigger_draw_next : function() {
        if (!this.needs_redraw) {
            this.needs_redraw = true;
            if (!this.__hidden) TK.S.add_next(this._redraw);
        }
    },

    initialized: function () {
        // Main actions every widget needs to take
        this.fire_event("initialized");
        this.invalidate_all();
        this.trigger_draw();
    },
    redraw: function () {
        this.fire_event("redraw");
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
                if (O.container && E.parentNode !== O.container) O.container.appendChild(E);
            }
        }

        E = this.classified;

        if (E) {
            if (I["class"]) {
                I["class"] = false;
                TK.add_class(E, O["class"]);
            }
        }

        E = this.stylized;

        if (E) {
            if (I.active) {
                I.active = false;
                (O.active ? TK.remove_class : TK.add_class)(E, "toolkit-inactive");
            }

            if (I.disabled) {
                I.disabled = false;
                (O.disabled ? TK.add_class : TK.remove_class)(E, "toolkit-disabled");
            }

            if (I.styles) {
                I.styles = false;
                TK.set_styles(E, O.styles);
            }
        }

        if (I.resize) {
            I.resize = false;
            if (this.has_event_listeners("resized")) {
                TK.S.after_frame(function() {
                    this.fire_event("resized");
                }.bind(this));
            }
        }
    },
    destroy: function () {
        this.fire_event("destroy");
        if (this.needs_redraw) TK.S.remove(this._redraw);
        BASE.prototype.destroy.call(this);
        if (this.parent) this.parent.remove_child(this);
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
    set: function (key, value) {
        this.options[key] = value;
        this.value_time[key] = Date.now();
        this.invalid[key] = true;
        this.trigger_draw();
        this.fire_event("set", key, value);
        this.fire_event("set_" + key, value);
    },
    get: function (key) {
        return this.options[key];
    },
    _low_show: function () {
        if (this.__hidden) {
            this.__hidden = false;
            if (this.needs_redraw) {
                TK.S.add(this._redraw);
            }
            this.fire_event("show");
        }
    },
    show: function () {
        this._low_show();
        var C = this.children;
        for (var i = 0; i < C.length; i++) C[i].show();
    },
    _low_hide: function () {
        if (!this.__hidden) {
            this.__hidden = true;
            if (this.needs_redraw) {
                TK.S.remove(this._redraw);
            }
            this.fire_event("hide");
        }
    },
    hide: function () {
        this._low_hide();
        var C = this.children;
        for (var i = 0; i < C.length; i++) C[i].hide();
    },
    force_hide: function() {
        Widget.prototype.hide.call(this);
    },
    force_show: function() {
        Widget.prototype.show.call(this);
    },
    hidden: function() {
        return this.__hidden;
    },
    toggle_hidden: function() {
        if (this.hidden()) this.show();
        else this.hide();
    },
    add_child: function(child) {
        var C = this.children;
        if (child.parent) child.parent.remove_child(child);
        child.parent = this;
        C.push(child);
        if (this.hidden()) {
            child.force_hide();
        } else {
            child.show();
        }
    },
    remove_child : function(child) {
        var C = this.children;
        var i = C.indexOf(child);
        child.parent = null;
        if (i !== -1) {
            C.splice(i, 1);
        }
    },
    remove_children : function(a) {
        a.map(this.remove_child, this);
    },
    add_children : function (a) {
        a.map(this.add_child, this);
    },
});
})(this);
