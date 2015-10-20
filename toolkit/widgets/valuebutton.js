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
function value_clicked() {
    this.scroll.set("active", false);
    this.drag.set("active", false);
}
function value_done() {
    this.scroll.set("active", true);
    this.drag.set("active", true);
    this.fire_event("valueset", this.options.value);
}
    
w.ValueButton = $class({
    _class: "ValueButton",
    Extends: Button,
    Implements: [Warning, Ranged],
    options:  {
        value: 0,
        value_format:   function (val) { return val.toFixed(2); },
        value_size:     5,
        bar_direction:  _TOOLKIT_HORIZONTAL,
        drag_direction: _TOOLKIT_POLAR,
        rotation:       45,
        blind_angle:    20,
        snap:           0.01
    },
    initialize: function (options) {
        Button.prototype.initialize.call(this, options);
        
        TK.add_class(this.element, "toolkit-valuebutton");
        
        this._bar     = TK.element("div","toolkit-bar");
        this._base    = TK.element("div","toolkit-base");
        this._over    = TK.element("div","toolkit-over");

        this._bar.appendChild(this._base);
        this._bar.appendChild(this._over);
        
        this.value = new Value({
            container: this.element,
            value: this.options.value,
            format: this.options.value_format,
            set: function (val) {
                    val = parseFloat(val);
                    this.set("value", val);
                    this.fire_event("useraction", "value", val);
                    return this.options.value; }.bind(this)
        });
        this.value.add_event("valueclicked", value_clicked.bind(this));
        this.value.add_event("valuedone", value_done.bind(this));
        
        this._input = this.value._input;
        
        this.element.appendChild(this._bar);
        
        this.drag = new DragValue({
            element:   this.element,
            range:     function () { return this; }.bind(this),
            get:       function () { return this.options.value; }.bind(this),
            set:       function (v) {
                this.set("value", v);
                this.fire_event("useraction", "value", v);
            }.bind(this),
            direction: this.options.drag_direction,
            rotation: this.options.rotation,
            blind_angle: this.options.blind_angle,
            events: function () { return this }.bind(this)
        });
        this.scroll = new ScrollValue({
            element: this.element,
            range:   function () { return this }.bind(this),
            get:     function () { return this.options.value; }.bind(this),
            set:     function (v) {
                this.set("value", v);
            }.bind(this),
            events: function () { return this }.bind(this)
        });
        
        if (typeof this.options.reset == "undefined")
            this.options.reset = this.options.value;
        this.element.addEventListener("dblclick", function () {
            this.set("value", this.options.reset);
            this.fire_event("doubleclick", this.options.value);
        }.bind(this));
        
        this._input.addEventListener("dblclick", function (e) {
            e.stopPropagation();
        });
    },

    initialized: function() {
        Button.prototype.initialized.call(this);
        Ranged.prototype.initialized.call(this);
    },
    
    redraw: function () {
        Button.prototype.redraw.call(this);
        var I = this.invalid;
        var O = this.options;

        if (I.bar_direction) {
            I.bar_direction = false;
            switch (O.bar_direction) {
                case _TOOLKIT_HORIZONTAL:
                default:
                    TK.remove_class(this.element, "toolkit-vertical");
                    TK.add_class(this.element, "toolkit-horizontal");
                    break;
                case _TOOLKIT_VERTICAL:
                    TK.remove_class(this.element, "toolkit-horizontal");
                    TK.add_class(this.element, "toolkit-vertical");
                    break;
            }
        }
        if (I.value) {
            I.value = false;
            this._base.style[O.bar_direction == _TOOLKIT_HORIZONTAL ? "width" : "height"] = this.val2perc(this.snap(O.value)) + "%";
        }
    },
    
    destroy: function () {
        this.drag.destroy();
        this.scroll.destroy();
        this.value.destroy();
        this._over.remove();
        this._base.remove();
        this._bar.remove();
        Button.prototype.destroy.call(this);
    },
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        if (key === "value") {
            if (value > this.options.max || value < this.options.min)
                this.warning(this.element);
            value = this.snap(value);
        }
        Button.prototype.set.call(this, key, value, hold);
        Ranged.prototype.set.call(this, key, value);
        switch (key) {
            case "value":
                this.value.set("value", value);
                this.fire_event("valuechanged", value);
                break;
            case "value_format":
                this.value.set("format", value);
                break;
            case "value_size":
                this.value.set("size", value);
                break;
            case "drag_direction":
                this.drag.set("direction", value);
                break;
            case "rotation":
                this.drag.set("rotation", value);
                break;
            case "blind_angle":
                this.drag.set("blind_angle", value);
                break;
        }
    }
});
})(this);
