Scale = new Class({
    Implements: [Options, Events, Range],
    options: {
        "class":          "",
        id:               "",
        container:        false,          // a container to use as the base object
        layout:           1,              // how to draw the scale:
                                          // 1: vertical, labels on the left
                                          // 2: vertical, labels on the right,
                                          // 3: horizontal, labels on top
                                          // 4: horizontal, labels on bottom
        division:         1,              // minimum step size
        levels:           [1],            // array of steps where to draw labels and marker
        base:             false,              // base where dots and labels are drawn from
        labels:           function (val) { return sprintf("%0.2f",  val); },
        gap_dots:         4,              // minimum gap between dots (pixel)
        gap_labels:       40,             // minimum gap between labels (pixel)
        show_labels:      true,           // if labels should be drawn
        size:             0,              // the maximum height in pixels
        reverse:          false           // if the scale is reversed
    },
    __size: 0,
    
    initialize: function (options, hold) {
        this.setOptions(options);
        if(!this.options.id) this.options.id = String.uniqueID();
        this.element = new Element("div.scale", {
            "id":    this.options.id
        });
        switch(this.options.layout) {
            case 1:
                this.element.addClass("vertical left");
                break;
            case 2:
                this.element.addClass("vertical right");
                break;
            case 3:
                this.element.addClass("horizontal top");
                break;
            case 4:
                this.element.addClass("horizontal bottom");
                break;
        }
        //if(this.element.getStyle("position") != "absolute" && this.element.getStyle("position") != "relative")
        this.element.setStyle("position", "relative");
        
        if(this.options.container) this.set("container", this.options.container);
        if(this.options["class"]) this.set("class", this.options["class"]);
                  
        if(!hold)
            this.redraw();
    },
    
    redraw: function () {
        this.__size = 0;
        if(this.options.base === false)
            this.options.base = this.options.max
        this.element.empty();
        
        // draw base
        this.draw_dot(this.options.base, "base");
        this.draw_label(this.options.base, "base");
        
        // draw top
        if(this.val2px(this.options.base - this.options.min) >= this.options.gap_labels) {
            this.draw_dot(this.options.min, "min");
            this.draw_label(this.options.min, "min");
        }
        
        // draw bottom
        if(this.val2px(this.options.max - this.options.base) >= this.options.gap_labels) {
            this.draw_dot(this.options.max, "max");
            this.draw_label(this.options.max, "max");
        }
        
        var level;
        
        // draw beneath base
        var iter = this.options.base;
        this.__last = iter;
        while(iter > this.options.min) {
            iter -= this.options.division;
            if(level = this.check_label(iter, this.options.division)) {
                this.check_dots(this.__last, iter, -this.options.division, level, function(a, b){return a > b});
                this.__last = iter;
            }
        }
        // draw dots between last label and min
        this.check_dots(this.__last, iter, -this.options.division, this.options.levels.length - 1, function(a, b){return a > b});
        
        // draw above base
        var iter = this.options.base;
        this.__last = iter;
        while(iter < this.options.max) {
            iter += this.options.division;
            if(level = this.check_label(iter, this.options.division)) {
                this.check_dots(this.__last, iter, this.options.division, level, function(a, b){return a < b});
                this.__last = iter;
            }
        }
    },
    destroy: function () {
        this.element.empty();
        this.element.destroy();
    },
    check_label: function (iter, step) {
        for(var i = this.options.levels.length - 1; i >= 0; i--) {
            var level = this.options.levels[i];
            var diff = Math.abs(this.options.base - iter);
            if(!(diff % level)
            && (level >= Math.abs(this.__last - iter) || i == this.options.levels.length - 1)
            && this.val2px(Math.abs(this.__last - iter) + this.options.min) >= this.options.gap_labels
            && this.val2px(iter) >= this.options.gap_labels) {
                if(iter > this.options.min && iter < this.options.max) {
                    this.draw_label(iter);
                    this.draw_dot(iter, "marker");
                }
                return i;
            }
        }
        return false;
    },
    check_dots: function (start, stop, step, level, comp) {
        var iter = start;
        while(comp(iter, stop - step)) {
            iter += step;
            for(var i = level - 1; i >= 0; i--) {
                var l = this.options.levels[i];
                var diff = Math.abs(start - iter);
                if(!(diff % l)
                && this.val2px(Math.abs(start - iter) + this.options.min) >= this.options.gap_dots
                && this.val2px(iter) >= this.options.gap_dots) {
                    this.draw_dot(iter);
                    start = iter;
                }
            }
        }
    },
    draw_dot: function (val, cls) {
        var l = this.options.layout;
        var r = this.options.reverse;
        
        // create dot element
        var d = new Element("div.dot", { style: "position: absolute" });
        if(cls) d.addClass(cls);
        d.inject(this.element);
        
        // position dot element
        var styles = { }
        var pos = Math.round(r ? (l < 3 ? this.val2px(val) : this.options.size - this.val2px(val)) : (l < 3 ? this.options.size - this.val2px(val) : this.val2px(val)));
        pos = Math.min(Math.max(0, pos), this.options.size - 1);
        styles[l < 3 ? "top" : "left"] = pos;
        d.setStyles(styles);
    },
    draw_label: function (val, cls) {
        if(!this.options.show_labels) return;
        
        var l = this.options.layout;
        var r = this.options.reverse;
        
        // create label element
        var label = new Element("span.label", { html: this.options.labels(val), style: "position: absolute; display: block; float: left" });
        if(cls) label.addClass(cls);
        label.inject(this.element);
        
        // position label element
        var styles = { }
        var pos = Math.round(r ? (l < 3 ? this.val2px(val) : this.options.size - this.val2px(val)) : (l < 3 ? this.options.size - this.val2px(val) : this.val2px(val)));
        var size = label[l < 3 ? "outerHeight" : "outerWidth"]();
        
        pos = Math.min(Math.max(0, pos - size / 2), this.options.size - size);
        styles[l < 3 ? "top" : "left"] = pos;
        label.setStyles(styles);
        
        // resize the main element if labels are wider
        // because absolute positioning destroys dimensions
        var s = label[l < 3 ? "outerWidth" : "outerHeight"]();
        if(s > this.__size) {
            this.__size = s;
            this.element[l < 3 ? "outerWidth" : "outerHeight"](s);
        }
    },
    
    // HELPERS & STUFF
    val2px: function (val) {
        return this.options.size * this.val2perc(val);
    },
    px2val: function (px) {
        return (parseFloat(px) / parseFloat(this.options.size)) * (this.options.max - this.options.min) + this.options.min;
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch(key) {
            case "division":
            case "levels":
            case "base":
            case "labels":
            case "gap_dots":
            case "gap_labels":
            case "size":
            case "reverse":
            case "min":
            case "max":
            case "scale":
            case "show_labels":
                if(!hold) this.redraw();
                break;
            case "container":
                if(!hold) this.element.inject(this.options.container);
                break;
        }
    },
    get: function (key) {
        if(typeof this.options[key] != "undefined")
            return this.options[key];
    }
});
