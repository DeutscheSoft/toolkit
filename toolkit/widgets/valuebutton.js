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
 * @event TK.ValueButton#useraction
 * 
 * @param {string} name - The name of the option which was changed due to the users action
 * @param {mixed} value - The new value of the option
 */
 
"use strict";
(function(w){
function value_clicked() {
    this.scroll.set("active", false);
    this.drag.set("active", false);
    /**
     * Is fired when the user starts editing the value manually
     * 
     * @event TK.ValueButton#valueedit
     * 
     * @param {number} value - The value of the widget.
     */
    this.fire_event("valueedit", this.options.value);
}
function value_done() {
    this.scroll.set("active", true);
    this.drag.set("active", true);
    /**
     * Is fired when the user finished editing the value manually
     * 
     * @event TK.ValueButton#valueset
     * 
     * @param {number} value - The value of the widget.
     */
    this.fire_event("valueset", this.options.value);
}
function userset_cb(key, value) {
    /* We cancel all modifications in the child and transfer it to the parent (us) */
    this.parent.userset(key, value);
    return false;
}
w.TK.ValueButton = TK.class({
    /**
     * This widget combines a {@link TK.Button} and a {@link TK.Value}.
     * TK.ValueButton uses {@link TK.DragValue} and {@link TK.ScrollValue}
     * for setting its value.
     * It inherits all options of {@link TK.DragValue}.
     *
     * @class TK.ValueButton
     * 
     * @extends TK.Button
     * 
     * @param {Object} options
     * 
     * @property {Number} [options.value=0] - The value of the widget.
     * @property {Number} [options.value_format=function (val) { return val.toFixed(2); }] - Callback to format the value label.
     * @property {Number} [options.value_size=5] - Amount of digits of the value input.
     * @property {Number} [options.bar_direction="horizontal"] - Direction of the bar, either <code>horizontal</code> or <code>vertical<code>.
     * @property {String} [options.direction="polar"] - Direction for changing the value.
     *   Can be "polar", "vertical" or "horizontal".
     * @property {Number} [options.blind_angle=20] - If options.direction is "polar",
     *   this is the angle of separation between positive and negative value changes
     * @property {Number} [options.rotation=45] - Defines the angle of the center of the positive value
     *   changes. 0 means straight upward. For instance, a value of 45 leads to increasing value when
     *   moving towards top and right.
     * @property {Number} [options.snap=0.01] - Snap value while dragging.
     */
    _class: "ValueButton",
    Extends: TK.Button,
    Implements: [TK.Warning, TK.Ranged],
    _options: Object.assign(Object.create(TK.Button.prototype._options), TK.Ranged.prototype._options, {
        value: "number",
        value_format: "function",
        value_size: "number",
        bar_direction: "string",
        drag_direction: "string",
        rotation: "number",
        blind_angle: "number",
        snap: "number",
        reset: "number",
    }),
    options:  {
        value: 0,
        value_format:   function (val) { return val.toFixed(2); },
        value_size:     5,
        bar_direction:  "horizontal",
        drag_direction: "polar",
        rotation:       45,
        blind_angle:    20,
        snap:           0.01
    },
    static_events: {
        set_value: function(value) {
            this.value.set("value", value);
        },
        set_value_format: function(value) {
            this.value.set("format", value);
        },
        set_value_size: function(value) {
            this.value.set("size", value);
        },
        set_drag_direction: function(value) {
            this.drag.set("direction", value);
        },
        set_drag_rotation: function(value) {
            this.drag.set("rotation", value);
        },
        set_blind_angle: function(value) {
            this.drag.set("blind_angle", value);
        },
    },
    initialize: function (options) {
        TK.Button.prototype.initialize.call(this, options);
        
        /**
         * @member {HTMLDivElement} TK.ValueButton#element - The main DIV container.
         *   Has class <code>toolkit-valuebutton</code>.
         */
        TK.add_class(this.element, "toolkit-valuebutton");
        
        this._bar     = TK.element("div","toolkit-bar");
        this._base    = TK.element("div","toolkit-base");
        this._over    = TK.element("div","toolkit-over");

        this._bar.appendChild(this._base);
        this._bar.appendChild(this._over);
        
        /**
         * @member {TK.Value} TK.ValueButton#value - The value widget for editing the value manually.
         */
        this.value = new TK.Value({
            container: this.element,
            value: this.options.value,
            format: this.options.value_format,
        });
        this.value.add_event("valueclicked", value_clicked.bind(this));
        this.value.add_event("valuedone", value_done.bind(this));
        this.value.add_event("userset", userset_cb);
        this.add_child(this.value);
        
        /**
         * @member {HTMLInputElement} TK.ValueButton#_input - The text entry of the TK.Value.
         */
        this._input = this.value._input;
        
        this.element.appendChild(this._bar);
        
        /**
         * @member {TK.DragValue} TK.ValueButton#drag - The DragValue module.
         */
        this.drag = new TK.DragValue({
            node:      this.element,
            range:     function () { return this; }.bind(this),
            get:       function () { return this.options.value; }.bind(this),
            set:       function (v) {
                this.userset("value", v);
            }.bind(this),
            direction: this.options.drag_direction,
            rotation: this.options.rotation,
            blind_angle: this.options.blind_angle,
            events: function () { return this }.bind(this)
        });
        /**
         * @member {TK.ScrollValue} TK.ValueButton#scroll - The ScrollValue module.
         */
        this.scroll = new TK.ScrollValue({
            element: this.element,
            range:   function () { return this }.bind(this),
            get:     function () { return this.options.value; }.bind(this),
            set:     function (v) {
                this.userset("value", v);
            }.bind(this),
            events: function () { return this }.bind(this)
        });
        
        if (this.options.reset === void(0))
            this.options.reset = this.options.value;
        this.element.addEventListener("dblclick", function () {
            this.userset("value", this.options.reset);
            /**
             * Is fired when the user doubleclicks the valuebutton in order to to reset to initial value.
             * The Argument is the new value.
             * 
             * @event TK.ValueButton#doubleclick
             * 
             * @param {number} value - The value of the widget.
             */
            this.fire_event("doubleclick", this.options.value);
        }.bind(this));
        
        this._input.addEventListener("dblclick", function (e) {
            e.stopPropagation();
        });
    },

    initialized: function() {
        TK.Button.prototype.initialized.call(this);
        Ranged.prototype.initialized.call(this);
    },
    
    redraw: function () {
        TK.Button.prototype.redraw.call(this);
        var I = this.invalid;
        var O = this.options;

        if (I.bar_direction) {
            I.bar_direction = false;
            switch (O.bar_direction) {
                default:
                    // TODO: warn here.
                case "horizontal":
                    TK.remove_class(this.element, "toolkit-vertical");
                    TK.add_class(this.element, "toolkit-horizontal");
                    break;
                case "vertical":
                    TK.remove_class(this.element, "toolkit-horizontal");
                    TK.add_class(this.element, "toolkit-vertical");
                    break;
            }
        }
        if (I.value) {
            I.value = false;
            this._base.style[O.bar_direction === "horizontal" ? "width" : "height"] = this.val2perc(this.snap(O.value)) + "%";
        }
    },
    
    destroy: function () {
        this.drag.destroy();
        this.scroll.destroy();
        this.value.destroy();
        this._over.remove();
        this._base.remove();
        this._bar.remove();
        TK.Button.prototype.destroy.call(this);
    },
    // GETTERS & SETTERS
    set: function (key, value) {
        if (key === "value") {
            if (value > this.options.max || value < this.options.min)
                this.warning(this.element);
            value = this.snap(value);
        }
        return TK.Button.prototype.set.call(this, key, value);
    }
});
})(this);
