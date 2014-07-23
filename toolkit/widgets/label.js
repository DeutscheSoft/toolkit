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
 
Label = new Class({
    // Label is a simple text field displaying strings
    _class: "Label",
    Extends: Widget,
    options: {
        label: ""
    },
    initialize: function (options) {
        Widget.prototype.initialize.call(this, options);
        this.element = this.widgetize(new Element("div.toolkit-label"),
                                      true, true, true);
        if (this.options.container)
            this.set("container", this.options.container);
        
        this.set("label", this.options.label);
    },
    
    redraw: function () {
        this.element.set("html", this.options.label);
    },
    
    destroy: function () {
        this.element.destroy();
        Widget.prototype.destroy.call(this);
    },
    
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "label":
                if (!hold) this.redraw();
                break;
        }
        Widget.prototype.set.call(this, key, value, hold);
    }
});
