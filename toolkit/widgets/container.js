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
w.Container = $class({
    // Container is a simple DIV
    _class: "Container",
    Extends: Widget,
    options: {
        /*content: ""*/
                    // the content of the container. It can either be
                    // a string which is interpreted as HTML or a
                    // ready-to-use DOM node.
    },
    initialize: function (options) {
        Widget.prototype.initialize.call(this, options);
        this.element = this.widgetize(TK.element("div", "toolkit-container"),
                                      true, true, true);
        if (this.options.container)
            this.set("container", this.options.container);
    },
    
    destroy: function () {
        this.element.remove();
        Widget.prototype.destroy.call(this);
    },

    redraw: function() {
        var O = this.options;
        var I = this.invalid;
        var E = this.element;

        Widget.prototype.redraw.call(this);

        if (I.content) {
            I.content = false;
            TK.empty(E);

            if (typeof O.content === "string")
                E.innerHTML = O.content;
            else if (typeof value === "object")
                E.appendChild(O.content);
        }
    },
    
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        Widget.prototype.set.call(this, key, value, hold);
    },
});
})(this);
