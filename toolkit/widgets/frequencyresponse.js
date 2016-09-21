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
function calculate_grid(range, step) {
    var min = range.get("min");
    var max = range.get("max");
    var grid = [];
    var i, cls;


    for (i = min; i <= max; i += step) {
        if (i === ((max + min) / 2)) {
            cls = "toolkit-highlight";
        } else {
            cls = "";
        }
        grid.push({
            pos:     i,
            label:   i === min ? "" : i + "dB",
            "class": cls
        });
    }

    return grid;
}
w.TK.FrequencyResponse = w.FrequencyResponse = $class({
    /**
     * TK.FrequencyResponse is a TK.Chart drawing frequencies on the x axis and dB
     * values on the y axis. This widget automatically draws a TK.Grid depending
     * on the ranges.
     *
     * @class TK.FrequencyResponse
     * @extends TK.Chart
     */
    _class: "FrequencyResponse",
    Extends: TK.Chart,
    _options: Object.assign(Object.create(TK.Chart.prototype._options), {
        db_grid: "number",
        range_x: "object",
        range_y: "object",
        grid_x: "array",
        scale: "boolean",
    }),
    options: {
        db_grid: 12,                                         // dB grid distance
        range_x: {min:20, max:20000, scale:"frequency"},   // TK.Range x options
        range_y: {min:-36, max: 36, scale: "linear"}, // TK.Range y options
        grid_x:  [
                    {pos:    20, label: "20 Hz"},
                    {pos:    30},
                    {pos:    40},
                    {pos:    50},
                    {pos:    60},
                    {pos:    70},
                    {pos:    80},
                    {pos:    90},
                    {pos:   100, label: "100 Hz"},
                    {pos:   200},
                    {pos:   300},
                    {pos:   400},
                    {pos:   500},
                    {pos:   600},
                    {pos:   700},
                    {pos:   800},
                    {pos:   900},
                    {pos:  1000, label: "1000 Hz"},
                    {pos:  2000},
                    {pos:  3000},
                    {pos:  4000},
                    {pos:  5000},
                    {pos:  6000},
                    {pos:  7000},
                    {pos:  8000},
                    {pos:  9000},
                    {pos: 10000, label: "10000 Hz"},
                    {pos: 20000, label: "20000 Hz"}],        // Frequency grid
        scale:  false                                        // the mode of the
                                                             // dB scale
    },
    initialize: function (options) {
        if (options.scale)
            this.set("scale", options.scale, true);
        TK.Chart.prototype.initialize.call(this, options);
        TK.add_class(this.element, "toolkit-frequency-response");
        // do not overwrite custom grids, please
        if (this.options.db_grid && !this.options.grid_y.length)
            this.set("db_grid", this.options.db_grid);
        this.range_y.add_event("set", function (key, value) {
            if (key == "scale")
                this.options.scale = value;
        }.bind(this));
    },

    redraw: function() {
        var I = this.invalid;
        var O = this.options;

        if (I.scale) {
            I.scale = false;
            // tell chart to redraw
            I.ranges = true;
        }

        TK.Chart.prototype.redraw.call(this);
    },
    
    set: function (key, value) {
        switch (key) {
            case "scale":
                this.range_y.set("scale", value);
                break;
            case "db_grid":
                if (value) {
                    key = "grid_y";
                    value = calculate_grid(this.range_y, value);
                }
                break;
        }
        return TK.Chart.prototype.set.call(this, key, value);
    }
});
})(this);
