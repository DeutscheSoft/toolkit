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

Select = $class({
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
        this.__width = 0;
        this.entries = [];
        Button.prototype.initialize.call(this, options);
        this.element.classList.add("toolkit-select");
        
        this.add_event("pointerup", function (e) {
            this.show_list(!this.__open);
        }.bind(this));
        
        this._list = toolkit.element("ul", "toolkit-select-list");
        this._list.set("tween", {
            onComplete: this._hide_list.bind(this),
            duration: 200
        });
        document.addEventListener("touchstart", function (e) {
            if (this.__open && !this.__transition) {
                this.show_list(false);
                e.preventDefault();
            }
            // preventing the default for a _global_ touch event will
            // prevent standard browser functionality from working. for
            // instance, scroll bars will not function anymore
            // I am not sure what this is supposed to do, but we disable it for
            // now.
            //
            //  /arne
            //e.preventDefault();
        }.bind(this));
        document.addEventListener("mousedown", function () {
            if (this.__open && !this.__transition) {
                this.show_list(false);
            }
        }.bind(this));
        this._arrow = toolkit.element("div", "toolkit-arrow");
        this.element.appendChild(this._arrow);
        var sel = this.options.selected;
        var val = this.options.value; 
        this.set("entries",  this.options.entries);
        if (sel === false && val !== false) {
            this.set("value", val);
        } else {
            this.set("selected", sel);
        }
        Button.prototype.initialized.call(this);
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
            this.entries[sel].element.classList.remove("toolkit-active");
        
        if (id !== false && id >= 0 && id < this.entries.length) {
            // add active style to selection
            this.entries[id].element.classList.add("toolkit-active");
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
        var li = toolkit.element("li", "toolkit-option");
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
            this.fire_event("select", [entry.value, id, entry.title, this]);
        }.bind(this);
        var end_cb = function (e) {
            e.preventDefault();
            this.select(id);
            this.fire_event("select", [entry.value, id, entry.title, this]);
        }.bind(this);
        li.addEventListener("mousedown", up_cb);
        li.addEventListener("touchstart", end_cb);
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
        this.__width = 0;
        this.element.style.width = "auto";
        var t = this._label.innerHTML;
        for (var i = 0; i < this.entries.length; i++) {
            this.set("label", this.entries[i].title);
            var act = toolkit.outer_width(this.element, true);
            this.__width = Math.max(this.__width, act);
        }
        toolkit.outer_width(this.element, true, this.__width);
        this._label.innerHTML = t;
    },
    
    show_list: function (show) {
        if (show) {
            var pos = this.element.getPosition();
            pos.y += toolkit.outer_height(this.element, true);
            var ew = toolkit.outer_width(this.element, true);
            document.body.appendChild(this._list);
            var cw = width();
            var ch = height();
            var sx = scroll_left();
            var sy = scroll_top();
            toolkit.set_styles(this._list, {
                "opacity": 0,
                "maxHeight": ch,
                "maxWidth": cw,
                "minWidth": ew
            });
            var lw = toolkit.outer_width(this._list, true);
            var lh = toolkit.outer_height(this._list, true);
            toolkit.set_styles(this._list, {
                "top": Math.min(this.element.getPosition().y + toolkit.outer_height(this.element, true), ch + sy - lh) + "px",
                "left": Math.min(this.element.getPosition().x, cw + sx - lw) + "px",
            });
        }
        this.__transition = true;
        this._list.tween("opacity", show ? 1 : 0);
        this.__open = show;
    },
    _hide_list: function () {
        this.__transition = false;
        if (!this.__open) {
            TK.destroy(this._list);
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
