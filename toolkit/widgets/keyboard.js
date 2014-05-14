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
        y: 0, // y position of the keyboard
        width: 480,
        height: 240,
        
    },
    
    keys: [],
    
    initialize: function (options) {
        this.parent(options);
        this.build();
        this.initialized();
    },
    
    build: function () {
        this.element = this.widgetize(
                       new Element("div.toolkit-container"), true, true, true);
        
        this.window = new Window({
            container: this.options.container,
            content: this.element,
            class: "toolkit-keyboard",
            x: this.options.x,
            y: this.options.y,
            width: this.options.width,
            height: this.options.height,
            anchor: _TOOLKIT_CENTER,
            header_left: [],
            header_center: [],
            header_right: [],
            resizable: false
        });
        
        for(var i = 0; i < this.options.rows.length; i++) {
            // rows
            var rd = this.options.rows[i];
            var rw = new Widget(rd);
            var re = new Element("div.toolkit-row");
            rw.widgetize(re, true, true, true);
            re.inject(this.element);
            rd["container"] = re;
            
            for (var j = 0; j < rd.keys.length; j ++) {
                // keys
                var kd = rd.keys[j];
                
                if (!kd.hasOwnProperty("options"))
                    kd["options"] = {};
                    
                kd["options"]["label"]     = kd["label_default"];
                kd["options"]["container"] = re;
                kd["options"]["class"]     = "toolkit-key";
                
                if (!kd["options"].hasOwnProperty("styles"))
                    kd["options"]["styles"] = {}
                    
                if (typeof kd["modifier"] !== "undefined") {
                    var b = new Toggle(kd["options"]);
                } else {
                    var b = new Button(kd["options"]);
                }
                kd["button"] = b;
                this.keys.push(kd);
            }
        }
        this.redraw();
    },
    
    redraw: function () {
        var ph = 0;
        for (var j = 0; j < this.options.rows.length; j ++)
            ph += this.options.rows[j]["height"] ? this.options.rows[j]["height"] : 1;
        var height = this.element.innerHeight();
        
        for(var i = 0; i < this.options.rows.length; i++) {
            // rows
            var rd = this.options.rows[i];
            var pw = 0;
            for (var j = 0; j < rd.keys.length; j ++)
                pw += rd.keys[j]["width"] ? rd.keys[j]["width"] : 1;
            var width = rd["container"].innerWidth();
            
            for (var j = 0; j < rd.keys.length; j ++) {
                // keys
                var kd = rd.keys[j];
                var w = parseInt(parseFloat(kd["width"] ? kd["width"] : 1) / pw * width * 100) / 100;
                var h = parseInt(parseFloat(rd["height"] ? rd["height"] : 1) / ph * height * 100) / 100;
                var b = kd["button"].element;
                b.outerWidth(w);
                b.outerHeight(h);
            }
        }
        
        this.parent();  
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
