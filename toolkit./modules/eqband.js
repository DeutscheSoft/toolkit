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

EqBand = new Class({
    // An EqBand extends a ResponseHandle and holds a dependent Filter It is used
    // as a fully functional representation of a single equalizer band. EqBand
    // needs a Chart or other derivates to be drawn in.
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
                    options.mode = _TOOLKIT_BLOCK_LEFT;
                    break;
                case _TOOLKIT_HP1:
                case _TOOLKIT_HP2:
                case _TOOLKIT_HP3:
                case _TOOLKIT_HP4:
                    options.mode = _TOOLKIT_RIGHT;
                    break;
                case _TOOLKIT_LOWSHELF:
                case _TOOLKIT_HISHELF:
                    options.mode = _TOOLKIT_LINE_VERT;
                    break;
            }
        }
        
        this.parent(options);
        
        this.filter = new Filter();
        this.filter.options = this.options;
        this.filter.reset();
        
        if(this.options.x)
            this.set("x", this.options.x, true);
        else if (this.options.freq)
            this.set("freq", this.options.freq);
        if (this.options.y)
            this.set("y", this.options.y, true);
        else if (this.options.gain)
            this.set("gain", this.options.gain, true);
        if (this.options.z)
            this.set("z", this.options.z, true);
        else if (this.options.q)
            this.set("q", this.options.q, true);
        
        this.element.addClass("toolkit-eqband");
        
        this.initialized();
    },
    
    freq2gain: function (freq) {
        return this.filter.freq2gain(freq);
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "x":
                this.filter.set("freq", value, hold);
                break;
            case "y":
                switch (this.range_y.get("mode")) {
                    case _TOOLKIT_LINEAR:
                        this.filter.set("gain", value, hold);
                        break;
                    case _TOOLKIT_DECIBEL:
                        this.filter.set("gain", value, hold);
                        break;
                }
                break;
            case "z":
                this.filter.set("q", value, hold);
                break;
        }
        this.parent(key, value, hold);
    }
});
 
