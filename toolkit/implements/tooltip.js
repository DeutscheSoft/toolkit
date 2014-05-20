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
    _tooltip: false,
    tooltip: function (cont, tt) {
        if (!this._tooltip) {
            // build tooltip container
            this._tooltip = new Element("ul.toolkit-tooltip");
            this.__tt_pos_cb = this._pos_tooltip.bind(this);
            document.addEvent("mousemove", this.__tt_pos_cb);
            document.addEvent("touchmove", this.__tt_pos_cb);
            this._tooltip.inject($$("body")[0]);
            this.__tt_injected = true;
            this.__tt_count = 0;
            this.fireEvent("tooltipshow", [this]);
        }
        if(!cont && tt) {
            // destroy a tooltip
            this.fireEvent("tooltipremoved", [tt, this]);
            tt.destroy();
            tt = false;
            this.__tt_count --;
            if (this.__tt_count <= 0) {
                document.removeEvent("mousemove", this.__tt_pos_cb);
                document.removeEvent("touchmove", this.__tt_pos_cb);
                this._tooltip.destroy();
                this._tooltip = false;
                this.__tt_injected = false;
                this.fireEvent("tooltiphide", [tt, this]);
            }
            return;
        } else if (!tt) {
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
        
        this.__tt_count = Math.max(0, this.__tt_count);
        this.fireEvent("tooltipset", [tt, this]);
        return tt;
    },
    _pos_tooltip: function (e) {
        if (!this.__tt_injected)
            return;
        e = this._get_event(e);
        this._tooltip.setStyles({
            top: e.clientY,
            left: e.clientX
        });
        keep_inside(this._tooltip);
    },
    _get_event: function (event) {
        // return the right event if touch surface is used
        // with multiple fingers
        return (event.touches && event.touches.length)
              ? event.touches[0] : event.event;
    }
});
