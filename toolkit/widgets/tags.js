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

TK.Tags = TK.class({
    
    Extends: TK.Widget,
    
    _options: Object.assign(Object.create(TK.Widget.prototype._options), {
        tag_class: "object",
    }),
    options: {
        tag_class: TK.Tag,
    },
    
    initialize: function (options) {
        this.tags = {};
        TK.Widget.prototype.initialize.call(this, options);
    },
    tag_to_string: function (tag) {
        if (typeof tag == "string")
            return tag
        else if (TK.Tag.prototype.isPrototypeOf(tag))
            return tag.options.tag;
        else
            return tag.tag;
    },
    find_tag: function (tag) {
        return this.tags[this.tag_to_string(tag)];
    },
    request_tag: function (tag) {
        var C = this.options.tag_class;
        var t = this.tag_to_string(tag);
        if (!this.find_tag(tag)) {
            if (typeof tag == "string")
                tag = new C({tag: tag});
            else if (C.prototype.isPrototypeOf(tag))
                tag = tag;
            else
                tag = new C(tag);
            tag.show();
            this.tags[t] = tag;
        }
        return this.tags[t];
    },
    remove_tag: function (tag) {
        tag = find_tag(tag);
        if (!tag) return;
        this.tags.splice(this.tags.indexOf(tag), 1);
    },
});

})(this, this.TK);
