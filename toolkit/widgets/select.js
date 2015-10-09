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
w.Select = $class({
    // Select provides a button with a select list to choose from
    // different entries.
    _class: "Select",
    Extends: Button,
    options: {
        entries: [], // A list of strings or objects: {title: "Title", value: 1}
        selected: false,
        value: false,
        auto_size: true
    },
    initialize: function (options)  {
        this.__open = false;
        this.__timeout = -1;
        this.__width = 0;
        this.entries = [];
        Button.prototype.initialize.call(this, options);
        TK.add_class(this.element, "toolkit-select");
        
        this.add_event("click", function (e) {
            this.show_list(!this.__open);
        }.bind(this));
        
        this._list = TK.element("ul", "toolkit-select-list");
        this._global_touch_start = function (e) {
            if (this.__open && !this.__transition &&
                !this._list.contains(e.target) &&
                !this.element.contains(e.target)) {

                this.show_list(false);
            }
        }.bind(this);
        this._arrow = TK.element("div", "toolkit-arrow");
        this.element.appendChild(this._arrow);
        var sel = this.options.selected;
        var val = this.options.value; 
        this.set("entries",  this.options.entries);
        if (sel === false && val !== false) {
            this.set("value", val);
        } else {
            this.set("selected", sel);
        }
    },
    destroy: function () {
        TK.destroy(this._list);
        TK.destroy(this.element);
        Button.prototype.destroy.call(this);
    },
    
    select: function (id) {
        // Select an entry. Hand over the ID (position in the list) or
        // false if nothing should be selected.            
        var sel = this.options.selected;
        this.options.selected = id;
        
        // remove active style from last selected
        if (sel !== false && sel >= 0 && sel < this.entries.length)
            TK.remove_class(this.entries[sel].element, "toolkit-active");
        
        if (id !== false && id >= 0 && id < this.entries.length) {
            // add active style to selection
            TK.add_class(this.entries[id].element, "toolkit-active");
            // and set the selected value to options
            this.options.value = this.entries[id].value;
            // label
            this.set("label", this.entries[id].title);
        } else {
//          this.options.value = false;
            this.set("label", "");
        }
    },
    
    select_value: function (value) {
        var id = this._get_entry_by_value(value, true);
        if (id !== false || value === false)
            this.select(id);
    },
    
    set_entries: function (entries) {
        // Replace all entries with a new options list
        this.clear();
        this.add_entries(entries);
        this.select(this._get_entry_by_value(this.options.value, true));
    },
    add_entries: function (entries) {
        for (var i = 0; i < entries.length; i++)
            this.add_entry(entries[i], true);
        this.set_size();
    },
    add_entry: function (ent, hold) {
        var li = TK.element("li", "toolkit-option");
        this._list.appendChild(li);
        var entry = {};
        entry.element = li;
        entry.value = (typeof ent == "string") ? ent
                                               : ent.value;
        entry.title = (typeof ent == "string")
                       ? ent : (typeof ent.title != "undefined")
                       ? ent.title : ent.value.toString()
        
        li.innerHTML = entry.title;
        
        this.entries.push(entry);
        var id = this.entries.length - 1;
        var up_cb = function (e) {
            this.select(id);
            this.fire_event("select", entry.value, id, entry.title);
            this.show_list(false);
        }.bind(this);
        li.addEventListener("click", up_cb);
        if (this.options.selected === id) {
            this.select(id);
        } 
        if (this.options.selected > id) {
            this.select(this.options.selected+1);
        }
        
        if (!hold) this.set_size();
    },
    remove_value: function (val) {
        this.remove_id(this._get_entry_by_value(val, true));
    },
    remove_title: function (title) {
        this.remove_id(this._get_entry_by_title(title, true));
    },
    remove_entry: function (entry) {
        this.remove_id(this._get_entry(entry, true));
    },
    remove_id: function (id) {
        // in range?
        if (id === false || id < 0 || id >= this.options.length)
            return;
        // remove DOM element
        this.entries[id].element.parentNode.removeChild(this.entries[id].element);
        // remove from list
        this.entries.splice(id, 1);
        // selection
        var sel = this.options.selected;
        if (sel !== false && sel > id)
            this.options.selected --;
        else if (sel !== false && sel == id) {
            this.options.selected = false;
            this.set("label", "");
        }
        this.select(this.options.selected)
    },
    clear: function () {
        this.set("label", "");
        this._list.innerHTML = "";
        this.select(false);
        this.entries = [];
    },
    set_size: function () {
        if (!this.options.auto_size)
            return;
        // set all possible titles into the buttons label, measure the
        // max width and set it as style afterwards
        /* FORCE_RELAYOUT */
        this.__width = 0;
        this.element.style.width = "auto";
        var t = this._label.innerHTML;
        for (var i = 0; i < this.entries.length; i++) {
            this.set("label", this.entries[i].title);
            var act = TK.outer_width(this.element, true);
            this.__width = Math.max(this.__width, act);
        }
        TK.outer_width(this.element, true, this.__width);
        this._label.innerHTML = t;
    },
    
    show_list: function (show) {
        if (show) {
            var ew = TK.outer_width(this.element, true);
            document.body.appendChild(this._list);
            var cw = TK.width();
            var ch = TK.height();
            var sx = TK.scroll_left();
            var sy = TK.scroll_top();
            TK.set_styles(this._list, {
                "opacity": 0,
                "maxHeight": ch,
                "maxWidth": cw,
                "minWidth": ew
            });
            var lw = TK.outer_width(this._list, true);
            var lh = TK.outer_height(this._list, true);
            TK.set_styles(this._list, {
                "top": Math.min(TK.position_top(this.element) + TK.outer_height(this.element, true), ch + sy - lh) + "px",
                "left": Math.min(TK.position_left(this.element), cw + sx - lw) + "px",
            });
        } else {
            document.removeEventListener("touchstart", this._global_touch_start);
            document.removeEventListener("mousedown", this._global_touch_start);
        }
        TK.set_style(this._list, "opacity", show ? "1" : "0");
        this.__transition = true;
        this.__open = show;
        if (this.__timeout !== false) window.clearTimeout(this.__timeout);
        var dur = parseFloat(TK.get_style(this._list, "transition-duration"));
        this.__timeout = window.setTimeout(this._hide_list.bind(this), dur * 1000);
    },
    _hide_list: function () {
        this.__transition = false;
        this.__timeout = false;
        if (!this.__open) {
            TK.destroy(this._list);
        } else {
            document.addEventListener("touchstart", this._global_touch_start);
            document.addEventListener("mousedown", this._global_touch_start);
        }
    },
    _get_entry_by_value: function (val, id) {
        for (var i = 0; i < this.entries.length; i++) {
            if (this.entries[i].value === val)
                return id ? i : this.entries[i];
        }
        return false;
    },
    _get_entry_by_title: function (title, id) {
        for (var i = 0; i < this.entries.length; i++) {
            if (this.entries[i].title === title)
                return id ? i : this.entries[i];
        }
        return false;
    },
    _get_entry: function (option, id) {
        for (var i = 0; i < this.entries.length; i++) {
            if (this.entries[i] === option)
                return id ? i : this.entries[i];
        }
        return false;
    },
    set: function (key, value, hold) {
        switch (key) {
            case "selected":
                this.select(value);
                break;
            case "value":
                this.select_value(value);
                break;
        }
        this.options[key] = value;
        switch (key) {
            case "entries":
                this.set_entries(value);
                break;
            case "auto_size":
                this.set_size();
                break;
        }
        Button.prototype.set.call(this, key, value, hold);
    }
});
})(this);
