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
w.EqBand = $class({
    // An EqBand extends a ResponseHandle and holds a dependent Filter It is used
    // as a fully functional representation of a single equalizer band. EqBand
    // needs a Chart or other derivates to be drawn in.
    _class: "EqBand",
    Extends: ResponseHandle,
    options: {
        type:    _TOOLKIT_PARAMETRIC // The type of the filter.
    },
    
    initialize: function (options, hold) {
        if (typeof options.mode == "undefined") {
            switch (options.type) {
                case _TOOLKIT_PARAM:
                case _TOOLKIT_NOTCH:
                    options.mode = _TOOLKIT_CIRCULAR
                    break;
                case _TOOLKIT_LP1:
                case _TOOLKIT_LP2:
                case _TOOLKIT_LP3:
                case _TOOLKIT_LP4:
                    options.mode = _TOOLKIT_BLOCK_RIGHT;
                    break;
                case _TOOLKIT_HP1:
                case _TOOLKIT_HP2:
                case _TOOLKIT_HP3:
                case _TOOLKIT_HP4:
                    options.mode = _TOOLKIT_BLOCK_LEFT;
                    break;
                case _TOOLKIT_LOWSHELF:
                case _TOOLKIT_HISHELF:
                    options.mode = _TOOLKIT_LINE_VERT;
                    options.show_axis = true;
                    break;
            }
        }
        
        ResponseHandle.prototype.initialize.call(this, options);
        
        this.filter = new Filter();
        this.filter.options = this.options;
        
        if (typeof options.x !== "undefined")
            this.set("x", options.x, true);
        else if (typeof options.freq !== "undefined")
            this.set("freq", options.freq);
        if (typeof options.y !== "undefined")
            this.set("y", options.y, true);
        else if (typeof options.gain !== "undefined")
            this.set("gain", options.gain, true);
        if (typeof options.z !== "undefined")
            this.set("z", options.z, true);
        else if (typeof options.q !== "undefined")
            this.set("q", options.q, true);
        
        TK.add_class(this.element, "toolkit-eqband");
        
        this.filter.reset();
        ResponseHandle.prototype.initialized.call(this);
    },

    gen_freq2gain : function() {
        return this.filter.freq2gain;
    },
    
    freq2gain: function (freq) {
        return this.filter.freq2gain(freq);
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "type":
                this.filter.set("type", value);
                this.filter.reset();
                break;
            case "freq":
                key = "x"
            case "x":
                this.filter.set("freq",
                                Math.max(Math.min(value, this.range_x.get("max")),
                                         this.range_x.get("min")), hold);
                break;
            case "gain":
                key = "y"
            case "y":
                switch (this.range_y.get("mode")) {
                    default:
                    case _TOOLKIT_LINEAR:
                        this.filter.set("gain",
                                Math.max(Math.min(value, this.range_y.get("max")),
                                         this.range_y.get("min")), hold);
                        break;
                    case _TOOLKIT_DECIBEL:
                        this.filter.set("gain",
                                Math.max(Math.min(value, this.range_y.get("max")),
                                         this.range_y.get("min")), hold);
                        break;
                }
                break;
            case "q":
                key = "z"
            case "z":
                this.filter.set("q",
                                Math.max(Math.min(value, this.range_z.get("max")),
                                         this.range_z.get("min")), hold);
                break;
        }
        ResponseHandle.prototype.set.call(this, key, value, hold);
    }
});
})(this);
