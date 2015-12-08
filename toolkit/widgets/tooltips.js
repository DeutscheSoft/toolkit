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
function get_event(event) {
    // return the right event if touch surface is used
    // with multiple fingers
    return (event.touches && event.touches.length)
          ? event.touches[0] : event;
}
w.GlobalTooltip = function() {
    var overlay = TK.element("div", "toolkit-tooltip");
    var table   = TK.element("div", "toolkit-table");
    var row     = TK.element("div", "toolkit-row");
    var cell    = TK.element("div", "toolkit-cell");

    var tmp = row.cloneNode();

    var spacer_tl = cell.cloneNode();

    tmp.appendChild(spacer_tl);
    tmp.appendChild(cell.cloneNode());
    tmp.appendChild(cell.cloneNode());

    table.appendChild(tmp);

    tmp = row.cloneNode();

    var entry = cell.cloneNode();
    entry.className = "toolkit-entry";

    var entry_tl = cell.cloneNode();
    entry_tl.className = "toolkit-tt-container";
    entry_tl.appendChild(entry);

    tmp.appendChild(cell.cloneNode());
    tmp.appendChild(entry_tl);
    tmp.appendChild(cell.cloneNode());

    table.appendChild(tmp);

    tmp = row.cloneNode();

    tmp.appendChild(cell.cloneNode());
    tmp.appendChild(cell.cloneNode());
    tmp.appendChild(cell.cloneNode());

    table.appendChild(tmp);
    overlay.appendChild(table);

    var tooltips = [];

    function current_callback() {
        for (var i = 0; i < tooltips.length; i++) {
            if (tooltips[i] && tooltips[i].length) {
                return tooltips[i][0];
            }
        }
    }

    function onmove_touch(e) {
        onmove_mouse(get_event(e));
    }

    function onmove_mouse(e) {
        var current = current_callback();
        var w = e.clientX;
        var h = e.clientY / window.innerHeight;

        if (!current) {
            hide();
            return;
        }

        spacer_tl.style["width"] = w > 0 ? w + "px" : "0.01%";
        spacer_tl.style["height"] = h > 0 ? (h * 100).toFixed(2) + "%" : "0.01%";

        current(e, entry);
    }

    var hidden = false;
    var num_tooltips = 0;

    function hide() {
        document.removeEventListener("mousemove", onmove_mouse);
        document.removeEventListener("touchmove", onmove_touch);
        overlay.style.display = "none";
        hidden = true;
    }

    function show() {
        if (!overlay.parentNode)
            document.body.appendChild(overlay);
        document.addEventListener("mousemove", onmove_mouse);
        document.addEventListener("touchmove", onmove_touch);
        overlay.style.removeProperty("display");
        hidden = false;
    }

    function add(priority, onmove) {
        if (!tooltips[priority]) tooltips[priority] = [];
        tooltips[priority].push(onmove);
        if (hidden) show();
        num_tooltips++;
    }

    function remove(priority, onmove) {
        if (!tooltips[priority]) return;
        var i = tooltips[priority].indexOf(onmove);

        if (i === -1) return;
        if (tooltips[priority].length == 1) tooltips[priority] = null;
        else tooltips[priority].splice(i, 1);
        if (--num_tooltips === 0) hide();
    }

    hide();

    this.show = show;
    this.hide = hide;
    this.add = add;
    this.remove = remove;
    this.trigger = onmove_touch;
    this._overlay = overlay;
    this._table = table;
    this._entry = entry;
};
w.GlobalTooltip.prototype = {
    destroy: function() {
        this.hide();
        this._overlay.remove();
    },
};
w.TK.tooltip = new GlobalTooltip();
})(this);
