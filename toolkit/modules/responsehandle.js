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
        if (e.button === 2) {
            e.preventDefault();
            e.stopPropagation();
            this.options.container.insertBefore(this.element, this.options.container.firstChild);
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
        if (O.z_handle === "left"
            || O.mode === "line-vertical" && O.z_handle === "top-left"
            || O.mode === "line-vertical" && O.z_handle === "bottom-left"
            || O.mode === "block-left" && O.z_handle === "top-left"
            || O.mode === "block-left" && O.z_handle === "bottom-left"
            || O.mode === "block-right" && O.z_handle === "top-left"
            || O.mode === "block-right" && O.z_handle === "bottom-left") {
            // movement to left
            this.set("z",
                range_z.snap(range_z.px2val(this.z - ((ev.pageX - this._pageX) * mz))));
            this.fire_event("zchanged", O.z);
            this._pageX = ev.pageX;
            this._pageY = ev.pageY;
        } else if (O.z_handle === "right"
            || O.mode === "line-vertical" && O.z_handle === "top-right"
            || O.mode === "line-vertical" && O.z_handle === "bottom-right"
            || O.mode === "block-left" && O.z_handle === "top-right"
            || O.mode === "block-left" && O.z_handle === "bottom-right"
            || O.mode === "block-right" && O.z_handle === "top-right"
            || O.mode === "block-right" && O.z_handle === "bottom-right") {
            // movement to right
            this.set("z",
                range_z.snap(range_z.px2val(this.z + ((ev.pageX - this._pageX) * mz))));
            this.fire_event("zchanged", O.z);
            this._pageX = ev.pageX;
            this._pageY = ev.pageY;
        } else if (O.z_handle === "top"
            || O.mode === "line-horizontal" && O.z_handle === "top-left"
            || O.mode === "line-horizontal" && O.z_handle === "top-right"
            || O.mode === "block-top" && O.z_handle === "top-left"
            || O.mode === "block-top" && O.z_handle === "top-right"
            || O.mode === "block-bottom" && O.z_handle === "top-left"
            || O.mode === "block-bottom" && O.z_handle === "top-right") {
            // movement to top
            this.set("z",
                range_z.snap(range_z.px2val(this.z - ((ev.pageY - this._pageY) * mz))));
            this.fire_event("zchanged", O.z);
            this._pageX = ev.pageX;
            this._pageY = ev.pageY;
        } else if (O.z_handle === "bottom"
            || O.mode === "line-horizontal" && O.z_handle === "bottom-left"
            || O.mode === "line-horizontal" && O.z_handle === "bottom-right"
            || O.mode === "block-top" && O.z_handle === "bottom-left"
            || O.mode === "block-top" && O.z_handle === "bottom-right"
            || O.mode === "block-bottom" && O.z_handle === "bottom-left"
            || O.mode === "block-bottom" && O.z_handle === "bottom-right") {
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
    var direction;
    e.preventDefault();
    var d = e.wheelDelta !== void(0) && e.wheelDelta ? e.wheelDelta : e.detail;
    if (d > 0) {
        direction = 1;
    } else if (d < 0) {
        direction = -1;
    } else return;

    if (this.__sto) window.clearTimeout(this.__sto);
    TK.add_class(this.element, "toolkit-active");
    this.__sto = window.setTimeout(function () {
        TK.remove_class(this.element, "toolkit-active");
        this.fire_event("zchangeended", this.options.z);
    }.bind(this), 250);
    var s = this.range_z.get("step") * direction;
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
    if (e.touches && e.touches.length === 2) {
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


/* The following functions turn positioning options
 * into somethine we can calculate with */

function ROT(a) {
    return [ +Math.sin(+a), +Math.cos(+a) ];
}

var POSITIONS = {
    "top":          ROT(0),
    "top-right":    ROT(Math.PI/4),
    "right":        ROT(Math.PI/2),
    "bottom-right": ROT(Math.PI*3/4),
    "bottom":       ROT(Math.PI),
    "bottom-left":  ROT(Math.PI*5/4),
    "left":         ROT(Math.PI*3/2),
    "top-left":     ROT(Math.PI*7/4),
};

function position_to_vector(pos) {
    var vec = POSITIONS[pos];

    if (!vec) {
        TK.warn("Unknown position: ", pos);
        vec = POSITIONS.right;
    }

    return vec;
}

var Z_HANDLE_SIZE_corner = [ 1, 1, 0, 0 ];
var Z_HANDLE_SIZE_horiz = [ 1, 0, 0, 1 ];
var Z_HANDLE_SIZE_vert = [ 0, 1, 1, 0 ];

function Z_HANDLE_SIZE(pos) {
    switch (pos) {
    default:
        TK.warn("unsupported z_handle setting", pos);
    case "top-right":
    case "bottom-right":
    case "bottom-left":
    case "top-left":
        return Z_HANDLE_SIZE_corner;
    case "top":
    case "bottom":
        return Z_HANDLE_SIZE_vert;
    case "left":
    case "right":
        return Z_HANDLE_SIZE_horiz;
    }
};

function get_zhandle_size(O, width, height) {
    var vec = Z_HANDLE_SIZE(O.z_handle);
    var z_handle_size = O.z_handle_size;
    var z_handle_centered = O.z_handle_centered;

    if (z_handle_centered < 1) {
        width *= z_handle_centered;
        height *= z_handle_centered;
    } else {
        width = z_handle_centered;
        height = z_handle_centered;
    }

    width = vec[0] * z_handle_size + vec[2] * width;
    height = vec[1] * z_handle_size + vec[3] * height;

    if (width < z_handle_size) width = z_handle_size;
    if (height < z_handle_size) height = z_handle_size;

    return [width, height];
}

var Z_HANDLE_POS = {
    "top":          [ 0, -1 ],
    "top-right":    [ 1, -1 ],
    "right":        [ 1, 0 ],
    "bottom-right": [ 1, 1 ],
    "bottom":       [ 0, 1 ],
    "bottom-left":  [ -1, 1 ],
    "left":         [ -1, 0 ],
    "top-left":     [ -1, -1 ]
};

function get_zhandle_position(O, width, height, zhandle_size) {
    var x = width/2 - zhandle_size[0]/2;
    var y = height/2 - zhandle_size[1]/2;
    var vec = Z_HANDLE_POS[O.z_handle] || Z_HANDLE_POS["top-right"];

    x += vec[0] * (width - zhandle_size[0])/2;
    y += vec[1] * (height - zhandle_size[1])/2;

    return [x, y];
}

var LABEL_ALIGN = {
    "top":      "middle",
    "bottom":   "middle",
    "left":     "end",
    "top-left": "end",
    "bottom-left":"end",
    "right":    "start",
    "top-right":"start",
    "bottom-right":"start",
    "center" : "middle",
};

function is_label_inside(mode, pos) {
    if (mode === "block-left" || mode === "block-right") {
        if (pos === "center") return true;
        if (pos.search(mode.substr(7)) !== -1) return true;
    } else if (mode === "block-top" || mode === "block-bottom") {
        /* FIXME: this is not at all consistent with the above */
        return true;
    } else if (mode === "line-horizontal") {
        return true;
    }

    return false;
}

function get_label_align(mode, pos) {
    var align;

    if (pos === "center") {
        return mode === "block-left" ? "end" : "start";
    }

    align = LABEL_ALIGN[pos];

    if (is_label_inside(mode, pos)) {
        if (align === "start") return "end";
        if (align === "end") return "start";
    }

    return align;
}

/* calculates the actual label positions based on given alignment
 * and dimensions */
function get_label_position(align, x, y, width, height) {
    switch (align) {
    case "start":
        return [ x, y, x+width, y+height ];
    case "middle":
        return [ x-width/2, y, x+width/2, y+height ];
    case "end":
        return [ x-width, y, x, y+height ];
    }
}

/**
 * @class TK.ResponseHandle
 * @extends TK.Widget
 *
 * @description Class which represents a draggable SVG element, which can be used to represent and change
 * a value inside of a {@link TK.ResponseHandler} and is drawn inside of a chart.
 *
 * @param {Object} options
 * @property {function|Object} options.range_x - Callback returning a {@link TK.Range}
 *  for the x-axis or an object with options for a {@link TK.Range}. This is usually
 *  the <code>x_range</code> of the parent chart.
 * @property {function|Object} options.range_y - Callback returning a {@link TK.Range}
 *  for the y-axis or an object with options for a {@link TK.Range}. This is usually
 *  the <code>y_range</code> of the parent chart.
 * @property {function|Object} options.range_z - Callback returning a {@link TK.Range}
 *  for the z-axis or an object with options for a {@link TK.Range}.
 * @property {string} [options.mode="circular"] - Type of the handle. Can be one of
 *  <code>"circular"</code>, <code>"line-vertical"</code>, <code>"line-horizontal"</code>,
 *  <code>"block-left"</code>, <code>"block-right"</code>, <code>"block-top"</code> or
 *  <code>"block-right"</code>.
 * @property {number} options.x - Value of the x-coordinate.
 * @property {number} options.y - Value of the y-coordinate.
 * @property {number} options.z - Value of the z-coordinate.
 * @property {number} [options.min_size=24] - Minimum size of the handle in px.
 *
 * @property {function} options.label - Label formatting function. Arguments are
 *  <code>title</code>, <code>x</code>, <code>y</code>, <code>z</code>.
 * @property {array}  [options.preferences=["left", "top", "right", "bottom"]] - Possible label
 *  positions by order of preference. Depending on the selected <code>mode</code> is can
 *  be a subset of <code>"top"</code>, <code>"top-right"</code>, <code>"right"</code>,
 *  <code>"bottom-right"</code>, <code>"bottom"</code>, <code>"bottom-left"</code>,
 *  <code>"left"</code>, <code>"top-left"</code> and <code>"center"</code>.
 * @property {number} [options.margin=3] - Margin in px between the handle and the label.
 * @property {boolean} [options.z_handle=false] - If true, a small handle is drawn, which can
 *  be dragged to change the value of the z-coordinate.
 * @property {number} [options.z_handle_size=6] - Size in px of the z-handle.
 * @property {number} [options.z_handle_centered=0.1] - Size of the z-handle in center positions.
 *  If this options is smaller than 1, it is interpreted as a ratio, otherwise as a px size.
 *
 * @property {number} [options.x_min] - Minimum value of the x-coordinate.
 * @property {number} [options.x_max] - Maximum value of the x-coordinate.
 * @property {number} [options.y_min] - Minimum value of the y-coordinate.
 * @property {number} [options.y_max] - Maximum value of the y-coordinate.
 * @property {number} [options.z_min] - Minimum value of the z-coordinate.
 * @property {number} [options.z_max] - Maximum value of the z-coordinate.
 *
 * @property {boolean} [options.show_axis=false] - If set to true, draws additional lines at
 *  the coordinate values.
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
        range_x: "mixed",
        range_y: "mixed",
        range_z: "mixed",
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
        range_x:          {}, 
        range_y:          {},
        range_z:          {},
        intersect:        function () { return { intersect: 0, count: 0 } },
        // NOTE: this is currently not a public API
        // callback function for checking intersections: function (x1, y1, x2, y2, id) {}
        // returns a value describing the amount of intersection with other handle elements.
        // intersections are weighted depending on the intersecting object. E.g. SVG borders have
        // a very high impact while intersecting in comparison with overlapping handle objects
        // that have a low impact on intersection
        mode:             "circular",
        preferences:      ["left", "top", "right", "bottom"],
        label:            TK.FORMAT("%s\n%d Hz\n%.2f dB\nQ: %.2f"),
        x:                0,
        y:                0,
        z:                0,
        min_size:         24,
        margin:           3,
        z_handle:         false,
        z_handle_size:    6,
        z_handle_centered:0.1,
        min_drag:         0,
        // NOTE: not yet a public API
        // amount of pixels the handle has to be dragged before it starts to move
        x_min:            false,
        x_max:            false,
        y_min:            false,
        y_max:            false,
        z_min:            false,
        z_max:            false,
        active:           true,
        show_axis:        false
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

        var E = TK.make_svg("g");

        this.element = E;
        
        this.widgetize(E, true, true);
        
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
            O.mode === "circular" ? "circle" : "rect", {
                "class": "toolkit-handle",
                "r":     O.z_handle_size
            }
        );
        E.appendChild(this._handle);
        
        this._zhandle = TK.make_svg(
            O.mode === "circular" ? "circle" : "rect", {
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
        E.addEventListener('contextmenu', function(e){e.preventDefault();});
        
        E = this._label;
        E.addEventListener("mouseenter",      this._mouseelement);
        E.addEventListener("touchstart",      this._mouseelement);
        E.addEventListener("mousewheel",      this._scrollwheel);
        E.addEventListener("DOMMouseScroll",  this._scrollwheel);
        E.addEventListener('contextmenu', function(e){e.preventDefault();});
        
        E = this._handle;
        E.addEventListener("mouseenter",     this._mouseelement);
        E.addEventListener("touchstart",     this._mouseelement);
        E.addEventListener("mousewheel",     this._scrollwheel);
        E.addEventListener("DOMMouseScroll", this._scrollwheel);
        E.addEventListener("touchstart",     this._touchstart);
        E.addEventListener('contextmenu', function(e){e.preventDefault();});
        
        E = this._zhandle;
        E.addEventListener("mousedown",     this._zhandledown);
        E.addEventListener("touchstart",    this._zhandledown);
        E.addEventListener('contextmenu', function(e){e.preventDefault();});
        
        this._handle.onselectstart = function () { return false; };
        
        this.set("active", O.active);
        this.set("x", O.x);
        this.set("y", O.y);
        this.set("z", O.z);
    },
    
    redraw: function () {
        var O = this.options;
        var x      = 0;
        var y      = 0;
        var width  = 0;
        var height = 0;
        var m      = O.margin;
        
        if (O.active) {
            TK.remove_class(this.element, "toolkit-disabled");
        } else {
            TK.add_class(this.element, "toolkit-disabled");
            return;
        }
        
        var range_x = this.range_x;
        var range_y = this.range_y;
        var range_z = this.range_z;
        
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
                _handle.setAttribute("cx", x.toFixed(1));
                _handle.setAttribute("cy", y.toFixed(1));
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
                this.handle = {x1: x, y1: y, x2: x + width, y2: y + height};
                break;
            default:
                TK.warn("Unsupported mode:", O.mode);
        }
        
        
        // Z-HANDLE
        var zhandle = this._zhandle;

        if (O.z_handle === false) {
            if (zhandle.parentNode) zhandle.remove();
        } else {
            if (!zhandle.parentNode)
                this.element.appendChild(zhandle);

            if (O.mode === "circular") {
                /*
                 * position the z_handle on the circle.
                 */
                var vec = position_to_vector(O.z_handle);
                /* width and height are equal here */
                zhandle.setAttribute("cx", (x+(width - O.z_handle_size) * vec[0]/2).toFixed(1));
                zhandle.setAttribute("cy", (y+-(width - O.z_handle_size) * vec[1]/2).toFixed(1));
                zhandle.setAttribute("r",  (O.z_handle_size / 2).toFixed(1));
            } else {
                // all other handle types (lines/blocks)
                var vec = get_zhandle_size(O, width, height);

                zhandle.setAttribute("width", vec[0].toFixed(1));
                zhandle.setAttribute("height", vec[1].toFixed(1));

                var vec = get_zhandle_position(O, width, height, vec);

                zhandle.setAttribute("x", (x+vec[0]).toFixed(1));
                zhandle.setAttribute("y", (y+vec[1]).toFixed(1));
            }
        }
        
        // LABEL
        var t = O.label(
                    O.title,
                    O.x,
                    O.y,
                    O.z);
        var a = t.split("\n");
        var c = this._label.childNodes;
        while (c.length < a.length) {
            this._label.appendChild(TK.make_svg("tspan", {dy:"1.0em"}));
        }
        while (c.length > a.length) {
            this._label.removeChild(this._label.lastChild);
        }
        for (var i = 0; i < a.length; i++) {
            c[i].textContent = a[i];
        }
        var w = 0;
        for (var i = 0; i < a.length; i++) {
            w = Math.max(w, c[i].getComputedTextLength());
        }
        

        var bbox;

        try {
            bbox = this._label.getBBox();
        } catch(e) {
            /* _label is not in the DOM yet */
            return;
        }

        bbox = { width: w, height: bbox.height };
        
        var xl, yl, i;
        var pref = O.preferences;
        var area = 0;
        var pos = {};
        var tmp;

        /*
         * Calculate possible positions of the labels and calculate their intersections. Choose
         * that position which has the smallest intersection area with all other handles and labels
         */
        for (i = 0; i < pref.length; i++) {
            switch (O.mode) {
            case "circular":
                switch (pref[i]) {
                case "top":
                    yl = y - height / 2 - m - bbox.height;
                    xl = x;
                    break;
                case "right":
                    xl = x + width / 2 + m;
                    yl = y - bbox.height / 2;
                    break;
                case "bottom":
                    yl = y + height / 2 + m;
                    xl = x;
                    break;
                case "left":
                    xl = x - width / 2 - m;
                    yl = y - bbox.height / 2;
                    break;
                default:
                    TK.warn("Preference not supported for mode", O.mode, pref[i]);
                    continue;
                }
                break;
            case "line-vertical":
                switch (pref[i]) {
                case "top-left":
                    yl = y + m;
                    xl = x - m;
                    break;
                case "top-right":
                    xl = x + width + m;
                    yl = y + m;
                    break;
                case "bottom-left":
                    yl = y + height - bbox.height - m;
                    xl = x - m;
                    break;
                case "bottom-right":
                    xl = x + width + m;
                    yl = y + height - bbox.height - m;
                    break;
                case "left":
                    xl = x - m;
                    yl = y + height / 2 - bbox.height / 2;
                    break;
                case "right":
                    xl = x + width + m;
                    yl = y + height / 2 - bbox.height / 2;
                    break;
                default:
                    TK.warn("Preference not supported for mode", O.mode, pref[i]);
                    continue;
                }
                break;
            case "line-horizontal":
                switch (pref[i]) {
                case "top-left":
                    xl = x + m;
                    yl = y - m - bbox.height;
                    break;
                case "top-right":
                    yl = y - m - bbox.height;
                    xl = x + width - m;
                    break;
                case "bottom-left":
                    xl = x + m;
                    yl = y + height + m;
                    break;
                case "bottom-right":
                    yl = y - m - bbox.height;
                    xl = x + width - m;
                    break;
                case "top":
                    yl = y - m - bbox.height;
                    xl = x + width / 2;
                    break;
                case "bottom":
                    yl = y + height + m;
                    xl = x + width / 2;
                    break;
                default:
                    TK.warn("Preference not supported for mode", O.mode, pref[i]);
                    continue;
                }
                break;
            case "block-left":
                switch (pref[i]) {
                case "top-left":
                    xl = x + m;
                    yl = y + m;
                    break;
                case "top":
                    xl = x - m;
                    yl = y + m;
                    break;
                case "top-right":
                    xl = width + m;
                    yl = y + m;
                    break;
                case "left":
                    xl = m;
                    yl = y + height / 2 - bbox.height / 2;
                    break;
                case "center":
                    xl = x + width - m;
                    yl = y + height / 2 - bbox.height / 2;
                    break;
                case "right":
                    xl = width + m;
                    yl = y + height / 2 - bbox.height / 2;
                    break;
                case "bottom-left":
                    xl = m;
                    yl = y + height - m - bbox.height;
                    break;
                case "bottom":
                    xl = x - m;
                    yl = y + height - m - bbox.height;
                    break;
                case "bottom-right":
                    xl = width + m;
                    yl = y + height - m - bbox.height;
                    break;
                default:
                    TK.warn("Preference not supported for mode", O.mode, pref[i]);
                    continue;
                }
                break;
            case "block-right":
                switch (pref[i]) {
                case "top-left":
                    xl = x - m;
                    yl = y + m;
                    break;
                case "top":
                    xl = x + m;
                    yl = y + m;
                    break;
                case "top-right":
                    xl = width + x - m;
                    yl = y + m;
                    break;
                case "left":
                    xl = x - m;
                    yl = y + height / 2 - bbox.height / 2;
                    break;
                case "center":
                    xl = x + m;
                    yl = y + height / 2 - bbox.height / 2;
                    break;
                case "right":
                    xl = x + width - m;
                    yl = y + height / 2 - bbox.height / 2;
                    break;
                case "bottom-left":
                    xl = x - m;
                    yl = y + height - m - bbox.height;
                    break;
                case "bottom":
                    xl = x + m;
                    yl = y + height - m - bbox.height;
                    break;
                case "bottom-right":
                    xl = width + x + m;
                    yl = y + height - m - bbox.height;
                    break;
                default:
                    TK.warn("Preference not supported for mode", O.mode, pref[i]);
                    continue;
                }
                break;
            case "block-top":
            case "block-bottom":
                switch (pref[i]) {
                case "top-left":
                    xl = x + m;
                    yl = y + m;
                    break;
                case "top":
                    xl = x + width / 2;
                    yl = y + m;
                    break;
                case "top-right":
                    xl = x + width - m;
                    yl = y + m;
                    break;
                case "left":
                    xl = x + m;
                    yl = y + height / 2 - bbox.height / 2;
                    break;
                case "center":
                    xl = x + width / 2;
                    yl = y + height / 2 - bbox.height / 2;
                    break;
                case "right":
                    xl = x + width - m;
                    yl = y + height / 2 - bbox.height / 2;
                    break;
                case "bottom-left":
                    xl = x + m;
                    yl = y + height - m - bbox.height;
                    break;
                case "bottom":
                    xl = x + width / 2;
                    yl = y + height - m - bbox.height;
                    break;
                case "bottom-right":
                    xl = x + width - m;
                    yl = y + height - m - bbox.height;
                    break;
                default:
                    TK.warn("Preference not supported for mode", O.mode, pref[i]);
                    continue;
                }
                break;
            }

            /* get alignment */

            var align = get_label_align(O.mode, pref[i]);

            /* calculate the actual label bounding box using anchor and dimensions */

            var label_position = get_label_position(align, xl, yl, bbox.width, bbox.height);

            tmp = O.intersect(label_position[0],
                              label_position[1],
                              label_position[2],
                              label_position[3],
                              this);

            if (area === 0 || tmp.intersect < area) {
                area = tmp.intersect;
                pos.x1 = label_position[0];
                pos.y1 = label_position[1];
                pos.x2 = label_position[2];
                pos.y2 = label_position[3];
                pos.xl = xl;
                pos.yl = yl;
                pos.align = align;

                /* there is no intersections, we are done */
                if (area === 0) break;
            }
        }

        this.label = pos;
        this._label.setAttribute("x", (pos.xl) + "px");
        this._label.setAttribute("y", (pos.yl) + "px");
        this._label.setAttribute("text-anchor", pos.align);
        var c = this._label.childNodes;
        for (var i = 0; i < c.length; i++)
            c[i].setAttribute("x", (pos.xl) + "px");
        
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
    set: function(key, value) {
        var O = this.options;

        switch (key) {
        case "x":
            value = this.range_x.snap(value);
            if (O.x_min !== false && value < O.x_min) value = O.x_min;
            if (O.x_max !== false && value > O.x_max) value = O.x_max;
            break;
        case "y":
            value = this.range_y.snap(value);
            if (O.y_min !== false && value < O.y_min) value = O.y_min;
            if (O.y_max !== false && value > O.y_max) value = O.y_max;
            break;
        case "z":
            value = this.range_z.snap(value);
            if (O.z_min !== false && value < O.z_min) {
                value = O.z_min;
                this.warning(this.element);
            } else if (O.z_max !== false && value > O.z_max) {
                value = O.z_max;
                this.warning(this.element);
            }
            break;
        }

        value = TK.Widget.prototype.set.call(this, key, value);

        switch (key) {
        case "x_min":
            if (value !== false && O.x < value) this.set("x", value);
            break;
        case "x_max":
            if (value !== false && O.x > value) this.set("x", value);
            break;
        case "y_min":
            if (value !== false && O.y < value) this.set("y", value);
            break;
        case "y_max":
            if (value !== false && O.y > value) this.set("y", value);
            break;
        case "z_min":
            if (value !== false && O.z < value) this.set("z", value);
            break;
        case "z_max":
            if (value !== false && O.z > value) this.set("z", value);
            break;
        }

        return value;
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
