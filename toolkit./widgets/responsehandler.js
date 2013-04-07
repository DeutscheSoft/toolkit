var ResponseHandler = new Class({
    Extends: FrequencyResponse,
    options: {
        mode_z: _TOOLKIT_FLAT,
        importance_label:  4,   // multiplicator of square pixels on hit testing labels to gain importance
        importance_handle: 1,   // multiplicator of square pixels on hit testing handles to gain importance
        importance_border: 100, // multiplicator of square pixels on hit testing borders to gain importance
    },
    handles: [],
    
    initialize: function (options) {
        this.setOptions(options);
        this.parent(options);
        this.element.addClass("toolkit-response-handler");
        this._handles = makeSVG("g", {"class": "toolkit-response-handles"}).inject(this.element);
        this.element.onselectstart = function () { return false; };
        this.redraw();
    },
    
    redraw: function (graphs, grid) {
        this.parent(graphs, grid);
    },
    
    add_handle: function (options, g) {
        options["container"] = this._handles;
        if(typeof options["min_x"] == "undefined")
            options["min_x"] = this.options.min_x;
        if(typeof options["min_y"] == "undefined")
            options["min_y"] = this.options.min_y;
        if(typeof options["min_z"] == "undefined")
            options["min_z"] = this.options.min_z;
        if(typeof options["max_x"] == "undefined")
            options["max_x"] = this.options.max_x;
        if(typeof options["max_y"] == "undefined")
            options["max_y"] = this.options.max_y;
        if(typeof options["max_z"] == "undefined")
            options["max_z"] = this.options.max_z;
        if(typeof options["mode_x"] == "undefined")
            options["mode_x"] = this.options.mode_x;
        if(typeof options["mode_y"] == "undefined")
            options["mode_y"] = this.options.mode_y;
        if(typeof options["mode_z"] == "undefined")
            options["mode_z"] = this.options.mode_z;
        if(typeof options["width"] == "undefined")
            options["width"] = this.options.width;
        if(typeof options["height"] == "undefined")
            options["height"] = this.options.height;
        if(typeof options["depth"] == "undefined")
            options["depth"] = this.options.depth;
        options["intersect"] = this.intersect.bind(this);
        var h = new ResponseHandle(options);
        this.handles.push(h);
        this.element.addEvent("mousemove", h._mousemove.bind(h));
        this.element.addEvent("mouseup",   h._mouseup.bind(h));
        this.element.addEvent("touchmove", h._mousemove.bind(h));
        this.element.addEvent("touchend",  h._mouseup.bind(h));
        this.fireEvent("handleadded");
        return h;
    },
    remove_handle: function (h) {
        for(var i = 0; i < this.handles.length; i++) {
            if(this.handles[i] == h) {
                this.handles[i].destroy();
                this.handles.splice(i, 1);
                this.fireEvent("handleremoved");
                break;
            }
        }
    },
    remove_handles: function () {
        for(var i = 0; i < this.handles.length; i++) {
            this.remove_handle(this.handles[i]);
        }
        this.handles = [];
    },
    
    intersect: function (x1, y1, x2, y2, id) {
        var s = 0;
        for(var i = 0; i < this.handles.length; i++) {
            var h = this.handles[i];
            if(h.options.id == id) continue;
            
            var x = Math.min(Math.max(0, h.label.x2 - x1), x2 - x1);
            var y = Math.min(Math.max(0, h.label.y2 - y1), y2 - y1);
            s += x * y + this.options.importance_label;
            console.log(i, "label", x, y, s);
            
            var x = Math.min(Math.max(0, h.handle.x2 - x1), x2 - x1);
            var y = Math.min(Math.max(0, h.handle.y2 - y1), y2 - y1);
            s += x * y + this.options.importance_handle;
            console.log(i, "handle", x, y, s);
        }
//         var x = Math.min(Math.max(0, -x1), x2 - x1);
//         var y = Math.min(Math.max(0, -y1), y2 - y1);
//         s += x * y + this.options.importance_border;
    },
    
    set: function (key, value, hold) {
        this.parent(key, value, hold);
        switch(key) {
            default:
                // if(!hold) this.redraw();
                break;
        }
    }
});
