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

Resize = $class({
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
        max       : {x: -1, y: -1}, // object containing x and y determining maximum size
        
                                
    },
    initialize: function (options) {
        Widget.prototype.initialize.call(this, options);
        this.set("handle", this.options.handle);
        Widget.prototype.initialized.call(this);
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
        this._xstart = e.pageX;
        this._ystart = e.pageY;
        this._xsize  = this.options.element.offsetWidth;
        this._ysize  = this.options.element.offsetHeight;
        this._xpos   = this.options.element.offsetLeft;
        this._ypos   = this.options.element.offsetTop;
        this.fire_event("start", [e, this]);
    },
    _dragend: function (e, drag) {
        this.fire_event("stop", [e, this]);
    },
    _dragging: function (e, drag) {
        var w = this._xsize + e.pageX - this._xstart;
        var h = this._ysize + e.pageY - this._ystart;
        if (this.options.min.x >= -1)
            w = Math.max(this.options.min.x, w);
        if (this.options.max.x >= -1)
            w = Math.min(this.options.max.x, w);
        if (this.options.min.y >= -1)
            h = Math.max(this.options.min.x, h);
        if (this.options.max.y >= -1)
            h = Math.min(this.options.max.x, h);
        this.options.element.style.width = w + "px";
        this.options.element.style.height = h + "px";
        
        this.fire_event("resizing", [e, w, h, this]);
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
                    this._set_handle();
                break;
        }
        Widget.prototype.set.call(this, key, value, hold);
    }
});
