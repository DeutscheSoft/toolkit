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
function scroll_timeout() {
    fire_event.call(this, "scrollended");
    this._wheel = false;
    this.__sto = false;
    this.set("scrolling", false);
    TK.remove_class(this.options.classes, "toolkit-scrolling");
}
function scrollwheel(e) {
    var O = this.options;
    if (!O.active) return;
    e.preventDefault();
    var d = e.wheelDelta ? e.wheelDelta : -e.detail;
    var direction = d > 0 ? 1 : -1;
    var range = O.range();

    // timeout for resetting the class
    if (this.__sto) window.clearTimeout(this.__sto);
    else TK.add_class(this.options.classes, "toolkit-scrolling");
    this.__sto = window.setTimeout(scroll_timeout.bind(this), 200);
    
    // calc step depending on options.step, .shift up and .shift down
    var step = (range.options.step || 1) * direction;
    if (e.ctrlKey && e.shiftKey) {
        step *= range.options.shift_down;
    } else if (e.shiftKey) {
        step *= range.options.shift_up;
    }

    var pos = range.val2real(O.get());
    var value;
    
    pos += step;

    value = range.real2val(pos);

    /* If snap() returns to the old value, we try to snap in the right direction.
     * If that fails too, we are probably at the boundary of our range, and pass
     * the original value, in order to trigger the range overflow detection (warning).
     */
    if (range.snap(value) === O.get()) {
        var tmp;
        if (d > 0) {
            tmp = range.snap_up(value);
        } else {
            tmp = range.snap_down(value);
        }
        if (tmp !== O.get()) {
            value = tmp;
        }
    }

    O.set(value);
    
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
    var e = O.events();
    if (e) e.fire_event(title, event, O.get(), O.element, this, O.range());
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
        var E = this.options.element;
        if (E) {
            E.removeEventListener("mousewheel", this._scrollwheel);
            E.removeEventListener("DOMMouseScroll", this._scrollwheel);
        }
        Widget.prototype.destroy.call(this);
    },
    // GETTERS & SETTERS
    set: function (key, value) {
        this.options[key] = value;
        //Widget.prototype.set.call(this, key, value, hold);
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
    }
})
})(this);
