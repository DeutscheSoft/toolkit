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
(function(w){
function pointer_down(e) {
    if (!this.options.active) return;
    e.preventDefault();
    // get the right event if touch
    var ev = get_event(e);
    // set stuff
    TK.add_class(this.options.classes, "toolkit-dragging");
    if (this.options.direction == _TOOLKIT_VERT && this.options.cursor)
        this.global_cursor("row-resize");
    else if (this.options.cursor)
        this.global_cursor("col-resize");
    this.__active  = true;

    var range = this.options.range();

    this._clickPos = range.val2real(range.snap(this.options.get()));

    // remember stuff
    cache_values.call(this, ev, 0);

    // fire event
    this.fire_event("startdrag", e);

    document.addEventListener("mousemove", this.__pointer_move);
    document.addEventListener("mouseup",   this.__pointer_up);
    document.addEventListener("touchmove", this.__pointer_move);
    document.addEventListener("touchend",  this.__pointer_up);

    return false;
}
function pointer_up(e) {
    if (!this.__active) return;
    e.preventDefault();
    // set stuff
    TK.remove_class(this.options.classes, "toolkit-dragging");
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
    this.fire_event("stopdrag", e);

    return false;
}
function pointer_move(e) {
    if (!this.__active) return;
    if (!this.options.active) return;
    e.preventDefault();
    // get the right event if touch
    var ev = get_event(e);
    // calc multiplier depending on step, shift up and shift down
    var multi = this.options.range().options.step || 1;
    if (e.ctrlKey && e.shiftKey) {
        multi *= this.options.range().options.shift_down;
    } else if (e.shiftKey) {
        multi *= this.options.range().options.shift_up;
    }
    var dist = 0;
    switch(this.options.direction) {
        case _TOOLKIT_POLAR:
            var x = ev.pageX - this._pageX;
            var y = this._pageY - ev.pageY;
            var r = Math.sqrt(x * x + y * y) * multi;
            var a = Math.atan2(x, y) * (180 / Math.PI) + 360;
            if (angle_diff(this.options.rotation, a)
              < 90 - this.options.blind_angle / 2) {
                dist = r * multi;
                break;
            }
            if (angle_diff(this.options.rotation + 180, a)
              < 90 - this.options.blind_angle / 2) {
                dist = -r * multi;
                break;
            }
            break;
        case _TOOLKIT_VERT:
            dist = (this._pageY - ev.pageY) * multi;
            break;
        case _TOOLKIT_HORIZ:
            dist = (ev.pageX - this._pageX) * multi;
            break;
    }

    var val = this.options.get();
    var range = this.options.range();
    this.options.set(range.snap(range.px2val(this._clickPos + dist)));

    // remember stuff
    if (val != this.options.get())
        cache_values.call(this, ev, dist);

    // fire event
    this.fire_event("dragging", ev);

    return false;
}

// HELPERS & STUFF
function cache_values(event, dist) {
    // store some poitions and values
    this._pageX    = event.pageX;
    this._pageY    = event.pageY;
    this._clickPos = this._clickPos + dist;
}

function get_event(event) {
    // return the right event if touch surface is used
    // with multiple fingers
    return (event.touches && event.touches.length)
          ? event.touches[0] : event;
}

function angle_diff(a, b) {
    // returns an unsigned difference between two angles
    var d = (Math.abs(a - b) + 360) % 360;
    return d > 180 ? 360 - d : d;
}
w.DragValue = $class({
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
        direction: _TOOLKIT_POLAR,             // direction: vertical,
                                               // horizontal or polar
        active:    true,                       // deactivate the event
        cursor:    false,                      // enable global cursors
        blind_angle: 20,                       // used when direction = _TOOLKIT_POLAR
                                               // amount of degrees to
                                               // separate positive from negative
                                               // value changes
        rotation:  45                          // used when direction = _TOOLKIT_POLAR
                                               // defines the angle of
                                               // the middle of the positive
                                               // value changes. 0 means
                                               // straight upward. E.g. a
                                               // value of 45 does positive
                                               // value changes in upper and
                                               // right directions
    },
    initialize: function (options) {
        this.__pointer_move = pointer_move.bind(this);
        this.__pointer_up = pointer_up.bind(this);
        this.__pointer_down = pointer_down.bind(this);

        Widget.prototype.initialize.call(this, options);

        if (this.options.element)
            this.set("element", this.options.element);
        this.set("events", this.options.events);
        this.set("classes", this.options.classes);
    },
    destroy: function () {
        document.removeEventListener("mousemove", this.__pointer_move);
        document.removeEventListener("mouseup",   this.__pointer_up);
        document.removeEventListener("touchmove", this.__pointer_move);
        document.removeEventListener("touchend",  this.__pointer_up);
        Widget.prototype.destroy.call(this);
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
})(this);
