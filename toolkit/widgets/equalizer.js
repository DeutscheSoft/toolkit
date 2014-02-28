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
                    }.bind(this),
                    Math.max(5, this.options.deferrer));
            } else if (!this.__deferring) {
                return;
            }
            if (this.__deferring) {
                this._defer_to = false;
                this.__deferring = false;
            }
        }
        if (this.baseline) {
            var dots = [];
            var c = 0;
            for (var i = 0; i < this.range_x.get("basis"); i += this.options.accuracy) {
                var gain = 1;
                var freq = this.range_x.px2val(i, true);
                dots[c] = {x: freq, y: 0};
                for (var j = 0; j < this.bands.length; j++) {
                    if (this.bands[j].get("active"))
                        dots[c].y += this.bands[j].freq2gain(freq);
                }
                c ++;
            }
            this.baseline.set("dots", dots);
        }
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
