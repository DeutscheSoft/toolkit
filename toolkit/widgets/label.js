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
w.TK.Label = w.Label = $class({
    /** @class Label
     * @description Label is a simple text field displaying strings
     */
    _class: "Label",
    Extends: Widget,
    _options: Object.assign(Object.create(Widget.prototype._options), {
        label: "string"
    }),
    options: {
        label: ""
    },
    initialize: function (options) {
        var E;
        Widget.prototype.initialize.call(this, options);
        if (!(E = this.element)) this.element = E = TK.element("div");
        TK.add_class(E, "toolkit-label");
        this.widgetize(E, true, true, true);
        if (this.options.container)
            this.set("container", this.options.container);
        
        this.set("label", this.options.label);
    },
    
    redraw: function () {
        var I = this.invalid;
        var O = this.options;

        Widget.prototype.redraw.call(this);

        if (I.label) {
            I.label = false;
            TK.set_text(this.element, O.label);
        }
    },
    
    destroy: function () {
        this.element.remove();
        Widget.prototype.destroy.call(this);
    },
});
})(this);
