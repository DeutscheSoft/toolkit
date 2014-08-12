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
    // different options.
    _class: "Select",
    Extends: Button,
    options: {
        list: [],
        selected: false,
        auto_size: true
    },
    initialize: function (options)  {
        this.__open = false;
        this.__width = 0;
        Button.prototype.initialize.call(this, options);
        this.element.classList.add("toolkit-select");
        
        this.add_event("click", function (e) {
            this.show_list(!this.__open);
        }.bind(this));
        
        this._list = toolkit.element("ul", "toolkit-select-list");
        this._list.set("tween", {
            onComplete: this._hide_list.bind(this),
            duration: 200
        });
        document.addEventListener("mousedown", function () {
            if (this.__open && !this.__transition) {
                this.show_list(false);
            }
        }.bind(this));
        
        this._arrow = toolkit.element("div", "toolkit-arrow");
        this.element.appendChild(this._arrow);
        
        this.set("options", this.options.list);
        
        this.initialized();
    },
    list: {},
    destroy: function () {
        this._list.destroy();
        this.element.destroy();
        Button.prototype.destroy.call(this);
    },
    set_options: function (list) {
        this._list.empty();
        this.list = {};
        this.add_options(list);
    },
    add_options: function (list) {
        for (var i = 0; i < list.length; i++)
            this.add_option(list[i], true);
        this.resize();
    },
    add_option: function (option, hold) {
        var li = toolkit.element("li", "toolkit-option");
        this._list.appendChild(li);
        var opt = {};
        opt.element = li;
        opt.title = (typeof option == "string")
                       ? option : (typeof option.title != "undefined")
                       ? option.title : option.value
        opt.value = (typeof option == "string") ? option
                                                : option.value.toString();
        
        li.innerHTML = opt.title;
        li.addEventListener("mouseup", function (e) {
            this.select(opt.value);
            this.fire_event("select", [opt.value, li, this, opt]);
        }.bind(this));
        
        this.list[opt.value] = opt;
        
        if (this.options.selected == opt.value) {
            this.select(opt.value);
        }
        
        if (!hold) this.resize();
    },
    remove_option: function (key) {
        key = key.toString();
        if (typeof this.list[key] != "undefined") {
            this.list.key.destroy();
        }
        if (this.options.selected == key) {
            this.options.selected = false;
            this.set("label", "");
        }
    },
    remove_options: function (list) {
        for (var i = 0; i < list.length; i++)
            this.remove_option(list[i]);
    },
    resize: function () {
        if (!this.options.auto_size) {
            delete this.element.style["width"];
            return;
        };
        for (var i in this.list) {
            var t = this._label.get("html");
            this._label.innerHTML = this.list[i].title;
            this.__width = Math.max(this.__width, toolkit.outer_width(this.element, true));
            toolkit.outer_width(this.element, true, this.__width + 1);
            this._label.innerHTML = t;
        }
    },
    select: function (key) {
        key = key.toString();
        if (this.list[key]) {
            this.set("label", this.list[key].title);
            if (this.options.selected !== false) {
                this.list[this.options.selected].element.classList.remove("toolkit-active");
            }
            this.list[key].element.classList.add("toolkit-active");
            this.options.selected = key;
        }
    },
    show_list: function (show) {
        if (show) {
            var pos = this.element.getPosition();
            pos.y += toolkit.outer_height(this.element, true);
            var ew = toolkit.outer_width(this.element, true);
            document.body.appendChild(this._list);
            var cw = window.getSize().x;
            var ch = window.getSize().y;
            var sx = (window.pageXOffset !== undefined) ? window.pageXOffset
                   : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
            var sy = (window.pageYOffset !== undefined) ? window.pageYOffset
                   : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            toolkit.set_styles(this._list, {
                "opacity": 0,
                "max-height": ch,
                "max-width": cw,
                "min-width": ew
            });
            var lw = toolkit.outer_width(this._list, true);
            var lh = toolkit.outer_height(this._list, true);
            toolkit.set_styles(this._list, {
                "top": Math.min(this.element.getPosition().y + toolkit.outer_height(this.element, true), ch + sy - lh),
                "left": Math.min(this.element.getPosition().x, cw + sx - lw),
            });
        }
        this.__transition = true;
        this._list.tween("opacity", show ? 1 : 0);
        this.__open = show;
    },
    _hide_list: function () {
        this.__transition = false;
        if (!this.__open) {
            this._list.dispose()
        }
    },
    
    set: function (key, value, hold) {
        switch (key) {
            case "selected":
                this.select(value);
                break;
        }
        this.options[key] = value;
        switch (key) {
            case "options":
                this.set_options(value);
                break;
            case "auto_size":
                this.resize();
                break;
        }
        Button.prototype.set.call(this, key, value, hold);
    }
});
