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
this.TK.AudioMath = this.AudioMath = (function(stdlib, foreign, heap) {
    "use asm";
    /** @class AudioMath
     *
     * @description AudioMath provides a couple of functions for turning
     * linear values into logarithmic ones and vice versa. If you need
     * an easy convertion between dB or Hz and a linear scale implement
     * this class.
     */
    var exp = stdlib.Math.exp;
    var log = stdlib.Math.log;
    var pow = stdlib.Math.pow;
    var MAX = stdlib.Math.max;
    var LN2 = stdlib.Math.LN2;
    var LN10 = stdlib.Math.LN10;

    function log2(value) {
        /** @method log2
         *
         * @param {number} value - The value for the log
         * @returns number; The logarithm with base 2 of the value
         * @description Calculate the logarithm with base 2 of a given
         * value. It is used for calculations with decibels in linear
         * scales.
         */
        value = +value;
        return +log(value) / LN2;
    }

    function log10(value) {
        /** @method log10
         *
         * @param {number} value - The value for the log
         * @returns number; The logarithm with base 10 of the value
         * @description Calculate the logarithm with base 10 of a given
         * value. It is used for calculations with hertz in linear
         * scales.
         */
        value = +value;
        return +log(value) / LN10;
    }

    function db2coef(value, min, max, reverse, factor) {
        /** @method db2coef
         *
         * @param {number} value - The value in decibels
         * @param {number} min - The minimum value in decibels
         * @param {number} max - The maximum value in decibels
         * @param {boolean} reverse - If the scale is reversed
         * @param {number} factor - Changes the deflection of the logarithm if other than 1.0
         * @returns number; A value between 0.0 (min) and 1.0 (max)
         * @description Calculates a linear value between 0.0 and 1.0
         * from a value and its lower and upper boundaries in decibels.
         */
        value = +value;
        min = +min;
        max = +max;
        reverse = reverse|0;
        factor = +factor;
        var logfac = 1.0;
        if (factor == 0.0) factor = 1.0;
        else logfac = +MAX(1.0, +pow(2.0, factor) - 1.0);
        if (reverse) value = max - (value - min);
        value = +log2(1.0 + (value - min) / (max - min) * logfac) / factor;
        if (reverse) value = -value + 1.0;
        return value;
    }

    function coef2db(coef, min, max, reverse, factor) {
        /** @method coef2db
         *
         * @param {number} coef - A value between 0.0 and 1.0
         * @param {number} min - The minimum value in decibels
         * @param {number} max - The maximum value in decibels
         * @param {boolean} reverse - If the scale is reversed
         * @param {number} factor - Changes the deflection of the logarithm if other than 1.0
         * @returns number; The result in decibels
         * @description Calculates a value in decibels from a value
         * between 0.0 and 1.0 and some lower and upper boundaries in decibels
         */
        coef = +coef;
        min = +min;
        max = +max;
        reverse = reverse|0;
        factor = +factor;
        var logfac = 1.0;
        if (factor == 0.0) factor = 1.0;
        else logfac = +MAX(1.0, +pow(2.0, factor) - 1.0);
        if (reverse) coef = -coef + 1.0;
        coef = (+pow(2.0, coef * factor) - 1.0) / logfac * (max - min) + min;
        if (reverse) coef = max - coef + min;
        return coef;
    }
    function db2scale(value, min, max, scale, reverse, factor) {
        /** @method db2scale
         *
         * @param {number} value - The value in decibels
         * @param {number} min - The minimum value in decibels
         * @param {number} max - The maximum value in decibels
         * @param {boolean} reverse - If the scale is reversed
         * @param {number} factor - Changes the deflection of the logarithm if other than 1.0
         * @returns number; A value between 0.0 and scale
         * @description Calculates a linear value between 0.0 and scale
         * from a value and its lower and upper boundaries in decibels.
         */
        value = +value;
        min = +min;
        max = +max;
        scale = +scale;
        reverse = reverse|0;
        factor = +factor;
        var logfac = 1.0;
        if (factor == 0.0) factor = 1.0;
        else logfac = +MAX(1.0, +pow(2.0, factor) - 1.0);
        if (reverse) value = max - (value - min);
        value = +log2(1.0 + (value - min) / (max - min) * logfac) / factor;
        if (reverse) value = -value + 1.0;
        return value * scale;
    }
    function scale2db(value, min, max, scale, reverse, factor) {
        /** @method scale2db
         *
         * @param {number} value - A value between 0.0 and scale
         * @param {number} min - The minimum value in decibels
         * @param {number} max - The maximum value in decibels
         * @param {boolean} reverse - If the scale is reversed
         * @param {number} factor - Changes the deflection of the logarithm if other than 1.0
         * @returns number; The result in decibels
         * @description Calculates a value in decibels from a value
         * between 0.0 and scale and some lower and upper boundaries in decibels.
         */
        value = +value;
        min = +min;
        max = +max;
        scale = +scale;
        reverse = reverse|0;
        factor = +factor;
        var logfac = 1.0;
        if (factor == 0.0) factor = 1.0;
        else logfac = +MAX(1.0, +pow(2.0, factor) - 1.0);
        value = value / scale;
        if (reverse) value = -value + 1.0;
        value = (+pow(2.0, value * factor) - 1.0) / logfac * (max - min) + min;
        if (reverse) value = max - value + min;
        return value;
    }
    function freq2coef(value, min, max, reverse/*, prescaled, factor*/) {
        /** @method freq2coef
         *
         * @param {number} value - The value in hertz
         * @param {number} min - The minimum value in hertz
         * @param {number} max - The maximum value in hertz
         * @param {boolean} reverse - If the scale is reversed
         * @returns number; A value between 0.0 (min) and 1.0 (max)
         * @description Calculates a linear value between 0.0 and 1.0
         * from a value and its lower and upper boundaries in hertz.
         */
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
        /** @method coef2freq
         *
         * @param {number} coef - A value between 0.0 and 1.0
         * @param {number} min - The minimum value in hertz
         * @param {number} max - The maximum value in hertz
         * @param {boolean} reverse - If the scale is reversed
         * @param {number} factor - Changes the deflection of the logarithm if other than 1.0
         * @returns number; The result in hertz
         * @description Calculates a value in hertz from a value
         * between 0.0 and 1.0 and some lower and upper boundaries in hertz.
         */
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
        /** @method freq2scale
         * @param {number} value - The value in hertz
         * @param {number} min - The minimum value in hertz
         * @param {number} max - The maximum value in hertz
         * @param {boolean} reverse - If the scale is reversed
         * @returns number; A value between 0.0 and scale
         * @description Calculates a linear value between 0.0 and scale
         * from a value and its lower and upper boundaries in hertz.
         */
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
        /** @method scale2freq
         * @param {number} value - A value between 0.0 and scale
         * @param {number} min - The minimum value in hertz
         * @param {number} max - The maximum value in hertz
         * @param {boolean} reverse - If the scale is reversed
         * @param {number} factor - Changes the deflection of the logarithm if other than 1.0
         * @returns number; The result in hertz
         * @description Calculates a value in hertz from a value
         * between 0.0 and scale and some lower and upper boundaries in hertz
         */
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
