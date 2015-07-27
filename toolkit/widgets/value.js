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

Value = $class({
    // Value is a formatted text field displaying numbers and providing
    // a input field for editing the value
    _class: "Value",
    Extends: Widget,
    options: {
        value: 0,
        format: function (val) { return val.toFixed(2); },
        size: 5,
        // set a callback function if value is editable or
        // false to disable editing. A function has to return
        // the value treated by the parent widget.
        set: function (val) { return parseFloat(val || 0); }
    },
    initialize: function (options) {
        Widget.prototype.initialize.call(this, options);
        this.element = this.widgetize(toolkit.element("form", "toolkit-value"),
                                      true, true, true);
        this._input  = toolkit.element("input", "toolkit-input");
        this._input.type = "text";
        this.element.appendChild(this._input);
        
        this.__touch_start_cb = function (e) {
            e.preventDefault();
            this._value_init(e);
            return false;
        }.bind(this);
        
        this.__touch_end_cb = function (e) {
            e.preventDefault();
            this._value_clicked(e);
            return false;
        }.bind(this);
        
        this.__start_cb = this._value_init.bind(this);
        this.__end_cb   = this._value_clicked.bind(this);
        
        this.element.addEventListener("submit", function (e) { 
            e.preventDefault();
            return false;
        });
        
        this.add_event("pointerdown",  this.__start_cb);
        this.add_event("pointerup",  this.__end_cb);
                
        this._input.addEventListener("keyup",      this._value_typing.bind(this));
        this._input.addEventListener("blur",       this._value_done.bind(this));
        
        if (this.options.container)
            this.set("container", this.options.container);
        this.set("size", this.options.size);
        this.set("value", this.options.value);
        this.__clicked = false;
    },
    
    redraw: function () {
        if (this.__editing) return;
        this._input.setAttribute("value", this.options.format(this.options.value));
    },
    
    destroy: function () {
        this._input.destroy();
        this.element.destroy();
        Widget.prototype.destroy.call(this);
    },
    
    // HELPERS & STUFF
    _value_clicked: function (e) {
        // TODO: FIXME by finishing the dedicated keyboard widget
        if (toolkit.os() == "Android") {
            e.preventDefault();
            //e.stopPropagation();
            return false;
        }
        // TODO
        if (!this.__clicked)
            return;
        this.__clicked = false;
        if (!this.options.set) return;
        if (this.__editing) return false;
        this.element.classList.add("toolkit-active");
        this._input.setAttribute("value", this.options.value);
        this.__editing = true;
        this._input.focus();
        this.fire_event("valueclicked", [this.options.value, this]);
        //e.stopPropagation();
    },
    _value_init: function (e) {
        this.__clicked = true;
    },
    
    _value_typing: function (e) {
        if (!this.options.set) return;
        if (!this.__editing) return;
        switch (e.keyCode) {
            case 27:
                // ESC
                this._value_done();
                this.fire_event("valueescape", [this.options.value, this]);
                break;
            case 13:
                // ENTER
                var val = this.options.set(this._input.getAttribute("value"));
                this.set("value", val, true);
                this._value_done();
                this.fire_event("valueset", [this.options.value, this]);
                this.fire_event("useraction", ["value", this.options.value, this]);
                e.preventDefault();
                return false;
                break;
            default:
                //this.set("value", val, true);
                break;
        }
        this.fire_event("valuetyping", [e, this.options.value, this]);
    },
    _value_done: function (e) {
        if (!this.__editing) return;
        this.__editing = false;
        this.element.classList.remove("toolkit-active");
        this._input.blur();
        this.fire_event("valuedone", [this.options.value, this]);
        this.redraw();
    },
    
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "value":
                if (!hold) this.redraw();
                break;
            case "format":
                if (!hold) this.redraw();
                break;
            case "size":
                this._input.setAttribute("size", value);
                break;
        }
        Widget.prototype.set.call(this, key, value, hold);
    }
});
