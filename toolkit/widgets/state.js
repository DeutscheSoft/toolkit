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
w.TK.State = w.State = $class({
    /* @class: State
     * @description: The State widget is a multi-functional adaption of a traditional LED. It
     * is able to show different colors as well as on/off states. The
     * "brightness" can be set seamlessly. Classes can be used to display
     * different styles. State extends Widget.
     */
    _class: "State",
    Extends: Widget,
    _options: Object.assign(Object.create(Widget.prototype._options), {
        state: "int",
        color: "string",
        opacity: "number",
    }),
    options: {
        state:           0,     // the initial state (0 ... 1)
        color:           "red", // the base color
        opacity:         0.8    // the opacity of the mask when state = 0
    },
    initialize: function (options) {
        Widget.prototype.initialize.call(this, options);

        var E = toolkit.element("div","toolkit-state");
        
        this.element = this.widgetize(E, true, true, true);
        
        this._mask   = TK.element("div","toolkit-mask");

        E.appendChild(this._mask);
    },
    destroy: function () {
        this._mask.remove();
        this.element.remove();
        Widget.prototype.destroy.call(this);
    },

    redraw: function() {
        Widget.prototype.redraw.call(this);
        var I = this.invalid;
        var O = this.options;

        if (I.color) {
            I.color = false;
            this.element.style["background-color"] = O.color;
        }

        if (I.state || I.opacity) {
            I.state = I.opacity = false;
            this._mask.style["opacity"] = "" + ((1 - (O.state ? 1 : 0)) * O.opacity);
        }
    },
    
    // GETTER & SETTER
    set: function (key, value) {
        Widget.prototype.set.call(this, key, value);
        switch (key) {
            case "color":
                this.fire_event("colorchanged", value);
                break;
            case "state":
                this.fire_event("statechanged", value);
                break;
        }
    }
});
})(this);
