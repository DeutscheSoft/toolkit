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
function _get_coords_single(deg, inner, pos) {
    deg = deg * Math.PI / 180;
    return {
        x: Math.cos(deg) * inner + pos,
        y: Math.sin(deg) * inner + pos
    }
}
var format_translate = TK.FORMAT("translate(%f, %f)");
w.TK.Gauge = w.Gauge = $class({
    /* @class: Gauge
     * @description: Gauge simply puts a single Circular into a SVG image.
     */
    _class: "Gauge",
    Extends: Widget,
    DOMElement: SVGElement,
    _options: Object.assign(Object.create(Widget.prototype._options), Circular.prototype._options, {
        x: "number",
        y: "number",
        width:  "number",
        height: "number",
        size:   "number",
        title: "object",
    }),
    options: Object.assign({}, TK.Circular.prototype.options, {
        x:          0,
        y:          0,
        width:  120, // width of the element
        height: 120, // height of the svg
        size:   120,
        title: {pos: 90, margin: 0, align: _TOOLKIT_INNER, title:""} // set a
                     // title fo the gauge. Object with optional members:
                     // pos:    position in angles
                     // margin: margin of the imaginary circle from size
                     // align:  alignment, _TOOLKIT_INNER or _TOOLKIT OUTER
                     // title:  the title as a string
    }),
    initialize: function (options) {
        if (typeof options.title == "string")
            options.title = {title: options.title};
        Widget.prototype.initialize.call(this, options);
        var O = this.options;
        var E;
        if (!(E = this.element)) this.element = E = TK.make_svg("svg");
        TK.add_class(E, "toolkit-gauge");
        E.setAttribute("width", O.width);
        E.setAttribute("height", O.height);
        this.widgetize(E, true, true, true);
        
        this._title = TK.make_svg("text", {"class": "toolkit-title"});
        this.element.appendChild(this._title);

        var co = TK.object_and(O, TK.Circular.prototype._options);
        co = TK.object_sub(O, TK.Widget.prototype._options);
        co.container = this.element;
        this.circular = new Circular(co);
        this.add_child(this.circular);
        this.widgetize(this.element);
    },
    redraw: function() {
        var I = this.invalid, O = this.options;
        var E = this.element;

        Widget.prototype.redraw.call(this);

        if (I.width) {
            I.width = false;
            E.setAttribute("width", O.width);
        }
        if (I.height) {
            I.height = false;
            E.setAttribute("height", O.height);
        }

        if (I.validate("title", "size", "x", "y")) {
            var _title = this._title;
            _title.textContent = O.title.title;

            if (O.title.title) {
                TK.S.add(function() {
                    var t = O.title;
                    var outer   = O.size / 2;
                    var margin  = t.margin;
                    var align   = t.align == _TOOLKIT_INNER;
                    var bb      = _title.getBoundingClientRect();
                    var angle   = t.pos % 360;
                    var outer_p = outer - margin;
                    var coords  = _get_coords_single(angle, outer_p, outer);

                    var mx = ((coords.x - outer) / outer_p)
                           * (bb.width + bb.height / 2.5) / (align ? -2 : 2);
                    var my = ((coords.y - outer) / outer_p)
                           * bb.height / (align ? -2 : 2);
                    
                    mx += O.x;
                    my += O.y;
                           
                    TK.S.add(function() {
                        _title.setAttribute("transform", format_translate(coords.x + mx, coords.y + my));
                        _title.setAttribute("text-anchor", "middle");
                    }.bind(this));
                    this.fire_event("titledrawn");
                }.bind(this), 1);
            }
        }
    },
    
    // GETTERS & SETTERS
    set: function (key, value) {
        if (key === "title") {
            if (typeof value == "string") value = {title: value};
            value = Object.assign(this.options.title, value);
        }
        // Circular does the snapping
        if (!TK.Widget.prototype._options[key] && Circular.prototype._options[key])
            value = this.circular.set(key, value);
        return Widget.prototype.set.call(this, key, value);
    }
});
})(this);
