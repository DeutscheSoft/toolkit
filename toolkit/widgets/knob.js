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
var format_viewbox = TK.FORMAT("0 0 %d %d");
function dblclick() {
    this.set("value", this.options.reset);
    this.fire_event("doubleclick", this.options.value);
    this.fire_event("useraction", "value", this.options.value);
}
w.TK.Knob = w.Knob = $class({
    /* @class: Knob
     * @description: Knob is a Circular injected into a SVG and extended by ScrollValue
     * and DragValue to set its value. Knob uses DragValue and Scrollvalue
     * for setting its value.
     */
    _class: "Knob",
    Extends: Widget,
    _options: Object.assign(Object.create(Widget.prototype._options), TK.Circular.prototype._options,
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
    }),
    options: Object.assign({}, TK.Circular.prototype.options, {
        size: 100,
        hand: {width: 2, length: 6, margin: 22},
        margin: 13,
        thickness: 5,
        step: 1,
        shift_up: 4,
        shift_down: 0.25,
        dot: {margin: 13, length: 5, width: 2},
        marker: {margin: 13, thickness: 5},
        label: {margin: 10, align: _TOOLKIT_OUTER, format: function(val){return val;}},
        direction: _TOOLKIT_POLAR,
        rotation:       45,
        blind_angle:    20
    }),
    initialize: function (options) {
        Widget.prototype.initialize.call(this, options);
        var svg = TK.make_svg("svg", {"class": "toolkit-knob"});

        var co = TK.object_and(this.options, TK.Circular.prototype._options);
        co = TK.object_sub(co, TK.Widget.prototype._options);
        co.container = svg;

        this.circular = new Circular(co);

        this.element = this.widgetize(svg, true, true, true);
        
        this.drag = new DragValue({
            element: this.element,
            range:   function () { return this.circular; }.bind(this),
            get:     function () { return this.options.value; }.bind(this),
            set:     function (v) {
                this.set("value", v);
                this.fire_event("useraction", "value", v);
            }.bind(this),
            direction: this.options.direction,
            rotation: this.options.rotation,
            blind_angle: this.options.blind_angle,
            events: function () { return this }.bind(this),
        });
        this.scroll = new ScrollValue({
            element: this.element,
            range:   function () { return this.circular; }.bind(this),
            get:     function () { return this.options.value; }.bind(this),
            set:     function (v) {
                this.set("value", v);
                this.fire_event("useraction", "value", v);
            }.bind(this),
            events: function () { return this }.bind(this),
        });
        
        if (typeof this.options.reset == "undefined")
            this.options.reset = this.options.value;
        this.add_event("dblclick", dblclick);
        this.add_child(this.circular);
    },
    
    destroy: function () {
        this.drag.destroy();
        this.scroll.destroy();
        this.circular.destroy();
        Widget.prototype.destroy.call(this);
    },

    redraw: function() {
        var I = this.invalid;
        var O = this.options;

        if (I.size) {
            I.size = false;
            this.element.setAttribute("viewBox", format_viewbox(O.size, O.size));
        }

        Widget.prototype.redraw.call(this);
    },

    set: function(key, value) {
        // Circular does the snapping
        if (!TK.Widget.prototype._options[key]) {
            if (TK.Circular.prototype._options[key])
                value = this.circular.set(key, value);
            if (TK.DragValue.prototype._options[key])
                this.drag.set(key, value);
        }
        return Widget.prototype.set.call(this, key, value);
    },
});
})(this);
