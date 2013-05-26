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

Button = new Class({
    // Button is a simple, clickable widget to trigger funcions. They fire a
    // couple of click-related events and consist of a label and an icon.
    // Buttons are used as a base to build different other widgets from.
    Extends: Widget,
    options: {
        label:            "",    // text for the button
        icon:             "",    // URL to an icon for this button
        state:            false, // state of the button (bool)
        state_color:      false  // background color of the state indication
    },
    
    initialize: function (options, hold) {
        this.parent(options, hold);
        this.element = this.widgetize(new Element("div.toolkit-button", {
            "id":    this.options.id
        }), true, true, true);
        if (this.options.container)
            this.set("container", this.options.container, hold);
        
        this._icon = new Element("img.toolkit-icon").inject(this.element);
        this._label = new Element("div.toolkit-label").inject(this.element);
        
        this.set("label",       this.options.label, hold);
        this.set("icon",        this.options.icon, hold);
        this.set("state_color", this.options.state_color, hold);
        this.set("state",       this.options.state, hold);
        this.initialized();
    },
    destroy: function () {
        this._icon.destroy();
        this._label.destroy();
        this.element.destroy();
        this.parent();
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "container":
                if (!hold) this.element.inject(value);
                break;
            case "class":
                if (!hold) this.element.addClass(value);
                break;
            case "label":
                if (!hold) {
                    if (value) {
                        this._label.set("html", value);
                        this._label.setStyle("display", "block");
                    } else {
                        this._label.setStyle("display", "none");
                    }
                }
                break;
            case "icon":
                if (!hold) {
                    if (value) {
                        this._icon.set("src", value);
                        this._icon.setStyle("display", "block");
                    } else {
                        this._icon.setStyle("display", "none");
                    }
                }
                break;
            case "state":
                if (!hold) {
                    this.element[value
                        ? "addClass" : "removeClass"]("toolkit-active");
                    this._label.setStyle("background-color",
                                         (this.options.state_color
                                       && this.options.state)
                                        ? this.options.state_color : null);
                }
                break;
            case "state_color":
                if (!hold) this.set("state", this.options.state);
        }
        this.parent(key, value, hold);
    }
});
 
