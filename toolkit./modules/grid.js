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

Grid = new Class({
    // A Grid creates a couple of lines and labels in a SVG image on the x and
    // y axis. It is used in e.g. Graphs and FrequencyResponses to draw markers
    // and values. Graphs need a parent SVG image do draw into. The base element
    // of a Grid is a SVG group containing all the labels and lines. Grids
    // extend Widget and implements Ranges.
    Extends: Widget,
    Implements: Ranges,
    options: {
        grid_x:  [],    // array containing {pos:x[, color: "colorstring"[,
                        //       class: "classname"[, label:"labeltext"]]]}
        grid_y:  [],    // array containing {pos:y[, color: "colorstring"[,
                        //       class: "classname"[, label:"labeltext"]]]}
        range_x: {},    // callback function returning a Range module for x axis
        range_y: {},    // callback function returning a Range module for y axis
        width:   0,     // the width of the Grid (only use it in set/get)
        height:  0      // the height of the Grid (only use it in set/get)
    },
    __last: 0,
    initialize: function (options, hold) {
        this.parent(options);
        this.element = this.widgetize(
                       makeSVG("g", {"class": "toolkit-grid"}), true, true);
        if (this.options.container)
            this.set("container", this.options.container);
        this.add_range(this.options.range_x, "range_x");
        this.add_range(this.options.range_y, "range_y");
        if(this.options.width)
            this.set("width", this.optoins.width);
        if(this.options.height)
            this.set("height", this.optoins.width);
        this.range_x.addEvent("set", function (key, value, hold) {
            if (!hold) this.redraw();
        }.bind(this));
        this.range_y.addEvent("set", function (key, value, hold) {
            if (!hold) this.redraw();
        }.bind(this));
        if (!hold) this.redraw();
        this.initialized();
    },
    
    redraw: function () {
        this.element.empty();
        this.__last = 0;
        for (var i = 0; i < this.options.grid_x.length; i++) {
            this._draw_line(this.options.grid_x[i], 0);
        }
        this.__last = this.range_y.options.basis;
        for (var i = 0; i < this.options.grid_y.length; i++) {
            this._draw_line(this.options.grid_y[i], 1);
        }
        this.parent();
    },
    destroy: function () {
        this.element.destroy();
        this.parent();
    },
    // HELPERS & STUFF
    _draw_line: function (obj, mode) {
        // draw a line with label. obj contains pos, class and label
        var m = 0;
        if (obj.label) {
            var label = makeSVG("text");
            label.set("text", obj.label);
            label.set("style", "dominant-baseline: central;");
            label.addClass("toolkit-grid-label "
                + (mode ? "toolkit-horizontal" : "toolkit-vertical"));
            if (obj["class"]) label.addClass(obj["class"]);
            label.inject(this.element);
            var w  = this.range_x.options.basis;
            var h  = this.range_y.options.basis;
            var tw = label.getBBox().width;
            var th = label.getBBox().height;
            var p  = label.getStyle("padding").split(" ");
            var pt = p[0].toInt() || 0;
            var pr = p[1].toInt() || 0;
            var pb = p[2].toInt() || 0;
            var pl = p[3].toInt() || 0;
            var x  = mode ? w - tw - pl : Math.max(pl, Math.min(w - tw - pl,
                            this.range_x.val2px(obj.pos) - tw / 2));
            var y  = mode ? Math.max(th / 2, Math.min(h - th / 2 - pt,
                            this.range_y.val2px(obj.pos))) : h-th/2-pt;
            if (mode && y > this.__last || !mode && x < this.__last) {
                label.destroy();
            } else {
                label.set("x", x);
                label.set("y", y);
                m = mode ? tw + pl + pr : th + pt + pb;
                this.__last = mode ? y - th : x + tw;
            }
        }
        
        if ((mode && obj.pos == this.range_y.options.min)
        || ( mode && obj.pos == this.range_y.options.max)
        || (!mode && obj.pos == this.range_x.options.min)
        || (!mode && obj.pos == this.range_x.options.max))
            return;
            
        var line = makeSVG("path");
        line.addClass("toolkit-grid-line "
            + (mode ? "toolkit-horizontal" : "toolkit-vertical"));
        if (obj["class"]) line.addClass(obj["class"]);
        if (obj.color) line.set("style", "stroke:" + obj.color);
        if (mode) {
            // line from left to right
            line.set("d", "M0 " + Math.round(this.range_y.val2px(obj.pos))
                + ".5 L"  + (this.range_x.options.basis - m) + " "
                + Math.round(this.range_y.val2px(obj.pos)) + ".5");
        } else {
            // line from top to bottom
            line.set("d", "M" + Math.round(this.range_x.val2px(obj.pos))
                + ".5 0 L"  + Math.round(this.range_x.val2px(obj.pos))
                + ".5 " + (this.range_y.options.basis - m));
        }
        line.inject(this.element);
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "grid_x":
            case "grid_y":
                this.fireEvent("gridchanged");
                if (!hold) this.redraw();
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
 
