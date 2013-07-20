/*******************************************************************************
 * toolkit. by Junger
 * 
 * This toolkit provides different widgets, implements and modules for building
 * audio based applications in webbrowsers.
 * 
 * Concept and realization by Markus Schmidt <schmidt@boomshop.net> for:
 * 
 * Jünger Audio GmbH
 * Justus-von-Liebig-Straße 7
 * 12489 Berlin · Germany
 * Tel: +49 30 67 77 21 0
 * http://junger-audio.com
 * info@junger-audio.com
 * 
 * toolkit. relies on mootools: http://mootools.net/
 * 
 * There is no license by now - all rights reserved. Hope we can fix this major
 * bug soon.
 ******************************************************************************/

AudioMath = new Class({
    // AudioMath provides a couple of functions for turning linear values into
    // logarithmic ones and vice versa. If you need an easy convertion between
    // dB or Hz and a linear scale implement this class.
    
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
