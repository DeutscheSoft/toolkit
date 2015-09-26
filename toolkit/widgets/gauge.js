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
w.Gauge = $class({
    // Gauge simply puts a single Circular into a SVG image.
    _class: "Gauge",
    Extends: Circular,
    options: {
        width:  120, // width of the element
        height: 120, // height of the svg
        size:   120,
        title: {pos: 90, margin: 0, align: _TOOLKIT_INNER, title:""} // set a
                     // title fo the gauge. Object with optional members:
                     // pos:    position in angles
                     // margin: margin of the imaginary circle from size
                     // align:  alignment, _TOOLKIT_INNER or _TOOLKIT OUTER
                     // title:  the title as a string
    },
    initialize: function (options) {
        BASE.prototype.initialize.call(this);
        if (typeof options.title == "string")
            options.title = {title: options.title};
        this.set_options(options);
        this._svg = TK.make_svg("svg", {
            "class": "toolkit-gauge",
            "width": this.options.width,
            "height": this.options.height
        }, true, true, true);
        this.options.container.appendChild(this._svg);
        options.container = this._svg;
        
        this._title = TK.make_svg("text", {"class": "toolkit-title"});
        this._svg.appendChild(this._title);
        
        Circular.prototype.initialize.call(this, options);
        this._svg = this.widgetize(this._svg);
    },
    destroy: function () {
        TK.destroy(this._svg);
        Circular.prototype.destroy.call(this);
    },
    redraw: function() {
        var I = this.invalid, O = this.options;
        Circular.prototype.redraw.call(this);

        if (I.width) {
            I.width = false;
            this._svg.setAttribute("width", O.width);
        }
        if (I.height) {
            I.height = false;
            this._svg.setAttribute("height", O.height);
        }

        if (I.title || I.size || I.x || I.y) {
            I.title = I.size = I.x = I.y = false;
            var _title = this._title;
            _title.textContent = O.title.title;
            if (O.title.title) {
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
                       
                _title.setAttribute("transform",
                    "translate(" + (coords.x + mx) + "," + (coords.y + my) + ")");
                _title.setAttribute("text-anchor", "middle");
            }
            this.fire_event("titledrawn");
        }
    },
    
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        if (key === "title") {
            if (typeof value == "string") value = {title: value};
            value = Object.assign(this.options.title, value);
        }
        Circular.prototype.set.call(this, key, value, hold);
    }
});
})(this);
