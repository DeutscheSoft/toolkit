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
w.Button = $class({
    /* @class:  Button
     * 
     * @option: label;       String; "";    Text for the buttons label
     * @option: icon;        String; "";    URL to an icon for the button
     * @option: state;       Bool;   false; State of the button
     * @option: state_color; Bool;   false; Background color of the state indication
     * 
     * @extends: Widget
     * 
     * @description:
     * Button is a simple, clickable widget to trigger funcions. It fires a
     * couple of click-related events and consists of a label and an icon.
     * Buttons are used as a base to build different other widgets from, too. */
    _class: "Button",
    Extends: Widget,
    options: {
        label:            "",
        icon:             "",
        state:            false,
        state_color:      false
    },
    
    initialize: function (options, hold) {
        // ??
        Widget.prototype.initialize.call(this, options, hold);
        /* @element: [d][c][s]element; div.toolkit-button; The main button element */
        this.element = this.widgetize(TK.element("div","toolkit-button"), true, true, true);
        this.element.id = this.options.id;
        
        if (this.options.container)
            this.set("container", this.options.container, hold);
        
        /* @element: _cell; div.toolkit-cell; An internal container for label and icon */
        this._cell  = TK.element("div","toolkit-cell");
        /* @element: _icon; img.toolkit-icon; The icon of the button */
        this._icon  = TK.element("img","toolkit-icon");
        /* @element: _label; div.toolkit-label; The label of the button */
        this._label = TK.element("div","toolkit-label");

        this._cell.appendChild(this._icon);
        this._cell.appendChild(this._label);
        this.element.appendChild(this._cell);
        
        this.set("label",       this.options.label, hold);
        this.set("icon",        this.options.icon, hold);
        this.set("state_color", this.options.state_color, hold);
        this.set("state",       this.options.state, hold);
        Widget.prototype.initialized.call(this);
    },
    destroy: function () {
        TK.destroy(this._icon);
        TK.destroy(this._label);
        TK.destroy(this.element);
        Widget.prototype.destroy.call(this);
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "container":
                if (!hold) value.appendChild(this.element);
                break;
            case "class":
                if (!hold) TK.add_class(this.element, value);
                break;
            case "label":
                if (!hold) {
                    if (value !== false) {
                        this._label.innerHTML = value;
                        this._label.style["display"] = null;
                    } else {
                        this._label.style["display"] = "none";
                    }
                }
                break;
            case "icon":
                if (!hold) {
                    if (value) {
                        this._icon.setAttribute("src", value);
                        this._icon.style["display"] = null;
                    } else {
                        this._icon.style["display"] = "none";
                    }
                }
                break;
            case "state":
                if (!hold) {
                    if (value) TK.add_class(this.element, "toolkit-active");
                    else TK.remove_class(this.element, "toolkit-active");
                    this._label.style.backgroundColor = 
                                         (this.options.state_color
                                       && this.options.state)
                                        ? this.options.state_color : null;
                }
                break;
            case "state_color":
                if (!hold) this.set("state", this.options.state);
        }
        Widget.prototype.set.call(this, key, value, hold);
    }
});
})(this);
