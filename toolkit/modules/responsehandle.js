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
var MODES = [
    "circular",
    "line-horizontal",
    "line-vertical",
    "block-top",
    "block-bottom",
    "block-left",
    "block-right"
];
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
    this._buttons = (ev.buttons||ev.which);
    if (!this._zhandling) {
        /**
         * Is fired when the main handle is grabbed by the user.
         * The argument is an object with the following members:
         * <ul>
         * <li>x: the actual value on the x axis</li>
         * <li>y: the actual value on the y axis</li>
         * <li>pos_x: the position in pixels on the x axis</li>
         * <li>pos_y: the position in pixels on the y axis</li>
         * </ul>
         * 
         * @event TK.ResponseHandle#handlegrabbed
         * 
         * @param {Object} positions - An object containing all relevant positions of the pointer.
         */
        this.fire_event("handlegrabbed", {
            x:     this.options.x,
            y:     this.options.y,
            pos_x: this.x,
            pos_y: this.y
        });
    } else {
        /**
         * Is fired when the user grabs the z-handle. The argument is the
         * actual z value.
         * 
         * @event TK.ResponseHandle#zchangestarted
         * 
         * @param {number} z - The z value.
         */
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
        /**
         * Is fired when the user releases the main handle.
         * The argument is an object with the following members:
         * <ul>
         * <li>x: the actual value on the x axis</li>
         * <li>y: the actual value on the y axis</li>
         * <li>pos_x: the position in pixels on the x axis</li>
         * <li>pos_y: the position in pixels on the y axis</li>
         * </ul>
         * 
         * @event TK.ResponseHandle#handlereleased
         * 
         * @param {Object} positions - An object containing all relevant positions of the pointer.
         */
        this.fire_event("handlereleased", {
            x:     this.options.x,
            y:     this.options.y,
            pos_x: this.x,
            pos_y: this.y
        });
    } else {
        /**
         * Is fired when the user releases the z-handle. The argument is the
         * actual z value.
         * 
         * @event TK.ResponseHandle#zchangeended
         * 
         * @param {number} z - The z value.
         */
        this.fire_event("zchangeended", this.options.z);
        this._zhandling = false;
    }
    this.__active = false;
    return false;
}
function normalize(v) {
    var n = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
    v[0] /= n;
    v[1] /= n;
}
function mousemove(e) {
    if (!this.__active) return;
    var O = this.options;
    e.preventDefault();

    if (e.type === "mousemove" && this._buttons !== (e.buttons||e.which)) {
        mouseup.call(this, e);
        return;
    }
    
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
        var v = this.zhandle_position;

        /* we calculate the px distance of the current position and
         * the position of the mousedown event. This distance is measured
         * along the (normalized) vector from the handle to the zhandle
         */

        var d = (v[0] * (ev.pageX - this._pageX) + v[1] * (ev.pageY - this._pageY)) * mz;

        if (d > 0) {
            d = range_z.snap_up(range_z.px2val(this._clickZ + d));
        } else {
            d = range_z.snap_down(range_z.px2val(this._clickZ + d));
        }
        this.userset("z", d);
    } else if (this._sticky) {
        var dx = Math.abs((ev.pageX - this._offsetX) - this._clickX);
        var dy = Math.abs((ev.pageY - this._offsetY) - this._clickY);
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > O.min_drag)
            this._sticky = false;
    } else {
        this.userset("x", range_x.snap(range_x.px2val(this._clickX + ((ev.pageX - this._offsetX) - this._clickX) * mx)));
        this.userset("y", range_y.snap(range_y.px2val(this._clickY + ((ev.pageY - this._offsetY) - this._clickY) * my)));
        /**
         * Is fired when the user drags the main handle.
         * The argument is an object with the following members:
         * <ul>
         * <li>x: the actual value on the x axis</li>
         * <li>y: the actual value on the y axis</li>
         * <li>pos_x: the position in pixels on the x axis</li>
         * <li>pos_y: the position in pixels on the y axis</li>
         * </ul>
         * 
         * @event TK.ResponseHandle#handledragging
         * 
         * @param {Object} positions - An object containing all relevant positions of the pointer.
         */
        this.fire_event("handledragging", {
            x:     O.x,
            y:     O.y,
            pos_x: this.x,
            pos_y: this.y
        });
    }
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
    this.userset("z", this.get("z") + s);
    if (!this._zwheel)
        this.fire_event("zchangestarted", this.options.z);
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
        this.userset("z", Math.max(
            Math.min(z, this.range_z.get("max")),
            this.range_z.get("min")));
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

