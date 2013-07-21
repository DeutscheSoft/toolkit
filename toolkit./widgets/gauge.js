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

Gauge = new Class({
    // Gauge simply puts a single Circular into a SVG image.
    _class: "Gauge",
    Extends: Circular,
    options: {
        width:  120, // width of the element
        height: 120, // height of the svg
        size:   120,
        title: {pos: 90, margin: 0, align: _TOOLKIT_INNER, title:""} // set a
                     // title fo the gauge. Object with optional members:
                     // pos:    position in angles
                     // margin: margin of the imaginary circle from size
                     // align:  alignment, _TOOLKIT_INNER or _TOOLKIT OUTER
                     // title:  the title as a string
    },
    initialize: function (options) {
        if (typeof options.title == "string")
            options.title = {title: options.title};
        this.setOptions(options);
        this._svg = makeSVG("svg", {
            "class": "toolkit-gauge",
            "width": this.options.width,
            "height": this.options.height
        }, true, true, true).inject(this.options.container);
        options.container = this._svg;
        
        this._title = makeSVG("text", {"class": "toolkit-title"});
        this._title.inject(this._svg);
        
        this.set("title", this.options.title);
        
        this.parent(options);
        this._svg = this.widgetize(this._svg);
        this.initialized();
    },
    destroy: function () {
        this._svg.destroy();
        this.parent();
    },
    
    // HELPERS & STUFF
    _draw_title: function () {
        this._title.set("text", this.options.title.title);
        if (this.options.title.title) {
            var t = this.options.title;
            var outer   = this.options.size / 2;
            var margin  = t.margin;
            var align   = t.align == _TOOLKIT_INNER;
            var bb      = this._title.getBoundingClientRect();
            var angle   = t.pos % 360;
            var outer_p = outer - margin;
            var coords  = this._get_coords(angle, outer_p, outer_p, outer, true);
            
            bb.width = bb.width;
            
            var mx = ((coords.x - outer) / outer_p)
                   * (bb.width + bb.height / 2.5) / (align ? -2 : 2);
            var my = ((coords.y - outer) / outer_p)
                   * bb.height / (align ? -2 : 2);
            
            mx += this.options.x;
            my += this.options.y;
                   
            this._title.set("transform",
                "translate(" + (coords.x + mx) + "," + (coords.y + my) + ")");
            this._title.set("text-anchor", "middle");
        }
        this.fireEvent("titledrawn", [this]);
    },
    
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        switch (key) {
            case "width":
                if (!hold) this._svg.set("width", value);
                break;
            case "height":
                if (!hold) this._svg.set("height", value);
                break;
            case "title":
                if (typeof value == "string") value = {title: value};
                this.options.title = Object.merge(this.options.title, value);
                this.fireEvent("set", [key, value, hold, this]);
                this.fireEvent("set_" + key, [value, hold, this]);
                key = false;
                if (!hold) this._draw_title();
                break;
            case "x":
            case "y":
                this.options[key] = value;
                if (!hold) this._draw_title();
                break;
        }
        this.parent(key, value, hold);
    }
});
