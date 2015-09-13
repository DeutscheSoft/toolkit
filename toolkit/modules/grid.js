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
(function(w) {
w.Grid = $class({
    // A Grid creates a couple of lines and labels in a SVG image on the x and
    // y axis. It is used in e.g. Graphs and FrequencyResponses to draw markers
    // and values. Graphs need a parent SVG image do draw into. The base element
    // of a Grid is a SVG group containing all the labels and lines. Grids
    // extend Widget and implements Ranges.
    _class: "Grid",
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
    initialize: function (options, hold) {
        this.__last = 0;
        Widget.prototype.initialize.call(this, options);
        this.element = this.widgetize(
                       TK.make_svg("g", {"class": "toolkit-grid"}), true, true, true);
        if (this.options.container)
            this.set("container", this.options.container);
        this.add_range(this.options.range_x, "range_x");
        this.add_range(this.options.range_y, "range_y");
        if (this.options.width)
            this.set("width", this.options.width);
        if (this.options.height)
            this.set("height", this.options.width);
        this.range_x.add_event("set", function (key, value, hold) {
            if (!hold) this.redraw();
        }.bind(this));
        this.range_y.add_event("set", function (key, value, hold) {
            if (!hold) this.redraw();
        }.bind(this));
        if (!hold) this.redraw();
        Widget.prototype.initialized.call(this);
    },
    
    redraw: function () {
        TK.empty(this.element);
        this.__last = 0;
        for (var i = 0; i < this.options.grid_x.length; i++) {
            this._draw_line(this.options.grid_x[i], 0);
        }
        this.__last = this.range_y.options.basis;
        for (var i = 0; i < this.options.grid_y.length; i++) {
            this._draw_line(this.options.grid_y[i], 1);
        }
        Widget.prototype.redraw.call(this);
    },
    destroy: function () {
        TK.destroy(this.element);
        Widget.prototype.destroy.call(this);
    },
    // HELPERS & STUFF
    _draw_line: function (obj, mode) {
        // draw a line with label. obj contains pos, class and label
        var m = 0;
        if (obj.label) {
            var label = TK.make_svg("text");
            label.textContent = obj.label;
            label.style["dominant-baseline"] = "central";
            TK.add_class(label, "toolkit-grid-label");
            TK.add_class(label, mode ? "toolkit-horizontal" : "toolkit-vertical");
            if (obj["class"]) TK.add_class(label, obj["class"]);

            this.element.appendChild(label);

            var w  = this.range_x.options.basis;
            var h  = this.range_y.options.basis;
            var tw = label.getBBox().width;
            var th = label.getBBox().height;
            var p  = TK.get_style(label, "padding").split(" ");
            if (p.length < 2)
                p[1] = p[2] = p[3] = p[0];
            if (p.length < 3)
                p[2] = p[0]; p[3] = p[1];
            if (p.length < 4)
                p[3] = p[1];
            var pt = parseInt(p[0]) || 0;
            var pr = parseInt(p[1]) || 0;
            var pb = parseInt(p[2]) || 0;
            var pl = parseInt(p[3]) || 0;
            var x  = mode ? w - tw - pl : Math.max(pl, Math.min(w - tw - pl,
                            this.range_x.val2px(obj.pos, true) - tw / 2));
            var y  = mode ? Math.max(th / 2, Math.min(h - th / 2 - pt,
                            this.range_y.val2px(obj.pos, true))) : h-th/2-pt;
            if (mode && y > this.__last || !mode && x < this.__last) {
                label.destroy();
            } else {
                label.setAttribute("x", x);
                label.setAttribute("y", y);
                m = mode ? tw + pl + pr : th + pt + pb;
                this.__last = mode ? y - th : x + tw;
            }
        }
        
        if ((mode && obj.pos == this.range_y.options.min)
        || ( mode && obj.pos == this.range_y.options.max)
        || (!mode && obj.pos == this.range_x.options.min)
        || (!mode && obj.pos == this.range_x.options.max))
            return;
            
        var line = TK.make_svg("path");
        TK.add_class(line, "toolkit-grid-line");
        TK.add_class(line, mode ? "toolkit-horizontal" : "toolkit-vertical");
        if (obj["class"]) TK.add_class(line, obj["class"]);
        if (obj.color) line.setAttribute("style", "stroke:" + obj.color);
        if (mode) {
            // line from left to right
            line.setAttribute("d", "M0 " + Math.round(this.range_y.val2px(obj.pos, true))
                + ".5 L"  + (this.range_x.options.basis - m) + " "
                + Math.round(this.range_y.val2px(obj.pos, true)) + ".5");
        } else {
            // line from top to bottom
            line.setAttribute("d", "M" + Math.round(this.range_x.val2px(obj.pos, true))
                + ".5 0 L"  + Math.round(this.range_x.val2px(obj.pos, true))
                + ".5 " + (this.range_y.options.basis - m));
        }
        this.element.appendChild(line);
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "grid_x":
            case "grid_y":
                this.fire_event("gridchanged");
                if (!hold) this.redraw();
                break;
            case "width":
                this.range_x.set("basis", value, hold);
                break;
            case "height":
                this.range_y.set("basis", value, hold);
                break;
        }
        Widget.prototype.set.call(this, key, value, hold);
    }
});
})(this);