var ZHANDLE_POSITION_circular = {
    "top":          ROT(0),
    "top-right":    ROT(Math.PI/4),
    "right":        ROT(Math.PI/2),
    "bottom-right": ROT(Math.PI*3/4),
    "bottom":       ROT(Math.PI),
    "bottom-left":  ROT(Math.PI*5/4),
    "left":         ROT(Math.PI*3/2),
    "top-left":     ROT(Math.PI*7/4),
};

function get_zhandle_position_circular(O, X) {
    var vec = ZHANDLE_POSITION_circular[O.z_handle];
    var x = (X[0]+X[2])/2;
    var y = (X[1]+X[3])/2;
    var R = (X[2] - X[0] - O.z_handle_size)/2;

    return [
        x + R*vec[0],
        y + R*vec[1]
    ];
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

function get_zhandle_size(O, X) {
    var vec = Z_HANDLE_SIZE(O.z_handle);
    var z_handle_size = O.z_handle_size;
    var z_handle_centered = O.z_handle_centered;
    var width = X[2] - X[0];
    var height = X[3] - X[1];

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
    "top-left":     [ -1, -1 ],
    "center":       [ 0, 0 ],
};

function get_zhandle_position(O, X, zhandle_size) {
    var x = +(+X[0]+X[2]-+zhandle_size[0])/2;
    var y = +(+X[1]+X[3]-+zhandle_size[1])/2;
    var width = +X[2] - +X[0];
    var height = +X[3] - +X[1];
    var vec = Z_HANDLE_POS[O.z_handle] || Z_HANDLE_POS["top-right"];

    x += +vec[0] * +(width - +zhandle_size[0])/2;
    y += +vec[1] * +(height - +zhandle_size[1])/2;

    return [x, y];
}

var LABEL_ALIGN_outside = {
    "top":      "middle",
    "bottom":   "middle",
    "left":     "end",
    "top-left": "start",
    "bottom-left":"start",
    "right":    "start",
    "top-right":"end",
    "bottom-right":"end",
    "center" : "middle",
};

var LABEL_ALIGN_inside = {
    "top":      "middle",
    "bottom":   "middle",
    "left":     "start",
    "top-left": "start",
    "bottom-left":"start",
    "right":    "end",
    "top-right":"end",
    "bottom-right":"end",
    "center" : "middle",
};


function is_label_inside(O) {
    var mode = O.mode;
    return (mode === "block-left" || mode === "block-right" ||
            mode === "block-top" || mode === "block-bottom");
}

function get_label_align(O, pos) {
    var align;
    var LABEL_ALIGN = is_label_inside(O) ? LABEL_ALIGN_inside : LABEL_ALIGN_outside;

    align = LABEL_ALIGN[pos];

    return align;
}

var LABEL_POSITION_outside = {
    top:                 [ 0, -1, 0, -1, 0, -1 ],
    right:               [ 1, 0, 0, -1/2, 1, 0 ],
    left:                [ -1, 0, 0, -1/2, -1, 0 ],
    bottom:              [ 0, 1, 0, 0, 0, 1 ],
    "bottom-left":       [ -1, 1, 0, 0, 0, 1 ],
    "bottom-right":      [ 1, 1, 0, 0, 0, 1 ],
    "top-right":         [ 1, -1, 0, -1, 0, -1 ],
    "top-left":          [ -1, -1, 0, -1, 0, -1 ],
    center:              [ 0, 0, 0, -1/2, 0, 0 ],
};

var LABEL_POSITION_inside = {
    top:                 [ 0, -1, 0, 0, 0, 1 ],
    bottom:              [ 0, 1, 0, -1, 0, -1 ],
    right:               [ 1, 0, 0, -1/2, -1, 0 ],
    left:                [ -1, 0, 0, -1/2, 1, 0 ],
    "bottom-left":       [ -1, 1, 0, -1, 1, -1 ],
    "bottom-right":      [ 1, 1, 0, -1, -1, -1 ],
    "top-right":         [ 1, -1, 0, 0, -1, 1 ],
    "top-left":          [ -1, -1, 0, 0, 1, 1 ],
    center:              [ 0, 0, 0, -1/2, 0, 0 ],
};

function get_label_position(O, X, pos, label_size) {
    var m = O.margin;

    var x = (X[0]+X[2])/2;
    var y = (X[1]+X[3])/2;

    var width = +X[2]-+X[0];
    var height = +X[3]-+X[1];

    var LABEL_POSITION = is_label_inside(O) ? LABEL_POSITION_inside : LABEL_POSITION_outside;

    var vec = LABEL_POSITION[pos];

    x += vec[0] * width/2 + vec[2] * label_size[0] + vec[4] * m;
    y += vec[1] * height/2 + vec[3] * label_size[1] + vec[5] * m;

    return [x,y];
}

function remove_zhandle() {
    var E = this._zhandle;
    if (!E) return;
    this._zhandle = null;

    E.remove();

    E.removeEventListener("mousedown", this._zhandledown);
    E.removeEventListener("touchstart", this._zhandledown);
}

function create_zhandle() {
    var E;
    var O = this.options;

    if (this._zhandle) remove_zhandle.call(this);

    E = TK.make_svg(
        O.mode === "circular" ? "circle" : "rect", {
            "class": "toolkit-z-handle",
        }
    );

    E.addEventListener("mousedown", this._zhandledown);
    E.addEventListener("touchstart", this._zhandledown);
    E.addEventListener('contextmenu', function(e){e.preventDefault();});
    this._zhandle = E;
}

function create_line1() {
    if (this._line1) remove_line1.call(this);
    this._line1 = TK.make_svg("path", {
        "class": "toolkit-line toolkit-line-1"
    });
}
function create_line2() {
    if (this._line2) remove_line2.call(this);
    this._line2 = TK.make_svg("path", {
        "class": "toolkit-line toolkit-line-2"
    });
}
function remove_line1() {
    if (!this._line1) return;
    this._line1.remove();
    this._line1 = null;
}
function remove_line2() {
    if (!this._line2) return;
    this._line2.remove();
    this._line2 = null;
}

/* Prints a line, making sure that an offset of 0.5 px aligns them on
 * pixel boundaries */
var format_line = TK.FORMAT("M %.0f.5 %.0f.5 L %.0f.5 %.0f.5");

/* calculates the actual label positions based on given alignment
 * and dimensions */
function get_label_dimensions(align, X, label_size) {
    switch (align) {
    case "start":
        return [ X[0], X[1], X[0]+label_size[0], X[1]+label_size[1] ];
    case "middle":
        return [ X[0]-label_size[0]/2, X[1], X[0]+label_size[0]/2, X[1]+label_size[1] ];
    case "end":
        return [ X[0]-label_size[0], X[1], X[0], X[1]+label_size[1] ];
    }
}

function redraw_handle(O, X) {
    var _handle = this._handle;

    var range_x = this.range_x;
    var range_y = this.range_y;
    var range_z = this.range_z;

    if (!range_x.options.basis || !range_y.options.basis) return;

    var x = range_x.val2px(O.x);
    var y = range_y.val2px(O.y);
    var z = range_z.val2px(O.z);

    var tmp;

    if (O.mode === "circular") {
        tmp = Math.max(O.min_size, z)/2;
        X[0] = x-tmp;
        X[1] = y-tmp;
        X[2] = x+tmp;
        X[3] = y+tmp;

        _handle.setAttribute("r", Math.round(tmp).toFixed(0));
        _handle.setAttribute("cx", Math.round(x).toFixed(0));
        _handle.setAttribute("cy", Math.round(y).toFixed(0));
    } else {
        var x_min = O.x_min !== false ? range_x.val2px(range_x.snap(O.x_min)) : 0;
        var x_max = O.x_max !== false ? range_x.val2px(range_x.snap(O.x_max)) : range_x.options.basis;

        if (x_min > x_max) {
            tmp = x_min;
            x_min = x_max;
            x_max = tmp;
        }

        var y_min = O.y_min !== false ? range_y.val2px(range_y.snap(O.y_min)) : 0;
        var y_max = O.y_max !== false ? range_y.val2px(range_y.snap(O.y_max)) : range_y.options.basis;

        if (y_min > y_max) {
            tmp = y_min;
            y_min = y_max;
            y_max = tmp;
        }

        tmp = O.min_size / 2;

        /* All other modes are drawn as rectangles */
        switch (O.mode) {
        case "line-vertical":
            tmp = Math.max(tmp, z/2);
            X[0] = x-tmp;
            X[1] = y_min;
            X[2] = x+tmp;
            X[3] = y_max;
            break;
        case "line-horizontal":
            // line horizontal
            tmp = Math.max(tmp, z/2);
            X[0] = x_min;
            X[1] = y - tmp;
            X[2] = x_max;
            X[3] = y + tmp;
            break;
        case "block-left":
            // rect lefthand
            X[0] = 0;
            X[1] = y_min;
            X[2] = Math.max(x, tmp);
            X[3] = y_max;
            break;
        case "block-right":
            // rect righthand
            X[0] = x;
            X[1] = y_min;
            X[2] = range_x.options.basis;
            X[3] = y_max;
            if (X[2] - X[0] < tmp) X[0] = X[2] - tmp;
            break;
        case "block-top":
            // rect top
            X[0] = x_min;
            X[1] = 0;
            X[2] = x_max;
            X[3] = Math.max(y, tmp);
            break;
        case "block-bottom":
            // rect bottom
            X[0] = x_min;
            X[1] = y;
            X[2] = x_max;
            X[3] = range_y.options.basis;
            if (X[3] - X[1] < tmp) X[1] = X[3] - tmp;
            break;
        default:
            TK.warn("Unsupported mode:", O.mode);
        }

        /* Draw the rectangle */
        _handle.setAttribute("x", Math.round(+X[0]).toFixed(0));
        _handle.setAttribute("y", Math.round(+X[1]).toFixed(0));
        _handle.setAttribute("width", Math.round(+X[2]-X[0]).toFixed(0));
        _handle.setAttribute("height", Math.round(+X[3]-X[1]).toFixed(0));
    }
}

function redraw_zhandle(O, X) {
    var vec;
    var zhandle = this._zhandle;

    if (O.z_handle === false) {
        if (zhandle) remove_zhandle.call(this);
        return;
    }

    if (!zhandle.parentNode)
        this.element.appendChild(zhandle);

    if (O.mode === "circular") {
        /*
         * position the z_handle on the circle.
         */
        vec = get_zhandle_position_circular(O, X);
        /* width and height are equal here */
        zhandle.setAttribute("cx", vec[0].toFixed(1));
        zhandle.setAttribute("cy", vec[1].toFixed(1));
        zhandle.setAttribute("r",  (O.z_handle_size / 2).toFixed(1));

        this.zhandle_position = vec;
    } else {
        // all other handle types (lines/blocks)
        this.zhandle_position = vec = get_zhandle_size(O, X);

        zhandle.setAttribute("width", vec[0].toFixed(0));
        zhandle.setAttribute("height", vec[1].toFixed(0));

        vec = get_zhandle_position(O, X, vec);

        zhandle.setAttribute("x", vec[0].toFixed(0));
        zhandle.setAttribute("y", vec[1].toFixed(0));

        /* adjust to the center of the zhandle */
        this.zhandle_position[0] /= 2;
        this.zhandle_position[1] /= 2;
        this.zhandle_position[0] += vec[0];
        this.zhandle_position[1] += vec[1];
    }

    this.zhandle_position[0] -= (X[0]+X[2])/2;
    this.zhandle_position[1] -= (X[1]+X[3])/2;
    normalize(this.zhandle_position);
}

function create_label() {
    var E;
    this._label = E = TK.make_svg("text", {
        "class": "toolkit-label"
    });
    E.addEventListener("mouseenter",      this._mouseelement);
    E.addEventListener("touchstart",      this._mouseelement);
    E.addEventListener("mousewheel",      this._scrollwheel);
    E.addEventListener("DOMMouseScroll",  this._scrollwheel);
    E.addEventListener('contextmenu', function(e){e.preventDefault();});
}

function remove_label() {
    var E = this._label;
    this._label = null;
    E.remove();
    E.removeEventListener("mouseenter",      this._mouseelement);
    E.removeEventListener("touchstart",      this._mouseelement);
    E.removeEventListener("mousewheel",      this._scrollwheel);
    E.removeEventListener("DOMMouseScroll",  this._scrollwheel);
    E.removeEventListener('contextmenu', function(e){e.preventDefault();});

    this.label = [0,0,0,0];
}

function create_handle() {
    var O = this.options;
    var E;

    if (this._handle) remove_handle.call(this);
    
    E = TK.make_svg(O.mode === "circular" ? "circle" : "rect",
                    { class: "toolkit-handle" });
    E.addEventListener("mouseenter",     this._mouseelement);
    E.addEventListener("touchstart",     this._mouseelement);
    E.addEventListener("mousewheel",     this._scrollwheel);
    E.addEventListener("DOMMouseScroll", this._scrollwheel);
    E.addEventListener("touchstart",     this._touchstart);
    E.addEventListener('contextmenu', function(e){e.preventDefault();});
    E.addEventListener('selectstart', function(){ return false; });
    this._handle = E;
    this.element.appendChild(E);
}

function remove_handle() {
    var E = this._handle;
    if (!E) return;
    this._handle = null;
    E.remove();
    E.removeEventListener("mouseenter",     this._mouseelement);
    E.removeEventListener("touchstart",     this._mouseelement);
    E.removeEventListener("mousewheel",     this._scrollwheel);
    E.removeEventListener("DOMMouseScroll", this._scrollwheel);
    E.removeEventListener("touchstart",     this._touchstart);
}

function redraw_label(O, X) {
    if (O.label === false) {
        if (this._label) remove_label.call(this);
        return false;
    }

    var a = O.label.call(this, O.title, O.x, O.y, O.z).split("\n");
    var c = this._label.childNodes;

    while (c.length < a.length) {
        this._label.appendChild(TK.make_svg("tspan", {dy:"1.0em"}));
    }
    while (c.length > a.length) {
        this._label.removeChild(this._label.lastChild);
    }
    for (var i = 0; i < a.length; i++) {
        TK.set_text(c[i], a[i]);
    }

    if (!this._label.parentNode) this.element.appendChild(this._label);

    TK.S.add(function() {
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

        TK.S.add(function() {
            var label_size = [ w, bbox.height ];

            var i;
            var pref = O.preferences;
            var area = 0;
            var label_position;
            var text_position;
            var text_anchor;
            var tmp;

            /*
             * Calculate possible positions of the labels and calculate their intersections. Choose
             * that position which has the smallest intersection area with all other handles and labels
             */
            for (i = 0; i < pref.length; i++) {

                /* get alignment */
                var align = get_label_align(O, pref[i]);

                /* get label position */
                var LX = get_label_position(O, X, pref[i], label_size);

                /* calculate the label bounding box using anchor and dimensions */
                var pos = get_label_dimensions(align, LX, label_size);

                tmp = O.intersect(pos, this);

                /* We require at least one square px smaller intersection
                 * to avoid flickering label positions */
                if (area === 0 || tmp.intersect + 1 < area) {
                    area = tmp.intersect;
                    label_position = pos;
                    text_position = LX;
                    text_anchor = align;

                    /* there is no intersections, we are done */
                    if (area === 0) break;
                }
            }

            this.label = label_position;
            tmp = Math.round(text_position[0]) + "px";
            this._label.setAttribute("x", tmp);
            this._label.setAttribute("y", Math.round(text_position[1]) + "px");
            this._label.setAttribute("text-anchor", text_anchor);
            var c = this._label.childNodes;
            for (var i = 0; i < c.length; i++)
                c[i].setAttribute("x", tmp);

            redraw_lines.call(this, O, X);
        }.bind(this), 1);
    }.bind(this));

    return true;
}

function redraw_lines(O, X) {
    var pos = this.label;
    var x = this.x;
    var y = this.y;
    var z = this.z;
    var range_x = this.range_x;
    var range_y = this.range_y;
    var range_z = this.range_z;

    switch (O.mode) {
        case "circular":
            if (O.show_axis) {
                this._line1.setAttribute("d",
                     format_line(((y >= pos[1] && y <= pos[3]) ? Math.max(X[2], pos[2]) : X[2]) + O.margin, y,
                                 range_x.options.basis, y));
                this._line2.setAttribute("d",
                     format_line(x, ((x >= pos[0] && x <= pos[2]) ? Math.max(X[3], pos[3]) : X[3]) + O.margin,
                                 x, range_y.options.basis));
            } else {
                if (this._line1) remove_line1.call(this);
                if (this._line2) remove_line2.call(this);
            }
            break;
        case "line-vertical":
        case "block-left":
        case "block-right":
            this._line1.setAttribute("d", format_line(x, X[1], x, X[3]));
            if (O.show_axis) {
                this._line2.setAttribute("d", format_line(0, y, range_x.options.basis, y));
            } else if (this._line2) {
                remove_line2.call(this);
            }
            break;
        case "line-horizontal":
        case "block-top":
        case "block-bottom":
            this._line1.setAttribute("d", format_line(X[0], y, X[2], y));
            if (O.show_axis) {
                this._line2.setAttribute("d", format_line(x, 0, x, range_y.options.basis));
            } else if (this._line2) {
                remove_line2.call(this);
            }
            break;
        default:
            TK.warn("Unsupported mode", pref[i]);
    }

    if (this._line1 && !this._line1.parentNode) this.element.appendChild(this._line1);
    if (this._line2 && !this._line2.parentNode) this.element.appendChild(this._line2);
}

function set_main_class(O) {
    var E = this.element;
    var i;

    for (i = 0; i < MODES.length; i++) TK.remove_class(E, "toolkit-"+MODES[i]);

    TK.remove_class(E, "toolkit-line");
    TK.remove_class(E, "toolkit-block");

    switch (O.mode) {
    case "line-vertical":
    case "line-horizontal":
        TK.add_class(E, "toolkit-line");
    case "circular":
        break;
    case "block-left":
    case "block-right":
    case "block-top":
    case "block-bottom":
        TK.add_class(E, "toolkit-block");
        break;
    default:
        TK.warn("Unsupported mode:", O.mode);
        return;
    }

    TK.add_class(E, "toolkit-"+O.mode);
}

/**
 * Class which represents a draggable SVG element, which can be used to represent and change
 * a value inside of a {@link TK.ResponseHandler} and is drawn inside of a chart.
 *
 * @class TK.ResponseHandle
 * 
 * @extends TK.Widget
 *
 * @param {Object} options
 * 
 * @property {function|Object} options.range_x - Callback returning a {@link TK.Range}
 *   for the x-axis or an object with options for a {@link TK.Range}. This is usually
 *   the <code>x_range</code> of the parent chart.
 * @property {function|Object} options.range_y - Callback returning a {@link TK.Range}
 *   for the y-axis or an object with options for a {@link TK.Range}. This is usually
 *   the <code>y_range</code> of the parent chart.
 * @property {function|Object} options.range_z - Callback returning a {@link TK.Range}
 *   for the z-axis or an object with options for a {@link TK.Range}.
 * @property {string} [options.mode="circular"] - Type of the handle. Can be one of
 *   <code>"circular"</code>, <code>"line-vertical"</code>, <code>"line-horizontal"</code>,
 *   <code>"block-left"</code>, <code>"block-right"</code>, <code>"block-top"</code> or
 *   <code>"block-right"</code>.
 * @property {number} options.x - Value of the x-coordinate.
 * @property {number} options.y - Value of the y-coordinate.
 * @property {number} options.z - Value of the z-coordinate.
 * @property {number} [options.min_size=24] - Minimum size of the handle in px.
 * @property {function} options.label - Label formatting function. Arguments are
 *   <code>title</code>, <code>x</code>, <code>y</code>, <code>z</code>. If this options is
 *   <code>false</code>, no label is displayed.
 * @property {array}  [options.preferences=["left", "top", "right", "bottom"]] - Possible label
 *   positions by order of preference. Depending on the selected <code>mode</code> is can
 *   be a subset of <code>"top"</code>, <code>"top-right"</code>, <code>"right"</code>,
 *   <code>"bottom-right"</code>, <code>"bottom"</code>, <code>"bottom-left"</code>,
 *   <code>"left"</code>, <code>"top-left"</code> and <code>"center"</code>.
 * @property {number} [options.margin=3] - Margin in px between the handle and the label.
 * @property {boolean} [options.z_handle=false] - If true, a small handle is drawn, which can
 *   be dragged to change the value of the z-coordinate.
 * @property {number} [options.z_handle_size=6] - Size in px of the z-handle.
 * @property {number} [options.z_handle_centered=0.1] - Size of the z-handle in center positions.
 *   If this options is smaller than 1, it is interpreted as a ratio, otherwise as a px size.
 * @property {number} [options.x_min] - Minimum value of the x-coordinate.
 * @property {number} [options.x_max] - Maximum value of the x-coordinate.
 * @property {number} [options.y_min] - Minimum value of the y-coordinate.
 * @property {number} [options.y_max] - Maximum value of the y-coordinate.
 * @property {number} [options.z_min] - Minimum value of the z-coordinate.
 * @property {number} [options.z_max] - Maximum value of the z-coordinate.
 * @property {boolean} [options.show_axis=false] - If set to true, draws additional lines at
 *   the coordinate values.
 *
 * @mixes TK.Ranges
 * @mixes TK.Warning
 * @mixes TK.GlobalCursor
 */

/**
 * @member {SVGText} TK.ResponseHandle#_label - The label. Has class <code>toolkit-label</code>.
 */
/**
 * @member {SVGPath} TK.ResponseHandle#_line1 - The first line. Has class <code>toolkit-line toolkit-line-1</code>.
 */
/**
 * @member {SVGPath} TK.ResponseHandle#_line2 - The first line. Has class <code>toolkit-line toolkit-line-2</code>.
 */

function set_min(value, key) {
    var name = key.substr(0, 1);
    var O = this.options;
    if (value !== false && O[name] < value) this.set(name, value);
}

function set_max(value, key) {
    var name = key.substr(0, 1);
    var O = this.options;
    if (value !== false && O[name] > value) this.set(name, value);
}
         
/**
 * The <code>useraction</code> event is emitted when a widget gets modified by user interaction.
 * The event is emitted for the options <code>x</code>, <code>y</code> and <code>z</code>.
 *
 * @event TK.ResponseHandle#useraction
 * 
 * @param {string} name - The name of the option which was changed due to the users action.
 * @param {mixed} value - The new value of the option.
 */
w.TK.ResponseHandle = w.ResponseHandle = $class({
    _class: "ResponseHandle",
    Extends: TK.Widget,
    Implements: [TK.GlobalCursor, TK.Ranges, TK.Warning],
    _options: Object.assign(Object.create(TK.Widget.prototype._options), TK.Ranges.prototype._options, {
        range_x: "mixed",
        range_y: "mixed",
        range_z: "mixed",
        intersect: "function",
        mode: "string",
        preferences: "array",
        label: "function",
        x: "number",
        y: "number",
        z: "number",
        min_size: "number",
        margin: "number",
        z_handle: "boolean|string",
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
    static_events: {
        set_show_axis: function(value) {
            var O = this.options;
            if (O.mode === "circular") create_line1.call(this);
            create_line2.call(this);
        },
        set_label: function(value) {
            if (value !== false && !this._label) create_label.call(this);
        },
        set_mode: function(value) {
            var O = this.options;
            create_handle.call(this);
            if (O.z_handle !== false) create_zhandle.call(this);
            if (value !== "circular") create_line1.call(this);
        },
        set_x_min: set_min,
        set_y_min: set_min,
        set_z_min: set_min,
        set_x_max: set_max,
        set_y_max: set_max,
        set_z_max: set_max,
    },

    initialize: function (options) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.label = [0,0,0,0];
        this.handle = [0,0,0,0];
        this.__active = false;
        this._tdist = false;
        this._zhandling = false;
        this._zwheel = false;
        this._sticky = false;
        TK.Widget.prototype.initialize.call(this, options);
        var O = this.options;
        
        /**
         * @member {TK.Range} TK.ResponseHandle#range_x - The range for the x axis.
         */
        /**
         * @member {TK.Range} TK.ResponseHandle#range_y - The range for the y axis.
         */
        /**
         * @member {TK.Range} TK.ResponseHandle#range_z - The range for the z axis.
         */
        this.add_range(O.range_x, "range_x");
        this.add_range(O.range_y, "range_y");
        this.add_range(O.range_z, "range_z");

        var set_cb = function() {
            this.invalid.x = true;
            this.trigger_draw();
        }.bind(this);

        this.range_x.add_event("set", set_cb);
        this.range_y.add_event("set", set_cb);
        this.range_z.add_event("set", set_cb);

        var E = TK.make_svg("g");
        
        /**
         * @member {SVGGroup} TK.ResponseHandle#element - The main SVG group containing all handle elements. Has class <code>toolkit-response-handle</code>.
         */
        this.element = E;

        this.widgetize(E, true, true);

        TK.add_class(E, "toolkit-response-handle");
        /**
         * @member {SVGCircular} TK.ResponseHandle#_handle - The main handle.
         *      Has class <code>toolkit-handle</code>.
         */
        
        /**
         * @member {SVGCircular} TK.ResponseHandle#_zhandle - The handle for manipulating z axis.
         *      Has class <code>toolkit-z-handle</code>.
         */

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

        this._handle = this._zhandle = this._line1 = this._line2 = this._label = null;

        this.set("mode", O.mode);
        this.set("show_axis", O.show_axis);
        this.set("active", O.active);
        this.set("x", O.x);
        this.set("y", O.y);
        this.set("z", O.z);
        this.set("z_handle", O.z_handle);
        this.set("label", O.label);
    },

    redraw: function () {
        TK.Widget.prototype.redraw.call(this);
        var O = this.options;
        var I = this.invalid;

        var range_x = this.range_x;
        var range_y = this.range_y;
        var range_z = this.range_z;

        /* NOTE: this is currently done for the mouse events */
        this.x = range_x.val2px(O.x);
        this.y = range_y.val2px(O.y);
        this.z = range_z.val2px(O.z);

        /* These are the coordinates of the corners (x1, y1, x2, y2)
         * NOTE: x,y are not necessarily in the midde. */
        var X  = this.handle;

        if (I.mode) set_main_class.call(this, O);

        if (I.active) {
            // TODO: this is not very nice, we should really use the options
            // for that. 1) set "active" from the mouse handlers 2) set disabled instead
            // of active
            TK.toggle_class(this.element, "toolkit-disabled", !O.active);
        }

        var moved = I.validate("x", "y", "z", "mode", "active");

        if (moved) redraw_handle.call(this, O, X);

        // Z-HANDLE

        if (I.validate("z_handle") || moved) {
            redraw_zhandle.call(this, O, X);
        }

        var delay_lines;
        
        // LABEL
        if (I.validate("label", "title", "preference") || moved) {
            delay_lines = redraw_label.call(this, O, X);
        }

        // LINES
        if (I.validate("show_axis") || moved) {
            if (!delay_lines) redraw_lines.call(this, O, X);
        }
    },
    set: function(key, value) {
        var O = this.options;

        switch (key) {
        case "z_handle":
            if (value !== false && !ZHANDLE_POSITION_circular[value]) {
                TK.warn("Unsupported z_handle option:", value);
                value = false;
            }
            if (value !== false) create_zhandle.call(this);
            break;
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

        return TK.Widget.prototype.set.call(this, key, value);
    },
    destroy: function () {
        remove_zhandle.call(this);
        remove_line1.call(this);
        remove_line2.call(this);
        remove_label.call(this);
        remove_handle.call(this);
        this.element.remove();
        TK.Widget.prototype.destroy.call(this);
    },
});
})(this);
