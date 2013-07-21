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

Ranges = new Class({
    // Ranges provides a function to add different ranges to a widget for
    // building coordinate systems and the like.
    _class: "Ranges",
    Implements: Events,
    add_range: function (from, name) {
        // add a range. From is a function returning a Range instance or an
        // object containing options for a new Range. If name is set, the range
        // is added to the main instance and a set function is created.
        // this.set([name], {basis: 250, min: 0}); results in:
        // this[name].set("basis", 250);
        // this[name].set("min", 0);
        // If name is set and this.options[name] exists, is an object and from
        // is an object, too, both are merged before a range is created.
        // Returns the range.
        var r;
        if (typeOf(from) == "function") {
            r = from();
        } else {
            if (name
            && this.options[name]
            && typeOf(this.options[name] == "object"))
                from = Object.merge(this.options[name], from)
            r = new Range(from);
        }
        if (name) {
            this[name] = r;
            this.addEvent("set", function (key, value, hold) {
                if (key == name) {
                    for (var i in value) {
                        this[name].set(i, value[i], hold);
                    }
                }
            }.bind(this));
        }
        this.fireEvent("rangeadded", [r, this]);
        return r;
    }
})
