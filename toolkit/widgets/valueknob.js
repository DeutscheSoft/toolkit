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
w.TK.ValueKnob = w.ValueKnob = $class({
    /* @class: ValueKnob
     */
    _class: "ValueKnob",
    Extends: Widget,
    _options: Object.assign(Object.create(Widget.prototype._options), {
        value_format: "function",
        value_size: "number",
    }),
    options: {
        value_format: function (val) { return val.toFixed(2); },
        value_size: 5
    },
    initialize: function (options) {
        this.element = TK.element("div", "toolkit-valueknob");
        Widget.prototype.initialize.call(this, options);
        this.knob = new Knob(TK.merge({}, this.options, {
            container: this.element,
        }));
        this.knob.add_event("useraction", function(key, value) {
            if (key == "value") this.parent.set(key, value);
        });
        this.value = new Value({
            container: this.element,
            value: this.options.value,
            format: this.options.value_format,
            set: function (val) {
                this.set("value", parseFloat(val));
                return this.options.value;
            }.bind(this)
        });
        this.value.add_event("valueclicked", value_clicked.bind(this));
        this.value.add_event("valuedone", value_done.bind(this));
        this.add_child(this.value);
        this.add_child(this.knob);
        this.widgetize(this.element, true, true, true);
    },
    
    destroy: function () {
        this.value.destroy();
        Widget.prototype.destroy.call(this);
    },
    
    set: function (key, value) {
        Widget.prototype.set.call(this, key, value);
        /* TODO: this is too much... */
        if (key !== "container")
            this.knob.set(key, value);
        switch (key) {
            case "value_size":
                this.value.set("size", value);
                break;
            case "value":
                this.value.set("value", value);
                this.circular.set(key, value);
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
            case "value":
            case "size":
            case "thickness":
            case "margin":
            case "hand":
            case "start":
            case "basis":
            case "base":
            case "show_base":
            case "show_value":
            case "show_hand":
            case "x":
            case "y":
            case "dot":
            case "dots":
            case "marker":
            case "markers":
            case "label":
            case "labels":
            case "scale":
            case "reverse":
            case "min":
            case "max":
            case "step":
            case "shift_up":
            case "shift_down":
            case "snap":
            case "round":
            case "log_factor":
                this.circular.set(key, value);
                break;
        }
        
    }
    
});
})(this);
