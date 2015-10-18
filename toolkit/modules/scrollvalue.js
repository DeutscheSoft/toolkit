 /* toolkit provides different widgets, implements and modules for 
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
"use strict";
(function(w) {
function scrollwheel(e) {
    var O = this.options;
    if (!O.active) return;
    e.preventDefault();
    var d = e.wheelDelta ? e.wheelDelta : -e.detail;
    var direction = d > 0 ? 1 : -1;
    TK.add_class(O.classes, "toolkit-scrolling");
    var range = O.range();
    
    // timeout for resetting the class
    if (this.__sto) window.clearTimeout(this.__sto);
    this.__sto = window.setTimeout(function () {
        TK.remove_class(O.classes, "toolkit-scrolling");
        fire_event.call(this, "scrollended", e);
        this._wheel = false;
    }.bind(this), 200);
    
    // calc step depending on options.step, .shift up and .shift down
    var step = (range.options.step || 1) * direction;
    if (e.ctrlKey && e.shiftKey) {
        step *= range.options.shift_down;
    } else if (e.shiftKey) {
        step *= range.options.shift_up;
    }
    if (!this._wheel)
        this._lastPos = range.val2real(range.snap(O.get()));
    
    this._lastPos += step;
    O.set(range.real2val(this._lastPos));
    
    this._lastPos = range.val2real(Math.max(Math.min(range.real2val(this._lastPos), range.options.max), range.options.min));
    
    if (!this._wheel)
        fire_event.call(this, "scrollstarted", e);
    
    fire_event.call(this, "scrolling", e);
    
    this._wheel = true;
    
    return false;
}
function fire_event(title, event) {
    var O = this.options;
    // fire an event on this drag object and one with more
    // information on the draggified element
    this.fire_event(title, this, event);
    if (O.events())
        O.events().fire_event(title, event, O.get(), O.element, this, O.range());
}
w.ScrollValue = $class({
    // ScrollValue enables the scrollwheel for setting a value of an
    // object. ScrollValue is used e.g. in Knob for setting its value.
    _class: "ScrollValue",
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
        this._scrollwheel = scrollwheel.bind(this);
        Widget.prototype.initialize.call(this, options);
        if (this.options.element)
            this.set("element", this.options.element);
        this.set("events", this.options.events);
        this.set("classes", this.options.classes);
    },
    destroy: function () {
        if (this.options.element) {
            this.options.element.removeEventListener("mousewheel", this._scrollwheel);
            this.options.element.removeEventListener("DOMMouseScroll", this._scrollwheel);
        }
        Widget.prototype.destroy.call(this);
    },
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "element":
                value.addEventListener("mousewheel", this._scrollwheel);
                value.addEventListener("DOMMouseScroll", this._scrollwheel);
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
        //Widget.prototype.set.call(this, key, value, hold);
    }
})
})(this);
