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
    db2coef: function (value, min, max) {
        // value: dB as float (1 = 0dB)
        // min: minimum dB
        // max: maximum dB
        return Math.log2(1 + (value - min) / (max - min));
    },
    coef2db: function (coef, min, max) {
        // coef: coefficient
        // min: minimum dB
        // max: maximum dB
        return (Math.pow(2, coef) - 1) * (max - min) + min;
    },
    db2scale: function (value, min, max, scale) {
        // value: dB as float (1 = 0dB)
        // min: minimum dB
        // max: maximum dB
        // scale: the size of the scale
        return this.db2coef(value, min, max) * scale;
    },
    scale2db: function (value, min, max, scale) {
        // value: position in the scale
        // min: minimum dB
        // max: maximum dB
        // scale: the size of the scale
        return this.coef2db(value / scale, min, max);
    },
    // FREQUENCY CALCULATIONS
    freq2coef: function (value, min, max) {
        // value: frequency as float
        // min: minimum freq
        // max: maximum freq
        min   = Math.log10(min);
        max   = Math.log10(max);
        return ((Math.log10(value) - min) / (max - min));
    },
    coef2freq: function (coef, min, max) {
        // coef: coefficient
        // min: minimum freq
        // max: maximum freq
        min   = Math.log10(min);
        max   = Math.log10(max);
        return Math.pow(10, (coef * (max - min) + min));
    },
    freq2scale: function (value, min, max, scale) {
        // value: dB as float (1 = 0dB)
        // min: minimum Frequency
        // max: maximum Frequency
        // scale: the size of the scale
        return this.freq2coef(value, min, max) * scale;
    },
    scale2freq: function (value, min, max, scale) {
        // value: position in the scale
        // min: minimum Frequency
        // max: maximum Frequency
        // scale: the size of the scale
        return this.coef2freq(value / scale, min, max);
    }
});
