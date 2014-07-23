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
 
Knob = new Class({
    // Knob is a Circular injected into a SVG and extended by ScrollValue
    // and DragValue to set its value. Knob uses DragValue and Scrollvalue
    // for setting its value.
    _class: "Knob",
    Extends: Circular,
    options: {
        size: 100,
        hand: {width: 2, length: 6, margin: 22},
        margin: 13,
        thickness: 5,
        step: 1,
        shift_up: 4,
        shift_down: 0.25,
        dot: {margin: 13, length: 5, width: 2},
        marker: {margin: 13, thickness: 5},
        label: {margin: 10, align: _TOOLKIT_OUTER},
        direction: _TOOLKIT_VERTICAL
    },
    
    initialize: function (options) {
        this.setOptions(options);
        this._svg = this.widgetize(makeSVG("svg", {"class": "toolkit-knob"}),
                        true, true, true);
        if (this.options.container)
            this._svg.inject(this.options.container);
        
        Circular.prototype.initialize.call(this, Object.merge(options, {container: this._svg}), true);
        
        this.drag = new DragValue({
            element: this._svg,
            range:   function () { return this }.bind(this),
            get:     function () { return this.options.value; }.bind(this),
            set:     function (v) {
                this.set("value", v);
                this.fire_event("useraction", ["value", v, this]);
            }.bind(this),
            direction: this.options.direction,
            events: function () { return this }.bind(this),
        });
        this.scroll = new ScrollValue({
            element: this._svg,
            range:   function () { return this }.bind(this),
            get:     function () { return this.options.value; }.bind(this),
            set:     function (v) {
                this.set("value", v);
                this.fire_event("useraction", ["value", v, this]);
            }.bind(this),
            events: function () { return this }.bind(this),
        });
        this.set("size", this.options.size);
        this.initialized();
    },
    
    destroy: function () {
        this.drag.destroy();
        this.scroll.destroy();
        this._svg.destroy();
        Circular.prototype.destroy.call(this);
    },
    
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "size":
                this._svg.set("width", value);
                this._svg.set("height", value);
                if (!hold) this.redraw();
                break;
            case "direction":
                this.drag.set("direction", value);
                break;
        }
        Circular.prototype.set.call(this, key, value, hold);
    }
});
