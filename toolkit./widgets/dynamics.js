/*******************************************************************************
 * toolkit. by Junger
 * 
 * This toolkit provides different widgets, implements and modules for building
 * audio based applications in webbrowsers.
 * 
 * Concept and realization by Markus Schmidt <schmidt@boomshop.net> for:
 * 
 * Jünger Audio GmbH
 * Justus-von-Liebig-Straße 7
 * 12489 Berlin · Germany
 * Tel: +49 30 67 77 21 0
 * http://junger-audio.com
 * info@junger-audio.com
 * 
 * toolkit. relies on mootools: http://mootools.net/
 * 
 * There is no license by now - all rights reserved. Hope we can fix this major
 * bug soon.
 ******************************************************************************/


var Dynamics = new Class({
    // Dynamics are based on Charts and display the characteristics of dynamic
    // processors. They are square widgets drawing a Grid automatically based on
    // the range.
    Extends: Chart,
    options: {
        db_grid: 12,
        min:     -96,
        max:     24,
        size:    400,
        scale:   _TOOLKIT_FLAT
    },
    initialize: function (options) {
        this.parent(options, true);
        this.element.addClass("toolkit-dynamics");
        this.set("scale", this.options.scale, true);
        this.set("size", this.options.size, true);
        this.set("min", this.options.min, true);
        this.set("max", this.options.max, true);
        this._steady = this.add_graph({
            dots: [{x:this.options.min, y:this.options.min},
                   {x:this.options.max, y:this.options.max}],
            "class": "toolkit-steady",
            scale: _TOOLKIT_LINE
        });
        this.redraw();
        this.initialized();
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
                label:   i == this.range_x.get("min") ? "" : i + (!i ? "dB":""),
                "class": cls
            });
            this.options.grid_y.push({
                pos:     i,
                label:   i == this.range_x.get("min") ? "" : i + (!i ? "dB":""),
                "class": cls
            });
        }
        this.grid.set("grid_x", this.options.grid_x, true);
        this.grid.set("grid_y", this.options.grid_y);
        
        if (this._steady)
            this._steady.set("dots", [{x:this.options.min, y:this.options.min},
                                      {x:this.options.max, y:this.options.max}]);
        
        this.parent(graphs, false);
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
        }
        this.parent(key, value, hold);
    }
});
