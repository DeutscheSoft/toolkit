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
    // Dynamics are based on Charts and display the characteristics of dynamic
    // processors. They are square widgets drawing a Grid automatically based on
    // the range.
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
        TK.add_class(this.element, "toolkit-dynamics");
        this.set("scale", this.options.scale, true);
        this.set("size", this.options.size, true);
        this.set("min", this.options.min, true);
        this.set("max", this.options.max, true);
        this.steady = this.add_graph({
            dots: [{x:this.options.min, y:this.options.min},
                   {x:this.options.max, y:this.options.max}],
            "class": "toolkit-steady",
            scale: _TOOLKIT_LINE
        });
        this.redraw();
        Chart.prototype.initialized.call(this);
    },
    
    redraw: function (graphs, grid) {
        this.options.grid_x = [];
        this.options.grid_y = [];
        for (var i = this.range_x.get("min");
            i <= this.range_x.get("max");
            i += this.options.db_grid) {
            var cls = "";
            if (i == 0) {
                cls = "toolkit-highlight";
            }
            this.options.grid_x.push({
                pos:     i,
                label:   i == this.range_x.get("min") ? ""
                            : this.options.grid_labels(i),
                "class": cls
            });
            this.options.grid_y.push({
                pos:     i,
                label:   i == this.range_x.get("min") ? ""
                            : this.options.grid_labels(i),
                "class": cls
            });
        }
        this.grid.set("grid_x", this.options.grid_x, true);
        this.grid.set("grid_y", this.options.grid_y);
        
        if (this.steady)
            this.steady.set("dots", [{x:this.options.min, y:this.options.min},
                                     {x:this.options.max, y:this.options.max}]);
        Chart.prototype.redraw.call(this, graphs, false);
        this.draw_graph();
    },
    
    draw_graph: function () {
        if (this.options.type === false) return;
        if (!this.graph) {
            this.graph = this.add_graph({
                dots: [{x: this.options.min, y: this.options.min},
                       {x: this.options.max, y: this.options.max}]
            });
        }
        var curve = [];
        switch (this.options.type) {
            case _TOOLKIT_COMPRESSOR:
                curve.push({x: this.options.min,
                            y: this.options.min + this.options.makeup});
                curve.push({x: this.options.threshold,
                            y: this.options.threshold + this.options.makeup});
                curve.push({x: this.options.max,
                            y: this.options.threshold + (this.options.max - this.options.threshold) / this.options.ratio + this.options.makeup});
                break;
            case _TOOLKIT_LIMITER:
                curve.push({x: this.options.min,
                            y: this.options.min + this.options.makeup});
                curve.push({x: this.options.threshold,
                            y: this.options.threshold + this.options.makeup});
                curve.push({x: this.options.max,
                            y: this.options.threshold + this.options.makeup});
                break;
            case _TOOLKIT_GATE:
                curve.push({x: this.options.threshold,
                            y: this.options.min});
                curve.push({x: this.options.threshold,
                            y: this.options.threshold + this.options.makeup});
                curve.push({x: this.options.max,
                            y: this.opions.max + this.options.makeup});
                break;
            case _TOOLKIT_EXPANDER:
                if (this.options.ratio != 1) {
                    curve.push({x: this.options.min,
                                y: this.options.min + this.options.makeup + this.options.range});
                    var range = this.options.range;
                    var ratio = this.options.ratio;
                    var thres = this.options.threshold;
                    var y = (ratio * range + (ratio - 1) * thres) / (ratio - 1);
                    curve.push({x: y - range,
                                y: y + this.options.makeup});
                    curve.push({x: this.options.threshold,
                                y: this.options.threshold + this.options.makeup});
                }
                else
                    curve.push({x: this.options.min,
                                y: this.options.min + this.options.makeup});
                curve.push({x: this.options.max,
                            y: this.options.max + this.options.makeup});
                break;
        }
        this.graph.set("dots", curve);
    },
    
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "size":
                this.range_x.set("basis", value, hold);
                this.range_y.set("basis", value, hold);
                if (!hold) this.redraw();
                break;
            case "min":
                this.range_x.set("min", value, hold);
                this.range_y.set("min", value, hold);
                if (!hold) this.redraw();
                break;
            case "max":
                this.range_x.set("max", value, hold);
                this.range_y.set("max", value, hold);
                if (!hold) this.redraw();
                break;
            case "scale":
                this.range_y.set("scale", value, hold);
                this.range_x.set("scale", value, hold);
                if (!hold) this.redraw();
                break;
            case "ratio":
            case "threshold":
            case "range":
            case "makeup":
                if (!hold) this.draw_graph();
                break;
        }
        Chart.prototype.set.call(this, key, value, hold);
    }
});
})(this);
