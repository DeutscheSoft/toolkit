Range = new Class({
    Implements: Options,
    options: {
        min:              0,              // the minimum value
        max:              0,              // the maximum value
        scale:            "linear"        // string as identifier for preset scale or callback function
    },
    val2perc: function (val) {
        if(typeof this.options.scale == "function")
            return this.options.scale(val, this.options.min, this.options.max);
        switch (this.options.scale) {
            default:
            case "linear":
                var gw = this.options.max - this.options.min;
                var pw = (this.options.min - val) * -1;
                return (pw / gw) || 0;
        }
    }
});