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
function dragstart(e, drag) {
    var O = this.options;
    if (!O.active) return;
    var E = O.node;
    this._xstart = e.pageX;
    this._ystart = e.pageY;
    this._xsize  = E.offsetWidth;
    this._ysize  = E.offsetHeight;
    this._xpos   = E.offsetLeft;
    this._ypos   = E.offsetTop;
    this.fire_event("resizestart", e);
}
function dragend(e, drag) {
    if (!this.options.active) return;
    this.fire_event("resizestop", e);
}
function dragging(e, drag) {
    var O = this.options;
    if (!O.active) return;
    var w = this._xsize + e.pageX - this._xstart;
    var h = this._ysize + e.pageY - this._ystart;
    if (O.min.x >= -1) w = Math.max(O.min.x, w);
    if (O.max.x >= -1) w = Math.min(O.max.x, w);
    if (O.min.y >= -1) h = Math.max(O.min.y, h);
    if (O.max.y >= -1) h = Math.min(O.max.y, h);
    O.node.style.width = w + "px";
    O.node.style.height = h + "px";
    
    this.fire_event("resizing", e, w, h);
}
function set_handle() {
    var h = this.options.handle;
    if (this.drag)
        this.drag.destroy();
    var range = new TK.Range({});
    this.drag = new TK.DragValue({ node: h,
        range: function () { return range; },
        onStartdrag  : dragstart.bind(this),
        onStopdrag   : dragend.bind(this),
        onDragging   : dragging.bind(this)
    });
}
/**
 * TK.Resize allows resizing of elements. It does that by continuously resizing an
 * element while the user drags a handle.
 *
 * @class TK.Resize
 * @extends TK.Base
 */
w.TK.Resize = w.Resize = $class({
    // TK.Resize enables resizing of elements on the screen.
    _class: "Resize",
    Extends: TK.Base,
    _options: {
        handle : "object",
        active : "boolean",
        min : "object",
        max : "object",
        node : "object",
    },
    options: {
        node      : null,           // the element to resize
        handle    : null,           // a DOM node used as handle. if none set
                                    // element is used
        active    : true,           // set to false if resize is disabled
        min       : {x: -1, y: -1}, // object containing x and y determining minimum size
                                    // a value of -1 means no min
        max       : {x: -1, y: -1}, // object containing x and y determining maximum size
                                    // a value of -1 means no max
    },
    initialize: function (options) {
        TK.Base.prototype.initialize.call(this, options);
        this.set("handle", this.options.handle);
    },
    // GETTERS & SETTERS
    set: function (key, value) {
        if (key === "handle") {
            if (!value) value = this.options.node;
            set_handle.call(this);
        }
        TK.Base.prototype.set.call(this, key, value);
    }
});
})(this);
