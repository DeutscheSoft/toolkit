var Chart = new Class({
    Extends: Coordinates,
    Implements: [Events, Options],
    options: {
        container: false, // a container the SVG should be injected to
        "class":   "",    // a class to add in build process
        id:        "",    // an id to add in build process
        grid_x:    [],    // array containing {pos:x[, color: "colorstring"[, class: "classname"[, label:"labeltext"]]]}
        grid_y:    []     // array containing {pos:y[, color: "colorstring"[, class: "classname"[, label:"labeltext"]]]}
    },
    graphs: [],
    _add: ".5",
    initialize: function (options) {
        this.setOptions(options);
        this.parent(options);
        
        this.element = makeSVG("svg", {
            width:  this.options.width,
            height: this.options.height
        });
        if(!this.options.id) this.options.id = String.uniqueID();
        this.element.set("id", this.options.id);
        this.element.addClass("toolkit-chart");
        if(this.options["class"])
            this.element.addClass(this.options["class"]);
        if(this.options.container)
            this.set("container", this.options.container);
        
        this._graphs = makeSVG("g", {"class": "toolkit-graphs"});
        this._graphs.inject(this.element);
        this.__grid = new Grid({
            grid_x: this.options.grid_x,
            grid_y: this.options.grid_y,
            mode_x: this.options.mode_x,
            mode_y: this.options.mode_y,
            width:  this.options.width,
            height: this.options.height,
            container: this.element
        })
    },
    redraw: function (graphs, grid) {
        if(!this.options.width)
            this.options.width = this.element.innerWidth();
        if(!this.options.height)
            this.options.height = this.element.innerHeight();
        var w = this.options.width + "px";
        var h = this.options.height + "px";
        this.element.set({
            width: w,
            height: h
        });
        this.element.set("style", "width: w; height: h;");
        if(grid) {
            this.__grid.set("width",  this.options.width, true);
            this.__grid.set("height", this.options.height, true);
            this.__grid.set("mode_x", this.options.mode_x, true);
            this.__grid.set("mode_y", this.options.mode_y, true);
            this.__grid.set("min_x", this.options.min_x, true);
            this.__grid.set("min_y", this.options.min_y, true);
            this.__grid.set("max_x", this.options.max_x, true);
            this.__grid.set("max_y", this.options.max_y, true);
            this.__grid.redraw();
        }
        if(graphs) {
            for(var i = 0; i < this.graphs.length; i++) {
                this.graphs[i].set("width",  this.options.width, true);
                this.graphs[i].set("height", this.options.height, true);
                this.graphs[i].set("mode_x", this.options.mode_x, true);
                this.graphs[i].set("mode_y", this.options.mode_y, true);
                this.graphs[i].set("min_x", this.options.min_x, true);
                this.graphs[i].set("min_y", this.options.min_y, true);
                this.graphs[i].set("max_x", this.options.max_x, true);
                this.graphs[i].set("max_y", this.options.max_y, true);
                this.graphs[i].redraw();
            }
        }
    },
    destroy: function () {
        for(var i = 0; i < this.graphs.length; i++) {
            this.graphs[i].destroy();
        }
        this._graphs.destroy();
        this.element.destroy();
    },
    add_graph: function (options, g) {
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
        var g = new Graph(options);
        this.graphs.push(g);
        this.fireEvent("graphadded");
        return g;
    },
    remove_graph: function (g) {
        for(var i = 0; i < this.graphs.length; i++) {
            if(this.graphs[i] == g) {
                this.graphs[i].destroy();
                this.graphs.splice(i, 1);
                this.fireEvent("graphremoved");
                break;
            }
        }
    },
    
    empty: function () {
        for(var i = 0; i < this.graphs.length; i++) {
            this.remove_graph(this.graphs[i]);
        }
        this.graphs = [];
    },
    
    // GETTER & SETER
    set: function (key, value, hold) {
        this.options[key] = value;
        this.parent(key, value, hold);
        switch(key) {
            case "container":
                if(!hold) this.element.inject(value);
                break;
            case "class":
                if(!hold) this.element.addClass(value);
                break;
            case "width":
            case "height":
            case "mode_x":
            case "mode_y":
            case "min_x":
            case "max_x":
            case "min_y":
            case "max_y":
                if(!hold) this.redraw(true, true);
                this.fireEvent("resized");
                break;
            case "grid_x":
            case "grid_y":
                console.log("redraw chart")
                if(!hold) this.redraw(true, true);
                break;
        }
    },
    get: function (key) {
        if(typeof this.options[key] != "undefined")
            return this.options[key];
    }
});
