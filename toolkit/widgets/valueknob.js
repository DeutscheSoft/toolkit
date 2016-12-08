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
 * @event TK.ValueKnob#useraction
 * 
 * @param {string} name - The name of the option which was changed due to the users action
 * @param {mixed} value - The new value of the option
 */
 
"use strict";
(function(w){
function value_clicked() {
    this.knob.scroll.set("active", false);
    this.knob.drag.set("active", false);
    /**
     * Is fired when the user starts editing the value manually.
     * 
     * @event TK.ValueButton#valueedit
     * 
     * @param {number} value - The value of the widget.
     */
    this.fire_event("valueedit", this.options.value);
}
function value_done() {
    this.knob.scroll.set("active", true);
    this.knob.drag.set("active", true);
    /**
     * Is fired when the user finished editing the value manually.
     * 
     * @event TK.ValueButton#valueset
     * 
     * @param {number} value - The value of the widget.
     */
    this.fire_event("valueset", this.options.value);
}
function create_label() {
    if (this.label) return;

    this.label = new TK.Label({
        label: this.options["label.label"],
        container: this.element
    });
    this.add_child(this.label);
}
function destroy_label() {
    if (!this.label) return;
    this.label.destroy();
    this.label = null;
}
function userset_cb(key, value) {
    /* We cancel all modifications in the child and transfer it to the parent (us) */
    this.parent.userset(key, value);
    return false;
}
w.TK.ValueKnob = w.ValueKnob = $class({
    /**
     * This widget combines a {@link TK.Knob}, a {@link TK.Label}  and a {@link TK.Value} whose
     * value is synchronized.
     *
     * @class TK.ValueKnob
     * 
     * @extends TK.Widget
     * 
     * @param {Object} options
     * 
     * @property {Function} [options.value_format=TK.FORMAT("%.2f")] - Callback to format the value.
     * @property {Number} [options.value_size=5] - Amount of digits for the value input.
     */
    _class: "ValueKnob",
    Extends: TK.Widget,
    _options: Object.assign(Object.create(TK.Widget.prototype._options),
                            TK.Value.prototype._options, TK.Knob.prototype._options, {
        value_format: "function",
        value_size: "number",
        value_set: "function",
        show_label: "boolean",
        "label.label": "string"
    }),
    options: Object.assign({}, TK.Value.prototype.options, TK.Knob.prototype.options, {
        value_format: TK.FORMAT("%.2f"),
        value_size: 5,
        value_set: TK.FORMAT("%.2f"),
        show_label: false
    }),
    static_events: {
        set_show_label: function(value) {
            if (value) create_label.call(this);
        },
        "set_label.label": function(value) {
            this.label.set("label", value);
        },
        set_value_format: function(value) {
            this.value.set("format", value);
        },
        set_value_size: function(value) {
            this.value.set("size", value);
        },
        set_value_set: function(value) {
            this.value.set("set", value);
        },
    },
    initialize: function (options) {
        TK.Widget.prototype.initialize.call(this, options);
        var E;
        /**
         * @member {HTMLDivElement} TK.ValueKnob#element - The main DIV container.
         *   Has class <code>toolkit-valueknob</code>.
         */
        if (!(E = this.element)) this.element = E = TK.element("div");
        TK.add_class(E, "toolkit-valueknob");

        var ko = TK.object_and(this.options, TK.Knob.prototype._options);
        ko = TK.object_sub(ko, TK.Widget.prototype._options);
        ko.container = E;

        /**
         * @member {TK.Knob} TK.ValueKnob#knob - The TK.Knob widget.
         */
        this.knob = new TK.Knob(ko);
        
        /**
         * @member {TK.Value} TK.ValueKnob#value - The TK.Value widget.
         */
        var O = this.options;
        this.value = new TK.Value({
            container: E,
            value: this.options.value,
            format: this.options.value_format,
            set: function (val) {
                val = this.parent.options.value_set(val);
                return parseFloat(val);
            },
        });
        this.value.add_event("valueclicked", value_clicked.bind(this));
        this.value.add_event("valuedone", value_done.bind(this));
        this.value.add_event("userset", userset_cb);
        this.knob.add_event("userset", userset_cb);
        /**
         * @member {TK.Label} TK.ValueKnob#label - The TK.Label widget.
         */
        this.label = null;
        
        this.add_child(this.value);
        this.add_child(this.knob);
        this.set("show_label", this.options.show_label);
        this.widgetize(E, true, true, true);
    },
    
    destroy: function () {
        this.knob.destroy();
        this.value.destroy();
        TK.Widget.prototype.destroy.call(this);
        if (this.label) this.label.destroy();
    },

    redraw: function() {
        TK.Widget.prototype.redraw.call(this);
        var I = this.invalid;

        if (I.show_label) {
            I.show_label = false;
            if (!this.options.show_label) destroy_label.call(this);
        }
    },

    set: function (key, value) {
        if (!TK.Widget.prototype._options[key]) {
            if (TK.Knob.prototype._options[key] && this.knob)
                value = this.knob.set(key, value);
            if (TK.Value.prototype._options[key] && this.value)
                value = this.value.set(key, value);
        }
        return TK.Widget.prototype.set.call(this, key, value);
    }
    
});
})(this);
