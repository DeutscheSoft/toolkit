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
 
var Graph = $class({
    // Graph is a single SVG path element. It provides some functions to easily
    // draw paths inside Charts and other derivates.
    _class: "Graph",
    Extends: Widget,
    Implements: Ranges,
    options: {
        dots:      [],    // can be ready-to-use string or array of objects
                          // {x: x, y: y [, x1, y1, x2, y2]}
        type:      "L",   // type of the graph (needed values in dots object):
                          //     L = normal (needs x,y)
                          //     T = smooth quadratic Bézier (needs x, y)
                          //     H[n] = smooth horizontal; [n] = smoothing
                          //            factor between 1 (square) and 5
                          //            (nearly no smooth)
                          //     Q = quadratic Bézier (needs: x1, y1, x, y)
                          //     C = CurveTo (needs: x1, y1, x2, y2, x, y)
                          //     S = SmoothCurve (needs: x1, y1, x, y)
        mode:      _TOOLKIT_LINE,     // mode of the graph:
                          //     _TOOLKIT_LINE: line
                          //     _TOOLKIT_BOTTOM: filled below the line
                          //     _TOOLKIT_TOP: filled above the line
                          //     _TOOLKIT_CENTER: filled from the middle of the
                          //                      canvas
                          //     _TOOLKIT_VARIABLE: filled from a percentual
                          //                        position on the canvas
        base:      0,     // if mode is variable set the base line
        color:     "",    // set the color of the path
        range_x:   {},    // callback function returning a Range module
                          // for x axis or an object with options for a Range
        range_y:   {},    // callback function returning a Range module
                          // for y axis or an object with options for a Range
        width:     0,     // the width of the Graph
        height:    0,     // the height of the Graph
        key:       false  // draw a description for this graph in the charts key
    },
    
    initialize: function (options) {
        Widget.prototype.initialize.call(this, options);
        this.element = this.widgetize(TK.make_svg("path"), true, true, true);
        this.element.setAttribute("class", "toolkit-graph");
        this.add_range(this.options.range_x, "range_x");
        this.add_range(this.options.range_y, "range_y");
        if (this.options.container)
            this.set("container", this.options.container);
        
        this.set("color", this.options.color);
        this.set("mode",  this.options.mode);
        
        this.range_x.add_event("set", this.redraw.bind(this));
        this.range_y.add_event("set", this.redraw.bind(this));
        
        if (this.options.dots.length)
            this.redraw();
        Widget.prototype.initialized.call(this);
    },
    
    redraw: function () {
        var a = 0.5;
        var w = this.range_x.options.basis;
        var h = this.range_y.options.basis;
        
        var s = "";
        var init;

        if (typeof this.options.dots == "string") {
            this.element.setAttribute("d", this.options.dots);
            return;
        }
        
        if (typeof this.options.dots[0] != "undefined") {
            var _s = this._start(this.options.dots[0])
            if (_s) {
                s += _s;
                init = true;
            }
        }
        for (var _d = 0; _d < this.options.dots.length; _d ++) {
            var d  = this.options.dots[_d];
            var t = init ? this.options.type : "T";
            switch (t.substr(0,1)) {
                case "L":
                case "T":
                    // line to and smooth quadric bezier
                    var _t = init ? " " + t : "M";
                    var _x = (this.range_x.val2px(d.x, true) + a);
                    var _y = (this.range_y.val2px(d.y, true) + a);
                    s += _t + " " + _x + " " + _y;
                    break;
                case "Q":
                case "S":
                    // cubic bezier with reflection (S)
                    // and smooth quadratic bezier with reflection of beforehand
                    var _x = (this.range_x.val2px(d.x, true) + a);
                    var _y = (this.range_y.val2px(d.y, true) + a);
                    var _x1 = (this.range_x.val2px(d.x1, true) + a);
                    var _y1 = (this.range_y.val2px(d.y1, true) + a);
                    s += " " + t + _x1 + "," + _y1 + " " + _x + "," + _y;
                    break;
                case "C":
                    // cubic bezier
                    var _t = init ? " " + t : "M";
                    var _x = (this.range_x.val2px(d.x, true) + a);
                    var _y = (this.range_y.val2px(d.y, true) + a);
                    var _x1 = (this.range_x.val2px(d.x1, true) + a);
                    var _y1 = (this.range_y.val2px(d.y1, true) + a);
                    var _x2 = (this.range_x.val2px(d.x2, true) + a);
                    var _y2 = (this.range_y.val2px(d.y2, true) + a);
                    s += t_ + " " + _x1 + "," + _y1 + " " + _x2 + "," + _y2 + " "
                         + _x + "," + _y;
                    break;
                case "H":
                    var f = t.substr(1) ? parseFloat(t.substr(1)) : 3;
                    var _x = (this.range_x.val2px(d.x, true));
                    var _y = _y1 = (this.range_y.val2px(d.y, true) + a);
                    if (_d && _d != (this.options.dots.length - 1)) {
                        var _q = this.range_x.val2px(
                                 this.options.dots[_d - 1].x, true);
                        var _x1 =  (_x - Math.round((_x - _q) / f) + a);
                    } else {
                        var _x1 = _x;
                    }
                    s += " S" + _x1 + "," + _y1 + " " + _x + "," + _y;
                    break;
            }
            init = true;
        }
        if (typeof this.options.dots[this.options.dots.length-1] != "undefined") {
            var _s = this._end(this.options.dots[this.options.dots.length - 1])
            if (_s)
                s += _s;
        }
        if (s) {
            this.element.setAttribute("d", s);
        }
        Widget.prototype.redraw.call(this);
    },
    destroy: function () {
        TK.destroy(this.element);
        Widget.prototype.destroy.call(this);
    },
    
    // HELPERS & STUFF
    _start: function (d) {
        var a = ".5";
        var w = this.range_x.options.basis;
        var h = this.range_y.options.basis;
        var t = this.options.type;
        var m = this.options.mode;
        var s = "";
        switch (m) {
            case _TOOLKIT_BOTTOM:
                // fill the lower part of the graph
                s += "M " + (this.range_x.val2px(d.x, true) - 1) + " ";
                s += (h + 1) + a + " " + t + " ";
                s += (this.range_x.val2px(d.x, true) - 1 + a) + " ";
                s += (this.range_y.val2px(d.y, true) + a);
                return s;
            case _TOOLKIT_TOP:
                // fill the upper part of the graph
                s += "M " + (this.range_x.val2px(d.x, true) - 1) + " " + (-1 + a);
                s += " " + t + " " + (this.range_x.val2px(d.x, true) - 1 + a) + " "
                s += (this.range_y.val2px(d.y, true) + a);
                return s;
            case _TOOLKIT_CENTER:
                // fill from the mid
                s += "M " + (this.range_x.val2px(d.x, true) - 1 + a) + " ";
                s += (0.5 * h) + a;
                return s;
            case _TOOLKIT_VARIABLE:
                // fill from variable point
                s += "M " + (this.range_x.val2px(d.x, true) - 1 + a) + " ";
                s += ((-this.options.base + 1) * h + a);
                return s;
        }
        return false;
    },
    _end: function (d) {
        var a = ".5";
        var h = this.range_y.options.basis;
        var t = this.options.type;
        var m = this.options.mode;
        switch (m) {
            case _TOOLKIT_BOTTOM:
                // fill the graph below
                return " " + t + " " + (this.range_x.val2px(d.x, true) + a) + " "
                       + parseInt(h + 1) + a + " Z";
            case _TOOLKIT_TOP:
                // fill the upper part of the graph
                return " " + t + " " + (this.range_x.val2px(d.x, true) + 1 + a)
                       + " -1" + a + " Z";
            case _TOOLKIT_CENTER:
                // fill from mid
                return " " + t + " " + (this.range_x.val2px(d.x, true) + 1 + a) + " "
                       + (0.5 * h) + a + " Z";
            case _TOOLKIT_VARIABLE:
                // fill from variable point
                return " " + t + " " + (this.range_x.val2px(d.x, true) + 1 + a) + " "
                       + ((-m + 1) * h) + a + " Z";
        }
        return "";
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "width":
                this.range_x.set("basis", value, hold);
                break;
            case "height":
                this.range_y.set("basis", value, hold);
                break;
            case "dots":
                if (!hold) this.redraw();
                this.fire_event("graphchanged");
                break;
            case "color":
                if (!hold) this.element.style["stroke"] = value;
                break;
            case "mode":
                if (!hold) {
                    TK.remove_class(this.element, "toolkit-filled");
                    TK.remove_class(this.element, "toolkit-outline");
                    TK.add_class(this.element, value == _TOOLKIT_LINE ?
                                              "toolkit-outline" : "toolkit-filled");
                    this.redraw();
                }
                break;
            case "type":
                if (!hold) this.redraw();
                break;
        }
        Widget.prototype.set.call(this, key, value, hold);
    }
});
