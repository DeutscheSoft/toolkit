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

ValueButton = $class({
    _class: "ValueButton",
    Extends: Button,
    Implements: [Warning, Ranged],
    options:  {
        value: 0,
        value_format: function (val) { return val.toFixed(2); },
        bar_direction: _TOOLKIT_HORIZONTAL,
        drag_direction: _TOOLKIT_VERTICAL,
        snap: 0.01
    },
    initialize: function (options) {
        Button.prototype.initialize.call(this, options);
        
        this.element.classList.add("toolkit-valuebutton");
        
        this._bar     = toolkit.element("div","toolkit-bar");
        this._base    = toolkit.element("div","toolkit-base");
        this._over    = toolkit.element("div","toolkit-over");

        this._bar.appendChild(this._base);
        this._bar.appendChild(this._over);
        
        this.value = new Value({
            container: this.element,
            value: this.options.value,
            format: this.options.value_format,
            set: function (val) {
                    this.set("value", val);
                    this.fire_event("useraction", ["value", val, this]);
                    return this.options.value; }.bind(this)
        });
        this.value.add_event("valueclicked", this._value_clicked.bind(this));
        this.value.add_event("valuedone", this._value_done.bind(this));
        
        this._input = this.value._input;
        
        this._bar.inject(this.element, "bottom");
        
        this.set("bar_direction", this.options.bar_direction, true);
        
        this.drag = new DragValue({
            element:   this.element,
            range:     function () { return this; }.bind(this),
            get:       function () { return this.options.value; }.bind(this),
            set:       function (v) {
                this.set("value", v);
                this.fire_event("useraction", ["value", v, this]);
            }.bind(this),
            direction: this.options.drag_direction,
            events: function () { return this }.bind(this)
        });
        this.scroll = new ScrollValue({
            element: this.element,
            range:   function () { return this }.bind(this),
            get:     function () { return this.options.value; }.bind(this),
            set:     function (v) {
                this.set("value", v);
            }.bind(this),
            events: function () { return this }.bind(this)
        });
        this.redraw();
        this.initialized();
    },
    
    redraw: function () {
        this.value.set("value", this.options.value);
        this._base.style[this.options.bar_direction == _TOOLKIT_HORIZONTAL
            ? "width" : "height"] = this.val2perc() + "%";
        Button.prototype.redraw.call(this);
    },
    
    destroy: function () {
        this.drag.destroy();
        this.scroll.destroy();
        this.value.destroy();
        this._over.destroy();
        this._base.destroy();
        this._bar.destroy();
        Button.prototype.destroy.call(this);
    },
    
    
    _value_clicked: function () {
        this.scroll.set("active", false);
        this.drag.set("active", false);
    },
    _value_done: function () {
        this.scroll.set("active", true);
        this.drag.set("active", true);
        this.fire_event("valueset", [this.options.value, this]);
    },
    
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "bar_direction":
                this.element.classList.remove("toolkit-vertical");
                this.element.classList.remove("toolkit-horizontal");
                switch (value) {
                    case _TOOLKIT_HORIZONTAL:
                    default:
                        var c = "toolkit-horizontal";
                        break;
                    case _TOOLKIT_VERTICAL:
                        var c = "toolkit-vertical";
                        break;
                }
                this.element.classList.add(c);
                if (!hold) this.redraw();
                break;
            case "value":
                this.options.value = this.snap_value(Math.min(this.options.max,
                                     Math.max(this.options.min, value)));
                if (value > this.options.max || value < this.options.min)
                    this.warning(this.element);
                this.fire_event("valuechanged", [this.options.value, this]);
                if (!hold) this.redraw();
                return;
            case "value_format":
                this.value.set("format", value);
                if (!hold) this.redraw();
                break;
            case "drag_direction":
                this.drag.set("direction", value);
                break;
        }
        Button.prototype.set.call(this, key, value, hold);
    }
});
