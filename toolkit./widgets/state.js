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

State = new Class({
    // The State widget is a multi-functional adaption of a traditional LED. It
    // is able to show different colors as well as on/off states. The
    // "brightness" can be set seamlessly. Classes can be used to display
    // different styles. State extends Widget.
    Extends: Widget,
    options: {
        state:           0,     // the initial state (0 ... 1)
        color:           "red", // the base color
        opacity:         0.8    // the opacity of the mask when state = 0
    },
    initialize: function (options) {
        this.parent(options);
        
        this.element = this.widgetize(new Element("div.toolkit-state", {
            "id":    this.options.id
        }), true, true, true);
        
        this._over   = new Element("div.toolkit-over").inject(this.element);
        this._mask   = new Element("div.toolkit-mask").inject(this.element);
        
        if (this.options.container)
            this.set("container",  this.options.container);
        
        this.set("color", this.options.color);
        this.set("state", this.options.state);
        
        this.element.setStyles({
            "oveflow": "hidden"
        });
        this._over.setStyles({
            "position": "absolute",
            "z-index": 1,
            "width"  : "100%",
            "height" : "100%"
        });
        this._mask.setStyles({
            "position": "absolute",
            "z-index": 2,
            "width"  : "100%",
            "height" : "100%"
        });
        if (this.element.getStyle("position") != "absolute"
         && this.element.getStyle("position") != "relative")
            this.element.setStyle("position", "relative");
        
        this.initialized();
    },
    destroy: function () {
        this._over.destroy();
        this._mask.destroy();
        this.element.destroy();
        this.parent();
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "color":
                if (!hold) this.element.setStyle("background", value);
                this.fireEvent("colorchanged", value);
                break;
            case "state":
            case "opacity":
                if (!hold) this._mask.setStyle("opacity", "" + ((1 - +value) * this.options.opacity));
                this.fireEvent("statechanged", value);
                break;
        }
        this.parent(key, value, hold);
    }
});