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
    if (typeof e.button != "undefined" && e.button > 0) return;
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

    this._clickPos = range.val2real(this.options.get());

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
    if (typeof e.button != "undefined" && e.button > 0) return;
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
    if (typeof e.button != "undefined" && e.button > 0) return;
    var O = this.options;
    if (!O.active) return;
    e.preventDefault();
    // get the right event if touch
    var ev = get_event(e);
    // calc multiplier depending on step, shift up and shift down
    var range = O.range();
    var multi = range.options.step || 1;
    if (e.ctrlKey && e.shiftKey) {
        multi *= range.options.shift_down;
    } else if (e.shiftKey) {
        multi *= range.options.shift_up;
    }
    var dist = 0;
    switch(O.direction) {
        case _TOOLKIT_POLAR:
            var x = ev.pageX - this._pageX;
            var y = this._pageY - ev.pageY;
            var r = Math.sqrt(x * x + y * y) * multi;
            var a = Math.atan2(x, y) * (180 / Math.PI) + 360;
            if (angle_diff(O.rotation, a)
              < 90 - O.blind_angle / 2) {
                dist = r * multi;
                break;
            }
            if (angle_diff(O.rotation + 180, a)
              < 90 - O.blind_angle / 2) {
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

    var val = O.get();
    O.set(range.px2val(this._clickPos + dist));

    // remember stuff
    if (val != O.get())
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
w.TK.DragValue = w.DragValue = $class({
    /** @class DragValue
     * DragValue enables dragging an element and setting a
     * value according to the distance. DragValue is used e.g. in #Knob
     * or #ValueButton for setting its value.
     * @option range; Function; function () { return {} }; The range object for calculating the value
     * @option node; DOMNode|boolean; false; An element receiving the users events or false to use the items element itself
     * @option events; DOMNode|boolean; false; An element firing the drag events or false to use the items element itself
     * @option classes; DOMNode|boolean; false; An element receiving the classes or false to use the items element itself
     * @option get; Function; function () { return; }; Callback function returning the value
     * @option set; Function; function () { return; }; Callback function setting the value
     * @option direction; integer; _TOOLKIT_POLAR; Direction changing the value, _TOOLKIT_POLAR|_TOOLKIT_VERTICAL|_TOOLKIT_HORIZONTAL
     * @option active; boolean; true; Deactivate the dragging
     * @option cursor; boolean; false; Enable global cursor
     * @option blind_angle; number; 20; Used if direction is _TOOLKIT_POLAR, angle of separation between positive and negative value changes
     * @option rotation; number; 45; Defines the angle of the center of the positive value changes. 0 means straight upward. E.g. a value of 45 does positive value changes in upper and right directions
     * @extends Widget
     * @implements GlobalCursor
     */
    _class: "DragValue",
    Extends: Widget,
    Implements: GlobalCursor,
    _options: Object.assign(Object.create(Widget.prototype._options), {
        get: "function",
        set: "function",
        range: "function",
        events: "object",
        classes: "object",
        node: "object",
        direction: "int",
        active: "boolean",
        cursor: "boolean",
        blind_angle: "number",
        rotation: "number",
    }),
    options: {
        range:     function () { return {}; }, // a range oject
        node:   false,                         // the element receiving
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
        rotation:  45,                         // used when direction = _TOOLKIT_POLAR
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

        // make sure not to set these later.
        cache_values.call(this, {}, 0);

        Widget.prototype.initialize.call(this, options);

        if (this.options.node)
            this.set("node", this.options.node);
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
    set: function (key, value) {
        Widget.prototype.set.call(this, key, value);
        switch (key) {
            case "node":
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
                if (!value && this.options.node) {
                    this.options.events = this.options.node;
                }
                break;
            case "classes":
                if (!value && this.options.node) {
                    this.options.classes = this.options.node;
                }
                break;
        }
    }
});
})(this);
