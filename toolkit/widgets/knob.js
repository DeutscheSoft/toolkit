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
 
/**
 * The <code>useraction</code> event is emitted when a widget gets modified by user interaction.
 * The event is emitted for the option <code>value</code>.
 *
 * @event TK.Knob#useraction
 * @param {string} name - The name of the option which was changed due to the users action
 * @param {mixed} value - The new value of the option
 */
     
"use strict";
(function(w){ 
var format_viewbox = TK.FORMAT("0 0 %d %d");
function dblclick() {
    this.set("value", this.options.reset);
    /**
     * Is fired when the fader receives a double click in order to reset to initial value.
     * @event TK.Fader#doubleclick
     */
    this.fire_event("doubleclick", this.options.value);
    this.fire_event("useraction", "value", this.options.value);
}
/**
 * TK.Knob is a {@link TK.Circular} inside of an SVG and which can be
 * modified both by dragging and scrolling.
 * TK.Knob uses {@link TK.DragValue} and {@link TK.ScrollValue}
 * for setting its value.
 * It inherits all options of {@link TK.Circular} and {@link TK.DragValue}.
 *
 * @class TK.Knob
 * @extends TK.Widget
 *
 * @param {Object} options
 */
w.TK.Knob = w.Knob = $class({
    _class: "Knob",
    Extends: TK.Widget,
    _options: Object.assign(Object.create(TK.Widget.prototype._options), TK.Circular.prototype._options,
                            TK.DragValue.prototype._options, {
        size: "number",
        hand: "object",
        margin: "number",
        thickness: "number",
        step: "number",
        shift_up: "number",
        shift_down: "number",
        dot: "object",
        marker: "object",
        label: "object",
        direction: "int",
        rotation: "number",
        blind_angle: "number",
        reset: "number",
    }),
    options: Object.assign({}, TK.Circular.prototype.options, {
        size: 100,
        hand: {width: 1, length: 12, margin: 24},
        margin: 13,
        thickness: 6,
        step: 1,
        shift_up: 4,
        shift_down: 0.25,
        dot: {length: 6, margin: 13, width: 2},
        marker: {thickness: 6, margin: 13},
        label: {margin: 10, align: "outer", format: function(val){return val;}},
        direction: "polar",
        rotation:       45,
        blind_angle:    20
    }),
    initialize: function (options) {
        TK.Widget.prototype.initialize.call(this, options);
        var E, S;
        if (!(E = this.element)) this.element = E = TK.element("div")
        TK.add_class(E, "toolkit-knob");

        /**
         * @member {SVGImage} svg - The main SVG image.
         */
        this.svg = S = TK.make_svg("svg");
        
        var co = TK.object_and(this.options, TK.Circular.prototype._options);
        co = TK.object_sub(co, TK.Widget.prototype._options);
        co.container = S;

        /**
         * @member {TK.Circular} circular - The {@link TK.Circular} module.
         */
        this.circular = new TK.Circular(co);

        this.widgetize(E, true, true, true);
        
        /**
         * @member {TK.DragValue} TK.Fader#drag - Instance of {@link TK.DragValue} used for the
         * interaction.
         */
        this.drag = new TK.DragValue({
            node:    S,
            range:   function () { return this.circular; }.bind(this),
            get:     function () { return this.options.value; }.bind(this),
            set:     function (v) {
                v = this.set("value", v);
                this.fire_event("useraction", "value", v);
            }.bind(this),
            direction: this.options.direction,
            rotation: this.options.rotation,
            blind_angle: this.options.blind_angle,
            events: function () { return this }.bind(this),
        });
        /**
         * @member {TK.ScrollValue} TK.Fader#scroll - Instance of {@link TK.ScrollValue} used for the
         * interaction.
         */
        this.scroll = new TK.ScrollValue({
            node:    S,
            range:   function () { return this.circular; }.bind(this),
            get:     function () { return this.options.value; }.bind(this),
            set:     function (v) {
                v = this.set("value", v);
                this.fire_event("useraction", "value", v);
            }.bind(this),
            events: function () { return this }.bind(this),
        });

        E.appendChild(S);
        this.set("base", this.options.base);
        if (this.options.reset === void(0))
            this.options.reset = this.options.value;
        this.add_event("dblclick", dblclick);
        this.add_child(this.circular);
    },
    
    destroy: function () {
        this.drag.destroy();
        this.scroll.destroy();
        this.circular.destroy();
        TK.Widget.prototype.destroy.call(this);
    },

    redraw: function() {
        var I = this.invalid;
        var O = this.options;

        if (I.size) {
            I.size = false;
            this.svg.setAttribute("viewBox", format_viewbox(O.size, O.size));
        }

        TK.Widget.prototype.redraw.call(this);
    },
    /**
     * This is an alias for {@link TK.Circular#add_label} of the internal
     * circular instance.
     *
     * @method TK.Knob#add_label
     */
    add_label: function(x) {
        return this.circular.add_label(x);
    },

    /**
     * This is an alias for {@link TK.Circular#remove_label} of the internal
     * circular instance.
     *
     * @method TK.Knob#remove_label
     */
    remove_label: function(x) {
        this.circular.remove_label(x);
    },

    set: function(key, value) {
        if (key === "base") {
            if (value === false) value = this.options.min;
        }
        // TK.Circular does the snapping
        if (!TK.Widget.prototype._options[key]) {
            if (TK.Circular.prototype._options[key])
                value = this.circular.set(key, value);
            if (TK.DragValue.prototype._options[key])
                this.drag.set(key, value);
        }
        return TK.Widget.prototype.set.call(this, key, value);
    },
});
})(this);
