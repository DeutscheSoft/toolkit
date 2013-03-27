var Graph = new Class({
    Extends: Coordinates,
    Implements: [Events, Options],
    options: {
        "class":          "",
        id:               "",
        container: false, // a container (SVG container) to append the path element to
        dots:      [],    // can be ready-to-use string or array of objects {x: x, y: y [, x1, y1, x2, y2]}
        type:      "L",   // type of the graph (needed values in the dots object):
                          //     L = normal (needs x,y)
                          //     T = smooth quadratic Bézier (needs x, y)
                          //     H[n] = smooth horizontal; [n] = smoothing factor between 1 (square) and 5 (nearly no smooth)
                          //     Q = quadratic Bézier (needs: x1, y1, x, y)
                          //     C = CurveTo (needs: x1, y1, x2, y2, x, y)
                          //     S = SmoothCurve (needs: x1, y1, x, y)
        mode:      0,     // mode of the graph:
                          //     0: line
                          //     1: filled below the line
                          //     2: filled above the line
                          //     3: filled from the middle of the canvas
                          //     0.n: filled from a percentual position on the canvas
        color:     ""     // set the color of the path
    },
    _add: ".5",
    initialize: function (options) {
        this.setOptions(options);
        this.parent(options);
        // firefox? don't add pixels!
        if (Browser.firefox)
            this._add = "";
        
        this.element = makeSVG("path");
        this.element.addClass("toolkit-graph");
        
        if(!this.options.id) this.options.id = String.uniqueID();
        this.element.set("id", this.options.id);
        
        if(this.options["class"])
            this.element.addClass(this.options["class"]);
        
        if(this.options.container)
            this.set("container", this.options.container);
        
        this.set("mode",  this.options.mode,    true);
        this.set("mode_x", this.options.mode_x, true);
        this.set("mode_y", this.options.mode_y, true);
        this.set("color",  this.options.color);
        
        if(this.options.dots.length)
            this.redraw();
    },
    
    redraw: function () {
        var a = this._add;
        var w = this.options.width;
        var h = this.options.height;
        
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
            var t = init ? this.options.type : "T";
            switch(t.substr(0,1)){
                case "L":
                case "T":
                    // line to and smooth quadric bezier
                    var _t = init ? " " + t : "M";
                    var _x = parseInt(this.x2px(d.x)) + a;
                    var _y = parseInt(this.y2px(d.y)) + a;
                    s += _t + " " + _x + " " + _y;
                    break;
                case "Q":
                case "S":
                    // cubic bezier with reflection (S)
                    // and smooth quadratic bezier with reflection of beforehand
                    var _x = parseInt(this.x2px(d.x)) + a;
                    var _y = parseInt(this.y2px(d.y)) + a;
                    var _x1 = parseInt(this.x2px(d.x1)) + a;
                    var _y1 = parseInt(this.y2px(d.y1)) + a;
                    s += " " + t + _x1 + "," + _y1 + " " + _x + "," + _y;
                    break;
                case "C":
                    // cubic bezier
                    var _x = parseInt(this.x2px(d.x)) + a;
                    var _y = parseInt(this.y2px(d.y)) + a;
                    var _x1 = parseInt(this.x2px(d.x1)) + a;
                    var _y1 = parseInt(this.y2px(d.y1)) + a;
                    var _x2 = parseInt(this.x2px(d.x2)) + a;
                    var _y2 = parseInt(this.y2px(d.y2)) + a;
                    s += " C" + _x1 + "," + _y1 + " " + _x2 + "," + _y2 + " " + _x + "," + _y;
                    break;
                case "H":
                    var f = t.substr(1) ? parseFloat(t.substr(1)) : 3;
                    var _x = parseInt(this.x2px(d.x));
                    var _y = _y1 = parseInt(this.y2px(d.y)) + a;
                    if(_d && _d != (this.options.dots.length - 1)) {
                        var _q = parseInt(this.x2px(this.options.dots[_d - 1].x));
                        var _x1 =  (_x - Math.round((_x - _q) / f)) + a;
                    } else {
                        var _x1 = _x;
                    }
                    s += " S" + _x1 + "," + _y1 + " " + _x + "," + _y;
                    break;
            }
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
                s += "M " + (this.x2px(d.x) - 1) + " " + parseInt(h + 1) + a;
                s += " " + t + " " + (this.x2px(d.x) - 1) + a + " " + parseInt(this.y2px(d.y)) + a;
                return s;
            case 2:
                // fill the upper part of the graph
                s += "M " + (this.x2px(d.x) - 1) + " -1" + a;
                s += " " + t + " " + (this.x2px(d.x) - 1) + a + " " + parseInt(this.y2px(d.y)) + a;
                return s;
            case 3:
                // fill from the mid
                s += "M " + (this.x2px(d.x) - 1) + a + " " + parseInt(0.5 * h) + a;
                return s;
        }
        if(m > 0 && m < 1) {
            // fill from variable point
            s += "M " + (this.x2px(d.x) - 1) + a + " " + parseInt((-m + 1) * h) +a;
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
                return " " + t + " " + this.x2px(d.x) + a + " " + parseInt(h + 1) + a + " Z";
            case 2:
                // fill the upper part of the graph
                return " " + t + " " + (this.x2px(d.x) + 1) + a + " -1" + a + " Z";
            case 3:
                // fill from mid
                return " " + t + " " + (this.x2px(d.x) + 1) + a + " " + parseInt(0.5 * h) + a + " Z";
        }
        if(m > 0 && m < 1) {
            // fill from variable point
            return " " + t + " " + (this.x2px(d.x) + 1) + a + " " + parseInt((-m + 1) * h) + a + " Z";
        }
        return "";
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        this.parent(key, value, hold);
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
            case "mode_x":
            case "mode_y":
            case "min_x":
            case "min_y":
            case "max_x":
            case "max_y":
                if(!hold) this.redraw();
                break;
            case "mode":
                this.element.removeClass("toolkit-filled toolkit-outline");
                this.element.addClass(value <= 0 ? "toolkit-outline" : "toolkit-filled");
                if(!hold) this.redraw();
                break;
            case "dots":
                if(!hold) this.redraw();
                this.fireEvent("graphchanged");
                break;
            case "color":
                if(!hold) this.element.setStyle("stroke", value);
        }
    },
    get: function (key) {
        if(typeof this.options[key] != "undefined")
            return this.options[key];
    }
});