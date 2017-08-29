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

function close_clicked (e) {
  this.fire_event("closeclicked");
  close.call(this.parent);
}

function after_hide() {
  TK.S.after_frame(function() {
    if (this.is_destructed()) return;
    this.destroy();
  }.bind(this));
}

function close () {
  this.add_event("hide", after_hide);
  this.hide();
  this.fire_event("closed");
}

function timeout() {
  this._timeout = void(0);
  close.call(this);
}

TK.Notification = TK.class({
    
  _class: "Notification",
  Extends: TK.Container,
  
  _options: Object.assign(TK.Container.prototype._options, {
    timeout: "number",
  }),
  options: {
    timeout: 5000,
  },
  
  initialize: function (options) {
    TK.Container.prototype.initialize.call(this, options);
    var O = this.options;
    TK.add_class(this.element, "toolkit-notification");
    this._timeout = void(0);
    this.set("timeout", O.timeout);
  },
  redraw: function () {
    var I = this.invalid;
    var O = this.options;
    var i = I.content;
    TK.Container.prototype.redraw.call(this);
    if (i && this.close)
      this.element.insertBefore(this.close.element, this.element.firstChild);
    
    if (I["class"]) {
      I["class"] = false;
      TK.add_class(this.element, "toolkit-icon");
    }
  },
  
  remove: close,
  destroy: function() {
    if (this._timeout !== void(0))
      w.clearTimeout(this._timeout);
    TK.Container.prototype.destroy.call(this);
  },
  set: function(key, val) {
    TK.Container.prototype.set.call(this, key, val);
    if (key === "timeout") {
      if (this._timeout !== void(0))
        w.clearTimeout(this._timeout);
      if (val > 0)
        this._timeout = w.setTimeout(timeout.bind(this), val);
    }
  },
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
