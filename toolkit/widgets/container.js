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
function hide_children() {
    var C = this.children;
    var H = this.hidden_children;
    for (var i = 0; i < C.length; i++) {
        if (!H[i]) C[i].force_hide();
    }
}
function show_children() {
    var C = this.children;
    var H = this.hidden_children;
    for (var i = 0; i < C.length; i++) {
        if (!H[i]) C[i].force_show();
    }
}
function after_hiding() {
    this.__hide_id = false;
    if (this.options.display_state == "hiding")
        this.set("display_state", "hide");
}
function after_showing() {
    this.__hide_id = false;
    if (this.options.display_state == "showing")
        this.set("display_state", "show");
}
w.TK.Container = w.Container = $class({
    /* @class: Container
     * @description: Container represents a <DIV> element.
     * @extends: Widget
     * @option: content; String|Element; undefined; The content of the container. It can either be
     * a string which is interpreted as Text or a DOM node. Note that this options will remove all
     * child nodes from the container element including those added via append_child.
     */
    _class: "Container",
    Extends: Widget,
    _options: Object.assign(Object.create(Widget.prototype._options), {
        content: "string",
        display_state: "string",
    }),
    options: {
        display_state : "hide",
    },
    initialize: function (options) {
        var E;
        Widget.prototype.initialize.call(this, options);
        this.hidden_children = [];
        if (!(E = this.element)) this.element = E = TK.element("div");
        TK.add_class(E, "toolkit-container"); 
        this.widgetize(E, true, true, true);

        if (this.options.container)
            this.set("container", this.options.container);
        this.__after_hiding = after_hiding.bind(this);
        this.__after_showing = after_showing.bind(this);
        this.__hide_id = false;
        TK.add_class(E, "toolkit-hide");
    },
    
    destroy: function () {
        this.element.remove();
        Widget.prototype.destroy.call(this);
    },
    append_children : function (a) {
        a.map(this.append_child, this);
    },
    append_child : function(child) {
        child.set("container", this.element);
        this.add_child(child);
    },
    add_child : function(child) {
        var C = this.children;
        var H = this.hidden_children;
        Widget.prototype.add_child.call(this, child);
        H.push(false);
    },
    remove_child : function(child) {
        var C = this.children;
        var H = this.hidden_children;
        var i = C.indexOf(child);
        child.parent = null;
        if (i !== -1) {
            C.splice(i, 1);
            H.splice(i, 1);
        }
    },
    hide: function () {
        var O = this.options;
        if (O.display_state === "hide" || O.display_state === "hiding") return;
        this.set("display_state", "hiding");
    },
    force_hide: function() {
        var O = this.options;
        if (O.display_state === "hide") return;
        this.set("display_state", "hide");

        this._low_hide();
        hide_children.call(this);
    },
    force_show: function() {
        var O = this.options;
        if (O.display_state === "show") return;
        this.set("display_state", "show");

        this._low_show();
        show_children.call(this);
    },
    show: function() {
        var O = this.options;
        if (O.display_state === "show" || O.display_state === "showing") return;
        this.set("display_state", "showing");

        this._low_show();
        show_children.call(this);
    },

    hide_child: function(i) {
        var C = this.children;
        var H = this.hidden_children;

        if (typeof i !== "number") {
            i = C.indexOf(i);
            if (i === -1) throw("Cannot find child.");
        }

        H[i] = true;
        C[i].hide();
    },

    show_child: function(i) {
        var C = this.children;
        var H = this.hidden_children;

        if (typeof i !== "number") {
            i = C.indexOf(i);
            if (i === -1) throw("Cannot find child.");
        }

        if (H[i]) {
            H[i] = false;
            if (!this.hidden()) C[i].show();
        }
    },

    redraw: function() {
        var O = this.options;
        var I = this.invalid;
        var E = this.element;

        if (I.display_state) {
            var time;
            TK.remove_class(E, "toolkit-hiding");
            TK.remove_class(E, "toolkit-hide");
            TK.remove_class(E, "toolkit-showing");
            TK.remove_class(E, "toolkit-show");

            if (this.__hide_id) {
                w.clearTimeout(this.__hide_id);
                this.__hide_id = false;
            }

            switch (O.display_state) {
            case "hiding":
                TK.add_class(E, "toolkit-hiding");
                time = TK.get_duration(E);
                if (time > 0) {
                    this.__hide_id = w.setTimeout(this.__after_hiding, time);
                    break;
                }
                O.display_state = "hide";
                TK.remove_class(E, "toolkit-hiding");
                /* FALL THROUGH */
            case "hide":
                TK.add_class(E, "toolkit-hide");
                hide_children.call(this);
                this._low_hide();
                break;
            case "showing":
                TK.add_class(E, "toolkit-showing");
                time = TK.get_duration(E);
                if (time > 0) {
                    this.__hide_id = w.setTimeout(this.__after_showing, time);
                    break;
                }
                O.display_state = "show";
                TK.remove_class(E, "toolkit-showing");
                /* FALL THROUGH */
            case "show":
                TK.add_class(E, "toolkit-show");
                break;
            }
        }

        Widget.prototype.redraw.call(this);

        if (I.content) {
            I.content = false;
            TK.empty(E);

            if (O.content) TK.set_content(E, O.content);
        }
    },
});
})(this);
