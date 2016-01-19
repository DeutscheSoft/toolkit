 /* toolkit provides different widgets, implements and modules for 
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
"use strict";
(function(w){ 
// HELPERS & STUFF
function draw_key() {
    var __key, bb;
    TK.empty(this._key_txt);
    TK.empty(this._key);
    
    if (this.options.key === false) {
        this._key.style["display"] = "none";
        this._key_background.style["display"] = "none";
        return;
    }
    
    this._key.appendChild(this._key_txt);
    
    var disp = "none";
    var gpad = {
        top:    parseInt(TK.get_style(this._key, "padding-top")) || 0,
        right:  parseInt(TK.get_style(this._key, "padding-right")) || 0,
        bottom: parseInt(TK.get_style(this._key, "padding-bottom")) || 0,
        left:   parseInt(TK.get_style(this._key, "padding-left")) || 0
    }
    var gmarg = {
        top:    parseInt(TK.get_style(this._key, "margin-top")) || 0,
        right:  parseInt(TK.get_style(this._key, "margin-right")) || 0,
        bottom: parseInt(TK.get_style(this._key, "margin-bottom")) || 0,
        left:   parseInt(TK.get_style(this._key, "margin-left")) || 0
    }
    var c   = 0;
    var w   = 0;
    var top = 0;
    var lines = [];
    for (var i = 0; i < this.graphs.length; i++) {
        if (this.graphs[i].get("key") !== false) {
            var t = TK.make_svg("tspan", {"class": "toolkit-label",
                                     style: "dominant-baseline: central;"
            });
            t.textContent = this.graphs[i].get("key");
            t.setAttribute("x", gpad.left);
            this._key_txt.appendChild(t);
            
            if (!bb) bb = this._key.getBoundingClientRect();
            top += c ? parseInt(TK.get_style(t, "line-height")) : gpad.top;
            t.setAttribute("y", top + bb.height / 2);
            
            lines.push({
                x:       (parseInt(TK.get_style(t, "margin-right")) || 0),
                y:       Math.round(top),
                width:   Math.round(bb.width),
                height:  Math.round(bb.height),
                "class": this.graphs[i].element.getAttribute("class"),
                color:   (this.graphs[i].element.getAttribute("color") || ""),
                style:   this.graphs[i].element.getAttribute("style")
            })
            w = Math.max(w, t.getComputedTextLength());
            disp = "block";
            c++;
        }
    }
    for (var i = 0; i < lines.length; i++) {
        var b = TK.make_svg("rect", {
            "class": lines[i]["class"] + " toolkit-rect",
            color:   lines[i].color,
            style:   lines[i].style,
            x:       lines[i].x + 0.5 + w + gpad.left,
            y:       lines[i].y + 0.5 + parseInt(lines[i].height / 2 - this.options.key_size.y / 2),
            height:  this.options.key_size.y,
            width:   this.options.key_size.x
        });
        this._key.appendChild(b);
    }
    this._key_background.style["display"] = disp;
    this._key.style["display"] = disp;
    
    bb = this._key.getBoundingClientRect();
    var width  = this.range_x.options.basis;
    var height = this.range_y.options.basis;
    
    switch (this.options.key) {
        case _TOOLKIT_TOP_LEFT:
            __key = {
                x1: gmarg.left,
                y1: gmarg.top,
                x2: gmarg.left + parseInt(bb.width) + gpad.left + gpad.right,
                y2: gmarg.top + parseInt(bb.height) + gpad.top + gpad.bottom
            }
            break;
        case _TOOLKIT_TOP_RIGHT:
            __key = {
                x1: width - gmarg.right - parseInt(bb.width) - gpad.left - gpad.right,
                y1: gmarg.top,
                x2: width - gmarg.right,
                y2: gmarg.top + parseInt(bb.height) + gpad.top + gpad.bottom
            }
            break;
        case _TOOLKIT_BOTTOM_LEFT:
            __key = {
                x1: gmarg.left,
                y1: height - gmarg.bottom - parseInt(bb.height) - gpad.top - gpad.bottom,
                x2: gmarg.left + parseInt(bb.width) + gpad.left + gpad.right,
                y2: height - gmarg.bottom
            }
            break;
        case _TOOLKIT_BOTTOM_RIGHT:
            __key = {
                x1: width - gmarg.right - parseInt(bb.width) - gpad.left - gpad.right,
                y1: height -gmarg.bottom - parseInt(bb.height) - gpad.top - gpad.bottom,
                x2: width - gmarg.right,
                y2: height - gmarg.bottom
            }
            break;
    }
    this._key.setAttribute("transform", "translate(" + __key.x1 + "," + __key.y1 + ")");
    this._key_background.setAttribute("x", __key.x1);
    this._key_background.setAttribute("y", __key.y1);
    this._key_background.setAttribute("width", __key.x2 - __key.x1);
    this._key_background.setAttribute("height", __key.y2 - __key.y1);
}
function draw_title() {
    var _title  = this._title;
    _title.textContent = this.options.title;

    /* FORCE_RELAYOUT */
    TK.S.add(function() {
        var mtop    = parseInt(TK.get_style(_title, "margin-top") || 0);
        var mleft   = parseInt(TK.get_style(_title, "margin-left") || 0);
        var mbottom = parseInt(TK.get_style(_title, "margin-bottom") || 0);
        var mright  = parseInt(TK.get_style(_title, "margin-right") || 0);
        var bb      = _title.getBoundingClientRect();
        var x,y,anchor, range_x = this.range_x, range_y = this.range_y;
        switch (this.options.title_position) {
            case _TOOLKIT_TOP_LEFT:
                anchor = "start";
                x = mleft;
                y = mtop + bb.height / 2;
                break;
            case _TOOLKIT_TOP:
                anchor = "middle";
                x = range_x.options.basis / 2;
                y = mtop + bb.height / 2;
                break;
            case _TOOLKIT_TOP_RIGHT:
                anchor = "end";
                x = range_x.options.basis - mright;
                y = mtop + bb.height / 2;
                break;
            case _TOOLKIT_LEFT:
                anchor = "start";
                x = mleft;
                y = range_y.options.basis / 2;
                break;
            case _TOOLKIT_CENTER:
                anchor = "middle";
                x = range_x.options.basis / 2;
                y = range_y.options.basis / 2;
                break;
            case _TOOLKIT_RIGHT:
                anchor = "end";
                x = range_x.options.basis - mright;
                y = range_y.options.basis / 2;
                break;
            case _TOOLKIT_BOTTOM_LEFT:
                anchor = "start";
                x = mleft;
                y = range_y.options.basis - mtop - bb.height / 2;
                break;
            case _TOOLKIT_BOTTOM:
                anchor = "middle";
                x = range_x.options.basis / 2;
                y = range_y.options.basis - mtop - bb.height / 2;
                break;
            case _TOOLKIT_BOTTOM_RIGHT:
                anchor = "end";
                x = range_x.options.basis - mright;
                y = range_y.options.basis - mtop - bb.height / 2;
                break;
        }
        TK.S.add(function() {
            _title.setAttribute("text-anchor", anchor);
            _title.setAttribute("x", x);
            _title.setAttribute("y", y);
        });
    }.bind(this), 1);
}
    
