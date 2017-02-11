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
(function(w, TK){
function vert(O) {
    return O.layout === "left" || O.layout === "right";
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
TK.MeterBase = TK.class({
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
     * 
     * @extends TK.Widget
     *
     * @param {Object} options
     * 
     * @property {string} [options.layout="left"] - A string describing the layout of the meter.
     *   Possible values are <code>"left"</code>, <code>"right"</code>, <code>"top"</code> and 
     *   <code>"bottom"</code>. <code>"left"</code> and <code>"right"</code> are vertical
     *   layouts, where the meter is on the left or right of the scale, respectively. Similarly,
     *   <code>"top"</code> and <code>"bottom"</code> are horizontal layouts in which the meter
     *   is at the top or the bottom, respectively.
     * @property {int} [options.segment=1] - Segment size. Pixel positions of the meter level are
     *   rounded to multiples of this size. This can be used to give the level meter a LED effect.
     * @property {number} [options.value=0] - Level value.
     * @property {number} [options.base=false] - The base value of the meter. If set to <code>false</code>,
     *   the base will coincide with the minimum value <code>options.min</code>. The meter level is drawn
     *   starting from the base to the value.
     * @property {number} [options.label=false] - Value of the label position. 
     * @property {number} [options.title=""] - The title.
     * @property {boolean} [options.show_title=false] - If set to <code>true</code> a title is displayed.
     * @property {boolean} [options.show_label=false] - If set to <code>true</code> a label is displayed.
     * @property {boolean} [options.show_scale=true] - If set to <code>true</code> the scale is displayed.
     * @property {function} [options.format_label=TK.FORMAT("%.2f")] - Function for formatting the 
     *   label.
     * @property {number} [options.scale_base=false] - Base of the meter scale, see {@link TK.Scale}.
     * @property {boolean} [options.show_labels=true] - If <code>true</code>, display labels in the
     *   scale.
     * @property {function} [options.format_labels=TK.FORMAT("%.2f")] - Function for formatting the 
     *   scale labels. This is passed to the Scale as option <code>labels</code>.
     *
     */
    
    _class: "MeterBase",
    Extends: TK.Widget,
    Implements: [TK.Gradient],
    _options: Object.assign(Object.create(TK.Widget.prototype._options),
                            TK.Gradient.prototype._options, TK.Scale.prototype._options, {
        layout: "string",
        segment: "number",
        value: "number",
        base: "number|boolean",
        min: "number",
        max: "number",
        label: "string",
        title: "string",
        show_labels: "boolean",
        format_label: "function",
        scale_base: "number",
        format_labels: "function",
        background: "string|boolean",
        gradient: "object|boolean"
    }),
    options: {
        layout:          "left",
        segment:         1,
        value:           0,
        base:            false,
        label:           false,
        title:           "",
        show_labels:     true,
        format_label:    TK.FORMAT("%.2f"),
        levels:          [1, 5, 10],     // array of steps where to draw labels
        scale_base:       false,
        format_labels:    TK.FORMAT("%.2f"),
        background:      false,
        gradient:        false
    },
    static_events: {
        set_label: function(value) {
            /**
             * Is fired when the label changed.
             * The argument is the actual label value.
             * 
             * @event TK.MeterBase#labelchanged
             * 
             * @param {string} label - The label of the {@link TK.MeterBase}.
             */
            this.fire_event("labelchanged", value);
        },
        set_title: function(value) {
            /**
             * Is fired when the title changed.
             * The argument is the actual title.
             * 
             * @event TK.MeterBase#titlechanged
             * 
             * @param {string} title - The title of the {@link TK.MeterBase}.
             */
            this.fire_event("titlechanged", value);
        },
        set_segment: function(value) {
            // what is this supposed to do?
            // -> probably invalidate the value to force a redraw
            this.set("value", this.options.value);
        },
        set_value: function(value) {
            /**
             * Is fired when the value changed.
             * The argument is the actual value.
             * 
             * @event TK.MeterBase#valuechanged
             * 
             * @param {number} value - The value of the {@link TK.MeterBase}.
             */
            this.fire_event("valuechanged", value);
        },
        set_base: function(value) {
            /**
             * Is fired when the base value changed.
             * The argument is the actual base value.
             * 
             * @event TK.MeterBase#basechanged
             * 
             * @param {number} base - The value of the base.
             */
            this.fire_event("basechanged", value);
        },
    },
    
    initialize: function (options) {
        var E;
        TK.Widget.prototype.initialize.call(this, options);
        var O = this.options;
        /**
         * @member {HTMLDivElement} TK.MeterBase#element - The main DIV container.
         *   Has class <code>toolkit-meter-base</code>.
         */
        if (!(E = this.element)) this.element = E = TK.element("div");
        TK.add_class(E, "toolkit-meter-base");
        this.widgetize(E, false, true, true);
        
        this._bar    = TK.element("div", "toolkit-bar");
        /**
         * @member {HTMLCanvas} TK.MeterBase#_canvas - The canvas element drawing the mask.
         *   Has class <code>toolkit-mask</code>.
         */
        this._canvas = document.createElement("canvas");
        TK.add_class(this._canvas, "toolkit-mask");

        this._fillstyle = false;
        
        E.appendChild(this._bar);

        this._bar.appendChild(this._canvas);
        
        /**
         * @member {HTMLDivElement} TK.MeterBase#_bar - The DIV element containing the masks
         *      and drawing the background. Has class <code>toolkit-bar</code>.
         */
        this.delegate(this._bar);
        this._last_meters = [];
        this._current_meters = [];

        this.set("label", O.value);
        this.set("base", O.base);
    },

    destroy: function () {
        this._bar.remove();
        TK.Widget.prototype.destroy.call(this);
    },
    redraw: function () {
        var I = this.invalid;
        var O = this.options;
        var E = this.element;

        if (this._fillstyle === false) {
            TK.S.add(function() {
                this._fillstyle = TK.get_style(this._canvas, "background-color");
                TK.S.add(function() {
                    this._canvas.getContext("2d").fillStyle = this._fillstyle;
                    this._canvas.style.setProperty("background", "none", "important");
                    this.trigger_draw();
                }.bind(this), 1);
            }.bind(this));
        }

        if (I.reverse) {
            I.reverse = false;
            TK.toggle_class(E, "toolkit-reverse", O.reverse);
        }
        if (I.gradient || I.background) {
            I.gradient = I.background = false;
            this.draw_gradient(this._bar, O.gradient, O.background);
        }

        TK.Widget.prototype.redraw.call(this);
        
        if (I.layout) {
            I.layout = false;
            TK.remove_class(E, "toolkit-vertical",
                            "toolkit-horizontal", "toolkit-left",
                            "toolkit-right", "toolkit-top", "toolkit-bottom");
            var scale = this.scale ? this.scale.element : null;
            var bar = this._bar;
            switch (O.layout) {
                case "left":
                    TK.add_class(E, "toolkit-vertical", "toolkit-left");
                    if (scale) TK.insert_after(scale, bar);
                    break;
                case "right":
                    TK.add_class(E, "toolkit-vertical", "toolkit-right");
                    if (scale) TK.insert_after(bar, scale);
                    break;
                case "top":
                    TK.add_class(E, "toolkit-horizontal", "toolkit-top");
                    if (scale) TK.insert_after(scale, bar);
                    break;
                case "bottom":
                    TK.add_class(E, "toolkit-horizontal", "toolkit-bottom");
                    if (scale) TK.insert_after(bar, scale);
                    break;
                default:
                    throw("unsupported layout");
            }
        }

        if (this._fillstyle === false) return;

        if (I.basis && O._height > 0 && O._width > 0) {
            this._canvas.setAttribute("height", Math.round(O._height));
            this._canvas.setAttribute("width", Math.round(O._width));
            /* FIXME: I am not sure why this is even necessary */
            this._canvas.style.width = O._width + "px";
            this._canvas.style.height = O._height + "px";
            this._canvas.getContext("2d").fillStyle = this._fillstyle;
        }
        
        if (I.value || I.basis) {
            I.basis = I.value = false;
            this.draw_meter();
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
        this._fillstyle = false;
    },

    calculate_meter: function(to, value, i) {
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
            to[i++] = v2;
            to[i++] = v1;
        } else {
            to[i++] = v1;
            to[i++] = v2;
        }

        return i;
    },
    
    draw_meter: function () {
        var O = this.options;
        var w = Math.round(O._width);
        var h = Math.round(O._height);
        var i, j;

        if (!(w > 0 && h > 0)) return;

        var a = this._current_meters;
        var tmp = this._last_meters;

        var i = this.calculate_meter(a, O.value, 0);
        if (i < a.length) a.length = i;
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

        if (diff === 1) {
            /* a - tmp is non-empty */
            clear_interval(ctx, w, h, subtract_intervals(a, tmp), is_vertical);
            return;
        }
        if (diff === 2) {
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

    has_base: function() {
        var O = this.options;
        return O.base > O.min;
    },
    
    // GETTER & SETTER
    set: function (key, value) {
        if (key === "base" && value === false) value = this.options.min;
        return TK.Widget.prototype.set.call(this, key, value);
    }
});
/**
 * @member {TK.Scale} TK.MeterBase#scale - The {@link TK.Scale} module of the meter.
 */
TK.ChildWidget(TK.MeterBase, "scale", {
    create: TK.Scale,
    map_options: {
        format_labels: "labels",
        scale_base: "base",
    },
    inherit_options: true,
    show: true,
    toggle_class: true,
    static_events: {
        set: function(key, value) {
            this.parent.fire_event("scalechanged", key, value);
        },
    },
});
/**
 * @member {HTMLDivElement} TK.MeterBase#_over - The DIV element for the peak marker.
 *   Has class <code>toolkit-over</code>.
 */
TK.ChildElement(TK.MeterBase, "over", {
    append: function(O) {
        this._bar.appendChild(this._over);
    },
    show: true,
});
/**
 * @member {HTMLDivElement} TK.MeterBase#_title - The DIV element displaying the title.
 *   Has class <code>toolkit-title</code>.
 */
TK.ChildElement(TK.MeterBase, "title", {
    append: function(O) {
        this._bar.appendChild(this._title);
    },
    show: false,
    draw_options: [ "title" ],
    draw: function(O) {
        if (this._title) TK.set_content(this._title, O.title);
    },
    toggle_class: true,
});
/**
 * @member {HTMLDivElement} TK.MeterBase#_label - The DIV element of the label.
 */
TK.ChildElement(TK.MeterBase, "label", {
    show: false,
    toggle_class: true,
    draw_options: [ "label", "format_label" ],
    draw: function(O) {
        if (this._label) TK.set_text(this._label, O.format_label(O.label));
    },
});
})(this, this.TK);
