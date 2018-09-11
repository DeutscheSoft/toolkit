/*
 * This file is part of Toolkit.
 *
 * Toolkit is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * Toolkit is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU General
 * Public License along with this program; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA  02110-1301  USA
 */
"use strict";
(function(w, TK){

/* Abstract toggle logic */

function reset_delay_to () {
    w.clearTimeout(this.__delayed_to);
    this.__delayed_to = -1;
    this.remove_class("toolkit-delayed");
}

function toggle(O) {
    if (this.userset("state", !O.state) === false) return;
    this.fire_event("toggled", O.state);
}
function press_start() {
    var O = this.options;
    this.__press_start_time = Date.now();
    if (O.delay && this.__delayed_to < 0) {
        this.__delayed_to = w.setTimeout((function (t) {
            return function () { press_start.call(t); }
        })(this), O.delay);
        this.add_class("toolkit-delayed");
        return;
    }
    this.remove_class("toolkit-delayed");
    if (O.delay && this.__delayed_to >= 0) {
        toggle.call(this, O);
    }
    if (O.press) toggle.call(this, O);
}
function press_end() {
    var O = this.options;
    if (O.delay && this.__delayed_to >= 0) {
        reset_delay_to.call(this);
        return;
    }
    var t = Date.now() - this.__press_start_time;
    if ((O.toggle && (!O.press || t > O.press)) || (!O.toggle && O.press)) {
        toggle.call(this, O);
    }
}
function press_cancel() {
    var O = this.options;
    if (O.delay && this.__delayed_to >= 0) {
        reset_delay_to.call(this);
        return;
    }
    /* this is definitely not a click, its a cancel by leaving the
     * button with mouse or finger while pressing */
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
    e.preventDefault();
    press_end.call(this);

    this.remove_event("touchend", touchend);
    this.remove_event("touchcancel", touchleave);
    this.remove_event("touchleave", touchleave);
}
function touchleave(e) {
    if (!is_current_touch.call(this, e)) return;
    this.__touch_id = false;
    e.preventDefault();
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
    e.preventDefault();
    e.stopPropagation();
    return false;
}
function contextmenu(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}
var class_regex = /[^A-Za-z0-9_\-]/;
function is_class_name (str) {
    return !class_regex.test(str);
}

TK.Toggle = TK.class({
    /**
     * A toggle button. The toggle button can either be pressed (which means that it will
     * switch its state as long as it is pressed) or toggled. Its behavior is controlled by
     * the two options <code>press</code> and <code>toggle</code>.
     *
     * @class TK.Toggle
     * 
     * @extends TK.Button
     *
     * @param {Object} options
     * 
     * @property {Boolean} [options.state=false] - The state of the button.
     * @property {Boolean} [options.toggle=true] - If true, the button is toggled by a click.
     * @property {Integer} [options.press=0] - Controls press behavior. If <code>options.toggle</code>
     *   is <code>false</code> and this option is <code>true</code>, the toggle button will toggle until
     *   released. If <code>options.toggle</code> is true and this option is a positive integer, it is
     *   interpreted as a milliseconds timeout. When pressing a button longer than this timeout, it will
     *  be toggled until released, otherwise it will toggle permanently.
     * @property {Integer} [options.delay] - Delay all actions for n milliseconds. While actions are
     *   delayed, the widget has class <code>toolkit-delayed</code>.
     * @property {String} [options.icon_active] - An optional icon which is only displayed
     *   when the button toggle state is <code>true</code>.
     * @property {String} [options.label_active] - An optional label which is only displayed
     *   when the button toggle state is <code>true</code>.
     */
    _class: "Toggle",
    Extends: TK.Button,
    _options: Object.assign(Object.create(TK.Button.prototype._options), {
        label_active: "string",
        icon_active: "string",
        press: "int",
        delay: "int",
        toggle: "boolean",
    }),
    options: {
        label_active:  false,
        icon_active:   false,
        icon_inactive: false,
        press:         0,
        delay:         0,
        toggle:        true,
    },
    static_events: {
        mousedown: mousedown,
        touchstart: touchstart,
        contextmenu: contextmenu,
    },
    
    initialize: function (options) {
        TK.Button.prototype.initialize.call(this, options);
        /**
         * @member {HTMLDivElement} TK.Toggle#element - The main DIV container.
         *   Has class <code>toolkit-toggle</code>.
         */
        TK.add_class(this.element, "toolkit-toggle");
        this.__press_start_time = 0;
        this.__touch_id = false;
        this.__delayed_to = -1;
    },
    
    redraw: function () {
        var O = this.options;
        var I = this.invalid;
        var E = this.element;
        var tmp;
        
        if (O.show_icon && (I.validate("icon_active", "icon") || I.state)) {
            tmp = (O.state && O.icon_active) || O.icon;
            var icon = this.icon.element;
            
            var old = this._icon_old;
            if (old && is_class_name(old))
                TK.remove_class(icon, old);
            old = this._icon_active_old;
            if (old && is_class_name(old))
                TK.remove_class(icon, old);
            TK.remove_class(icon, O.icon);
            TK.remove_class(icon, O.icon_active);
            
            if (tmp) {
                if (is_class_name(tmp)) {
                    icon.style["background-image"] = null;
                    TK.add_class(icon, tmp);
                } else {
                    icon.style["background-image"] = "url(\"" + tmp + "\")";
                }
            }
            TK.toggle_class(E, "toolkit-has-icon", !!tmp);
            I.icon = false;
        }

        if (O.show_label && (I.validate("label_active", "label") || I.state)) {
            tmp = (O.state && O.label_active) || O.label;
            if (tmp !== false) {
                TK.set_content(this._label, tmp);
            }
            TK.toggle_class(E, "toolkit-has-label", !!tmp);
            I.label = false;
        }
        TK.Button.prototype.redraw.call(this);
    },
    /**
     * Toggle the button state.
     *
     * @method TK.Toggle#toggle
     * 
     * @emits TK.Toggle#toggled
     */
    toggle: function () {
        toggle.call(this, this.options);
        /**
         * Is fired when the button was toggled.
         * 
         * @event TK.Toggle#toggled
         * 
         * @param {boolean} state - The state of the {@link TK.Toggle}.
         */
    },
    set: function (key, val) {
        if (key == "icon_active") {
            this._icon_active_old = this.options.icon_active;
        }
        return TK.Button.prototype.set.call(this, key, val);
    },
});
})(this, this.TK);
