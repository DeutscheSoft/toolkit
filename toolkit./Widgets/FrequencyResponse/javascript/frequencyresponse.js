var FrequencyResponse = new Class({
    Extends: Chart,
    options: {
        min_x: 20,            // the minimum x value (db or frequency)
        max_x: 20000,         // the maximum x value (db or frequency)
        min_y: 0.0009765625,  // the minimum y value (db or frequency)
        max_y: 4,             // the maximum y value (db or frequency)
        mode_x: 3,            // the default mode for the x axis (0: pixels, 1: percent, 2: dB, 3: frequency)
        mode_y: 2,            // the default mode for the y axis (0: pixels, 1: percent, 2: dB, 3: frequency)
    },
    initialize: function (options) {
        this.setOptions(options);
        this.parent(options);
        this.element.addClass("frequency-response");
    },
    
    add_graph: function (options) {
        options["container"] = this._graphs;
        if(typeof options["width"] == "undefined")
            options["width"]  = this.options.width;
        if(typeof options["height"] == "undefined")
            options["height"] = this.options.height;
        
        if(typeof options["min_x"] == "undefined")
            options["min_x"] = this.options.min_x;
        if(typeof options["min_y"] == "undefined")
            options["min_y"] = this.options.min_y;
        if(typeof options["max_x"] == "undefined")
            options["max_x"] = this.options.max_x;
        if(typeof options["max_y"] == "undefined")
            options["max_y"] = this.options.max_y;
        if(typeof options["mode_x"] == "undefined")
            options["mode_x"] = this.options.mode_x;
        if(typeof options["mode_y"] == "undefined")
            options["mode_y"] = this.options.mode_y;
        if(typeof options["width"] == "undefined")
            options["width"] = this.options.width;
        if(typeof options["height"] == "undefined")
            options["height"] = this.options.height;
        
        var g = new FrequencyGraph(options);
        this.graphs.push(g);
        return g;
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.parent(key, value, hold);
        switch(key) {
            case "mode_x":
            case "mode_y":
            case "min_x":
            case "max_x":
            case "min_y":
            case "max_y":
                if(this.options.mode_x == 2) {
                    // precalc x values
                    this._min_x = log10(this.options.min_x);
                    this._max_x = log10(this.options.max_x);
                } else if(this.options.mode_x == 3) {
                    // precalc x values
                    this._min_x = log2(this.options.min_x);
                    this._max_x = log2(this.options.max_x);
                }
                if(this.options.mode_y == 2) {
                    // precalc y values
                    this._min_y = log10(this.options.min_y);
                    this._max_y = log10(this.options.max_y);
                } else if(this.options.mode_y == 3) {
                    // precalc y values
                    this._min_y = log2(this.options.min_y);
                    this._max_y = log2(this.options.max_y);
                }
                if(!hold) this.redraw();
                break;
        }
    },
});
