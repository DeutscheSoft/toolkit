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
            onClicked: (function (id, but) {
                this._scroll_to(id);
                this.fire_event("clicked", [ id, this ]);
            }).bind(this)
        });
        this.register_children(this.buttonarray);
        this._clip      = toolkit.element("div", "toolkit-clip");
        this._container = toolkit.element("div", "toolkit-container");
        this._clip.appendChild(this._container);
        this._pagestyle = toolkit.element("style");
        this._pagestyle.setAttribute("type", "text/css");
        this.element.appendChild(this._pagestyle);
        this.set("direction", this.options.direction, true);
        this.set("position", this.options.position, true);
        this.add_pages(this.options.pages);
        this.element.appendChild(this._clip);
        this.redraw();
        this.set("show", this.options.show);
        this._scroll_to(this.options.show, true);
        this.initialized();
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
    
    add_page: function (button, content, pos, options) {
        var p;
        if (typeof button === "string")
            button = {label: button};
        this.buttonarray.add_button(button, pos);
        if (!options) {
            options = {};
        }
        options["class"] = "toolkit-page";

        if (typeof content === "string") {
            options.content = content;
            p = new Container(options);
        } else {
            // assume here content is a subclass of Container
            p = new content(options);
        }

        this.register_children(p);

        var len = this.options.pages.length;

        if (pos == len || typeof pos == "undefined") {
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

    fire_event : function(type, a) {
        if (type == "show" || type == "hide") {
            // hide and show are only for the active page and the button array
            // and this widget itself
            this.buttonarray.fire_event(type);
            if (this.pages.length && this.options.show >= 0)
                this.pages[this.options.show].fire_event(type);
            BASE.prototype.fire_event.call(this, type, a);
        } else Container.prototype.fire_event.call(this, type, a);
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
        this.remove_children(this.pages[page]);
        this.pages[this.options.show].element.className.replace(" toolkit-active", "");
        this.pages[this.options.show].element.className.replace("  ", " ");
        console.log(this.options.show)
        if (page < this.options.show)
            this.options.show--;
        console.log(this.options.show)
        this._scroll_to(this.options.show);
    },
    
    resized: function () {
        this.redraw();
        this._scroll_to(this.options.show, true); 
    },
    
    _scroll_to: function (id, force) {
        var cid = this.options.show;
        /* move the container so that the requested page is shown */
        /* hand over a page instance or a number */
        if (typeof id == "object")
            id = this.pages.indexOf(id);
        
        if (id < 0 || id >= this.pages.length || (id == cid && !force))
            return;
        if (cid >= 0 && cid < this.pages.length)
            this.pages[cid].element.classList.remove("toolkit-active");
        this.pages[id].element.classList.add("toolkit-active");
        var dir  = this.options.direction == _TOOLKIT_VERTICAL;
        var size = dir ? this.__page_height : this.__page_width;
        this._container.style[dir ? 'top' : 'left'] = (-size * id) + "px";
        this._container.style[dir ? 'left' : 'top'] = "";
        if (cid != id) {
            this.fire_event("changed", [this.pages[id], id, this]);
            this.pages[id].fire_event("show");
            if (cid >= 0 && cid < this.pages.length)
                this.pages[cid].fire_event("hide");
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
                this.options.position = value;
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
                    case _TOOLKIT_BOTTOM:
                        this.element.classList.add("toolkit-bottom");
                        badir = _TOOLKIT_HORIZ;
                        break;
                    case _TOOLKIT_LEFT:
                        this.element.classList.add("toolkit-left");
                        badir = _TOOLKIT_VERT;
                        break;
                    case _TOOLKIT_RIGHT:
                        this.element.classList.add("toolkit-right");
                        badir = _TOOLKIT_VERT;
                        break;
                }
                this.buttonarray.set("direction", badir);
                if (!hold)
                    this.redraw();
                break;
            case "direction":
                this.element.classList.remove("toolkit-vertical");
                this.element.classList.remove("toolkit-horizontal");
                this.element.classList.add("toolkit-" + (value == _TOOLKIT_VERT ? "vertical" : "horizontal"));
                this.options.direction = value;
                if (!hold) {
                    this.redraw();
                    this._scroll_to(this.options.show, true);
                }
                break;
            case "show":
                this.buttonarray._scroll_to(value);
                this._scroll_to(value);
        }
        Container.prototype.set.call(this, key, value, hold);
    },
    get: function (key) {
        switch (key) {
            case "pages":
                return this.pages;
        }
        return Container.prototype.get.call(this, key);
    }
});
