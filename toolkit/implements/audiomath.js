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
this.AudioMath = (function(stdlib, foreign, heap) {
    "use asm";
    // AudioMath provides a couple of functions for turning linear values into
    // logarithmic ones and vice versa. If you need an easy convertion between
    // dB or Hz and a linear scale implement this class.
    var exp = stdlib.Math.exp;
    var log = stdlib.Math.log;
    var pow = stdlib.Math.pow;
    var MAX = stdlib.Math.max;
    var LN2 = stdlib.Math.LN2;
    var LN10 = stdlib.Math.LN10;

    function log2(v) {
        v = +v;
        return +log(v) / LN2;
    }

    function log10(v) {
        v = +v;
        return +log(v) / LN10;
    }

    function db2coef(value, min, max, reverse, factor) {
        value = +value;
        min = +min;
        max = +max;
        reverse = reverse|0;
        factor = +factor;
        var logfac = 2.0;
        if (factor == 0.0) factor = 1.0;
        else logfac = +MAX(1.0, +pow(2.0, factor) - 1.0);
        if (reverse) value = max - (value - min);
        value = +log2(1.0 + (value - min) / (max - min) * logfac) / factor;
        if (reverse) value = -value + 1.0;
        return value;
    }

    function coef2db(coef, min, max, reverse, factor) {
        coef = +coef;
        min = +min;
        max = +max;
        reverse = reverse|0;
        factor = +factor;
        var logfac = 2.0;
        if (factor == 0.0) factor = 1.0;
        else logfac = +MAX(1.0, +pow(2.0, factor) - 1.0);
        if (reverse) coef = -coef + 1.0;
        coef = (+pow(2.0, coef * factor) - 1.0) / logfac * (max - min) + min;
        if (reverse) coef = max - coef + min;
        return coef;
    }
    function db2scale(value, min, max, scale, reverse, factor) {
        value = +value;
        min = +min;
        max = +max;
        scale = +scale;
        reverse = reverse|0;
        factor = +factor;
        var logfac = 2.0;
        if (factor == 0.0) factor = 1.0;
        else logfac = +MAX(1.0, +pow(2.0, factor) - 1.0);
        if (reverse) value = max - (value - min);
        value = +log2(1.0 + (value - min) / (max - min) * logfac) / factor;
        if (reverse) value = -value + 1.0;
        return value * scale;
    }
    function scale2db(value, min, max, scale, reverse, factor) {
        value = +value;
        min = +min;
        max = +max;
        scale = +scale;
        reverse = reverse|0;
        factor = +factor;
        var logfac = 2.0;
        if (factor == 0.0) factor = 1.0;
        else logfac = +MAX(1.0, +pow(2.0, factor) - 1.0);
        value = value / scale;
        if (reverse) value = -value + 1.0;
        value = (+pow(2.0, value * factor) - 1.0) / logfac * (max - min) + min;
        if (reverse) value = max - value + min;
        return value;
    }
    function freq2coef(value, min, max, reverse/*, prescaled, factor*/) {
        value = +value;
        min = +min;
        max = +max;
        reverse = reverse|0;
         // FIXME: unused
        if (reverse) value = max - (value - min);
        min   = +log10(min);
        max   = +log10(max);
        value = ((+log10(value) - min) / (max - min));
        if (reverse) value = -value + 1.0;
        return value;
    }
    function coef2freq(coef, min, max, reverse) {
        coef = +coef;
        min = +min;
        max = +max;
        reverse = reverse|0;
        if (reverse) coef = -coef + 1.0;
        min  = +log10(min);
        max  = +log10(max);
        coef = +pow(10.0, (coef * (max - min) + min));
        if (reverse) coef = max - coef + min;
        return coef;
    }
    function freq2scale(value, min, max, scale, reverse) {
        value = +value;
        min = +min;
        max = +max;
        scale = +scale;
        reverse = reverse|0;
        if (reverse) value = max - (value - min);
        min   = +log10(min);
        max   = +log10(max);
        value = ((+log10(value) - min) / (max - min));
        if (reverse) value = -value + 1.0;
        return value * scale;
    }
    function scale2freq(value, min, max, scale, reverse) {
        value = +value;
        min = +min;
        max = +max;
        scale = +scale;
        reverse = reverse|0;
        value = value / scale;
        if (reverse) value = -value + 1.0;
        min  = +log10(min);
        max  = +log10(max);
        value = pow(10.0, (value * (max - min) + min));
        if (reverse) value = max - value + min;
        return value;
    }

    return {
        // DECIBEL CALCULATIONS
        db2coef: db2coef,
        coef2db: coef2db,
        db2scale: db2scale,
        scale2db: scale2db,
        // FREQUENCY CALCULATIONS
        freq2coef: freq2coef,
        coef2freq: coef2freq,
        freq2scale: freq2scale,
        scale2freq: scale2freq
    }
})(this);
