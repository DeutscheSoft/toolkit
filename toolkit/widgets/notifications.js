/*
 * This file is part of toolkit.
 *
 * toolkit is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * toolkit is distributed in the hope that it will be useful,
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
(function (w, TK) {

TK.Notifications = TK.class({
    
    _class: "Notifications",
    Extends: TK.List,
    
    _options: Object.assign(TK.List.prototype._options, {
      stack: "string",
    }),
    options: {
      stack: "bottom"
    },
    
    initialize: function (options) {
        TK.List.prototype.initialize.call(this, options);
        TK.add_class(this.element, "toolkit-notifications");
    },
    
    notify: function (options) {
      var n = new TK.Notification(options);
      this.add_child(n);
      if (this.options.stack == "bottom")
        this.element.insertBefore(n.element, this.element.firstChild);
      else
        this.element.appendChild(n.element);
    }
});
    
})(this, this.TK);
