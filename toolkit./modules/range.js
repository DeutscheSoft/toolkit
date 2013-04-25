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

Range = new Class({
    // Ranges are classes for calculating linear scales from different values.
    // They are useful to build coordinate systems, calculating pixel positions
    // for different scale types and the like. Ranges are used e.g. in Scale,
    // MeterBase and Graph to draw elements on a certain position according to
    // a value on an arbitrary scale. Range implements AudioMath, Options and
    // Events.
    Implements: [Options, Events, Ranged],
    options: {
        scale:      _TOOLKIT_LINEAR, // What kind of value are we having?
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
        reverse:    false,           // true if the range is reversed
        basis:      0,               // Dimensions of the range, set to
                                     // width/height in pixels, if you need
                                     // it for drawing purposes, to 100 if
                                     // you need percentual values or to 1
                                     // if you just need a linear
                                     // coefficient for a e.g. logarithmic
                                     // scale.
        min:        0,               // Minimum value of the range
        max:        0,               // Maximum value of the range
        step:       0,               // Step size, needed for e.g. user
                                     // interaction
        shift_up:   4,               // Multiplier for e.g. SHIFT pressed
                                     // while stepping
        shift_down: 0.25,            // Multiplier for e.g. SHIFT + CONTROL
                                     // pressed while stepping
        snap:       0,               // Snap the value to a virtual grid
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
        round:      false            // if snap is set decide how to jump
                                     // between snaps. Setting this to true
                                     // slips to the next snap if the value
                                     // is more than on its half way to it.
                                     // Otherwise the value has to reach the
                                     // next snap until it is hold there
                                     // again.
    },
    
    initialize: function (options, hold) {
        this.setOptions(options);
        this.fireEvent("initialize", this);
        this.set("min",  this.options.min);
        this.set("max",  this.options.max);
        this.set("snap", this.options.snap);
        this.fireEvent("initialized", this);
        return this;
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "mode":
            case "min":
            case "max":
                // calculate some logarithmics to reduce overhead when used
                // on-the-fly
                switch (this.options.scale) {
                    case _TOOLKIT_FREQ:
                        this.__minlog = Math.log10(this.options.min);
                        this.__maxlog = Math.log10(this.options.max);
                        break;
                    case _TOOLKIT_DB:
                        this.__minlog = Math.log2(this.options.min);
                        this.__maxlog = Math.log2(this.options.max);
                        break;
                }
                break;
            case "snap":
                // __snapcoef is the amount of digits of snap as a power to 10.
                // this is a workaround for using modulo with decimal values.
                // it decreases the maximum usable value by this level.
                // http://stackoverflow.com/questions/3966484/floating-point-numbers-and-javascript-modulus-operator
                p = ("" + value).split(".");
                this.__snapcoef = p.length > 1 ? Math.pow(10, p[1].length) : 1;
                break;
        }
        this.fireEvent("set", [key, value, hold, this]);
        this.fireEvent("set_" + key, [value, hold, this]);
        return this;
    },
    get: function (key) {
        this.fireEvent("get", [key, this.options[key], this]);
        return this.options[key];
    }
});