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
 
Ranges = $class({
    // Ranges provides a function to add different ranges to a widget for
    // building coordinate systems and the like.
    _class: "Ranges",
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
                from = $mixin({}, this.options[name], from)
            r = new Range(from);
        }
        if (name) {
            this[name] = r;
            this.add_event("set", function (key, value, hold) {
                if (key == name) {
                    for (var i in value) {
                        this[name].set(i, value[i], hold);
                    }
                }
            }.bind(this));
        }
        this.fire_event("rangeadded", [r, this]);
        return r;
    }
})
