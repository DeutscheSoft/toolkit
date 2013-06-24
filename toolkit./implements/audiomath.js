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
        min   = this.__log2(min);
        max   = this.__log2(max);
        return ((Math.log2(value) - min) / (max - min));
    },
    coef2db: function (coef, min, max) {
        // coef: coefficient
        // min: minimum dB
        // max: maximum dB
        min   = this.__log2(min);
        max   = this.__log2(max);
        return Math.pow(2, (coef / (max - min) + min));
    },
    db2scale: function (value, min, max, scale) {
        // value: dB as float (1 = 0dB)
        // min: minimum dB
        // max: maximum dB
        // scale: the size of the scale
        min   = this.__log2(min);
        max   = this.__log2(max);
        return ((Math.log2(value) - min) / (max - min)) * scale;
    },
    scale2db: function (value, min, max, scale) {
        // value: position in the scale
        // min: minimum dB
        // max: maximum dB
        // scale: the size of the scale
        min   = this.__log2(min);
        max   = this.__log2(max);
        return Math.pow(2, (value / scale * (max - min) + min));
    },
    // FREQUENCY CALCULATIONS
    freq2coef: function (value, min, max) {
        // value: frequency as float
        // min: minimum freq
        // max: maximum freq
        min   = this.__log10(min);
        max   = this.__log10(max);
        return ((Math.log10(value) - min) / (max - min));
    },
    coef2freq: function (coef, min, max) {
        // coef: coefficient
        // min: minimum freq
        // max: maximum freq
        min   = this.__log10(min);
        max   = this.__log10(max);
        return Math.pow(10, (coef / (max - min) + min));
    },
    freq2scale: function (value, min, max, scale) {
        // value: freq as float
        // min: minimum freq
        // max: maximum freq
        // scale: the size of the scale
        min   = this.__log10(min);
        max   = this.__log10(max);
        return ((Math.log10(value) - min) / (max - min)) * scale;
    },
    scale2freq: function (value, min, max, scale) {
        // value: position in the scale
        // min: minimum freq
        // max: maximum freq
        // scale: the size of the scale
        min   = this.__log10(min);
        max   = this.__log10(max);
        return Math.pow(10, (value / scale * (max - min) + min));
    },
    
    // HELPERS & STUFF
    ___log2:  {}, // lookup table for log2 values
    ___log10: {}, // lookup table for log10 values
    
    __log2: function (value) {
        // store value in lookup table
        if (typeof this.___log2["" + value] == "undefined")
            this.___log2["" + value] = Math.log2(value);
        // return from lookup table
        return this.___log2["" + value];
    },
    __log10: function (value) {
        // store value in lookup table
        if (typeof this.___log10["" + value] == "undefined")
            this.___log10["" + value] = Math.log10(value);
        // return from lookup table
        return this.___log10["" + value];
    }
});
