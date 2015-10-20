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
function dragstart(e, drag) {
    var O = this.options;
    if (!O.active) return;
    this._xstart = e.pageX;
    this._ystart = e.pageY;
    this._xsize  = O.element.offsetWidth;
    this._ysize  = O.element.offsetHeight;
    this._xpos   = O.element.offsetLeft;
    this._ypos   = O.element.offsetTop;
    this.fire_event("start", e);
}
function dragend(e, drag) {
    if (!this.options.active) return;
    this.fire_event("stop", e);
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
    O.element.style.width = w + "px";
    O.element.style.height = h + "px";
    
    this.fire_event("resizing", e, w, h);
}
function set_handle() {
    var h = this.options.handle;
    if (this.drag)
        this.drag.destroy();
    var range = new Range({});
    this.drag = new DragValue({ element: h,
        range: function () { return range; },
        onStartdrag  : dragstart.bind(this),
        onStopdrag   : dragend.bind(this),
        onDragging   : dragging.bind(this)
    });
}
w.Resize = $class({
    // Resize enables resizing of elements on the screen.
    _class: "Resize",
    Extends: Widget,
    options: {
        element   : null,           // the element to resize
        handle    : null,           // a DOM node used as handle. if none set
                                    // element is used
        direction : _TOOLKIT_SE,    // _TOOLKIT_N, _TOOLKIT_S, _TOOLKIT_E, _TOOLKIT_W,
                                    // _TOOLKIT_NE, _TOOLKIT_SE, _TOOLKIT_SW, _TOOLKIT_NW,
        active    : true,           // set to false if resize is disabled
        min       : {x: -1, y: -1}, // object containing x and y determining minimum size
                                    // a value of -1 means no min
        max       : {x: -1, y: -1}, // object containing x and y determining maximum size
                                    // a value of -1 means no max
    },
    initialize: function (options) {
        Widget.prototype.initialize.call(this, options);
        this.set("handle", this.options.handle);
    },
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "handle":
                if (!value)
                    this.options.handle = this.options.element;
            case "handle":
            case "direction":
                if (!hold)
                    set_handle.call(this);
                break;
        }
        Widget.prototype.set.call(this, key, value, hold);
    }
});
})(this);
