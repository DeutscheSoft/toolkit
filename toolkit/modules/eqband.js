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
w.TK.EqBand = w.EqBand = $class({
    /** @class EqBand
     * An EqBand extends a #ResponseHandle and holds a
     * dependent #Filter. It is used as a fully functional representation
     * of a single equalizer band in #Equalizer. EqBand needs a #Chart 
     * or any other derivate to be drawn in.
     * @option type; integer; _TOOLKIT_PARAMETRIC; The type of the filter, _TOOLKIT_PARAMETRIC|_TOOLKIT_PEAK|_TOOLKIT_NOTCH|_TOOLKIT_LOWSHELF|_TOOLKIT_HIGHSHELF|_TOOLKIT_LOWPASS_[n]|_TOOLKIT_HIGHPASS_[n]
     * @extends ResponseHandle
     */
    _class: "EqBand",
    Extends: ResponseHandle,
    _options: Object.assign(Object.create(ResponseHandle.prototype._options), {
        type: "int",
        gain: "number",
        freq: "number",
        x: "number",
        y: "number",
        z: "number",
        q: "number",
    }),
    options: {
        type:    _TOOLKIT_PARAMETRIC // The type of the filter.
    },
    
    initialize: function (options) {
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
    },

    freq2gain: function (freq) {
        /** @method freq2gain(freq)
         * Calculate the gain for a given frequency in Hertz
         * @param {number} freq - The frequency to calculate the amplification for
         * @returns number; the gain at the given frequency
         */
        return this.filter.freq2gain(freq);
    },
    
    // GETTER & SETTER
    set: function (key, value) {
        var range;
        switch (key) {
            case "freq":
                key = "x";
                break;
            case "q":
                key = "z";
                break;
            case "gain":
                key = "y"
                break;
        }
        ResponseHandle.prototype.set.call(this, key, value);
        switch (key) {
            case "type":
                this.filter.set("type", value);
                break;
            case "x":
                range = this.range_x.options;
                this.filter.set("freq", Math.max(Math.min(value, range.max), range.min));
                break;
            case "y":
                range = this.range_y.options;
                this.filter.set("gain", Math.max(Math.min(value, range.max), range.min));
                break;
            case "z":
                range = this.range_z.options;
                this.filter.set("q", Math.max(Math.min(value, range.max), range.min));
                break;
        }
    }
});
})(this);
