/*
 * This file is part of toolkit.
 *
 * toolkit is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * toolkit is distributed in the hope that it will be useful,
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

/* TOUCH EVENTS */

function touchstart(e) {
    e.preventDefault();

    var touches = e.changedTouches;

    if (!touches || !touches.length) return;

    // we use the first touchstart and keep that identifier
    var touch = touches.item(0);

    if (!start_drag.call(this, e, touch.pageX, touch.pageY)) return;

    this._drag_state.id = touch.identifier;

    var node = this.options.node;

    node.addEventListener("touchmove", this.__touchmove);
    node.addEventListener("touchcancel", this.__touchend);
    node.addEventListener("touchend", this.__touchend);
}
function find_touch(e, id) {
    var touches = e.changedTouches;
    var touch;

    if (!touches || !touches.length) return false;

    for (var i = 0; i < touches.length; i++) {
        touch = touches.item(i);
        if (touch.identifier === id) {
            return touch;
        }
    }

    return false;
}
function touchend(e) {
    e.preventDefault();

    var state = this._drag_state;
    var touch = find_touch(e, state.id);

    // this is a different touch point, ignore it
    if (!touch) return;

    var node = this.options.node;

    node.removeEventListener("touchmove", this.__touchmove);
    node.removeEventListener("touchcancel", this.__touchend);
    node.removeEventListener("touchend", this.__touchend);

    stop_drag.call(this, e);
}

function touchmove(e) {
    e.preventDefault();

    var state = this._drag_state;

    var touch = find_touch(e, state.id);

    if (touch) move_drag.call(this, e, touch.pageX, touch.pageY);
}

/* MOUSE EVENTS */

function mousedown(e) {
    e.preventDefault();

    if (!start_drag.call(this, e, e.pageX, e.pageY)) return;

    document.addEventListener("mousemove", this.__mousemove);
    document.addEventListener("mouseup", this.__mouseup);
}

function mouseup(e) {
    e.preventDefault();

    document.removeEventListener("mousemove", this.__mousemove);
    document.removeEventListener("mouseup", this.__mouseup);

    stop_drag.call(this, e, e.pageX, e.pageY);
}

function mousemove(e) {
    move_drag.call(this, e, e.pageX, e.pageY);
}

function start_drag(ev, x, y) {
    var O = this.options;

    if (!O.active) return false;

    // we are already dragging with another
    // pointer
    if (this._drag_state) return false;

    TK.add_class(O.classes, "toolkit-dragging");

    if (O.cursor) {
        if (O.direction === "vertical") {
            this.global_cursor("row-resize");
        } else {
            this.global_cursor("col-resize");
        }
    }

    var value = O.get();

    this._drag_state = {
        start_value: value,
        start_pos: O.range().val2px(value),
        start_x: x,
        start_y: y,
        x: x,
        y: y,
        event: ev,
        scheduled: false,
        id: 0,
    };
    /**
     * Is fired when a user starts dragging.
     * @param {DOMEvent} event - The native DOM event.
     * @event TK.DragValue#startdrag
     */
    this.fire_event("startdrag", ev);

    return true;
}

function move_drag(ev, x, y) {
    var s = this._drag_state;
    s.event = ev;
    s.x = x;
    s.y = y;
    if (!s.scheduled) {
        s.scheduled = true;
        TK.S.add(this.__update_drag, 1);
    }
}

function update_drag() {
    var state = this._drag_state;
    state.scheduled = false;
    var O = this.options;
    var range = O.range();
    var e = state.event;

    var multi = range.options.step || 1;
    /**
     * Is fired while a user is dragging.
     * @param {DOMEvent} event - The native DOM event.
     * @event TK.DragValue#startdrag
     */
    this.fire_event("dragging", e);

    if (e.ctrlKey && e.shiftKey) {
        multi *= range.options.shift_down;
    } else if (e.shiftKey) {
        multi *= range.options.shift_up;
    }

    var dist = 0;
    switch(O.direction) {
    case "polar":
        var x = state.x - state.start_x;
        var y = state.start_y - state.y;
        var r = Math.sqrt(x * x + y * y);
        var a = Math.atan2(x, y) * (180 / Math.PI) + 360;
        if (angle_diff(O.rotation, a) < 90 - O.blind_angle / 2) {
            dist = r;
        } else if (angle_diff(O.rotation + 180, a) < 90 - O.blind_angle / 2) {
            dist = -r;
        } else return;
        break;
    case "vertical":
        dist = state.start_y - state.y;
        break;
    case "horizontal":
        dist = state.x - state.start_x;
        break;
    default:
        TK.warn("Unsupported direction:", O.direction);
    }

    dist *= multi;

    var val = O.get();
    var nval = range.px2val(state.start_pos + dist);

    if (val === nval) return;
    
    O.set(nval);

    // this might happen in case of value snapping
    if (val === O.get()) return;

    state.start_x = state.x;
    state.start_y = state.y;
    state.start_pos += dist;
    
}

