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
        icon:             false,
        state:            false,
        state_color:      false,
        container:        false
    },
    
    initialize: function (options) {
        Widget.prototype.initialize.call(this, options);
        /* @element: element [d][c][s]; div.toolkit-button; The main button element */
        this.element = this.widgetize(TK.element("div","toolkit-button"), true, true, true);
        
        /* @element: _cell; div.toolkit-cell; An internal container for label and icon */
        this._cell  = TK.element("div","toolkit-cell");
        /* @element: _icon; img.toolkit-icon; The icon of the button */
        this._icon  = TK.element("img","toolkit-icon");
        /* @element: _label; div.toolkit-label; The label of the button */
        this._label = TK.element("div","toolkit-label");

        this._cell.appendChild(this._icon);
        this._cell.appendChild(this._label);
        this.element.appendChild(this._cell);
    },
    destroy: function () {
        this._icon.remove();
        this._label.remove();
        this.element.remove();
        Widget.prototype.destroy.call(this);
    },

    redraw: function() {
        Widget.prototype.redraw.call(this);
        var I = this.invalid;
        var O = this.options;
        var E = this.element;
        var _icon = this._icon;
        var _label = this._label;
        var value;

        if (I["class"]) {
            I["class"] = false;
            if (O["class"])
                TK.add_class(E, O["class"]);
        }
        if (I.label) {
            I.label = false;
            value = O.label;
            if (value !== false) {
                _label.innerHTML = value;
                _label.style["display"] = null;
            } else {
                _label.style["display"] = "none";
            }
        }
        if (I.icon) {
            I.icon = false;
            value = O.icon;
            if (value) {
                _icon.setAttribute("src", value);
                _icon.style["display"] = null;
            } else {
                _icon.style["display"] = "none";
            }
        }
        if (I.state || I.state_color) {
            I.state_color = I.state = false;
            value = O.state;
            if (value) {
                TK.add_class(E, "toolkit-active");
                _label.style.backgroundColor = (O.state_color && value) ? O.state_color : null;
            } else {
                TK.remove_class(E, "toolkit-active");
            }
        }
    }
});
})(this);
