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
function mouseenter(e) {
    e.preventDefault();
    this._zwheel = false;
    TK.add_class(this.element, "toolkit-hover");
    return false;
}
function mouseleave(e) {
    e.preventDefault();
    this._raised = false;
    TK.remove_class(this.element, "toolkit-hover");
    return false;
}
function mouseelement(e) {
    var C = this.options.container;
    e.preventDefault();
    // NOTE: the second check is most likely cheaper
    if (C && !this._raised) {
        C.appendChild(this.element);
        this._raised = true;
    }
    return false;
    //e.stopPropagation();
}
function mousedown(e) {
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
    TK.add_class(this.element.parentNode.parentNode, "toolkit-dragging");
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
}
function mouseup(e) {
    if (!this.__active) return;
    e.preventDefault();
    TK.remove_class(this.element, "toolkit-active");
    var parent = this.element.parentNode.parentNode;
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
}
function mousemove(e) {
    if (!this.__active) return;
    var O = this.options;
    e.preventDefault();
    
    var ev;
    var range_x = this.range_x;
    var range_y = this.range_y;
    var range_z = this.range_z;

    if (e.touches && e.touches.length) {
        ev = e.touches[e.touches.length - 1];
    } else {
        ev = e;
    }
    var mx = range_x.options.step || 1;
    var my = range_y.options.step || 1;
    var mz = range_z.options.step || 1;
    if (e.ctrlKey && e.shiftKey) {
        mx *= range_x.get("shift_down");
        my *= range_y.get("shift_down");
        mz *= range_z.get("shift_down");
    } else if (e.shiftKey) {
        mx *= range_x.get("shift_up");
        my *= range_y.get("shift_up");
        mz *= range_z.get("shift_up");
    }
    if (this._zhandling) {
        if (O.z_handle == "left"
            || O.mode == "line-vertical" && O.z_handle == "top-left"
            || O.mode == "line-vertical" && O.z_handle == "bottom-left"
            || O.mode == "block-left" && O.z_handle == "top-left"
            || O.mode == "block-left" && O.z_handle == "bottom-left"
            || O.mode == "block-right" && O.z_handle == "top-left"
            || O.mode == "block-right" && O.z_handle == "bottom-left") {
            // movement to left
            this.set("z",
                range_z.snap(range_z.px2val(this.z - ((ev.pageX - this._pageX) * mz))));
            this.fire_event("zchanged", O.z);
            this._pageX = ev.pageX;
            this._pageY = ev.pageY;
        } else if (O.z_handle == "right"
            || O.mode == "line-vertical" && O.z_handle == "top-right"
            || O.mode == "line-vertical" && O.z_handle == "bottom-right"
            || O.mode == "block-left" && O.z_handle == "top-right"
            || O.mode == "block-left" && O.z_handle == "bottom-right"
            || O.mode == "block-right" && O.z_handle == "top-right"
            || O.mode == "block-right" && O.z_handle == "bottom-right") {
            // movement to right
            this.set("z",
                range_z.snap(range_z.px2val(this.z + ((ev.pageX - this._pageX) * mz))));
            this.fire_event("zchanged", O.z);
            this._pageX = ev.pageX;
            this._pageY = ev.pageY;
        } else if (O.z_handle == "top"
            || O.mode == "line-horizontal" && O.z_handle == "top-left"
            || O.mode == "line-horizontal" && O.z_handle == "top-right"
            || O.mode == "block-top" && O.z_handle == "top-left"
            || O.mode == "block-top" && O.z_handle == "top-right"
            || O.mode == "block-bottom" && O.z_handle == "top-left"
            || O.mode == "block-bottom" && O.z_handle == "top-right") {
            // movement to top
            this.set("z",
                this.snap(range_z.px2val(this.z - ((ev.pageY - this._pageY) * mz))));
            this.fire_event("zchanged", O.z);
            this._pageX = ev.pageX;
            this._pageY = ev.pageY;
        } else if (O.z_handle == "bottom"
            || O.mode == "line-horizontal" && O.z_handle == "bottom-left"
            || O.mode == "line-horizontal" && O.z_handle == "bottom-right"
            || O.mode == "block-top" && O.z_handle == "bottom-left"
            || O.mode == "block-top" && O.z_handle == "bottom-right"
            || O.mode == "block-bottom" && O.z_handle == "bottom-left"
            || O.mode == "block-bottom" && O.z_handle == "bottom-right") {
            // movement to bottom
            this.set("z",
                range_z.snap(range_z.px2val(this.z + ((ev.pageY - this._pageY) * mz))));
            this.fire_event("zchanged", O.z);
            this._pageX = ev.pageX;
            this._pageY = ev.pageY;
        }
    } else if (this._sticky) {
        var dx = Math.abs((ev.pageX - this._offsetX) - this._clickX);
        var dy = Math.abs((ev.pageY - this._offsetY) - this._clickY);
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > O.min_drag)
            this._sticky = false;
    } else {
        this.set("x", range_x.snap(range_x.px2val(this._clickX + ((ev.pageX - this._offsetX) - this._clickX) * mx)));
        this.set("y", range_y.snap(range_y.px2val(this._clickY + ((ev.pageY - this._offsetY) - this._clickY) * my)));
        this.fire_event("useraction", "x", this.get("x"));
        this.fire_event("useraction", "y", this.get("y"));
    }
    this.fire_event("handledragging", {
        x:     O.x,
        y:     O.y,
        pos_x: this.x,
        pos_y: this.y
    });
    return false;
}
function scrollwheel(e) {
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
}
function touchstart(e) {
    if (e.touches && e.touches.length == 2) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    } else {
        this._mousedown(e);
    }
}
function touchend(e) {
    this._tdist = false;
    if (e.touches && e.touches.length >= 1) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    } else {
        this._mouseup(e);
    }
}
function touchmove(e) {
    var O = this.options;
    if (!this.__active) return;
    if (e.touches && e.touches.length > 1 && this._tdist === false) {
        var x = e.touches[1].pageX - (this.x + this._offsetX);
        var y = e.touches[1].pageY - (this.y + this._offsetY);
        this._tdist = Math.sqrt(y*y + x*x);
        this.__z = O.z;
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
            this.__z = O.z;
            this.warning(this.element);
        }
        this.set("z", Math.max(
            Math.min(z, this.range_z.get("max")),
            this.range_z.get("min")));
        this.fire_event("zchanged", O.z);
        e.preventDefault();
        e.stopPropagation();
        return false;
    } else {
        this._mousemove(e);
        e.preventDefault();
    }
}
function zhandledown(e) {
    this._zhandling = true;
}