function stop_drag(ev, x, y) {
    var O = this.options;

    if (this._drag_state.scheduled) {
        TK.S.remove(this.__update_drag, 1);
        this.__update_drag();
    }

    this._drag_state = false;

    TK.remove_class(O.classes, "toolkit-dragging");

    if (O.cursor) {
        if (O.direction === "vertical") {
            this.remove_cursor("row-resize");
        } else {
            this.remove_cursor("col-resize");
        }
    }
    /**
     * Is fired when a user stops dragging.
     * @param {DOMEvent} event - The native DOM event.
     * @event TK.DragValue#stopdrag
     */
    this.fire_event("stopdrag", ev);
}

function angle_diff(a, b) {
    // returns an unsigned difference between two angles
    var d = (Math.abs(a - b) + 360) % 360;
    return d > 180 ? 360 - d : d;
}
w.TK.DragValue = w.DragValue = $class({
    /**
     * TK.DragValue enables dragging an element and setting a
     * value according to the dragged distance. TK.DragValue is used in #Knob
     * or #TK.ValueButton.
     *
     * @class TK.DragValue
     * @property {Function} options.range - A function returning a {@link TK.Range} object for calculating the value.
     * @property {Element} options.node - The DOM node used for dragging.
     *  All DOM events are registered with this Element.
     * @property {Element} [options.events=options.node] - A DOM element firing the drag events.
     * @property {Element} [options.classes=options.node] - While dragging, the class
     *  <code>toolkit-dragging</code> will be added to this Element.
     * @property {Function} options.get - Callback function returning the value to drag.
     * @property {Function} options.set - Callback function for setting the value.
     * @property {integer} [options.direction="polar"] - Direction for changing the value.
     *  Can be "polar", "vertical" or "horizontal".
     * @property {boolean} [options.active=true] - If false, dragging is deactivated.
     * @property {boolean} [options.cursor=false] - If true, a global cursor is set while dragging.
     * @property {number} [options.blind_angle=20] - If options.direction is "polar",
     *  this is the angle of separation between positive and negative value changes
     * @property {number} [options.rotation=45] - Defines the angle of the center of the positive value
     *  changes. 0 means straight upward. For instance, a value of 45 leads to increasing value when
     *  moving towards top and right.
     * @extends TK.Base
     * @mixes TK.GlobalCursor
     */
    _class: "DragValue",
    Extends: TK.Base,
    Implements: GlobalCursor,
    _options: {
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
    },
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
        direction: "polar",             // direction: vertical,
                                               // horizontal or polar
        active:    true,                       // deactivate the event
        cursor:    false,                      // enable global cursors
        blind_angle: 20,                       // used when direction = "polar"
                                               // amount of degrees to
                                               // separate positive from negative
                                               // value changes
        rotation:  45,                         // used when direction = "polar"
                                               // defines the angle of
                                               // the middle of the positive
                                               // value changes. 0 means
                                               // straight upward. E.g. a
                                               // value of 45 does positive
                                               // value changes in upper and
                                               // right directions
    },
    initialize: function (options) {
        this.__touchstart = touchstart.bind(this);
        this.__touchend = touchend.bind(this);
        this.__touchmove = touchmove.bind(this);

        this.__mousedown = mousedown.bind(this);
        this.__mouseup = mouseup.bind(this);
        this.__mousemove = mousemove.bind(this);
        this.__contextmenu = function () {return false;}
        this.__update_drag = update_drag.bind(this);

        TK.Base.prototype.initialize.call(this, options);

        this.set("events", this.options.events);
        this.set("classes", this.options.classes);
        this.set("node", this.options.node);
    },
    destroy: function () {
        TK.Base.prototype.destroy.call(this);
        var node = this.options.node;

        if (node) {
            node.removeEventListener("contextmenu", this.__contextmenu);
            node.removeEventListener("mousedown",   this.__mousedown);
            node.removeEventListener("touchstart",  this.__touchstart);
        }
    },

    // GETTERS & SETTERS
    set: function (key, value) {
        var O = this.options;
        if (key === "node" && O.node) {
            O.node.addEventListener("contextmenu", this.__contextmenu);
            O.node.addEventListener("mousedown",   this.__mousedown);
            O.node.addEventListener("touchstart",  this.__touchstart);
        }
        TK.Base.prototype.set.call(this, key, value);
        switch (key) {
            case "node":
                if (value) {
                    value.addEventListener("contextmenu", this.__contextmenu);
                    value.addEventListener("mousedown",   this.__mousedown);
                    value.addEventListener("touchstart",  this.__touchstart);

                    if (!O.events) {
                        O.events = value;
                    }
                    if (!O.classes) {
                        O.classes = value;
                    }
                }
                break;
            case "events":
                if (!value && O.node) {
                    O.events = O.node;
                }
                break;
            case "classes":
                if (!value && O.node) {
                    O.classes = O.node;
                }
                break;
        }
    }
});
})(this);
