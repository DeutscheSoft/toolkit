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

var toggle_collapsed = function () {
    set_collapsed.call(this, !TK.has_class(this.element, "toolkit-collapsed"));
}
var set_collapsed = function (c) {
    this.set("collapsed", c);
}

function trigger_parent_resize() {
  var w = this.parent;

  while (w) {
    w.trigger_resize();
    w = w.parent;
  }
}

TK.TreeItem = TK.class({
    
    _class: "TreeItem",
    Extends: TK.ListItem,
    
    _options: Object.assign(Object.create(TK.Widget.prototype._options), {
        collapsed: "boolean",
        collapsable: "boolean",
        force_collapsable: "boolean",
        _scrollheight: "number",
    }),
    options: {
        collapsed: false,
        collapsable: true,
        force_collapsable: false,
    },
    initialize: function (options) {
        this.list = new TK.List();
        
        TK.ListItem.prototype.initialize.call(this, options);
        TK.add_class(this.element, "toolkit-tree-item");
        
        this.add_child(this.list);
        
        this.collapse = new TK.Button({"class":"toolkit-collapse"});
        this.add_child(this.collapse);
        this.collapse.add_event("click", toggle_collapsed.bind(this));
    },
    append_child: function (child) {
        if (TK.ListItem.prototype.isPrototypeOf(child)) {
            this.add_child(child);
            return this.list.append_child(child);
        } else {
          TK.ListItem.prototype.append_child.call(this, child);
        }
        this.trigger_resize();
    },
    add_child : function(child) {
        if (TK.ListItem.prototype.isPrototypeOf(child)) {
            var r = this.list.add_child(child);
            if (this.list.children.length && !this.list.element.parentElement) {
                this.list.show();
                this.invalid._list = true;
                this.trigger_draw();
            }
        } else {
          TK.ListItem.prototype.add_child.call(this, child);
        }
        this.invalid._list = true;
        this.trigger_resize();
    },
    remove_child : function(child) {
        if (TK.ListItem.prototype.isPrototypeOf(child)) {
            var r = this.list.remove_child(child);
            if (!this.list.children.length && this.list.element.parentElement) {
                this.list.hide();
                this.invalid._list = true;
                this.trigger_draw();
            }
            return r;
        } else {
          TK.ListItem.prototype.remove_child.call(this, child);
        }
        this.invalid._list = true;
        this.trigger_resize();
    },
    resize: function() {
        this.set("_scrollheight", this.element.scrollHeight);
    },
    redraw: function () {
        TK.ListItem.prototype.redraw.call(this);
        var I = this.invalid;
        var O = this.options;
        var E = this.element;
        if (I._list) {
            I.collapsed = true;
            if (this.list.children && this.list.children.length) {
                if (this.list.element.parentElement != E)
                    E.appendChild(this.list.element);
                this.add_class("toolkit-has-tree");
            } else {
                if (this.list.element.parentElement == E)
                    E.removeChild(this.list.element);
                this.remove_class("toolkit-has-tree");
            }
        }
        if (I._list || I.collapsable || I.force_collapsable) {
            if ((this.list.children && this.list.children.length && O.collapsable) || O.force_collapsable)
                E.appendChild(this.collapse.element);
            else if (this.collapse.element.parentElement == E)
                E.removeChild(this.collapse.element);
            TK.toggle_class(E, "toolkit-force-collapsable", O.force_collapsable);
        }
        if (I.collapsed) {
            I.collapsed = false;
            E.style["min-height"] = O.collapsed ? "0px" : O._scrollheight + "px";
            TK.toggle_class(E, "toolkit-collapsed", O.collapsed);
            trigger_parent_resize.call(this);
        }
        if (I._scrollheight) {
            I._scrollheight = false;
            if (!O.collapsed)
                E.style["min-height"] = O._scrollheight + "px";
        }
        I._list = I.collapsable = I.force_collapsable = false;
    },
    set: function (key, value) {
        var O = this.options;
        switch (key) {
            case "collapsed":
                if (!value && this.list)
                    this.show_child(this.list);
                else
                    this.hide_child(this.list);
                break;
        }
        return TK.ListItem.prototype.set.call(this, key, value);
    }
});

})(this, this.TK);
