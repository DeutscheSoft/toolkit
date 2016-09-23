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
w.TK.Button = w.Button = $class({
    /**
     * TK.Button is a simple, clickable widget to trigger funcions. It fires a
     * couple of click-related events and consists of a label and an icon.
     * Buttons are used as a base to build different other widgets from, too.
     * 
     * @property {string} [options.label=""] - Text for the button label
     * @property {string} [options.icon=""] - URL to an icon for the button
     * @property {boolean} [options.state=false] - TK.State of the button
     * @property {boolean} [options.state_color=false] - Background color of the state indication
     * @property {integer} [options.layout="vertical"] - Determine the arrangement of label and icon.
     * "vertical" means icon on top of the label, "horizontal" puts the icon left to the label.
     * 
     * @extends TK.Widget
     * 
     * @class TK.Button
     */
    _class: "Button",
    Extends: TK.Widget,
    _options: Object.assign(Object.create(TK.Widget.prototype._options), {
        label: "string",
        icon: "string",
        state: "boolean",
        state_color: "string",
        layout: "int",
    }),
    options: {
        label:            "",
        icon:             false,
        state:            false,
        state_color:      false,
        layout:           "vertical"
    },
    initialize: function (options) {
        var E;
        TK.Widget.prototype.initialize.call(this, options);
        if (!(E = this.element)) this.element = E = TK.element("div");
        TK.add_class(E, "toolkit-button");
        this.widgetize(E, true, true, true);
        
        /** @member {HTMLDivElement} TK.Button#_cell - An internal container for label and icon.
         *      Has class <code>toolkit-cell</code>
         */
        this._cell  = TK.element("div","toolkit-cell");
        /** @member {HTMLImageElement} TK.Button#_icon - The icon of the button. Has class <code>toolkit-icon</code> 
         */
        this._icon  = TK.element("img","toolkit-icon");
        /** @member {HTMLDivElement} TK.Button#_label - The label of the button. Has class <code>toolkit-label</code>
         */
        this._label = TK.element("div","toolkit-label");
        
        this._cell.appendChild(this._icon);
        this._cell.appendChild(this._label);
        E.appendChild(this._cell);
    },
    destroy: function () {
        this._icon.remove();
        this._label.remove();
        this.element.remove();
        TK.Widget.prototype.destroy.call(this);
    },

    redraw: function() {
        TK.Widget.prototype.redraw.call(this);
        var I = this.invalid;
        var O = this.options;
        var E = this.element;
        var _icon = this._icon;
        var _label = this._label;
        var value;
        
        if (I.layout) {
            I.layout = false;
            if (O.layout === "vertical") {
                this.remove_class("toolkit-horizontal");
                this.add_class("toolkit-vertical");
            } else {
                this.remove_class("toolkit-vertical");
                this.add_class("toolkit-horizontal");
            }
        }

        if (I["class"]) {
            I["class"] = false;
            if (O["class"])
                TK.add_class(E, O["class"]);
        }
        if (I.label) {
            I.label = false;
            value = O.label;
            if (value !== false) {
                TK.set_content(_label, value);
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
