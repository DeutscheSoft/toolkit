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

TK.Button = TK.class({
    /**
     * TK.Button is a simple, clickable widget to trigger funcions. It fires a
     * couple of click-related events and consists of a label and an icon.
     * Buttons are used as a base to build different other widgets from, too,
     * e.g. {@link TK.Toggle}, {@link TK.ConfirmButton} and {@link TK.Select}.
     * 
     * @param {Object} [options={ }] - An object containing initial options.
     * 
     * @property {String|Boolean} [options.label=false] - Text for the button label.
     *   If <code>false</code>, the label is removed from DOM.
     * @property {String|Boolean} [options.icon=false] - URL to an icon for the button OR
     *   icon class (see styles/fonts/Toolkit.html). If <code>false</code>, the icon
     *   is removed from DOM.
     * @property {Boolean} [options.state=false] - TK.State of the button
     * @property {Integer} [options.layout="vertical"] - Define the arrangement
     *   of label and icon. <code>vertical</code> means icon above the label,
     *   <code>horizontal</code> places the icon left to the label.
     * 
     * @extends TK.Widget
     * 
     * @class TK.Button
     */
    _class: "Button",
    Extends: TK.Widget,
    _options: Object.assign(Object.create(TK.Widget.prototype._options), {
        label: "string|boolean",
        icon: "string|boolean",
        state: "boolean",
        layout: "string",
    }),
    options: {
        label:            false,
        icon:            false,
        state:            false,
        layout:           "vertical"
    },
    initialize: function (options) {
        var E;
        TK.Widget.prototype.initialize.call(this, options);
        /**
         * @member {HTMLDivElement} TK.Button#element - The main DIV element.
         *   Has class <code>toolkit-button</code>.
         */
        if (!(E = this.element)) this.element = E = TK.element("div");
        TK.add_class(E, "toolkit-button");
        this.widgetize(E, true, true, true);
        
        /**
         * @member {HTMLDivElement} TK.Button#_cell - An internal container for label and icon.
         *  Has class <code>toolkit-cell</code>
         */
        this._cell  = TK.element("div","toolkit-cell");
        E.appendChild(this._cell);
        
        if (options.label)
            this.options.show_label = true;
        if (options.icon)
            this.options.show_icon = true;
    },
    destroy: function () {
        TK.Widget.prototype.destroy.call(this);
    },

    redraw: function() {
        TK.Widget.prototype.redraw.call(this);
        var I = this.invalid;
        var O = this.options;
        var E = this.element;
        
        if (I.layout) {
            I.layout = false;
            TK.toggle_class(E, "toolkit-vertical", O.layout === "vertical");
            TK.toggle_class(E, "toolkit-horizontal", O.layout !== "vertical");
        }

        if (I.state) {
            I.state = false;
            TK.toggle_class(E, "toolkit-active", O.state);
        }

        /* FIXME: This case is not solved using the ChildElement API in order
         * to support TK.Toggle */

        if (O.show_label && I.validate("label")) {
            var _label = this._label;
            var has_value = O.label !== false;
            if (has_value) {
                TK.set_content(_label, O.label);
            }
            TK.toggle_class(this.element, "toolkit-has-label", has_value);
        }
    },
});
/**
 * @member {TK.Icon} TK.Button#icon - The {@link TK.Icon} widget.
 */
TK.ChildWidget(TK.Button, "icon", {
    create: TK.Icon,
    option: "icon",
    map_options: {icon:"icon"},
    append: function() {
        this._cell.appendChild(this.icon.element);
    },
    toggle_class: true,
});
/**
 * @member {HTMLDivElement} TK.Button#_label - The label of the button.
 *      Has class <code>toolkit-label</code>.
 */
TK.ChildElement(TK.Button, "label", {
    show: true,
    option: "label",
    inherit_options: true,
    map_options: {label:"label"},
    append: function() {
        this._cell.appendChild(this._label);
    },
});
})(this, this.TK);
