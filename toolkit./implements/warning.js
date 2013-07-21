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

Warning = new Class({
    // warning sets a timed class "toolkit-warn" on an element. It is
    // used e.g. in ResponseHandle or Knob when the value exceeds the
    // range.
    _class: "Warning",
    Implements: Events,
    warning: function (element, timeout) {
        if (!timeout) timeout = 250;
        if (this.__wto) window.clearTimeout(this.__wto);
        this.__wto = null;
        element.addClass("toolkit-warn");
        this.__wto = window.setTimeout(function () {
            element.removeClass("toolkit-warn");
        }.bind(this), timeout);
        this.fireEvent("warning", this);
    }
});
