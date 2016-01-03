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
    this.knob.scroll.set("active", false);
    this.knob.drag.set("active", false);
}
function value_done() {
    this.knob.scroll.set("active", true);
    this.knob.drag.set("active", true);
    this.fire_event("valueset", this.options.value);
}
w.TK.ValueKnob = w.ValueKnob = $class({
    /* @class: ValueKnob
     */
    _class: "ValueKnob",
    Extends: Widget,
    _options: Object.assign(Object.create(Widget.prototype._options),
                            TK.Value.prototype._options, TK.Knob.prototype._options, {
        value_format: "function",
        value_size: "number",
    }),
    options: Object.assign({}, TK.Value.prototype.options, TK.Knob.prototype.options, {
        value_format: function (val) { return val.toFixed(2); },
        value_size: 5
    }),
    initialize: function (options) {
        this.element = TK.element("div", "toolkit-valueknob");

        Widget.prototype.initialize.call(this, options);

        var ko = TK.object_and(this.options, TK.Knob.prototype._options);
        ko = TK.object_sub(ko, TK.Widget.prototype._options);
        ko.container = this.element;

        this.knob = new Knob(ko);

        this.value = new Value({
            container: this.element,
            value: this.options.value,
            format: this.options.value_format,
            set: function (val) {
                return this.parent.set("value", parseFloat(val));
            },
        });
        this.value.add_event("valueclicked", value_clicked.bind(this));
        this.value.add_event("valuedone", value_done.bind(this));
        this.knob.add_event("useraction", function(key, value) {
            this.parent.set(key, value);
        });
        this.add_child(this.value);
        this.add_child(this.knob);
        this.widgetize(this.element, true, true, true);
    },
    
    destroy: function () {
        this.knob.destroy();
        this.value.destroy();
        Widget.prototype.destroy.call(this);
    },

    get: function (key) {
        if (key === "value_size")
            return this.value.get("size");
        return Widget.prototype.get.call(this, key);
    },
    set: function (key, value) {
        if (key === "value_size")
            value = this.value.set("size", value);
        else if (!TK.Widget.prototype._options[key]) {
            if (TK.Knob.prototype._options[key])
                value = this.knob.set(key, value);
            if (TK.Value.prototype._options[key])
                this.value.set(key, value);
        }
        return Widget.prototype.set.call(this, key, value);
    }
    
});
})(this);
