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
        position:  _TOOLKIT_TOP,      // the default position of the ButtonArray
        direction: _TOOLKIT_VERTICAL, // the direction of the pages
        pages:     [],                // an array of mappings (objects) containing
                                      // the members "label" and "content". label
                                      // is a string for the buttons label or an
                                      // object containing options for a button
                                      // and content is a string containing HTML
                                      // or a ready-to-use DOM node, e.g.
                                      // [{label: "Empty Page 1", content: document.createElement("span")},
                                      //  {label: {label:"Foobar", class:"foobar"}, content: "<h1>Foobar</h1><p>Lorem ipsum dolor sit amet</p>"}]
        show:      -1,                // the page to show
        overlap:   false              // if true pages aren't resized so
                                      // the buttonarray overlaps the contents
    },
    
    initialize: function (options) {
        this.pages = [];
        Container.prototype.initialize.call(this, options);
        this.element.className += " toolkit-pager";
        this.buttonarray = new ButtonArray({
            container: this.element,
            onChanged: (function (but, id) { this._scroll_to(id); }).bind(this)
        });
        this._clip      = toolkit.element("div", "toolkit-clip");
        this._container = toolkit.element("div", "toolkit-container");
        this.element.appendChild(this._clip);
        this._clip.appendChild(this._container);
        this._pagestyle = toolkit.element("style");
        this._pagestyle.setAttribute("type", "text/css");
        this.element.appendChild(this._pagestyle);
        this.set("direction", this.options.direction);
        this.set("position", this.options.position);
        this.add_pages(this.options.pages);
        this.set("show", this.options.show);
        this._scroll_to(this.options.show, true);
    },
    
    redraw: function () {
        if (this.options.overlap) {
            this._clip.style.width = "";
            this._clip.style.height = "";
        } else {
            switch (this.options.position) {
                case _TOOLKIT_TOP:
                case _TOOLKIT_BOTTOM:
                    toolkit.outer_height(this._clip, true,
                        toolkit.inner_height(this.element)
                      - toolkit.outer_height(this.buttonarray.element, true));
                    break;
                case _TOOLKIT_LEFT:
                case _TOOLKIT_RIGHT:
                    toolkit.outer_width(this._clip, true,
                        toolkit.inner_width(this.element)
                      - toolkit.outer_width(this.buttonarray.element, true));
                    break;
            }
        }
        this.__page_width = toolkit.inner_width(this._clip);
        this.__page_height = toolkit.inner_height(this._clip);
        var style;
        switch (this.options.direction) {
            case _TOOLKIT_VERT:
                style = "#" + this.options.id + " > .toolkit-clip > .toolkit-container > .toolkit-page {\n";
                style += "    height: " + this.__page_height + "px;\n}";
                break;
            case _TOOLKIT_HORIZ:
                style = "#" + this.options.id + " > .toolkit-clip > .toolkit-container > .toolkit-page {\n";
                style += "    width: " + this.__page_width + "px;\n}";
                break;
        }
        toolkit.set_text(this._pagestyle, style);
    },
    
    add_pages: function (options) {
        for (var i = 0; i < options.length; i++)
            this.add_page(options[i].label, options[i].content);
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
            this._container.appendChild(p.element);
        } else {
            this.pages.splice(pos, 0, p);
            this._container.insertBefore(p.element,
                this._container.childNodes[pos]);
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
    
    resized: function (hold) {
        if (!hold)
            this.redraw();
    },
    
    _scroll_to: function (id, force) {
        /* move the container so that the requested page is shown */
        /* hand over a page instance or a number */
        if (typeof id == "object")
            id = this.pages.indexOf(id);
        if (id < 0 || id >= this.pages.length || (id == this.options.show && !force))
            return;
        if (this.options.show >= 0 && this.options.show < this.pages.length)
            this.pages[this.options.show].element.classList.remove("toolkit-active");
        this.pages[this.options.show].element.classList.add("toolkit-active");
        var dir      = this.options.direction == _TOOLKIT_VERTICAL;
        var subd     = dir ? 'top' : 'left';
        var subs     = dir ? 'height' : 'width';
        var size     = dir ? this.__page_height : this.__page_width;
        this._container.style[subd] = (-size * id) + "px";
        if (this.options.show != id) {
            this.fire_event("changed", [this.pages[id], id, this]);
        }
        this.options.show = id;
    },
    
    _list_size: function () {
        var dir       = this.options.direction == _TOOLKIT_VERTICAL;
        var subd      = dir ? 'top' : 'left';
        var subs      = dir ? 'height' : 'width';
        var subm2     = dir ? 'marginBottom' : 'marginRight';
        var item      = this._container.lastChild;
        var itemstyle = item.currentStyle || window.getComputedStyle(item);
        var lastrect  = this._container.lastChild.getBoundingClientRect();
        var conrect   = this._container.getBoundingClientRect();
        return lastrect[subd] - conrect[subd] + lastrect[subs] + parseInt(itemstyle[subm2]);
    },
    
    set: function (key, value, hold) {
        switch(key) {
            case "pages":
                if (hold)
                    break;
                for (var i = 0; i < this.pages.length; i++)
                    this.pages[i].destroy();
                this.pages = [];
                this.add_pages(value);
                break;
            case "position":
                // dirty string operations!
                // HTML5 classList API not supported by IE9
                this.element.classList.remove("toolkit-top");
                this.element.classList.remove("toolkit-right");
                this.element.classList.remove("toolkit-bottom");
                this.element.classList.remove("toolkit-left");
                var badir;
                switch (value) {
                    case _TOOLKIT_TOP:
                        this.element.classList.add("toolkit-top");
                        badir = _TOOLKIT_HORIZ;
                        break;
                    case _TOOLTIP_BOTTOM:
                        this.element.classList.add("toolkit-bottom");
                        badir = _TOOLKIT_HORIZ;
                        break;
                    case _TOOLTIP_LEFT:
                        this.element.classList.add("toolkit-left");
                        badir = _TOOLKIT_VERT;
                        break;
                    case _TOOLTIP_RIGHT:
                        this.element.classList.add("toolkit-right");
                        badir = _TOOLKIT_VERT;
                        break;
                }
                this.buttonarray.set("direction", badir);
                if (!hold)
                    this.redraw();
                break;
            case "direction":
                // dirty string operations!
                // HTML5 classList API not supported by IE9
                this.element.classList.remove("toolkit-vertical");
                this.element.classList.remove("toolkit-horizontal");
                this.element.classList.add("toolkit-" + (value == _TOOLKIT_VERT ? "vertical" : "horizontal"));
                break;
            case "show":
                this.buttonarray._scroll_to(value);
        }
        Container.prototype.set.call(this, key, value, hold);
    },
    get: function (key) {
        switch (key) {
            case "pages":
                return this.pages;
        }
        Container.prototype.get.call(this, key);
    }
});
