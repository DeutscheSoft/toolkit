ScrollValue = new Class({
    // ScrollValue enables the scrollwheel for setting a value of an
    // object. ScrollValue is used e.g. in Knob for setting its value.
    Extends: Widget,
    options: {
        range:     function () { return {}; }, // a range oject
        element:   false,                      // the element receiving
                                               // the drag
        events:    false,                      // element receiving events
                                               // or false to fire events
                                               // on the main element
        get:       function () { return; },    // callback returning the value
        set:       function () { return; },    // callback setting the value
    },
    initialize: function (options) {
        this.parent(options);
        if (this.options.element)
            this.set("element", this.options.element);
        this.set("events", this.options.events);
        this.fireEvent("initialized", this);
    },
    
    _scrollwheel: function (e) {
        e.event.preventDefault();
        
        this.options.element.addClass("toolkit-active");
        
        // timeout for resetting the class
        if (this.__sto) window.clearTimeout(this.__sto);
        this.__sto = window.setTimeout(function () {
            this.options.element.removeClass("toolkit-active");
            this._fire_event("scrollended", e);
        }.bind(this), 250);
        
        // calc step depending on options.step, .shift up and .shift down
        var step = (this.options.range().options.step || 1) * e.wheel;
        if (e.control && e.shift) {
            step *= this.options.range().options.shift_down;
        } else if (e.shift) {
            step *= this.options.range().options.shift_up;
        }
        var valpos = this.options.range().val2real(this.options.get());
        this.options.set(this.options.range().real2val(valpos + step));
        
        if (!this._wheel)
            this._fire_event("scrollstarted", e);
        else
            this._fire_event("scrolling", e);
        
        this._wheel = true;
        
        return false;
    },
    
    // HELPERS & STUFF
    _fire_event: function (title, event) {
        // fire an event on this drag object and one with more
        // information on the draggified element
        this.fireEvent(title, [this, event]);
        this.options.events.fireEvent(title, [event,
                                              this.options.get(),
                                              this.options.element,
                                              this,
                                              this.options.range()
                                              ]);
    },
    
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "element":
                value.addEvents({
                    "mousewheel": this._scrollwheel.bind(this),
                });
                if (value && !this.options.events) {
                    this.options.events = value;
                }
                break;
            case "events":
                if (!value && this.options.element) {
                    this.options.events = this.options.element;
                }
                break;
        }
        //this.parent(key, value, hold);
    }
})
