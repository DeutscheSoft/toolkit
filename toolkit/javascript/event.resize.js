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
 

document._resizes = [];
document._monitoring_resizes = -1;
document._monitor_resizes = function () {
    for (var i = 0; i < document._resizes.length; i++) {
        var r = document._resizes[i];
        if (r.element.offsetWidth != r.x || r.element.offsetHeight != r.y) {
            r.x = r.element.offsetWidth;
            r.y = r.element.offsetHeight;
            r.element.dispatchEvent("resize");
        }
    }
    if (document._resizes.length) {
        document._monitoring_resizes = window.setTimeout("document._monitor_resizes()", 100);
    }
}
document._add_resize = function (element) {
    document._resizes.push({element: element, x: element.offsetWidth, y: element.offsetHeight});
    if (document._monitoring_resizes < 0) {
        document._monitoring_resizes = window.setTimeout("document._monitor_resizes()", 100);
    }
}
document._remove_resize = function (element) {
    for (var i = 0; i < document._resizes; i++) {
        if (element == document._resizes[i]) document._resizes.splice(i, 1);
        if (!document._resizes.length && document._monitoring_resizes < 0) {
            window.clearTimeout(document._monitoring_resizes);
            document._monitoring_resizes = -1;
        }
    }
}

Class.refactor(Element, {
    addEvent: function (event, func) {
        if (event == "resize" && this.get("tag") !== "window")
            document._add_resize(this)
        this.previous(event, func);
    },
    removeEvent: function (event, func) {
        if (event == "resize" && this.get("tag") !== "window")
            document._remove_resize(this)
        this.previous(event, func);
    }
});
