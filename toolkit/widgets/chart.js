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
 
var Chart = new Class({
    // Chart is an SVG image containing one or more Graphs. There are functions
    // to add and remove graphs. Chart extends Widget and contains a Grid
    // and two Ranges.
    _class: "Chart",
    
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
        key: false,  // key draws a description for the graphs at the given
                     // position, use false for no key
        key_size: {x:20, y:10}, // size of the key rects
        title:   "", // a title for the chart
        title_position: _TOOLKIT_TOP_RIGHT // the position of the title
    },
    graphs: [],
    initialize: function (options, hold) {
        Widget.prototype.initialize.call(this, options, hold);
        
        this.add_range(this.options.range_x, "range_x");
        this.add_range(this.options.range_y, "range_y");
        this.range_y.set("reverse", true, true, true);
        
        if (this.options.width)
            this.set("width", this.options.width, true);
        if (this.options.height)
            this.set("height", this.options.height, true);
        
        this.element = this.widgetize(makeSVG("svg", {
            width:  this.range_x.options.basis,
            height: this.range_y.options.basis
        }), true, true, true);
        this.element.addClass("toolkit-chart");
        if (this.options.container)
            this.set("container", this.options.container);
        
        this.grid = new Grid({
            grid_x: this.options.grid_x,
            grid_y: this.options.grid_y,
            range_x: function () { return this.range_x; }.bind(this),
            range_y: function () { return this.range_y; }.bind(this),
            container: this.element
        });
        
        this._title = makeSVG("text", {
            "class": "toolkit-title",
            style: "dominant-baseline: central;"
        });
        this._title.inject(this.element);
        
        this._graphs = makeSVG("g", {"class": "toolkit-graphs"});
        this._graphs.inject(this.element);
        
        this.range_x.add_event("set", function (key, value, hold) {
            if (!hold) this.redraw();
        }.bind(this));
        this.range_y.add_event("set", function (key, value, hold) {
            if (!hold) this.redraw();
        }.bind(this));
        
        
        
        this._key_background = makeSVG("rect",
            {"class": "toolkit-background"});
        this._key_background.inject(this.element);
        this._key = makeSVG("g", {"class": "toolkit-key"});
        this._key.inject(this.element);
        this._key_txt = makeSVG("text");
        this._key_txt.inject(this._key);
        
        this._key_background.addEventListener("mouseenter", function () {
                this._key.addClass("toolkit-hover");
                this._key_background.addClass("toolkit-hover");
            }.bind(this));
        this._key_background.addEventListener("mouseleave", function () {
                this._key.removeClass("toolkit-hover");
                this._key_background.removeClass("toolkit-hover");
            }.bind(this));
        
        this.set("title", this.options.title, true);
        this.set("title_position", this.options.title_position);
        
        this.initialized();
    },
    redraw: function (graphs, grid) {
        var w = this.range_x.get("basis") + "px";
        var h = this.range_y.get("basis") + "px";
        this.element.setAttribute("width", w);
        this.element.setAttribute("height", h);
        this.element.style.width = w;
        this.element.style.height = h;
        if (grid) {
            this.grid.redraw();
        }
        if (graphs) {
            for (var i = 0; i < this.graphs.length; i++) {
                this.graphs[i].redraw();
            }
        }
        this._draw_key();
        Widget.prototype.redraw.call(this);
    },
    destroy: function () {
        for (var i = 0; i < this._graphs.length; i++) {
            this._graphs[i].destroy();
        }
        this._graphs.destroy();
        this.element.destroy();
        Widget.prototype.destroy.call(this);
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
        g.add_event("set", function (key, value, hold, obj) {
            if (key == "color" || key == "class" || key == "key")
                if (!hold) this._draw_key();
        }.bind(this));
        this.fire_event("graphadded");
        return g;
    },
    remove_graph: function (g) {
        // Remove a certain Graph from the Chart
        for (var i = 0; i < this.graphs.length; i++) {
            if (this.graphs[i] == g) {
                this.graphs[i].destroy();
                this.graphs.splice(i, 1);
                this.fire_event("graphremoved");
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
        this.fire_event("emptied");
    },
    
    // HELPERS & STUFF
    _draw_key: function () {
        this._key_txt.empty();
        this._key.empty();
        
        if (this.options.key === false) {
            this._key.style["display"] = "none";
            this._key_background.style["display"] = "none";
            this.__key = {x1: 0, x2: 0, y1: 0, y2: 0};
            return;
        }
        
        this._key_txt.inject(this._key);
        
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
        var c   = 0;
        var w   = 0;
        var top = 0;
        var lines = [];
        for (var i = 0; i < this.graphs.length; i++) {
            if (this.graphs[i].get("key") !== false) {
                var t = makeSVG("tspan", {"class": "toolkit-label",
                                         style: "dominant-baseline: central;"
                });
                t.inject(this._key_txt);
                t.set("text", this.graphs[i].get("key"));
                t.set("x", gpad.left);
                
                if (!bb) bb = this._key.getBoundingClientRect();
                top += c ? t.getStyle("line-height").toInt() : gpad.top;
                t.set("y", top + bb.height / 2);
                
                lines.push({
                    x:       (t.getStyle("margin-right").toInt() || 0),
                    y:       Math.round(top),
                    width:   Math.round(bb.width),
                    height:  Math.round(bb.height),
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
                "class": lines[i]["class"] + " toolkit-rect",
                color:   lines[i].color,
                style:   lines[i].style,
                x:       lines[i].x + 0.5 + w + gpad.left,
                y:       lines[i].y + 0.5 + parseInt(lines[i].height / 2 - this.options.key_size.y / 2),
                height:  this.options.key_size.y,
                width:   this.options.key_size.x
            });
            b.inject(this._key);
        }
        this._key_background.style["display"] = disp;
        this._key.style["display"] = disp;
        
        var bb     = this._key.getBoundingClientRect();
        var width  = this.range_x.options.basis;
        var height = this.range_y.options.basis;
        
        switch (this.options.key) {
            case _TOOLKIT_TOP_LEFT:
                this.__key = {
                    x1: gmarg.left,
                    y1: gmarg.top,
                    x2: gmarg.left + parseInt(bb.width) + gpad.left + gpad.right,
                    y2: gmarg.top + parseInt(bb.height) + gpad.top + gpad.bottom
                }
                break;
            case _TOOLKIT_TOP_RIGHT:
                this.__key = {
                    x1: width - gmarg.right - parseInt(bb.width) - gpad.left - gpad.right,
                    y1: gmarg.top,
                    x2: width - gmarg.right,
                    y2: gmarg.top + parseInt(bb.height) + gpad.top + gpad.bottom
                }
                break;
            case _TOOLKIT_BOTTOM_LEFT:
                this.__key = {
                    x1: gmarg.left,
                    y1: height - gmarg.bottom - parseInt(bb.height) - gpad.top - gpad.bottom,
                    x2: gmarg.left + parseInt(bb.width) + gpad.left + gpad.right,
                    y2: height - gmarg.bottom
                }
                break;
            case _TOOLKIT_BOTTOM_RIGHT:
                this.__key = {
                    x1: width - gmarg.right - parseInt(bb.width) - gpad.left - gpad.right,
                    y1: height -gmarg.bottom - parseInt(bb.height) - gpad.top - gpad.bottom,
                    x2: width - gmarg.right,
                    y2: height - gmarg.bottom
                }
                break;
        }
        this._key.set("transform", "translate(" + this.__key.x1 + "," + this.__key.y1 + ")");
        this._key_background.set("x", this.__key.x1);
        this._key_background.set("y", this.__key.y1);
        this._key_background.set("width", this.__key.x2 - this.__key.x1);
        this._key_background.set("height", this.__key.y2 - this.__key.y1);
    },
    _draw_title: function () {
        this._title.set("text", this.options.title);
        var mtop    = (this._title.getStyle("margin-top") || 0).toInt();
        var mleft   = (this._title.getStyle("margin-left") || 0).toInt();
        var mbottom = (this._title.getStyle("margin-bottom") || 0).toInt();
        var mright  = (this._title.getStyle("margin-right") || 0).toInt();
        var bb      = this._title.getBoundingClientRect();
        switch (this.options.title_position) {
            case _TOOLKIT_TOP_LEFT:
                this._title.set("text-anchor", "start");
                this._title.set("x", mleft);
                this._title.set("y", mtop + bb.height / 2);
                break;
            case _TOOLKIT_TOP:
                this._title.set("text-anchor", "middle");
                this._title.set("x", this.range_x.options.basis / 2);
                this._title.set("y", mtop + bb.height / 2);
                break;
            case _TOOLKIT_TOP_RIGHT:
                this._title.set("text-anchor", "end");
                this._title.set("x", this.range_x.options.basis - mright);
                this._title.set("y", mtop + bb.height / 2);
                break;
            case _TOOLKIT_LEFT:
                this._title.set("text-anchor", "start");
                this._title.set("x", mleft);
                this._title.set("y", this.range_y.options.basis / 2);
                break;
            case _TOOLKIT_CENTER:
                this._title.set("text-anchor", "middle");
                this._title.set("x", this.range_x.options.basis / 2);
                this._title.set("y", this.range_y.options.basis / 2);
                break;
            case _TOOLKIT_RIGHT:
                this._title.set("text-anchor", "end");
                this._title.set("x", this.range_x.options.basis - mright);
                this._title.set("y", this.range_y.options.basis / 2);
                break;
            case _TOOLKIT_BOTTOM_LEFT:
                this._title.set("text-anchor", "start");
                this._title.set("x", mleft);
                this._title.set("y",
                    this.range_y.options.basis - mtop - bb.height / 2);
                break;
            case _TOOLKIT_BOTTOM:
                this._title.set("text-anchor", "middle");
                this._title.set("x", this.range_x.options.basis / 2);
                this._title.set("y",
                    this.range_y.options.basis - mtop - bb.height / 2);
                break;
            case _TOOLKIT_BOTTOM_RIGHT:
                this._title.set("text-anchor", "end");
                this._title.set("x", this.range_x.options.basis - mright);
                this._title.set("y",
                    this.range_y.options.basis - mtop - bb.height / 2);
                break;
        }
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
                if (!hold) this._draw_title();
                break;
            case "height":
                this.range_y.set("basis", value, hold);
                if (!hold) this._draw_title();
                break;
            case "key":
                if (!hold) this._draw_key();
                break;
            case "key_size":
                if (!hold) this._draw_key();
                break;
            case "title":
            case "title_position":
                if (!hold) this._draw_title();
                break;
        }
        Widget.prototype.set.call(this, key, value, hold);
    }
});
