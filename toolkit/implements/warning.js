 /* toolkit provides different widgets, implements and modules for 
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
"use strict";
(function(w){ 
w.Warning = $class({
    /* @class: Warning
     * @decription: Sets a timed class "toolkit-warn" on an element. It
     * is used e.g. in #ResponseHandle or #Knob when the value exceeds
     * the range. */
    _class: "Warning",
    warning: function (element, timeout) {
        /* @method: warning
         * @option: element; DOMNode; undefined; The DOM node the class should be added to
         * @option: timeout; Number; 250; Te timeout in milliseconds until the class is removed again
         * @description: Adds the class "toolkit-warn" to the given element and
         * sets a timeout after which the class is removed again. If there
         * already is a timeout waiting it gets updated. */
        if (!timeout) timeout = 250;
        if (this.__wto) window.clearTimeout(this.__wto);
        this.__wto = null;
        TK.add_class(element, "toolkit-warn");
        this.__wto = window.setTimeout(function () {
            TK.remove_class(element, "toolkit-warn");
        }.bind(this), timeout);
        /* @event: warning; Widget; Gets fired when a warning was requested */
        this.fire_event("warning");
    }
});
})(this);
