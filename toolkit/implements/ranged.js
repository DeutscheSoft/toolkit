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
w.Ranged = $class({
    // Ranged provides stuff for calculating linear scales from different values.
    // It is useful to build coordinate systems, calculating pixel positions
    // for different scale types and the like. Ranged is used e.g. in Scale,
    // MeterBase and Graph to draw elements on a certain position according to
    // a value on an arbitrary scale. Range implements AudioMath, Options and
    // Events.
    _class: "Ranged",
    Implements: AudioMath,
    options: {
        scale:          _TOOLKIT_LINEAR, // What kind of value are we having?
                                         // _TOOLKIT_LINEAR
                                         // _TOOLKIT_DECIBEL / _TOOLKIT_LOG2
                                         // _TOOLKIT_FREQUENCY / _TOOLKIT_LOG10
                                         // function (value, options, coef) {}
                                         // 
                                         // If a function instead of a constant
                                         // is handed over, it receives the
                                         // actual options object as the second
                                         // argument and is supposed to return a
                                         // coefficient between 0 and 1. If the
                                         // third argument "coef" is true, it is
                                         // supposed to return a value depending
                                         // on a coefficient handed over as the 
                                         // first argument.
        reverse:        false,           // true if the range is reversed
        basis:          0,               // Dimensions of the range, set to
                                         // width/height in pixels, if you need
                                         // it for drawing purposes, to 100 if
                                         // you need percentual values or to 1
                                         // if you just need a linear
                                         // coefficient for a e.g. logarithmic
                                         // scale.
        min:            0,               // Minimum value of the range
        max:            0,               // Maximum value of the range
        step:           0,               // Step size, needed for e.g. user
                                         // interaction
        shift_up:       4,               // Multiplier for e.g. SHIFT pressed
                                         // while stepping
        shift_down:     0.25,            // Multiplier for e.g. SHIFT + CONTROL
                                         // pressed while stepping
        snap:           0,               // Snap the value to a virtual grid
                                         // with this distance
                                         // Using snap option with float values
                                         // causes the range to reduce its
                                         // minimum and maximum values depending
                                         // on the amount of decimal digits
                                         // because of the implementation of
                                         // math in JavaScript.
                                         // Using a step size of e.g. 1.125
                                         // reduces the maximum usable value
                                         // from 9,007,199,254,740,992 to
                                         // 9,007,199,254,740.992 (note the
                                         // decimal point)
                                         // Alternatively set this to an array
                                         // containing possible values
        round:          true,            // if snap is set decide how to jump
                                         // between snaps. Setting this to true
                                         // slips to the next snap if the value
                                         // is more than on its half way to it.
                                         // Otherwise the value has to reach the
                                         // next snap until it is hold there
                                         // again.
        log_factor:     1                // Used to range logarithmic curves.
                                         // The factor is used to stretch the
                                         // used range of the logarithmic curve
                                            
    },
    
    val2real: function (n, nosnap) {
        // calculates "real world" values (positions, coefficients, ...)
        // depending on options.basis
        return this.val2based(n, this.options.basis, nosnap);
    },
    real2val: function (n, nosnap) {
        // returns a point on the scale for the "real world" value (positions,
        // coefficients, ...) based on options.basis
        return this.based2val(n, this.options.basis, nosnap);
    },
    gen_to_scale : function() {
        if (typeof this.options.scale == "function") {
            var f = this.options.scale;
            var op = this.options;
            var bas = +this.options.basis;
            return function (value) {
                return f(value, op, false) * bas;
            };
        }
        switch (this.options.scale|0) {
            default:
            case _TOOLKIT_LINEAR:
                return function (value, min, max, basis) {
                    value = +value;
                    min = +min;
                    max = +max;
                    basis = +basis;
                    return ((((min - value) * -1) / (max - min)) || 0) * basis;
                };
            case _TOOLKIT_DB:
            case _TOOLKIT_LOG2:
                return this.db2scale;
            case _TOOLKIT_FREQ:
            case _TOOLKIT_FREQ_REVERSE:
                return this.freq2scale;
        }
    },
    gen_val2px : function(nosnap) {
        var basis = +this.options.basis;
        var min = +this.options.min;
        var max = +this.options.max;
        var rev = !!this.options.reverse;
        var reverse = this.options.scale == _TOOLKIT_DB || this.options.scale == _TOOLKIT_FREQ_REVERSE;
        var trafo = this.gen_to_scale();
        var lf = +this.options.log_factor;

        if (!nosnap) {
            var snap = this.snap;
            return function (x) {
                x = +snap(x);
                x = +trafo(x, min, max, basis, reverse, lf);
                if (rev) return -x + basis;
                else return x;
            };
        } else {
            return function (x) {
                x = +trafo(x, min, max, basis, reverse, lf);
                if (rev) return -x + basis;
                else return x;
            };
        }
    },
    val2px: function (n, nosnap) {
        // just a wrapper for having understandable code and backward
        // compatibility
        return this.val2based(n, this.options.basis, nosnap);
    },
    gen_from_scale : function() {
        if (typeof this.options.scale == "function") {
            var f = this.options.scale;
            var op = this.options;
            var bas = this.options.basis;
            return function (value) {
                return f(value, op, true) * bas;
            };
        }
        switch (this.options.scale) {
            default:
            case _TOOLKIT_LINEAR:
                return function (value, min, max, basis) {
                    return (value / basis) * (max - min) + min;
                };
            case _TOOLKIT_DB:
            case _TOOLKIT_LOG2:
                return this.scale2db;
            case _TOOLKIT_FREQ:
            case _TOOLKIT_FREQ_REVERSE:
                return this.scale2freq;
        }
    },
    gen_px2val : function(nosnap) {
        var basis = this.options.basis || 1;
        var min = this.options.min;
        var max = this.options.max;
        var rev = this.options.reverse;
        var reverse = this.options.scale == _TOOLKIT_DB || this.options.scale == _TOOLKIT_FREQ_REVERSE;
        var trafo = this.gen_from_scale();
        var lf = this.options.log_factor;

        if (!nosnap) {
            var snap = this.snap;
            return function (x) {
                if (rev) x = -x + basis;
                x = trafo(x, min, max, basis, reverse, lf);
                x = snap(x);
                return x;
            };
        } else {
            return function (x) {
                if (rev) x = -x + basis;
                x = trafo(x, min, max, basis, reverse, lf);
                return x;
            };
        }
    },
    px2val: function (n, nosnap) {
        // just a wrapper for having understandable code and backward
        // compatibility
        return this.based2val(n, this.options.basis, nosnap);
    },
    val2coef: function (n, nosnap) {
        // calculates a coefficient for the value
        return this.val2based(n, 1, nosnap);
    },
    coef2val: function (n, nosnap) {
        // calculates a value from a coefficient
        return this.based2val(n, 1, nosnap);
    },
    val2perc: function (n, nosnap) {
        // calculates percents on the scale from a value
        return this.val2based(n, 100, nosnap);
    },
    perc2val: function (n, nosnap) {
        // calculates a value from percents of the scale
        return this.based2val(n, 100, nosnap);
    },
    val2based: function (value, basis, nosnap) {
        // takes a value and returns the corresponding point on the scale
        // according to basis
        if (typeof value == "undefined") value = this.options.value;
        basis = basis || 1;
        if (!nosnap) value = this.snap(value);
        var coef = 0;
        if (typeof this.options.scale == "function")
            coef = this.options.scale(value, this.options, false) * basis;
        else
        switch (this.options.scale) {
            default:
            case _TOOLKIT_LINEAR:
                coef = ((((this.options.min - value) * -1)
                    / (this.options.max - this.options.min)) || 0) * basis;
                break;
            case _TOOLKIT_DB:
                coef = this.db2scale(
                       value, this.options.min, this.options.max, basis,
                       true, this.options.log_factor);
                break;
            case _TOOLKIT_LOG2:
                coef = this.db2scale(
                       value, this.options.min, this.options.max, basis,
                       false, this.options.log_factor);
                break;
            case _TOOLKIT_FREQ:
                coef = this.freq2scale(
                       value, this.options.min, this.options.max, basis,
                       false);
                break;
            case _TOOLKIT_FREQ_REVERSE:
                coef = this.freq2scale(
                       value, this.options.min, this.options.max, basis,
                       true);
                break;
        }
        if (this.options.reverse) coef = -coef + basis;
        return coef;
    },
    based2val: function (coef, basis, nosnap) {
        // takes a point on the scale according to basis and returns the
        // corresponding value
        basis = basis || 1;
        var value = 0;
        if (this.options.reverse) coef = -coef + basis;
        if (typeof this.options.scale == "function")
            value = this.options.scale(coef / basis, this.options, true);
        else
        switch (this.options.scale) {
            default:
            case _TOOLKIT_LINEAR:
                value = (coef / basis)
                    * (this.options.max - this.options.min) + this.options.min;
                break;
            case _TOOLKIT_DB:
                value = this.scale2db(
                       coef, this.options.min, this.options.max, basis,
                       true, this.options.log_factor);
                break;
            case _TOOLKIT_LOG2:
                value = this.scale2db(
                       coef, this.options.min, this.options.max, basis,
                       false, this.options.log_factor);
                break;
            case _TOOLKIT_FREQ:
                value = this.scale2freq(
                       coef, this.options.min, this.options.max, basis,
                       false);
                break;
            case _TOOLKIT_FREQ_REVERSE:
                value = this.scale2freq(
                       coef, this.options.min, this.options.max, basis,
                       true);
                break;
        }
        if (nosnap) return value;
        return this.snap(value);
    },
    update_ranged: function() {
        var O = this.options;
        // Notify that the ranged options have been modified
        if (Array.isArray(O.snap)) {
            Object.assign(this, ArraySnapModule(window, O, new Float64Array(O.snap).buffer));
        } else if (typeof O.snap === "number" && O.snap) {
            Object.assign(this, LinearSnapModule(window, { min : O.min, max : O.max, step : O.snap, base: 0.0 }));
        } else {
            this.snap = this.snap_up = this.snap_down = function(v) { return v; };
        }
    },
});
})(this);
