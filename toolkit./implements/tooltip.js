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

Tooltip = new Class({
    // Tooltip adds a tooltip list to a widget. Tooltip lists follow the
    // mouse pointer throughout the document and auto-show and auto-hide
    // automatically.
    _class: "Tooltip",
    Implements: Events,
    tooltip: function (cont, tt) {
        if (!this._tooltip) {
            // build tooltip container
            this._tooltip = new Element("ul.toolkit-tooltip");
            this._tooltip.inject($$("body")[0]);
            $$("body")[0].addEvent("mousemove",
                                   this._pos_tooltip.bind(this));
            this.__tt_count = 0;
        }
        
        if(!cont && tt) {
            // destroy a tooltip
            this.fireEvent("tooltipremoved", [tt, this]);
            tt.destroy();
            this.__tt_count --;
            if (this.__tt_count <= 0) {
                this._tooltip.setStyle("display", "none");
                this.fireEvent("tooltiphide", [tt, this]);
            }
            return;
        }
        
        if (!tt) {
            // add a tooltip
            var tt = new Element("li");
            this.fireEvent("tooltipadded", [tt, cont, this]);
            this.__tt_count ++;
        }
        
        // fill tooltip
        if(typeof cont == "string")
            tt.set("html", cont);
        else if(typeof cont == "object")
            cont.inject(tt);
            
        tt.inject(this._tooltip);
        
        if (this.__tt_count <= 0) {
            // hide tooltip container
            this._tooltip.setStyle("display", "block");
            this.fireEvent("tooltipshow", [this]);
        }
        this.__tt_count = Math.max(0, this.__tt_count);
        this.fireEvent("tooltipset", [tt, this]);
        return tt;
    },
    _pos_tooltip: function (e) {
        if(typeof e.event.pageY != "undefined"
               && e.event.pageX != "undefined"
               && e.event.pageY) {
            this._tooltip.setStyles({
                top: e.event.pageY,
                left: e.event.pageX
            });
        } else {
            this._tooltip.setStyles({
                top: e.event.clientY,
                left: e.event.clientX
            });
        }
    },
});
