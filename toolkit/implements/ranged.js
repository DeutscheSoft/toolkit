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
function LinearSnapModule(stdlib, foreign) {
    "use asm";
    var min = +foreign.min;
    var max = +foreign.max;
    var step = +foreign.step;
    var base = +foreign.base;

    var floor = stdlib.Math.floor;
    var ceil  = stdlib.Math.ceil;
    var round = stdlib.Math.round;

    function low_snap(v, direction) {
        v = +v;
        direction = +direction;
        var n = 0;
        var t = 0.0;

        if (v < min) {
            v = min;
            direction = 1.0;
        } else if (v > max) {
            v = max;
            direction = +1.0;
        }

        t = (v - base)/step;

        if (direction > 0.0) n = ceil(t)|0;
        else if (direction < 0.0) n = floor(t)|0;
        else n = round(t)|0;

        return base + step * n;
    }

    function snap_up(v) {
        v = +v;
        return +low_snap(v, 1.0);
    }

    function snap_down(v) {
        v = +v;
        return +low_snap(v, -1.0);
    }

    function snap(v) {
        v = +v;
        return +low_snap(v, 0.0);
    }

    return {
        snap_up : snap_up,
        snap_down : snap_down,
        snap : snap
    };
}

function ArraySnapModule(stdlib, foreign, heap) {
    "use asm";
    var len = foreign.length|0;
    var values = new stdlib.Float64Array(heap);

    function low_snap(v, direction) {
        v = +v;
        direction = +direction;
        var a = 0;
        var mid = 0;
        var b = 0;
        var t = 0.0;

        b = len;

        if (v >= +values[b << 3 >> 3]) return +values[b << 3 >> 3];
        if (v <= +values[a << 3 >> 3]) return +values[0];

        do {
            mid = (a + b) >>> 1;
            t = +values[mid << 3 >> 3];
            if (v > t) a = mid;
            else if (v < t) b = mid;
            else return t;
        } while (((b - a)|0) > 1);

        if (direction > 0.0) return +values[b << 3 >> 3];
        else if (direction < 0.0) return +values[a << 3 >> 3];

        if (values[b << 3 >> 3] - v <= v - values[a << 3 >> 3]) return +values[b << 3 >> 3];
        return +values[a << 3 >> 3];
    }

    function snap_up(v) {
        v = +v;
        return +low_snap(v, 1.0);
    }

    function snap_down(v) {
        v = +v;
        return +low_snap(v, -1.0);
    }

    function snap(v) {
        v = +v;
        return +low_snap(v, 0.0);
    }

    return {
        snap_up : snap_up,
        snap_down : snap_down,
        snap : snap
    };
}
function update_snap() {
    var O = this.options;
    // Notify that the ranged options have been modified
    if (Array.isArray(O.snap)) {
        Object.assign(this, ArraySnapModule(window, O, new Float64Array(O.snap).buffer));
    } else if (typeof O.snap === "number" && O.snap) {
        Object.assign(this, LinearSnapModule(window, { min : O.min, max : O.max, step : O.snap, base: 0.0 }));
    } else {
        this.snap = this.snap_up = this.snap_down = function(v) { return Math.max(O.min, Math.min(O.max, v)); };
    }
}
function TRAFO_FUNCTION(stdlib, foreign) {
    var reverse = foreign.reverse|0;
    var min = +foreign.min;
    var max = +foreign.max;
    var scale = foreign.scale;
    var basis = +foreign.basis;
    function val2based(value, size) {
        value = +value;
        size = +size;
        value = scale(value, foreign, false) * size;
        if (reverse) value = size - value;
        return value;
    }
    function based2val(coef, size) {
        coef = +coef;
        size = +size;
        if (reverse) coef = size - coef;
        coef = scale(coef/size, foreign, true);
        return coef;
    }
    function val2real(n) { return val2based(n, basis || 1); }
    function real2val(n) { return based2val(n, basis || 1); }
    function val2px(n) { return val2based(n, basis || 1); }
    function px2val(n) { return based2val(n, basis || 1); }
    function val2coef(n) { return val2based(n, 1); }
    function coef2val(n) { return based2val(n, 1); }
    function val2perc(n) { return val2based(n, 100); }
    function perc2val(n) { return based2val(n, 100); }
    return {
        val2based:val2based,
        based2val:based2val,
        val2real:val2real,
        real2val:real2val,
        val2px:val2px,
        px2val:px2val,
        val2coef:val2coef,
        coef2val:coef2val,
        val2perc:val2perc,
        perc2val:perc2val,
    };
}
function TRAFO_LINEAR(stdlib, foreign) {
    "use asm";
    var reverse = foreign.reverse|0;
    var min = +foreign.min;
    var max = +foreign.max;
    var basis = +foreign.basis;
    function val2based(value, size) {
        value = +value;
        size = +size;
        value = ((value - min) / (max - min)) * size;
        if (reverse) value = size - value;
        return value;
    }
    function based2val(coef, size) {
        coef = +coef;
        size = +size;
        if (reverse) coef = size - coef;
        coef = (coef / size) * (max - min) + min;
        return coef;
    }
    // calculates "real world" values (positions, coefficients, ...)
    // depending on options.basis
    function val2real(n) { n = +n; if (basis == 0.0) basis = 1.0; return +val2based(n, basis); }
    // returns a point on the scale for the "real world" value (positions,
    // coefficients, ...) based on options.basis
    function real2val(n) { n = +n; if (basis == 0.0) basis = 1.0; return +based2val(n, basis); }
    // just a wrapper for having understandable code and backward
    // compatibility
    function val2px(n) { n = +n; if (basis == 0.0) basis = 1.0; return +val2based(n, basis); }
    // just a wrapper for having understandable code and backward
    // compatibility
    function px2val(n) { n = +n; if (basis == 0.0) basis = 1.0; return +based2val(n, basis); }
    // calculates a coefficient for the value
    function val2coef(n) { n = +n; return +val2based(n, 1.0); }
    // calculates a value from a coefficient
    function coef2val(n) { n = +n; return +based2val(n, 1.0); }
    // calculates percents on the scale from a value
    function val2perc(n) { n = +n; return +val2based(n, 100.0); }
    // calculates a value from percents of the scale
    function perc2val(n) { n = +n; return +based2val(n, 100.0); }
    return {
        val2based:val2based,
        based2val:based2val,
        val2real:val2real,
        real2val:real2val,
        val2px:val2px,
        px2val:px2val,
        val2coef:val2coef,
        coef2val:coef2val,
        val2perc:val2perc,
        perc2val:perc2val,
    };
}
function TRAFO_LOG(stdlib, foreign) {
    var db2scale = stdlib.AudioMath.db2scale;
    var scale2db = stdlib.AudioMath.scale2db;
    var reverse = foreign.reverse|0;
    var min = +foreign.min;
    var max = +foreign.max;
    var log_factor = +foreign.log_factor;
    var trafo_reverse = foreign.trafo_reverse|0;
    var basis = +foreign.basis;
    function val2based(value, size) {
        value = +value;
        size = +size;
        value = +db2scale(value, min, max, size, trafo_reverse, log_factor);
        if (reverse) value = size - value;
        return value;
    }
    function based2val(coef, size) {
        coef = +coef;
        size = +size;
        if (reverse) coef = size - coef;
        coef = +scale2db(coef, min, max, size, trafo_reverse, log_factor);
        return coef;
    }
    function val2real(n) { return val2based(n, basis || 1); }
    function real2val(n) { return based2val(n, basis || 1); }
    function val2px(n) { return val2based(n, basis || 1); }
    function px2val(n) { return based2val(n, basis || 1); }
    function val2coef(n) { return val2based(n, 1); }
    function coef2val(n) { return based2val(n, 1); }
    function val2perc(n) { return val2based(n, 100); }
    function perc2val(n) { return based2val(n, 100); }
    return {
        val2based:val2based,
        based2val:based2val,
        val2real:val2real,
        real2val:real2val,
        val2px:val2px,
        px2val:px2val,
        val2coef:val2coef,
        coef2val:coef2val,
        val2perc:val2perc,
        perc2val:perc2val,
    };
}
function TRAFO_FREQ(stdlib, foreign) {
    var freq2scale = stdlib.AudioMath.freq2scale;
    var scale2freq = stdlib.AudioMath.scale2freq;
    var reverse = foreign.reverse|0;
    var min = +foreign.min;
    var max = +foreign.max;
    var trafo_reverse = foreign.trafo_reverse|0;
    var basis = +foreign.basis;
    function val2based(value, size) {
        value = +value;
        size = +size;
        value = +freq2scale(value, min, max, size, trafo_reverse);
        if (reverse) value = size - value;
        return value;
    }
    function based2val(coef, size) {
        coef = +coef;
        size = +size;
        if (reverse) coef = size - coef;
        coef = +scale2freq(coef, min, max, size, trafo_reverse);
        return coef;
    }
    function val2real(n) { return val2based(n, basis || 1); }
    function real2val(n) { return based2val(n, basis || 1); }
    function val2px(n) { return val2based(n, basis || 1); }
    function px2val(n) { return based2val(n, basis || 1); }
    function val2coef(n) { return val2based(n, 1); }
    function coef2val(n) { return based2val(n, 1); }
    function val2perc(n) { return val2based(n, 100); }
    function perc2val(n) { return based2val(n, 100); }
    return {
        val2based:val2based,
        based2val:based2val,
        val2real:val2real,
        real2val:real2val,
        val2px:val2px,
        px2val:px2val,
        val2coef:val2coef,
        coef2val:coef2val,
        val2perc:val2perc,
        perc2val:perc2val,
    };
}
function update_transformation() {
    var O = this.options;
    var scale = O.scale;

    var module;

    if (typeof scale === "function") {
        module = TRAFO_FUNCTION(w, O);
    } else switch (scale) {
        case _TOOLKIT_LINEAR:
            module = TRAFO_LINEAR(w, O);
            break;
        case _TOOLKIT_DB:
            O.trafo_reverse = 1;
            module = TRAFO_LOG(w, O);
            break;
        case _TOOLKIT_LOG2:
            O.trafo_reverse = 0;
            module = TRAFO_LOG(w, O);
            break;
        case _TOOLKIT_FREQ:
            O.trafo_reverse = 0;
            module = TRAFO_FREQ(w, O);
            break;
        case _TOOLKIT_FREQ_REVERSE:
            O.trafo_reverse = 1;
            module = TRAFO_FREQ(w, O);
            break;
    }

    Object.assign(this, module);
}
w.Ranged = $class({
    /* @class: Ranged
     * @option: scale; Int|Function; _TOOLKIT_LINEAR; The type of the scale. Either an integer
     * (_TOOLKIT_LINEAR, _TOOLKIT_DECIBEL|_TOOLKIT_LOG2, _TOOLKIT_FREQUENCY|_TOOLKIT_LOG10)
     * or a function like function (value, options, coef) {}.
     * If a function instead of an integer is handed over, it receives the
     * actual options object as the second argument and is supposed to return a
     * coefficient between 0 and 1. If the third argument "coef" is true, it is
     * supposed to return a value depending on a coefficient handed over as the
     * first argument.
     * @option: reverse; Bool; false; Reverse the scale of the range
     * @option: basis; Number; 0; Dimensions of the range. set to width/height
     * in pixels if you need it for drawing purposes, to 100 if you need
     * percentual values or to 1 if you just need a linear equivalent
     * for a e.g. logarithmic scale.
     * @option: min; Number; 0; Minimum value of the range
     * @option: max; Number; 0; Maximum value of the range
     * @option: step; Number; 0; Step size, needed for user interaction
     * @option: shift_up; Number; 0; Multiplier if SHIFT is hold while stepping
     * @option: shift_down; Number; 0; Multiplier if SHIFT + CONTROL is hold while stepping
     * @option: snap; Number|Array; 0; Snap the value to a virtual grid with this distance.
     * Using snap option with float values causes the range to reduce its
     * minimum and maximum values depending on the amount of decimal digits
     * because of the implementation of math in JavaScript.
     * Using a step size of e.g. 1.125 reduces the maximum usable value
     * from 9,007,199,254,740,992 to 9,007,199,254,740.992 (note the
     * decimal point). Alternatively set this to an array containing possible values
     * @option: round; Bool; true; If snap is set decide how to jump
     * between snaps. Setting this to true slips to the next snap if the
     * value is more than on its half way to it. Otherwise the value has
     * to reach the next snap first until it is fixed there again.
     * @option: log_factor; Number; 1; Used to range logarithmic curves.
     * The factor is used to stretch the used range of the logarithmic curve
     * @description: Ranged provides functions for calculating linear scales
     * from different values. It is useful for building coordinate systems,
     * calculating pixel positions for different scale types and the like.
     * Ranged is used e.g. in #Scale, #MeterBase and #Graph to draw elements
     * on a certain position according to a value on an arbitrary scale. */
     
    _class: "Ranged",
    options: {
        scale:          _TOOLKIT_LINEAR,
        reverse:        false,
        basis:          0,
        min:            0,
        max:            0,
        step:           0,
        shift_up:       4,
        shift_down:     0.25,
        snap:           0,
        round:          true,
        log_factor:     1
    },

    initialized: function (options) {
        update_snap.call(this);
        update_transformation.call(this);
    },

    set: function(key, value) {
        switch (key) {
        case "min":
        case "max":
        case "snap":
            update_snap.call(this); 
            /* fall through */
        case "log_factor":
        case "scale":
        case "reverse":
        case "basis":
            update_transformation.call(this);
            break;
        }
    },
});
})(this);
