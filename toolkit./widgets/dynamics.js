var Dynamics = new Class({
    Extends: Chart,
    options: {
        db_grid: 12,
        min:    -96,
        max:     24,
        size:    400,
        mode_x:  2,
        mode_y:  2
    },
    initialize: function (options) {
        this.setOptions(options);
        this.parent(options);
        this.element.addClass("toolkit-dynamics");
        this.set("size", this.options.size, true);
        this.set("min", this.options.min, true);
        this.set("max", this.options.max, true);
        this._steady = this.add_graph({
            dots: [{x:this.options.min, y:this.options.min},
               {x:this.options.max, y:this.options.max},
            ],
            "class": "toolkit-steady",
            mode: 0
        });
        this.redraw();
    },
    
    redraw: function (graphs, grid) {
        this.options.grid_x = [];
        this.options.grid_y = [];
        for(var i = this.options.min; i <= this.options.max; i += this.options.db_grid) {
            var cls = "";
            if(i == 0) {
                cls = "toolkit-highlight";
            }
            this.options.grid_x.push({
                pos:     i,
                label:   i == this.options.min ? "" : i + (!i ? "dB" : ""),
                "class": cls
            });
            this.options.grid_y.push({
                pos:     i,
                label:   i == this.options.min ? "" : i + (!i ? "dB" : ""),
                "class": cls
            });
        }
        this.__grid.set("grid_x", this.options.grid_x, true);
        this.__grid.set("grid_y", this.options.grid_y, true);
        
        this._steady.set("dots", [{x:this.options.min, y:this.options.min},
                                  {x:this.options.max, y:this.options.max}]);
        
        this.parent(graphs, true);
    },
    
    set: function (key, value, hold) {
        this.parent(key, value, hold);
        switch (key) {
            case "size":
                this.options.width = value;
                this.options.height = value;
                if(!hold) this.redraw();
                break;
            case "min":
                this.options.min_x = value;
                this.options.min_y = value;
                if(!hold) this.redraw();
                break;
            case "max":
                this.options.max_x = value;
                this.options.max_y = value;
                if(!hold) this.redraw();
                break;
        }
    }
});
