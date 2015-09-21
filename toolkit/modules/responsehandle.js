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
w.ResponseHandle = $class({
    _class: "ResponseHandle",
    Extends: Widget,
    Implements: [GlobalCursor, Ranges, Warning],
    options: {
        range_x:          {},           // callback function returning a Range
                                        // module for x axis or an object with
                                        // options for a Range 
        range_y:          {},           // callback function returning a Range
                                        // module for y axis or an object with
                                        // options for a Range
        range_z:          {},           // callback function returning a Range
                                        // module for z axis or an object with
                                        // options for a Range
        intersect:        function () { return { intersect: 0, count: 0 } }, // callback function for checking intersections: function (x1, y1, x2, y2, id) {}
                                        // returns a value describing the amount of intersection with other handle elements.
                                        // intersections are weighted depending on the intersecting object. E.g. SVG borders have
                                        // a very high impact while intersecting in comparison with overlapping handle objects
                                        // that have a low impact on intersection
        mode:             _TOOLKIT_CIRCULAR, // mode of the handle:
                                        // _TOOLKIT_CIRCULAR: circular handle
                                        // _TOOLKIT_LINE_VERTICAL: x movement, line handle vertical
                                        // _TOOLKIT_LINE_HORIZONTAL: y movement, line handle horizontal
                                        // _TOOLKIT_BLOCK_LEFT: x movement, block lefthand
                                        // _TOOLKIT_BLOCK_RIGHT: x movement, block righthand
                                        // _TOOLKIT_BLOCK_TOP: y movement, block on top
                                        // _TOOLKIT_BLOCK_RIGHT: y movement, block on bottom
        preferences:      [_TOOLKIT_LEFT, _TOOLKIT_TOP, _TOOLKIT_RIGHT, _TOOLKIT_BOTTOM], // perferred position of the label
        label:            TK.FORMAT("%s\n%d Hz\n%.2f dB\nQ: %.2f"),
        x:                0,            // value for x axis depending on mode_x
        y:                0,            // value for y axis depending on mode_y
        z:                0,            // value for z axis depending on mode_z
        min_size:         24,           // minimum size of object in pixels, values can be smaller
        margin:           3,            // margin between label and handle
        z_handle:         false,        // draw a tiny handle for changing the z axis
        z_handle_size:    6,            // the size of the z handle in pixels if used.
        z_handle_centered:0.1,          // the width/height of the z handle if centered /top, right, bottom, left)
                                        // values > 1 are interpreted as pixels, values < 1 declare a percentual value of the handles width/height
        min_drag:         0,            // amount of pixels the handle has to be dragged before it starts to move
        x_min:            false,        // restrict movement on x axis
        x_max:            false,        // restrict movement on x axis
        y_min:            false,        // restrict movement on y axis
        y_max:            false,        // restrict movement on y axis
        z_min:            false,        // restrict movement on z axis
        z_max:            false,        // restrict movement on z axis
        active:           true,
        show_axis:        false         // show both axis on circular and opposite axis on block or line handle
    },
    
    initialize: function (options, hold) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.label =   {x:0, y: 0, width: 0, height:0};
        this.handle = {x:0, y: 0, width: 0, height:0};
        this.__active = false;
        this._add = .5;
        this._tdist = false;
        this._zinjected = false;
        this._zhandling = false;
        this._zwheel = false;
        this._sticky = false;
        Widget.prototype.initialize.call(this, options);
        
        this.add_range(this.options.range_x, "range_x");
        this.add_range(this.options.range_y, "range_y");
        this.add_range(this.options.range_z, "range_z");
        
        this.range_x.add_event("set", function (key, value, hold) {
            if (!hold) this.redraw();
        }.bind(this));
        this.range_y.add_event("set", function (key, value, hold) {
            if (!hold) this.redraw();
        }.bind(this));
        this.range_z.add_event("set", function (key, value, hold) {
            if (!hold) this.redraw();
        }.bind(this));
        
        this.widgetize(this.element = TK.make_svg("g", {
            "id":    this.options.id
        }), true, true);
        
        TK.add_class(this.element, "toolkit-response-handle");
        switch (this.options.mode) {
            case _TOOLKIT_CIRCULAR:
                TK.add_class(this.element, "toolkit-circular"); break;
            case _TOOLKIT_LINE_VERTICAL:
                TK.add_class(this.element, "toolkit-line-vertical");
                TK.add_class(this.element, "toolkit-line");
                break;
            case _TOOLKIT_LINE_HORIZONTAL:
                TK.add_class(this.element, "toolkit-line-horizontal");
                TK.add_class(this.element, "toolkit-line");
                break;
            case _TOOLKIT_BLOCK_LEFT:
                TK.add_class(this.element, "toolkit-block-left");
                TK.add_class(this.element, "toolkit-block");
                break;
            case _TOOLKIT_BLOCK_RIGHT:
                TK.add_class(this.element, "toolkit-block-right")
                TK.add_class(this.element, "toolkit-block");
                break;
            case _TOOLKIT_BLOCK_TOP:
                TK.add_class(this.element, "toolkit-block-top");
                TK.add_class(this.element, "toolkit-block");
                break;
            case _TOOLKIT_BLOCK_BOTTOM:
                TK.add_class(this.element, "toolkit-block");
                TK.add_class(this.element, "toolkit-block-bottom");
                break;
        }
        
        if (this.options.container)
            this.options.container.appendChild(this.element);
        
        this._label = TK.make_svg("text", {
            "class": "toolkit-label"
        });
        this.element.appendChild(this._label);
        
        this._line1 = TK.make_svg("path", {
            "class": "toolkit-line toolkit-line-1"
        });
        this.element.appendChild(this._line1);
        this._line2 = TK.make_svg("path", {
            "class": "toolkit-line toolkit-line-2"
        });
        this.element.appendChild(this._line2);
        
        this._handle = TK.make_svg(
            this.options.mode == _TOOLKIT_CIRCULAR ? "circle" : "rect", {
                "class": "toolkit-handle",
                "r":     this.options.z_handle_size
            }
        );
        this.element.appendChild(this._handle);
        
        this._zhandle = TK.make_svg(
            this.options.mode == _TOOLKIT_CIRCULAR ? "circle" : "rect", {
                "class": "toolkit-z-handle",
                "width":  this.options.z_handle_size,
                "height": this.options.z_handle_size
            }
        );
        
        this.element.addEventListener("mouseenter",     this._mouseenter.bind(this));
        this.element.addEventListener("mouseleave",     this._mouseleave.bind(this));
        this.element.addEventListener("mousedown",      this._mousedown.bind(this));
        this.element.addEventListener("touchstart",     this._touchstart.bind(this));
        
        this._label.addEventListener("mouseenter",      this._mouseelement.bind(this));
        this._label.addEventListener("touchstart",      this._mouseelement.bind(this));
        this._label.addEventListener("mousewheel",      this._scrollwheel.bind(this));
        this._label.addEventListener("DOMMouseScroll",  this._scrollwheel.bind(this));
        this._label.addEventListener("contextmenu",     function () { return false; });
        
        this._handle.addEventListener("mouseenter",     this._mouseelement.bind(this));
        this._handle.addEventListener("touchstart",     this._mouseelement.bind(this));
        this._handle.addEventListener("mousewheel",     this._scrollwheel.bind(this));
        this._handle.addEventListener("DOMMouseScroll", this._scrollwheel.bind(this));
        this._handle.addEventListener("contextmenu",    function () { return false; });
        this._handle.addEventListener("touchstart",     this._touchstart.bind(this));
        
        this._zhandle.addEventListener("mousedown",     this._zhandledown.bind(this));
        this._zhandle.addEventListener("touchstart",    this._zhandledown.bind(this));
        
        this._handle.onselectstart = function () { return false; };
        
        this.set("active", this.options.active, true);
        if (!hold) this.redraw();
        
        Widget.prototype.initialized.call(this);
    },
    
    redraw: function () {
        var x      = 0;
        var y      = 0;
        var width  = 0;
        var height = 0;
        var m      = this.options.margin;
        
        if ((this._zhandling || this._zwheel)
        && (this.options.z >= this.options.z_max && this.options.z_max !== false
        ||  this.options.z <= this.options.z_min && this.options.z_min !== false)) {
            this.warning(this.element);
        }
        
        // do we have to restrict movement?
        if (this.options.x_min !== false)
            this.options.x = Math.max(this.options.x_min, this.options.x);
        if (this.options.x_max !== false)
            this.options.x = Math.min(this.options.x_max, this.options.x);
        if (this.options.y_min !== false)
            this.options.y = Math.max(this.options.y_min, this.options.y);
        if (this.options.y_max !== false)
            this.options.y = Math.min(this.options.y_max, this.options.y);
        if (this.options.z_min !== false)
            this.options.z = Math.max(this.options.z_min, this.options.z);
        if (this.options.z_max !== false)
            this.options.z = Math.min(this.options.z_max, this.options.z);
        
        this.options.x = this.range_x.snap_value(this.options.x);
        this.options.y = this.range_y.snap_value(this.options.y);
        this.options.z = this.range_z.snap_value(this.options.z);
        
        this.x = this.range_x.val2px(this.options.x);
        this.y = this.range_y.val2px(this.options.y);
        this.z = this.range_z.val2px(this.options.z);
        
        var rnd = {
            x: Math.round(this.x),
            y: Math.round(this.y),
            z: Math.round(this.z)
        }
        
        // ELEMENT / HANDLE / MAIN COORDS
        switch (this.options.mode) {
            case _TOOLKIT_CIRCULAR:
                // circle
                x      = rnd.x;
                y      = rnd.y;
                width  = Math.max(this.options.min_size, rnd.z);
                height = width;
                this._handle.setAttribute("r", width / 2);
                this.element.setAttribute("transform",  "translate(" + x + "," + y + ")");
                this.handle = {
                    x1: x - width / 2,
                    y1: y - width / 2,
                    x2: x + width / 2,
                    y2: y + height / 2
                }
                break;
            case _TOOLKIT_LINE_VERTICAL:
                // line vertical
                width  = Math.round(Math.max(this.options.min_size, rnd.z));
                x      = Math.round(
                            Math.min(
                                this.range_x.get("basis") - width / 2,
                                Math.max(width / -2, rnd.x - width / 2)));
                y      = Math.round(
                            Math.max(
                                0,
                                this.options.y_max === false ?
                                0 : this.range_y.val2px(this.options.y_max)));
                height = Math.round(
                             Math.min(
                                 this.range_y.get("basis"),
                                 this.options.y_min === false
                                     ? this.range_y.get("basis")
                                     : this.range_y.val2px(this.options.y_min)) - y);
                this._handle.setAttribute("x", x);
                this._handle.setAttribute("y", y);
                this._handle.setAttribute("width", width);
                this._handle.setAttribute("height", height);
                this.element.setAttribute("transform", "translate(0,0)");
                this.handle = {x1: x, y1: y, x2: x + width, y2: y + height};
                break;
            case _TOOLKIT_LINE_HORIZONTAL:
                // line horizontal
                height = Math.round(Math.max(this.options.min_size, rnd.z));
                y      = Math.round(
                            Math.min(
                                this.range_y.get("basis") - height / 2,
                                Math.max(height / -2, rnd.y - height / 2)));
                x      = Math.round(
                            Math.max(
                                0,
                                this.options.x_min === false
                                    ? 0 : this.range_x.val2px(this.options.x_min)));
                width  = Math.round(
                             Math.min(
                                 this.range_x.get("basis"),
                                 this.options.x_max === false
                                     ? this.range_x.get("basis")
                                     : this.range_x.val2px(this.options.x_max)) - x);
                this._handle.setAttribute("x", x);
                this._handle.setAttribute("y", y);
                this._handle.setAttribute("width", width);
                this._handle.setAttribute("height", height);
                this.element.setAttribute("transform", "translate(0,0)");
                this.handle = {x1: x, y1: y, x2: x + width, y2: y + height};
                break;
            case _TOOLKIT_BLOCK_LEFT:
                // rect lefthand
                x      = 0;
                y      = Math.round(
                            Math.max(
                                0,
                                this.options.y_max === false
                                    ? 0 : this.range_y.val2px(this.options.y_max)));
                width  = Math.round(
                            Math.max(
                                this.options.min_size / 2,
                                Math.min(rnd.x, this.range_x.get("basis"))));
                height = Math.round(
                            Math.min(
                                this.range_y.get("basis"),
                                this.options.y_min === false
                                    ? this.range_y.get("basis")
                                    : this.range_y.val2px(this.options.y_min)) - y);
                this._handle.setAttribute("x", x);
                this._handle.setAttribute("y", y);
                this._handle.setAttribute("width", width);
                this._handle.setAttribute("height", height);
                this.element.setAttribute("transform", "translate(0,0)");
                this.handle = {x1: x, y1: y, x2: x + width, y2: y + height};
                break;
            case _TOOLKIT_BLOCK_RIGHT:
                // rect righthand
                x      = Math.max(
                            0,
                            Math.min(
                                rnd.x,
                                this.range_x.get("basis") - this.options.min_size / 2));
                y      = Math.round(
                            Math.max(
                                0,
                                this.options.y_max === false
                                    ? 0 : this.range_y.val2px(this.options.y_max)));
                width  = Math.max(
                            this.options.min_size / 2,
                            this.range_x.get("basis") - x);
                height = Math.round(
                            Math.min(
                                this.range_y.get("basis"),
                                this.options.y_min === false
                                    ? this.range_y.get("basis")
                                    : this.range_y.val2px(this.options.y_min)) - y);
                this._handle.setAttribute("x", x);
                this._handle.setAttribute("y", y);
                this._handle.setAttribute("width", width);
                this._handle.setAttribute("height", height);
                this.element.setAttribute("transform", "translate(0,0)");
                this.handle = {x1: x, y1: y, x2: x + width, y2: y + height};
                break;
            case _TOOLKIT_BLOCK_TOP:
                // rect top
                x      = Math.round(Math.max(
                            0,
                            this.options.x_min === false
                                ? 0 : this.range_x.val2px(this.options.x_min)));
                y      = 0;
                width  = Math.round(
                            Math.min(
                                this.range_x.get("basis"),
                                this.options.x_max === false
                                    ? this.range_x.get("basis")
                                    : this.range_x.val2px(this.options.x_max)) - x);
                height = Math.round(
                            Math.max(
                                this.options.min_size / 2,
                                Math.min(rnd.y, this.range_y.get("basis"))));
                this._handle.setAttribute("x", x);
                this._handle.setAttribute("y", y);
                this._handle.setAttribute("width", width);
                this._handle.setAttribute("height", height);
                this.element.setAttribute("transform", "translate(0,0)");
                this.handle = {x1: x, y1: y, x2: x + width, y2: y + height};
                break;
            case _TOOLKIT_BLOCK_BOTTOM:
                // rect bottom
                x      = Math.round(Math.max(
                            0,
                            this.options.x_min === false
                                ? 0 : this.range_x.val2px(this.options.x_min)));
                y      = Math.max(
                            0,
                            Math.min(
                                rnd.y,
                                this.range_y.get("basis") - this.options.min_size / 2));
                width  = Math.round(Math.min(
                            this.range_x.get("basis"),
                            this.options.x_max === false
                                ? this.range_x.get("basis")
                                : this.range_x.val2px(this.options.x_max)) - x);
                height = Math.max(
                            this.options.min_size / 2,
                            this.range_y.get("basis") - y);
                this._handle.setAttribute("x", x);
                this._handle.setAttribute("y", y);
                this._handle.setAttribute("width", width);
                this._handle.setAttribute("height", height);
                this.element.setAttribute("transform", "translate(0,0)");
                this.handle = {x1: x, y1: y, x2: x + width, y2: y + height};
                break;
        }
        
        
        // Z-HANDLE
        if (this.options.z_handle === false) {
            if (this._zinjected) {
                TK.destroy(this._zhandle);
                this._zinjected = false;
            }
        } else {
            if (!this._zinjected) {
                this.element.appendChild(this._zhandle);
                this._zinjected = true;
            }
            switch (this.options.mode) {
                // circular handles
                case _TOOLKIT_CIRCULAR:
                    switch (this.options.z_handle) {
                        case _TOOLKIT_TOP_LEFT:
                            this._zhandle.setAttribute("cx", width/-2 + this.options.z_handle_size / 2);
                            this._zhandle.setAttribute("cy", height/-2 + this.options.z_handle_size / 2);
                            this._zhandle.setAttribute("r",  this.options.z_handle_size / 2);
                            break;
                        case _TOOLKIT_TOP:
                            this._zhandle.setAttribute("cx", 0);
                            this._zhandle.setAttribute("cy", height/-2 + this.options.z_handle_size / 2);
                            this._zhandle.setAttribute("r",  this.options.z_handle_size / 2);
                            break;
                        case _TOOLKIT_TOP_RIGHT:
                            this._zhandle.setAttribute("cx", width/2 - this.options.z_handle_size / 2);
                            this._zhandle.setAttribute("cy", height/-2 + this.options.z_handle_size / 2);
                            this._zhandle.setAttribute("r",  this.options.z_handle_size / 2);
                            break;
                        case _TOOLKIT_LEFT:
                            this._zhandle.setAttribute("cx", width/-2 + this.options.z_handle_size / 2);
                            this._zhandle.setAttribute("cy", 0);
                            this._zhandle.setAttribute("r", this.options.z_handle_size / 2);
                            break;
                        case _TOOLKIT_RIGHT:
                        default:
                            this._zhandle.setAttribute("cx", width/2 - this.options.z_handle_size / 2);
                            this._zhandle.setAttribute("cy", 0);
                            this._zhandle.setAttribute("r",  this.options.z_handle_size / 2);
                            break;
                        case _TOOLKIT_BOTTOM_LEFT:
                            this._zhandle.setAttribute("cx", width/-2 + this.options.z_handle_size / 2);
                            this._zhandle.setAttribute("cy", height/2 - this.options.z_handle_size / 2);
                            this._zhandle.setAttribute("r", this.options.z_handle_size / 2);
                            break;
                        case _TOOLKIT_BOTTOM:
                            this._zhandle.setAttribute("cx", 0);
                            this._zhandle.setAttribute("cy", height/2 - this.options.z_handle_size / 2);
                            this._zhandle.setAttribute("r",  this.options.z_handle_size / 2);
                            break;
                        case _TOOLKIT_BOTTOM_RIGHT:
                            this._zhandle.setAttribute("cx", width/2 - this.options.z_handle_size / 2);
                            this._zhandle.setAttribute("cy", height/2 - this.options.z_handle_size / 2);
                            this._zhandle.setAttribute("r",  this.options.z_handle_size / 2);
                            break;
                    }
                    break;
                default:
                    // all other handle types (lines/blocks)
                    switch (this.options.z_handle) {
                        case _TOOLKIT_TOP_LEFT:
                        default:
                            this._zhandle.setAttribute("x",      x);
                            this._zhandle.setAttribute("y",      y);
                            this._zhandle.setAttribute("width",  this.options.z_handle_size);
                            this._zhandle.setAttribute("height", this.options.z_handle_size);
                            break;
                        case _TOOLKIT_TOP:
                            var _s = this.options.z_handle_centered < 1
                                   ? width * this.options.z_handle_centered
                                   : this.options.z_handle_centered
                            Math.max(_s, this.options.z_handle_size);
                            this._zhandle.setAttribute("x",      x + width / 2 - _s / 2);
                            this._zhandle.setAttribute("y",      y);
                            this._zhandle.setAttribute("width",  _s);
                            this._zhandle.setAttribute("height", this.options.z_handle_size);
                            break;
                        case _TOOLKIT_TOP_RIGHT:
                            this._zhandle.setAttribute("x",      x + width - this.options.z_handle_size);
                            this._zhandle.setAttribute("y",      y);
                            this._zhandle.setAttribute("width",  this.options.z_handle_size);
                            this._zhandle.setAttribute("height", this.options.z_handle_size);
                            break;
                        case _TOOLKIT_LEFT:
                            var _s = this.options.z_handle_centered < 1
                                   ? height * this.options.z_handle_centered
                                   : this.options.z_handle_centered
                            Math.max(_s, this.options.z_handle_size);
                            this._zhandle.setAttribute("x",      x);
                            this._zhandle.setAttribute("y",      y + height / 2 - _s / 2);
                            this._zhandle.setAttribute("width",  this.options.z_handle_size);
                            this._zhandle.setAttribute("height", _s);
                            break;
                        case _TOOLKIT_RIGHT:
                            var _s = this.options.z_handle_centered < 1
                                   ? height * this.options.z_handle_centered
                                   : this.options.z_handle_centered
                            Math.max(_s, this.options.z_handle_size);
                            this._zhandle.setAttribute("x",      x + width - this.options.z_handle_size);
                            this._zhandle.setAttribute("y",      y + height / 2 - _s / 2);
                            this._zhandle.setAttribute("width",  this.options.z_handle_size);
                            this._zhandle.setAttribute("height", _s);
                            break;
                        case _TOOLKIT_BOTTOM_LEFT:
                            this._zhandle.setAttribute("x",      x);
                            this._zhandle.setAttribute("y",      y + height - this.options.z_handle_size);
                            this._zhandle.setAttribute("width",  this.options.z_handle_size);
                            this._zhandle.setAttribute("height", this.options.z_handle_size);
                            break;
                        case _TOOLKIT_BOTTOM:
                            var _s = this.options.z_handle_centered < 1
                                   ? width * this.options.z_handle_centered
                                   : this.options.z_handle_centered
                            Math.max(_s, this.options.z_handle_size);
                            this._zhandle.setAttribute("x",      x + width / 2 - _s / 2);
                            this._zhandle.setAttribute("y",      y + height - this.options.z_handle_size);
                            this._zhandle.setAttribute("width",  _s);
                            this._zhandle.setAttribute("height", this.options.z_handle_size);
                            break;
                        case _TOOLKIT_BOTTOM_RIGHT:
                            this._zhandle.setAttribute("x",      x + width - this.options.z_handle_size);
                            this._zhandle.setAttribute("y",      y + height - this.options.z_handle_size);
                            this._zhandle.setAttribute("width",  this.options.z_handle_size);
                            this._zhandle.setAttribute("height", this.options.z_handle_size);
                            break;
                    }
                    break;
            }
        }
        
        
        // LABEL
        TK.empty(this._label);
        var t = this.options.label(
                    this.options.title,
                    this.options.x,
                    this.options.y,
                    this.options.z);
        var a = t.split("\n");
        var c = this._label.children;
        var n = c.length;
        if (a.length != c.length) {
            while (n < a.length) {
                this._label.appendChild(TK.make_svg("tspan", {dy:"1.0em"}));
                n++;
            }
            while (n > a.length) {
                // FIXME: bad call of destroy here?
                this._label.children[n-1].destroy();
                n--;
            }
        }
        var c = this._label.children;
        var w = 0;
        for (var i = 0; i < a.length; i++) {
            c[i].textContent = a[i];
        }
        for (var i = 0; i < a.length; i++) {
            w = Math.max(w, c[i].getComputedTextLength());
        }
        
        var inter = [];
        var pos = false;
        var align = "";
        var bbox = null;
        try { bbox = this._label.getBBox(); } catch(e) { /* Mozilla fuckup, lables are destroyed afterwards. Do a redraw on realization */ return; }
        try { bbox.width = w; } catch(e) { /* ie8: No Modification Allowed Error */ }
        
        switch (this.options.mode) {
            case _TOOLKIT_CIRCULAR:
                for (var i = 0; i < this.options.preferences.length; i++) {
                    switch (this.options.preferences[i]) {
                        case _TOOLKIT_TOP:
                            var x1 = x - bbox.width / 2;
                            var y1 = y - height / 2 - m - bbox.height;
                            var xl = x;
                            var yl = y1;
                            var align = "middle";
                            break;
                        case _TOOLKIT_RIGHT:
                            var x1 = x + width / 2 + m;
                            var y1 = y - bbox.height / 2;
                            var xl = x1;
                            var yl = y1;
                            var align = "start";
                            break;
                        case _TOOLKIT_BOTTOM:
                            var x1 = x - bbox.height / 2;
                            var y1 = y + height / 2 + m;
                            var xl = x;
                            var yl = y1;
                            var align = "middle";
                            break;
                        case _TOOLKIT_LEFT:
                            var x1 = x - width / 2 - m - bbox.width;
                            var y1 = y - bbox.height / 2;
                            var xl = x1 + bbox.width;
                            var yl = y1;
                            var align = "end";
                            break;
                    }
                    var x2 = x1 + bbox.width;
                    var y2 = y1 + bbox.height;
                    inter[i] = this.options.intersect(x1, y1, x2, y2,
                                                      this.options.id);
                    inter[i].x1 = x1;
                    inter[i].y1 = y1;
                    inter[i].x2 = x2;
                    inter[i].y2 = y2;
                    inter[i].xl = xl - x;
                    inter[i].yl = yl - y;
                    inter[i].align = align;
                    if (!inter[i].intersect) {
                        pos = inter[i];
                        break;
                    }
                }
                break;
            case _TOOLKIT_LINE_VERTICAL:
                for (var i = 0; i < this.options.preferences.length; i++) {
                    switch (this.options.preferences[i]) {
                        case _TOOLKIT_TOP_LEFT:
                            var x1 = x - m - bbox.width;
                            var y1 = y + m;
                            var xl = x - m;
                            var yl = y1;
                            var align = "end";
                            break;
                        case _TOOLKIT_TOP_RIGHT:
                            var x1 = x + width + m;
                            var y1 = y + m;
                            var xl = x1;
                            var yl = y1;
                            var align = "start";
                            break;
                        case _TOOLKIT_BOTTOM_LEFT:
                            var x1 = x - m - bbox.width;
                            var y1 = y + height - bbox.height - m;
                            var xl = x - m;
                            var yl = y1;
                            var align = "end";
                            break;
                        case _TOOLKIT_BOTTOM_RIGHT:
                            var x1 = x + width + m;
                            var y1 = y + height - bbox.height - m;
                            var xl = x1;
                            var yl = y1;
                            var align = "start";
                            break;
                        case _TOOLKIT_LEFT:
                            var x1 = x - m - bbox.width;
                            var y1 = y + height / 2 - bbox.height / 2;
                            var xl = x1 + bbox.width;
                            var yl = y1;
                            var align = "end";
                            break;
                        case _TOOLKIT_RIGHT:
                            var x1 = x + width + m;
                            var y1 = y + height / 2 - bbox.height / 2;
                            var xl = x1;
                            var yl = y1;
                            var align = "start";
                            break;
                    }
                    var x2 = x1 + bbox.width;
                    var y2 = y1 + bbox.height;
                    inter[i] = this.options.intersect(x1, y1, x2, y2,
                                                      this.options.id);
                    inter[i].x1 = x1;
                    inter[i].y1 = y1;
                    inter[i].x2 = x2;
                    inter[i].y2 = y2;
                    inter[i].xl = xl;
                    inter[i].yl = yl;
                    inter[i].align = align;
                    if (!inter[i].intersect) {
                        pos = inter[i];
                        break;
                    }
                }
                break;
            case _TOOLKIT_LINE_HORIZONTAL:
                for (var i = 0; i < this.options.preferences.length; i++) {
                    switch (this.options.preferences[i]) {
                        case _TOOLKIT_TOP_LEFT:
                            var x1 = x + m;
                            var y1 = y - m - bbox.height;
                            var xl = x1;
                            var yl = y1;
                            var align = "start";
                            break;
                        case _TOOLKIT_TOP_RIGHT:
                            var x1 = x + width - bbox.width - m;
                            var y1 = y - m - bbox.height;
                            var xl = x + width - m;
                            var yl = y1;
                            var align = "end";
                            break;
                        case _TOOLKIT_BOTTOM_LEFT:
                            var x1 = x + m;
                            var y1 = y + height + m;
                            var xl = x1;
                            var yl = y1;
                            var align = "start";
                            break;
                        case _TOOLKIT_BOTTOM_RIGHT:
                            var x1 = x + width - bbox.width - m;
                            var y1 = y - m - bbox.height;
                            var xl = x + width - m;
                            var yl = y1;
                            var align = "start";
                            break;
                        case _TOOLKIT_TOP:
                            var x1 = x + width / 2 - bbox.width / 2;
                            var y1 = y - m - bbox.height;
                            var xl = x + width / 2;
                            var yl = y1;
                            var align = "middle";
                            break;
                        case _TOOLKIT_BOTTOM:
                            var x1 = x + width / 2 - bbox.width / 2;
                            var y1 = y + height + m;
                            var xl = x + width / 2;
                            var yl = y1;
                            var align = "middle";
                            break;
                    }
                    var x2 = x1 + bbox.width;
                    var y2 = y1 + bbox.height;
                    inter[i] = this.options.intersect(x1, y1, x2, y2,
                                                      this.options.id);
                    inter[i].x1 = x1;
                    inter[i].y1 = y1;
                    inter[i].x2 = x2;
                    inter[i].y2 = y2;
                    inter[i].xl = xl;
                    inter[i].yl = yl;
                    inter[i].align = align;
                    if (!inter[i].intersect) {
                        pos = inter[i];
                        break;
                    }
                }
                break;
            case _TOOLKIT_BLOCK_LEFT:
                for (var i = 0; i < this.options.preferences.length; i++) {
                    switch (this.options.preferences[i]) {
                        case _TOOLKIT_TOP_LEFT:
                            var x1 = m;
                            var y1 = y + m;
                            var xl = x1;
                            var yl = y1;
                            var align = "start";
                            break;
                        case _TOOLKIT_TOP:
                            var x1 = rnd.x - m - bbox.width;
                            var y1 = y + m;
                            var xl = rnd.x - m;
                            var yl = y1;
                            var align = "end";
                            break;
                        case _TOOLKIT_TOP_RIGHT:
                            var x1 = width + m;
                            var y1 = y + m;
                            var xl = x1;
                            var yl = y1;
                            var align = "start";
                            break;
                        case _TOOLKIT_LEFT:
                            var x1 = m;
                            var y1 = y + height / 2 - bbox.height / 2;
                            var xl = x1;
                            var yl = y1;
                            var align = "start";
                            break;
                        case _TOOLKIT_CENTER:
                            var x1 = rnd.x - m - bbox.width;
                            var y1 = y + height / 2 - bbox.height / 2;
                            var xl = rnd.x - m;
                            var yl = y1;
                            var align = "end";
                            break;
                        case _TOOLKIT_RIGHT:
                            var x1 = width + m;
                            var y1 = y + height / 2 - bbox.height / 2;
                            var xl = x1;
                            var yl = y1;
                            var align = "start";
                            break;
                        case _TOOLKIT_BOTTOM_LEFT:
                            var x1 = m;
                            var y1 = y + height - m - bbox.height;
                            var xl = x1;
                            var yl = y1;
                            var align = "start";
                            break;
                        case _TOOLKIT_BOTTOM:
                            var x1 = rnd.x - m - bbox.width;
                            var y1 = y + height - m - bbox.height;
                            var xl = rnd.x - m;
                            var yl = y1;
                            var align = "end";
                            break;
                        case _TOOLKIT_BOTTOM_RIGHT:
                            var x1 = width + m;
                            var y1 = y + height - m - bbox.height;
                            var xl = x1;
                            var yl = y1;
                            var align = "start";
                            break;
                    }
                    var x2 = x1 + bbox.width;
                    var y2 = y1 + bbox.height;
                    inter[i] = this.options.intersect(x1, y1, x2, y2,
                                                      this.options.id);
                    inter[i].x1 = x1;
                    inter[i].y1 = y1;
                    inter[i].x2 = x2;
                    inter[i].y2 = y2;
                    inter[i].xl = xl;
                    inter[i].yl = yl;
                    inter[i].align = align;
                    if (!inter[i].intersect) {
                        pos = inter[i];
                        break;
                    }
                }
                break;
            case _TOOLKIT_BLOCK_RIGHT:
                for (var i = 0; i < this.options.preferences.length; i++) {
                    switch (this.options.preferences[i]) {
                        case _TOOLKIT_TOP_LEFT:
                            var x1 = x - m - bbox.width;
                            var y1 = y + m;
                            var xl = x - m;
                            var yl = y1;
                            var align = "end";
                            break;
                        case _TOOLKIT_TOP:
                            var x1 = x + m;
                            var y1 = y + m;
                            var xl = x1;
                            var yl = y1;
                            var align = "start";
                            break;
                        case _TOOLKIT_TOP_RIGHT:
                            var x1 = width + x - m - bbox.width;
                            var y1 = y + m;
                            var xl = width + x - m;
                            var yl = y1;
                            var align = "end";
                            break;
                        case _TOOLKIT_LEFT:
                            var x1 = x - m - bbox.width;
                            var y1 = y + height / 2 - bbox.height / 2;
                            var xl = x - m;
                            var yl = y1;
                            var align = "end";
                            break;
                        case _TOOLKIT_CENTER:
                            var x1 = x + m;
                            var y1 = y + height / 2 - bbox.height / 2;
                            var xl = x1;
                            var yl = y1;
                            var align = "start";
                            break;
                        case _TOOLKIT_RIGHT:
                            var x1 = width + x - m - bbox.width;
                            var y1 = y + height / 2 - bbox.height / 2;
                            var xl = width + x + m;
                            var yl = y1;
                            var align = "end";
                            break;
                        case _TOOLKIT_BOTTOM_LEFT:
                            var x1 = x - m - bbox.width;
                            var y1 = y + height - m - bbox.height;
                            var xl = x - m;
                            var yl = y1;
                            var align = "end";
                            break;
                        case _TOOLKIT_BOTTOM:
                            var x1 = x + m;
                            var y1 = y + height - m - bbox.height;
                            var xl = x1;
                            var yl = y1;
                            var align = "start";
                            break;
                        case _TOOLKIT_BOTTOM_RIGHT:
                            var x1 = width + x - m - bbox.width;
                            var y1 = y + height - m - bbox.height;
                            var xl = width + x + m;
                            var yl = y1;
                            var align = "end";
                            break;
                    }
                    var x2 = x1 + bbox.width;
                    var y2 = y1 + bbox.height;
                    inter[i] = this.options.intersect(x1, y1, x2, y2,
                                                      this.options.id);
                    inter[i].x1 = x1;
                    inter[i].y1 = y1;
                    inter[i].x2 = x2;
                    inter[i].y2 = y2;
                    inter[i].xl = xl;
                    inter[i].yl = yl;
                    inter[i].align = align;
                    if (!inter[i].intersect) {
                        pos = inter[i];
                        break;
                    }
                }
                break;
            case _TOOLKIT_BLOCK_TOP:
            case _TOOLKIT_BLOCK_BOTTOM:
                for (var i = 0; i < this.options.preferences.length; i++) {
                    switch (this.options.preferences[i]) {
                        case _TOOLKIT_TOP_LEFT:
                            var x1 = x + m;
                            var y1 = y + m;
                            var xl = x1;
                            var yl = y1;
                            var align = "start";
                            break;
                        case _TOOLKIT_TOP:
                            var x1 = x + width / 2 - bbox.width / 2;
                            var y1 = y + m;
                            var xl = x + width / 2;
                            var yl = y1;
                            var align = "middle";
                            break;
                        case _TOOLKIT_TOP_RIGHT:
                            var x1 = x + width - m - bbox.width;
                            var y1 = y + m;
                            var xl = x + width - m;
                            var yl = y1;
                            var align = "end";
                            break;
                        case _TOOLKIT_LEFT:
                            var x1 = x + m;
                            var y1 = y + height / 2 - bbox.height / 2;
                            var xl = x1;
                            var yl = y1;
                            var align = "start";
                            break;
                        case _TOOLKIT_CENTER:
                            var x1 = x + width / 2 - bbox.width / 2;
                            var y1 = y + height / 2 - bbox.height / 2;
                            var xl = x + width / 2;
                            var yl = y1;
                            var align = "middle";
                            break;
                        case _TOOLKIT_RIGHT:
                            var x1 = x + width - m - bbox.width;
                            var y1 = y + height / 2 - bbox.height / 2;
                            var xl = x + width - m;
                            var yl = y1;
                            var align = "end";
                            break;
                        case _TOOLKIT_BOTTOM_LEFT:
                            var x1 = x + m;
                            var y1 = y + height - m - bbox.height;
                            var xl = x1;
                            var yl = y1;
                            var align = "start";
                            break;
                        case _TOOLKIT_BOTTOM:
                            var x1 = x + width / 2 - bbox.width / 2;
                            var y1 = y + height - m - bbox.height;
                            var xl = x + width / 2;
                            var yl = y1;
                            var align = "middle";
                            break;
                        case _TOOLKIT_BOTTOM_RIGHT:
                            var x1 = x + width - m - bbox.width;
                            var y1 = y + height - m - bbox.height;
                            var xl = x + width - m;
                            var yl = y1;
                            var align = "end";
                            break;
                    }
                    var x2 = x1 + bbox.width;
                    var y2 = y1 + bbox.height;
                    inter[i] = this.options.intersect(x1, y1, x2, y2,
                                                      this.options.id);
                    inter[i].x1 = x1;
                    inter[i].y1 = y1;
                    inter[i].x2 = x2;
                    inter[i].y2 = y2;
                    inter[i].xl = xl;
                    inter[i].yl = yl;
                    inter[i].align = align;
                    if (!inter[i].intersect) {
                        pos = inter[i];
                        break;
                    }
                }
                break;
        }
        if (pos === false) pos = inter.sort(function (a, b) {
            return a.intersect - b.intersect
        })[0];
        this._label.setAttribute("x", (pos.xl) + "px");
        this._label.setAttribute("y", (pos.yl) + "px");
        this._label.setAttribute("text-anchor", pos.align);
        var c = this._label.children;
        for (var i = 0; i < c.length; i++)
            c[i].setAttribute("x", (pos.xl) + "px");
        this.label = {x1: pos.x1, y1: pos.y1, x2: pos.x2, y2: pos.y2};
                
        
        // LINES
        switch (this.options.mode) {
            case _TOOLKIT_CIRCULAR:
                if (this.options.show_axis) {
                    var _x = Math.max(width / 2 + this.options.margin,
                                      this.label.x2 - rnd.x + this.options.margin);
                    var _y = Math.max(height / 2 + this.options.margin,
                                      this.label.y2 - this.y + this.options.margin);
                    this._line1.setAttribute("d", "M "  + _x + " 0" + this._add + " L"
                                               + (this.range_x.get("basis") - (x - _x))
                                               + " 0" + this._add);
                    this._line2.setAttribute("d", "M 0" + this._add + " " + _y + " L 0"
                                               + this._add + " "
                                               + (this.range_y.get("basis") - (y - _y)));
                }
                break;
            case _TOOLKIT_LINE_VERTICAL:
            case _TOOLKIT_BLOCK_LEFT:
            case _TOOLKIT_BLOCK_RIGHT:
                this._line1.setAttribute("d", "M " + (rnd.x + this._add) + " " + y
                                          + " L " + (rnd.x + this._add) + " "
                                          + (y + height));
                if (this.options.show_axis) {
                    this._line2.setAttribute("d", "M 0 " + (rnd.y + this._add) + " L "
                                                + this.range_x.get("basis") + " "
                                                + (rnd.y + this._add));
                } else {
                    this._line2.setAttribute("d", "M 0 0");
                }
                break;
            case _TOOLKIT_LINE_HORIZONTAL:
            case _TOOLKIT_BLOCK_TOP:
            case _TOOLKIT_BLOCK_BOTTOM:
                this._line1.setAttribute("d", "M "   + x + " " + (rnd.y + this._add)
                                            + " L " + (x + width) + " "
                                            + (rnd.y + this._add));
                if (this.options.show_axis) {
                    this._line2.setAttribute("d", "M " + (rnd.x + this._add) + " 0 L "
                                              + (rnd.x + this._add) + " "
                                              + this.range_y.get("basis"));
                } else {
                    this._line2.setAttribute("d", "M 0 0");
                }
                break;
        }
        Widget.prototype.redraw.call(this);
    },
    destroy: function () {
        TK.destroy(this._line1);
        TK.destroy(this._line2);
        TK.destroy(this._label);
        TK.destroy(this._handle);
        TK.destroy(this.element);
        Widget.prototype.destroy.call(this);
    },
    // HELPERS & STUFF
    
    // CALLBACKS / EVENT HANDLING
    _mouseenter: function (e) {
        e.preventDefault();
        this._zwheel = false;
        TK.add_class(this.element, "toolkit-hover");
        return false;
    },
    _mouseleave: function (e) {
        e.preventDefault();
        this._raised = false;
        TK.remove_class(this.element, "toolkit-hover");
        return false;
    },
    _mouseelement: function (e) {
        e.preventDefault();
        // NOTE: the second check is most likely cheaper
        if (this.options.container && !this._raised) {
            this.options.container.appendChild(this.element);
            this._raised = true;
        }
        return false;
        //e.stopPropagation();
    },
    _mousedown: function (e) {
        e.preventDefault();
        this._zwheel = false;
        if (this.options.min_drag)
            this._sticky = true;
        if (!this.options.active) return false;
        
        // order
        if (this.options.container) {
            if (e.rightClick) {
                this.element.inject(this.options.container, "top");
                return false;
            } else {
                this.options.container.appendChild(this.element);
            }
        }
        
        // touch
        if (e.touches && e.touches.length) {
            var ev = e.touches[e.touches.length - 1];
        } else {
            ev = e;
        }
        
        // classes and stuff
        TK.add_class(this.element, "toolkit-active");
        TK.add_class(this.element.parentElement.parentElement, "toolkit-dragging");
        this.global_cursor("move");
        this.__active = true;
        this._offsetX = ev.pageX - this.x;
        this._offsetY = ev.pageY - this.y;
        this._clickX  = this.x;
        this._clickY  = this.y;
        this._clickZ  = this.z;
        this._pageX   = ev.pageX;
        this._pageY   = ev.pageY;
        this.redraw();
        if (!this._zhandling) {
            this.fire_event("handlegrabbed", {
                x:     this.options.x,
                y:     this.options.y,
                pos_x: this.x,
                pos_y: this.y
            });
        } else {
            this.fire_event("zchangestarted", this.options.z);
        }
        //document.addEventListener("mouseup", this._mouseup.bind(this));
        return false;
    },
    _mouseup: function (e) {
        if (!this.__active) return;
        e.preventDefault();
        TK.remove_class(this.element, "toolkit-active");
        var parent = this.element.parentElement.parentElement;
        if (parent)
            TK.remove_class(parent, "toolkit-dragging");
        this.remove_cursor("move");
        if (!this._zhandling) {
            this.fire_event("handlereleased", {
                x:     this.options.x,
                y:     this.options.y,
                pos_x: this.x,
                pos_y: this.y
            });
        } else {
            this.fire_event("zchangeended", this.options.z);
            this._zhandling = false;
        }
        this.__active = false;
        return false;
    },
    _mousemove: function (e) {
        if (!this.__active) return;
        e.preventDefault();
        
        if (e.touches && e.touches.length) {
            var ev = e.touches[e.touches.length - 1];
        } else {
            var ev = e;
        }
        var mx = this.range_x.options.step || 1;
        var my = this.range_y.options.step || 1;
        var mz = this.range_z.options.step || 1;
        if (e.ctrlKey && e.shiftKey) {
            mx *= this.range_x.get("shift_down");
            my *= this.range_y.get("shift_down");
            mz *= this.range_z.get("shift_down");
        } else if (e.shiftKey) {
            mx *= this.range_x.get("shift_up");
            my *= this.range_y.get("shift_up");
            mz *= this.range_z.get("shift_up");
        }
        if (this._zhandling) {
            if (this.options.z_handle == _TOOLKIT_LEFT
                || this.options.mode == _TOOLKIT_LINE_VERTICAL
                && this.options.z_handle == _TOOLKIT_TOP_LEFT
                || this.options.mode == _TOOLKIT_LINE_VERTICAL
                && this.options.z_handle == _TOOLKIT_BOTTOM_LEFT
                || this.options.mode == _TOOLKIT_BLOCK_LEFT
                && this.options.z_handle == _TOOLKIT_TOP_LEFT
                || this.options.mode == _TOOLKIT_BLOCK_LEFT
                && this.options.z_handle == _TOOLKIT_BOTTOM_LEFT
                || this.options.mode == _TOOLKIT_BLOCK_RIGHT
                && this.options.z_handle == _TOOLKIT_TOP_LEFT
                || this.options.mode == _TOOLKIT_BLOCK_RIGHT
                && this.options.z_handle == _TOOLKIT_BOTTOM_LEFT) {
                // movement to left
                this.set("z",
                    this.range_z.px2val(this.z - ((ev.pageX - this._pageX) * mz)));
                this.fire_event("zchanged", this.options.z);
                this._pageX = ev.pageX;
                this._pageY = ev.pageY;
            } else if (this.options.z_handle == _TOOLKIT_RIGHT
                || this.options.mode == _TOOLKIT_LINE_VERTICAL
                && this.options.z_handle == _TOOLKIT_TOP_RIGHT
                || this.options.mode == _TOOLKIT_LINE_VERTICAL
                && this.options.z_handle == _TOOLKIT_BOTTOM_RIGHT
                || this.options.mode == _TOOLKIT_BLOCK_LEFT
                && this.options.z_handle == _TOOLKIT_TOP_RIGHT
                || this.options.mode == _TOOLKIT_BLOCK_LEFT
                && this.options.z_handle == _TOOLKIT_BOTTOM_RIGHT
                || this.options.mode == _TOOLKIT_BLOCK_RIGHT
                && this.options.z_handle == _TOOLKIT_TOP_RIGHT
                || this.options.mode == _TOOLKIT_BLOCK_RIGHT
                && this.options.z_handle == _TOOLKIT_BOTTOM_RIGHT) {
                // movement to right
                this.set("z",
                    this.range_z.px2val(this.z + ((ev.pageX - this._pageX) * mz)));
                this.fire_event("zchanged", this.options.z);
                this._pageX = ev.pageX;
                this._pageY = ev.pageY;
            } else if (this.options.z_handle == _TOOLKIT_TOP
                || this.options.mode == _TOOLKIT_LINE_HORIZONTAL
                && this.options.z_handle == _TOOLKIT_TOP_LEFT
                || this.options.mode == _TOOLKIT_LINE_HORIZONTAL
                && this.options.z_handle == _TOOLKIT_TOP_RIGHT
                || this.options.mode == _TOOLKIT_BLOCK_TOP
                && this.options.z_handle == _TOOLKIT_TOP_LEFT
                || this.options.mode == _TOOLKIT_BLOCK_TOP
                && this.options.z_handle == _TOOLKIT_TOP_RIGHT
                || this.options.mode == _TOOLKIT_BLOCK_BOTTOM
                && this.options.z_handle == _TOOLKIT_TOP_LEFT
                || this.options.mode == _TOOLKIT_BLOCK_BOTTOM
                && this.options.z_handle == _TOOLKIT_TOP_RIGHT) {
                // movement to top
                this.set("z",
                    this.range_z.px2val(this.z - ((ev.pageY - this._pageY) * mz)));
                this.fire_event("zchanged", this.options.z);
                this._pageX = ev.pageX;
                this._pageY = ev.pageY;
            } else if (this.options.z_handle == _TOOLKIT_BOTTOM
                || this.options.mode == _TOOLKIT_LINE_HORIZONTAL
                && this.options.z_handle == _TOOLKIT_BOTTOM_LEFT
                || this.options.mode == _TOOLKIT_LINE_HORIZONTAL
                && this.options.z_handle == _TOOLKIT_BOTTOM_RIGHT
                || this.options.mode == _TOOLKIT_BLOCK_TOP
                && this.options.z_handle == _TOOLKIT_BOTTOM_LEFT
                || this.options.mode == _TOOLKIT_BLOCK_TOP
                && this.options.z_handle == _TOOLKIT_BOTTOM_RIGHT
                || this.options.mode == _TOOLKIT_BLOCK_BOTTOM
                && this.options.z_handle == _TOOLKIT_BOTTOM_LEFT
                || this.options.mode == _TOOLKIT_BLOCK_BOTTOM
                && this.options.z_handle == _TOOLKIT_BOTTOM_RIGHT) {
                // movement to bottom
                this.set("z",
                    this.range_z.px2val(this.z + ((ev.pageY - this._pageY) * mz)));
                this.fire_event("zchanged", this.options.z);
                this._pageX = ev.pageX;
                this._pageY = ev.pageY;
            }
        } else if (this._sticky) {
            var dx = Math.abs((ev.pageX - this._offsetX) - this._clickX);
            var dy = Math.abs((ev.pageY - this._offsetY) - this._clickY);
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > this.options.min_drag)
                this._sticky = false;
        } else {
            this.set("x", this.range_x.px2val(this._clickX
                + ((ev.pageX - this._offsetX) - this._clickX) * mx));
            this.set("y", this.range_y.px2val(this._clickY
                + ((ev.pageY - this._offsetY) - this._clickY) * my));
            this.fire_event("useraction", "x", this.get("x"));
            this.fire_event("useraction", "y", this.get("y"));
        }
        this.fire_event("handledragging", {
            x:     this.options.x,
            y:     this.options.y,
            pos_x: this.x,
            pos_y: this.y
        });
        return false;
    },
    _scrollwheel: function (e) {
        e.preventDefault();
        var d = typeof e.wheelDelta !== "undefined" && e.wheelDelta ? e.wheelDelta : e.detail;
        e.wheel = d / Math.abs(d);
        if (this.__sto) window.clearTimeout(this.__sto);
        TK.add_class(this.element, "toolkit-active");
        this.__sto = window.setTimeout(function () {
            TK.remove_class(this.element, "toolkit-active");
            this.fire_event("zchangeended", this.options.z);
        }.bind(this), 250);
        var s = this.range_z.get("step") * e.wheel;
        if (e.ctrlKey && e.shiftKey)
            s *= this.range_z.get("shift_down");
        else if (e.shiftKey)
            s *= this.range_z.get("shift_up");
        this.set("z", this.get("z") + s);
        if (!this._zwheel)
            this.fire_event("zchangestarted", this.options.z);
        this.fire_event("zchanged", this.options.z);
        this.fire_event("useraction", "z", this.options.z);
        this._zwheel = true;
    },
    _touchstart: function (e) {
        if (e.touches && e.touches.length == 2) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        } else {
            this._mousedown(e);
        }
    },
    _touchend: function (e) {
        this._tdist = false;
        if (e.touches && e.touches.length >= 1) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        } else {
            this._mouseup(e);
        }
    },
    _touchmove: function (e) {
        if (!this.__active) return;
        if (e.touches && e.touches.length > 1 && this._tdist === false) {
            var x = e.touches[1].pageX - (this.x + this._offsetX);
            var y = e.touches[1].pageY - (this.y + this._offsetY);
            this._tdist = Math.sqrt(y*y + x*x);
            this.__z = this.options.z;
        }
        if (e.touches && e.touches.length >= 2) {
            var x = e.touches[1].pageX - (this.x + this._offsetX);
            var y = e.touches[1].pageY - (this.y + this._offsetY);
            var tdist = Math.sqrt(y * y + x * x);
            var z = Math.min(this.__z * (tdist / this._tdist));
            if (z >= this.range_z.get("max") || z <= this.range_z.get("min")) {
                var x = e.touches[1].pageX - (this.x + this._offsetX);
                var y = e.touches[1].pageY - (this.y + this._offsetY);
                this._tdist = Math.sqrt(y * y + x * x);
                this.__z = this.options.z;
                this.warning(this.element);
            }
            this.set("z", Math.max(
                Math.min(z, this.range_z.get("max")),
                this.range_z.get("min")));
            this.fire_event("zchanged", this.options.z);
            e.preventDefault();
            e.stopPropagation();
            return false;
        } else {
            this._mousemove(e);
            e.preventDefault();
        }
    },
    _zhandledown: function (e) {
        this._zhandling = true;
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            default:
                if (!hold) this.redraw();
                break;
            case "active":
                if (value) {
                    TK.remove_class(this.element, "toolkit-inactive");
                    this.redraw();
                }
                else TK.add_class(this.element, "toolkit-inactive");
                break;
            case "x":
            case "y":
            case "z":
                this.fire_event("set_" + key, value, hold)
                if (!hold) this.redraw();
                key = false;
                break;
        }
        Widget.prototype.set.call(this, key, value, hold);
    }
});
})(this);
