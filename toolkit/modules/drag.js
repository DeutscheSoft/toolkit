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
w.Drag = $class({
    // Resize enables resizing of elements on the screen.
    _class: "Drag",
    Extends: Widget,
    options: {
        element   : null,           // the element to resize
        handle    : null,           // a DOM node used as handle. if none set
                                    // element is used
        active    : true,           // set to false if resize is disabled
        min       : {x: -1, y: -1}, // object containing x and y determining minimum size
                                    // a value of false means no min
        max       : {x: -1, y: -1}, // object containing x and y determining maximum size
                                    // a value of false means no max
    },
    initialize: function (options) {
        Widget.prototype.initialize.call(this, options);
        this.set("handle", this.options.handle);
    },
    _set_handle: function () {
        var h = this.options.handle;
        if (this.drag)
            this.drag.destroy();
        var range = new Range({});
        this.drag = new DragValue({ element: h,
            range: function () { return range; },
            onStartdrag  : this._dragstart.bind(this),
            onStopdrag   : this._dragend.bind(this),
            onDragging   : this._dragging.bind(this)
        });
    },
    _dragstart: function (e, drag) {
        if (!this.options.active)
            return;
        this._xstart = e.pageX;
        this._ystart = e.pageY;
        this._xpos   = this.options.element.offsetLeft;
        this._ypos   = this.options.element.offsetTop;
        if (!this.options.active)
            return;
        this.fire_event("start", e);
    },
    _dragend: function (e, drag) {
        if (!this.options.active)
            return;
        this.fire_event("stop", e);
    },
    _dragging: function (e, drag) {
        if (!this.options.active)
            return;
        var x = this._xpos + e.pageX - this._xstart;
        var y = this._ypos + e.pageY - this._ystart;
        if (this.options.min.x !== false)
            x = Math.max(this.options.min.x, x);
        if (this.options.max.x !== false)
            x = Math.min(this.options.max.x, x);
        if (this.options.min.y !== false)
            y = Math.max(this.options.min.y, y);
        if (this.options.max.y !== false)
            y = Math.min(this.options.max.y, y);
        this.options.element.style.top = y + "px";
        this.options.element.style.left = x + "px";
        
        this.fire_event("resizing", e, x, y);
    },
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "handle":
                if (!value)
                    this.options.handle = this.options.element;
                if (!hold)
                    this._set_handle();
                break;
        }
        Widget.prototype.set.call(this, key, value, hold);
    }
});
})(this);
