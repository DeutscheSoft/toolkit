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
     * TK.MeterBase is a base class to build different meters such as TK.LevelMeter.
     * TK.MeterBase uses TK.Gradient and has a TK.Scale widget. TK.MeterBase inherits all
     * options from TK.Scale. Note that the two options <code>format_labels</code> and
     * <code>scale_base</code> have different names here.
     *
     * Note that level meters with high update frequencies can be very demanding when it comes
     * to rendering performance. These performance requirements can be reduced by increasing the
     * segment size using the <code>segment</code> option. Using a segment, the different level
     * meter positions are reduced. This widget will take advantage of that and avoid rendering those
     * changes to the meter level, which fall into the same segment.
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
     * @property {number} [options.scale_base=false] - Base of the meter scale, see {@link TK.Scale}.
     * @property {boolean} [options.show_labels=true] - If <code>true</code>, display labels in the
     *  scale.
     * @property {function} [options.format_labels=TK.FORMAT("%.2f")] - Function for formatting the 
     *  scale labels. This is passed to the Scale as option <code>labels</code>.
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
        scale_base: "number",
        format_labels: "function",
    }),
    options: {
        layout:          "left",
        segment:         1,
        value:           0,
        base:            false,
        label:           false,
        title:           "",
        show_title:      false,
        show_label:      false,
        show_scale:      true,
        show_labels:     true,
        show_marker:     false,
        format_label:    TK.FORMAT("%.2f"),
        levels:          [1, 5, 10],     // array of steps where to draw labels
                                          // and marker
        scale_base:       false,
        format_labels:    TK.FORMAT("%.2f"),
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
        this._last_meters = null;
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
            this._canvas.style.transform = "translate(-" + O._transform_left + ",-" + O._transform_top +")";
        }
        
        if (I.value || I.basis) {
            I.basis = I.value = false;
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
        var w = TK.outer_width(this._bar);
        var h = TK.outer_height(this._bar);
        this.set("_width", w);
        this.set("_height", h);
        this.set("_transform_left", TK.get_style(this._bar, "border-left-width"));
        this.set("_transform_top", TK.get_style(this._bar, "border-top-width"));
        var i = vert(O) ? TK.inner_height(this._bar) : TK.inner_width(this._bar);
        if (i != O.basis)
            this.set("basis", i);
    },

    calculate_meter: function(value) {
        var O = this.options;
        if (typeof value !== "number") value = O.value;
        // Set the mask elements according to options.value to show a value in
        // the meter bar
        var base = O.base;
        var segment = O.segment|0;
        var reverse = !!O.reverse;
        var size = O.basis|0;

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

        return [ v1, v2-v1 ];
    },
    
    draw_meter: function () {
        var O = this.options;
        var w = O._width;
        var h = O._height;
        var i;

        var a = this.calculate_meter();
        var tmp = this._last_meters;

        if (tmp && tmp.length == a.length) {
            for (i = 0; i < a.length; i++) {
                if (tmp[i] !== a[i]) break;
            }

            if (i === a.length) return;
        }

        this._last_meters = a;

        var ctx = this._ctx;

        TK.S.add(function() {
            ctx.fillRect(0, 0, w, h);

            var is_vertical = vert(O);
            
            if (is_vertical) {
                for (i = 0; i < a.length; i+= 2) {
                    ctx.clearRect(0, a[i], w, a[i+1]);
                }
            } else {
                for (i = 0; i < a.length; i+= 2) {
                    ctx.clearRect(a[i], 0, a[i+1], h);
                }
            }
        });
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
