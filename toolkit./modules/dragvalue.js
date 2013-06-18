DragValue = new Class({
    // DragValue enables dragging an element and setting a value
    // according to the distance. DragValue is used e.g. in Knob for
    // setting its value.
    Extends: Widget,
    Implements: GlobalCursor,
    options: {
        range:     function () { return {}; }, // a range oject
        element:   false,                      // the element receiving
                                               // the drag
        events:    false,                      // element receiving events
                                               // or false to fire events
                                               // on the main element
        classes:   false,                      // element receiving classes
                                               // or false to set class
                                               // on the main element
        get:       function () { return; },    // callback returning the value
        set:       function () { return; },    // callback setting the value
        direction: _TOOLKIT_VERTICAL,          // direction: vertical
                                               // or horizontal
        active:    true                        // deactivate the event
    },
    initialize: function (options) {
        this.parent(options);
        if (this.options.element)
            this.set("element", this.options.element);
        this.set("events", this.options.events);
        this.set("classes", this.options.classes);
        
        document.addEvent("mousemove", this._pointer_move.bind(this));
        document.addEvent("mouseup",   this._pointer_up.bind(this));
        document.addEvent("touchmove", this._pointer_move.bind(this));
        document.addEvent("touchend",  this._pointer_up.bind(this));
        
        this.fireEvent("initialized", this);
    },
    destroy: function () {
        document.removeEvent("mousemove", this._pointer_move);
        document.removeEvent("mouseup",   this._pointer_up);
        document.removeEvent("touchmove", this._pointer_move);
        document.removeEvent("touchend",  this._pointer_ups);
        this.parent();
    },
    _pointer_down: function (e) {
        if (!this.options.active) return;
        e.event.preventDefault();
        // get the right event if touch
        if (e.touches && e.touches.length > 1) {
            var ev = e.touches[0];
        } else {
            ev = e.event;
        }
        // set stuff
        this.options.classes.addClass("toolkit-dragging");
        if (this.options.direction == _TOOLKIT_VERT)
            this.global_cursor("row-resize");
        else
            this.global_cursor("col-resize");
        this.__active  = true;
        // remember stuff
        this._cache_values(ev);
        // fire event
        this._fire_event("startdrag", e);
        
        return false;
    },
    _pointer_up: function (e) {
        if (!this.__active) return;
        e.event.preventDefault();
        // set stuff
        this.options.classes.removeClass("toolkit-dragging");
        this.remove_cursor("row-resize");
        this.remove_cursor("col-resize");
        this.__active = false;
        // fire event
        this._fire_event("stopdrag", e);
        
        return false;
    },
    _pointer_move: function (e) {
        if (!this.__active) return;
        if (!this.options.active) return;
        e.event.preventDefault();
        
        // get the right event if touch
        var ev = this._get_event(e);
        // calc multiplier depending on step, shift up and shift down
        var multi = this.options.range().options.step || 1;
        if (e.control && e.shift) {
            multi *= this.options.range().options.shift_down;
        } else if (e.shift) {
            multi *= this.options.range().options.shift_up;
        }
        
        if (this.options.direction == _TOOLKIT_VERT)
            var dist = (this._pageY - ev.pageY) * multi;
        else
            var dist = (ev.pageX - this._pageX) * multi;
        this.options.set(this.options.range().px2val(this._clickPos + dist));
        
        // remember stuff
        this._cache_values(ev);
        // fire event
        this._fire_event("dragging", e);
        
        return false;
    },
    
    // HELPERS & STUFF
    _get_event: function (event) {
        // return the right event if touch surface is used
        // with multiple fingers
        return (event.touches && event.touches.length > 1)
              ? event.touches[0] : event.event;
    },
    
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
    _cache_values: function (event) {
        // store some poitions and values
        this._pageX    = event.pageX;
        this._pageY    = event.pageY;
        this._clickVal = this.options.get();
        this._clickPos = this.options.range().val2real(this._clickVal);
    },
    
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "element":
                value.addEvents({
                    "contextmenu": function () {return false;},
                    "mousedown":   this._pointer_down.bind(this),
                    "touchstart":  this._pointer_down.bind(this)
                });
                if (value && !this.options.events) {
                    this.options.events = value;
                }
                if (value && !this.options.classes) {
                    this.options.classes = value;
                }
                break;
            case "events":
                if (!value && this.options.element) {
                    this.options.events = this.options.element;
                }
                break;
            case "classes":
                if (!value && this.options.element) {
                    this.options.classes = this.options.element;
                }
                break;
        }
        this.parent(key, value, hold);
    }
});
