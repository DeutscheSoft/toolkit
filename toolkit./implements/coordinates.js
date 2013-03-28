Coordinates = new Class({
    Implements: [Options, AudioMath],
    options: {
        mode_x:           0,              // what kind of x are we having?
                                          // 0: pixels
                                          // 1: percentual value (between 0 and 1)
                                          // 2: linear value
                                          // 3: dB values (needs min_x and max_x)
                                          // 4: frequencies (needs min_x and max_x)
        mode_y:           0,              // what kind of y are we having?
                                          // 0: pixels
                                          // 1: percentual value (between 0 and 1)
                                          // 2: linear value
                                          // 3: dB values (needs min_x and max_x)
                                          // 4: frequencies (needs min_x and max_x)
        mode_z:           0,              // what kind of z are we having?
                                          // 0: pixels
                                          // 1: percentual value (between 0 and 1)
                                          // 2: linear value
                                          // 3: dB values (needs min_x and max_x)
                                          // 4: frequencies (needs min_x and max_x)
        width:            0,              // if x is a percentual value we better should know the real dimensions
        height:           0,              // if y is a percentual value we better should know the real dimensions
        depth:            0,              // if z is a percentual value we better should know the real dimensions
        min_x:            0,              // if mode_x is 2 or 3 or 4 we need to know about the range we see
        max_x:            0,              // if mode_x is 2 or 3 or 4 we need to know about the range we see
        min_y:            0,              // if mode_y is 2 or 3 or 4 we need to know about the range we see
        max_y:            0,              // if mode_y is 2 or 3 or 4 we need to know about the range we see
        min_z:            0,              // if mode_z is 2 or 3 or 4 we need to know about the range we see
        max_z:            0               // if mode_z is 2 or 3 or 4 we need to know about the range we see
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
        return this.val2px(x, this.options.mode_x, this.options.min_x, this.options.max_x, this.options.width);
    },
    y2px: function (y) {
        return this.val2px(y, this.options.mode_y, this.options.min_y, this.options.max_y, this.options.height) * -1 + this.options.height;
    },
    z2px: function (z) {
        return this.val2px(z, this.options.mode_z, this.options.min_z, this.options.max_z, this.options.depth);
    },
    val2px: function (value, mode, min, max, size) {
        console.log(value, mode, min, max, size);
        switch(mode) {
            case 0:
            default:
                // value are ready-to-use pixels
                return value;
            case 1:
                // value is a percentual value
                return size * value;
            case 2:
                // value is a linear value
                var gw = max - min;
                var pw = (min - value) * -1;
                return ((pw / gw) || 0) * size;
                
                return ((((min - value) * -1) / (max - min)) || 0) * size;
            case 3:
                // value is a db value
                return this.db2px(value, min, max, size);
            case 4:
                // value is a frequency
                return this.freq2px(value, min, max, size);
        }
    },
    // GETTER & SETTER
    set: function (key, value, hold) {
        switch(key) {
            case "mode_x":
            case "mode_y":
            case "min_x":
            case "max_x":
            case "min_y":
            case "max_y":
            case "min_z":
            case "max_z":
                if(this.options.mode_x == 4) {
                    // precalc x values for freq
                    this._min_x = this.log10(this.options.min_x);
                    this._max_x = this.log10(this.options.max_x);
                } else if(this.options.mode_x == 3) {
                    // precalc x values for db
                    this._min_x = this.log2(this.options.min_x);
                    this._max_x = this.log2(this.options.max_x);
                }
                if(this.options.mode_y == 4) {
                    // precalc y values for freq
                    this._min_y = this.log10(this.options.min_y);
                    this._max_y = this.log10(this.options.max_y);
                } else if(this.options.mode_y == 3) {
                    // precalc y values for db
                    this._min_y = this.log2(this.options.min_y);
                    this._max_y = this.log2(this.options.max_y);
                }
                if(this.options.mode_z == 4) {
                    // precalc y values for freq
                    this._min_z = this.log10(this.options.min_z);
                    this._max_z = this.log10(this.options.max_z);
                } else if(this.options.mode_z == 3) {
                    // precalc y values for db
                    this._min_z = this.log2(this.options.min_z);
                    this._max_z = this.log2(this.options.max_z);
                }
                break;
        }
    }
});
 
