Grid = new Class({
    Implements: [Options, Events, Coordinates],
    options: {
        "class":          "",
        id:               "",
        container:        false,          // a container to inject the element into
        grid_x:           [],             // array containing {pos:x[, color: "colorstring"[, class: "classname"[, label:"labeltext"]]]}
        grid_y:           [],             // array containing {pos:y[, color: "colorstring"[, class: "classname"[, label:"labeltext"]]]}
    },
    
    initialize: function (options, hold) {
        this.setOptions(options);
        if(!this.options.id) this.options.id = String.uniqueID();
        this.element = makeSVG("g", {class: "grid"});
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
            
        }
    },
    destroy: function () {
        this.element.destroy();
    },
    // HELPERS & STUFF
    
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch(key) {
            case "width":
            case "height":
            case "mode_x":
            case "mode_y":
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
 
