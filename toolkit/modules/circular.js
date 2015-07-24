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
(function () {
var __rad = Math.PI / 180;
var _get_coords = function (deg, inner, outer, pos) {
    deg = deg * __rad;
    return {
        x1: Math.cos(deg) * outer + pos,
        y1: Math.sin(deg) * outer + pos,
        x2: Math.cos(deg) * inner + pos,
        y2: Math.sin(deg) * inner + pos
    }
};
var _get_coords_single = function (deg, inner, pos) {
    deg = deg * __rad;
    return {
        x: Math.cos(deg) * inner + pos,
        y: Math.sin(deg) * inner + pos
    }
};
var format_path = toolkit.FORMAT("M %f,%f " +
                                 "A %f,%f 0 %d,%d %f,%f " +
                                 "L %f,%f " +
                                 "A %f,%f 0 %d,%d %f,%f z");
Circular = $class({
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
        
        this.element = TK.make_svg("g", {"class": "toolkit-circular"});
        if (!hold) this.widgetize(this.element, true, true, true);
        
        this._base = TK.make_svg("path", {"class": "toolkit-base"});
        this.element.appendChild(this._base);
        
        this._markers = TK.make_svg("g", {"class": "toolkit-markers"});
        this.element.appendChild(this._markers);
        
        this._value = TK.make_svg("path", {"class": "toolkit-value"});
        this.element.appendChild(this._value);
        
        this._dots = TK.make_svg("g", {"class": "toolkit-dots"});
        this.element.appendChild(this._dots);
        
        this._labels = TK.make_svg("g", {"class": "toolkit-labels"});
        this.element.appendChild(this._labels);
        
        this._hand = TK.make_svg("rect", {"class": "toolkit-hand"});
        this.element.appendChild(this._hand);
        
        this.set("container", this.options.container);
        
        this.set("base", this.options.base, true);
        this.set("show_value", this.options.show_value, true);
        this.set("show_base", this.options.show_base, true);
        
        this.set("hand", this.options.hand, true);
        this.set("show_hand", this.options.show_hand, true);
        
        this.set("start", this.options.start);
        
        this.set("dot", this.options.dot, true);
        this.set("dots", this.options.dots);
        
        this.set("marker", this.options.marker, true);
        this.set("markers", this.options.markers);
        
        this.set("label", this.options.label, true);
        this.set("labels", this.options.labels);
        
        this.redraw(true);
        Widget.prototype.initialized.call(this);
    },
    
    redraw: function (stuff) {
        var stroke  = this._get_stroke();
        var outer   = this.options.size / 2;
        var inner   = outer - this.options.thickness;
        var outer_p = outer - stroke / 2 - this.options.margin;
        var inner_p = inner - stroke / 2 - this.options.margin;
        
        if (this.options.show_value) {
            this._draw_slice(this.val2real(this.options.base),
                             this.val2real(), inner_p, outer_p, outer,
                             this._value);
        }
        if (this.options.show_base) {
            this._draw_slice(0, this.options.basis,
                             inner_p, outer_p, outer, this._base);
        }
        if (this.options.show_hand) {
            this._draw_hand();
        }
        if (stuff) {
            this._draw_labels();
            this._draw_dots();
            this._draw_markers();
        }
        Widget.prototype.redraw.call(this);
    },
    
    destroy: function () {
        this._dots.destroy();
        this._markers.destroy();
        this._base.destroy();
        this._value.destroy();
        this.element.destroy();
        Widget.prototype.destroy.call(this);
    },
    _get_coords: function (deg, inner, outer, pos, single) {
        if (single) return _get_coords_single(deg, inner, pos);
        else return _get_coords(deg, inner, outer, pos);
    },
    // HELPERS & STUFF
    _draw_slice: function (a_from, a_to, r_inner, r_outer, pos, slice) {
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
        this.fire_event("slicedrawn", [this]);
    },
    _draw_dots: function () {
        this._dots.empty();
        for (var i = 0; i < this.options.dots.length; i++) {
            var m = this.options.dots[i];
            var r = TK.make_svg("rect", {"class": "toolkit-dot"});
            
            var length = typeof m.length == "undefined"
                       ? this.options.dot.length : m.length;
            var width  = typeof m.width == "undefined"
                       ? this.options.dot.width : m.width;
            var margin = typeof m.margin == "undefined"
                       ? this.options.dot.margin : m.margin;
            var pos    = Math.min(this.options.max,
                          Math.max(this.options.min, m.pos));
            // TODO: consider adding them all at once
            this._dots.appendChild(r);
            if (m["class"]) r.classList.add(m["class"]);
            if (m["color"]) r.style["fill"] = m["color"];
                     
            r.set("x", this.options.size - length - margin);
            r.set("y", this.options.size / 2 - width / 2);
            
            r.set("width",  length);
            r.set("height", width);
            
            r.set("transform", "rotate("
                + this.val2real(pos) + " "
                + (this.options.size / 2) + " " + (this.options.size / 2) + ")");
        }
        this.fire_event("dotsdrawn", [this]);
    },
    _draw_markers: function () {
        this._markers.empty();
        
        var stroke  = this._get_stroke();
        var outer   = this.options.size / 2;
        
        for (var i = 0; i < this.options.markers.length; i++) {
            var m       = this.options.markers[i];
            var thick   = typeof m.thickness == "undefined"
                        ? this.options.marker.thickness : m.thickness;
            var margin  = typeof m.margin == "undefined"
                        ? this.options.marker.margin : m.margin;
            var inner   = outer - thick;
            var outer_p = outer - margin - stroke / 2;
            var inner_p = inner - margin - stroke / 2;
            
            if (typeof m.from == "undefined")
                var from = this.options.min;
            else
                var from    = Math.min(this.options.max,
                              Math.max(this.options.min, m.from));
            
            if (typeof m.to == "undefined")
                var to = this.options.max;
            else
                var to      = Math.min(this.options.max,
                              Math.max(this.options.min, m.to));
            
            var s = TK.make_svg("path", {"class": "toolkit-marker"});
            this._markers.appendChild(s);
            
            if (m["class"]) s.classList.add(m["class"]);
            if (m["color"]) s.style["fill"] = m["color"];
            
            this._draw_slice(this.val2real(from),
                             this.val2real(to), inner_p, outer_p, outer, s);
        }
        this.fire_event("markersdrawn", [this]);
    },
    _draw_labels: function () {
        this._labels.empty();
        
        var outer   = this.options.size / 2;
        
        for (var i = 0; i < this.options.labels.length; i++) {
            var l = this.options.labels[i];
            var p = TK.make_svg("text", {"class": "toolkit-label",
                                     style: "dominant-baseline: central;"
            });
            this._labels.appendChild(p);
            
            if (l["class"]) p.classList.add(l["class"]);
            if (l["color"]) p.style["fill"] = l["color"];
                     
            if (typeof l.label != "undefined")
                p.textContent = l.label;
            else
                p.textContent = this.options.label.format(l.pos);
                     
            var margin  = typeof l.margin != "undefined"
                        ? l.margin : this.options.label.margin;
            var align   = (typeof l.align != "undefined"
                        ? l.align : this.options.label.align) == _TOOLKIT_INNER;
            var pos     = Math.min(this.options.max,
                          Math.max(this.options.min, l.pos));
            var bb      = p.getBBox();
            var angle   = (this.val2real(pos) + this.options.start) % 360;
            var outer_p = outer - margin;
            var coords  = _get_coords_single(angle, outer_p, outer);
            
            var mx = ((coords.x - outer) / outer_p) * (bb.width + bb.height / 2.5) / (align ? -2 : 2);
            var my = ((coords.y - outer) / outer_p) * bb.height / (align ? -2 : 2);
            
            p.set("transform", "translate(" + (coords.x + mx) + "," + (coords.y + my) + ")");
            p.set("text-anchor", "middle");
        }
        this.fire_event("labelsdrawn", [this]);
    },
    _draw_hand: function () {
        this._hand.set("transform", "rotate("
            + this.val2real() + " "
            + (this.options.size / 2) + " " + (this.options.size / 2) + ")");
        this.fire_event("handdrawn", [this]);
    },
    _get_stroke: function () {
        if (this.hasOwnProperty("_stroke")) return this._stroke;
        // TODO: this uses getComputedStyle which is bad in many ways.
        // lets calculate this once and reuse the value
        var strokeb = this._base.getStyle("stroke-width").toInt() || 0;
        var strokev = this._value.getStyle("stroke-width").toInt() || 0;
        this._stroke = strokeb > strokev ? strokeb : strokev;
        return this._stroke;
    },
    
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "min":
            case "max":
            case "reverse":
            case "log_factor":
            case "step":
            case "round":
            case "snap":
            case "scale":
            case "basis":
            case "thickness":
            case "margin":
            case "size":
                if (!hold) {
                    this._draw_dots();
                    this._draw_markers();
                    this._draw_labels();
                    this._draw_hand();
                    this.redraw();
                }
                this.set("hand", this.options.hand);
                if (key != "size") break;
            case "start":
            case "x":
            case "y":
                this.element.set("transform", "translate("
                    + this.options.x + " " + this.options.y + ") "
                    + "rotate(" + this.options.start + " "
                    + (this.options.size / 2) + " " + (this.options.size / 2) + ")");
                this._labels.set("transform", "rotate(-" + this.options.start + " "
                    + (this.options.size / 2) + " " + (this.options.size / 2) + ")");
                break;
            case "value":
                this.options.value = this.snap_value(Math.min(this.options.max,
                                     Math.max(this.options.min, value)));
                if (value > this.options.max || value < this.options.min)
                    this.warning(this.element);
                this.fire_event("set_value", [this.options.value, this]);
                this.fire_event("set", ["value", this.options.value, this]);
                if (!hold) this.redraw();
                return;
            case "base":
                if (value === false) {
                    this.options.base = this.options.min;
                    this.__based = false;
                } else {
                    this.__based = true;
                }
                this.fire_event("basechanged", [value, this]);
                if (!hold) this.redraw();
                key = false;
                break;
            case "show_base":
                if (!value && !hold) this._base.set("d", null);
                else if (!hold) this.redraw();
                break;
            case "show_value":
                if (!value && !hold) this._value.set("d", null);
                else if (!hold) this.redraw();
                break;
            case "show_hand":
                this._hand.style["display"] = value ? "block" : "none";
                if(value && !hold) this._draw_hand();
                break;
            case "hand":
                this._hand.set("x", this.options.size
                                  - this.options.hand.length
                                  - this.options.hand.margin);
                this._hand.set("y", this.options.size / 2
                                  - this.options.hand.width / 2);
                this._hand.set("width",  this.options.hand.length);
                this._hand.set("height", this.options.hand.width);
                if(!hold) this._draw_hand();
                break;
            case "dot":
                if (!hold) this._draw_dots();
                break;
            case "dots":
                this.options.dots = $mixin(this.options.dots, value);
                key = false;
                if (!hold) this._draw_dots();
                break;
            case "marker":
                if (!hold) this._draw_markers();
                break;
            case "markers":
                this.options.markers = $mixin(this.options.markers, value);
                key = false;
                if (!hold) this._draw_markers();
                break;
            case "label":
                if (!hold) this._draw_labels();
                break;
            case "labels":
                this.options.labels = $mixin(this.options.labels, value);
                key = false;
                if (!hold) this._draw_labels();
                break;
        }
        Widget.prototype.set.call(this, key, value, hold);
    }
});
})();
