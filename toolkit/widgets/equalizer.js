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
function invalidate_bands() {
    this.invalid.bands = true;
    this.trigger_draw();
}
function show_bands() {
    var b = this.bands;
    for (var i = 0; i < b.length; i ++) {
        this.add_child(b[i]);
    }
}
function hide_bands() {
    var b = this.bands;
    for (var i = 0; i < b.length; i ++) {
        this.remove_child(b[i]);
    }
}
w.TK.Equalizer = w.Equalizer = $class({
    /**
     * TK.Equalizer is a TK.ResponseHandler adding some EqBands instead of
     * simple ResponseHandles.
     *
     * @property {Object} options
     * 
     * @param {Number} [options.accuracy=1] - The distance between points on the x axis.
     * @param {Array} [bands=[]] - A list of bands to add on init.
     * @param {Boolean} [show_bands=true] - Show or hide all bands.
     * 
     * @class TK.Equalizer
     * 
     * @extends TK.ResponseHandler
     */
    _class: "Equalizer",
    Extends: TK.ResponseHandler,
    _options: Object.assign(Object.create(TK.ResponseHandler.prototype._options), {
        accuracy: "number",
        bands:  "array",
        show_bands: "boolean",
    }),
    options: {
        accuracy: 1, // the distance between points of curves on the x axis
        bands: [],   // list of bands to create on init
        show_bands: true,
    },
    
    initialize: function (options) {
        /**
         * @member {Array} TK.Equalizer#bands - Array of {@link TK.EqBand} instances.
         */
        this.bands = [];
        TK.ResponseHandler.prototype.initialize.call(this, options);
        /**
         * @member {HTMLDivElement} TK.Equalizer#element - The main DIV container.
         *   Has class <code>toolkit-equalizer</code>.
         */
        TK.add_class(this.element, "toolkit-equalizer");
        
        /**
         * @member {SVGGroup} TK.Equalizer#_bands - The SVG group containing all the bands SVG elements.
         *   Has class <code>toolkit-eqbands</code>.
         */
        this._bands = TK.make_svg("g", {"class": "toolkit-eqbands"});
        this.svg.appendChild(this._bands);
        
        /**
         * @member {TK.Graph} TK.Equalizer#baseline - The graph drawing the zero line.
         *   Has class <code>toolkit-baseline</code> 
         */
        this.baseline = this.add_graph({
            range_x:   this.range_x,
            range_y:   this.range_y,
            container: this._bands,
            dots: [{x: 20, y: 0}, {x: 20000, y: 0}],
            "class": "toolkit-baseline"
        });
        this.add_bands(this.options.bands);
    },
    
    destroy: function () {
        this.empty(); // Arne: ??? <- Markus: removes all graphs, defined in Chart
        this._bands.remove();
        TK.ResponseHandler.prototype.destroy.call(this);
    },
    redraw: function () {
        var I = this.invalid;
        var O = this.options;
        TK.ResponseHandler.prototype.redraw.call(this);
        if (I.validate("bands", "accuracy")) {
            if (this.baseline) {
                var c = 0;
                var end = this.range_x.get("basis") | 0;
                var step = O.accuracy;
                var x_px_to_val = this.range_x.px2val;
                var y_val_to_px = this.range_y.val2px;
                var f = [];
                var y = 0, x = x_px_to_val(0);

                for (var i = 0; i < this.bands.length; i++) {
                    if (this.bands[i].get("active")) {
                        f[c] = this.bands[i].filter.freq2gain;
                        y += f[c](x);
                        c++;
                    }
                }

                var d = new Array(end / step);
                c = 1;

                d[0] = "M0," + y_val_to_px(y).toFixed(1);

                for (var i = 1; i < end; i += step) {
                    x = x_px_to_val(i);
                    y = 0;
                    for (var j = 0; j < f.length; j++) y += f[j](x);

                    d[c ++] = "L" + i + "," + y_val_to_px(y).toFixed(1);
                }
                this.baseline.set("dots", d.join(""));
            }
        }

        if (I.show_bands) {
            I.show_bands = false;
            if (O.show_bands) {
                this._bands.style.removeProperty("display");
            } else {
                this._bands.style.display = "none";
            }
        }
    },
    resize: function () {
        invalidate_bands.call(this);
        TK.ResponseHandler.prototype.resize.call(this);
    },
    /*
     * Add a new band to the equalizer. Options is an object containing
     * options for the {@link TK.EqBand}
     * 
     * @method TK.Equalizer#add_band
     * 
     * @param {Object} options - The options for the {@link TK.EqBand}.
     * 
     * @emits TK.Equalizer#bandadded
     */
    add_band: function (options) {
        var b;
        if (TK.EqBand.prototype.isPrototypeOf(options)) {
          b = options;
        } else {
          options.container = this._bands;
          if (options.range_x === void(0))
              options.range_x = function () { return this.range_x; }.bind(this);
          if (options.range_y === void(0))
              options.range_y = function () { return this.range_y; }.bind(this);
          if (options.range_z === void(0))
              options.range_z = function () { return this.range_z; }.bind(this);
          
          options.intersect = this.intersect.bind(this);
          b = new TK.EqBand(options);
        }
        
        this.bands.push(b);
        b.add_events(["handlegrabbed", "zchangestarted"], function () {
            document.addEventListener("mousemove", this._mousemove);
            document.addEventListener("mouseup",   this._mouseup);
            document.addEventListener("touchmove", this._touchmove);
            document.addEventListener("touchend",  this._touchend);
        });
        b.add_events(["handlereleased", "zchangeended"],  function () {
            document.removeEventListener("mousemove", this._mousemove);
            document.removeEventListener("mouseup",   this._mouseup);
            document.removeEventListener("touchmove", this._touchmove);
            document.removeEventListener("touchend",  this._touchend);
        });
        b.add_event("set", invalidate_bands.bind(this));
        /**
         * Is fired when a new band was added.
         * 
         * @event TK.Equalizer#bandadded
         * 
         * @param {TK.Band} band - The {@link TK.EqBand} which was added.
         */
        this.fire_event("bandadded", b);
        if (this.options.show_bands)
            this.add_child(b);
        invalidate_bands.call(this);
        return b;
    },
    /*
     * Add multiple new {@link TK.EqBand} to the equalizer. Options is an array
     * of objects containing options for the new instances of {@link TK.EqBand}
     * 
     * @method TK.Equalizer#add_bands
     * 
     * @param {Array<Object>} options - An array of options objects for the {@link TK.EqBand}.
     */
    add_bands: function (bands) {
        for (var i = 0; i < bands.length; i++)
            this.add_band(bands[i]);
    },
    /*
     * Remove a band from the widget.
     * 
     * @method TK.Equalizer#remove_handle
     * 
     * @param {TK.EqBand} band - The {@link TK.EqBand} to remove.
     * 
     * @emits TK.Equalizer#bandremoved
     */
    remove_band: function (h) {
        for (var i = 0; i < this.bands.length; i++) {
            if (this.bands[i] === h) {
                if (this.options.show_bands)
                    this.remove_child(h);
                
                this.bands.splice(i, 1);
                /**
                 * Is fired when a band was removed.
                 * 
                 * @event TK.Equalizer#bandremoved
                 * 
                 * @param {TK.EqBand} band - The {@link TK.EqBand} which was removed.
                 */
                this.fire_event("bandremoved", h);
                h.destroy();
                break;
            }
        }
    },
    /*
     * Remove multiple {@link TK.EqBand} from the equalizer. Options is an array
     * of {@link TK.EqBand} instances.
     * 
     * @method TK.Equalizer#remove_bands
     * 
     * @param {Array<TK.EqBand>} bands - An array of {@link TK.EqBand} instances.
     */
    remove_bands: function () {
        for (var i = 0; i < this.bands.length; i++) {
            this.remove_band(this.bands[i]);
        }
        this.bands = [];
        /**
         * Is fired when all bands are removed.
         * 
         * @event TK.Equalizer#emptied
         */
        this.fire_event("emptied");
        invalidate_bands.call(this);
    },
    set: function(key, value) {
        TK.ResponseHandler.prototype.set.call(this, key, value);
        if (key === "bands") {
            if (this.bands.length) this.remove_bands();
            this.add_bands(value);
        } else if (key === "show_bands") {
            if (value) {
                show_bands.call(this);
            } else {
                hide_bands.call(this);
            }
        }
    },
});
})(this);
