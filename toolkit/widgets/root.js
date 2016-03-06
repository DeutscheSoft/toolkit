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
function visibility_change() {
    if (document.hidden) {
        this.disable_draw();
    } else {
        this.enable_draw();
    }
}
function resized() {
    if (!this.resize_event) {
        this.resize_event = true;
        TK.S.add(function() {
            this.resize_event = false;
            this.trigger_resize();
        }.bind(this));
    }
}
function loaded() {
    this.remove_class("toolkit-loading");
}
/**
 * @extends TK.Container
 * @class TK.Root
 */
w.TK.Root = w.Root = $class({
    Extends: TK.Container,
    _class: "Root",
    _options: Object.create(TK.Container.prototype._options),
    initialize: function (options) {
        TK.Container.prototype.initialize.call(this, options);
        TK.add_class(this.element, "toolkit-root", "toolkit-loading");
        this._resize_cb = resized.bind(this);
        this._visibility_cb = visibility_change.bind(this);
        this.resize_event = false;
        w.addEventListener("resize", this._resize_cb);
        document.addEventListener("visibilitychange", this._visibility_cb, false);
        document.addEventListener("DOMContentLoaded", loaded.bind(this));
    },
    initialized: function () {
        TK.Container.prototype.initialized.call(this);
        /* NOTE: the initial draw will add all elements to the dom and set them up.
         * after that is done, we trigger one initial resize event, to make sure that
         * they are resized properly, if needed. */
        this.enable_draw();
        this.trigger_initial_resize();
    },
    resize: function() {
        if (!this.children) {
            TK.warn("Root element destructed before resize.\n");
            return;
        }
        this.resize_event = false;
        TK.Container.prototype.resize.call(this);
    },
    destroy: function () {
        TK.Container.prototype.destroy.call(this);
        w.removeEventListener("resize", this._resize_cb);
        document.removeEventListener("visibilitychange", this._visibility_cb)
        this._resize_cb = this._visibility_cb = null;
    },
});
})(this);
