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
w.TK.Dynamics = w.Dynamics = $class({
    /**
     * TK.Dynamics are based on Charts and display the characteristics of dynamic
     * processors. They are square widgets drawing a TK.Grid automatically based on
     * the range.
     *
     * @class TK.Dynamics
     * @extends TK.Chart
     */
    _class: "Dynamics",
    Extends: TK.Chart,
    _options: Object.assign(Object.create(TK.Chart.prototype._options), {
        size: "number",
        min:  "number",
        max:  "number",
        scale: "string",
        type:  "string",
        threshold: "number",
        ratio:     "number",
        makeup:    "number",
        floor:     "number",
        range:     "number",
        grid_labels: "function",
        db_grid: "number",
    }),
    options: {
        db_grid: 12,
        min:     -96,
        max:     24,
        scale:   "linear",
        type:    false,          // type of dynamics display. can be
                                 // "compressor", "limiter",
                                 // "gate", "expander"
                                 // or false to draw your own curve
        threshold: 0,
        ratio:     1,
        makeup:    0,
        floor:     0,
        range:     0,
        grid_labels: function (val) { return val + (!val ? "dB":""); }
    },
    initialize: function (options) {
        TK.Chart.prototype.initialize.call(this, options, true);
        var O = this.options;
        TK.add_class(this.element, "toolkit-dynamics");
        this.set("scale", O.scale);
        if (O.size) this.set("size", O.size);
        this.set("min", O.min);
        this.set("max", O.max);
        /** @member {TK.Graph} TK.Dynamics#element - The graph drawing the zero line. Has class <code>toolkit-steady</code> 
         */
        this.steady = this.add_graph({
            dots: [{x:O.min, y:O.min},
                   {x:O.max, y:O.max}],
            "class": "toolkit-steady",
            mode: "line"
        });
    },
    
    redraw: function () {
        var O = this.options;
        var I = this.invalid;
        
        TK.Chart.prototype.redraw.call(this);

        if (I.validate("size", "min", "max", "scale")) {
            var grid_x = [];
            var grid_y = [];
            var min = this.range_x.get("min");
            var max = this.range_x.get("max");
            var step = O.db_grid;
            var cls;
            for (var i = min; i <= max; i += step) {
                cls = i ? "" : "toolkit-highlight";
                grid_x.push({
                    pos:     i,
                    label:   i === min ? "" : O.grid_labels(i),
                    "class": cls
                });
                grid_y.push({
                    pos:     i,
                    label:   i === min ? "" : O.grid_labels(i),
                    "class": cls
                });
            }
            if (this.grid) {
                this.grid.set("grid_x", grid_x);
                this.grid.set("grid_y", grid_y);
            }

            if (this.steady)
                this.steady.set("dots", [{x:O.min, y:O.min}, {x:O.max, y:O.max}]);
        }
        

        if (I.validate("ratio", "threshold", "range", "makeup")) {
            this.draw_graph();
        }
    },

    resize: function() {
        var O = this.options;
        var E = this.element;
        var S = this.svg;

        /* bypass the Chart resize logic here */
        Widget.prototype.resize.call(this);

        var tmp = TK.css_space(S, "border", "padding");
        var w = TK.inner_width(E) - tmp.left - tmp.right;
        var h = TK.inner_height(E) - tmp.top - tmp.bottom;

        var s = Math.min(h, w);

        if (s > 0 && s !== O._width) {
            this.set("_width", s);
            this.set("_height", s);
            this.range_x.set("basis", s);
            this.range_y.set("basis", s);
        }
    },
    
    draw_graph: function () {
        var O = this.options;
        if (O.type === false) return;
        if (!this.graph) {
            this.graph = this.add_graph({
                dots: [{x: O.min, y: O.min},
                       {x: O.max, y: O.max}]
            });
        }
        var curve = [];
        switch (O.type) {
            case "compressor":
                curve.push({x: O.min,
                            y: O.min + O.makeup});
                curve.push({x: O.threshold,
                            y: O.threshold + O.makeup});
                if (isFinite(O.ratio) && O.ratio > 0) {
                    curve.push({x: O.max,
                                y: O.threshold + O.makeup + (O.max - O.threshold) / O.ratio
                               });
                } else if (O.ratio === 0) {
                    curve.push({x: O.threshold,
                                y: O.max
                               });
                } else {
                    curve.push({x: O.max,
                                y: O.threshold
                               });
                }

                break;
            case "limiter":
                curve.push({x: O.min,
                            y: O.min + O.makeup});
                curve.push({x: O.threshold,
                            y: O.threshold + O.makeup});
                curve.push({x: O.max,
                            y: O.threshold + O.makeup});
                break;
            case "gate":
                curve.push({x: O.threshold,
                            y: O.min});
                curve.push({x: O.threshold,
                            y: O.threshold + O.makeup});
                curve.push({x: O.max,
                            y: this.opions.max + O.makeup});
                break;
            case "expander":
                if (O.ratio !== 1) {
                    curve.push({x: O.min,
                                y: O.min + O.makeup + O.range});
                    var range = O.range;
                    var ratio = O.ratio;
                    var thres = O.threshold;
                    var y = (ratio * range + (ratio - 1) * thres) / (ratio - 1);
                    curve.push({x: y - range,
                                y: y + O.makeup});
                    curve.push({x: O.threshold,
                                y: O.threshold + O.makeup});
                }
                else
                    curve.push({x: O.min,
                                y: O.min + O.makeup});
                curve.push({x: O.max,
                            y: O.max + O.makeup});
                break;
            default:
                TK.warn("Unsupported type", O.type);
        }
        this.graph.set("dots", curve);
    },
    
    set: function (key, value) {
        if (key === "size") {
            this.set("width", value);
            this.set("height", value);
            return;
        }
        value = TK.Chart.prototype.set.call(this, key, value);
        switch (key) {
            case "min":
            case "max":
            case "scale":
                this.range_x.set(key, value);
                this.range_y.set(key, value);
                break;
        }
        return value;
    }
});
})(this);
