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

TK.List = TK.class({
    _options: Object.assign(Object.create(TK.Container.prototype._options), {
      sort: "function",
    }),
    _class: "List",
    Extends: TK.Container,
    
    initialize: function (options) {
        this.element = TK.element("ul", "toolkit-list");
        TK.Container.prototype.initialize.call(this, options);
    },
    append_child: function(w) {
      TK.Container.prototype.append_child.call(this, w);
      var O = this.options;
      var C = this.children;
      if (O.sort) {
        C.sort(O.sort);
        var pos = C.indexOf(w);
        if (pos !== C.length - 1)
          this.element.insertBefore(w.element, C[pos+1].element);
      }
    },
});
    
})(this, this.TK);
