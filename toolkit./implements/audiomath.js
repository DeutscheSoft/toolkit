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
        // min: minimum dB already sent through log2
        // max: maximum dB already sent through log2
        return ((Math.log2(value) - min) / (max - min));
    },
    coef2db: function (coef, min, max) {
        // coef: coefficient
        // min: minimum dB already sent through log2
        // max: maximum dB already sent through log2
        return Math.pow(2, (coef / (max - min) + min));
    },
    db2scale: function (value, min, max, scale) {
        // value: dB as float (1 = 0dB)
        // min: minimum dB already sent through log2
        // max: maximum dB already sent through log2
        // scale: the size of the scale
        return ((Math.log2(value) - min) / (max - min)) * scale;
    },
    scale2db: function (value, min, max, scale) {
        // value: position in the scale
        // min: minimum dB already sent through log2
        // max: maximum dB already sent through log2
        // scale: the size of the scale
        return Math.pow(2, (value / scale * (max - min) + min));
    },
    // FREQUENCY CALCULATIONS
    freq2coef: function (value, min, max) {
        // value: frequency as float
        // min: minimum freq already sent through log10
        // max: maximum freq already sent through log10
        return ((Math.log10(value) - min) / (max - min));
    },
    coef2freq: function (coef, min, max) {
        // coef: coefficient
        // min: minimum freq already sent through log10
        // max: maximum freq already sent through log10
        return Math.pow(10, (coef / (max - min) + min));
    },
    freq2scale: function (value, min, max, scale) {
        // value: freq as float
        // min: minimum freq already sent through log10
        // max: maximum freq already sent through log10
        // scale: the size of the scale
        return ((Math.log10(value) - min) / (max - min)) * scale;
    },
    scale2freq: function (value, min, max, scale) {
        // value: position in the scale
        // min: minimum freq already sent through log10
        // max: maximum freq already sent through log10
        // scale: the size of the scale
        return Math.pow(10, (value / scale * (max - min) + min));
    },
});
