/*
 * This file is part of Toolkit.
 *
 * Toolkit is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * Toolkit is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU General
 * Public License along with this program; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA  02110-1301  USA
 */
"use strict";
(function (w, TK) {

function hide(value, key) {
    if (value != "hide") return;
    this.element.remove();
}

TK.Dialog = TK.class({
    
    _class: "Dialog",
    Extends: TK.Container,
    Implements: TK.Anchor,
    
    _options: Object.assign(Object.create(TK.Container.prototype._options), {
        visible: "boolean",
        anchor: "string",
        x: "number",
        y: "number",
        autoclose: "boolean",
    }),
    options: {
        visible: true,
        anchor: "center",
        x: 0,
        y: 0,
        autoclose: false,
    },
    initialize: function (options) {
        var c = options.container;
        options.container = null;
        TK.Container.prototype.initialize.call(this, options);
        TK.add_class(this.element, "toolkit-dialog");
        this.add_event("set_display_state", hide);
        var O = this.options;
        O.container = c;
        if (O.visible)
            this.open(O.x, O.y);
        else
            this.close();
        this.add_event("set_display_state", function (val) {
          if (val == "show") {
            // BROKEN!
            // sometimes isn't called when shown
            this.invalid.anchor = true;
            this.trigger_draw();
          }
        });
    },
    redraw: function () {
        TK.Container.prototype.redraw.call(this);
        var I = this.invalid;
        var O = this.options;
        var E = this.element;
        
        if (I.visible) {
            I.visible = false;
            if (O.visible)
                this.set("container", O.container);
        }
        
        if (I.x || I.y || I.anchor) {
            var bodybox = document.body.getBoundingClientRect();
            var sw = bodybox.width;
            var sh = bodybox.height;
            var box = this.element.getBoundingClientRect();
            I.x = I.y = I.anchor = false;
            var box = E.getBoundingClientRect();
            var pos = this.translate_anchor(O.anchor, O.x, O.y, -box.width, -box.height);
            pos.x = Math.min(sw - box.width, Math.max(0, pos.x));
            pos.y = Math.min(sh - box.height, Math.max(0, pos.y));
            E.style.left = pos.x + "px"
            E.style.top  = pos.y + "px"
        }
    },
    open: function (x, y) {
        var O = this.options;
        if (O.display_state != "show")
            this.show();
        
        if (O.autoclose) {
            var that = this;
            document.addEventListener("click", function fun (e) {
                for (var i = 0; i < e.path.length; i++)
                    if (e.path[i].className && e.path[i].className.search("toolkit-dialog") >= 0) return;
                document.removeEventListener(e.type, fun, true);
                that.close();
            }, true);
        }
        
        this.set("x", x);
        this.set("y", y);
        this.set("visible", true);
        this.fire_event("open");
    },
    close: function () {
        this.set("visible", false);
        this.hide();
        this.fire_event("close");
    },
    reposition: function () {
        var O = this.options;
        this.set("x", O.x);
        this.set("y", O.y);
    }
});
    
    
})(this, this.TK);
