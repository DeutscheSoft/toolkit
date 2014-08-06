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
    },
    
    initialize: function (options) {
        this.pages = [];
        Container.prototype.initialize.call(this, options);
        this.element.className += " toolkit-pager";
        this.buttonarray = new ButtonArray({
            container: this.element
        });
        
    },
    
    
    add_page: function (label, content, pos) {
        this.buttonarray.add_button(label, pos);
        
    },
    
    remove_page: function (page) {
        
    },
    //redraw: function (hold) {
        //Container.prototype.redraw.call(this, hold);
    //},
    
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
                switch (value) {
                    case _TOOLTIP_TOP:
                        c += " toolkit-top";
                        break;
                    case _TOOLTIP_BOTTOM:
                        c += " toolkit-bottom";
                        break;
                    case _TOOLTIP_LEFT:
                        c += " toolkit-left";
                        break;
                    case _TOOLTIP_RIGHT:
                        c += " toolkit-right";
                        break;
                }
                this.element.className = c;
                break;
        }
    }
});
