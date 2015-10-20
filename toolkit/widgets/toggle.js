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
        var value = O.state;
        
        var icon  = O[value ? (O.icon_active
                                       ? "icon_active" : "icon") : "icon"];
        if (icon) this._icon.setAttribute("src", icon);
                   
        var label = O[value ? (O.label_active
                                       ? "label_active" : "label") : "label"];
                                       
        if (label) this._label.innerHTML = label;
    },
    toggle: function (hold) {
        clear_to.call(this);
        this.set("state", !this.options.state);
        this.fire_event("toggled", this.options.state);
        this.fire_event("useraction", "state", this.options.state);
    },
    cancel_press: function () {
        if (!this.__tp)
            return;
        this.__tp = false;
        this.__tt = false;
        this.__tm = false;
        this.set("state", !this.get("state"));
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        Button.prototype.set.call(this, key, value, hold);
        switch (key) {
            case "icon_active":
            case "icon":
            case "label_active":
            case "label":
            case "state":
                if (!hold) this.redraw();
                break;
        }
    }
});
})(this);
