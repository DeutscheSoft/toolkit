var Graph = new Class({
    Implements: [Events, Options],
    options: {
        container: false, // a container (SVG container) to append the path element to
        dots:      [],    // can be ready-to-use string or array of objects {x: x, y: y [, x1, y1, x2, y2]}
        type:      "L",   // type of the graph (needed values in the dots object):
                          //     L = normal (needs x,y)
                          //     T = smooth quadratic Bézier (needs x, y)
                          //     Q = quadratic Bézier (needs: x1, y1, x, y) NOT IMPLEMENTED BY NOW!
                          //     C = CurveTo (needs: x1, y1, x2, y2, x, y) NOT IMPLEMENTED BY NOW!
                          //     S = SmoothCurve (needs: x1, y1, x, y) NOT IMPLEMENTED BY NOW!
        mode:      0,     // mode of the graph:
                          //     0: line
                          //     1: filled below the line
                          //     2: filled above the line
                          //     3: filled from the middle of the canvas
                          //     0.n: filled from a percentual position on the canvas
        mode_x:    0,     // what kind of x are we having?
                          // 0: pixels
                          // 1: percentual value (between 0 and 1)
        mode_y:    0,     // what kind of y are we having?
                          // 0: pixels
                          // 1: percentual value (between 0 and 1)
        width:     0,     // if x is a percentual value we better should know the dimensions
        height:    0,     // if y is a percentual value we better should know the dimensions
    },
    _add: ".5",
    initialize: function (options) {
        this.setOptions(options);
        
        // firefox? don't add pixels!
        if (Browser.firefox)
            this._add = "";
        
        this.element = makeSVG("path");
        this.element.addClass("graph");
        
        if(!this.options.id) this.options.id = String.uniqueID();
        this.element.set("id", this.options.id);
        
        if(this.options.class)
            this.element.addClass(this.options.class);
        
        if(this.options.container)
            this.set("container", this.options.container);
        
        this.set("mode", this.options.mode, true);
        this.set("mode_x", this.options.mode_x, true);
        this.set("mode_y", this.options.mode_y, true);
        
        if(this.options.dots.length)
            this.redraw();
    },
    
    redraw: function () {
        var a = this._add;
        var w = this.options.width;
        var h = this.options.height;
        var t = this.options.type;
        var x = this._x2px;
        var y = this._y2px;
        var s = "";
        var init;
        
        if(typeof this.options.dots[0] != "undefined") {
            var _s = this._start(this.options.dots[0])
            if(_s) {
                s += _s;
                init = true;
            }
        }
        for(var _d = 0; _d < this.options.dots.length; _d ++) {
            var d  = this.options.dots[_d];
            var _t = init ? " " + t : "M";
            var _x = parseInt(this._x2px(d.x)) + a;
            var _y = parseInt(this._y2px(d.y)) + a;
            
            s += _t + " " + _x + " " + _y;
            init = true;
        }
        if(typeof this.options.dots[this.options.dots.length - 1] != "undefined") {
            var _s = this._end(this.options.dots[this.options.dots.length - 1])
            if(_s)
                s += _s;
        }
        this.element.set("d", s);
    },
    destroy: function () {
        this.element.destroy();
    },
    
    // HELPERS & STUFF
    _start: function (d) {
        var a = this._add;
        var w = this.options.width;
        var h = this.options.height;
        var t = this.options.type;
        var m = this.options.mode;
        var s = "";
        switch(m) {
            case 1:
                // fill the lower part of the graph
                s += "M " + (this._x2px(d.x) - 1) + " " + parseInt(h + 1) + a;
                s += " " + t + " " + (this._x2px(d.x) - 1) + a + " " + parseInt(this._y2px(d.y)) + a;
                return s;
            case 2:
                // fill the upper part of the graph
                s += "M " + (this._x2px(d.x) - 1) + " -1" + a;
                s += " " + t + " " + (this._x2px(d.x) - 1) + a + " " + parseInt(this._y2px(d.y)) + a;
                return s;
            case 3:
                // fill from the mid
                s += "M " + (this._x2px(d.x) - 1) + a + " " + parseInt(0.5 * h) + a;
                return s;
        }
        if(m > 0 && m < 1) {
            // fill from variable point
            s += "M " + (this._x2px(d.x) - 1) + a + " " + parseInt((-m + 1) * h) +a;
            return s;
        }
        return false;
    },
    _end: function (d) {
        var a = this._add;
        var h = this.options.height;
        var t = this.options.type;
        var m = this.options.mode;
        switch(m) {
            case 1:
                // fill the graph below
                return " " + t + " " + this._x2px(d.x) + a + " " + parseInt(h + 1) + a + " Z";
            case 2:
                // fill the upper part of the graph
                return " " + t + " " + (this._x2px(d.x) + 1) + a + " -1" + a + " Z";
            case 3:
                // fill from mid
                return " " + t + " " + (this._x2px(d.x) + 1) + a + " " + parseInt(0.5 * h) + a + " Z";
        }
        if(m > 0 && m < 1) {
            // fill from variable point
            return " " + t + " " + (this._x2px(d.x) + 1) + a + " " + parseInt((-m + 1) * h) + a + " Z";
        }
        return "";
    },
    
    _x2px: function (x) {
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
    _y2px: function (y) {
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
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch(key) {
            case "container":
                if(!hold) this.element.inject(value);
                break;
            case "class":
                if(!hold) this.element.addClass(value);
                break;
            case "width":
            case "height":
            case "type":
            case "percent":
            case "mode_x":
            case "mode_y":
                if(!hold) this.redraw();
                break;
            case "mode":
                this.element.removeClass("filled outline");
                this.element.addClass(value <= 0 ? "outline" : "filled");
                if(!hold) this.redraw();
                break;
            case "dots":
                if(!hold) this.redraw();
                this.fireEvent("pathchanged");
                break;
        }
    },
    get: function (key) {
        if(typeof this.options[key] != "undefined")
            return this.options[key];
    },
});