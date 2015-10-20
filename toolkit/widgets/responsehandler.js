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
function hit_test(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
    // hit test takes two defined rectangles and calculates the overlapping
    // pixels.
    var aw = ax2 - ax1;
    var bw = bx2 - bx1;
    var zw = bx1 - ax1;
    var ow = 0;
    if (zw < aw && -bw < zw) {
        if (0 <= zw && zw <= aw) {
            ow = aw - zw;
        } else if (-bw <= zw && zw <= 0) {
            ow = bw + zw;
        }
    }
    if (!ow) return 0;
                
    var ah = ay2 - ay1;
    var bh = by2 - by1;
    var zh = by1 - ay1;
    var oh = 0;
    if (zh < ah && -bh < zh) {
        if (0 <= zh && zh <= ah) {
            oh = ah - zh;
        } else if (-bh <= zh && zh <= 0) {
            oh = bh + zh;
        }
    }
    if (!oh) return 0;
    return Math.min(Math.min(aw, bw), ow) * Math.min(Math.min(ah, bh), oh);
}
    
w.ResponseHandler = $class({
    // ResponseHandler is a FrequencyResponse adding some ResponseHandles. It is
    // meant as a universal user interface for equalizers and the like.
    _class: "ResponseHandler",
    Extends: FrequencyResponse,
    options: {
        importance_label:  4,   // multiplicator of square pixels on hit testing
                                // labels to gain importance
        importance_handle: 1,   // multiplicator of square pixels on hit testing
                                // handles to gain importance
        importance_border: 50,  // multiplicator of square pixels on hit testing
                                // borders to gain importance
        range_z:           { scale: _TOOLKIT_LINEAR }, // Range z options
        depth:             0,   // the depth of the z axis (basis of range_z)
        handles:           []   // list of bands to create on init
    },
    initialize: function (options) {
        this.handles = [];
        this._active = 0;
        FrequencyResponse.prototype.initialize.call(this, options);
        
        this.add_range(this.options.range_z, "range_z");
        if (this.options.depth)
            this.set("depth", this.options.depth, true);
//         this.range_z.add_event("set", function (key, value, hold) {
//             if (!hold) this.redraw();
//         }.bind(this));
        
        TK.add_class(this.element, "toolkit-response-handler");
        this._handles = TK.make_svg("g", {"class": "toolkit-response-handles"});
        this.element.appendChild(this._handles);
        this.element.onselectstart = function () { return false; };
        var cb = function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }.bind(this);
        this.element.addEventListener('mousewheel', cb);
        this.element.addEventListener('DOMMouseScroll', cb);
        this.add_handles(this.options.handles);
    },
    
    redraw: function (graphs, grid) {
        FrequencyResponse.prototype.redraw.call(this, graphs, grid);
    },
    
    destroy: function () {
        this.empty(); // ???
        this._handles.remove();
        FrequencyResponse.prototype.destroy.call(this);
    },
    
    add_handle: function (options) {
        // ad a new handle to the widget. Options is an object containing
        // options for the handle
        options["container"] = this._handles;
        if (typeof options["range_x"] == "undefined")
            options["range_x"] = function () { return this.range_x; }.bind(this);
        if (typeof options["range_y"] == "undefined")
            options["range_y"] = function () { return this.range_y; }.bind(this);
        if (typeof options["range_z"] == "undefined")
            options["range_z"] = function () { return this.range_z; }.bind(this);
        
        options["intersect"] = this.intersect.bind(this);
        
        var h = new ResponseHandle(options);
        var _mousemove = h._mousemove.bind(h);
        var _mouseup = h._mouseup.bind(h);
        var _touchmove = h._touchmove.bind(h);
        var _touchend = h._touchend.bind(h);
        this.handles.push(h);
        h.add_events(["handlegrabbed", "zchangestarted"], function () {
            this._active++;
            document.addEventListener("mousemove", _mousemove);
            document.addEventListener("mouseup",   _mouseup);
            document.addEventListener("touchmove", _touchmove);
            document.addEventListener("touchend",  _touchend);
        }.bind(this));
        h.add_events(["destroy", "handlereleased", "zchangeended"],  function () {
            if (this._active) this._active--;
            document.removeEventListener("mousemove", _mousemove);
            document.removeEventListener("mouseup",   _mouseup);
            document.removeEventListener("touchmove", _touchmove);
            document.removeEventListener("touchend",  _touchend);
        }.bind(this));
        this.fire_event("handleadded", h);
        return h;
    },
    add_handles: function (handles) {
        for (var i = 0; i < handles.length; i++)
            this.add_handles(handles[i]);
    },
    
    remove_handle: function (handle) {
        // remove a handle from the widget.
        for (var i = 0; i < this.handles.length; i++) {
            if (this.handles[i] == handle) {
                this.handles[i].destroy();
                this.handles.splice(i, 1);
                this.fire_event("handleremoved");
                break;
            }
        }
    },
    remove_handles: function () {
        // remove all handles from the widget.
        for (var i = 0; i < this.handles.length; i++) {
            this.remove_handle(this.handles[i]);
        }
        this.handles = [];
        this.fire_event("emptied")
    },
    
    intersect: function (x1, y1, x2, y2, id) {
        // this function walks over all known handles and asks for the coords
        // of the label and the handle. Calculates intersecting square pixels
        // according to the importance set in options. Returns an object
        // containing intersect (the amount of intersecting square pixels) and
        // count (the amount of overlapping elements)
        var c = 0;
        var a = 0;
        for (var i = 0; i < this.handles.length; i++) {
            var h = this.handles[i];
            if (h.options.id == id || !h.get("active")) continue;
            
            var _a = hit_test(
                     x1, y1, x2, y2,
                     h.handle.x1, h.handle.y1, h.handle.x2, h.handle.y2)
                     * this.options.importance_handle;
            if (_a) c ++;
            a += _a;
            
            var _a = hit_test(x1, y1, x2, y2,
                     h.label.x1, h.label.y1, h.label.x2, h.label.y2)
                     * this.options.importance_label;
            if (_a) c ++;
            a += _a;
        }
        if (this.bands && this.bands.length) {
            for (var i = 0; i < this.bands.length; i++) {
                var b = this.bands[i];
                if (b.options.id == id || !b.get("active")) continue;
                
                var _a = hit_test(
                         x1, y1, x2, y2,
                         b.handle.x1, b.handle.y1, b.handle.x2, b.handle.y2)
                         * this.options.importance_handle;
                if (_a) c ++;
                a += _a;
                
                var _a = hit_test(x1, y1, x2, y2,
                         b.label.x1, b.label.y1, b.label.x2, b.label.y2)
                         * this.options.importance_label;
                if (_a) c ++;
                a += _a;
            }
        }
        a += ((x2 - x1) * (y2 - y1) - hit_test(
             x1, y1, x2, y2, 0, 0,
             this.range_x.get("basis"), this.range_y.get("basis")))
             * this.options.importance_border;
        return {intersect: a, count: c};
    },
    
    // GETTER & SETER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "depth":
                this.range_z.set("basis", value, hold);
                break;
        }
        FrequencyResponse.prototype.set.call(this, key, value, hold);
    }
});
})(this);
