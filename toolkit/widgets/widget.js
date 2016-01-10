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
w.TK.Widget = w.Widget = $class({
    /* @class: Widget
     * @description: Widget is the base class for all widgets drawing DOM elements. It
     * provides basic functionality like delegating events, setting options and
     * firing some events.Widget implements AudioMath, Options and Events.
     */
    Extends : BASE,
    _class: "Widget",
    _options: {
        // A CSS class to add to the main element
        class: "string",
        // A DOM element as container to inject the element
        // into
        container: "object",
        // a id to set on the element. If omitted a random
        // string is generated.
        id: "string",
        // If an element was stylized, styles can be applied
        styles: "object",
        disabled: "boolean",
        element: "object",
        active: "boolean",
    },
    options: {
        // these options are of less use and only here to show what we need
        disabled:  false  // Widgets can be disabled by setting this to true
    },
    Implements: [AudioMath],
    initialize: function (options) {
        BASE.prototype.initialize.call(this);
        // Main actions every widget needs to take
        if (!options) options = {};
        this.fire_event("initialize");
        if (!options.id)
            options.id = TK.unique_id();
        if (options.element)
            this.element = options.element;
        this.set_options(options);
        this.__classified = null;
        this.__stylized = null;
        this.__delegated = null;
        this.__widgetized = null;
        this.invalid = Object.create(invalid_prototype);
        this.value_time = Object.create(null);
        this.needs_redraw = false;
        this._redraw = redraw.bind(this);
        this._drawn = false;
        this.parent = null;
        this.children = [];
    },

    invalidate_all: function() {
        for (var key in this.options) {
            if (!this._options[key]) {
                TK.warn("%O %s: Unknown option %s", this, this._class, key);
            }
            else this.invalid[key] = true;
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
            TK.log("found", warn.length, "invalid in", this, ":", warn);
        }
    },

    resize: function() {
        var C = this.children;
        this.fire_event("resize");
        for (var i = 0; i < C.length; i++) {
            C[i].resize();
        }
        if (this.has_event_listeners("resized")) {
            TK.S.after_frame(function() {
                this.fire_event("resized");
            }.bind(this));
        }
    },

    trigger_draw : function() {
        if (!this.needs_redraw) {
            this.needs_redraw = true;
            if (this._drawn) TK.S.add(this._redraw);
        }
    },

    trigger_draw_next : function() {
        if (!this.needs_redraw) {
            this.needs_redraw = true;
            if (this._drawn) TK.S.add_next(this._redraw);
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
                if (O.styles) TK.set_styles(E, O.styles);
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
        if (this.options.class && element)
            TK.add_class(element, this.options.class);
        this.fire_event("classified", element);
        return element;
    },
    set_style: function (name, value) {
        TK.set_style(this.__stylized, name, value);
    },
    /* @method: set_style(property, value)
     * Sets a CSS style property in this widgets DOM element.
     */
    set_styles: function (styles) {
        TK.set_styles(this.__stylized, styles);
    },
    /* @method: get_style(property)
     * Returns the computed style of this widgets DOM element.
     */
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
        /* @method: widgetize(element, delegate, classify, stylize)
         * Set the DOM elements of this widgets. This method is usually only used internally.
         * Basically it means to add the id from options and set a basic CSS class.
         * If delegate is true, basic events will be delegated from the element to the widget instance
         * if classify is true, CSS functions will be bound to the widget instance.
         */
        
        // classify?
        TK.add_class(element, "toolkit-widget");
        if (this.options.id)
            element.setAttribute("id", this.options.id);
        if (this.options["class"])
            TK.add_class(element, this.options["class"]);
        if (this.options.container)
            this.options.container.appendChild(element);
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
    /* @method: set(key, value)
     * Set an option.
     */
    set: function (key, value) {
        /* These options are special and need to be handled immediately, in order
         * to preserve correct ordering */
        if (key === "container") {
            if (value && this.element) {
                value.appendChild(this.element);
            }
        }
        if (key === "class" && this.__classified) {
            if (this.options.class) TK.remove_class(this.__classified, this.options.class);
            if (value) TK.add_class(this.__classified, value);
        }
        this.options[key] = value;
        this.value_time[key] = Date.now();
        if (this._options[key]) {
            this.invalid[key] = true;
            this.trigger_draw();
        } else {
            TK.warn("%O: %s.set(%s, %O): unknown option.", this, this._class, key, value);
        }
        if (this.has_event_listeners("set"))
            this.fire_event("set", key, value);
        if (this.has_event_listeners("set_"+key))
            this.fire_event("set_" + key, value);
        return value;
    },
    /* @method: get(key)
     * Get the value of an option.
     */
    get: function (key) {
        return this.options[key];
    },
    /* @method enable_draw()
     * Schedules this widget for drawing.
     */
    enable_draw: function () {
        if (this._drawn) return;
        this._drawn = true;
        if (this.needs_redraw) {
            TK.S.add(this._redraw);
        }
        this.fire_event("show");
        var C = this.children;
        for (var i = 0; i < C.length; i++) C[i].enable_draw();
    },
    /* @method enable_draw()
     * Stop drawing this widget.
     */
    disable_draw: function () {
        if (!this._drawn) return;
        this._drawn = false;
        if (this.needs_redraw) {
            TK.S.remove(this._redraw);
        }
        this.fire_event("hide");
        var C = this.children;
        for (var i = 0; i < C.length; i++) C[i].disable_draw();
    },
    /* @method: show()
     * Make the widget visible. This does not modify the DOM, instead it will only schedule
     * the widget for rendering.
     */
    show: function () {
        this.enable_draw();
    },
    /* @method: hide()
     * Make the widget hidden. This does not modify the DOM, instead it will stop rendering
     * this widget. Options changed after calling hide() will only be rendered (i.e. applied
     * to the DOM) when the widget is made visible again using show().
     */
    hide: function () {
        this.disable_draw();
    },
    /* @method: hidden()
     * Returns the current hidden status of the widget.
     */
    hidden: function() {
        return !this._drawn;
    },
    is_drawn: function() {
        return this._drawn;
    },
    /* @method: toggle_hidden()
     * Toggle the hidden status. This is equivalent to calling hide() or show(), depending on
     * the current hidden status of this widget.
     */
    toggle_hidden: function() {
        if (this.hidden()) this.show();
        else this.hide();
    },
    /* @method: add_child(child)
     * Registers a widget as a child widget. This method is used to build up the widget tree.
     */
    add_child: function(child) {
        var C = this.children;
        if (child.parent) child.parent.remove_child(child);
        child.parent = this;
        C.push(child);
        if (this.is_drawn()) {
            child.enable_draw();
        } else {
            child.disable_draw();
        }
    },
    /* @method: remove_child(child)
     * Removes a child widget.
     */
    remove_child : function(child) {
        var C = this.children;
        var i = C.indexOf(child);
        child.parent = null;
        if (i !== -1) {
            C.splice(i, 1);
        }
    },
    /* @method: remove_children(a)
     * Removes an array of children.
     */
    remove_children : function(a) {
        a.map(this.remove_child, this);
    },
    /* @method: add_children(a)
     * Registers an array of widgets as children.
     */
    add_children : function (a) {
        a.map(this.add_child, this);
    },

    /* @method: visible_children()
     * Returns an array of all visible children.
     */
    visible_children: function(a) {
        if (!a) a = [];
        var C = this.children;
        for (var i = 0; i < C.length; i++) {
            a.push(C[i]);
            C[i].visible_children(a);
        }
        return a;
    },

    /* @method: all_children()
     * Returns an array of all children.
     */
    all_children: function(a) {
        if (!a) a = [];
        var C = this.children;
        for (var i = 0; i < C.length; i++) {
            a.push(C[i]);
            C[i].all_children(a);
        }
        return a;
    },
});
w.TK.Widget.prototype.force_hide = w.TK.Widget.prototype.hide;
w.TK.Widget.prototype.force_show = w.TK.Widget.prototype.show;
})(this);
