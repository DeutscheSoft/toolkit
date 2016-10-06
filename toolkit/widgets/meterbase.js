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
"use strict";
(function(w){ 
function vert(O) {
    return O.layout == "left" || O.layout == "right";
}
function fill_interval(ctx, w, h, a, is_vertical) {
    var i;
    if (is_vertical) {
        for (i = 0; i < a.length; i+= 2) {
            ctx.fillRect(0, h - a[i+1], w, a[i+1]-a[i]);
        }
    } else {
        for (i = 0; i < a.length; i+= 2) {
            ctx.fillRect(a[i], 0, a[i+1]-a[i], h);
        }
    }
}
function clear_interval(ctx, w, h, a, is_vertical) {
    var i;
    if (is_vertical) {
        for (i = 0; i < a.length; i+= 2) {
            ctx.clearRect(0, h - a[i+1], w, a[i+1]-a[i]);
        }
    } else {
        for (i = 0; i < a.length; i+= 2) {
            ctx.clearRect(a[i], 0, a[i+1]-a[i], h);
        }
    }
}
function draw_full(ctx, w, h, a, is_vertical) {

    ctx.fillRect(0, 0, w, h);
    clear_interval(ctx, w, h, a, is_vertical);
}
function make_interval(a) {
    var i, tmp, again, j;

    do {
        again = false;
        for (i = 0; i < a.length-2; i+=2) {
            if (a[i] > a[i+2]) {
                tmp = a[i];
                a[i] = a[i+2];
                a[i+2] = tmp;

                tmp = a[i+1];
                a[i+1] = a[i+3];
                a[i+3] = tmp;
                again = true;
            }
        }
    } while (again);

    for (i = 0; i < a.length-2; i+= 2) {
        if (a[i+1] > a[i+2]) {
            if (a[i+3] > a[i+1]) {
                a[i+1] = a[i+3];
            }
            for (j = i+3; j < a.length; j++) a[j-1] = a[j];
            a.length = j-2;
            i -=2;
            continue;
        }
    }
}
function cmp_intervals(a, b) {
    var ret = 0;
    var i;

    for (i = 0; i < a.length; i+=2) {
        if (a[i] === b[i]) {
            if (a[i+1] === b[i+1]) continue;
            ret |= (a[i+1] < b[i+1]) ? 1 : 2;
        } else if (a[i+1] === b[i+1]) {
            ret |= (a[i] > b[i]) ? 1 : 2;
        } else return 4;
    }
    return ret;
}
function subtract_intervals(a, b) {
    var i;
    var ret = [];

    for (i = 0; i < a.length; i+=2) {
        if (a[i] === b[i]) {
            if (a[i+1] <= b[i+1]) continue;
            ret.push(b[i+1], a[i+1]);
        } else {
            if (a[i] > b[i]) continue;
            ret.push(a[i], b[i]);
        }
    }

    return ret;
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
        layout: "string",
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
        format_label:    TK.FORMAT("%.2f"),
        levels:          [1, 5, 10],     // array of steps where to draw labels
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
        this._over   = TK.element("div", "toolkit-over");

        this._canvas = document.createElement("canvas");
        TK.add_class(this._canvas, "toolkit-mask");

        this._fillstyle = false;
        
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

        this._last_meters = [];
        this._current_meters = [];
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
        this._over.remove();
        this.element.remove();
        TK.Widget.prototype.destroy.call(this);
    },
    redraw: function () {
        var I = this.invalid;
        var O = this.options;
        var E = this.element;

        if (this._fillstyle === false) {
            this._fillstyle = TK.get_style(this._canvas, "background-color");
            this._canvas.getContext("2d").fillStyle = this._fillStyle;
            this._canvas.style.background = 'none';
        }

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

        if (I.basis && O._height > 0 && O._width > 0) {
            this._canvas.setAttribute("height", Math.round(O._height));
            this._canvas.setAttribute("width", Math.round(O._width));
            /* FIXME: I am not sure why this is even necessary */
            this._canvas.style.width = O._width + "px";
            this._canvas.style.height = O._height + "px";
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
        this.set("basis", i);
        this._last_meters.length = 0;
    },

    calculate_meter: function(to, value) {
        var O = this.options;
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
        var v1 = this.val2px(base)|0;
        var v2 = this.val2px(value)|0;

        if (segment !== 1) v2 = segment*(Math.round(v2/segment)|0);

        if (v2 < v1) {
            to.push(v2, v1);
        } else {
            to.push(v1, v2);
        }
    },
    
    draw_meter: function () {
        var O = this.options;
        var w = Math.round(O._width);
        var h = Math.round(O._height);
        var i, j;

        if (!(w > 0 && h > 0)) return;

        var a = this._current_meters;
        var tmp = this._last_meters;

        a.length = 0;

        this.calculate_meter(a, O.value);
        make_interval(a);

        this._last_meters = a;
        this._current_meters = tmp;

        var diff;

        if (tmp.length === a.length) {
            diff = cmp_intervals(tmp, a)|0;
        } else diff = 4;

        if (!diff) return;

        var ctx = this._canvas.getContext("2d");
        var is_vertical = vert(O);

        if (diff == 1) {
            /* a - tmp is non-empty */
            clear_interval(ctx, w, h, subtract_intervals(a, tmp), is_vertical);
            return;
        }
        if (diff == 2) {
            /* tmp - a is non-empty */
            fill_interval(ctx, w, h, subtract_intervals(tmp, a), is_vertical);
            return;
        }

        draw_full(ctx, w, h, a, is_vertical);
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
            case "show_label":
            case "show_title":
            case "show_scale":
                this.trigger_resize();
                // fallthrough
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
