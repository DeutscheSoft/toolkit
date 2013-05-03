Toggle = new Class({
    Extends: Button,
    options: {
        label_active:  false, // the label for the active toggle, false for default label
        icon_active:   false, // this icon of the active toggle, false for default icon
        press:         0,     // time in milliseconds after a press is interpreted as a toggle, 0 to disable press toggle
        press_disable: false, // If press is enabled, does press toggle work with deactivating the state?
        state:         false
        
    },
    
    initialize: function (options, hold) {
        this.parent(options, hold);
        this.element.addClass("toolkit-toggle");
        //this.element.addEvent("click", this.toggle.bind(this));
        this.element.addEvent("mousedown", this._mousedown.bind(this));
        this.element.addEvent("mouseup", this._mouseup.bind(this));
        this.element.addEvent("touchstart", this._mousedown.bind(this));
        this.element.addEvent("touchend", this._mouseup.bind(this));
    },
    
    redraw: function () {
        var value = this.options.state;
        var icon = this.options[value ? (this.options.icon_active ? "icon_active" : "icon") : "icon"];
        if (icon) this._icon.set("src", icon);
        var label = this.options[value ? (this.options.label_active ? "label_active" : "label") : "label"];
        if (label) this._label.set("html", label);
    },
    toggle: function (hold) {
        this._clear_to();
        this.set("state", !this.options.state);
        this.fireEvent("toggled", [this.options.state, this]);
    },
    cancel_press: function () {
        if (!this.__tp)
            return;
        this.__tp = false;
        this.__tt = false;
        this.__tm = false;
        this.set("state", !this.get("state"));
    },
    
    // HELPERS & STUFF
    _mousedown: function (e){
        if (this.__toggleclick) return;
        this.__toggleclick = this.__toggledown = true;
        if (this.options.press) {
            this.toggle();
            this.__toto = window.setTimeout(function () {
                this.__toggleclick = false;
            }.bind(this), this.options.press);
        }
        e.event.preventDefault();
        return false;
    },
    _mouseup: function (e) {
        if(!this.__toggledown) return;
        this.__toggledown = false;
        if ((this.options.press && this.__toggleclick) ||
            (!this.options.press && !this.__toggleclick)) {
            this._clear_to();
            this.__toggleclick = false;
            return;
        }
        this.toggle();
        this.__toggleclick = false;
        e.event.preventDefault();
        return false;
    },
//     _mousedown: function (e) {
//         if (!this.options.press
//         || (!this.options.press_disable && this.options.state))
//             return;
//         this.__toto = window.setTimeout(this._togglepress.bind(this), this.options.press);
//         this.__tm = true;
//         e.preventDefault();
//     },
//     _mouseup: function (e) {
//         if (!this.__tm && this.options.press) return;
//         this.toggle();
//         this._clear_to();
//         this.__tp = false;
//         this.__tc = false;
//         e.preventDefault();
//     },
//     _touchstart: function (e) {
//         if (!this.options.press
//         || (!this.options.press_disable && this.options.state))
//             return;
//         this.__toto = window.setTimeout(this._togglepress.bind(this), this.options.press);
//         this.__tt = true;
//         e.preventDefault();
//     },
//     _touchend: function (e) {
//         if (!this.__tt && this.options.press) return;
//         this.toggle();
//         this._clear_to();
//         this.__tp = false;
//         this.__tt = false;
//         e.preventDefault();
//     },
//     _togglepress: function () {
//         this.toggle();
//         this.__tp = true;
//     },
    _clear_to: function () {
        if (this.__toto) {
            window.clearTimeout(this.__toto);
            this.__toto = null;
        }
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.parent(key, value, hold);
        switch (key) {
            case "icon_active":
            case "icon":
            case "label_active":
            case "label":
            case "state":
                if (!hold) this.redraw();
                break;
        }
    }
});
 
