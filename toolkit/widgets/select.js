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
function index_by_value(val) {
    var entries = this.entries;
    for (var i = 0; i < entries.length; i++) {
        if (entries[i].value === val)
            return i;
    }
    return false;
}
function index_by_title(title) {
    var entries = this.entries;
    for (var i = 0; i < entries.length; i++) {
        if (entries[i].title === title)
            return i;
    }
    return false;
}
function index_by_entry(entry) {
    var pos = this.entries.indexOf(entry);
    return pos === -1 ? false : pos;
}
function hide_list() {
    this.__transition = false;
    this.__timeout = false;
    if (!this.__open) {
        this._list.remove();
    } else {
        document.addEventListener("touchstart", this._global_touch_start);
        document.addEventListener("mousedown", this._global_touch_start);
    }
}
function show_list(show) {
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
    this.__timeout = window.setTimeout(hide_list.bind(this), dur * 1000);
}
w.TK.Select = w.Select = $class({
    /** @class Select
     * @description Select provides a button with a select list to choose from
     * different entries.
     */
    _class: "Select",
    Extends: Button,
    _options: Object.assign(Object.create(Button.prototype._options), {
        entries: "array",
        selected: "int",
        value: "mixed",
        auto_size: "boolean",
    }),
    options: {
        entries: [], // A list of strings or objects: {title: "Title", value: 1}
        selected: false,
        value: false,
        auto_size: true
    },
    initialize: function (options)  {
        this.__open = false;
        this.__timeout = -1;
        this.entries = [];
        this._active = null;
        Button.prototype.initialize.call(this, options);
        TK.add_class(this.element, "toolkit-select");
        
        this.add_event("click", function (e) {
            show_list.call(this, !this.__open);
        }.bind(this));
        
        this._list = TK.element("ul", "toolkit-select-list");
        this._global_touch_start = function (e) {
            if (this.__open && !this.__transition &&
                !this._list.contains(e.target) &&
                !this.element.contains(e.target)) {

                show_list.call(this, false);
            }
        }.bind(this);
        this._arrow = TK.element("div", "toolkit-arrow");
        this._cell.appendChild(this._arrow);
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
        this._list.remove();
        this.element.remove();
        Button.prototype.destroy.call(this);
    },
    
    select: function (id) {
        this.set("selected", id);
    },
    
    select_value: function (value) {
        var id = index_by_value.call(this, value);
        this.set("selected", id);
    },
    
    set_entries: function (entries) {
        // Replace all entries with a new options list
        this.clear();
        this.add_entries(entries);
        this.select(index_by_value.call(this, this.options.value));
    },
    add_entries: function (entries) {
        for (var i = 0; i < entries.length; i++)
            this.add_entry(entries[i], true);
    },
    add_entry: function (ent) {
        var li = TK.element("li", "toolkit-option");
        var entry = {};
        entry.element = li;
        entry.value = (typeof ent == "string") ? ent
                                               : ent.value;
        entry.title = (typeof ent == "string")
                       ? ent : (typeof ent.title != "undefined")
                       ? ent.title : ent.value.toString()
        
        TK.set_text(li, entry.title);
        
        this.entries.push(entry);
        var id = this.entries.length - 1;
        var up_cb = function (e) {
            this.select(id);
            this.fire_event("select", entry.value, id, entry.title);
            show_list.call(this, false);
        }.bind(this);

        li.addEventListener("click", up_cb);

        this.invalid.entries = true;

        if (this.options.selected === id) {
            this.invalid.selected = true;
            this.trigger_draw();
        } else if (this.options.selected > id) {
            this.set("selected", this.options.selected+1);
        } else {
            this.trigger_draw();
        }

        this._list.appendChild(li);
    },
    remove_value: function (val) {
        this.remove_id(index_by_value.call(this, val));
    },
    remove_title: function (title) {
        this.remove_id(index_by_title.call(this, title));
    },
    remove_entry: function (entry) {
        this.remove_id(get_entry.call(this, entry));
    },
    remove_id: function (id) {
        // remove DOM element
        var entry = this.entries[id];

        if (entry) {
            var li = entry.element;
            this._list.removeChild(li);
            // remove from list
            this.entries.splice(id, 1);
            // selection
            var sel = this.options.selected;
            if (sel !== false) {
                if (sel > id) {
                    this.options.selected --;
                } else if (sel === id) {
                    this.options.selected = false;
                    this.set("label", "");
                }
            }
            this.invalid.entries = true;
            this.select(this.options.selected);
        }
    },
    clear: function () {
        TK.empty(this._list);
        this.select(false);
        this.entries = [];
    },

    redraw: function() {
        Button.prototype.redraw.call(this);

        var I = this.invalid;
        var O = this.options;
        var E = this.element;
        var L;

        if (I.selected) {
            if (this._active) {
                TK.remove_class(this._active, "toolkit-active");
            }
            var entry = this.entries[O.selected];

            if (entry) {
                this._active = entry.element;
                TK.add_class(entry.element, "toolkit-active");
            } else {
                this._active = null;
            }
        }

        if (I.validate("entries", "auto_size")) {
            if (O.auto_size) {
                L = this._label;
                var width = 0;
                E.style.width = "auto";
                var t = L.innerHTML;
                var tmp = "";
                for (var i = 0; i < this.entries.length; i++) {
                    tmp += this.entries[i].title + "<br>";
                }
                L.innerHTML = tmp;
                TK.S.add(function() {
                    width = TK.outer_width(E, true);
                    TK.S.add(function() {
                        L.innerHTML = t;
                        TK.outer_width(E, true, width);
                    });
                }, 1);
            }
        }
    },
    current: function() {
        return this.entries[this.options.selected];
    },
    set: function (key, value) {
        if (key === "value") {
            var index = index_by_value.call(this, value);
            if (index === false) return;
            key = "selected";
            value = index;
        }

        value = Button.prototype.set.call(this, key, value);

        switch (key) {
            case "selected":
                var entry = this.current();
                if (entry) {
                    Button.prototype.set.call(this, "value", entry.value); 
                    this.set("label", entry.title);
                } else {
                    this.set("label", "");
                }
                break;
            case "entries":
                this.set_entries(value);
                break;
        }
        return value;
    }
});
})(this);
