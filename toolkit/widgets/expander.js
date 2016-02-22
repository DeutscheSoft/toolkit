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
function toggle(e) {
    return collapse.call(this, !this.options.expanded, e);
}
function collapse(state, e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    this.set("expanded", state);
    return false;
}
w.TK.Expander = w.Expander = $class({
    /**
     * TK.Expander is a container able to expand to a fixed fullscreen view.
     * In fullscreen mode the container has the class "toolkit-fullscreen".
     *
     * @param {Object} options
     * @property {boolean} [options.expanded=false] - The fullscreen state of the popup
     * 
     * @class TK.Expander
     * @extends TK.Container
     */
    _class: "Expander",
    _options: Object.assign(Object.create(TK.Container.prototype._options), {
        expanded: "boolean",
    }),
    options: {
        expanded: false,
    },
    Extends: TK.Container,
    toggle: function() {
        toggle.call(this);
    },
    redraw: function() {
        var I = this.invalid;
        var O = this.options;

        TK.Container.prototype.redraw.call(this);

        if (I.expanded) {
            I.expanded = false; 
            this[O.expanded ? "add_class" : "remove_class"]("toolkit-expanded");
            TK.S.after_frame(this.resize.bind(this));
        }
    },
    initialize: function (options) {
        TK.Container.prototype.initialize.call(this, options);
        TK.add_class(this.element, "toolkit-expander");
        this.button = new TK.Button({
            onclick: toggle.bind(this),
            container: this.element,
            "class": "toolkit-toggle-expand"
        });
        this.add_event("hide", collapse.bind(this, false));
        this.set("expanded", this.options.expanded);
    },
    set: function(key, value) {
        var O = this.options;
        if (key === "expanded" && value !== O.expanded) {
            var C = this.children;
            if (value) {
                for (var i = 0; i < C.length; i++) {
                    this.show_child(i);
                }
                this.fire_event("expand");
            } else {
                for (var i = 0; i < C.length; i++) {
                    if (!C[i].options._fixed) {
                        this.hide_child(i);
                    }
                }
                this.fire_event("collapse");
            }
        }

        TK.Container.prototype.set.call(this, key, value);
    }
});
})(this);
