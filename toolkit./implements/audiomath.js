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
 
AudioMath = new Class({
    // AudioMath provides a couple of functions for turning linear values into
    // logarithmic ones and vice versa. If you need an easy convertion between
    // dB or Hz and a linear scale implement this class.
    _class: "AudioMath",
    // DECIBEL CALCULATIONS
    db2coef: function (value, min, max, reverse, factor) {
        factor = factor || 1;
        var logfac = Math.max(1, Math.pow(2, factor) - 1);
        if (reverse) value = max - (value - min);
        value = Math.log2(1 + (value - min) / (max - min) * logfac) / factor;
        if (reverse) return -value + 1;
        return value;
    },
    coef2db: function (coef, min, max, reverse, factor) {
        factor = factor || 1;
        var logfac = Math.max(1, Math.pow(2, factor) - 1);
        if (reverse) coef = -coef + 1;
        coef = (Math.pow(2, coef * factor) - 1) / logfac * (max - min) + min;
        if (reverse) return max - coef + min;
        return coef
    },
    db2scale: function (value, min, max, scale, reverse, factor) {
        return this.db2coef(value, min, max, reverse, factor) * scale;
    },
    scale2db: function (value, min, max, scale, reverse, factor) {
        return this.coef2db(value / scale, min, max, reverse, factor);
    },
    // FREQUENCY CALCULATIONS
    freq2coef: function (value, min, max, reverse, prescaled, factor) {
        if (reverse) value = max - (value - min);
        min   = Math.log10(min);
        max   = Math.log10(max);
        value = ((Math.log10(value) - min) / (max - min));
        if (reverse) return -value + 1;
        return value;
    },
    coef2freq: function (coef, min, max, reverse) {
        if (reverse) coef = -coef + 1;
        min  = Math.log10(min);
        max  = Math.log10(max);
        coef = Math.pow(10, (coef * (max - min) + min));
        if (reverse) return max - coef + min;
        return coef
    },
    freq2scale: function (value, min, max, scale, reverse) {
        return this.freq2coef(value, min, max, reverse) * scale;
    },
    scale2freq: function (value, min, max, scale, reverse) {
        return this.coef2freq(value / scale, min, max, reverse);
    }
});
