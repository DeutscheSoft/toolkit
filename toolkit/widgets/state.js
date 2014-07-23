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
 
State = new Class({
    // The State widget is a multi-functional adaption of a traditional LED. It
    // is able to show different colors as well as on/off states. The
    // "brightness" can be set seamlessly. Classes can be used to display
    // different styles. State extends Widget.
    _class: "State",
    Extends: Widget,
    options: {
        state:           0,     // the initial state (0 ... 1)
        color:           "red", // the base color
        opacity:         0.8    // the opacity of the mask when state = 0
    },
    initialize: function (options) {
        Widget.prototype.initialize.call(this, options);
        
        this.element = this.widgetize(new Element("div.toolkit-state", {
            "id":    this.options.id
        }), true, true, true);
        
        this._over   = new Element("div.toolkit-over").inject(this.element);
        this._mask   = new Element("div.toolkit-mask").inject(this.element);
        
        if (this.options.container)
            this.set("container",  this.options.container);
        
        this.set("color", this.options.color);
        this.set("state", this.options.state);
        
        this.element.setStyles({
            "oveflow": "hidden"
        });
        this._over.setStyles({
            "position": "absolute",
            "z-index": 1,
            "width"  : "100%",
            "height" : "100%"
        });
        this._mask.setStyles({
            "position": "absolute",
            "z-index": 2,
            "width"  : "100%",
            "height" : "100%"
        });
        if (this.element.getStyle("position") != "absolute"
         && this.element.getStyle("position") != "relative")
            this.element.style["position"] = "relative";
        
        this.initialized();
    },
    destroy: function () {
        this._over.destroy();
        this._mask.destroy();
        this.element.destroy();
        Widget.prototype.destroy.call(this);
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "color":
                if (!hold) this.element.style["background"] = value;
                this.fire_event("colorchanged", value);
                break;
            case "state":
            case "opacity":
                if (!hold) this._mask.style["opacity"] = "" + ((1 - +value) * this.options.opacity);
                this.fire_event("statechanged", value);
                break;
        }
        Widget.prototype.set.call(this, key, value, hold);
    }
});
