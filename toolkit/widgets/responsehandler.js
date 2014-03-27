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
 
var ResponseHandler = new Class({
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
    handles: [],
    _active: 0,
    
    initialize: function (options) {
        this.parent(options);
        
        this.add_range(this.options.range_z, "range_z");
        if (this.options.depth)
            this.set("depth", this.options.depth, true);
//         this.range_z.addEvent("set", function (key, value, hold) {
//             if (!hold) this.redraw();
//         }.bind(this));
        
        this.element.addClass("toolkit-response-handler");
        this._handles = makeSVG("g",
            {"class": "toolkit-response-handles"}).inject(this.element);
        this.element.onselectstart = function () { return false; };
        this.element.addEvent('mousewheel', function (e) {
            e.event.preventDefault();
            e.event.stopPropagation();
            return false;
        }.bind(this));
        this.add_handles(this.options.handles);
        this.redraw();
    },
    
    redraw: function (graphs, grid) {
        this.parent(graphs, grid);
    },
    
    destroy: function () {
        this.empty();
        this._handles.destroy();
        this.parent();
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
        h.addEvent("handlegrabbed", function () {
            this._active++;
            document.addEvent("mousemove", _mousemove);
            document.addEvent("mouseup",   _mouseup);
            document.addEvent("touchmove", _touchmove);
            document.addEvent("touchend",  _touchend);
        }.bind(this));
        h.addEvent("handlereleased",  function () {
            if (this._active) this._active--;
            document.removeEvent("mousemove", _mousemove);
            document.removeEvent("mouseup",   _mouseup);
            document.removeEvent("touchmove", _touchmove);
            document.removeEvent("touchend",  _touchend);
        }.bind(this));
        this.fireEvent("handleadded", [h, this]);
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
                this.fireEvent("handleremoved", this);
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
        this.fireEvent("emptied", this)
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
            
            var _a = this._hit_test(
                     x1, y1, x2, y2,
                     h.handle.x1, h.handle.y1, h.handle.x2, h.handle.y2)
                     * this.options.importance_handle;
            if (_a) c ++;
            a += _a;
            
            var _a = this._hit_test(x1, y1, x2, y2,
                     h.label.x1, h.label.y1, h.label.x2, h.label.y2)
                     * this.options.importance_label;
            if (_a) c ++;
            a += _a;
        }
        if (this.bands && this.bands.length) {
            for (var i = 0; i < this.bands.length; i++) {
                var b = this.bands[i];
                if (b.options.id == id || !b.get("active")) continue;
                
                var _a = this._hit_test(
                         x1, y1, x2, y2,
                         b.handle.x1, b.handle.y1, b.handle.x2, b.handle.y2)
                         * this.options.importance_handle;
                if (_a) c ++;
                a += _a;
                
                var _a = this._hit_test(x1, y1, x2, y2,
                         b.label.x1, b.label.y1, b.label.x2, b.label.y2)
                         * this.options.importance_label;
                if (_a) c ++;
                a += _a;
            }
        }
        a += ((x2 - x1) * (y2 - y1) - this._hit_test(
             x1, y1, x2, y2, 0, 0,
             this.range_x.get("basis"), this.range_y.get("basis")))
             * this.options.importance_border;
        return {intersect: a, count: c};
    },
    
    _hit_test: function (ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
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
    },
    
    // GETTER & SETER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "depth":
                this.range_z.set("basis", value, hold);
                break;
        }
        this.parent(key, value, hold);
    }
});
