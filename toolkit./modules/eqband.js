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
                    break;
            }
        }
        
        this.parent(options);
        
        this.filter = new Filter();
        this.filter.options = this.options;
        this.filter.reset();
        
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
                this.filter.set("freq",
                                Math.max(Math.min(value, this.range_x.get("max")),
                                         this.range_x.get("min")), hold);
                break;
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
            case "z":
                this.filter.set("q",
                                Math.max(Math.min(value, this.range_z.get("max")),
                                         this.range_z.get("min")), hold);
                break;
        }
        this.parent(key, value, hold);
    }
});
