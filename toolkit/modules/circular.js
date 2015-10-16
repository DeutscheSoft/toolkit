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
(function (w) {
var __rad = Math.PI / 180;
function _get_coords(deg, inner, outer, pos) {
    deg = deg * __rad;
    return {
        x1: Math.cos(deg) * outer + pos,
        y1: Math.sin(deg) * outer + pos,
        x2: Math.cos(deg) * inner + pos,
        y2: Math.sin(deg) * inner + pos
    }
}
function _get_coords_single(deg, inner, pos) {
    deg = deg * __rad;
    return {
        x: Math.cos(deg) * inner + pos,
        y: Math.sin(deg) * inner + pos
    }
}
var format_path = TK.FORMAT("M %f,%f " +
                                 "A %f,%f 0 %d,%d %f,%f " +
                                 "L %f,%f " +
                                 "A %f,%f 0 %d,%d %f,%f z");
function draw_dots() {
    // depends on dots, dot, min, max, size
    var _dots = this._dots;
    var O = this.options;
    var dots = O.dots;
    var dot = O.dot;
    TK.empty(_dots);
    for (var i = 0; i < dots.length; i++) {
        var m = dots[i];
        var r = TK.make_svg("rect", {"class": "toolkit-dot"});
        
        var length = typeof m.length == "undefined"
                   ? dot.length : m.length;
        var width  = typeof m.width == "undefined"
                   ? dot.width : m.width;
        var margin = typeof m.margin == "undefined"
                   ? dot.margin : m.margin;
        var pos    = Math.min(O.max, Math.max(O.min, m.pos));
        // TODO: consider adding them all at once
        _dots.appendChild(r);
        if (m["class"]) TK.add_class(r, m["class"]);
        if (m["color"]) r.style["fill"] = m["color"];
                 
        r.setAttribute("x", O.size - length - margin);
        r.setAttribute("y", O.size / 2 - width / 2);
        
        r.setAttribute("width",  length);
        r.setAttribute("height", width);
        
        r.setAttribute("transform", "rotate("
            + this.val2real(this.snap(pos)) + " "
            + (O.size / 2) + " " + (this.options.size / 2) + ")");
    }
    this.fire_event("dotsdrawn");
}
function draw_markers() {
    // depends on size, markers, marker, min, max
    var I = this.invalid;
    var O = this.options;
    var markers = O.markers;
    var marker = O.marker;
    TK.empty(this._markers);
    
    var stroke  = this._get_stroke();
    var outer   = O.size / 2;
    
    for (var i = 0; i < markers.length; i++) {
        var m       = markers[i];
        var thick   = typeof m.thickness == "undefined"
                    ? marker.thickness : m.thickness;
        var margin  = typeof m.margin == "undefined"
                    ? marker.margin : m.margin;
        var inner   = outer - thick;
        var outer_p = outer - margin - stroke / 2;
        var inner_p = inner - margin - stroke / 2;
        var from, to;
        
        if (typeof m.from == "undefined")
            from = O.min;
        else
            from = Math.min(O.max, Math.max(O.min, m.from));
        
        if (typeof m.to == "undefined")
            to = O.max;
        else
            to = Math.min(O.max, Math.max(O.min, m.to));
        
        var s = TK.make_svg("path", {"class": "toolkit-marker"});
        this._markers.appendChild(s);
        
        if (m["class"]) TK.add_class(s, m["class"]);
        if (m["color"]) s.style["fill"] = m["color"];
        
        draw_slice.call(this, this.val2real(this.snap(from)), this.val2real(this.snap(to)), inner_p, outer_p, outer, s);
    }
    this.fire_event("markersdrawn");
}
function draw_labels() {
    // depends on size, labels, label, min, max, start
    var _labels = this._labels;
    var O = this.options;
    var labels = O.labels;
    TK.empty(this._labels);
    
    var outer   = O.size / 2;

    var a = new Array(labels.length);
    var i;

    var l, p, positions = new Array(labels.length);
    
    for (i = 0; i < labels.length; i++) {
        l = labels[i];
        p = TK.make_svg("text", {"class": "toolkit-label",
                                 style: "dominant-baseline: central;"
        });
        
        if (l["class"]) TK.add_class(p, l["class"]);
        if (l["color"]) p.style["fill"] = l["color"];

                 
        if (typeof l.label != "undefined")
            p.textContent = l.label;
        else
            p.textContent = O.label.format(l.pos);

        p.setAttribute("text-anchor", "middle");
                 
        _labels.appendChild(p);
        a[i] = p;
    }

    var fmt = TK.FORMAT("translate(%f, %f)");

    /* FORCE_RELAYOUT */

    TK.S.enqueue(function() {
        for (i = 0; i < labels.length; i++) {
            l = labels[i];
            p = a[i];

            var margin  = typeof l.margin != "undefined" ? l.margin : O.label.margin;
            var align   = (typeof l.align != "undefined" ? l.align : O.label.align) == _TOOLKIT_INNER;
            var pos     = Math.min(O.max, Math.max(O.min, l.pos));
            var bb      = p.getBBox();
            var angle   = (this.val2real(this.snap(pos)) + O.start) % 360;
            var outer_p = outer - margin;
            var coords  = _get_coords_single(angle, outer_p, outer);
            
            var mx = ((coords.x - outer) / outer_p) * (bb.width + bb.height / 2.5) / (align ? -2 : 2);
            var my = ((coords.y - outer) / outer_p) * bb.height / (align ? -2 : 2);

            positions[i] = fmt(coords.x + mx, coords.y + my);
        }

        TK.S.enqueue(function() {
            for (i = 0; i < labels.length; i++) {
                p = a[i];
                p.setAttribute("transform", positions[i]);
            }
            this.fire_event("labelsdrawn");
        }.bind(this));
    }.bind(this), 1);
}
function draw_slice(a_from, a_to, r_inner, r_outer, pos, slice) {
    // enshure from != to
    if(a_from % 360 == a_to % 360) a_from += 0.001;
    // enshure from and to in bounds
    while (a_from < 0) a_from += 360;
    while (a_to < 0) a_to += 360;
    if (a_from > 360) a_from %= 360;
    if (a_to > 360) a_to   %= 360;
    // get drawing direction (sweep = clock-wise)
    if (this.options.reverse && a_to <= a_from
    || !this.options.reverse && a_to > a_from)
        var sweep = 1;
    else
        var sweep = 0;
    // get large flag
    if (Math.abs(a_from - a_to) >= 180)
        var large = 1;
    else
        var large = 0;
    // draw this slice
    var from = _get_coords(a_from, r_inner, r_outer, pos);
    var to = _get_coords(a_to, r_inner, r_outer, pos);

    var path = format_path(from.x1, from.y1,
                           r_outer, r_outer, large, sweep, to.x1, to.y1,
                           to.x2, to.y2,
                           r_inner, r_inner, large, !sweep, from.x2, from.y2);
    slice.setAttribute("d", path);
    this.fire_event("slicedrawn");
}
w.Circular = $class({
    // Circular is a SVG group element containing two paths for displaying
    // numerical values in a circular manner. Circular is able to draw labels,
    // dots and markers and can show a hand. Circular e.g. is implemented by
    // the clock to draw the hours, minutes and seconds. Circular extends Widget
    // and implements Range.
    _class: "Circular",
    Extends: Widget,
    Implements: [Warning, Ranged],
    options: {
        value:      0,     // the value to show
        size:       100,   // the diameter of the circle
        thickness:  3,     // the thickness of the circle
        margin:     0,     // margin of base and value circles
        hand:       {width: 2, length: 30, margin: 10}, // if you want to draw a hand set its dimensions
                           // {width: (number), length: (number), margin: (number)}
        start:      135,   // the starting point in degrees:
                           // 0=right, 90=bottom, ...
        basis:      270,   // the max degree of rotation when value = max
        base:       false, // if base value is set, circular starts
                           // at this point and shows values
                           // above and beneath starting at base.
                           // set to false if you don't need it
                           // to save some cpu
        show_base:  true,  // draw the base ring
        show_value: true,  // draw the value ring
        show_hand:  true,  // draw the hand
        x:          0,     // re-position the circular
        y:          0,     // re-position the circular
        dot:        {width: 2, length: 2, margin: 5}, // set dots dimensions
                           // {width: (number), length: (number), margin: (number)}
        dots:       [],    // An array containing objects with the following
                           // members for drawing dots: 
                           // {pos: (number)[, color: "colorstring"]
                           // [, class: "classname"][, width: (number)]
                           // [, length: (number)][, margin: (number)]}
        marker:     {thickness: 3, margin: 0}, // set markers default dimension
                           // {thickness: (number), margin: (number)}
        markers:    [],    // An array containing objects with the following
                           // members for drawing markers: 
                           // {from: (number), to: (number)[, color: "colorstring"]
                           // [, class: "classname"][, margin: (number)]
                           // [, thickness: (number)]}
        label:      {margin: 8, align: _TOOLKIT_INNER, format: function(val){return val;}}, // set
                           // labels ring position as object with following
                           // optional members:
                           // margin: (number) distance from size
                           // align: _TOOLKIT_INNER or _TOOLKI_OUTER
                           // format function receiving the value, returning a string
        labels:     []     // An array containing objects with the following
                           // members for drawing labels: 
                           // {pos: (number), label: (string)[, color: "colorstring"]
                           // [, class: "classname"][, margin: (number)]
                           // [, margin: (number)]}
        
    },
    
    initialize: function (options, hold) {
        Widget.prototype.initialize.call(this, options);
        var E;
        this.update_ranged();
        
        this.element = E = TK.make_svg("g", {"class": "toolkit-circular"});
        if (!hold) this.widgetize(E, true, true, true);
        
        this._base = TK.make_svg("path", {"class": "toolkit-base"});
        E.appendChild(this._base);
        
        this._markers = TK.make_svg("g", {"class": "toolkit-markers"});
        E.appendChild(this._markers);
        
        this._value = TK.make_svg("path", {"class": "toolkit-value"});
        E.appendChild(this._value);
        
        this._dots = TK.make_svg("g", {"class": "toolkit-dots"});
        E.appendChild(this._dots);
        
        this._labels = TK.make_svg("g", {"class": "toolkit-labels"});
        E.appendChild(this._labels);
        
        this._hand = TK.make_svg("rect", {"class": "toolkit-hand"});
        E.appendChild(this._hand);
    },
    
    redraw: function () {
        Widget.prototype.redraw.call(this);
        var I = this.invalid;
        var O = this.options;
        var E = this.element;
        var outer   = O.size / 2;
        var tmp;

        if (I.validate("x", "y") || I.start || I.size) {
            E.setAttribute("transform", TK.sprintf("translate(%f %f) rotate(%f %f %f)",
                                                   O.x, O.y, O.start, outer, outer));
            this._labels.setAttribute("transform", TK.sprintf("rotate(%f %f %f)", -O.start, outer, outer));
        }

        if (I.validate("labels", "label") || I.size || I.min || I.max || I.start) {
            draw_labels.call(this);
        }

        if (I.validate("dots", "dot") || I.min || I.max || I.size) {
            draw_dots.call(this);
        }

        if (I.validate("markers", "marker") || I.size || I.min || I.max) {
            draw_markers.call(this);
        }

        var stroke  = this._get_stroke();
        var inner   = outer - O.thickness;
        var outer_p = outer - stroke / 2 - O.margin;
        var inner_p = inner - stroke / 2 - O.margin;
        
        if (I.show_value || I.value) {
            I.show_value = false;
            if (O.show_value) {
                draw_slice.call(this, this.val2real(this.snap(O.base)), this.val2real(this.snap(O.value)), inner_p, outer_p, outer,
                                this._value);
            } else {
                this._value.removeAttribute("d");
            }
        }

        if (I.show_base) {
            I.show_base = false;
            if (O.show_base) {
                draw_slice.call(this, 0, O.basis, inner_p, outer_p, outer, this._base);
            } else {
                this._base.setAttribute("d", null);
            }
        }
        if (I.show_hand) {
            I.show_hand = false;
            if (O.show_hand) {
                this._hand.style["display"] = "block";
            } else {
                this._hand.style["display"] = "none";
            }
        }
        if (I.validate("size", "value", "hand")) {
            tmp = this._hand;
            tmp.setAttribute("x", O.size - O.hand.length - O.hand.margin);
            tmp.setAttribute("y", (O.size - O.hand.width) / 2.0);
            tmp.setAttribute("width", O.hand.length);
            tmp.setAttribute("height",O.hand.width);
            tmp.setAttribute("transform",
                             TK.sprintf("rotate(%f %f %f)", this.val2real(this.snap(O.value)), O.size / 2, O.size / 2));
            this.fire_event("handdrawn");
        }
    },
    
    destroy: function () {
        TK.destroy(this._dots);
        TK.destroy(this._markers);
        TK.destroy(this._base);
        TK.destroy(this._value);
        TK.destroy(this.element);
        Widget.prototype.destroy.call(this);
    },
    _get_stroke: function () {
        if (this.hasOwnProperty("_stroke")) return this._stroke;
        var strokeb = parseInt(TK.get_style(this._base, "stroke-width")) || 0;
        var strokev = parseInt(TK.get_style(this._value, "stroke-width")) || 0;
        this._stroke = strokeb > strokev ? strokeb : strokev;
        return this._stroke;
    },
    
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        switch (key) {
        case "dots":
        case "markers":
        case "labels":
            value = Object.assign(this.options[key], value);
            break;
        case "base":
            if (value === false) {
                value = this.options.min;
                this.__based = false;
            } else {
                this.__based = true;
            }
            this.fire_event("basechanged", value);
            break;
        case "value":
            if (value > this.options.max || value < this.options.min)
                this.warning(this.element);
            value = this.snap(value);
            break;
        }
        Widget.prototype.set.call(this, key, value, hold);
        switch (key) {
            case "min":
            case "max":
            case "snap":
                this.update_ranged();
                break;
        }
    }
});
})(this);
