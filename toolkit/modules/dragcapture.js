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
var document = w.document;

/* this has no global symbol */
function CaptureState(start) {
    this.start = start;
    this.prev = start;
    this.current = start;
}
CaptureState.prototype = {
    /* distance from start */
    distance: function() {
        var v = this.vdistance();
        return Math.sqrt(v[0]*v[0] + v[1]*v[1]);
    },
    set_current: function(ev) {
        this.prev = this.current;
        this.current = ev;
        return true;
    },
};
/* general api */
function startcapture(state) {
    if (this.drag_state) return false;
    if (this.fire_event("startcapture", state, state.start) === false) return false;
    
    this.drag_state = state;
    this.set("state", true);

    return true;
}
function movecapture(ev) {
    var d = this.drag_state;
    if (!d.set_current(ev) || this.fire_event("movecapture", d) === false) {
        stopcapture.call(this, ev);
        return false;
    }
}
function stopcapture(ev) {
    if (this.drag_state === null) return;
    this.fire_event("stopcapture", this.drag_state, ev);
    this.set("state", false);
    this.drag_state = null;
}

/* mouse handling */
function MouseCaptureState(start) {
    CaptureState.call(this, start);
}
MouseCaptureState.prototype = Object.assign(Object.create(CaptureState.prototype), {
    set_current: function(ev) {
        var start = this.start;
        /* If the buttons have changed, we assume that the capture has ended */
        if (start.buttons !== ev.buttons || start.which !== ev.which) return false;
        return CaptureState.prototype.set_current.call(this, ev);
    },
    vdistance: function() {
        var start = this.start;
        var current = this.current;
        return [ current.clientX - start.clientX, current.clientY - start.clientY ];
    },
    prev_distance: function() {
        var prev = this.prev;
        var current = this.current;
        return [ current.clientX - prev.clientX, current.clientY - prev.clientY ];
    },
});
function mousedown(ev) {
    if (!startcapture.call(this, new MouseCaptureState(ev))) return;
    ev.preventDefault();
    if (!this.__mousemove) {
        this.__mouseup = mouseup.bind(this);
        this.__mousemove = mousemove.bind(this);
    }
    document.addEventListener("mousemove", this.__mousemove);
    document.addEventListener("mouseup", this.__mouseup);
}
function mousemove(ev) {
    if (movecapture.call(this, ev) === false) {
        document.removeEventListener("mousemove", this.__mousemove);
        document.removeEventListener("mouseup", this.__mouseup);
        this.__mouseup = null;
        this.__mousemove = null;
    }
}
function mouseup(ev) {
    document.removeEventListener("mousemove", this.__mousemove);
    document.removeEventListener("mouseup", this.__mouseup);
    this.__mouseup = null;
    this.__mousemove = null;
    stopcapture.call(this, ev);
}

/* touch handling */
function TouchCaptureState(start) {
    CaptureState.call(this, start);
    var touch = start.changedTouches.item(0);
    this.stouch = touch;
    this.ptouch = touch;
    this.ctouch = touch;
}
TouchCaptureState.prototype = Object.assign(Object.create(CaptureState.prototype), {
    find_touch: function(ev) {
        var id = this.stouch.identifier;
        var touches = ev.changedTouches;
        var touch;

        for (var i = 0; i < touches.length; i++) {
            touch = touches.item(i);
            if (touch.identifier === id) return touch;
        }

        return null;
    },
    set_current: function(ev) {
        var touch = this.find_touch(ev);
        this.ptouch = this.ctouch;
        this.ctouch = touch;
        return CaptureState.prototype.set_current.call(this, ev);
    },
    vdistance: function() {
        var start = this.stouch;
        var current = this.ctouch;
        return [ current.clientX - start.clientX, current.clientY - start.clientY ];
    },
    prev_distance: function() {
        var prev = this.ptouch;
        var current = this.ctouch;
        return [ current.clientX - prev.clientX, current.clientY - prev.clientY ];
    },
});
function touchstart(ev) {
    /* if cancelable is false, this is an async touchstart, which happens
     * during scrolling */
    if (!ev.cancelable) return;

    /* the startcapture event handler has return false. we do not handle this
     * pointer */
    if (!startcapture.call(this, new TouchCaptureState(ev))) return;

    ev.preventDefault();
    ev.stopPropagation();
    return false;
}
function touchmove(ev) {
    /* we are scrolling, ignore the event */
    if (!ev.cancelable) return;
    var state = this.drag_state;
    var touch = state.find_touch(ev);
    /* if we cannot find the right touch, some other touchpoint
     * triggered this event and we do not care about that */
    if (!touch) return;
    /* if movecapture returns false, the capture has ended */
    if (movecapture.call(this, ev) === false) {
    }
    ev.preventDefault();
    ev.stopPropagation();
    return false;
}
function touchend(ev) {
    if (!ev.cancelable) return;
    stopcapture.call(this, ev);
    ev.stopPropagation();
    ev.preventDefault();
    return false;
}
function touchcancel(ev) {
    stopcapture.call(this, ev);
}
var dummy = function() {};

w.TK.DragCapture = $class({
    Extends: TK.Base,
    _class: "DragCapture",
    _options: {
        node: "object",
        state: "boolean",
    },
    static_events: {
        set_node: function(value) {
            this.delegate_events(value);
        },
        touchstart: touchstart,
        touchmove: touchmove,
        touchend: touchend,
        touchcancel: touchcancel,
        mousedown: mousedown,
        contextmenu: function() { return false; },
    },
    delegate_events: function(elem) {
        /* NOTE: this works around a bug in chrome. */
        var old = this.__event_target;
        if (old && old.parentNode) old.parentNode.removeEventListener("touchstart", dummy);
        if (elem && elem.parentNode) elem.parentNode.addEventListener("touchstart", dummy);
        TK.Base.prototype.delegate_events.call(this, elem);
    },
    initialize: function(O) {
        TK.Base.prototype.initialize.call(this, O);
        this.drag_state = null;
        this.set("node", O.node);
        this.start_value = 0;

        this.__mouseup = null;
        this.__mousemove = null;
    },
});
})(this);
