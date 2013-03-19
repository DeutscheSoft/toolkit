State = new Class({
    Implements: [Options, Events],
    options: {
        "class":         "",
        id:              "",
        state:           0,     // the initial state (0 ... 1)
        color:           "red", // the base color
        opacity:         0.8,   // the opacity of the mask when state = 0
        container: false
    },
    initialize: function (options) {
        this.setOptions(options);
        if(!this.options.id) this.options.id = String.uniqueID();
        this.element = new Element("div.meter-base", {
            "id":    this.options.id
        });
        this.element = new Element("div.state");
        this._over   = new Element("div.over").inject(this.element);
        this._mask   = new Element("div.mask").inject(this.element);
        
        if(this.options.container)  this.set("container",  this.options.container);
        if(this.options["class"])   this.set("class",      this.options["class"]);
        this.set("color", this.options.color);
        this.set("state", this.options.state);
        this.element.setStyles({
            "oveflow": "hidden"
        });
        this._over.setStyles({
            "position": "absolute",
            "z-index": 1,
            "width"  : "100%",
            "height" : "100%"
        });
        this._mask.setStyles({
            "position": "absolute",
            "z-index": 2,
            "width"  : "100%",
            "height" : "100%"
        });
        if(this.element.getStyle("position") != "absolute" && this.element.getStyle("position") != "relative")
            this.element.setStyle("position", "relative");
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch(key) {
            case "container":
                if(!hold) this.element.inject(this.options.container);
                break;
            case "id":
                if(!hold) this.element.set("id", this.options.id);
                break;
            case "class":
                if(!hold) this.element.addClass(this.options["class"]);
                break;
            case "color":
                if(!hold) this.element.setStyle("background", value);
                this.fireEvent("colorchanged", value);
                break;
            case "state":
                if(!hold) this._mask.setStyle("opacity", "" + ((1 - +value) * this.options.opacity));
                this.fireEvent("statechanged", value);
                break;
        }
    },
    get: function (key) {
        if(typeof this.options[key] != "undefined")
            return this.options[key];
    }
});