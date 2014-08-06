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

Pager = $class({
    /* Pager, also known as Notebook in other UI toolkits, provides
       multiple containers for displaying contents which are switchable
       via a ButtonArray. */
    _class: "Pager",
    Extends: Container,
    options: {
        position: _TOOLKIT_TOP, // the default position of the ButtonArray
        pages:    [],           // an array of mappings (objects) containing
                                // the members "label" and "content". label
                                // is a string for the buttons label or an
                                // object containing options for a button
                                // and content is a string containing HTML
                                // or a ready-to-use DOM node, e.g.
                                // [{label: "Empty Page 1", content: document.createElement("span")},
                                //  {label: {label:"Foobar", class:"foobar"}, content: "<h1>Foobar</h1><p>Lorem ipsum dolor sit amet</p>"}]
        show:     -1             // the page to show
    },
    
    initialize: function (options) {
        this.pages = [];
        Container.prototype.initialize.call(this, options);
        this.element.className += " toolkit-pager";
        this.buttonarray = new ButtonArray({
            container: this.element
        });
        this.set("position", this.options.direction);
        this.add_pages(this.options.pages);
        this._scroll_to(this.options.show, true);
    },
    
    add_pages: function (options) {
        for (var i = 0; i < options.length; i++)
            this.add_page(options[i]);
    },
    
    add_page: function (button, content, pos) {
        if (typeof button === "string")
            button = {label: button};
        this.buttonarray.add_button(button, pos);
        var p    = new Container({content: content, class: "toolkit-page"});
        var len  = this.options.pages.length;
        if (typeof pos == "undefined")
            pos = this.pages.length;
        if (pos == len) {
            this.pages.push(p);
            this.element.appendChild(p.element);
        } else {
            this.pages.splice(pos, 0, p);
            this.element.insertBefore(p.element,
                this.element.childNodes[pos]);
        }
        this._scroll_to(this.options.show);
        this.fire_event("added", [p, this]);
        return p;
        //var sb = b.element.getBoundingClientRect()[vert ? "height" : "width"];
    },
    
    remove_page: function (page) {
        if (typeof page == "object")
            page = this.pages.indexOf(page);
        if (page < 0 || page >= this.pages.length)
            return;
        this.fire_event("removed", [this.pages[page], this]);
        this.buttonarray.remove_button(page);
        this.pages[page].destroy();
        this.pages.splice(page, 1);
        this.pages[this.options.show].element.className.replace(" toolkit-active", "");
        this.pages[this.options.show].element.className.replace("  ", " ");
        if (page < this.options.show)
            this.options.show--;
        this._scroll_to(this.options.show);
    },
    
    _scroll_to: function (id, force) {
        console.log(id)
        /* move the container so that the requested page is shown */
        /* hand over a page instance or a number */
        if (typeof id == "object")
            id = this.pages.indexOf(id);
        if (id < 0 || id >= this.pages.length || (id == this.options.show && !force))
            return;
        console.log("ruN")
        this.buttonarray._scroll_to(id);
        if (this.options.show >= 0 && this.options.show < this.pages.length) {
            this.pages[this.options.show].element.className.replace(" toolkit-active", "");
            this.pages[this.options.show].element.className.replace("  ", " ");
        }
        //var dir      = this.options.direction == _TOOLKIT_VERTICAL;
        //var subd     = dir ? 'top' : 'left';
        //var subm1    = dir ? 'marginTop' : 'marginLeft';
        //var subm2    = dir ? 'marginBottom' : 'marginRight';
        //var subs     = dir ? 'height' : 'width';
        //var btn      = this._container.childNodes[id];
        //var btnstyle = btn.currentStyle || window.getComputedStyle(btn);
        //var btnmarg  = parseInt(btnstyle[subm1]) + parseInt(btnstyle[subm2]);
        //var btnrect  = btn.getBoundingClientRect();
        //var conrect  = this._container.getBoundingClientRect();
        //var btnsize  = btnrect[subs] + btnmarg;
        //var btnpos   = btnrect[subd] - conrect[subd];
        //var listsize = this._list_size();
        //var clipsize = this._clip.getBoundingClientRect()[subs];
        //this._container.style[subd] = -(Math.max(0, Math.min(listsize - clipsize, btnpos - (clipsize / 2 - btnsize / 2))));
        //var tmp = this.options.show;
        //this.options.show = id;
        //this.buttons[id].set("state", true);
        //if (tmp != id) {
            //this.fire_event("changed", [this.buttons[id], id, this]);
        //}
    },
    
    set: function (key, value, hold) {
        Container.prototype.set.call(this, key, value, hold);
        switch(key) {
            case "pages":
                if (hold)
                    break;
                for (var i = 0; i < this.pages.length; i++)
                    this.pages[i].destroy();
                this.pages = [];
                this.add_pages(value);
                break;
            case "direction":
                // dirty string operations!
                // HTML5 classList API not supported by IE9
                var c = String(this.element.className);
                c.replace(" toolkit-top", "");
                c.replace(" toolkit-bottom", "");
                c.replace(" toolkit-left", "");
                c.replace(" toolkit-right", "");
                var badir;
                switch (value) {
                    case _TOOLTIP_TOP:
                        c += " toolkit-top";
                        badir = _TOOLKIT_HORIZ;
                        break;
                    case _TOOLTIP_BOTTOM:
                        c += " toolkit-bottom";
                        badir = _TOOLKIT_HORIZ;
                        break;
                    case _TOOLTIP_LEFT:
                        c += " toolkit-left";
                        badir = _TOOLKIT_VERT;
                        break;
                    case _TOOLTIP_RIGHT:
                        c += " toolkit-right";
                        badir = _TOOLKIT_VERT;
                        break;
                }
                this.element.className = c;
                this.buttonarray.set("direction", badir);
                break;
        }
    },
    get: function (key) {
        switch (key) {
            case "pages":
                return this.pages;
        }
        Container.prototype.get.call(this, key);
    }
});
