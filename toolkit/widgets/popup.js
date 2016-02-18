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
function clicked(e) {
    e.stopPropagation();
    e.preventDefault();
    toggle.call(this);
    return false;
}
function toggle_fullscreen() {
    set_fullscreen.call(this, !this.has_class("toolkit-fullscreen"));
}
function set_fullscreen(state, e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    this[(state ? "add" : "remove") + "_class"]("toolkit-fullscreen");
    this.resize();
}
w.TK.Popup = w.Popup = $class({
    /**
     * TK.Popup is a container able to expand to a fixed fullscreen view.
     * In fullscreen mode the container has the class "toolkit-fullscreen".
     *
     * @param {Object} options
     * @property {boolean} [options.fullscreen=false] - The fullscreen state of the popup
     * 
     * @class TK.Popup
     * @extends TK.Container
     */
    _class: "Popup",
    Extends: TK.Container,
    initialize: function (options) {
        var self = this;
        TK.Container.prototype.initialize.call(this, options);
        this.add_event("click", function (e) { set_fullscreen.call(self, true, e); });
        TK.add_class(this.element, "toolkit-popup");
        this.close = new TK.Button({
            onclick: function (e) { set_fullscreen.call(self, false, e); },
            container: this.element,
        });
    },
    hide: function () {
        TK.Container.prototype.hide.call(this);
        set_fullscreen.call(this, false);
    },
});
})(this);
