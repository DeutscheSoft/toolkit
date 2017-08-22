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
    static_events: {
      hide: function() {
        this.element.remove();
      },
      show: function() {
        var O = this.options;
        var C = O.container;
        if (C) C.appendChild(this.element);

        this.set('anchor', O.anchor);

        if (O.autoclose) {
            var that = this;
            document.addEventListener("click", function fun (e) {
                var curr = e.target;
                while (curr) {
                  if (curr === that.element) return;
                  curr = curr.parentElement;
                }
                document.removeEventListener(e.type, fun, true);
                that.close();
            }, true);
        }
      },
      set_visible: function(val) {
        if (val) this.show();
        else this.hide();
      }
    },
    options: {
        visible: true,
        anchor: "center",
        x: 0,
        y: 0,
        autoclose: false,
    },
    initialize: function (options) {
        TK.Container.prototype.initialize.call(this, options);
        TK.add_class(this.element, "toolkit-dialog");
        var O = this.options;
        /* This cannot be a default option because document.body
         * is not defined there */
        if (!O.container) O.container = w.document.body;
        this.set('visible', O.visible);
    },
    resize: function() {
        var O = this.options;
        if (O.visible)
          this.set('anchor', O.anchor);
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
