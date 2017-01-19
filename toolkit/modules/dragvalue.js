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
(function(w, TK){

function start_drag(value) {
    if (!value) return;

    var O = this.options;

    this.start_pos = O.range.call(this).val2px(O.get.call(this));
    /**
     * Is fired when a user starts dragging.
     *
     * @event TK.DragValue#startdrag
     *
     * @param {DOMEvent} event - The native DOM event.
     */
    this.fire_event("startdrag", this.drag_state.start);
    if (O.events) O.events.call(this).fire_event("startdrag", this.drag_state.start);
}

function movecapture(state) {
    var O = this.options;

    if (O.active === false) return false;

    if (!this.scheduled) {
        this.scheduled = true;
        TK.S.add(this._updatedrag);
    }
}

function updatedrag() {
    var O = this.options;
    var state = this.drag_state;

    this.scheduled = false;

    /* the drag was cancelled while this callback was already scheduled */
    if (!state) return;

    var range = O.range.call(this);
    var e = state.current;

    var multi = range.options.step || 1;

    if (e.ctrlKey && e.shiftKey) {
        multi *= range.options.shift_down;
    } else if (e.shiftKey) {
        multi *= range.options.shift_up;
    }

    var dist = 0;

    var v = state.vdistance();

    switch(O.direction) {
    case "polar":
        var x = v[0];
        var y = -v[1];
        var r = Math.sqrt(x * x + y * y);
        var a = Math.atan2(x, y) * (180 / Math.PI) + 360;
        if (angle_diff(O.rotation, a) < 90 - O.blind_angle / 2) {
            dist = r;
        } else if (angle_diff(O.rotation + 180, a) < 90 - O.blind_angle / 2) {
            dist = -r;
        } else return;
        break;
    case "vertical":
        dist = -v[1];
        break;
    case "horizontal":
        dist = v[0];
        break;
    default:
        TK.warn("Unsupported direction:", O.direction);
    }

    var nval = range.px2val(this.start_pos + dist * multi);
    O.set.call(this, nval);

    this.fire_event("dragging", state.current);
    if (O.events) O.events.call(this).fire_event("dragging", state.current);
}

function stop_drag(state, ev) {
    /**
     * Is fired when a user stops dragging.
     *
     * @event TK.DragValue#stopdrag
     *
     * @param {DOMEvent} event - The native DOM event.
     */
    this.fire_event("stopdrag", ev);
    var O = this.options;
    if (O.events) O.events.call(this).fire_event("stopdrag", ev);
}

function angle_diff(a, b) {
    // returns an unsigned difference between two angles
    var d = (Math.abs(a - b) + 360) % 360;
    return d > 180 ? 360 - d : d;
}
TK.DragValue = TK.class({
    /**
     * TK.DragValue enables dragging an element and setting a
     * value according to the dragged distance. TK.DragValue is used in #Knob
     * or #TK.ValueButton.
     *
     * @class TK.DragValue
     *
     * @param {Object} options
     *
     * @property {Function} options.range - A function returning a {@link TK.Range} object for calculating the value.
     * @property {Element} options.node - The DOM node used for dragging.
     *   All DOM events are registered with this Element.
     * @property {Element} [options.events=options.node] - A DOM element firing the drag events.
     * @property {Element} [options.classes=options.node] - While dragging, the class
     *   <code>toolkit-dragging</code> will be added to this Element.
     * @property {Function} options.get - Callback function returning the value to drag.
     * @property {Function} options.set - Callback function for setting the value.
     * @property {string} [options.direction="polar"] - Direction for changing the value.
     *   Can be "polar", "vertical" or "horizontal".
     * @property {boolean} [options.active=true] - If false, dragging is deactivated.
     * @property {boolean} [options.cursor=false] - If true, a global cursor is set while dragging.
     * @property {number} [options.blind_angle=20] - If options.direction is "polar",
     *   this is the angle of separation between positive and negative value changes
     * @property {number} [options.rotation=45] - Defines the angle of the center of the positive value
     *   changes. 0 means straight upward. For instance, a value of 45 leads to increasing value when
     *   moving towards top and right.
     *
     * @extends TK.Module
     *
     * @mixes TK.GlobalCursor
     */
    /**
     * Is fired while a user is dragging.
     *
     * @event TK.DragValue#startdrag
     *
     * @param {DOMEvent} event - The native DOM event.
     */
    _class: "DragValue",
    Extends: TK.DragCapture,
    Implements: TK.GlobalCursor,
    _options: {
        get: "function",
        set: "function",
        range: "function",
        events: "object",
        classes: "object",
        direction: "int",
        active: "boolean",
        cursor: "boolean",
        blind_angle: "number",
        rotation: "number",
    },
    options: {
        range:     function () { return this.parent; },
        classes:   false,
        get:       function () { return this.parent.options.value; },
        set:       function (v) { this.parent.userset("value", v); },
        events:    function () { return this.parent; },
        direction: "polar",
        active:    true,
        cursor:    false,
        blind_angle: 20,
        rotation:  45,
    },
    static_events: {
        set_state: start_drag,
        stopcapture: stop_drag,
        startcapture: function() {
            if (!this.options.active) return true;
        },
        movecapture: movecapture,
        startdrag: function(ev) {
            TK.S.add(function() {
                var O = this.options;
                TK.add_class(O.classes || O.node, "toolkit-dragging");
                if (O.cursor) {
                    if (O.direction === "vertical") {
                        this.global_cursor("row-resize");
                    } else {
                        this.global_cursor("col-resize");
                    }
                }
            }.bind(this), 1);
        },
        stopdrag: function() {
            TK.S.add(function() {
                var O = this.options;
                TK.remove_class(O.classes || O.node, "toolkit-dragging");

                if (O.cursor) {
                    if (O.direction === "vertical") {
                        this.remove_cursor("row-resize");
                    } else {
                        this.remove_cursor("col-resize");
                    }
                }
            }.bind(this), 1);
        },
    },
    initialize: function (widget, options) {
        TK.DragCapture.prototype.initialize.call(this, widget, options);

        this.set("events", this.options.events);
        this.set("classes", this.options.classes);
        this._updatedrag = updatedrag.bind(this);
        this.scheduled = false;
        this.start_pos = 0;
    },
});
})(this, this.TK);
