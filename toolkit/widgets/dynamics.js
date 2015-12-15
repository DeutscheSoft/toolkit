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
w.Dynamics = $class({
    /* @class: Dynamics
     * @description: Dynamics are based on Charts and display the characteristics of dynamic
     * processors. They are square widgets drawing a Grid automatically based on
     * the range.
     */
    _class: "Dynamics",
    Extends: Chart,
    options: {
        db_grid: 12,
        min:     -96,
        max:     24,
        size:    400,
        scale:   _TOOLKIT_FLAT,
        type:    false,          // type of dynamics display. can be
                                 // _TOOLKIT_COMPRESSOR, _TOOLKIT_LIMITER,
                                 // _TOOLKIT_GATE, _TOOLKIT_EXPANDER
                                 // or false to draw your own curve
        threshold: 0,
        ratio:     1,
        makeup:    0,
        floor:     0,
        range:     0,
        grid_labels: function (val) { return val + (!val ? "dB":""); }
    },
    initialize: function (options) {
        Chart.prototype.initialize.call(this, options, true);
        var O = this.options;
        TK.add_class(this.element, "toolkit-dynamics");
        this.set("scale", O.scale);
        this.set("size", O.size);
        this.set("min", O.min);
        this.set("max", O.max);
        this.steady = this.add_graph({
            dots: [{x:O.min, y:O.min},
                   {x:O.max, y:O.max}],
            "class": "toolkit-steady",
            scale: _TOOLKIT_LINE
        });
    },
    
    redraw: function () {
        var O = this.options;
        var I = this.invalid;

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
            this.grid.set("grid_x", grid_x);
            this.grid.set("grid_y", grid_y);

            if (this.steady)
                this.steady.set("dots", [{x:O.min, y:O.min}, {x:O.max, y:O.max}]);
        }
        

        if (I.validate("ratio", "threshold", "range", "makeup")) {
            this.draw_graph();
        }
        
        if (I.resize) {
            TK.S.add(function() {
                var bb = this.element.getBoundingClientRect();
                var s = Math.min(bb.width, bb.height);
                if (s != O.size)
                    this.set("size", s);
            }.bind(this), 1);
        }

        Chart.prototype.redraw.call(this);
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
            case _TOOLKIT_COMPRESSOR:
                curve.push({x: O.min,
                            y: O.min + O.makeup});
                curve.push({x: O.threshold,
                            y: O.threshold + O.makeup});
                curve.push({x: O.max,
                            y: O.threshold + (O.max - O.threshold) / O.ratio + O.makeup});
                break;
            case _TOOLKIT_LIMITER:
                curve.push({x: O.min,
                            y: O.min + O.makeup});
                curve.push({x: O.threshold,
                            y: O.threshold + O.makeup});
                curve.push({x: O.max,
                            y: O.threshold + O.makeup});
                break;
            case _TOOLKIT_GATE:
                curve.push({x: O.threshold,
                            y: O.min});
                curve.push({x: O.threshold,
                            y: O.threshold + O.makeup});
                curve.push({x: O.max,
                            y: this.opions.max + O.makeup});
                break;
            case _TOOLKIT_EXPANDER:
                if (O.ratio != 1) {
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
        }
        this.graph.set("dots", curve);
    },
    
    set: function (key, value) {
        Chart.prototype.set.call(this, key, value);
        switch (key) {
            case "size":
                this.range_x.set("basis", value);
                this.range_y.set("basis", value);
                break;
            case "min":
            case "max":
            case "scale":
                this.range_x.set(key, value);
                this.range_y.set(key, value);
                break;
        }
    }
});
})(this);
