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
function mousedown(e) {
    if (this.__toggleclick) return;
    this.__toggleclick = this.__toggledown = true;
    if (this.options.press) {
        this.toggle();
        this.__toto = window.setTimeout(function () {
            this.__toggleclick = false;
        }.bind(this), this.options.press);
    }
    e.preventDefault();
    return false;
}
function mouseup(e) {
    if (!this.__toggledown) return;
    var O = this.options;
    this.__toggledown = false;
    if ((O.press && (this.__toggleclick && O.toggle))
    || (!O.press && !O.toggle)) {
        // do not toggle
        clear_to.call(this);
        this.__toggleclick = false;
        return;
    }
    this.toggle();
    this.__toggleclick = false;
    e.preventDefault();
    return false;
}
function clear_to() {
    if (this.__toto) {
        window.clearTimeout(this.__toto);
        this.__toto = null;
    }
}
    
w.Toggle = $class({
    _class: "Toggle",
    Extends: Button,
    options: {
        label_active:  false, // the label for the active toggle, false for default label
        icon_active:   false, // this icon of the active toggle, false for default icon
        press:         0,     // time in milliseconds after a press is interpreted as a toggle, 0 to disable press toggle
        toggle:        true,  // button is toggleable
        state:         false
    },
    
    initialize: function (options, hold) {
        Button.prototype.initialize.call(this, options, hold);
        TK.add_class(this.element, "toolkit-toggle");
        this.add_event("pointerdown", mousedown);
        this.add_event("pointerup", mouseup);
    },
    
    redraw: function () {
        var O = this.options;
        var I = this.invalid;
        var tmp;

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

        // NOTE: we do not call Button.redraw here, since it overwrites labels and icons
        Widget.prototype.redraw.call(this);
    },
    toggle: function (hold) {
        var state = !this.options.state;
        clear_to.call(this);
        this.set("state", state);
        this.fire_event("toggled", state);
        this.fire_event("useraction", "state", state);
    },
    cancel_press: function () {
        if (!this.__tp) return;
        this.__tp = false;
        this.__tt = false;
        this.__tm = false;
        var state = !this.options.state;
        this.set("state", state);
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        Button.prototype.set.call(this, key, value, hold);
    }
});
})(this);
