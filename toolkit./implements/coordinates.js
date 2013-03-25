Coordinates = new Class({
    Implements: [Options],
    options: {
        mode_x:           0,              // what kind of x are we having?
                                          // 0: pixels
                                          // 1: percentual value (between 0 and 1)
                                          // 2: dB values (needs min_x and max_x)
                                          // 3: frequencies (needs min_x and max_x)
        mode_y:           0,              // what kind of y are we having?
                                          // 0: pixels
                                          // 1: percentual value (between 0 and 1)
                                          // 2: dB values (needs min_x and max_x)
                                          // 3: frequencies (needs min_x and max_x)
        width:            0,              // if x is a percentual value we better should know the real dimensions
        height:           0,              // if y is a percentual value we better should know the real dimensions
        min_x:            0,              // if mode_x is 2 or 3 or 4 we need to know about the range we see
        max_x:            0,              // if mode_x is 2 or 3 or 4 we need to know about the range we see
        min_y:            0,              // if mode_y is 2 or 3 or 4 we need to know about the range we see
        max_y:            0               // if mode_y is 2 or 3 or 4 we need to know about the range we see
    },
    _min_x: 0,
    _max_x: 0,
    _min_y: 0,
    _max_y: 0,
    
    initialize: function (options, hold) {
        this.setOptions(options);
    },
    
    // HELPERS & STUFF
    x2px: function (x) {
        switch(this.options.mode_x) {
            case 0:
            default:
                // x are ready-to-use pixels
                return x;
            case 1:
                // x is a percentual value
                return this.options.width * x;
            case 2:
                // x is a flat value
                
            case 3:
                // x is a dB value
                return db2px(x, this._min_x, this._max_x, this.options.width);
            case 4:
                // x is a frequency
                return freq2px(x, this._min_x, this._max_x, this.options.width);
        }
    },
    y2px: function (y) {
        var r = 0;
        switch(this.options.mode_y) {
            case 0:
            default:
                // y are ready-to-use pixels
                r = y;
                break;
            case 1:
                // y is a percentual value
                r = this.options.height * y;
                break;
            case 2:
                // y is a dB value
                r = db2px(y, this._min_y, this._max_y, this.options.height);
                break;
            case 3:
                // y is a frequency
                r = freq2px(y, this._min_y, this._max_y, this.options.height);
                break;
        }
        return -r + this.options.height;
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.parent(key, value, hold);
        switch(key) {
            case "mode_x":
            case "mode_y":
            case "min_x":
            case "max_x":
            case "min_y":
            case "max_y":
                if(this.options.mode_x == 2) {
                    // precalc x values
                    this._min_x = log10(this.options.min_x);
                    this._max_x = log10(this.options.max_x);
                } else if(this.options.mode_x == 3) {
                    // precalc x values
                    this._min_x = log2(this.options.min_x);
                    this._max_x = log2(this.options.max_x);
                }
                if(this.options.mode_y == 2) {
                    // precalc y values
                    this._min_y = log10(this.options.min_y);
                    this._max_y = log10(this.options.max_y);
                } else if(this.options.mode_y == 3) {
                    // precalc y values
                    this._min_y = log2(this.options.min_y);
                    this._max_y = log2(this.options.max_y);
                }
                if(!hold) this.redraw();
                break;
        }
    },
});
 
