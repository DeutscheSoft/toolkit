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
 /**
 * The <code>useraction</code> event is emitted when a widget gets modified by user interaction.
 * The event is emitted for the option <code>state</code>.
 *
 * @event TK.Toggle#useraction
 */
"use strict";
(function(w){ 
function mousedown(e) {
    if (this.__toggleclick) return;
    this.__toggleclick = this.__toggledown = true;
    if (this.options.press) {
        this.toggle();
        this.fire_event("useraction", "state", this.options.state);
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
    this.fire_event("useraction", "state", this.options.state);
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
        this.add_event("pointerdown", mousedown);
        this.add_event("pointerup", mouseup);
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
        clear_to.call(this);
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
    /* INTERNAL */
    cancel_press: function () {
        if (!this.__tp) return;
        this.__tp = false;
        this.__tt = false;
        this.__tm = false;
        var state = !this.options.state;
        this.set("state", state);
    },
});
})(this);
