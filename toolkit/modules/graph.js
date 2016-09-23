/*
 * This file is part of toolkit.
 *
 * toolkit is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * toolkit is distributed in the hope that it will be useful,
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
function range_change_cb() {
    this.invalidate_all();
    this.trigger_draw();
};
function transform_dots(dots) {
    if (typeof dots === "string") return dots;
    if (typeof dots === "object") {
        if (dots instanceof Array) {
            if (!dots.length || !dots[0]) return null;
            var ret = { };
            var start, stop;

            for (var name in dots[0]) if (dots[0].hasOwnProperty(name)) {
                var a = [];
                ret[name] = a;
                for (var i = 0; i < dots.length; i++) {
                    a[i] = dots[i][name];
                }
            }
            return ret;
        } else return dots;
    } else {
        TK.error("Unsupported option 'dots':", dots);
        return "";
    }
}
// this is not really a rounding operation but simply adds 0.5. we do this to make sure
// that integer pixel positions result in actual pixels, instead of being spread across
// two pixels with half opacity
function svg_round(x) {
    x = +x;
    return x + 0.5;
}
function svg_round_array(x) {
    var i;
    for (i = 0; i < x.length; i++) {
        x[i]  = +x[i] + 0.5;
    }
    return x;
}
function _start(d, s) {
    var w = this.range_x.options.basis;
    var h = this.range_y.options.basis;
    var t = this.options.type;
    var m = this.options.mode;
    var x = this.range_x.val2px(d.x[0]);
    var y = this.range_y.val2px(d.y[0]);
    switch (m) {
        case "bottom":
            // fill the lower part of the graph
            s.push(
                "M " + svg_round(x - 1) + " ",
                svg_round(h + 1) + " " + t + " ",
                svg_round(x - 1) + " ",
                svg_round(y)
            );
            break;
        case "top":
            // fill the upper part of the graph
            s.push("M " + svg_round(x - 1) + " " + svg_round(-1),
                   " " + t + " " + svg_round(x - 1) + " ",
                   svg_round(y)
            );
            break;
        case "center":
            // fill from the mid
            s.push(
                   "M " + svg_round(x - 1) + " ",
                    svg_round(0.5 * h)
            );
            break;
        case "base":
            // fill from variable point
            s.push(
                   "M " + svg_round(x - 1) + " ",
                    svg_round((1 - this.options.base) * h)
            );
            break;
        default:
            TK.error("Unsupported mode:", m);
            /* FALL THROUGH */
        case "line":
            // fill nothing
            s.push("M " + svg_round(x) + " " + svg_round(y));
            break;
    }
}
function _end(d, s) {
    var a = 0.5;
    var h = this.range_y.options.basis;
    var t = this.options.type;
    var m = this.options.mode;
    var x = this.range_x.val2px(d.x[d.x.length-1]);
    var y = this.range_y.val2px(d.y[d.y.length-1]);
    switch (m) {
        case "bottom":
            // fill the graph below
            s.push(" " + t + " " + svg_round(x) + " " + svg_round(h + 1) + " Z");
            break;
        case "top":
            // fill the upper part of the graph
            s.push(" " + t + " " + svg_round(x + 1) + " " + svg_round(-1) + " Z");
            break;
        case "center":
            // fill from mid
            s.push(" " + t + " " + svg_round(x + 1) + " " + svg_round(0.5 * h) + " Z");
            break;
        case "base":
            // fill from variable point
            s.push(" " + t + " " + svg_round(x + 1) + " " + svg_round((-m + 1) * h) + " Z");
            break;
        default:
            TK.error("Unsupported mode:", m);
            /* FALL THROUGH */
        case "line":
            // fill nothing
            break;
    }
}
    
