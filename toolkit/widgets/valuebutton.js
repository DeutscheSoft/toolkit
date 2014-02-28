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

ValueButton = new Class({
    _class: "ValueButton",
    Extends: Button,
    Implements: [Warning, Ranged],
    options:  {
        value: 0,
        value_format: function (val) { return sprintf("%0.2f",  val); },
        value_position: _TOOLKIT_BOTTOM, // can be _TOOLKIT_TOP, _TOOLKIT_BOTTOM,
                                  // or _TOOLIT_ICON
        bar_position: _TOOLKIT_BOTTOM, // can be _TOOLKIT_TOP, _TOOLKIT_BOTTOM,
                                // _TOOLIT_ICON or _TOOLKIT_LABEL
        bar_direction: _TOOLKIT_HORIZONTAL,
        drag_direction: _TOOLKIT_VERTICAL,
        snap: 0.01
    },
    initialize: function (options) {
        options = Object.merge(this.__options__, options);
        this.parent(options);
        
        this.element.addClass("toolkit-valuebutton");
        
        this._bar     = new Element("div.toolkit-bar");
        this._base    = new Element("div.toolkit-base").inject(this._bar);
        this._over    = new Element("div.toolkit-over").inject(this._bar);
        
        this.value = new Value({
            container: this.element,
            value: this.options.value,
            format: this.options.value_format,
            set: function (val) {
                    this.set("value", val);
                    this.fireEvent("useraction", ["value", val, this]);
                    return this.options.value; }.bind(this),
            onValueclicked: this._value_clicked.bind(this),
            onValuedone: this._value_done.bind(this)
        });
        this._value = this.value.element;
        this._input = this.value._input;
        
        this.set("bar_direction", this.options.bar_direction, true);
        this.set("value_position", this.options.value_position);
        this.set("bar_position", this.options.bar_position);
        
        this.drag = new DragValue({
            element:   this.element,
            range:     function () { return this; }.bind(this),
            get:       function () { return this.options.value; }.bind(this),
            set:       function (v) {
                this.set("value", v);
                this.fireEvent("useraction", ["value", v, this]);
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
        this._base.setStyle((this.options.bar_direction == _TOOLKIT_HORIZONTAL
            ? "width" : "height"), this.val2perc() + "%");
        this.parent();
    },
    
    destroy: function () {
        this.drag.destroy();
        this.scroll.destroy();
        this.value.destroy();
        this._over.destroy();
        this._base.destroy();
        this._bar.destroy();
        this.parent();
    },
    
    
    _value_clicked: function () {
        this.scroll.set("active", false);
        this.drag.set("active", false);
    },
    _value_done: function () {
        this.scroll.set("active", true);
        this.drag.set("active", true);
        this.fireEvent("valueset", [this.options.value, this]);
    },
    
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "bar_direction":
                this.element.removeClass("toolkit-vertical");
                this.element.removeClass("toolkit-horizontal");
                switch (value) {
                    case _TOOLKIT_HORIZONTAL:
                    default:
                        var c = "toolkit-horizontal";
                        break;
                    case _TOOLKIT_VERTICAL:
                        var c = "toolkit-vertical";
                        break;
                }
                this.element.addClass(c);
                if (!hold) this.redraw();
                break;
            case "value_position":
                this.element.removeClass("toolkit-value-top");
                this.element.removeClass("toolkit-value-bottom");
                this.element.removeClass("toolkit-value-icon");
                switch (value) {
                    case _TOOLKIT_BOTTOM:
                        this._value.inject(this.element, "bottom");
                        this.element.addClass("toolkit-value-bottom");
                        break;
                    case _TOOLKIT_TOP:
                        this._value.inject(this.element, "top");
                        this.element.addClass("toolkit-value-top");
                        break;
                    case _TOOLKIT_ICON:
                        this._value.inject(this._icon, "after");
                        this.element.addClass("toolkit-value-icon");
                        break;
                }
                break;
            case "bar_position":
                this.element.removeClass("toolkit-bar-top");
                this.element.removeClass("toolkit-bar-bottom");
                this.element.removeClass("toolkit-bar-label");
                this.element.removeClass("toolkit-bar-icon");
                switch (value) {
                    case _TOOLKIT_BOTTOM:
                        this._bar.inject(this.element, "bottom");
                        this.element.addClass("toolkit-bar-bottom");
                        break;
                    case _TOOLKIT_TOP:
                        this._bar.inject(this.element, "top");
                        this.element.addClass("toolkit-bar-top");
                        break;
                    case _TOOLKIT_LABEL:
                        this._bar.inject(this._label, "after");
                        this.element.addClass("toolkit-bar-label");
                        break;
                    case _TOOLKIT_ICON:
                        this._bar.inject(this._icon, "after");
                        this.element.addClass("toolkit-bar-icon");
                        break;
                }
                break;
            case "value":
                this.options.value = this.snap_value(Math.min(this.options.max,
                                     Math.max(this.options.min, value)));
                if (value > this.options.max || value < this.options.min)
                    this.warning(this.element);
                this.fireEvent("valuechanged", [this.options.value, this]);
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
        this.parent(key, value, hold);
    }
});
