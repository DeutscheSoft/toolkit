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
 
Gauge = new Class({
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
        if (typeof options.title == "string")
            options.title = {title: options.title};
        this.setOptions(options);
        this._svg = makeSVG("svg", {
            "class": "toolkit-gauge",
            "width": this.options.width,
            "height": this.options.height
        }, true, true, true).inject(this.options.container);
        options.container = this._svg;
        
        this._title = makeSVG("text", {"class": "toolkit-title"});
        this._title.inject(this._svg);
        
        this.set("title", this.options.title);
        
        this.parent(options);
        this._svg = this.widgetize(this._svg);
        this.initialized();
    },
    destroy: function () {
        this._svg.destroy();
        this.parent();
    },
    
    // HELPERS & STUFF
    _draw_title: function () {
        this._title.set("text", this.options.title.title);
        if (this.options.title.title) {
            var t = this.options.title;
            var outer   = this.options.size / 2;
            var margin  = t.margin;
            var align   = t.align == _TOOLKIT_INNER;
            var bb      = this._title.getBoundingClientRect();
            var angle   = t.pos % 360;
            var outer_p = outer - margin;
            var coords  = this._get_coords(angle, outer_p, outer_p, outer, true);
            
            bb.width = bb.width;
            
            var mx = ((coords.x - outer) / outer_p)
                   * (bb.width + bb.height / 2.5) / (align ? -2 : 2);
            var my = ((coords.y - outer) / outer_p)
                   * bb.height / (align ? -2 : 2);
            
            mx += this.options.x;
            my += this.options.y;
                   
            this._title.set("transform",
                "translate(" + (coords.x + mx) + "," + (coords.y + my) + ")");
            this._title.set("text-anchor", "middle");
        }
        this.fire_event("titledrawn", [this]);
    },
    
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        switch (key) {
            case "width":
                if (!hold) this._svg.set("width", value);
                break;
            case "height":
                if (!hold) this._svg.set("height", value);
                break;
            case "title":
                if (typeof value == "string") value = {title: value};
                this.options.title = Object.merge(this.options.title, value);
                this.fire_event("set", [key, value, hold, this]);
                this.fire_event("set_" + key, [value, hold, this]);
                key = false;
                if (!hold) this._draw_title();
                break;
            case "x":
            case "y":
                this.options[key] = value;
                if (!hold) this._draw_title();
                break;
        }
        this.parent(key, value, hold);
    }
});
