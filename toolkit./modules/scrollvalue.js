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
        classes:   false,                      // element receiving classes
                                               // or false to set class
                                               // on the main element
        get:       function () { return; },    // callback returning the value
        set:       function () { return; },    // callback setting the value
        active:    true                        // deactivate the event
    },
    initialize: function (options) {
        this.parent(options);
        if (this.options.element)
            this.set("element", this.options.element);
        this.set("events", this.options.events);
        this.set("classes", this.options.classes);
        
        this.initialized();
    },
    destroy: function () {
        if (this.options.element)
            this.options.element.removeEvent("mousewheel", this._scrollwheel);
        this.parent();
    },
    _scrollwheel: function (e) {
        if (!this.options.active) return;
        e.event.preventDefault();
        
        this.options.classes.addClass("toolkit-scrolling");
        var range = this.options.range();
        
        // timeout for resetting the class
        if (this.__sto) window.clearTimeout(this.__sto);
        this.__sto = window.setTimeout(function () {
            this.options.classes.removeClass("toolkit-scrolling");
            this._fire_event("scrollended", e);
            this._wheel = false;
        }.bind(this), 200);
        
        // calc step depending on options.step, .shift up and .shift down
        var step = (range.options.step || 1) * e.wheel;
        if (e.control && e.shift) {
            step *= range.options.shift_down;
        } else if (e.shift) {
            step *= range.options.shift_up;
        }
        if (!this._wheel)
            this._lastPos = range.val2real(this.options.get());
        
        if (this.options.snap) {
            
        }
        this._lastPos += step;
        this.options.set(range.real2val(this._lastPos, true));
        
        this._lastPos = range.val2real(Math.max(Math.min(range.real2val(this._lastPos, true),
                                          range.options.max),
                                 range.options.min), true);
        
        if (!this._wheel)
            this._fire_event("scrollstarted", e);
        
        this._fire_event("scrolling", e);
        
        this._wheel = true;
        
        return false;
    },
    
    // HELPERS & STUFF
    _fire_event: function (title, event) {
        // fire an event on this drag object and one with more
        // information on the draggified element
        this.fireEvent(title, [this, event]);
        if (this.options.events())
            this.options.events().fireEvent(title, [event,
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
        //this.parent(key, value, hold);
    }
})
