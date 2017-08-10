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

function close_clicked (e) {
  this.fire_event("closeclicked");
  close.call(this.parent);
}

function close () {
  if (this._timeout !== void(0))
    w.clearTimeout(this._timeout);
  this.hide();
  var that = this;
  this.add_event("hide", function () {
    that.parent.remove_child(that);
    that.set("container", false);
    // @Arne: might this become a memory leak if it stays commented?
    // throws an error.
    //that.destroy();
  });
  this.fire_event("closed");
}

TK.Notification = TK.class({
    
  _class: "Notification",
  Extends: TK.ListItem,
  
  _options: Object.assign(TK.ListItem.prototype._options, {
    timeout: "number",
  }),
  options: {
    timeout: 5000,
  },
  
  initialize: function (options) {
    TK.ListItem.prototype.initialize.call(this, options);
    var O = this.options;
    TK.add_class(this.element, "toolkit-notification");
    if (O.timeout)
      this._timeout = w.setTimeout(close.bind(this), O.timeout);
  },
  redraw: function () {
    var I = this.invalid;
    var O = this.options;
    var i = I.content;
    TK.ListItem.prototype.redraw.call(this);
    if (i && this.close)
      this.element.insertBefore(this.close.element, this.element.firstChild);
    
    if (I["class"]) {
      I["class"] = false;
      TK.add_class(this.element, "toolkit-icon");
    }
  },
  
  remove: close.bind(this),
  
});

/**
 * @member {TK.Button} TK.Notification#closes - The TK.Button widget.
 */
TK.ChildWidget(TK.Notification, "close", {
  create: TK.Button,
  show: false,
  toggle_class: true,
  static_events: {
    click: close_clicked,
  },
  default_options: {
    "class": "toolkit-icon close"
  },
});

})(this, this.TK);
