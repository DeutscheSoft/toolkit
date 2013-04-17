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
 * There is no license by now - all rights reserved. Hope we can fix this major
 * bug soon.
 ******************************************************************************/

Range = new Class({
    // Ranges are classes for calculating linear scales from different values.
    // They are useful to build coordinate systems, calculating pixel positions
    // for different scale types and the like.
    
    Implements: [Options, AudioMath],
    options: {
        scale:          _TOOLKIT_LINEAR, // What kind of value are we having? _TOOLKIT_[LINEAR | DECIBEL | FREQUENCY | LOG2 | LOG10]
                                         // If a function instead of a constant is handed over, it is used for calculations:
                                         // function (value, options, coef) {}
                                         // The function receives the actual options object as the second argument and is supposed to
                                         // return a coefficient between 0 and 1. If the third argument "coef" is true, it is supposed to
                                         // return a value depending on a coefficient handed over as the first argument.
        reverse:        false,           // true if the range is reversed
        base:           0,               // Dimensions of the range, set to width/height in pixels, if you need it for drawing purposes
                                         // or to 100 if you need percentual values or to 1 if you just need a linear
                                         // coefficient for a e.g. logarithmic scale.
        min:            0,               // Minimum value of the range
        max:            0,               // Maximum value of the range
        step:           0,               // Step size, needed for e.g. user interaction
        shift_up:       4,               // Multiplier for e.g. SHIFT pressed while stepping
        shift_down:     0.25,            // Multiplier for e.g. SHIFT + CONTROL pressed while stepping
        snap:           0,               // Snap the value to a virtual grid with this distance
                                         // Using snap option with values below 1 causes the range to reduce its
                                         // minimum and maximum values depending on the amount of decimal digits
                                         // because of the implementation of math in JavaScript.
                                         // Using a step size of e.g. 1.125 reduces the maximum usable value from
                                         // 9,007,199,254,740,992 to 9,007,199,254,740.992 (note the decimal point)
        round:          false            // if snap is set decide how to jump between snaps. Setting this to true
                                         // slips to the next snap if the value is more than on its half way to it.
                                         // Otherwise the value has to reach the next snap until it is hold there again.
    },
    _minlog: 0,
    _maxlog: 0,
    _snapcoef: 1,
    
    initialize: function (options, hold) {
        this.setOptions(options);
        this.set("min", this.options.min);
        this.set("max", this.options.max);
        this.set("snap", this.options.snap);
    },
    
    val2base: function (n) {
        // calculates "real world" values (positions, coefficients, ...) depending on options.base
        return this.val2based(n, this.options.base);
    },
    base2val: function (n) {
        // returns a point on the scale for the "real world" value (positions, coefficients, ...) based on options.base
        return this.based2val(n, this.options.base);
    },
    val2px: function (n) {
        // just a wrapper for having understandable code and backward compatibility
        return this.val2based(n, this.options.base);
    },
    px2val: function (n) {
        // just a wrapper for having understandable code and backward compatibility
        return this.based2val(n, this.options.base);
    },
    val2coef: function (n) {
        // calculates a coefficient for the value
        return this.val2based(n, 1);
    },
    coef2val: function (n) {
        // calculates a value from a coefficient
        return this.based2val(n, 1);
    },
    val2perc: function (n) {
        // calculates percents on the scale from a value
        return this.val2based(n, 100);
    },
    perc2val: function (n) {
        // calculates a value from percents of the scale
        return this.based2val(n, 100);
    },
    val2based: function (value, base) {
        // takes a value and returns the corresponding point on the scale according to base
        base = base || 1;
        value = this.snap_value(value);
        var coef = 0;
        if(typeof this.options.scale == "function")
            coef = this.options.scale(value, this.options, false) * base;
        switch(this.options.scale) {
            default:
            case _TOOLKIT_LINEAR:
                coef = ((((this.options.min - value) * -1) / (this.options.max - this.options.min)) || 0) * base;
            case _TOOLKIT_DB:
                coef = this.db2scale(value, this._minlog, this._maxlog, base);
            case _TOOLKIT_FREQ:
                coef = this.freq2scale(value, this._minlog, this._maxlog, base);
        }
        if(this.options.reverse) coef = -coef + base;
        return coef;
    },
    based2val: function (coef, base) {
        // takes a point on the scale according to base and returns the corresponding value
        base = base || 1;
        var value = 0;
        if(this.options.reverse) coef = -coef + base;
        if(typeof this.options.scale == "function")
            value = this.options.scale(coef, this.options, true);
        switch(this.options.scale) {
            default:
            case _TOOLKIT_LINEAR:
                value = (coef / base) * (this.options.max - this.options.min) + this.options.min
            case _TOOLKIT_DB:
                value = this.scale2db(coef, this._minlog, this._maxlog, base);
            case _TOOLKIT_FREQ:
                value = this.scale2freq(coef, this._minlog, this._maxlog, base);
        }
        return this.snap_value(value);
    },
    snap_value: function (value) {
        // if snapping is enabled, snaps the value to the grid
        if(!this.options.snap) return value;
        var scoef = this._snapcoef;
        var snap  = this.options.snap;
        var m = ((value * scoef) % (snap * scoef)) / scoef;
        return value + (this.options.round && (m > snap / 2.0) ? snap - m : -m);
    },
    
    // GETTER & SETTER
    set: function (key, value) {
        this.options[key] = value;
        switch(key) {
            case "mode":
            case "min":
            case "max":
                // calculate some logarithmics to reduce overhead when used
                // on-the-fly
                switch(this.options.scale) {
                    case _TOOLKIT_FREQ:
                        this._minlog = Math.log10(this.options.min);
                        this._maxlog = Math.log10(this.options.max);
                        break;
                    case _TOOLKIT_DB:
                        this._minlog = Math.log2(this.options.min);
                        this._maxlog = Math.log2(this.options.max);
                }
                break;
            case "snap":
                // _snapcoef is the amount of digits of snap as a power to 10.
                // this is a workaround for using modulo with decimal values.
                // it decreases the maximum usable value by this level.
                // http://stackoverflow.com/questions/3966484/floating-point-numbers-and-javascript-modulus-operator
                p = ("" + value).split(".");
                this._snapcoef = p.length > 1 ? Math.pow(10, p[1].length) : 1;
                break;
        }
    },
    get: function (key) {
        return this.options[key];
    }
});