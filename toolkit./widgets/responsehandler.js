/*******************************************************************************
 * toolkit. by Junger
 * 
 * This toolkit provides different widgets, implements and modules for building
 * audio based applications in webbrowsers.
 * 
 * Concept and realization by Markus Schmidt <schmidt@boomshop.net> for:
 * 
 * Jünger Audio GmbH
 * Justus-von-Liebig-Straße 7
 * 12489 Berlin · Germany
 * Tel: +49 30 67 77 21 0
 * http://junger-audio.com
 * info@junger-audio.com
 * 
 * toolkit. relies on mootools: http://mootools.net/
 * 
 * There is no license by now - all rights reserved. Hope we can fix this major
 * bug soon.
 ******************************************************************************/


var ResponseHandler = new Class({
    // ResponseHandler is a FrequencyResponse adding some ResponseHandles. It is
    // meant as a universal user interface for equalizers and the like.
    Extends: FrequencyResponse,
    options: {
        importance_label:  4,   // multiplicator of square pixels on hit testing
                                // labels to gain importance
        importance_handle: 1,   // multiplicator of square pixels on hit testing
                                // handles to gain importance
        importance_border: 50,  // multiplicator of square pixels on hit testing
                                // borders to gain importance
        range_z:           { scale: _TOOLKIT_LINEAR }, // Range z options
        depth:             0    // the depth of the z axis (basis of range_z)
    },
    handles: [],
    _active: 0,
    
    initialize: function (options) {
        this.parent(options);
        
        this.add_range(this.options.range_z, "range_z");
        if(this.options.depth)
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
        this.handles.push(h);
        h.addEvent("startdrag", function () { this._active ++ }.bind(this));
        h.addEvent("stopdrag",  function () {
            this._active = Math.max(this._active-1, 0)
        }.bind(this));
        this.element.addEvent("mousemove", h._mousemove.bind(h));
        this.element.addEvent("mouseup",   h._mouseup.bind(h));
        this.element.addEvent("touchmove", h._touchmove.bind(h));
        this.element.addEvent("touchend",  h._touchend.bind(h));
        this.fireEvent("handleadded", [h, this]);
        return h;
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
        if(this.bands && this.bands.length) {
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
             this.options.width, this.options.height))
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
