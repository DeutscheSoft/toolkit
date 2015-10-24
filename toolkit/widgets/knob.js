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
w.Knob = $class({
    // Knob is a Circular injected into a SVG and extended by ScrollValue
    // and DragValue to set its value. Knob uses DragValue and Scrollvalue
    // for setting its value.
    _class: "Knob",
    Extends: Circular,
    options: {
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
    },
    
    initialize: function (options) {
        BASE.prototype.initialize.call(this);
        var svg = TK.make_svg("svg", {"class": "toolkit-knob"});

        if (options.container)
            options.container.appendChild(svg);
        
        options.container = svg;

        Circular.prototype.initialize.call(this, options, true);
        this._svg = this.widgetize(svg, true, true, true);
        
        this.drag = new DragValue({
            element: this._svg,
            range:   function () { return this }.bind(this),
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
            element: this._svg,
            range:   function () { return this }.bind(this),
            get:     function () { return this.options.value; }.bind(this),
            set:     function (v) {
                this.set("value", v);
                this.fire_event("useraction", "value", v);
            }.bind(this),
            events: function () { return this }.bind(this),
        });
        
        if (typeof this.options.reset == "undefined")
            this.options.reset = this.options.value;
        this._svg.addEventListener("dblclick", function () {
            this.set("value", this.options.reset);
            this.fire_event("doubleclick", this.options.value);
        }.bind(this));
    },
    
    destroy: function () {
        this.drag.destroy();
        this.scroll.destroy();
        this._svg.remove();
        Circular.prototype.destroy.call(this);
    },

    redraw: function() {
        var I = this.invalid;
        var O = this.options;

        if (I.size) {
            this._svg.setAttribute("viewBox", format_viewbox(O.size, O.size));
        }

        Circular.prototype.redraw.call(this);

    },
    
    set: function (key, value) {
        Circular.prototype.set.call(this, key, value);
        switch (key) {
            case "direction":
            case "rotation":
            case "blind_angle":
                this.drag.set(key, value);
                break;
        }
    }
});
})(this);
