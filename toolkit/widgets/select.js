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

Select = new Class({
    // Select provides a button with a select list to choose from
    // different options.
    _class: "Select",
    Extends: Button,
    options: {
        list: [],
        selected: false,
        auto_size: true
    },
    __open: false,
    __width: 0,
    initialize: function (options)  {
        Button.prototype.initialize.call(this, options);
        this.element.addClass("toolkit-select");
        
        this.add_event("click", function (e) {
            this.show_list(!this.__open);
        }.bind(this));
        
        this._list = new Element("ul.toolkit-select-list");
        this._list.set("tween", {
            onComplete: this._hide_list.bind(this),
            duration: 200
        });
        document.addEventListener("mousedown", function () {
            if (this.__open && !this.__transition) {
                this.show_list(false);
            }
        }.bind(this));
        
        this._arrow = new Element("div.toolkit-arrow").inject(this.element)
        
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
        var li = new Element("li.toolkit-option");
        li.inject(this._list);
        var opt = {};
        opt.element = li;
        opt.title = (typeof option == "string")
                       ? option : (typeof option.title != "undefined")
                       ? option.title : option.value
        opt.value = (typeof option == "string") ? option
                                                : option.value.toString();
        
        li.set("html", opt.title);
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
            this.element.style["width"] = null;
            return;
        };
        for (var i in this.list) {
            var t = this._label.get("html");
            this._label.set("html", this.list[i].title);
            this.__width = Math.max(this.__width, this.element.outerWidth());
            this.element.outerWidth(this.__width + 1);
            this._label.set("html", t);
        }
    },
    select: function (key) {
        key = key.toString();
        if (this.list[key]) {
            this.set("label", this.list[key].title);
            if (this.options.selected !== false) {
                this.list[this.options.selected].element.removeClass("toolkit-active");
            }
            this.list[key].element.addClass("toolkit-active");
            this.options.selected = key;
        }
    },
    show_list: function (show) {
        if (show) {
            var pos = this.element.getPosition();
            pos.y += this.element.outerHeight();
            var ew = this.element.outerWidth();
            this._list.inject($$("body")[0]);
            var cw = window.getSize().x;
            var ch = window.getSize().y;
            var sx = (window.pageXOffset !== undefined) ? window.pageXOffset
                   : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
            var sy = (window.pageYOffset !== undefined) ? window.pageYOffset
                   : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            this._list.setStyles({
                "opacity": 0,
                "max-height": ch,
                "max-width": cw,
                "min-width": ew
            });
            var lw = this._list.outerWidth();
            var lh = this._list.outerHeight();
            this._list.setStyles({
                "top": Math.min(this.element.getPosition().y + this.element.outerHeight(), ch + sy - lh),
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
