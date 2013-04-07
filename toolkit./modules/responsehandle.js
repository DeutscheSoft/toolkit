ResponseHandle = new Class({
    Extends: Coordinates,
    Implements: [Options, Events],
    options: {
        "class":          "",
        id:               "",
        container:        false,        // a container to use as the base object
        intersect:        false,        // callback function for checking intersections: function (x1, y1, x2, y2) {}
                                        // returns a value describing the amount of intersection with other handle elements.
                                        // intersections are weighted depending on the intersecting object. E.g. SVG borders have
                                        // a very high impact while intersecting in comparison with overlapping handle objects
                                        // that have a low impact on intersection
        mode:             0,            // mode of the handle:
                                        // 0: circular handle
                                        // 1: x movement, line handle vertical
                                        // 2: y movement, line handle horizontal
                                        // 3: x movement, block lefthand
                                        // 4: x movement, block righthand
                                        // 5: y movement, block on top
                                        // 6: y movement, block on bottom
        preferations:     [3, 1, 0, 2], // 0=top, 1=right,2=bottom, 3=left; perferred position of the label (mode 0-2)
        label:            function (title, x, y, z) { return sprintf("%s\n%d Hz\n%.2f dB\nQ: %.2f", title, x, y, z); },
        x:                0,            // value for the x position depending on mode_x
        y:                0,            // value for y position depending on mode_y
        z:                0,            // value for the scale depending on mode_z
        x_min:            false,        // restrict x movement, min x value, false to disable
        x_max:            false,        // restrict x movement, max x value, false to disable
        y_min:            false,        // restrict y movement, min y value, false to disable
        y_max:            false,        // restrict y movement, max y value, false to disable
        z_min:            false,        // restrict z values, min z value, false to disable
        z_max:            false,        // restrict z values, max z value, false to disable
        min_size:         16,           // minimum size of object
        margin:           4             // margin between label and border of handle
    },
    
    x: 0,
    y: 0,
    label:  {x:0, y: 0, width: 0, height:0},
    handle: {x:0, y: 0, width: 0, height:0},
    __active: false,
    
    initialize: function (options, hold) {
        this.setOptions(options);
        this.parent(options);
        if(!this.options.id) this.options.id = String.uniqueID();
        var cls = "toolkit-response-handle ";
        switch(this.options.mode) {
            case 0: cls += "toolkit-circular";        break;
            case 1: cls += "toolkit-line-vertical";   break;
            case 2: cls += "toolkit-line-horizontal"; break;
            case 3: cls += "toolkit-block-left";      break;
            case 4: cls += "toolkit-block-right";     break;
            case 5: cls += "toolkit-block-top";       break;
            case 6: cls += "toolkit-block-bottom";    break;
        }
        this.element = makeSVG("g", {
            "id":    this.options.id,
            "class": cls
        });
        this.element.addClass(cls);
        this._label = makeSVG("text", {
            "class": "toolkit-label"
        }).inject(this.element);
        this._handle = makeSVG(this.options.mode < 3 ? "circle" : "rect", {
            "class": "toolkit-handle"
        }).inject(this.element);
        if(this.options.container) this.set("container", this.options.container, hold);
        if(this.options["class"]) this.set("class", this.options["class"], hold);
        this._handle.addEvents({
            "mousedown":  this._mousedown.bind(this),
            "mouseup":    this._mouseup.bind(this),
            "touchstart": this._mousedown.bind(this),
            "touchend":   this._mouseup.bind(this)
        });
        this._handle.onselectstart = function () { return false; };
        if(!hold) this.redraw();
    },
    
    redraw: function () {
        var x      = 0;
        var y      = 0;
        var width  = 0;
        var height = 0;
        
        // do we have to restrict movement?
        if(this.options.x_min !== false)
            this.options.x = Math.max(this.options.x_min, this.options.x);
        if(this.options.x_max !== false)
            this.options.x = Math.min(this.options.x_max, this.options.x);
        if(this.options.y_min !== false)
            this.options.y = Math.max(this.options.y_min, this.options.y);
        if(this.options.y_max !== false)
            this.options.y = Math.min(this.options.y_max, this.options.y);
        if(this.options.z_min !== false)
            this.options.z = Math.max(this.options.z_min, this.options.z);
        if(this.options.z_max !== false)
            this.options.z = Math.min(this.options.z_max, this.options.z);
        
        // calc coords for element and _handle
        switch(this.options.mode) {
            case 0:
                // circle
                x      = this.x2px(this.options.x);
                y      = this.y2px(this.options.y);
                width  = height = Math.max(this.options.min_size, this.z2px(this.options.z));
                break;
            case 1:
                // line vertical
                x      = Math.min(this.options.width - this.options.min_size, Math.max(0, this.x2px(this.options.x) - this.options.min_size / 2));
                y      = 0;
                width  = this.options.min_size;
                height = this.options.height;
                break;
            case 2:
                // line horizontal
                x      = 0;
                y      = Math.min(this.options.height - this.options.min_size, Math.max(0, this.y2px(this.options.y) - this.options.min_size / 2));
                width  = this.options.width;
                height = this.options.min_size;
                break;
            case 3:
                // rect lefthand
                x      = 0;
                y      = 0;
                width  = Math.max(this.options.min_size, this.x2px(this.options.x));
                height = this.options.height;
                break;
            case 4:
                // rect righthand
                x      = Math.max(this.options.min_size, this.x2px(this.options.x));
                y      = 0;
                width  = this.options.width - x;
                height = this.options.height;
                break;
            case 5:
                // rect top
                x      = 0;
                y      = 0;
                width  = this.options.width;
                height = Math.max(this.options.min_size, this.y2px(this.options.y));
                break;
            case 6:
                // rect bottom
                x      = 0;
                y      = Math.max(this.options.min_size, this.y2px(this.options.y));
                width  = this.options.width;
                height = this.options.height - y;
                break;
        }
        
        // set coords on element and _handle
        if(this.options.mode) {
            // rectangles
            this._handle.set({x:x,y:y,width:width, height:height});
            this.element.set({transform: "translate(0,0)"});
        } else {
            // circles
            this._handle.set("r", width / 2);
            this.element.set({transform: "translate(" + x + "," + y + ")"});
        }
        this.x = this.x2px(this.options.x);
        this.y = this.y2px(this.options.y);
        
        // set label
        this._label.empty();
        var t = this.options.label(this.options.title, this.options.x, this.options.y, this.options.z);
        var a = t.split("\n");
        for(var i = 0; i < a.length; i++) {
            var l = makeSVG("tspan").inject(this._label);
            l.set("text", a[i]);
            if(i)
                l.set({x:0, dy:"1.0em"});
        }
        this._label.set("html", t);
        switch(this.options.mode) {
            case 0:
                // circles
                this._label.set("x", width / 2 + this.options.margin);
                this._label.set("y", this._label.getSize().y / -2 + 5);
                this._label.getChildren().set("x", width / 2 + this.options.margin);
                break;
            case 1:
                // line vertical
                
                break;
            case 2:
                // line horizontal
                break;
            case 3:
                // rect lefthand
                break;
            case 4:
                // rect righthand
                break;
            case 5:
                // rect top
                break;
            case 6:
                // rect bottom
                break;
        }
    },
    destroy: function () {
        this._label.destroy();
        this._handle.destroy();
        this.element.destroy();
    },
    // HELPERS & STUFF
    _hits: function (x1, y1, x2, y2) {
        for(var i = 0; i < this.handles.length; i++) {
            
        }
    },
    
    // CALLBACKS / EVENT HANDLING
    _mousedown: function (e) {
        this.element.addClass("toolkit-active");
        this.element.getParent().getParent().addClass("toolkit-dragging");
        this.__active = true;
        this.__click = {x: e.event.offsetX, y: e.event.offsetY};
        e.event.preventDefault();
        e.stopPropagation();
        this._offsetX = e.event.offsetX - this.x;
        this._offsetY = e.event.offsetY - this.y;
        this.fireEvent("startdrag", {x: this.options.x, y:this.options.y, pos_x:this.x, pos_y:this.y});
    },
    _mouseup: function (e) {
        this.__active = false;
        this.element.removeClass("toolkit-active");
        this.element.getParent().getParent().removeClass("toolkit-dragging");
        e.event.preventDefault();
        e.stopPropagation();
        this.fireEvent("stopdrag", {x: this.options.x, y:this.options.y, pos_x:this.x, pos_y:this.y});
    },
    _mousemove: function (e) {
        if(!this.__active) return;
        this.set("x", this.px2x(e.event.offsetX - this._offsetX))
        this.set("y", this.px2y(e.event.offsetY - this._offsetY))
        e.event.preventDefault();
        e.stopPropagation();
        this.fireEvent("dragging", {x: this.options.x, y:this.options.y, pos_x:this.x, pos_y:this.y});
        this._label.getChildren()[3].set("text", e.event.offsetX + "-" + e.event.offsetY);
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.parent(key, value, hold);
        this.options[key] = value;
        switch(key) {
            default:
                if(!hold) this.redraw();
                break;
            case "container":
                if(!hold) this.element.inject(value, "top");
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
 
