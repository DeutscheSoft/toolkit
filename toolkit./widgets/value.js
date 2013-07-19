/*******************************************************************************
 * toolkit. by Junger
 * 
 * This toolkit provides different widgets, implements and modules for building
 * audio based applications in webbrowsers.
 * 
 * Concept and realization by Markus Schmidt <schmidt@boomshop.net> for:
 * 
 * Jünger Audio GmbH
 * Justus-von-Liebig-Straße 7
 * 12489 Berlin · Germany
 * Tel: +49 30 67 77 21 0
 * http://junger-audio.com
 * info@junger-audio.com
 * 
 * toolkit. relies on mootools: http://mootools.net/
 * 
 * There is no license by now - all rights reserved. Hope we can fix this major
 * bug soon.
 ******************************************************************************/
 
Value = new Class({
    // Value is a formatted text field displaying numbers and providing
    // a input field for editing the value
    Extends: Widget,
    options: {
        value: 0,
        format: function (val) { return sprintf("%0.2f",  val); },
        set: false // set a callback function if value is editable or
                   // false to disable editing. A function has to return
                   // the value treated by the parent widget.
    },
    initialize: function (options) {
        this.parent(options);
        this.element = this.widgetize(new Element("div.toolkit-value"),
                                      true, true, true);
        this._input  = new Element("input.toolkit-input", {type: "text"});
        
        this.element.addEvent("click", this._value_clicked.bind(this));
        this._input.addEvent("keyup", this._value_typing.bind(this));
        
        if (this.options.container)
            this.set("container", this.options.container);
        
        this.set("value", this.options.value);
    },
    
    redraw: function () {
        this.element.set("html", this.options.format(this.options.value));
    },
    
    destroy: function () {
        document.removeEvent("click", this._value_done.bind(this));
        this._input.destroy();
        this.element.destroy();
        this.parent();
    },
    
    // HELPERS & STUFF
    _value_clicked: function (e) {
        if (!this.options.set) return;
        e.event.preventDefault();
        if (this.__editing) return false;
        var w = this.element.innerWidth();
        this.element.set("html", "");
        this.element.addClass("toolkit-active");
        this._input.inject(this.element);
        this._input.set("value", this.options.value);
        this._input.outerWidth(w);
        this.__editing = true;
        this._input.focus();
        document.addEvent("click", this._value_done.bind(this));
        this.fireEvent("valueclicked", [this.options.value, this]);
        return false;
    },
    _value_typing: function (e) {
        if (!this.options.set) return;
        switch (e.key) {
            case "esc":
                this._value_done();
                this.fireEvent("valueescape", [this.options.value, this]);
                break;
            case "enter":
                var val = parseFloat(this._input.get("value") || 0);
                val = this.options.set(val);
                this.set("value", val, true);
                this._value_done();
                this.fireEvent("valueset", [this.options.value, this]);
                this.fireEvent("useraction", ["value", this.options.value, this]);
                break;
        }
        this.fireEvent("valuetyping", [e, this.options.value, this]);
    },
    _value_done: function () {
        this.__editing = false;
        this._input.dispose();
        this.element.removeClass("toolkit-active");
        document.removeEvent("click", this._value_done.bind(this));
        this.fireEvent("valuedone", [this.options.value, this]);
        this.redraw();
    },
    
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "value":
                if (!hold) this.redraw();
                break;
            case "format":
                if (!hold) this.redraw();
                break;
        }
        this.parent(key, value, hold);
    }
});
