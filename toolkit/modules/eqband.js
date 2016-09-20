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
w.TK.EqBand = w.EqBand = $class({
    /**
     * An TK.EqBand extends a {@link TK.ResponseHandle} and holds a
     * dependent {@link TK.Filter}. It is used as a fully functional representation
     * of a single equalizer band in {@link TK.Equalizer} TK.EqBand needs a {@link TK.Chart} 
     * or any other derivate to be drawn in.
     *
     * @class TK.EqBand
     * @property {integer} [options.type="parametric"] - The type of the filter.
     *  Possible values are <code>"parametric"</code>, <code>"notch"</code>,
     *  <code>"low-shelf"</code>, <code>"high-shelf"</code>, <code>"lowpass"+n</code> or
     *  <code>"highpass"+n</code>.
     * @extends TK.ResponseHandle
     */
    _class: "EqBand",
    Extends: TK.ResponseHandle,
    _options: Object.assign(Object.create(TK.ResponseHandle.prototype._options), {
        type: "string",
        gain: "number",
        freq: "number",
        x: "number",
        y: "number",
        z: "number",
        q: "number",
    }),
    options: {
        type:    "parametric" // The type of the filter.
    },
    
    initialize: function (options) {
        if (typeof options.mode == "undefined") {
            switch (options.type) {
                case "parametric":
                case "notch":
                    options.mode = "circular"
                    break;
                case "lowpass1":
                case "lowpass2":
                case "lowpass3":
                case "lowpass4":
                    options.mode = "block-right";
                    break;
                case "highpass1":
                case "highpass2":
                case "highpass3":
                case "highpass4":
                    options.mode = "block-left";
                    break;
                case "low-shelf":
                case "high-shelf":
                    options.mode = "line-vertical";
                    options.show_axis = true;
                    break;
                default:
                    TK.warn("Unsupported filter type:", options.type);
            }
        }
        
        TK.ResponseHandle.prototype.initialize.call(this, options);
        
        this.filter = new TK.Filter();
        this.filter.options = this.options;
        
        if (typeof options.x !== "undefined")
            this.set("x", options.x);
        else if (typeof options.freq !== "undefined")
            this.set("freq", options.freq);
        if (typeof options.y !== "undefined")
            this.set("y", options.y);
        else if (typeof options.gain !== "undefined")
            this.set("gain", options.gain);
        if (typeof options.z !== "undefined")
            this.set("z", options.z);
        else if (typeof options.q !== "undefined")
            this.set("q", options.q);
        
        TK.add_class(this.element, "toolkit-eqband");
        
        this.filter.reset();
    },

    /**
     * Calculate the gain for a given frequency in Hz.
     *
     * @method TK.EqBand#freq2gain
     * @param {number} freq - The frequency.
     * @returns {number} The gain at the given frequency.
     */
    freq2gain: function (freq) {
        return this.filter.freq2gain(freq);
    },
    
    // GETTER & SETTER
    set: function (key, value) {
        switch (key) {
            case "type":
                this.filter.set("type", value);
                break;
            case "freq":
            case "x":
                value = this.filter.set("freq", this.range_x.snap(value));
                break;
            case "gain":
            case "y":
                value = this.filter.set("gain", this.range_y.snap(value));
                break;
            case "q":
            case "z":
                value = this.filter.set("q", this.range_z.snap(value));
                break;
        }
        switch (key) {
            case "x":
                TK.ResponseHandle.prototype.set.call(this, "freq", value);
                break;
            case "freq":
                TK.ResponseHandle.prototype.set.call(this, "x", value);
                break;
            case "z":
                TK.ResponseHandle.prototype.set.call(this, "q", value);
                break;
            case "q":
                TK.ResponseHandle.prototype.set.call(this, "z", value);
                break;
            case "gain":
                TK.ResponseHandle.prototype.set.call(this, "y", value);
                break;
            case "y":
                TK.ResponseHandle.prototype.set.call(this, "gain", value);
                break;
        }
        TK.ResponseHandle.prototype.set.call(this, key, value);
    }
});
})(this);
