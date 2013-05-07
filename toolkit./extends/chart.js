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

var Chart = new Class({
    // Chart is an SVG image containing one or more Graphs. There are functions
    // to add and remove graphs. Chart extends Widget and contains a Grid
    // and two Ranges.
    
    Extends: Widget,
    Implements: Ranges,
    options: {
        grid_x:  [], // array containing {pos:x[, color: "colorstring"[,
                     //       class: "classname"[, label:"labeltext"]]]}
        grid_y:  [], // array containing {pos:y[, color: "colorstring"[,
                     //       class: "classname"[, label:"labeltext"]]]}
        width:   0,  // the width of the Graph
        height:  0,  // the height of the Graph
        range_x: {}, // an object with options for a range for the x axis
                     // or a function returning a Range instance (only on init)
        range_y: {}, // an object with options for a range for the y axis
                     // or a function returning a Range instance (only on init)
        key: false   // key draws a description for the graphs at the given
                     // position, use false for no key
    },
    _min_key_width: 20,
    graphs: [],
    initialize: function (options, hold) {
        this.parent(options, hold);
        
        this.add_range(this.options.range_x, "range_x");
        this.add_range(this.options.range_y, "range_y");
        this.range_y.set("reverse", true, true);
        
        if (this.options.width)
            this.set("width", this.options.width, true);
        if (this.options.height)
            this.set("height", this.options.height, true);
        
        this.element = this.widgetize(makeSVG("svg", {
            width:  this.range_x.options.basis,
            height: this.range_y.options.basis
        }), true, true);
        this.element.addClass("toolkit-chart");
        if (this.options.container)
            this.set("container", this.options.container);

        this._graphs = makeSVG("g", {"class": "toolkit-graphs"});
        this._graphs.inject(this.element);
        
        this.range_x.addEvent("set", function (key, value, hold) {
            if (!hold) this.redraw();
        }.bind(this));
        this.range_y.addEvent("set", function (key, value, hold) {
            if (!hold) this.redraw();
        }.bind(this));
        
        this.grid = new Grid({
            grid_x: this.options.grid_x,
            grid_y: this.options.grid_y,
            range_x: function () { return this.range_x; }.bind(this),
            range_y: function () { return this.range_y; }.bind(this),
            container: this.element
        });
        
        this._key_background = makeSVG("rect",
            {"class": "toolkit-background"});
        this._key_background.inject(this.element);
        this._key = makeSVG("g", {"class": "toolkit-key"});
        this._key.inject(this.element);
        
        this.initialized();
    },
    redraw: function (graphs, grid) {
        var w = this.range_x.get("basis") + "px";
        var h = this.range_y.get("basis") + "px";
        this.element.set({
            width: w,
            height: h
        });
        this.element.set("style", "width: " + w + "; height: " + h + ";");
        if (grid) {
            this.grid.redraw();
        }
        if (graphs) {
            for (var i = 0; i < this.graphs.length; i++) {
                this.graphs[i].redraw();
            }
        }
        this._draw_key();
        this.parent();
    },
    destroy: function () {
        for (var i = 0; i < this._graphs.length; i++) {
            this._graphs[i].destroy();
        }
        this._graphs.destroy();
        this.element.destroy();
        this.parent();
    },
    add_graph: function (options) {
        // Add a new Graph to the Chart
        options["container"] = this._graphs;
        if (!options.range_x)
            options.range_x = function () { return this.range_x; }.bind(this);
        if (!options.range_y)
            options.range_y = function () { return this.range_y; }.bind(this);
        var g = new Graph(options);
        this.graphs.push(g);
        this._draw_key();
        this.fireEvent("graphadded");
        return g;
    },
    remove_graph: function (g) {
        // Remove a certain Graph from the Chart
        for (var i = 0; i < this.graphs.length; i++) {
            if (this.graphs[i] == g) {
                this.graphs[i].destroy();
                this.graphs.splice(i, 1);
                this.fireEvent("graphremoved");
                break;
            }
        }
        this._draw_key();
    },
    empty: function () {
        // Remove all Graphs from the Chart
        for (var i = 0; i < this.graphs.length; i++) {
            this.remove_graph(this.graphs[i]);
        }
        this.graphs = [];
        this.fireEvent("emptied");
    },
    
    // HELPERS & STUFF
    _draw_key: function () {
        this._key.empty();
        if(this.options.key === false) {
            this._key.setStyle("display", "none");
            this.__key = {x1: 0, x2: 0, y1: 0, y2: 0};
            return;
        }
        var disp = "none";
        var gpad = {
            top:    this._key.getStyle("padding-top").toInt() || 0,
            right:  this._key.getStyle("padding-right").toInt() || 0,
            bottom: this._key.getStyle("padding-bottom").toInt() || 0,
            left:   this._key.getStyle("padding-left").toInt() || 0
        }
        var gmarg = {
            top:    this._key.getStyle("margin-top").toInt() || 0,
            right:  this._key.getStyle("margin-right").toInt() || 0,
            bottom: this._key.getStyle("margin-bottom").toInt() || 0,
            left:   this._key.getStyle("margin-left").toInt() || 0
        }
        
        var c = 0;
        var w = 0;
        var lines = [];
        for (var i = 0; i < this.graphs.length; i++) {
            if (this.graphs[i].get("key") !== false) {
                var t = makeSVG("text", {"class": "toolkit-label",
                                         "style": "dominant-baseline: central; baseline-shift: -50%"});
                t.inject(this._key);
                t.set("text", this.graphs[i].get("key"));
                t.set("dy", c ? t.getStyle("line-height") : gpad.top);
                t.set("dx", gpad.left);
                var bb = t.getBBox();
                lines.push({
                    x:       (t.getStyle("margin-right").toInt() || 0),
                    y:       bb.y,
                    width:   bb.width,
                    height:  bb.height,
                    "class": this.graphs[i].element.get("class").baseVal,
                    color:   (this.graphs[i].element.get("color") || ""),
                    style:   this.graphs[i].element.get("style")
                })
                w = Math.max(w, t.getComputedTextLength());
                disp = "block";
                c++;
            }
        }
        for (var i = 0; i < lines.length; i++) {
            var b = makeSVG("rect", {
                "class": lines[i]["class"],
                color:   lines[i].color,
                style:   lines[i].style,
                x:       lines[i].x + 0.5 + w + gpad.left,
                y:       lines[i].y + 0.5,
                height:  lines[i].height
            });
            console.log(lines[i].x)
            b.inject(this._key);
            b.set("width", (b.getStyle("width").toInt() || this._min_key_width));
        }
        this._key.setStyles({
            "display": disp
        });
        this._key.set("transform", "translate(" + gmarg.left + "," + gmarg.top + ")");
        
        var bb = this._key.getBBox();
        this._key_background.set("x", gmarg.left);
        this._key_background.set("y", gmarg.top);
        this._key_background.set("width", bb.width + gpad.left + gpad.right);
        this._key_background.set("height", bb.height + gpad.top + gpad.bottom);
        
    },
    
    // GETTER & SETER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "grid_x":
                this.grid.set("grid_x", value, hold);
                break;
            case "grid_y":
                this.grid.set("grid_y", value, hold);
                break;
            case "width":
                this.range_x.set("basis", value, hold);
                break;
            case "height":
                this.range_y.set("basis", value, hold);
                break;
        }
        this.parent(key, value, hold);
    }
});
