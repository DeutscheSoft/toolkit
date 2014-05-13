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
 
 //{
    //"modifier": "SHIFT",
    //"label": "<img src=\"images/shift.png\" alt=\"\"/>",
//}

//{
    //"default": "q",
    //"SHIFT": "Q",
    //"CTRL+ALT": "@",
    //"CTRL+SHIFT": function (keyboard, key) { return },
    //"label_default": "Q",
    //"label_SHIFT": "Q",
    //"label_CTRL":
//}

 Keyboard = new Class({
    // Keyboard provides an on-screen keyboard for textual input via
    // touch or mouse events
    _class: "Keyboard",
    Extends: Widget,
    Implements: Anchor,
    options: {
        keys: [], // multidimensional array of key elements
        buffer: _TOOLKIT_TEXT_INPUT, // one out of _TOOLKIT_TEXT_INPUT
                                     //            _TOOLKIT_TEXT_AREA
                                     //            _TOOLKIT_HIDDEN_INPUT
        x: 0, // x position of the keyboard
        y: 0 // y position of the keyboard
        
    },
    
    keys: [],
    
    initialize: function (options) {
        this.parent(options);
        this.build();
    },
    
    build: function () {
        this.element = this.widgetize(
                       new Element("div.toolkit-keyboard"), true, true, true);
        this.set("container", this.options.container);
        for(var i in this.options.keys) {
            if (!this.options.keys.hasOwnProperty(i))
                continue;
            // rows
            var row = this.options.keys[i];
            var r = new Element("div.toolkit-row");
            for (var j = 0; j < row.length; j ++) {
                // keys
                var key = this.options.keys[i][j];
                if (!key.hasOwnProperty("options"))
                    key["options"] = {};
                key["options"]["label"] = key["label_default"];
                key["options"]["container"] = r;
                key["options"]["width"] = typeof key["width"] === "undefined" ? 1 : key["width"];
                if (typeof key["modifier"] !== "undefined") {
                    var b = new Toggle(key["options"]);
                } else {
                    var b = new Button(key["options"]);
                }
                key["button"] = b;
                this.keys.push(b);
            }
            r.inject(this.element);
        }
        keep_inside(this.element);
    },
    
    destroy: function () {
        
        this.parent();
    },
    
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "size":
                if (!hold) this.redraw();
                break;
        }
        this.parent(key, value, hold);
    }
});
