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
window.onerror = function (error) { alert(error) };
Value = new Class({
    // Value is a formatted text field displaying numbers and providing
    // a input field for editing the value
    _class: "Value",
    Extends: Widget,
    options: {
        value: 0,
        format: function (val) { return sprintf("%0.2f",  val); },
        set: false // set a callback function if value is editable or
                   // false to disable editing. A function has to return
                   // the value treated by the parent widget.
    },
    initialize: function (options) {
        this.parent(options);
        this.element = this.widgetize(new Element("form.toolkit-value"),
                                      true, true, true);
        this._input  = new Element("input.toolkit-input", {type: "text"});
        this._input.inject(this.element);
        
        this.element.addEvent("click", this._value_clicked.bind(this));
        this.element.addEvent("touchstart", this._value_clicked.bind(this));
        this.element.addEvent("submit", function () { return false; });
        this._input.addEvent("keyup", this._value_typing.bind(this));
        this._input.addEvent("blur", this._value_done.bind(this));
        
        if (this.options.container)
            this.set("container", this.options.container);
        
        this.set("value", this.options.value);
    },
    
    redraw: function () {
        if (this.__editing) return;
        this._input.set("value", this.options.format(this.options.value));
    },
    
    destroy: function () {
        document.removeEvent("click", this._value_done.bind(this));
        this._input.destroy();
        this.element.destroy();
        this.parent();
    },
    
    // HELPERS & STUFF
    _value_clicked: function (e) {
        if (!this.options.set) return;
        if (this.__editing) return false;
        this.element.addClass("toolkit-active");
        this._input.set("value", this.options.value);
        this.__editing = true;
        this._input.focus();
        document.addEvent("click", this._value_done.bind(this));
        this.fireEvent("valueclicked", [this.options.value, this]);
        e.stopPropagation();
    },
    _value_typing: function (e) {
        if (!this.options.set) return;
        if (!this.__editing) return;
        switch (e.key) {
            case "esc":
                this._value_done();
                this.fireEvent("valueescape", [this.options.value, this]);
                break;
            case "enter":
                var val = parseFloat(this._input.get("value") || 0);
                val = this.options.set(val);
                this.set("value", val, true);
                this._value_done();
                this.fireEvent("valueset", [this.options.value, this]);
                this.fireEvent("useraction", ["value", this.options.value, this]);
                break;
            default:
                this.set("value", val, true);
                break;
        }
        this.fireEvent("valuetyping", [e, this.options.value, this]);
    },
    _value_done: function () {
        if (!this.__editing) return;
        this.__editing = false;
        this.element.removeClass("toolkit-active");
        document.removeEvent("click", this._value_done.bind(this));
        document.removeEvent("touchstart", this._value_done.bind(this));
        this._input.blur();
        this.fireEvent("valuedone", [this.options.value, this]);
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
        }
        this.parent(key, value, hold);
    }
});
