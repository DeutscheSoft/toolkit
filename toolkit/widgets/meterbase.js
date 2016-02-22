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
function vert(O) {
    return O.layout == "left" || O.layout == "right";
}
w.TK.MeterBase = w.MeterBase = $class({
    /**
     * TK.MeterBase is a base class to build different meters like TK.LevelMeter.
     * TK.MeterBase uses TK.Gradient and has a TK.Scale widget. TK.MeterBase inherits all
     * options from TK.Scale, like <code>division</code>, <code>levels</code>.
     *
     * @class TK.MeterBase
     * @extends TK.Widget
     *
     * @param {Object} options
     * @property {string} [options.layout="left"] - A string describing the layout of the meter.
     *  Possible values are <code>"left"</code>, <code>"right"</code>, <code>"top"</code> and 
     *  <code>"bottom"</code>. <code>"left"</code> and <code>"right"</code> are vertical
     *  layouts, where the meter is on the left or right of the scale, respectively. Similarly,
     *  <code>"top"</code> and <code>"bottom"</code> are horizontal layouts in which the meter
     *  is at the top or the bottom, respectively.
     * @property {int} [options.segment=1] - Segment size. Pixel positions of the meter level are
     *  rounded to multiples of this size. This can be used to give the level meter a LED effect.
     * @property {number} [options.value=0] - Level value.
     * @property {number} [options.base=false] - The base value of the meter. If set to <code>false</code>,
     *  the base will coincide with the minimum value <code>options.min</code>. The meter level is drawn
     *  starting from the base to the value.
     * @property {number} [options.label=false] - Value of the label position. 
     * @property {number} [options.title=""] - The title.
     * @property {boolean} [options.show_title=false] - If set to <code>true</code> a title is displayed.
     * @property {boolean} [options.show_label=false] - If set to <code>true</code> a label is displayed.
     * @property {boolean} [options.show_scale=true] - If set to <code>true</code> the scale is displayed.
     * @property {boolean} [options.show_marker=false] - If set to <code>true</code> the bar markers are
     *  drawn.
     * @property {function} [options.format_label=TK.FORMAT("%.2f")] - Function for formatting the 
     *  label.
     * @property {number} [options.scale_base] - Base of the meter scale.
     *
     */
    
    _class: "MeterBase",
    Extends: TK.Widget,
    Implements: [Gradient],
    _options: Object.assign(Object.create(TK.Widget.prototype._options),
                            Gradient.prototype._options, TK.Scale.prototype._options, {
        layout: "int",
        segment: "number",
        value: "number",
        base: "number",
        min: "number",
        max: "number",
        label: "string",
        title: "string",
        show_title: "boolean",
        show_label: "boolean",
        show_scale: "boolean",
        show_labels: "boolean",
        show_marker: "boolean",
        format_label: "function",
        division: "number",
        levels: "array",
        scale_base: "number",
        format_labels: "function",
        gap_dots: "number",
        gap_labels: "number",
        show_max: "boolean",
        show_min: "boolean",
        show_base: "boolean",
    }),
    options: {
        layout:           "left",  // how to draw the meter:
                                          // "left":   vertical, meter on
                                          //                  the left
                                          // "right":  vertical, meter on
                                          //                  the right,
                                          // "top":    horizontal, meter
                                          //                  on top
                                          // "bottom": horizontal, meter
                                          //                  on bottom
        segment:         1,               // size of the segments (imagine as
                                          // size of a single LED)
        value:           0,               // the initial value
        base:            false,           // if base value is set, meter starts
                                          // at this point and shows values
                                          // above and beneath starting at base.
                                          // set to false if you don't need it
                                          // to save some cpu
        label:           false,           // the initial value for the label,
                                          // false = value
        title:           "",              // "name" of the meter
        show_title:      false,           // true for drawing the title
        show_label:      false,           // true for drawing the value label
        show_scale:      true,            // true for drawing the scale
        show_labels:     true,            // true for drawing scale labels
        show_marker:     false,           // true for drawing bar markers
                                          // (relies on a drawn scale)
        format_label:    TK.FORMAT("%.2f"),
                                          // callback function for formatting
                                          // the label
        division:         1,              // minimum step size
        levels:           [1, 5, 10],     // array of steps where to draw labels
                                          // and marker
        scale_base:       false,          // base value where dots and labels are
                                          // drawn from
        format_labels:    TK.FORMAT("%.2f"),
                                          // callback function for formatting
                                          // the labels of the scale
        gap_dots:         4,              // minimum gap between dots (pixel)
        gap_labels:       40,             // minimum gap between labels (pixel)
        show_max:         true,           // always show label and dot for max value
        show_min:         true,           // always show label and dot for min value
        show_base:        true            // always show label and dot for base value
    },
    
    initialize: function (options) {
        var E;
        TK.Widget.prototype.initialize.call(this, options);
        var O = this.options;
        this.__based = false;
        if (!(E = this.element)) this.element = E = TK.element("div");
        TK.add_class(E, "toolkit-meter-base");
        this.widgetize(E, false, true, true);
        
        this._title  = TK.element("div", "toolkit-title");
        this._label  = TK.element("div", "toolkit-label");
        this._bar    = TK.element("div", "toolkit-bar");
        this._mark   = TK.element("div", "toolkit-mark");
        this._over   = TK.element("div", "toolkit-over");

        this._canvas = document.createElement("canvas");
        this._ctx = this._canvas.getContext("2d");
        TK.add_class(this._canvas, "toolkit-mask");
        
        E.appendChild(this._title);
        E.appendChild(this._label);
        E.appendChild(this._bar);

        this._bar.appendChild(this._over);
        this._bar.appendChild(this._canvas);
        
        this.set("label", O.value);
        this.set("base", O.base);
        
        var options = TK.object_and(O, TK.Scale.prototype._options);
        options = TK.object_sub(options, TK.Widget.prototype._options);
        options.labels    = O.format_labels;
        options.base      = this.__based ? O.base : O.scale_base;
        options.container = E;
        this.scale        = new TK.Scale(options);
        this._scale       = this.scale.element;
        this.add_child(this.scale);
        this.delegate(this._bar);

        this._ctx.fillStyle = TK.get_style(this._canvas, "background-color");
        this._canvas.style.background = 'none';
    },

    initialized: function () {
        TK.Widget.prototype.initialized.call(this);
        Ranged.prototype.initialized.call(this);
    },
    
    destroy: function () {
        this._label.remove();
        this._scale.remove();
        this._bar.remove();
        this._title.remove();
        this._mark.remove();
        this._over.remove();
        this.element.remove();
        TK.Widget.prototype.destroy.call(this);
    },
    redraw: function () {
        var I = this.invalid;
        var O = this.options;
        var E = this.element;

        if (I.title) {
            I.title = false;
            TK.set_content(this._title, O.title);
        }
        if (I.label) {
            I.label = false;
            TK.set_text(this._label, O.format_label(O.label));
        }
        if (I.show_scale) {
            (O.show_scale ? TK.add_class : TK.remove_class)(E, "toolkit-has-scale");
        }
        if (I.show_title) {
            I.show_title = false;
            (O.show_title ? TK.add_class : TK.remove_class)(E, "toolkit-has-title");
        }
        if (I.show_label) {
            I.show_label = false;
            (O.show_label ? TK.add_class : TK.remove_class)(E, "toolkit-has-label");
        }
        if (I.reverse) {
            I.reverse = false;
            (O.reverse ? TK.add_class : TK.remove_class)(E, "toolkit-reverse");
        }
        if (I.gradient || I.background) {
            I.gradient = I.background = false;
            this.draw_gradient(this._bar, O.gradient);
        }

        TK.Widget.prototype.redraw.call(this);
        
        if (I.layout) {
            I.layout = false;
            TK.remove_class(E, "toolkit-vertical");
            TK.remove_class(E, "toolkit-horizontal");
            TK.remove_class(E, "toolkit-left");
            TK.remove_class(E, "toolkit-right");
            TK.remove_class(E, "toolkit-top");
            TK.remove_class(E, "toolkit-bottom");
            switch (O.layout) {
                case "left":
                    TK.add_class(E, "toolkit-vertical");
                    TK.add_class(E, "toolkit-left");
                    TK.insert_after(this._scale, this._bar);
                    break;
                case "right":
                    TK.add_class(E, "toolkit-vertical");
                    TK.add_class(E, "toolkit-right");
                    TK.insert_after(this._bar, this._scale);
                    break;
                case "top":
                    TK.add_class(E, "toolkit-horizontal");
                    TK.add_class(E, "toolkit-top");
                    TK.insert_after(this._scale, this._bar);
                    break;
                case "bottom":
                    TK.add_class(E, "toolkit-horizontal");
                    TK.add_class(E, "toolkit-bottom");
                    TK.insert_after(this._bar, this._scale);
                    break;
                default:
                    throw("unsupported layout");
            }
        }

        if (I.basis && O._height && O._width) {
            this._canvas.setAttribute("height", O._height + "px");
            this._canvas.setAttribute("width", O._width + "px");
        }
        
        if (I.value || I.basis) {
            I.value = false;
            this.draw_meter();
        }

        if (I.show_scale) {
            I.show_scale = false;
            var is_vertical = vert(O);
            if (O.show_scale) {
                this.scale.invalidate_all();
                this.scale.redraw();
                if (O.show_marker) {
                    TK.empty(this._mark);
                    var c = this.scale.element.children;
                    for (var i = 0; i < c.length; i++) {
                        var e = c[i];
                        if (!TK.has_class(e, "toolkit-dot"))
                            return;
                        
                        var d = e.clone();
                        var p = TK[is_vertical ? "position_top" : "position_left"](e, this._scale);
                        d.style[is_vertical ? "width" : "height"] = "100%";
                        d.style[is_vertical ? "top" : "left"] = (p + p % O.segment) + "px";
                        this._mark.appendChild(d);
                    }
                }
            }
        }
    },

    resize: function() {
        var O = this.options;
        TK.Widget.prototype.resize.call(this);
        var w = TK.inner_width(this._bar);
        var h = TK.inner_height(this._bar);
        this.set("_width", w);
        this.set("_height", h);
        var i = vert(O) ? h : w;
        if (i != O.basis)
            this.set("basis", i);
    },
    
    draw_meter: function (value) {
        var O = this.options;
        var is_vertical = vert(O);
        if (typeof value !== "number") value = O.value;
        // Set the mask elements according to options.value to show a value in
        // the meter bar
        var ctx = this._ctx;
        var w = O._width;
        var h = O._height;
        var base = O.base;
        var segment = O.segment|0;
        var reverse = !!O.reverse;
        var size = O.basis|0;

        ctx.fillRect(0, 0, w, h);
        
        /* At this point the whole meter bar is filled. We now want
         * to clear the area between base and value.
         */

        /* canvas coordinates are reversed */
        var v1 = size - this.val2px(base)|0;
        var v2 = size - this.val2px(value)|0;
        var tmp;

        if (segment !== 1) v2 -= v2 % segment;

        if (v2 < v1) {
            tmp = v1;
            v1 = v2;
            v2 = tmp;
        }

        if (is_vertical) {
            ctx.clearRect(0, v1, w, v2-v1);
        } else {
            ctx.clearRect(v1, 0, v2-v1, h);
        }
    },
    
    // HELPERS & STUFF
    _val2seg: function (val) {
        // rounds values to fit in the segments size
        // always returns values without taking options.reverse into account
        var s = +this.val2px(this.snap(val));
        s -= s % +this.options.segment;
        if (this.options.reverse)
            s = +this.options.basis - s;
        return s;
    },
    
    // GETTER & SETTER
    set: function (key, value) {
        value = TK.Widget.prototype.set.call(this, key, value);
        switch (key) {
            case "label":
                this.fire_event("labelchanged", value);
                break;
            case "value":
                this.fire_event("valuechanged", value);
                break;
            case "title":
                this.fire_event("titlechanged", value);
                break;
            case "segment":
                // what is this supposed to do
                this.set("value", this.options.value);
                break;
            case "format_labels":
                this.fire_event("scalechanged", key, value);
                this.scale.set("labels", value);
                break;
            case "scale_base":
                this.fire_event("scalechanged", key, value);
                this.scale.set("base", value);
                break;
            case "base":
                if (value === false) {
                    this.options.base = this.options.min;
                    this.__based = false;
                } else {
                    this.__based = true;
                }
                this.fire_event("basechanged", value);
                break;
            default:
                if (TK.Widget.prototype._options[key]) break;
                if (TK.Scale.prototype._options[key]) {
                    this.fire_event("scalechanged", key, value);
                    this.scale.set(key, value);
                }
        }
        return value;
    }
});
})(this);
