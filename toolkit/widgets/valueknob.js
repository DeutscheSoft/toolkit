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
w.ValueKnob = $class({
    _class: "ValueKnob",
    Extends: Knob,
    options: {
        value_format: function (val) { return val.toFixed(2); },
        value_size: 5
    },
    initialize: function (options) {
        var con = options.container;
        this._container = TK.element("div", "toolkit-valueknob");
        if (con)
            con.appendChild(this._container);
        options.container = this._container;
        Knob.prototype.initialize.call(this, options);
        this.value = new Value({
            container: this._container,
            value: this.options.value,
            format: this.options.value_format,
            set: function (val) {
                this.set("value", parseFloat(val));
                return this.options.value;
            }.bind(this)
        });
        this.value.add_event("valueclicked", this._value_clicked.bind(this));
        this.value.add_event("valuedone", this._value_done.bind(this));
        this.widgetize(this._container, true, true, true);
    },
    
    destroy: function () {
        this.value.destroy();
        Knob.prototype.destroy.call(this);
    },
    
    _value_clicked: function () {
        this.scroll.set("active", false);
        this.drag.set("active", false);
    },
    _value_done: function () {
        this.scroll.set("active", true);
        this.drag.set("active", true);
        this.fire_event("valueset", [this.options.value, this]);
    },
    
    set: function (key, value, hold) {
        Knob.prototype.set.call(this, key, value, hold);
        switch (key) {
            case "value_size":
                this.value.set("size", value);
                break;
            case "value":
                this.options.value = this.snap_value(Math.min(this.options.max,
                                     Math.max(this.options.min, value)));
                if (value > this.options.max || value < this.options.min)
                    this.warning(this.element);
                this.fire_event("valuechanged", [this.options.value, this]);
                this.value.set("value", this.options.value);
                return;
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
