Button = new Class({
    Implements: [Options, Events],
    options: {
        "class":          "",
        id:               "",
        container:        false,          // a container to use as the base object
        label:            "",             // text for the button
        icon:             "",             // URL to an icon for this button
        state:            false,          // state of the button (bool)
        state_color:      false           // background color of the state indication
    },
    
    initialize: function (options, hold) {
        this.setOptions(options);
        if (!this.options.id) this.options.id = String.uniqueID();
        this.element = new Element("div.toolkit-button", {
            "id":    this.options.id
        });
        if (this.options.container) this.set("container", this.options.container, hold);
        if (this.options["class"]) this.set("class", this.options["class"], hold);
        
        this._icon = new Element("img.toolkit-icon").inject(this.element);
        this._label = new Element("div.toolkit-label").inject(this.element);
        
        this.set("label", this.options.label, hold);
        this.set("icon", this.options.icon, hold);
        
        this.element.addEvent("click", function (e) { this.fireEvent("click", e) }.bind(this));
        this.element.addEvent("mousedown", function (e) { this.fireEvent("mousedown", e) }.bind(this));
        this.element.addEvent("mouseup", function (e) { this.fireEvent("mouseup", e) }.bind(this));
        this.set("state_color", this.options.state_color, hold);
        this.set("state", this.options.state, hold);
    },
    destroy: function () {
        this._icon.destroy();
        this._label.destroy();
        this.element.destroy();
    },
    // HELPERS & STUFF
    
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "container":
                if (!hold) this.element.inject(value);
                break;
            case "class":
                if (!hold) this.element.addClass(value);
                break;
            case "label":
                if (!hold) {
                    if (value) {
                        this._label.set("html", value);
                        this._label.setStyle("display", "block");
                    } else {
                        this._label.setStyle("display", "none");
                    }
                }
                break;
            case "icon":
                if (!hold) {
                    if (value) {
                        this._icon.set("src", value);
                        this._icon.setStyle("display", "block");
                    } else {
                        this._icon.setStyle("display", "none");
                    }
                }
                break;
            case "state":
                if (!hold) {
                    this.element[value ? "addClass" : "removeClass"]("active");
                    this._label.setStyle("background-color", (this.options.state_color && this.options.state) ? this.options.state_color : null);
                }
                break;
            case "state_color":
                if (!hold) this.set("state", this.options.state);
        }
    },
    get: function (key) {
        if (typeof this.options[key] != "undefined")
            return this.options[key];
    }
});
 
