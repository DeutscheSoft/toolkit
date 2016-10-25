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
(function(w){ 
function calculate_overlap(X, Y) {
    /* no overlap, return 0 */
    if (X[2] < Y[0] || Y[2] < X[0] || X[3] < Y[1] || Y[3] < X[1]) return 0;

    return (Math.min(X[2], Y[2]) - Math.max(X[0], Y[0])) *
           (Math.min(X[3], Y[3]) - Math.max(X[1], Y[1]));
}

function show_handles() {
    var handles = this.handles;

    for (var i = 0; i < handles.length; i++) {
        this.add_child(handles[i]);
    }
}

function hide_handles() {
    var handles = this.handles;

    for (var i = 0; i < handles.length; i++) {
        this.remove_child(handles[i]);
    }
}
    
w.TK.ResponseHandler = w.ResponseHandler = $class({
    /**
     * TK.ResponseHandler is a TK.FrequencyResponse adding some ResponseHandles. It is
     * meant as a universal user interface for equalizers and the like.
     *
     * @class TK.ResponseHandler
     * @extends TK.FrequencyResponse
     */
    _class: "ResponseHandler",
    Extends: TK.FrequencyResponse,
    _options: Object.assign(Object.create(TK.FrequencyResponse.prototype._options), {
        importance_label:  "number",
        importance_handle: "number",
        importance_border: "number",
        range_z: "object",
        depth: "number",
        handles: "array", 
        show_handles: "boolean",
    }),
    options: {
        importance_label:  4,   // multiplicator of square pixels on hit testing
                                // labels to gain importance
        importance_handle: 1,   // multiplicator of square pixels on hit testing
                                // handles to gain importance
        importance_border: 50,  // multiplicator of square pixels on hit testing
                                // borders to gain importance
        range_z:           { scale: "linear", min: 0, max: 1 }, // TK.Range z options
        depth:             0,   // the depth of the z axis (basis of range_z)
        handles:           [],  // list of bands to create on init
        show_handles: true,
    },
    initialize: function (options) {
        this.handles = [];
        TK.FrequencyResponse.prototype.initialize.call(this, options);
        
        this.add_range(this.options.range_z, "range_z");
        if (this.options.depth)
            this.set("depth", this.options.depth, true);
//         this.range_z.add_event("set", function (key, value, hold) {
//             if (!hold) this.redraw();
//         }.bind(this));
        
        TK.add_class(this.element, "toolkit-response-handler");
        this._handles = TK.make_svg("g", {"class": "toolkit-response-handles"});
        this.svg.appendChild(this._handles);
        this.svg.onselectstart = function () { return false; };
        var cb = function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };
        this.add_event("mousewheel", cb);
        this.add_event("DOMMouseScroll", cb);
        this.add_handles(this.options.handles);
    },
    
    redraw: function () {
        var I = this.invalid;
        var O = this.options;

        if (I.show_handles) {
            I.show_handles = false;
            if (O.show_handles) {
                this._handles.style.removeProperty("display");
            } else {
                this._handles.style.display = "none";
            }
        }

        TK.FrequencyResponse.prototype.redraw.call(this);
    },
    
    destroy: function () {
        this.empty(); // ???
        this._handles.remove();
        TK.FrequencyResponse.prototype.destroy.call(this);
    },
    
    /*
     * Add a new handle to the widget. Options is an object containing
     * options for the TK.ResponseHandle
     * 
     * @method TK.ResponseHandler#add_handle
     * @param {Object} options - The options for the TK.ResponseHandle
     * @emits TK.ResponseHandler#handleadded
     */
    add_handle: function (options) {
        options.container = this._handles;
        if (options.range_x === void(0))
            options.range_x = function () { return this.range_x; }.bind(this);
        if (options.range_y === void(0))
            options.range_y = function () { return this.range_y; }.bind(this);
        if (options.range_z === void(0))
            options.range_z = function () { return this.range_z; }.bind(this);
        
        options.intersect = this.intersect.bind(this);
        
        var h = new TK.ResponseHandle(options);
        this.handles.push(h);
        h.add_events(["handlegrabbed", "zchangestarted"], function () {
            document.addEventListener("mousemove", this._mousemove);
            document.addEventListener("mouseup",   this._mouseup);
            document.addEventListener("touchmove", this._touchmove);
            document.addEventListener("touchend",  this._touchend);
        });
        h.add_events(["destroy", "handlereleased", "zchangeended"],  function () {
            document.removeEventListener("mousemove", this._mousemove);
            document.removeEventListener("mouseup",   this._mouseup);
            document.removeEventListener("touchmove", this._touchmove);
            document.removeEventListener("touchend",  this._touchend);
        });
        if (this.options.show_handles)
            this.add_child(h);
        /**
         * Is fired when a new handle was added.
         * @type {Handle}
         * @event TK.ResponseHandler#handleadded
         */
        this.fire_event("handleadded", h);
        return h;
    },
    /*
     * Add multiple new {@link TK.ResponseHandle} to the widget. Options is an array
     * of objects containing options for the new instances of {@link TK.ResponseHandle}.
     * 
     * @method TK.ResponseHandler#add_handles
     * @param {Array<Object>} options - An array of options objects for the {@link TK.ResponseHandle}.
     */
    add_handles: function (handles) {
        for (var i = 0; i < handles.length; i++)
            this.add_handle(handles[i]);
    },
    /*
     * Remove a handle from the widget.
     * 
     * @method TK.ResponseHandler#remove_handle
     * @param {TK.ResponseHandle} handle - The {@link TK.ResponseHandle} to remove.
     * @emits TK.ResponseHandler#handleremoved
     */
    remove_handle: function (handle) {
        // remove a handle from the widget.
        for (var i = 0; i < this.handles.length; i++) {
            if (this.handles[i] === handle) {
                if (this.options.show_handles)
                    this.remove_child(handle);
                this.handles[i].destroy();
                this.handles.splice(i, 1);
                /**
                 * Is fired when a handle was removed.
                 * @event TK.ResponseHandler#handleremoved
                 */
                this.fire_event("handleremoved");
                break;
            }
        }
    },
    /*
     * Remove multiple {@link TK.ResponseHandle} from the widget. Options is an array
     * of {@link TK.ResponseHandle} instances.
     * 
     * @method TK.ResponseHandler#remove_handles
     * @param {Array<TK.ResponseHandle>} handles - An array of {@link TK.ResponseHandle} instances.
     */
    remove_handles: function () {
        // remove all handles from the widget.
        for (var i = 0; i < this.handles.length; i++) {
            this.remove_handle(this.handles[i]);
        }
        this.handles = [];
        /**
         * Is fired when all handles are removed.
         * @event TK.ResponseHandler#emptied
         */
        this.fire_event("emptied")
    },
    
    intersect: function (X, handle) {
        // this function walks over all known handles and asks for the coords
        // of the label and the handle. Calculates intersecting square pixels
        // according to the importance set in options. Returns an object
        // containing intersect (the amount of intersecting square pixels) and
        // count (the amount of overlapping elements)
        var c = 0;
        var a = 0, _a;
        var O = this.options;
        var importance_handle = O.importance_handle
        var importance_label = O.importance_label

        for (var i = 0; i < this.handles.length; i++) {
            var h = this.handles[i];
            if (h === handle || !h.get("active")) continue;
            
            _a = calculate_overlap(X, h.handle);

            if (_a) {
                c ++;
                a += _a * importance_handle;
            }
            
            _a = calculate_overlap(X, h.label);

            if (_a) {
                c ++;
                a += _a * importance_label;
            }
        }
        if (this.bands && this.bands.length) {
            for (var i = 0; i < this.bands.length; i++) {
                var b = this.bands[i];
                if (b === handle || !b.get("active")) continue;
                
                _a = calculate_overlap(X, b.handle);

                if (_a > 0) {
                    c ++;
                    a += _a * importance_handle;
                }
                
                _a = calculate_overlap(X, b.label);
                if (_a > 0) {
                    c ++;
                    a += _a * importance_label;
                }
            }
        }
        /* calculate intersection with border */
        _a = calculate_overlap(X, [ 0, 0, this.range_x.options.basis, this.range_y.options.basis ]);
        a += ((X[2] - X[0]) * (X[3] - X[1]) - _a) * O.importance_border;
        return {intersect: a, count: c};
    },
    
    // GETTER & SETER
    set: function (key, value) {
        value = TK.FrequencyResponse.prototype.set.call(this, key, value);
        switch (key) {
            case "depth":
                this.range_z.set("basis", value);
                break;
            case "show_handles":
                if (value) show_handled();
                else hide_handles();
                break;
        }
    }
});
})(this);