/**
 * @class TK.ResponseHandle
 * @extends TK.Widget
 *
 * @mixes TK.Ranges
 * @mixes TK.Warning
 * @mixes TK.GlobalCursor
 */
w.TK.ResponseHandle = w.ResponseHandle = $class({
    _class: "ResponseHandle",
    Extends: TK.Widget,
    Implements: [GlobalCursor, Ranges, Warning],
    _options: Object.assign(Object.create(TK.Widget.prototype._options), Ranges.prototype._options, {
        range_x: "function",
        range_y: "function", 
        range_z: "function",
        intersect: "function",
        mode: "int",
        preferences: "array",
        label: "function",
        x: "number",
        y: "number",
        z: "number",
        min_size: "number",
        margin: "number",
        z_handle: "boolean",
        z_handle_size: "number",
        z_handle_centered: "number",
        min_drag: "number",
        x_min: "number",
        x_max: "number",
        y_min: "number",
        y_max: "number",
        z_min: "number",
        z_max: "number",
        active: "boolean",
        show_axis: "boolean",
        title: "string",
    }),
    options: {
        range_x:          {},           // callback function returning a Range
                                        // module for x axis or an object with
                                        // options for a TK.Range 
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
        mode:             "circular", // mode of the handle:
                                        // "circular": circular handle
                                        // "line-vertical": x movement, line handle vertical
                                        // "line-horizontal": y movement, line handle horizontal
                                        // "block-left": x movement, block lefthand
                                        // "block-right": x movement, block righthand
                                        // "block-top": y movement, block on top
                                        // "block-right": y movement, block on bottom
        preferences:      ["left", "top", "right", "bottom"], // perferred position of the label
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
        TK.Widget.prototype.initialize.call(this, options);
        var O = this.options;
        
        this.add_range(O.range_x, "range_x");
        this.add_range(O.range_y, "range_y");
        this.add_range(O.range_z, "range_z");

        var set_cb = this.trigger_draw.bind(this);
        
        this.range_x.add_event("set", set_cb);
        this.range_y.add_event("set", set_cb);
        this.range_z.add_event("set", set_cb);

        var E;
        
        this.widgetize(this.element = E = TK.make_svg("g", {
            "id":    O.id
        }), true, true);
        
        TK.add_class(E, "toolkit-response-handle");
        switch (O.mode) {
            case "circular":
                TK.add_class(E, "toolkit-circular"); break;
            case "line-vertical":
                TK.add_class(E, "toolkit-line-vertical");
                TK.add_class(E, "toolkit-line");
                break;
            case "line-horizontal":
                TK.add_class(E, "toolkit-line-horizontal");
                TK.add_class(E, "toolkit-line");
                break;
            case "block-left":
                TK.add_class(E, "toolkit-block-left");
                TK.add_class(E, "toolkit-block");
                break;
            case "block-right":
                TK.add_class(E, "toolkit-block-right")
                TK.add_class(E, "toolkit-block");
                break;
            case "block-top":
                TK.add_class(E, "toolkit-block-top");
                TK.add_class(E, "toolkit-block");
                break;
            case "block-bottom":
                TK.add_class(E, "toolkit-block");
                TK.add_class(E, "toolkit-block-bottom");
                break;
            default:
                TK.warn("Unsupported mode:", O.mode);
        }
        
        if (O.container)
            O.container.appendChild(E);
        
        this._label = TK.make_svg("text", {
            "class": "toolkit-label"
        });
        E.appendChild(this._label);
        
        this._line1 = TK.make_svg("path", {
            "class": "toolkit-line toolkit-line-1"
        });
        E.appendChild(this._line1);
        this._line2 = TK.make_svg("path", {
            "class": "toolkit-line toolkit-line-2"
        });
        E.appendChild(this._line2);
        
        this._handle = TK.make_svg(
            O.mode == "circular" ? "circle" : "rect", {
                "class": "toolkit-handle",
                "r":     O.z_handle_size
            }
        );
        E.appendChild(this._handle);
        
        this._zhandle = TK.make_svg(
            O.mode == "circular" ? "circle" : "rect", {
                "class": "toolkit-z-handle",
                "width":  O.z_handle_size,
                "height": O.z_handle_size
            }
        );

        this._mouseenter = mouseenter.bind(this);
        this._mouseleave = mouseleave.bind(this);
        this._mouseelement = mouseelement.bind(this);
        this._mousedown = mousedown.bind(this); 
        this._mouseup = mouseup.bind(this);
        this._mousemove = mousemove.bind(this);
        this._scrollwheel = scrollwheel.bind(this);
        this._touchstart = touchstart.bind(this);
        this._touchend = touchend.bind(this);
        this._touchmove = touchmove.bind(this);
        this._zhandledown = zhandledown.bind(this);

        E.addEventListener("mouseenter",     this._mouseenter);
        E.addEventListener("mouseleave",     this._mouseleave);
        E.addEventListener("mousedown",      this._mousedown);
        E.addEventListener("touchstart",     this._touchstart);
        
        E = this._label;
        E.addEventListener("mouseenter",      this._mouseelement);
        E.addEventListener("touchstart",      this._mouseelement);
        E.addEventListener("mousewheel",      this._scrollwheel);
        E.addEventListener("DOMMouseScroll",  this._scrollwheel);
        E.addEventListener("contextmenu",     function () { return false; });
        
        E = this._handle;
        E.addEventListener("mouseenter",     this._mouseelement);
        E.addEventListener("touchstart",     this._mouseelement);
        E.addEventListener("mousewheel",     this._scrollwheel);
        E.addEventListener("DOMMouseScroll", this._scrollwheel);
        E.addEventListener("contextmenu",    function () { return false; });
        E.addEventListener("touchstart",     this._touchstart);
        
        E = this._zhandle;
        E.addEventListener("mousedown",     this._zhandledown);
        E.addEventListener("touchstart",    this._zhandledown);
        
        this._handle.onselectstart = function () { return false; };
        
        this.set("active", O.active, true);
    },
    
    redraw: function () {
        var O = this.options;
        var x      = 0;
        var y      = 0;
        var width  = 0;
        var height = 0;
        var m      = O.margin;

        var range_x = this.range_x;
        var range_y = this.range_y;
        var range_z = this.range_z;
        
        if ((this._zhandling || this._zwheel)
        && (O.z >= O.z_max && O.z_max !== false
        ||  O.z <= O.z_min && O.z_min !== false)) {
            this.warning(this.element);
        }
        
        // do we have to restrict movement?
        if (O.x_min !== false)
            O.x = Math.max(O.x_min, O.x);
        if (O.x_max !== false)
            O.x = Math.min(O.x_max, O.x);
        if (O.y_min !== false)
            O.y = Math.max(O.y_min, O.y);
        if (O.y_max !== false)
            O.y = Math.min(O.y_max, O.y);
        if (O.z_min !== false)
            O.z = Math.max(O.z_min, O.z);
        if (O.z_max !== false)
            O.z = Math.min(O.z_max, O.z);
        
        O.x = range_x.snap(O.x);
        O.y = range_y.snap(O.y);
        O.z = range_z.snap(O.z);
        
        this.x = range_x.val2px(O.x);
        this.y = range_y.val2px(O.y);
        this.z = range_z.val2px(O.z);
        
        var rnd = {
            x: Math.round(this.x),
            y: Math.round(this.y),
            z: Math.round(this.z)
        }

        var _handle = this._handle;
        
        // ELEMENT / HANDLE / MAIN COORDS
        switch (O.mode) {
            case "circular":
                // circle
                x      = rnd.x;
                y      = rnd.y;
                width  = Math.max(O.min_size, rnd.z);
                height = width;
                _handle.setAttribute("r", width / 2);
                this.element.setAttribute("transform",  "translate(" + x + "," + y + ")");
                this.handle = {
                    x1: x - width / 2,
                    y1: y - width / 2,
                    x2: x + width / 2,
                    y2: y + height / 2
                }
                break;
            case "line-vertical":
                // line vertical
                width  = Math.round(Math.max(O.min_size, rnd.z));
                x      = Math.round(
                            Math.min(
                                range_x.get("basis") - width / 2,
                                Math.max(width / -2, rnd.x - width / 2)));
                y      = Math.round(
                            Math.max(
                                0,
                                O.y_max === false ?
                                0 : range_y.val2px(range_y.snap(O.y_max))));
                height = Math.round(
                             Math.min(
                                 range_y.get("basis"),
                                 O.y_min === false
                                     ? range_y.get("basis")
                                     : range_y.val2px(range_y.snap(O.y_min))) - y);
                _handle.setAttribute("x", x);
                _handle.setAttribute("y", y);
                _handle.setAttribute("width", width);
                _handle.setAttribute("height", height);
                this.element.setAttribute("transform", "translate(0,0)");
                this.handle = {x1: x, y1: y, x2: x + width, y2: y + height};
                break;
            case "line-horizontal":
                // line horizontal
                height = Math.round(Math.max(O.min_size, rnd.z));
                y      = Math.round(
                            Math.min(
                                range_y.get("basis") - height / 2,
                                Math.max(height / -2, rnd.y - height / 2)));
                x      = Math.round(
                            Math.max(
                                0,
                                O.x_min === false
                                    ? 0 : range_x.val2px(range_x.snap(O.x_min))));
                width  = Math.round(
                             Math.min(
                                 range_x.get("basis"),
                                 O.x_max === false
                                     ? range_x.get("basis")
                                     : range_x.val2px(range_x.snap(O.x_max))) - x);
                _handle.setAttribute("x", x);
                _handle.setAttribute("y", y);
                _handle.setAttribute("width", width);
                _handle.setAttribute("height", height);
                this.element.setAttribute("transform", "translate(0,0)");
                this.handle = {x1: x, y1: y, x2: x + width, y2: y + height};
                break;
            case "block-left":
                // rect lefthand
                x      = 0;
                y      = Math.round(
                            Math.max(
                                0,
                                O.y_max === false
                                    ? 0 : range_y.val2px(range_y.snap(O.y_max))));
                width  = Math.round(
                            Math.max(
                                O.min_size / 2,
                                Math.min(rnd.x, range_x.get("basis"))));
                height = Math.round(
                            Math.min(
                                range_y.get("basis"),
                                O.y_min === false
                                    ? range_y.get("basis")
                                    : range_y.val2px(range_y.snap(O.y_min))) - y);
                _handle.setAttribute("x", x);
                _handle.setAttribute("y", y);
                _handle.setAttribute("width", width);
                _handle.setAttribute("height", height);
                this.element.setAttribute("transform", "translate(0,0)");
                this.handle = {x1: x, y1: y, x2: x + width, y2: y + height};
                break;
            case "block-right":
                // rect righthand
                x      = Math.max(
                            0,
                            Math.min(
                                rnd.x,
                                range_x.get("basis") - O.min_size / 2));
                y      = Math.round(
                            Math.max(
                                0,
                                O.y_max === false
                                    ? 0 : range_y.val2px(range_y.snap(O.y_max))));
                width  = Math.max(
                            O.min_size / 2,
                            range_x.get("basis") - x);
                height = Math.round(
                            Math.min(
                                range_y.get("basis"),
                                O.y_min === false
                                    ? range_y.get("basis")
                                    : range_y.val2px(range_y.snap(O.y_min))) - y);
                _handle.setAttribute("x", x);
                _handle.setAttribute("y", y);
                _handle.setAttribute("width", width);
                _handle.setAttribute("height", height);
                this.element.setAttribute("transform", "translate(0,0)");
                this.handle = {x1: x, y1: y, x2: x + width, y2: y + height};
                break;
            case "block-top":
                // rect top
                x      = Math.round(Math.max(
                            0,
                            O.x_min === false
                                ? 0 : range_x.val2px(range_x.snap(O.x_min))));
                y      = 0;
                width  = Math.round(
                            Math.min(
                                range_x.get("basis"),
                                O.x_max === false
                                    ? range_x.get("basis")
                                    : range_x.val2px(range_x.snap(O.x_max))) - x);
                height = Math.round(
                            Math.max(
                                O.min_size / 2,
                                Math.min(rnd.y, range_y.get("basis"))));
                _handle.setAttribute("x", x);
                _handle.setAttribute("y", y);
                _handle.setAttribute("width", width);
                _handle.setAttribute("height", height);
                this.element.setAttribute("transform", "translate(0,0)");
                this.handle = {x1: x, y1: y, x2: x + width, y2: y + height};
                break;
            case "block-bottom":
                // rect bottom
                x      = Math.round(Math.max(
                            0,
                            O.x_min === false
                                ? 0 : range_x.val2px(range_x.snap(O.x_min))));
                y      = Math.max(
                            0,
                            Math.min(
                                rnd.y,
                                range_y.get("basis") - O.min_size / 2));
                width  = Math.round(Math.min(
                            range_x.get("basis"),
                            O.x_max === false
                                ? range_x.get("basis")
                                : range_x.val2px(range_x.snap(O.x_max))) - x);
                height = Math.max(
                            O.min_size / 2,
                            range_y.get("basis") - y);
                _handle.setAttribute("x", x);
                _handle.setAttribute("y", y);
                _handle.setAttribute("width", width);
                _handle.setAttribute("height", height);
                this.element.setAttribute("transform", "translate(0,0)");
                this.handle = {x1: x, y1: y, x2: x + width, y2: y + height};
                break;
            default:
                TK.warn("Unsupported mode:", O.mode);
        }
        
        
        // Z-HANDLE
        if (O.z_handle === false) {
            if (this._zinjected) {
                this._zhandle.remove();
                this._zinjected = false;
            }
        } else {
            var zhandle = this._zhandle;
            if (!this._zinjected) {
                this.element.appendChild(this._zhandle);
                this._zinjected = true;
            }
            switch (O.mode) {
                // circular handles
                case "circular":
                    switch (O.z_handle) {
                        case "top-left":
                            zhandle.setAttribute("cx", width/-2 + O.z_handle_size / 2);
                            zhandle.setAttribute("cy", height/-2 + O.z_handle_size / 2);
                            zhandle.setAttribute("r",  O.z_handle_size / 2);
                            break;
                        case "top":
                            zhandle.setAttribute("cx", 0);
                            zhandle.setAttribute("cy", height/-2 + O.z_handle_size / 2);
                            zhandle.setAttribute("r",  O.z_handle_size / 2);
                            break;
                        case "top-right":
                            zhandle.setAttribute("cx", width/2 - O.z_handle_size / 2);
                            zhandle.setAttribute("cy", height/-2 + O.z_handle_size / 2);
                            zhandle.setAttribute("r",  O.z_handle_size / 2);
                            break;
                        case "left":
                            zhandle.setAttribute("cx", width/-2 + O.z_handle_size / 2);
                            zhandle.setAttribute("cy", 0);
                            zhandle.setAttribute("r", O.z_handle_size / 2);
                            break;
                        case "right":
                        default:
                            zhandle.setAttribute("cx", width/2 - O.z_handle_size / 2);
                            zhandle.setAttribute("cy", 0);
                            zhandle.setAttribute("r",  O.z_handle_size / 2);
                            break;
                        case "bottom-left":
                            zhandle.setAttribute("cx", width/-2 + O.z_handle_size / 2);
                            zhandle.setAttribute("cy", height/2 - O.z_handle_size / 2);
                            zhandle.setAttribute("r", O.z_handle_size / 2);
                            break;
                        case "bottom":
                            zhandle.setAttribute("cx", 0);
                            zhandle.setAttribute("cy", height/2 - O.z_handle_size / 2);
                            zhandle.setAttribute("r",  O.z_handle_size / 2);
                            break;
                        case "bottom-right":
                            zhandle.setAttribute("cx", width/2 - O.z_handle_size / 2);
                            zhandle.setAttribute("cy", height/2 - O.z_handle_size / 2);
                            zhandle.setAttribute("r",  O.z_handle_size / 2);
                            break;
                    }
                    break;
                default:
                    // all other handle types (lines/blocks)
                    switch (O.z_handle) {
                        case "top-left":
                        default:
                            zhandle.setAttribute("x",      x);
                            zhandle.setAttribute("y",      y);
                            zhandle.setAttribute("width",  O.z_handle_size);
                            zhandle.setAttribute("height", O.z_handle_size);
                            break;
                        case "top":
                            var _s = O.z_handle_centered < 1
                                   ? width * O.z_handle_centered
                                   : O.z_handle_centered;
                            _s = Math.max(_s, O.z_handle_size);
                            zhandle.setAttribute("x",      x + width / 2 - _s / 2);
                            zhandle.setAttribute("y",      y);
                            zhandle.setAttribute("width",  _s);
                            zhandle.setAttribute("height", O.z_handle_size);
                            break;
                        case "top-right":
                            zhandle.setAttribute("x",      x + width - O.z_handle_size);
                            zhandle.setAttribute("y",      y);
                            zhandle.setAttribute("width",  O.z_handle_size);
                            zhandle.setAttribute("height", O.z_handle_size);
                            break;
                        case "left":
                            var _s = O.z_handle_centered < 1
                                   ? height * O.z_handle_centered
                                   : O.z_handle_centered;
                            _s = Math.max(_s, O.z_handle_size);
                            zhandle.setAttribute("x",      x);
                            zhandle.setAttribute("y",      y + height / 2 - _s / 2);
                            zhandle.setAttribute("width",  O.z_handle_size);
                            zhandle.setAttribute("height", _s);
                            break;
                        case "right":
                            var _s = O.z_handle_centered < 1
                                   ? height * O.z_handle_centered
                                   : O.z_handle_centered;
                            _s = Math.max(_s, O.z_handle_size);
                            zhandle.setAttribute("x",      x + width - O.z_handle_size);
                            zhandle.setAttribute("y",      y + height / 2 - _s / 2);
                            zhandle.setAttribute("width",  O.z_handle_size);
                            zhandle.setAttribute("height", _s);
                            break;
                        case "bottom-left":
                            zhandle.setAttribute("x",      x);
                            zhandle.setAttribute("y",      y + height - O.z_handle_size);
                            zhandle.setAttribute("width",  O.z_handle_size);
                            zhandle.setAttribute("height", O.z_handle_size);
                            break;
                        case "bottom":
                            var _s = O.z_handle_centered < 1
                                   ? width * O.z_handle_centered
                                   : O.z_handle_centered;
                            _s = Math.max(_s, O.z_handle_size);
                            zhandle.setAttribute("x",      x + width / 2 - _s / 2);
                            zhandle.setAttribute("y",      y + height - O.z_handle_size);
                            zhandle.setAttribute("width",  _s);
                            zhandle.setAttribute("height", O.z_handle_size);
                            break;
                        case "bottom-right":
                            zhandle.setAttribute("x",      x + width - O.z_handle_size);
                            zhandle.setAttribute("y",      y + height - O.z_handle_size);
                            zhandle.setAttribute("width",  O.z_handle_size);
                            zhandle.setAttribute("height", O.z_handle_size);
                            break;
                    }
                    break;
            }
        }
        
        // LABEL
        TK.empty(this._label);
        var t = O.label(
                    O.title,
                    O.x,
                    O.y,
                    O.z);
        var a = t.split("\n");
        var c = this._label.childNodes;
        var n = c.length;
        if (a.length != c.length) {
            while (n < a.length) {
                this._label.appendChild(TK.make_svg("tspan", {dy:"1.0em"}));
                n++;
            }
            while (c.length > a.length) {
                // FIXME: bad call of destroy here?
                this._label.removeChild(this._label.lastChild);
            }
        }
        var c = this._label.childNodes;
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
        
        var x1, y1, xl, yl, align, x2, y2, i;
        var pref = O.preferences;

        switch (O.mode) {
            case "circular":
                for (i = 0; i < pref.length; i++) {
                    switch (pref[i]) {
                        case "top":
                            x1 = x - bbox.width / 2;
                            y1 = y - height / 2 - m - bbox.height;
                            xl = x;
                            yl = y1;
                            align = "middle";
                            break;
                        case "right":
                            x1 = x + width / 2 + m;
                            y1 = y - bbox.height / 2;
                            xl = x1;
                            yl = y1;
                            align = "start";
                            break;
                        case "bottom":
                            x1 = x - bbox.height / 2;
                            y1 = y + height / 2 + m;
                            xl = x;
                            yl = y1;
                            align = "middle";
                            break;
                        case "left":
                            x1 = x - width / 2 - m - bbox.width;
                            y1 = y - bbox.height / 2;
                            xl = x1 + bbox.width;
                            yl = y1;
                            align = "end";
                            break;
                        default:
                            TK.warn("Unsupported preference", pref[i]);
                    }
                    x2 = x1 + bbox.width;
                    y2 = y1 + bbox.height;
                    inter[i] = O.intersect(x1, y1, x2, y2,
                                                      O.id);
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
            case "line-vertical":
                for (i = 0; i < pref.length; i++) {
                    switch (pref[i]) {
                        case "top-left":
                            x1 = x - m - bbox.width;
                            y1 = y + m;
                            xl = x - m;
                            yl = y1;
                            align = "end";
                            break;
                        case "top-right":
                            x1 = x + width + m;
                            y1 = y + m;
                            xl = x1;
                            yl = y1;
                            align = "start";
                            break;
                        case "bottom-left":
                            x1 = x - m - bbox.width;
                            y1 = y + height - bbox.height - m;
                            xl = x - m;
                            yl = y1;
                            align = "end";
                            break;
                        case "bottom-right":
                            x1 = x + width + m;
                            y1 = y + height - bbox.height - m;
                            xl = x1;
                            yl = y1;
                            align = "start";
                            break;
                        case "left":
                            x1 = x - m - bbox.width;
                            y1 = y + height / 2 - bbox.height / 2;
                            xl = x1 + bbox.width;
                            yl = y1;
                            align = "end";
                            break;
                        case "right":
                            x1 = x + width + m;
                            y1 = y + height / 2 - bbox.height / 2;
                            xl = x1;
                            yl = y1;
                            align = "start";
                            break;
                        default:
                            TK.warn("Unsupported preference", pref[i]);
                    }
                    x2 = x1 + bbox.width;
                    y2 = y1 + bbox.height;
                    inter[i] = O.intersect(x1, y1, x2, y2, O.id);
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
            case "line-horizontal":
                for (i = 0; i < pref.length; i++) {
                    switch (pref[i]) {
                        case "top-left":
                            x1 = x + m;
                            y1 = y - m - bbox.height;
                            xl = x1;
                            yl = y1;
                            align = "start";
                            break;
                        case "top-right":
                            x1 = x + width - bbox.width - m;
                            y1 = y - m - bbox.height;
                            xl = x + width - m;
                            yl = y1;
                            align = "end";
                            break;
                        case "bottom-left":
                            x1 = x + m;
                            y1 = y + height + m;
                            xl = x1;
                            yl = y1;
                            align = "start";
                            break;
                        case "bottom-right":
                            x1 = x + width - bbox.width - m;
                            y1 = y - m - bbox.height;
                            xl = x + width - m;
                            yl = y1;
                            align = "start";
                            break;
                        case "top":
                            x1 = x + width / 2 - bbox.width / 2;
                            y1 = y - m - bbox.height;
                            xl = x + width / 2;
                            yl = y1;
                            align = "middle";
                            break;
                        case "bottom":
                            x1 = x + width / 2 - bbox.width / 2;
                            y1 = y + height + m;
                            xl = x + width / 2;
                            yl = y1;
                            align = "middle";
                            break;
                        default:
                            TK.warn("Unsupported preference", pref[i]);
                    }
                    x2 = x1 + bbox.width;
                    y2 = y1 + bbox.height;
                    inter[i] = O.intersect(x1, y1, x2, y2, O.id);
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
            case "block-left":
                for (i = 0; i < pref.length; i++) {
                    switch (pref[i]) {
                        case "top-left":
                            x1 = m;
                            y1 = y + m;
                            xl = x1;
                            yl = y1;
                            align = "start";
                            break;
                        case "top":
                            x1 = rnd.x - m - bbox.width;
                            y1 = y + m;
                            xl = rnd.x - m;
                            yl = y1;
                            align = "end";
                            break;
                        case "top-right":
                            x1 = width + m;
                            y1 = y + m;
                            xl = x1;
                            yl = y1;
                            align = "start";
                            break;
                        case "left":
                            x1 = m;
                            y1 = y + height / 2 - bbox.height / 2;
                            xl = x1;
                            yl = y1;
                            align = "start";
                            break;
                        case "center":
                            x1 = rnd.x - m - bbox.width;
                            y1 = y + height / 2 - bbox.height / 2;
                            xl = rnd.x - m;
                            yl = y1;
                            align = "end";
                            break;
                        case "right":
                            x1 = width + m;
                            y1 = y + height / 2 - bbox.height / 2;
                            xl = x1;
                            yl = y1;
                            align = "start";
                            break;
                        case "bottom-left":
                            x1 = m;
                            y1 = y + height - m - bbox.height;
                            xl = x1;
                            yl = y1;
                            align = "start";
                            break;
                        case "bottom":
                            x1 = rnd.x - m - bbox.width;
                            y1 = y + height - m - bbox.height;
                            xl = rnd.x - m;
                            yl = y1;
                            align = "end";
                            break;
                        case "bottom-right":
                            x1 = width + m;
                            y1 = y + height - m - bbox.height;
                            xl = x1;
                            yl = y1;
                            align = "start";
                            break;
                        default:
                            TK.warn("Unsupported preference", pref[i]);
                    }
                    x2 = x1 + bbox.width;
                    y2 = y1 + bbox.height;
                    inter[i] = O.intersect(x1, y1, x2, y2, O.id);
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
            case "block-right":
                for (i = 0; i < pref.length; i++) {
                    switch (pref[i]) {
                        case "top-left":
                            x1 = x - m - bbox.width;
                            y1 = y + m;
                            xl = x - m;
                            yl = y1;
                            align = "end";
                            break;
                        case "top":
                            x1 = x + m;
                            y1 = y + m;
                            xl = x1;
                            yl = y1;
                            align = "start";
                            break;
                        case "top-right":
                            x1 = width + x - m - bbox.width;
                            y1 = y + m;
                            xl = width + x - m;
                            yl = y1;
                            align = "end";
                            break;
                        case "left":
                            x1 = x - m - bbox.width;
                            y1 = y + height / 2 - bbox.height / 2;
                            xl = x - m;
                            yl = y1;
                            align = "end";
                            break;
                        case "center":
                            x1 = x + m;
                            y1 = y + height / 2 - bbox.height / 2;
                            xl = x1;
                            yl = y1;
                            align = "start";
                            break;
                        case "right":
                            x1 = width + x - m - bbox.width;
                            y1 = y + height / 2 - bbox.height / 2;
                            xl = width + x + m;
                            yl = y1;
                            align = "end";
                            break;
                        case "bottom-left":
                            x1 = x - m - bbox.width;
                            y1 = y + height - m - bbox.height;
                            xl = x - m;
                            yl = y1;
                            align = "end";
                            break;
                        case "bottom":
                            x1 = x + m;
                            y1 = y + height - m - bbox.height;
                            xl = x1;
                            yl = y1;
                            align = "start";
                            break;
                        case "bottom-right":
                            x1 = width + x - m - bbox.width;
                            y1 = y + height - m - bbox.height;
                            xl = width + x + m;
                            yl = y1;
                            align = "end";
                            break;
                        default:
                            TK.warn("Unsupported preference", pref[i]);
                    }
                    x2 = x1 + bbox.width;
                    y2 = y1 + bbox.height;
                    inter[i] = O.intersect(x1, y1, x2, y2, O.id);
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
            case "block-top":
            case "block-bottom":
                for (var i = 0; i < pref.length; i++) {
                    switch (pref[i]) {
                        case "top-left":
                            x1 = x + m;
                            y1 = y + m;
                            xl = x1;
                            yl = y1;
                            align = "start";
                            break;
                        case "top":
                            x1 = x + width / 2 - bbox.width / 2;
                            y1 = y + m;
                            xl = x + width / 2;
                            yl = y1;
                            align = "middle";
                            break;
                        case "top-right":
                            x1 = x + width - m - bbox.width;
                            y1 = y + m;
                            xl = x + width - m;
                            yl = y1;
                            align = "end";
                            break;
                        case "left":
                            x1 = x + m;
                            y1 = y + height / 2 - bbox.height / 2;
                            xl = x1;
                            yl = y1;
                            align = "start";
                            break;
                        case "center":
                            x1 = x + width / 2 - bbox.width / 2;
                            y1 = y + height / 2 - bbox.height / 2;
                            xl = x + width / 2;
                            yl = y1;
                            align = "middle";
                            break;
                        case "right":
                            x1 = x + width - m - bbox.width;
                            y1 = y + height / 2 - bbox.height / 2;
                            xl = x + width - m;
                            yl = y1;
                            align = "end";
                            break;
                        case "bottom-left":
                            x1 = x + m;
                            y1 = y + height - m - bbox.height;
                            xl = x1;
                            yl = y1;
                            align = "start";
                            break;
                        case "bottom":
                            x1 = x + width / 2 - bbox.width / 2;
                            y1 = y + height - m - bbox.height;
                            xl = x + width / 2;
                            yl = y1;
                            align = "middle";
                            break;
                        case "bottom-right":
                            x1 = x + width - m - bbox.width;
                            y1 = y + height - m - bbox.height;
                            xl = x + width - m;
                            yl = y1;
                            align = "end";
                            break;
                        default:
                            TK.warn("Unsupported preference", pref[i]);
                    }
                    x2 = x1 + bbox.width;
                    y2 = y1 + bbox.height;
                    inter[i] = O.intersect(x1, y1, x2, y2, O.id);
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
        var c = this._label.childNodes;
        for (var i = 0; i < c.length; i++)
            c[i].setAttribute("x", (pos.xl) + "px");
        this.label = {x1: pos.x1, y1: pos.y1, x2: pos.x2, y2: pos.y2};
                
        
        // LINES
        switch (O.mode) {
            case "circular":
                if (O.show_axis) {
                    var _x = Math.max(width / 2 + O.margin,
                                      this.label.x2 - rnd.x + O.margin);
                    var _y = Math.max(height / 2 + O.margin,
                                      this.label.y2 - this.y + O.margin);
                    this._line1.setAttribute("d", "M "  + _x + " 0" + this._add + " L"
                                               + (range_x.get("basis") - (x - _x))
                                               + " 0" + this._add);
                    this._line2.setAttribute("d", "M 0" + this._add + " " + _y + " L 0"
                                               + this._add + " "
                                               + (range_y.get("basis") - (y - _y)));
                }
                break;
            case "line-vertical":
            case "block-left":
            case "block-right":
                this._line1.setAttribute("d", "M " + (rnd.x + this._add) + " " + y
                                          + " L " + (rnd.x + this._add) + " "
                                          + (y + height));
                if (O.show_axis) {
                    this._line2.setAttribute("d", "M 0 " + (rnd.y + this._add) + " L "
                                                + range_x.get("basis") + " "
                                                + (rnd.y + this._add));
                } else {
                    this._line2.setAttribute("d", "M 0 0");
                }
                break;
            case "line-horizontal":
            case "block-top":
            case "block-bottom":
                this._line1.setAttribute("d", "M "   + x + " " + (rnd.y + this._add)
                                            + " L " + (x + width) + " "
                                            + (rnd.y + this._add));
                if (O.show_axis) {
                    this._line2.setAttribute("d", "M " + (rnd.x + this._add) + " 0 L "
                                              + (rnd.x + this._add) + " "
                                              + range_y.get("basis"));
                } else {
                    this._line2.setAttribute("d", "M 0 0");
                }
                break;
            default:
                TK.warn("Unsupported mode", pref[i]);
        }
        TK.Widget.prototype.redraw.call(this);
    },
    destroy: function () {
        this._line1.remove();
        this._line2.remove();
        this._label.remove();
        this._handle.remove();
        this.element.remove();
        TK.Widget.prototype.destroy.call(this);
    },
});
})(this);
