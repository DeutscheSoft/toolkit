Coordinates = new Class({
    Implements: [Options, AudioMath],
    options: {
        mode_x:           _TOOLKIT_PIXEL, // what kind of x are we having? _TOOLKIT_[PIXEL, PERCENT, FLAT, DECIBEL, FREQUENCY]
        mode_y:           _TOOLKIT_PIXEL, // what kind of y are we having? _TOOLKIT_[PIXEL, PERCENT, FLAT, DECIBEL, FREQUENCY]
        mode_z:           _TOOLKIT_PIXEL, // what kind of z are we having? _TOOLKIT_[PIXEL, PERCENT, FLAT, DECIBEL, FREQUENCY]
        width:            0,              // if x is not in pixel we better should know the real dimensions
        height:           0,              // if y is not in pixel value we better should know the real dimensions
        depth:            0,              // if z is not in pixel value we better should know the real dimensions
        min_x:            0,              // if mode_x not in pixel we need to know about the range we see
        max_x:            0,              // if mode_x not in pixel we need to know about the range we see
        min_y:            0,              // if mode_y not in pixel we need to know about the range we see
        max_y:            0,              // if mode_y not in pixel we need to know about the range we see
        min_z:            0,              // if mode_z not in pixel we need to know about the range we see
        max_z:            0               // if mode_z not in pixel we need to know about the range we see
    },
    _min_x: 0,
    _max_x: 0,
    _min_y: 0,
    _max_y: 0,
    _min_z: 0,
    _max_z: 0,
    
    initialize: function (options, hold) {
        this.set("min_x", this.options.min_x, true);
        this.set("min_y", this.options.min_y, true);
        this.set("min_z", this.options.min_z, true);
        this.set("max_x", this.options.max_x, true);
        this.set("max_y", this.options.max_y, true);
        this.set("max_z", this.options.max_z, true);
        this.setOptions(options);
    },
    
    // HELPERS & STUFF
    x2px: function (x) {
        return this._val2px(x,
                            this.options.mode_x,
                            this.options.min_x,
                            this.options.max_x,
                            this._min_x,
                            this._max_x,
                            this.options.width);
    },
    y2px: function (y) {
        return this._val2px(y,
                            this.options.mode_y,
                            this.options.min_y,
                            this.options.max_y,
                            this._min_y,
                            this._max_y,
                            this.options.height) * -1 + this.options.height;
    },
    z2px: function (z) {
        return this._val2px(z,
                            this.options.mode_z,
                            this.options.min_z,
                            this.options.max_z,
                            this._min_z,
                            this._max_z,
                            this.options.depth);
    },
    px2x: function (x) {
        return this._px2val(x,
                            this.options.mode_x,
                            this.options.min_x,
                            this.options.max_x,
                            this._min_x,
                            this._max_x,
                            this.options.width);
    },
    px2y: function (y) {
        return this._px2val(y,
                            this.options.mode_y,
                            this.options.min_y,
                            this.options.max_y,
                            this._min_y,
                            this._max_y,
                            this.options.height) * -1 + this.options.max_y + this.options.min_y;
    },
    px2z: function (z) {
        return this._px2val(z,
                            this.options.mode_z,
                            this.options.min_z,
                            this.options.max_z,
                            this._min_z,
                            this._max_z,
                            this.options.depth);
    },
    _val2px: function (value, mode, min, max, minlog, maxlog, size) {
        switch(mode) {
            case _TOOLKIT_PX:
            default:
                // value are ready-to-use pixels
                return value;
            case _TOOLKIT_PERC:
                // value is a percentual value
                return size * value;
            case _TOOLKIT_FLAT:
                // value is a linear value
                return ((((min - value) * -1) / (max - min)) || 0) * size;
            case _TOOLKIT_DB:
                // value is a db value
                return this.db2px(value, minlog, maxlog, size);
            case _TOOLKIT_FREQ:
                // value is a frequency
                return this.freq2px(value, minlog, maxlog, size);
        }
    },
    _px2val: function (value, mode, min, max, minlog, maxlog, size) {
        switch(mode) {
            case _TOOLKIT_PX:
            default:
                // value are ready-to-use pixels
                return value;
            case _TOOLKIT_PERC:
                // value is a percentual value
                return value / size;
            case _TOOLKIT_FLAT:
                // value is a linear value
                return (value / size) * (max - min) + min
            case _TOOLKIT_DB:
                // value is a db value
                return this.px2db(value, minlog, maxlog, size);
            case _TOOLKIT_FREQ:
                // value is a frequency
                return this.px2freq(value, minlog, maxlog, size);
        }
    },
    // GETTER & SETTER
    set: function (key, value, hold) {
        switch(key) {
            case "mode_x":
            case "mode_y":
            case "mode_z":
            case "min_x":
            case "max_x":
            case "min_y":
            case "max_y":
            case "min_z":
            case "max_z":
                if(this.options.mode_x == _TOOLKIT_FREQ) {
                    // precalc x values for freq
                    this._min_x = this.log10(this.options.min_x);
                    this._max_x = this.log10(this.options.max_x);
                } else if(this.options.mode_x == _TOOLKIT_DB) {
                    // precalc x values for db
                    this._min_x = this.log2(this.options.min_x);
                    this._max_x = this.log2(this.options.max_x);
                }
                if(this.options.mode_y == _TOOLKIT_FREQ) {
                    // precalc y values for freq
                    this._min_y = this.log10(this.options.min_y);
                    this._max_y = this.log10(this.options.max_y);
                } else if(this.options.mode_y == _TOOLKIT_DB) {
                    // precalc y values for db
                    this._min_y = this.log2(this.options.min_y);
                    this._max_y = this.log2(this.options.max_y);
                }
                if(this.options.mode_z == _TOOLKIT_FREQ) {
                    // precalc y values for freq
                    this._min_z = this.log10(this.options.min_z);
                    this._max_z = this.log10(this.options.max_z);
                } else if(this.options.mode_z == _TOOLKIT_DB) {
                    // precalc y values for db
                    this._min_z = this.log2(this.options.min_z);
                    this._max_z = this.log2(this.options.max_z);
                }
                break;
        }
    }
});
 
