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
 
Warning = new Class({
    // warning sets a timed class "toolkit-warn" on an element. It is
    // used e.g. in ResponseHandle or Knob when the value exceeds the
    // range.
    _class: "Warning",
    Implements: Events,
    warning: function (element, timeout) {
        if (!timeout) timeout = 250;
        if (this.__wto) window.clearTimeout(this.__wto);
        this.__wto = null;
        element.addClass("toolkit-warn");
        this.__wto = window.setTimeout(function () {
            element.removeClass("toolkit-warn");
        }.bind(this), timeout);
        this.fireEvent("warning", this);
    }
});
