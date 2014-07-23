 /* toolkit. provides different widgets, implements and modules for 
 * building audio based applications in webbrowsers.
 * 
 * Invented 2013 by Markus Schmidt <schmidt@boomshop.net>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General
 * Public License along with this program; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, 
 * Boston, MA  02110-1301  USA
 */
 
DragValue = new Class({
    // DragValue enables dragging an element and setting a value
    // according to the distance. DragValue is used e.g. in Knob for
    // setting its value.
    _class: "DragValue",
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
        active:    true,                       // deactivate the event
        cursor:    false                       // enable global cursors
    },
    initialize: function (options) {
        this.__pointer_move = this._pointer_move.bind(this);
        this.__pointer_up = this._pointer_up.bind(this);
        this.__pointer_down = this._pointer_down.bind(this);

        Widget.prototype.initialize.call(this, options);
        if (this.options.element)
            this.set("element", this.options.element);
        this.set("events", this.options.events);
        this.set("classes", this.options.classes);
        
        this.initialized();
    },
    destroy: function () {
        document.remove_event("mousemove", this.__pointer_move);
        document.remove_event("mouseup",   this.__pointer_up);
        document.remove_event("touchmove", this.__pointer_move);
        document.remove_event("touchend",  this.__pointer_up);
        Widget.prototype.destroy.call(this);
    },
    _pointer_down: function (e) {
        if (!this.options.active) return;
        e.preventDefault();
        // get the right event if touch
        var ev = this._get_event(e);
        // set stuff
        this.options.classes.addClass("toolkit-dragging");
        if (this.options.direction == _TOOLKIT_VERT && this.options.cursor)
            this.global_cursor("row-resize");
        else if (this.options.cursor)
            this.global_cursor("col-resize");
        this.__active  = true;
        
        this._clickPos = this.options.range().val2real(this.options.get());
        this._pageX = ev.pageX;
        this._pageY = ev.pageY
            
        // remember stuff
        this._cache_values(ev, 0);
        
        // fire event
        this._fire_event("startdrag", e);

        document.addEventListener("mousemove", this.__pointer_move);
        document.addEventListener("mouseup",   this.__pointer_up);
        document.addEventListener("touchmove", this.__pointer_move);
        document.addEventListener("touchend",  this.__pointer_up);
        
        return false;
    },
    _pointer_up: function (e) {
        if (!this.__active) return;
        e.preventDefault();
        // set stuff
        this.options.classes.removeClass("toolkit-dragging");
        if (this.options.cursor) {
            this.remove_cursor("row-resize");
            this.remove_cursor("col-resize");
        }
        document.removeEventListener("mousemove", this.__pointer_move);
        document.removeEventListener("mouseup",   this.__pointer_up);
        document.removeEventListener("touchmove", this.__pointer_move);
        document.removeEventListener("touchend",  this.__pointer_up);
        this.__active = false;
        // fire event
        this._fire_event("stopdrag", e);
        
        return false;
    },
    _pointer_move: function (e) {
        if (!this.__active) return;
        if (!this.options.active) return;
        e.preventDefault();
        // get the right event if touch
        var ev = this._get_event(e);
        // calc multiplier depending on step, shift up and shift down
        var multi = this.options.range().options.step || 1;
        if (e.ctrlKey && e.shiftKey) {
            multi *= this.options.range().options.shift_down;
        } else if (e.shiftKey) {
            multi *= this.options.range().options.shift_up;
        }
        
        if (this.options.direction == _TOOLKIT_VERT)
            var dist = (this._pageY - ev.pageY) * multi;
        else
            var dist = (ev.pageX - this._pageX) * multi;
        
        var val = this.options.get();
        this.options.set(this.options.range().px2val(this._clickPos + dist));
        
        // remember stuff
        if (val != this.options.get())
            this._cache_values(ev, dist);
        
        // fire event
        this._fire_event("dragging", e);
        
        return false;
    },
    
    // HELPERS & STUFF
    _cache_values: function (event, dist) {
        // store some poitions and values
        this._pageX    = event.pageX;
        this._pageY    = event.pageY;
        this._clickPos = this._clickPos + dist;
    },
    
    _get_event: function (event) {
        // return the right event if touch surface is used
        // with multiple fingers
        return (event.touches && event.touches.length)
              ? event.touches[0] : event;
    },
    
    _fire_event: function (title, event) {
        // fire an event on this drag object and one with more
        // information on the draggified element
        this.fire_event(title, [this, event]);
        if (this.options.events())
            this.options.events().fire_event(title, [event,
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
                value.addEventListener("contextmenu", function () {return false;});
                value.addEventListener("mousedown",   this.__pointer_down);
                value.addEventListener("touchstart",  this.__pointer_down);
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
        Widget.prototype.set.call(this, key, value, hold);
    }
});
