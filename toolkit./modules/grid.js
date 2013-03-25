Grid = new Class({
    Implements: [Options, Events, Coordinates],
    options: {
        "class":          "",
        id:               "",
        container:        false,          // a SVG container to inject the element into
        grid_x:           [],             // array containing {pos:x[, color: "colorstring"[, class: "classname"[, label:"labeltext"]]]}
        grid_y:           [],             // array containing {pos:y[, color: "colorstring"[, class: "classname"[, label:"labeltext"]]]}
    },
    _add: ".5",
    initialize: function (options, hold) {
        this.setOptions(options);
        // firefox? don't add pixels!
        if (Browser.firefox)
            this._add = "";
        if(!this.options.id) this.options.id = String.uniqueID();
        this.element = makeSVG("g", {class: "toolkit-grid"});
        this.element.set("id", this.options.id);
        if(this.options.container)
            this.set("container", this.options.container, hold);
        if(this.options["class"])
            this.set("class", this.options["class"], hold);
        if(!hold) this.redraw();
    },
    
    redraw: function () {
        this.element.empty();
        for(var i = 0; i < this.options.grid_x.length; i++) {
            this._draw_line(this.options.grid_x[i], 0);
        }
        for(var i = 0; i < this.options.grid_y.length; i++) {
            this._draw_line(this.options.grid_y[i], 1);
        }
    },
    destroy: function () {
        this.element.destroy();
    },
    // HELPERS & STUFF
    _draw_line: function (obj, mode) {
        var m = 0;
        if(obj.label) {
            var label = makeSVG("text");
            label.set("text", obj.label);
            label.set("style", "dominant-baseline: central;");
            label.addClass("toolkit-grid-label " + (mode ? "toolkit-horizontal" : "toolkit-vertical"));
            if(obj["class"]) label.addClass(obj["class"]);
            label.inject(this.element);
            var w  = this.options.width;
            var h  = this.options.height;
            var tw = label.getBBox().width;
            var th = label.getBBox().height;
            var p  = label.getStyle("padding").split(" ");
            var pt = p[0].toInt();
            var pr = p[1].toInt();
            var pb = p[2].toInt();
            var pl = p[3].toInt();
            m      = mode ? tw + pl + pr : th + pt + pb;
            label.set("x", mode ? w - tw - pl : Math.max(pl, Math.min(w - tw - pl, this.x2px(obj.pos) - tw / 2)));
            label.set("y", mode ? Math.max(th / 2, Math.min(h - th / 2 - pt, this.y2px(obj.pos))) : h - th / 2 - pt);
        }
        var line = makeSVG("path");
        line.addClass("toolkit-grid-line " + (mode ? "toolkit-horizontal" : "toolkit-vertical"));
        if(obj["class"]) line.addClass(obj["class"]);
        if(obj.color) line.set("style", "stroke:" + obj.color);
        if(mode) {
            // line from left to right
            line.set("d", "M0 " + Math.round(this.y2px(obj.pos)) + this._add + " L"  + (this.options.width - m) + " " + Math.round(this.y2px(obj.pos)) + this._add);
        } else {
            // line from top to bottom
            line.set("d", "M" + Math.round(this.x2px(obj.pos)) + this._add + " 0 L"  + Math.round(this.x2px(obj.pos)) + this._add + " " + (this.options.height - m));
        }
        line.inject(this.element);
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch(key) {
            case "width":
            case "height":
            case "mode_x":
            case "mode_y":
            case "grid_x":
            case "grid_y":
                this.fireEvent("gridchanged");
                if(!hold) this.redraw();
                break;
            case "container":
                if(!hold) this.element.inject(value);
                break;
            case "class":
                if(!hold) this.element.addClass(value);
                break;
        }
    },
    get: function (key) {
        if(typeof this.options[key] != "undefined")
            return this.options[key];
    }
});
 
