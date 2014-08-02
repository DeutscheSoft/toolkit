 /* toolkit. provides different widgets, implements and modules for 
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
 
Button = $class({
    // Button is a simple, clickable widget to trigger funcions. They fire a
    // couple of click-related events and consist of a label and an icon.
    // Buttons are used as a base to build different other widgets from.
    _class: "Button",
    Extends: Widget,
    options: {
        label:            "",    // text for the button
        icon:             "",    // URL to an icon for this button
        state:            false, // state of the button (bool)
        state_color:      false  // background color of the state indication
    },
    
    initialize: function (options, hold) {
        // ??
        Widget.prototype.initialize.call(this, options, hold);
        this.element = this.widgetize(toolkit.element("div","toolkit-button"), true, true, true);
        this.element.id = this.options.id;
        
        if (this.options.container)
            this.set("container", this.options.container, hold);
        
        this._cell  = toolkit.element("div","toolkit-cell");
        this._icon  = toolkit.element("img","toolkit-icon");
        this._label = toolkit.element("div","toolkit-label");

        this._cell.appendChild(this._icon);
        this._cell.appendChild(this._label);
        this.element.appendChild(this._cell);
        
        this.set("label",       this.options.label, hold);
        this.set("icon",        this.options.icon, hold);
        this.set("state_color", this.options.state_color, hold);
        this.set("state",       this.options.state, hold);
        this.initialized();
    },
    destroy: function () {
        this._icon.destroy();
        this._label.destroy();
        this.element.destroy();
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
                if (!hold) this.element.classList.add(value);
                break;
            case "label":
                if (!hold) {
                    if (value) {
                        this._label.innerHTML = value;
                        this._label.style["display"] = "block";
                    } else {
                        this._label.style["display"] = "none";
                    }
                }
                break;
            case "icon":
                if (!hold) {
                    if (value) {
                        this._icon.set("src", value);
                        this._icon.style["display"] = "block";
                    } else {
                        this._icon.style["display"] = "none";
                    }
                }
                break;
            case "state":
                if (!hold) {
                    if (value) this.element.classList.add("toolkit-active");
                    else this.element.classList.remove("toolkit-active");
                    this._label.style["background-color"] = 
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
