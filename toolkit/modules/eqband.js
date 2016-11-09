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

var type_to_mode = {
    parametric: "circular",
    notch: "circular",
    lowpass1: "block-right",
    lowpass2: "block-right",
    lowpass3: "block-right",
    lowpass4: "block-right",
    highpass1: "block-left",
    highpass2: "block-left",
    highpass3: "block-left",
    highpass4: "block-left",
    "low-shelf": "line-vertical",
    "high-shelf": "line-vertical",
        options.mode = "line-vertical";
        options.show_axis = true;
        break;
};

w.TK.EqBand = w.EqBand = $class({
    /**
     * An TK.EqBand extends a {@link TK.ResponseHandle} and holds a
     * dependent {@link TK.Filter}. It is used as a fully functional representation
     * of a single equalizer band in {@link TK.Equalizer} TK.EqBand needs a {@link TK.Chart} 
     * or any other derivate to be drawn in.
     *
     * @class TK.EqBand
     * 
     * @param {Object} options
     * 
     * @property {integer} [options.type="parametric"] - The type of the filter.
     *   Possible values are <code>"parametric"</code>, <code>"notch"</code>,
     *   <code>"low-shelf"</code>, <code>"high-shelf"</code>, <code>"lowpass"+n</code> or
     *   <code>"highpass"+n</code>.
     * @property {number} options.freq - Frequency setting. This is an alias for the option <code>x</code>
     *   defined by {@link TK.ResponseHandle}.
     * @property {number} options.gain - Gain setting. This is an alias for the option <code>y</code>
     *   defined by {@link TK.ResponseHandle}.
     * @property {number} options.q - Quality setting. This is an alias for the option <code>z</code>
     *   defined by {@link TK.ResponseHandle}.
     *
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
        type:    "parametric"
    },
    
    initialize: function (options) {
        /**
         * @member {TK.Filter} TK.EqBand#filter - The filter providing the graphical calculations. 
         */
        this.filter = new TK.Filter({
            type: options.type,
        });
        
        TK.ResponseHandle.prototype.initialize.call(this, options);
        
        this.set("type", options.type);

        if (options.x !== void(0))
            this.set("x", options.x);
        else if (options.freq !== void(0))
            this.set("freq", options.freq);
        if (options.y !== void(0))
            this.set("y", options.y);
        else if (options.gain !== void(0))
            this.set("gain", options.gain);
        if (options.z !== void(0))
            this.set("z", options.z);
        else if (options.q !== void(0))
            this.set("q", options.q);
        
        /** 
         * @member {HTMLDivElement} TK.EqBand#element - The main SVG group.
         *   Has class <code>toolkit-eqband</code>.
         */
        TK.add_class(this.element, "toolkit-eqband");
        
        this.filter.reset();
    },

    /**
     * Calculate the gain for a given frequency in Hz.
     *
     * @method TK.EqBand#freq2gain
     * 
     * @param {number} freq - The frequency.
     * 
     * @returns {number} The gain at the given frequency.
     */
    freq2gain: function (freq) {
        return this.filter.freq2gain(freq);
    },
    
    // GETTER & SETTER
    set: function (key, value) {
        switch (key) {
            case "type": {
                var mode = type_to_mode[value];                    
                if (!mode) {
                    TK.warn("Unsupported type:", value);
                    return;
                }
                this.set("mode", mode);
                this.set("show_axis", mode === "line-vertical");
                this.filter.set("type", value);
                break;
            }
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