w.TK.Graph = w.Graph = $class({
    /**
     * TK.Graph is a single SVG path element. It provides
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
     * @property {integer} [options.mode="line"] - Drawing mode of the graph,
     * "line": line |
     * "bottom": fill below the line |
     * "top": fill above the line |
     * "center": fill from the vertical center of the canvas |
     * "base": fill from a percentual position on the canvas (set with base)
     * @property {number} [options.base=0] - If mode is "base" set the position of the base line to fill from between 0 (bottom) and 1 (top)
     * @property {string} [options.color=""] - Set the color of the path
     * @property {Function|Object} [options.range_x={}] - Callback function returning a {@link TK.Range} module for x axis or an object with options. for a new {@link Range}
     * @property {Function|Object} [options.range_y={}] - Callback function returning a {@link TK.Range} module for y axis or an object with options. for a new {@link Range}
     * @property {number} [options.width=0] - The width of the graph
     * @property {number} [options.height=0] - The height of the graph
     * @property {string|boolean} [options.key=false] - Show a description for this graph in the charts key, false to turn it off
     * @extends TK.Widget
     * @mixes TK.Ranges
     */
    _class: "Graph",
    Extends: TK.Widget,
    Implements: Ranges,
    _options: Object.assign(Object.create(TK.Widget.prototype._options), {
        dots: "array",
        type: "string",
        mode: "string",
        base: "number",
        color: "string",
        range_x: "object",
        range_y: "object",
        width: "number",
        height: "number",
        key: "string",
        element: undefined,
    }),
    options: {
        dots:      null,
        type:      "L",
        mode:      "line",
        base:      0,
        color:     "",
        width:     0,
        height:    0,
        key:       false
    },
    
    initialize: function (options) {
        TK.Widget.prototype.initialize.call(this, options);
        this.element = this.widgetize(TK.make_svg("path"), true, true, true);
        TK.add_class(this.element, "toolkit-graph");

        if (this.options.range_x) this.set("range_x", this.options.range_x);
        if (this.options.range_y) this.set("range_y", this.options.range_y);
        this.set("color", this.options.color);
        this.set("mode",  this.options.mode);
        if (this.options.dots) this.options.dots = transform_dots(this.options.dots);
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
            TK.add_class(E, O.mode === "line" ?  "toolkit-outline" : "toolkit-filled");
        }

        if (I.validate("dots", "type", "width", "height")) {
            var a = 0.5;
            var dots = O.dots;
            var range_x = this.range_x;
            var range_y = this.range_y;
            var w = range_x.options.basis;
            var h = range_y.options.basis;
        
            if (typeof dots === "string") {
                E.setAttribute("d", dots);
            } else if (!dots) {
                E.setAttribute("d", "");
            } else {
                var x = svg_round_array(dots.x.map(range_x.val2px));
                var y = svg_round_array(dots.y.map(range_y.val2px));
                var x1, x2, y1, y2;
                // if we are drawing a line, _start will do the first point
                var i = O.type === "line" ? 1 : 0;
                var s = [];
                var f;

                _start.call(this, dots, s);

                switch (O.type.substr(0,1)) {
                case "L":
                case "T":
                    for (; i < x.length; i++)
                        s.push(" " + O.type + " " + x[i] + " " + y[i]);
                    break;
                case "Q":
                case "S":
                    x1 = svg_round_array(dots.x1.map(range_x.val2px));
                    y1 = svg_round_array(dots.y1.map(range_y.val2px));
                    for (; i < x.length; i++)
                        s.push(" " + O.type + " "
                                 + x1[i] + "," + y1[i] + " "
                                 + x[i] + "," + y[i]);
                    break;
                case "C":
                    x1 = svg_round_array(dots.x1.map(range_x.val2px));
                    x2 = svg_round_array(dots.x2.map(range_x.val2px));
                    y1 = svg_round_array(dots.y1.map(range_y.val2px));
                    y2 = svg_round_array(dots.y2.map(range_y.val2px));
                    for (; i < x.length; i++)
                        s.push(" " + O.type + " "
                            + x1[i] + "," + y1[i] + " "
                            + x2[i] + "," + y2[i] + " "
                            + x[i] + "," + y[i]);
                    break;
                case "H":
                    f = O.type.length > 1 ? parseFloat(O.type.substr(1)) : 3;
                    if (i === 0) {
                        i++;
                        s.push(" S" + x[0] + "," + y[0] + " " + x[0] + "," + y[0]);
                    }
                    for (; i < x.length-1; i++)
                        s.push(" S" + (x[i] - Math.round(x[i] - x[i-1])/f) + ","
                               + y[i] + " " + x[i] + "," + y[i]);
                    if (i < x.length)
                        s.push(" S" + x[i] + "," + y[i] + " " + x[i] + "," + y[i]);
                    break;
                default:
                    TK.error("Unsupported graph type", O.type);
                }
                
                _end.call(this, dots, s);
                E.setAttribute("d", s.join(""));
            }
        }
        TK.Widget.prototype.redraw.call(this);
    },
    destroy: function () {
        this.element.remove();
        TK.Widget.prototype.destroy.call(this);
    },
    
    // GETTER & SETTER
    set: function (key, value) {
        if (key === "dots") {
            value = transform_dots(value);
        }
        TK.Widget.prototype.set.call(this, key, value);
        switch (key) {
            case "range_x":
            case "range_y":
                this.add_range(value, key);
                value.add_event("set", range_change_cb.bind(this));
                break;
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
