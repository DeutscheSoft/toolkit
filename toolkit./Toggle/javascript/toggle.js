Toggle = new Class({
    Extends: Button,
    options: {
        state:         false, // the state of the toggle button
        label_active:  false, // the label for the active toggle, false for default label
        icon_active:   false, // this icon of the active toggle, false for default icon
        press:         0,     // time in milliseconds after a press is interpreted as a toggle, 0 to disable press toggle
        press_disable: false  // If press is enabled, does press toggle work with deactivating the state?
    },
    
    initialize: function (options, hold) {
        this.parent(options, hold);
        this.element.addClass("toggle");
        this.element.addEvent("click", this.toggle.bind(this));
        this.element.addEvent("mousedown", this._mousedown.bind(this));
        this.element.addEvent("mouseup", this._mouseup.bind(this));
        this.element.addEvent("touchstart", this._touchstart.bind(this));
        this.element.addEvent("touchend", this._touchend.bind(this));
        this.set("state", this.options.state, hold);
    },
    
    redraw: function () {
        var value = this.options.state;
        this.element[value ? "addClass" : "removeClass"]("active");
        var icon = this.options[value ? (this.options.icon_active ? "icon_active" : "icon") : "icon"];
        if(icon) this._icon.set("src", icon);
        var label = this.options[value ? (this.options.label_active ? "label_active" : "label") : "label"];
        if(label) this._label.set("html", label);
    },
    
    toggle: function (hold) {
        this._clear_to();
        this.set("state", !this.options.state);
        this.fireEvent("toggled");
    },
    
    // HELPERS & STUFF
    
    _mousedown: function (e) {
        if(!this.options.press || (!this.options.press_disable && this.options.state)) return;
        this.__toto = window.setTimeout(this._togglepress.bind(this), this.options.press);
    },
    _mouseup: function (e) {
        this._clear_to();
        this.__tp = false;
    },
    _touchstart: function (e) {
        if(!this.options.press || (!this.options.press_disable && this.options.state)) return;
        this.__toto = window.setTimeout(this._togglepress.bind(this), this.options.press);
    },
    _touchend: function (e) {
        if(!this.__toto)
            this.toggle();
        this._clear_to();
        this.__tp = false;
    },
    _togglepress: function () {
        this.toggle();
        this.__tp = true;
    },
    _clear_to: function () {
        if(this.__toto) {
            window.clearTimeout(this.__toto);
            this.__toto = null;
        }
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.parent(key, value, hold);
        switch(key) {
            case "icon_active":
            case "icon":
            case "label_active":
            case "label":
            case "state":
                if(!hold) this.redraw();
                break;
        }
    },
});
 
