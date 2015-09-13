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
w.ButtonArray = $class({
    // ButtonArray is a list of buttons layouted either vertically or
    // horizontally. ButtonArray automatically adds arrow buttons if the
    // overal width is smaller than the buttons list.
    _class: "ButtonArray",
    Extends: Container,
    options: {
        buttons: [],                    // a list of button options or label strings which
                                        // is converted to button instances
                                        // on init. If get is called, the
                                        // converted list of button instances is
                                        // returned.
        auto_arrows: true,              // if arrow buttons are added automatically
        direction: _TOOLKIT_HORIZONTAL, // the direction of the button list
        show: -1                         // the button to scroll to, either
                                        // an int or a button instance
    },
    
    initialize: function (options) {
        this.buttons = [];
        Container.prototype.initialize.call(this, options);
        this.element.className += " toolkit-buttonarray";
        this._clip      = TK.element("div", "toolkit-clip");
        this._container = TK.element("div", "toolkit-container");
        this.element.appendChild(this._clip);
        this._clip.appendChild(this._container);
        
        vert = this.get("direction") == _TOOLKIT_VERTICAL;
        
        this.prev = new Button({label: vert ? "▲" : "◄",
                                class: "toolkit-previous"});
        this.next = new Button({label: vert ? "▼" : "►",
                                class: "toolkit-next"});
        this.prev.add_event("pointerup", this._prev_clicked.bind(this));
        this.next.add_event("pointerup", this._next_clicked.bind(this));
        this._prev = this.prev.element;
        this._next = this.next.element;
        
        this.set("direction", this.options.direction);
        this.add_buttons(this.options.buttons);
        this._scroll_to(this.options.show, true);
        Container.prototype.initialized.call(this);
    },
    
    resize: function () {
        this._check_arrows();
        this._scroll_to(this.options.show);
    },
    
    add_buttons: function (options) {
        for (var i = 0; i < options.length; i++)
            this.add_button(options[i]);
    },
    
    add_button: function (options, pos) {
        if (typeof options === "string")
            options = {label: options}
        var b    = new Button(options);
        var len  = this.buttons.length;
        var vert = this.options.direction == _TOOLKIT_VERT;
        if (typeof pos == "undefined")
            pos = this.buttons.length;
        if (pos == len) {
            this.buttons.push(b);
            this._container.appendChild(b.element);
        } else {
            this.buttons.splice(pos, 0, b);
            this._container.insertBefore(b.element,
                this._container.childNodes[pos]);
        }
        var sb = b.element.getBoundingClientRect()[vert ? "height" : "width"];
        
        this._check_arrows();
        var c = b;
        b.add_event("pointerup", function () {
            this._button_clicked(c);
        }.bind(this));
        this._scroll_to(this.options.show);
        this.fire_event("added", [b, this]);
        return b;
    },
    remove_button: function (button) {
        if (typeof button == "object")
            button = this.buttons.indexOf(button);
        if (button < 0 || button >= this.buttons.length)
            return;
        this.fire_event("removed", [this.buttons[button], this]);
        this.buttons[button].destroy();
        this.buttons.splice(button, 1);
        this._check_arrows();
        this.buttons[this.options.show].set("state", false);
        if (button < this.options.show)
            this.options.show--;
        this._scroll_to(this.options.show);
    },
    
    destroy: function () {
        for (var i = 0; i < this.buttons.length; i++)
            this.buttons[i].destroy();
        this.prev.destroy();
        this.next.destroy();
        TK.destroy(this._container);
        TK.destroy(this._clip);
        Container.prototype.destroy.call(this);
    },
    
    _check_arrows: function (force) {
        /* check if we need to show or hide arrow buttons */
        if (!this.options.auto_arrows && !force)
            return;
        var erect = this.element.getBoundingClientRect();
        var brect = this._list_size();
        var vert  = this.options.direction == _TOOLKIT_VERT;
        this._show_arrows((vert ? brect > erect.height
                                : brect > erect.width)
                                && this.options.auto_arrows);
    },
    
    _show_arrows: function (show) {
        if(show) {
            this.element.insertBefore(this._prev, this._clip);
            this.element.appendChild(this._next);
            TK.add_class(this.element, "toolkit-over");
        } else {
            if (this.element.firstChild == this._prev)
                this.element.removeChild(this._prev);
            if (this.element.lastChild == this._next)
                this.element.removeChild(this._next);
            TK.remove_class(this.element, "toolkit-over");
        }
        this._scroll_to(this.options.show);
    },
    
    _scroll_to: function (id, force) {
        /* move the container so that the requested button is shown */
        /* hand over a button instance or a number */
        if (typeof id == "object")
            id = this.buttons.indexOf(id);
        // TODO: the id==this.options.show check breaks the button array. for some reason
        // the style calculations here can be completely wrong on the first time and get
        // ignored henceforward
        if (id < 0 || id >= this.buttons.length/* || (id == this.options.show && !force)*/)
            return this.options.show;
        if (this.options.show >= 0 && this.options.show < this.buttons.length)
            this.buttons[this.options.show].set("state", false);
        var dir      = this.options.direction == _TOOLKIT_VERTICAL;
        var subd     = dir ? 'top' : 'left';
        var subs     = dir ? 'height' : 'width';
        var btn      = this._container.childNodes[id];
        var btnrect  = btn.getBoundingClientRect();
        var conrect  = this._container.getBoundingClientRect();
        var btnsize  = toolkit["outer_" + subs](btn);
        var btnpos   = btnrect[subd] - conrect[subd];
        var listsize = this._list_size();
        var clipsize = this._clip.getBoundingClientRect()[subs];
        this._container.style[subd] = -(Math.max(0, Math.min(listsize - clipsize, btnpos - (clipsize / 2 - btnsize / 2)))) + "px";
        var tmp = this.options.show;
        this.options.show = id;
        this.buttons[id].set("state", true);
        if (tmp != id) {
            this.fire_event("changed", [this.buttons[id], id, this]);
        }
        return id;
    },
    
    _list_size: function () {
        var dir      = this.options.direction == _TOOLKIT_VERTICAL;
        var subd     = dir ? 'top' : 'left';
        var subs     = dir ? 'height' : 'width';
        var subm2    = dir ? 'marginBottom' : 'marginRight';
        var btn      = this._container.lastChild;
        var btnstyle = btn.currentStyle || window.getComputedStyle(btn);
        var lastrect = this._container.lastChild.getBoundingClientRect();
        var conrect  = this._container.getBoundingClientRect();
        return lastrect[subd] - conrect[subd] + lastrect[subs] + parseInt(btnstyle[subm2]);
    },
    
    _prev_clicked: function (e) {
        this.fire_event("clicked", [this._scroll_to(this.options.show - 1), this]);
    },
    
    _next_clicked: function (e) {
        this.fire_event("clicked", [this._scroll_to(this.options.show + 1), this]);
    },
    
    _button_clicked: function (button) {
        this.fire_event("clicked", [this._scroll_to(button), this]);
    },
    
    set: function (key, value, hold) {
        switch (key) {
            case "buttons":
                if (hold)
                    break;
                for (var i = 0; i < this.buttons.length; i++)
                    this.buttons[i].destroy();
                this.buttons = [];
                this.add_buttons(value);
                break;
            case "direction":
                TK.remove_class(this.element, "toolkit-vertical");
                TK.remove_class(this.element, "toolkit-horizontal");
                TK.add_class(this.element, "toolkit-" + (value == _TOOLKIT_VERT ? "vertical" : "horizontal"));
                this.prev.set("label", value == _TOOLKIT_VERT ? "▲" : "◀");
                this.next.set("label", value == _TOOLKIT_VERT ? "▼" : "▶");
                break;
            case "auto_arrows":
                this._check_arrows(true);
                break;
            case "show":
                this._scroll_to(value);
        }
        Container.prototype.set.call(this, key, value, hold);
    },
    get: function (key) {
        switch (key) {
            case "buttons":
                return this.buttons;
        }
        return Container.prototype.get.call(this, key);
    }
});
})(this);
