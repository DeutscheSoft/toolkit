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
w.TK.Graph = w.Graph = $class({
    /**
     * Graph is a single SVG path element. It provides
     * some functions to easily draw paths inside Charts and other
     * derivates.
     *
     * @class TK.Graph
     * @property {Array|string} [options.dots=[]] - The dots of the path. Can be a ready-to-use SVG-path-string or an array of objects like {x: x, y: y [, x1, y1, x2, y2]} (depending on the type)
     * @property {string} [options.type="L"] - Type of the graph (needed values in dots object):
     * L = normal (needs x,y) |
     * T = smooth quadratic Bézier (needs x, y) |
     * H[n] = smooth horizontal, [n] = smoothing factor between 1 (square) and 5 (nearly no smooth) |
     * Q = quadratic Bézier (needs: x1, y1, x, y) |
     * C = CurveTo (needs: x1, y1, x2, y2, x, y) |
     * S = SmoothCurve (needs: x1, y1, x, y)
     * @property {integer} [options.mode=_TOOLKIT_LINE] - Drawing mode of the graph,
     * _TOOLKIT_LINE: line |
     * _TOOLKIT_BOTTOM: fill below the line |
     * _TOOLKIT_TOP: fill above the line |
     * _TOOLKIT_CENTER: fill from the vertical center of the canvas |
     * _TOOLKIT_VARIABLE: fill from a percentual position on the canvas (set with base)
     * @property {number} [options.base=0] - If mode is _TOOLKIT_VARIABLE set the position of the base line to fill from between 0 (bottom) and 1 (top)
     * @property {string} [options.color=""] - Set the color of the path
     * @property {Function|Object} [options.range_x={}] - Callback function returning a #Range module for x axis or an object with options. for a new #Range
     * @property {Function|Object} [options.range_y={}] - Callback function returning a #Range module for y axis or an object with options. for a new #Range
     * @property {number} [options.width=0] - The width of the graph
     * @property {number} [options.height=0] - The height of the graph
     * @property {string|boolean} [options.key=false] - Show a description for this graph in the charts key, false to turn it off
     * @extends TK.Widget
     * @mixes TK.Ranges
     */
    _class: "Graph",
    Extends: Widget,
    Implements: Ranges,
    _options: Object.assign(Object.create(Widget.prototype._options), {
        dots: "array",
        type: "string",
        mode: "int",
        base: "number",
        color: "string",
        range_x: "object",
        range_y: "object",
        width: "number",
        height: "number",
        key: "string",
    }),
    options: {
        dots:      [],
        type:      "L",
        mode:      _TOOLKIT_LINE,
        base:      0,
        color:     "",
        range_x:   {},
        range_y:   {},
        width:     0,
        height:    0,
        key:       false
    },
    
    initialize: function (options) {
        Widget.prototype.initialize.call(this, options);
        this.element = this.widgetize(TK.make_svg("path"), true, true, true);
        TK.add_class(this.element, "toolkit-graph");
        this.add_range(this.options.range_x, "range_x");
        this.add_range(this.options.range_y, "range_y");
        if (this.options.container)
            this.set("container", this.options.container);
        
        this.set("color", this.options.color);
        this.set("mode",  this.options.mode);

        var cb = function() {
            this.invalidate_all();
            this.trigger_draw();
        }.bind(this);
        
        this.range_x.add_event("set", cb);
        this.range_y.add_event("set", cb);
    },
    
    redraw: function () {
        var I = this.invalid;
        var O = this.options;
        var E = this.element;

        if (I.color) {
            I.color = false;
            E.style["stroke"] = O.color;
        }

        if (I.mode) {
            I.mode = false;
                TK.remove_class(E, "toolkit-filled");
                TK.remove_class(E, "toolkit-outline");
                TK.add_class(E, O.mode == _TOOLKIT_LINE ?  "toolkit-outline" : "toolkit-filled");
        }

        if (I.validate("dots", "type", "width", "height")) {
            var a = 0.5;
            var dots = O.dots;
            var range_x = this.range_x;
            var range_y = this.range_y;
            var w = range_x.options.basis;
            var h = range_y.options.basis;
        
            var s;
            var init;


            if (typeof dots === "string") {
                s = dots;
            } else {
                s = "";
                
                if (typeof dots[0] != "undefined") {
                    var _s = this._start(dots[0])
                    if (_s) {
                        s += _s;
                        init = true;
                    }
                }
                var _d, d, t, _t, _x, _y, _x1, _y1, _x2, _y2, f, _q;
                for (_d = 0; _d < dots.length; _d ++) {
                    d  = dots[_d];
                    t = init ? O.type : "T";
                    switch (t.substr(0,1)) {
                        case "L":
                        case "T":
                            // line to and smooth quadric bezier
                            _t = init ? " " + t : "M";
                            _x = (range_x.val2px(d.x) + a);
                            _y = (range_y.val2px(d.y) + a);
                            s += _t + " " + _x + " " + _y;
                            break;
                        case "Q":
                        case "S":
                            // cubic bezier with reflection (S)
                            // and smooth quadratic bezier with reflection of beforehand
                            _x = (range_x.val2px(d.x) + a);
                            _y = (range_y.val2px(d.y) + a);
                            _x1 = (range_x.val2px(d.x1) + a);
                            _y1 = (range_y.val2px(d.y1) + a);
                            s += " " + t + _x1 + "," + _y1 + " " + _x + "," + _y;
                            break;
                        case "C":
                            // cubic bezier
                            _t = init ? " " + t : "M";
                            _x = (range_x.val2px(d.x) + a);
                            _y = (range_y.val2px(d.y) + a);
                            _x1 = (range_x.val2px(d.x1) + a);
                            _y1 = (range_y.val2px(d.y1) + a);
                            _x2 = (range_x.val2px(d.x2) + a);
                            _y2 = (range_y.val2px(d.y2) + a);
                            s += t_ + " " + _x1 + "," + _y1 + " " + _x2 + "," + _y2 + " "
                                 + _x + "," + _y;
                            break;
                        case "H":
                            f = t.substr(1) ? parseFloat(t.substr(1)) : 3;
                            _x = (range_x.val2px(d.x));
                            _y = _y1 = (range_y.val2px(d.y) + a);
                            if (_d && _d != (dots.length - 1)) {
                                _q = range_x.val2px(dots[_d - 1].x);
                                _x1 =  (_x - Math.round((_x - _q) / f) + a);
                            } else {
                                _x1 = _x;
                            }
                            s += " S" + _x1 + "," + _y1 + " " + _x + "," + _y;
                            break;
                    }
                    init = true;
                }
                if (typeof dots[dots.length-1] != "undefined") {
                    _s = this._end(dots[dots.length - 1])
                    if (_s)
                        s += _s;
                }
            }
            if (s) E.setAttribute("d", s);
        }
        Widget.prototype.redraw.call(this);
    },
    destroy: function () {
        this.element.remove();
        Widget.prototype.destroy.call(this);
    },
    
    // HELPERS & STUFF
    _start: function (d) {
        var a = 0.5;
        var w = this.range_x.options.basis;
        var h = this.range_y.options.basis;
        var t = this.options.type;
        var m = this.options.mode;
        var s = "";
        switch (m) {
            case _TOOLKIT_BOTTOM:
                // fill the lower part of the graph
                s += "M " + (this.range_x.val2px(d.x) - 1) + " ";
                s += (h + 1) + a + " " + t + " ";
                s += (this.range_x.val2px(d.x) - 1 + a) + " ";
                s += (this.range_y.val2px(d.y) + a);
                return s;
            case _TOOLKIT_TOP:
                // fill the upper part of the graph
                s += "M " + (this.range_x.val2px(d.x) - 1) + " " + (-1 + a);
                s += " " + t + " " + (this.range_x.val2px(d.x) - 1 + a) + " "
                s += (this.range_y.val2px(d.y) + a);
                return s;
            case _TOOLKIT_CENTER:
                // fill from the mid
                s += "M " + (this.range_x.val2px(d.x) - 1 + a) + " ";
                s += (0.5 * h) + a;
                return s;
            case _TOOLKIT_VARIABLE:
                // fill from variable point
                s += "M " + (this.range_x.val2px(d.x) - 1 + a) + " ";
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
                return " " + t + " " + (this.range_x.val2px(d.x) + a) + " "
                       + parseInt(h + 1) + a + " Z";
            case _TOOLKIT_TOP:
                // fill the upper part of the graph
                return " " + t + " " + (this.range_x.val2px(d.x) + 1 + a)
                       + " -1" + a + " Z";
            case _TOOLKIT_CENTER:
                // fill from mid
                return " " + t + " " + (this.range_x.val2px(d.x) + 1 + a) + " "
                       + (0.5 * h) + a + " Z";
            case _TOOLKIT_VARIABLE:
                // fill from variable point
                return " " + t + " " + (this.range_x.val2px(d.x) + 1 + a) + " "
                       + ((-m + 1) * h) + a + " Z";
        }
        return "";
    },
    
    // GETTER & SETTER
    set: function (key, value) {
        Widget.prototype.set.call(this, key, value);
        switch (key) {
            case "width":
                this.range_x.set("basis", value);
                break;
            case "height":
                this.range_y.set("basis", value);
                break;
            case "dots":
                this.fire_event("graphchanged");
                break;
        }
    }
});
})(this);
