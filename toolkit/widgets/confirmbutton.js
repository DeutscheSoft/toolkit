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
(function(w, TK){
  
var clicked = function (e) {
  if (!this.options.confirm) {
    this.fire_event("confirmed");
    return;
  }
  if (this.options.state) {
    this.fire_event("confirmed");
  } else {
    var that = this;
    document.addEventListener("click", function fun (e) {
      document.removeEventListener(e.type, fun, true);
      if (!that.options.state) return;
      for (var i = 0; i < e.path.length; i++)
        if (e.path[i] == that.element) return;
      that.set("state", false);
    }, true);
  }
  this.set("state", !this.options.state);
}
  
TK.ConfirmButton = TK.class({
  
  _class: "ConfirmButton",
  Extends: TK.Button,
  
  _options: Object.assign(Object.create(TK.Button.prototype._options), {
    confirm: "boolean",
  }),
  options: {
    confirm: true,
  },
  
  initialize: function (options) {
    TK.Button.prototype.initialize.call(this, options);
    this.add_event("click", clicked.bind(this)); 
  },
  
  set: function (key, value) {
    if (key == "confirm" && value == false) {
      this.set("state", false);
    }
    TK.Button.prototype.set.call(this, key, value);
  }
});

})(this, this.TK);
