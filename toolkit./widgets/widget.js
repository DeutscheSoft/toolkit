Widget = new Class({
    Implements: [Options, Events],
    options: {
        "class":          "",
        id:               "",
        container:        false,          // a container to use as the base object
    },
    
    initialize: function (options, hold) {
        this.setOptions(options);
        if(!this.options.id) this.options.id = String.uniqueID();
        this.element = new Element("div.widget", {
            "id":    this.options.id
        });
        if(this.options.container) this.set("container", this.options.container, hold);
        if(this.options["class"]) this.set("class", this.options["class"], hold);
        if(!hold) this.redraw();
    },
    
    redraw: function () {
        
    },
    destroy: function () {
        this.element.destroy();
    },
    // HELPERS & STUFF
    
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch(key) {
            default:
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
 
