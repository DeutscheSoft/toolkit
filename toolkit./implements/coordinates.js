Coordinates = new Class({
    Implements: [Options],
    options: {
        mode_x:           0,              // what kind of x are we having?
                                          // 0: pixels
                                          // 1: percentual value (between 0 and 1)
        mode_y:           0,              // what kind of y are we having?
                                          // 0: pixels
                                          // 1: percentual value (between 0 and 1)
        width:            0,              // if x is a percentual value we better should know the dimensions
        height:           0,              // if y is a percentual value we better should know the dimensions
    },
    
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
        }
        return -r + this.options.height;
    },
});
 
