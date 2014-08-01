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

ButtonArray = $class({
    // ButtonArray is a list of buttons layouted either vertically or
    // horizontally. ButtonArray automatically adds arrow buttons if the
    // overal width is smaller than the buttons list.
    _class: "ButtonArray",
    Extends: Container,
    options: {
        buttons: [],                    // a list of button options which
                                        // is converted to button instances
                                        // on init
        auto_arrows: true,              // if arrow buttons are added automatically
        direction: _TOOLKIT_HORIZONTAL, // the direction of the button list
        show: 0                         // the button to scroll to, either
                                        // an int or a button instance
    },
    
    buttons: [],
    
    initialize: function (options) {
        Container.prototype.initialize.call(this, options);
        this.element.addClass("toolkit-buttonarray");
        this._clip      = document.createElement("DIV");
        this._container = document.createElement("DIV");
        this._clip.addClass("toolkit-clip");
        this._container.addClass("toolkit-container");
        this.element.appendChild(this._clip);
        this._clip.appendChild(this._container);
        
        vert = this.get("direction") == _TOOLKIT_VERTICAL;
        
        this.prev = new Button({label: vert ? "▲" : "◀",
                                onClick: this._prev_clicked.bind(this),
                                class: "toolkit-previous"});
        this.next = new Button({label: vert ? "▼" : "▶",
                                onClick: this._next_clicked.bind(this),
                                class: "toolkit-next"});
        
        this._prev = this.prev.element;
        this._next = this.next.element;
        
        this.set("direction", this.options.direction);
        this.add_buttons(this.options.buttons);
        this.set("show", this.options.show);
    },
    
    add_buttons: function (options) {
        for (var i = 0; i < options.length; i++)
            this.add_button(options[i]);
    },
    
    add_button: function (options, pos) {
        var b    = new Button(options);
        var len  = this.options.buttons.length;
        var vert = this.options.direction == _TOOLKIT_VERT;
        if (typeof pos == "undefined")
            pos = this.options.buttons.length;
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
        b.add_event("click", function () {
            this._button_clicked(c);
        }.bind(this));
        this._scroll_to(this.options.show);
        this.fire_event("added", [b, this]);
        return b;
    },
    
    destroy: function () {
        for (var i = 0; i < this.buttons.length; i++)
            this.buttons[i].destroy();
        this.prev.destroy();
        this.next.destroy();
        this._container.destroy();
        this._clip.destroy();
        Container.prototype.destroy.call(this);
    },
    
    _check_arrows: function (force) {
        /* check if we need to show or hide arrow buttons */
        if (!this.options.auto_arrows && !force)
            return;
        var erect = this.element.getBoundingClientRect();
        var brect = this._list_size();
        var vert  = this.options.direction == _TOOLKIT_VERT;
        console.log(brect, erect.width)
        this._show_arrows((vert ? brect > erect.height
                                : brect > erect.width)
                                && this.options.auto_arrows);
    },
    
    _show_arrows: function (show) {
        if(show) {
            this.element.insertBefore(this._prev, this._clip);
            this.element.appendChild(this._next);
            this.element.addClass("toolkit-over");
        } else {
            if (this.element.firstChild == this._prev)
                this.element.removeChild(this._prev);
            if (this.element.lastChild == this._next)
                this.element.removeChild(this._next);
            this.element.removeClass("toolkit-over");
        }
        this._scroll_to(this.options.show);
    },
    
    _scroll_to: function (id) {
        /* move the container so that the requested button is shown */
        /* hand over a button instance or a number */
        if (typeof id == "object")
            id = this.buttons.indexOf(id);
        if (id < 0 || id >= this.buttons.length)
            return;
        var dir      = this.options.direction == _TOOLKIT_VERTICAL;
        var subd     = dir ? 'top' : 'left';
        var subm1    = dir ? 'marginTop' : 'marginLeft';
        var subm2    = dir ? 'marginBottom' : 'marginRight';
        var subs     = dir ? 'height' : 'width';
        var btn      = this._container.childNodes[id];
        var btnstyle = btn.currentStyle || window.getComputedStyle(btn);
        var btnmarg  = parseInt(btnstyle[subm1]) + parseInt(btnstyle[subm2]);
        var btnrect  = btn.getBoundingClientRect();
        var conrect  = this._container.getBoundingClientRect();
        var btnsize  = btnrect[subs] + btnmarg;
        var btnpos   = btnrect[subd] - conrect[subd];
        var listsize = this._list_size();
        var clipsize = this._clip.getBoundingClientRect()[subs];
        this._container.style[subd] = -(Math.max(0, Math.min(listsize - clipsize, btnpos - (clipsize / 2 - btnsize / 2))));
        this.options.show = id;
        this.fire_event("scroll", [id, this]);
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
        this._scroll_to(this.options.show - 1);
    },
    
    _next_clicked: function (e) {
        this._scroll_to(this.options.show + 1);
    },
    
    _button_clicked: function (button) {
        this._scroll_to(button);
    },
    
    set: function (key, value, hold) {
        this.options[key] = value;
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
                // dirty string operations!
                // HTML5 classList API not supported by IE9
                var c = String(this.element.className);
                c.replace(" toolkit-vertical", "");
                c.replace(" toolkit-horizontal", "");
                c += " toolkit-" + (value == _TOOLKIT_VERT ? "vertical" : "horizontal")
                this.element.className = c;
                break;
            case "auto_arrows":
                this._check_arrows(true);
                break;
            case "show":
                this._scroll_to(value);
        }
        Container.prototype.set.call(this, key, value, hold);
    }
});
