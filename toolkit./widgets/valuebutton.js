ValueButton = new Class({
    Extends: Button,
    Implements: Ranged,
    options:  {
        value: 0,
        value_format: function (val) { return sprintf("%0.2f",  val); },
        value_position: "bottom", // can be "top", "bottom", "icon"
        bar_position: "bottom", // can be "top", "bottom", "icon", "label"
        bar_direction: _TOOLKIT_HORIZONTAL,
        direction: _TOOLKIT_VERTICAL
    },
    initialize: function (options) {
        options = Object.merge(this.__options, options);
        this.parent(options);
        
        this.element.addClass("toolkit-valuebutton");
        
        this._value   = new Element("div.toolkit-value");
        this._bar     = new Element("div.toolkit-bar");
        this._base    = new Element("div.toolkit-base").inject(this._bar);
        this._over    = new Element("div.toolkit-over").inject(this._bar);
        this._input   = new Element("input.toolkit-input", {type: "text"});
        
        this.set("bar_direction", this.options.bar_direction, true);
        this.set("value_position", this.options.value_position);
        this.set("bar_position", this.options.bar_position);
        
        this.set("min",  this.options.min);
        this.set("max",  this.options.max);
        this.set("snap", this.options.snap);
        
        this._value.addEvent("click", this._value_clicked.bind(this));
        this._input.addEvent("keyup", this._value_typing.bind(this));
        
        this.drag = new DragValue({
            element:   this.element,
            range:     function () { return this; }.bind(this),
            get:       function () { return this.options.value; }.bind(this),
            set:       function (v) { this.set("value", v); }.bind(this),
            direction: this.options.direction
        });
        this.scroll = new ScrollValue({
            element: this.element,
            range:   function () { return this }.bind(this),
            get:     function () { return this.options.value; }.bind(this),
            set:     function (v) { this.set("value", v); }.bind(this)
        });
        this.redraw();
        this.initialized();
    },
    
    redraw: function () {
        this._value.set("html", this.options.value_format(this.options.value));
        this._base.setStyle((this.options.bar_direction == _TOOLKIT_HORIZONTAL
            ? "width" : "height"), this.val2perc() + "%");
        this.parent();
    },
    
    destroy: function () {
        this._value.destroy();
        this._over.destroy();
        this._base.destroy();
        this._bar.destroy();
        this.parent();
    },
    
    
    _value_clicked: function (e) {
        e.event.preventDefault();
        if (this.__editing) return false;
        this._value.set("html", "");
        this._value.addClass("toolkit-active");
        this._input.inject(this._value);
        this._input.set("value", this.options.value);
        this.__editing = true;
        this._input.focus();
        document.addEvent("click", this._value_done.bind(this));
        return false;
    },
    
    _value_typing: function (e) {
        switch (e.key) {
            case "esc":
                this._value_done();
                break;
            case "enter":
                this.set("value", parseFloat(this._input.get("value") || 0));
                this._value_done();
                break;
        }
        
    },
    
    _value_done: function () {
        this.__editing = false;
        this._input.dispose();
        this._value.removeClass("toolkit-active");
        document.removeEvent("click", this._value_done.bind(this));
        this.redraw();
    },
    
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "bar_direction":
                this.element.removeClass("toolkit-vertical");
                this.element.removeClass("toolkit-horizontal");
                switch (value) {
                    case _TOOLKIT_HORIZONTAL:
                    default:
                        var c = "toolkit-horizontal";
                        break;
                    case _TOOLKIT_VERTICAL:
                        var c = "toolkit-vertical";
                        break;
                }
                this.element.addClass(c);
                if (!hold) this.redraw();
                break;
            case "value_position":
                this.element.removeClass("toolkit-value-top");
                this.element.removeClass("toolkit-value-bottom");
                this.element.removeClass("toolkit-value-icon");
                if (value == "top" || value == "bottom")
                    this._value.inject(this.element, value);
                if (value == "icon")
                    this._value.inject(this._icon, "after");
                break;
            case "bar_position":
                this.element.removeClass("toolkit-bar-top");
                this.element.removeClass("toolkit-bar-bottom");
                this.element.removeClass("toolkit-bar-label");
                this.element.removeClass("toolkit-bar-icon");
                if (value == "top" || value == "bottom")
                    this._bar.inject(this.element, value);
                if (value == "label")
                    this._bar.inject(this._label, "after");
                if (value == "icon")
                    this._bar.inject(this._icon, "after");
                break;
            case "value":
                this.options.value = Math.max(this.options.value, this.options.min);
                this.options.value = Math.min(this.options.value, this.options.max);
                this.options.value = this.snap_value(this.options.value);
                this.fireEvent("valuechanged", [this.options.value, this]);
                if (!hold) this.redraw();
                return;
            case "value_format":
                if (!hold) this.redraw();
                break;
            case "scale":
            case "min":
            case "max":
                // calculate some logarithmics to reduce overhead when used
                // on-the-fly
                switch (this.options.scale) {
                    case _TOOLKIT_FREQ:
                        this.__minlog = Math.log10(this.options.min);
                        this.__maxlog = Math.log10(this.options.max);
                        break;
                    case _TOOLKIT_DB:
                        this.__minlog = Math.log2(this.options.min);
                        this.__maxlog = Math.log2(this.options.max);
                        break;
                }
                break;
            case "snap":
                // __snapcoef is the amount of digits of snap as a power to 10.
                // this is a workaround for using modulo with decimal values.
                // it decreases the maximum usable value by this level.
                // http://stackoverflow.com/questions/3966484/floating-point-numbers-and-javascript-modulus-operator
                p = ("" + value).split(".");
                this.__snapcoef = p.length > 1 ? Math.pow(10, p[1].length) : 1;
                break;
        }
        this.parent(key, value, hold);
    }
});
