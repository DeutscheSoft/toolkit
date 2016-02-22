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
function visible_when_expanded(widget) {
    var v = widget.options._expanded;
    return v !== false;
}
function visible_when_collapsed(widget) {
    var v = widget.options._collapsed;
    return v === true;
}
function is_visible(widget) {
    var value = this.options.always_expanded || this.options.expanded;

    if (value) {
        return visible_when_expanded(widget);
    } else {
        return visible_when_collapsed(widget);
    }
}
function update_visibility() {
    var C = this.children;
    var value = this.options.always_expanded || this.options.expanded;

    if (value) {
        for (var i = 0; i < C.length; i++) {
            if (visible_when_expanded(C[i]))
                this.show_child(i);
            else
                this.hide_child(i);
        }
        this.fire_event("expand");
    } else {
        for (var i = 0; i < C.length; i++) {
            if (visible_when_collapsed(C[i]))
                this.show_child(i);
            else
                this.hide_child(i);
        }
        this.fire_event("collapse");
    }
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
        always_expanded: "boolean",
    }),
    options: {
        expanded: false,
        always_expanded: false,
    },
    Extends: TK.Container,
    toggle: function() {
        toggle.call(this);
    },
    redraw: function() {
        var I = this.invalid;
        var O = this.options;

        TK.Container.prototype.redraw.call(this);

        if (I.expanded || I.always_expanded) {
            I.always_expanded = I.expanded = false; 
            var v = O.always_expanded || O.expanded;
            this[v ? "add_class" : "remove_class"]("toolkit-expanded");
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
        this._update_visibility = update_visibility.bind(this);
        this.add_event("hide", collapse.bind(this, false));
        this.add_event("set_expanded", update_visibility);
        this.add_event("set_always_expanded", update_visibility);
        this.set("expanded", this.options.expanded);
        this.set("always_expanded", this.options.always_expanded);
    },
    add_child: function(child) {
        TK.Container.prototype.add_child.call(this, child);
        if (!is_visible.call(this, child)) this.hide_child(child);
        child.add_event("set__expanded", this._update_visibility);
        child.add_event("set__collapsed", this._update_visibility);
    },
    remove_child: function(child) {
        child.remove_event("set__expanded", this._update_visibility);
        child.remove_event("set__collapsed", this._update_visibility);
    },
});
})(this);
