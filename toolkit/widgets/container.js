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
w.Container = $class({
    // Container is a simple DIV
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
        this.__hidden = 2;
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
        if (this.__hidden === 0) {
            this.trigger_draw();
            this.__hidden = 1;
            this.fire_event("hide");
            var C = this.children;
            var H = this.hidden_children;
            for (var i = 0; i < C.length; i++) {
                if (H[i] !== true) C[i].hide();
            }
        }
    },
    force_hidden: function() {
        if (this.__hidden !== 2) {
            if (this.__hidden === 0)
                this.fire_event("hide");
            this.__hidden = 2;
            var E = this.element;
            if (E) TK.add_class(E, "toolkit-hidden");
            if (this.needs_redraw) {
                TK.S.remove(this._redraw);
            }
            this.fire_event("hidden");
            var C = this.children;
            for (var i = 0; i < C.length; i++) {
                C[i].force_hidden();
            }
        }
    },
    show: function() {
        if (this.__hidden !== 0) {
            this.needs_redraw = true;
            if (this.__hidden === 2) {
                TK.S.add(this._redraw);
            }
            this.__hidden = 0;
            this.fire_event("show");

            var C = this.children;
            var H = this.hidden_children;
            for (var i = 0; i < C.length; i++) {
                if (!H[i]) {
                    C[i].show();
                }
            }
        }
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

        if (this.__hidden === 1) {
            this.__hidden = 2;
            if (E) {
                TK.add_class(E, "toolkit-hide");
                var style = TK.get_style(E);
                var t = parseFloat(style["transition-duration"]);
                if (t > 0.0) {
                    window.setTimeout(function() {
                        if (this.__hidden = 2)
                            TK.add_class(E, "toolkit-hidden");
                    }.bind(this), t*1000);
                } else {
                    TK.add_class(E, "toolkit-hidden");
                }
            }
        } else if (this.__hidden === 0) {
            if (E) {
                TK.remove_class(E, "toolkit-hide");
                TK.remove_class(E, "toolkit-hidden");
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
