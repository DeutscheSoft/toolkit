var Chart = new Class({
    Implements: [Events, Options],
    options: {
        container: false, // a container the SVG should be injected to
        class:     "",    // a class to add in build process
        id:        "",    // an id to add in build process
        width:     0,     // the width of the graph (SVG)
        height:    0,     // the height of the graph (SVG)
        mode_x:    0,     // the default mode for the x axis (0: pixels, 1: percent)
        mode_y:    0,     // the default mode for the y axis (0: pixels, 1: percent)
    },
    graphs: [],
    _add: ".5",
    initialize: function (options) {
        this.setOptions(options);
        
        // firefox? don't add pixels!
        if (Browser.firefox)
            this._add = "";
        
        this.element = makeSVG("svg", {
            width:  this.options.width,
            height: this.options.height,
        });
        this.element.addClass("chart");
        
        this._graphs = makeSVG("g", {class: "graphs"});
        this._graphs.inject(this.element);
        
        if(this.options.class)
            this.element.addClass(this.options.class);
        
        if(!this.options.id) this.options.id = String.uniqueID();
        this.element.set("id", this.options.id);
        
        if(this.options.container)
            this.set("container", this.options.container);
    },
    redraw: function (graphs) {
        var w = this.options.width + "px";
        var h = this.options.height + "px";
        this.element.set({
            width: w,
            height: h,
        });
        this.element.css({
            width: w,
            height: h,
        });
        if(graphs) {
            for(var i = 0; i < this.graphs.length; i++) {
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
        if(typeof options["mode_x"] == "undefined")
            options["mode_x"]  = this.options.mode_x;
        if(typeof options["mode_y"] == "undefined")
            options["mode_y"] = this.options.mode_y;
        
        var g = new Graph(options);
        this.graphs.push(g);
        this.fireEvent("pathadded");
        return g;
    },
    remove_graph: function (g) {
        for(var i = 0; i < this.graphs.length; i++) {
            if(this.graphs[i] == g) {
                this.graphs[i].destroy();
                this.graphs.splice(i, 1);
                this.fireEvent("pathremoved");
                break;
            }
        }
    },
    
    // GETTER & SETER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch(key) {
            case "container":
                if(!hold) this.element.inject(value);
                break;
            case "class":
                if(!hold) this.element.addClass(value);
                break;
            case "width":
            case "height":
                if(!hold) this.redraw(true);
                this.fireEvent("resized");
                break;
        }
    },
    get: function (key) {
        if(typeof this.options[key] != "undefined")
            return this.options[key];
    },
});
