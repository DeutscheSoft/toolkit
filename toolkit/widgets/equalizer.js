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

var Equalizer = new Class({
    // Equalizer is a ResponseHandler adding some EqBands instead of
    // simple ResponseHandles.
    _class: "Equalizer",
    Extends: ResponseHandler,
    options: {
        accuracy: 1, // the distance between points of curves on the x axis
        bands: [],   // list of bands to create on init
        deferrer: 40  // set a timeout for drawing the curve
    },
    bands: [],
    
    initialize: function (options) {
        this.parent(options);
        this.element.addClass("toolkit-equalizer");
        this._bands = makeSVG("g",
            {"class": "toolkit-eqbands"}).inject(this.element);
            
        this.baseline = this.add_graph({
            range_x:   function () { return this.range_x; }.bind(this),
            range_y:   function () { return this.range_y; }.bind(this),
            container: this._bands,
            dots: [{x: 20, y: 0}, {x: 20000, y: 0}]
        });
        this.add_bands(this.options.bands);
        this.initialized();
    },
    
    destroy: function () {
        this.empty();
        this._bands.destroy();
        this.parent();
    },
    __deferring: false,
    redraw: function () {
        if (this.options.deferrer) {
            if (!this._defer_to) {
                this._defer_to = window.setTimeout(
                    function () {
                        this.__deferring = true;
                        this.redraw()
                        this.__deferring = false;
                        this._defer_to = null;
                    }.bind(this),
                    Math.max(5, this.options.deferrer));
                return;
            } else if (!this.__deferring) {
                return;
            }
        }
        var t = new Date();
        if (this.baseline) {
            var dots = [];
            var c = 0;
            var end = this.range_x.get("basis");
            var step = this.options.accuracy;
            var x_px_to_val = this.range_x.gen_px2val(true);
            var y_val_to_px = this.range_y.gen_val2px(true);
            var f = [];
            var y = 0, x = x_px_to_val(0);

            for (var i = 0; i < this.bands.length; i++) {
                if (this.bands[i].get("active")) {
                    f[c] = this.bands[i].gen_freq2gain();
                    y += f[c](x);
                    c++;
                }
            }

            var d = new Array(end / step);
            c = 1;

            d[0] = "M0," + y.toFixed(1);

            for (var i = 1; i < end; i += step) {
                x = x_px_to_val(i);
                y = 0;
                for (var j = 0; j < f.length; j++) y += f[j](x);

                d[c ++] = "L" + i + "," + y_val_to_px(y).toFixed(1);
            }
            //console.log(d.join(""));
            this.baseline.set("dots", d.join(""));
        }
        //console.log("redraw took", new Date() - t, "ms");
        this.parent();
    },
    
    add_band: function (options) {
        options["container"] = this._bands;
        if (typeof options["range_x"] == "undefined")
            options["range_x"] = function () { return this.range_x; }.bind(this);
        if (typeof options["range_y"] == "undefined")
            options["range_y"] = function () { return this.range_y; }.bind(this);
        if (typeof options["range_z"] == "undefined")
            options["range_z"] = function () { return this.range_z; }.bind(this);
        
        options["intersect"] = this.intersect.bind(this);
        
        var b = new EqBand(options);
        this.bands.push(b);
        b.addEvent("handlegrabbed", function () { this._active ++ }.bind(this));
        b.addEvent("handlereleased",  function () {
            this._active = Math.max(this._active-1, 0)
        }.bind(this));
        document.addEvent("mousemove", b._mousemove.bind(b));
        document.addEvent("mouseup",   b._mouseup.bind(b));
        document.addEvent("touchmove", b._touchmove.bind(b));
        document.addEvent("touchend",  b._touchend.bind(b));
        
        b.addEvent("set", this.redraw.bind(this));
        this.redraw();
        this.fireEvent("bandadded", [b, this]);
        return b;
    },
    add_bands: function (bands) {
        for (var i = 0; i < bands.length; i++)
            this.add_band(bands[i]);
    },
    
    remove_band: function (h) {
        for (var i = 0; i < this.bands.length; i++) {
            if (this.bands[i] == h) {
                this.bands[i].destroy();
                this.bands.splice(i, 1);
                this.fireEvent("bandremoved", this);
                break;
            }
        }
    },
    remove_bands: function () {
        for (var i = 0; i < this.bands.length; i++) {
            this.remove_band(this.bands[i]);
        }
        this.bands = [];
        this.fireEvent("emptied", this);
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        //this.options[key] = value;
        this.parent(key, value, hold);
        switch (key) {
            case "accuracy":
                if (!hold) this.redraw();
                break;
        }
    }
});
