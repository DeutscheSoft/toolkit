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
w.State = $class({
    // The State widget is a multi-functional adaption of a traditional LED. It
    // is able to show different colors as well as on/off states. The
    // "brightness" can be set seamlessly. Classes can be used to display
    // different styles. State extends Widget.
    _class: "State",
    Extends: Widget,
    options: {
        state:           0,     // the initial state (0 ... 1)
        color:           "red", // the base color
        container:       false,
        opacity:         0.8    // the opacity of the mask when state = 0
    },
    initialize: function (options) {
        Widget.prototype.initialize.call(this, options);
        
        this.element = this.widgetize(toolkit.element("div","toolkit-state"), true, true, true);
        this.element.id = this.options.id;
        
        this._over   = TK.element("div","toolkit-over");
        this._mask   = TK.element("div","toolkit-mask");

        this.element.appendChild(this._over);
        this.element.appendChild(this._mask);
        
        this.element.style.overflow = "hidden";
        TK.set_styles(this._over, {
            "position": "absolute",
            "zIndex": "1",
            "width"  : "100%",
            "height" : "100%"
        });
        TK.set_styles(this._mask, {
            "position": "absolute",
            "zIndex": "2",
            "width"  : "100%",
            "height" : "100%"
        });
        var pos = TK.get_style(this.element, "position");
        if (pos != "absolute" && pos != "relative")
            this.element.style["position"] = "relative";
    },
    destroy: function () {
        TK.destroy(this._over);
        TK.destroy(this._mask);
        TK.destroy(this.element);
        Widget.prototype.destroy.call(this);
    },

    redraw: function() {
        Widget.prototype.redraw.call(this);
        var I = this.invalid;
        var O = this.options;

        if (I.color) {
            I.color = false;
            this.element.style["background"] = O.color;
        }

        if (I.state || I.opacity) {
            I.state = I.opacity = false;
            this._mask.style["opacity"] = "" + ((1 - (O.state ? 1 : 0)) * O.opacity);
        }
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        Widget.prototype.set.call(this, key, value, hold);
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
