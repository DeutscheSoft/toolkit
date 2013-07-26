 /* toolkit. provides different widgets, implements and modules for 
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
 
var FrequencyResponse = new Class({
    // FrequencyResponse is a Chart drawing frequencies on the x axis and dB
    // values on the y axis. This widget automatically draws a Grid depending
    // on the ranges.
    _class: "FrequencyResponse",
    Extends: Chart,
    options: {
        db_grid: 12,                                         // dB grid distance
        range_x: {min:20, max:20000, scale:_TOOLKIT_FREQ},   // Range x options
        range_y: {min:-36, max: 36, scale: _TOOLKIT_LINEAR}, // Range y options
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
        this.parent(options);
        this.element.addClass("toolkit-frequency-response");
        this.set("db_grid", this.options.db_grid);
        this.range_y.addEvent("set", function (key, value, hold) {
            if (key == "scale")
                this.options.scale = value;
        }.bind(this));
        this.initialized();
    },
    
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "scale":
                this.range_y.set("scale", value);
                if (!hold) this.redraw();
                break;
            case "db_grid":
                if (!hold) {
                    this.options.grid_y = []
                    for (var i = this.range_y.get("min");
                        i <= this.range_y.get("max");
                        i += this.options.db_grid) {
                        
                        var cls = "";
                        if (i == ((this.range_y.get("max")
                               - this.range_y.get("min")) / 2
                               + this.range_y.get("min"))) {
                            cls = "toolkit-highlight";
                        }
                        this.options.grid_y.push({
                            pos:     i,
                            label:   i == this.range_y.get("min") ? "" : i + "dB",
                            "class": cls
                        });
                    }
                    this.grid.set("grid_y", this.options.grid_y);
                }
                break;
        }
        this.parent(key, value, hold);
    }
});