w.TK.Chart = w.Chart = $class({
    /** @class Chart
     * @description Chart is an SVG image containing one or more Graphs. There are functions
     * to add and remove graphs. Chart extends Widget and contains a Grid
     * and two Ranges.
     */
    _class: "Chart",
    Extends: Widget,
    Implements: Ranges,
    _options: Object.assign(Object.create(Widget.prototype._options), {
        grid_x: "array",
        grid_y: "array",
        width: "int",
        height: "height",
        range_x: "object",
        range_y: "object",
        key: "string",
        key_size: "object",
        title: "string",
        title_position: "int",
    }),
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
    initialize: function (options) {
        var E, S;
        this.graphs = [];
        Widget.prototype.initialize.call(this, options);
        
        this.add_range(this.options.range_x, "range_x");
        this.add_range(this.options.range_y, "range_y");
        this.range_y.set("reverse", true, true, true);
        
        if (!(E = this.element)) this.element = E = TK.element("div");
        this.svg = S = TK.make_svg("svg");

        TK.add_class(E, "toolkit-chart");

        S.setAttribute("width", this.range_x.options.basis);
        S.setAttribute("height", this.range_y.options.basis);

        this.widgetize(E, true, true, true);
        if (this.options.container)
            this.set("container", this.options.container);
        if (!this.options.width)
            this.options.width = this.range_x.options.basis;
        if (!this.options.height)
            this.options.height = this.range_y.options.basis;
        
        this.grid = new Grid({
            grid_x: this.options.grid_x,
            grid_y: this.options.grid_y,
            range_x: function () { return this.range_x; }.bind(this),
            range_y: function () { return this.range_y; }.bind(this),
            container: S
        });
        this.add_child(this.grid);
        
        this._title = TK.make_svg("text", {
            "class": "toolkit-title",
            style: "dominant-baseline: central;"
        });
        S.appendChild(this._title);
        
        this._graphs = TK.make_svg("g", {"class": "toolkit-graphs"});
        S.appendChild(this._graphs);
        
        var redraw_cb = this.trigger_draw.bind(this);

        this.range_x.add_event("set", redraw_cb);
        this.range_y.add_event("set", redraw_cb); 
        
        this._key_background = TK.make_svg("rect",
            {"class": "toolkit-background"});
        this._key = TK.make_svg("g", {"class": "toolkit-key"});
        this._key_txt = TK.make_svg("text");

        S.appendChild(this._key_background);
        S.appendChild(this._key);
        S.appendChild(this._key_txt);
        E.appendChild(S);
        
        this._key_background.addEventListener("mouseenter", function () {
                TK.add_class(this._key, "toolkit-hover");
                TK.add_class(this._key_background, "toolkit-hover");
            }.bind(this));
        this._key_background.addEventListener("mouseleave", function () {
                TK.remove_class(this._key, "toolkit-hover");
                TK.remove_class(this._key_background, "toolkit-hover");
            }.bind(this));
        this.set("width", this.options.width);
        this.set("height", this.options.height);
    },
    resize: function () {
        var E = this.element;
        var O = this.options;

        Widget.prototype.resize.call(this);

        var w, h;
        w = E.clientWidth;
        h = E.clientHeight;

        if (O.width != w) this.set("width", w);
        if (O.height != w) this.set("height", h);
    },
    redraw: function () {
        var I = this.invalid;
        var E = this.svg;

        Widget.prototype.redraw.call(this);

        if (I.width || I.height || I.ranges) {
            I.ranges = true;
            var w = this.range_x.get("basis") + "px";
            var h = this.range_y.get("basis") + "px";
            E.setAttribute("width", w);
            E.setAttribute("height", h);
        }

        if (I.graphs) {
            for (var i = 0; i < this.graphs.length; i++) {
                this.graphs[i].redraw();
            }
        }
        if (I.validate("width", "height", "title", "title_position")) {
            draw_title.call(this);
        }
        if (I.validate("key", "key_size", "graphs")) {
            draw_key.call(this);
        }
    },
    destroy: function () {
        for (var i = 0; i < this._graphs.length; i++) {
            this._graphs[i].destroy();
        }
        this._graphs.remove();
        this.element.remove();
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
        g.add_event("set", function (key, value, obj) {
            if (key == "color" || key == "class" || key == "key") {
                this.invalid.graphs = true;
                this.trigger_draw();
            }
        }.bind(this));
        this.fire_event("graphadded", g, this.graphs.length - 1);

        this.invalid.graphs = true;
        this.trigger_draw();
        this.add_child(g);
        return g;
    },
    remove_graph: function (g) {
        // Remove a certain Graph from the Chart
        var i;
        if ((i = this.graphs.indexOf(g)) !== -1) {
            this.fire_event("graphremoved", this.graphs[i], i);
            this.graphs[i].destroy();
            this.graphs.splice(i, 1);
            this.invalid.graphs = true;
            this.trigger_draw();
        }
    },
    empty: function () {
        // Remove all Graphs from the Chart
        this.graphs.map(this.remove_graph, this);
        this.fire_event("emptied");
    },
    
    // GETTER & SETER
    set: function (key, value) {
        value = Widget.prototype.set.call(this, key, value);
        switch (key) {
            case "grid_x":
                this.grid.set("grid_x", value);
                break;
            case "grid_y":
                this.grid.set("grid_y", value);
                break;
            case "width":
                this.range_x.set("basis", value);
                break;
            case "height":
                this.range_y.set("basis", value);
                break;
        }
        return value;
    }
});
})(this);
