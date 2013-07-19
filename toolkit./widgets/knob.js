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

Knob = new Class({
    // Knob is a Circular injected into a SVG and extended by ScrollValue
    // and DragValue to set its value. Knob uses DragValue and Scrollvalue
    // for setting its value.
    Extends: Circular,
    options: {
        size: 100,
        hand: {width: 2, length: 6, margin: 22},
        margin: 13,
        thickness: 5,
        step: 1,
        shift_up: 4,
        shift_down: 0.25,
        dot: {margin: 13, length: 5, width: 2},
        marker: {margin: 13, thickness: 5},
        label: {margin: 10, align: _TOOLKIT_OUTER},
        direction: _TOOLKIT_VERTICAL
    },
    
    initialize: function (options) {
        this.setOptions(options);
        this._svg = this.widgetize(makeSVG("svg", {"class": "toolkit-knob"}),
                        true, true, true);
        if (this.options.container)
            this._svg.inject(this.options.container);
        
        this.parent(Object.merge(options, {container: this._svg}), true);
        
        this.drag = new DragValue({
            element: this._svg,
            range:   function () { return this }.bind(this),
            get:     function () { return this.options.value; }.bind(this),
            set:     function (v) {
                this.set("value", v);
                this.fireEvent("useraction", ["value", v, this]);
            }.bind(this),
            direction: this.options.direction
        });
        this.scroll = new ScrollValue({
            element: this._svg,
            range:   function () { return this }.bind(this),
            get:     function () { return this.options.value; }.bind(this),
            set:     function (v) {
                this.set("value", v);
                this.fireEvent("useraction", ["value", v, this]);
            }.bind(this)
        });
        this.set("size", this.options.size);
        this.initialized();
    },
    
    destroy: function () {
        this.drag.destroy();
        this.scroll.destroy();
        this._svg.destroy();
        this.parent();
    },
    
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "size":
                this._svg.set("width", value);
                this._svg.set("height", value);
                if (!hold) this.redraw();
                break;
            case "direction":
                this.drag.set("direction", value);
                break;
        }
        this.parent(key, value, hold);
    }
});
