/*******************************************************************************
 * toolkit. by Junger
 * 
 * This toolkit provides different widgets, implements and modules for building
 * audio based applications in webbrowsers.
 * 
 * Concept and realization by Markus Schmidt <schmidt@boomshop.net> for:
 * 
 * Jünger Audio GmbH
 * Justus-von-Liebig-Straße 7
 * 12489 Berlin · Germany
 * Tel: +49 30 67 77 21 0
 * http://junger-audio.com
 * info@junger-audio.com
 * 
 * toolkit. relies on mootools: http://mootools.net/
 * 
 * There is no license by now - all rights reserved. Hope we can fix this major
 * bug soon.
 ******************************************************************************/


var Equalizer = new Class({
    // Equalizer is a ResponseHandler adding some EqBands instead of
    // simple ResponseHandles.
    Extends: ResponseHandler,
    options: {
        accuracy: 1 // the distance between points of curves on the x axis
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
        
        this.initialized();
    },
    
    destroy: function () {
        this.empty();
        this._bands.destroy();
        this.parent();
    },
    
    redraw: function () {
        if (this.baseline) {
            var dots = [];
            var c = 0;
            for (var i = 0; i < this.range_x.get("basis"); i += this.options.accuracy) {
                var gain = 1;
                var freq = this.range_x.px2val(i);
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
        b.addEvent("startdrag", function () { this._active ++ }.bind(this));
        b.addEvent("stopdrag",  function () {
            this._active = Math.max(this._active-1, 0)
        }.bind(this));
        this.element.addEvent("mousemove", b._mousemove.bind(b));
        this.element.addEvent("mouseup",   b._mouseup.bind(b));
        this.element.addEvent("touchmove", b._touchmove.bind(b));
        this.element.addEvent("touchend",  b._touchend.bind(b));
        
        b.addEvent("set", this.redraw.bind(this));
        this.redraw();
        this.fireEvent("bandadded", [b, this]);
        return b;
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
