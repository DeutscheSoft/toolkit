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
        if (!H[i]) C[i].hide();
    }
}
function show_children() {
    var C = this.children;
    var H = this.hidden_children;
    for (var i = 0; i < C.length; i++) {
        if (!H[i]) C[i].show();
    }
}
function after_hiding() {
    this.__hide_id = false;
    this.set("hidden_state", "hidden");
}
function after_showing() {
    this.__hide_id = false;
    this.set("hidden_state", "show");
}
w.Container = $class({
    /* @class: Container
     * @description: Container represents a <DIV> element.
     */
    _class: "Container",
    Extends: Widget,
    options: {
        /*content: ""*/
                    // the content of the container. It can either be
                    // a string which is interpreted as HTML or a
                    // ready-to-use DOM node.
    },
    initialize: function (options) {
        Widget.prototype.initialize.call(this, options);
        this.children = [];
        this.hidden_children = [];
        this.element = this.widgetize(TK.element("div", "toolkit-container"),
                                      true, true, true);
        if (this.options.container)
            this.set("container", this.options.container);
        this.__after_hiding = after_hiding.bind(this);
        this.__after_showing = after_showing.bind(this);
        this.__hide_id = false;
    },
    
    destroy: function () {
        this.element.remove();
        Widget.prototype.destroy.call(this);
    },
    add_children : function (a) {
        a.map(this.add_child, this);
    },
    add_child : function(child) {
        var C = this.children;
        var H = this.hidden_children;
        C.push(child);
        H.push(false);
        if (this.hidden()) {
            child.force_hidden();
        } else {
            child.show();
        }
        return C;
    },
    remove_child : function(child) {
        var C = this.children;
        var H = this.hidden_children;
        var i = C.indexOf(child);
        if (i !== -1) {
            C.splice(i, 1);
            H.splice(i, 1);
        }
    },
    remove_children : function(a) {
        for (var i = 0; i < a.length; i++)
            this.remove_child(a[i]);
    },
    hide: function () {
        var O = this.options;
        if (O.hidden_state === "hidden" || O.hidden_state === "hiding") return;
        this.set("hidden_state", "hiding");
    },
    force_hidden: function() {
        var O = this.options;
        if (O.hidden_state === "hidden") return;
        this.set("hidden_state", "hidden");
        Widget.prototype.hide.call(this);

        if (this.needs_redraw)
            TK.S.remove(this._redraw);
        this.fire_event("hidden");
        var C = this.children;
        for (var i = 0; i < C.length; i++) {
            C[i].force_hidden();
        }
    },
    show: function() {
        var O = this.options;
        if (O.hidden_state === "show" || O.hidden_state === "showing") return;
        this.set("hidden_state", "showing");
        this.fire_event("show");

        Widget.prototype.show.call(this);
        show_children.call(this);
    },

    resize: function() {
        var C = this.children;
        Widget.prototype.resize.call(this);
        for (var i = 0; i < C.length; i++) {
            C[i].resize();
        }
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

        if (I.hidden_state) {
            var time;
            TK.remove_class(E, "toolkit-hiding");
            TK.remove_class(E, "toolkit-hidden");
            TK.remove_class(E, "toolkit-showing");
            TK.remove_class(E, "toolkit-show");

            if (this.__hide_id) {
                w.clearTimeout(this.__hide_id);
                this.__hide_id = false;
            }

            switch (O.hidden_state) {
            case "hiding":
                TK.add_class(E, "toolkit-hiding");
                time = TK.get_transition_duration(E);
                if (time > 0) {
                    this.__hide_id = w.setTimeout(this.__after_hiding, time);
                    break;
                }
                O.hidden_state = "hidden";
                TK.remove_class(E, "toolkit-hiding");
                /* FALL THROUGH */
            case "hidden":
                TK.add_class(E, "toolkit-hidden");
                hide_children.call(this);
                Widget.prototype.hide.call(this);
                break;
            case "showing":
                TK.add_class(E, "toolkit-showing");
                time = TK.get_transition_duration(E);
                if (time > 0) {
                    this.__hide_id = w.setTimeout(this.__after_showing, time);
                    break;
                }
                O.hidden_state = "show";
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

            TK.set_content(E, O.content);
        }
    },
});
})(this);
