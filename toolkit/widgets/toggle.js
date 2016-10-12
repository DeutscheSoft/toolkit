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

/* Abstract toggle logic */

function toggle(O) {
    var state = !O.state;
    state = this.set("state", state);
    this.fire_event("useraction", "state", state);
}
function press_start() {
    var O = this.options;
    this.__press_start_time = Date.now();

    if (O.press) toggle.call(this, O);
}
function press_end() {
    var O = this.options;
    var t = Date.now() - this.__press_start_time;

    if ((O.toggle && (!O.press || t > O.press)) || (!O.toggle && O.press)) {
        toggle.call(this, O);
    }
}
function press_cancel() {
    var O = this.options;

    /* this is definitely not a click, its a cancel */

    if (O.press) toggle.call(this, O);
}

/* MOUSE handling */
function mouseup(e) {
    this.remove_event("mouseup", mouseup);
    this.remove_event("mouseleave", mouseleave);
    press_end.call(this);
}
function mouseleave(e) {
    this.remove_event("mouseup", mouseup);
    this.remove_event("mouseleave", mouseleave);
    press_cancel.call(this);
}
function mousedown(e) {
    /* only left click please */
    if (e.button) return true;
    press_start.call(this);
    this.add_event("mouseup", mouseup);
    this.add_event("mouseleave", mouseleave);
}

/* TOUCH handling */
function is_current_touch(ev) {
    var id = this.__touch_id;
    var i;
    for (i = 0; i < ev.changedTouches.length; i++) {
        if (ev.changedTouches[i].identifier === id) {
            return true;
        }
    }

    return false;
}

function touchend(e) {
    if (!is_current_touch.call(this, e)) return;
    this.__touch_id = false;
    press_end.call(this);

    this.remove_event("touchend", touchend);
    this.remove_event("touchcancel", touchleave);
    this.remove_event("touchleave", touchleave);
}
function touchleave(e) {
    if (!is_current_touch.call(this, e)) return;
    this.__touch_id = false;
    press_cancel.call(this);

    this.remove_event("touchend", touchend);
    this.remove_event("touchcancel", touchleave);
    this.remove_event("touchleave", touchleave);
}
function touchstart(e) {
    if (this.__touch_id !== false) return;
    this.__touch_id = e.targetTouches[0].identifier;
    press_start.call(this);
    this.add_event("touchend", touchend);
    this.add_event("touchcancel", touchleave);
    this.add_event("touchleave", touchleave);
}
    
w.TK.Toggle = w.Toggle = $class({
    /**
     * A toggle button.
     *
     * @class TK.Toggle
     * @extends TK.Button
     *
     * @param {Object} options
     * @property {boolean} [options.state=false] - The state of the button.
     * @property {boolean} [options.toggle=true] - If true, the toggle button does not switch
     *  back to its original state on release.
     * @property {integer} [options.press=0] - Time in milliseconds. If the button is released
     *  after this timeout, the button state will not toggle back.
     * @property {string} [options.icon_active] - An optional icon which is only displayed
     *  when the button toggle state is <code>true</code>.
     * @property {string} [options.label_active] - An optional label which is only displayed
     *  when the button toggle state is <code>true</code>.
     */
    /**
     * The <code>useraction</code> event is emitted if the button state is changed by a user
     * interaction. It is emitted for the <code>state</code> option.
     *
     * @event TK.Toggle#useraction
     */
    _class: "Toggle",
    Extends: TK.Button,
    _options: Object.assign(Object.create(TK.Button.prototype._options), {
        label_active: "string",
        icon_active: "string",
        press: "int",
        toggle: "boolean",
        state: "boolean",
    }),
    options: {
        label_active:  false, // the label for the active toggle, false for default label
        icon_active:   false, // this icon of the active toggle, false for default icon
        press:         0,     // time in milliseconds after a press is interpreted as a toggle, 0 to disable press toggle
        toggle:        true,  // button is toggleable
        state:         false
    },
    
    initialize: function (options) {
        TK.Button.prototype.initialize.call(this, options);
        TK.add_class(this.element, "toolkit-toggle");
        this.add_event("mousedown", mousedown);
        this.add_event("touchstart", touchstart, true, true);
        this.add_event("contextmenu", function(ev) {}, true, true);
        this.__press_start_time = 0;
        this.__touch_id = false;
    },
    
    redraw: function () {
        var O = this.options;
        var I = this.invalid;
        var tmp;
        
        // NOTE: we do not call TK.Button.redraw here, since it overwrites labels and icons
        // NOTE2: unfortunately this doesn't work cause button sets some CSS classes
        // so the solution is to remember the relevant values and reset them after
        // calling TK.Button.prototype.redraw
        var I_ = { icon_active: I.icon_active, label_active: I.label_active, icon: I.icon, label: I.label, state: I.state };
        TK.Button.prototype.redraw.call(this);
        I.icon_active = I.icon_active; I.label_active = I_.label_active; I.icon = I_.icon; I.label = I_.label, I.state = I_.state;
        
        if (I.validate("icon_active", "icon") || I.state) {
            if (O.state) {
                tmp = O.icon_active || O.icon;
            } else {
                tmp = O.icon;
            }

            if (tmp) this._icon.setAttribute("src", tmp);
            else this._icon.removeAttribute("src");
        }

        if (I.validate("label_active", "label", "state")) {
            if (O.state) {
                tmp = O.label_active || O.label;
            } else {
                tmp = O.label;
            }

            this._label.innerHTML = tmp || "";
        }
    },
    /**
     * Toggle the button state.
     *
     * @method TK.Toggle#toggle
     */
    toggle: function () {
        var state = !this.options.state;
        this.set("state", state);
        /**
         * Is fired when the toggle button was clicked by the user.
         * @type{boolean}
         * @event TK.Toggle#toggled
         */
        this.fire_event("toggled", state);
        /**
         * Is fired when the toggle is manipulated by the user.
         * @type {boolean}
         * @event TK.Toggle#useraction
         */
        this.fire_event("useraction", "state", state);
    },
});
})(this);
