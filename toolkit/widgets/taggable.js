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

function add (e) {
    this.fire_event("addtag", e);
}

function remove (e, tag, node) {
    this.fire_event("removetag", tag.tag);
    if (!this.options.async)
        this.remove_tag(tag);
}

TK.Taggable = TK.class({
    _options: {
        tags: "array",
        backend: "object",
        add_label: "string",
        show_add: "boolean",
        async: "boolean",
        tag_class: "object",
        tag_options: "object",
    },
    options: {
        tags: [],
        backend: false,
        add_label: "✚",
        show_add: true,
        async: false,
        tag_class: TK.Tag,
        tag_options: {},
    },
    
    initialize: function () {
        var O = this.options;
        this.taglist = [];
        if (!O.backend)
            O.backend = new TK.Tags({});
            
        this.tags = new TK.Container({
            "class" : "toolkit-tags"
        });
        this.append_child(this.tags);
        
        this.add = new TK.Button({
            container: this.element,
            label: O.add_label,
            "class": "toolkit-add",
            "onclick": add.bind(this),
        });
        this.append_child(this.add);
        
        this.add_tags(O.tags);
    },
    
    destroy: function () {
        this.tags.destroy();
        this.add.destroy();
    },
    
    request_tag: function (tag, tag_class, tag_options) {
        return this.options.backend.request_tag(
            tag,
            tag_class || this.options.tag_class,
            tag_options || this.options.tag_options);
    },
    add_tags: function (tags) {
        for (var i = 0; i < tags.length; i++)
            this.add_tag(tags[i]);
    },
    add_tag: function (tag, options) {
        var B = this.options.backend;
        tag = B.request_tag(tag);
        if (this.has_tag(tag)) return;
        this.taglist.push(tag);
        
        var node = tag.create_node(options);
        this.tags.append_child(node);
        
        node.add_event("remove", remove.bind(this));
        this.fire_event("tagadded", tag, node);
        return {tag:tag, node:node};
    },
    has_tag: function (tag) {
        tag = this.request_tag(tag);
        return this.taglist.indexOf(tag) >= 0;
    },
    remove_tag: function (tag, purge) {
        var B = this.options.backend;
        tag = B.request_tag(tag);
        if (!this.has_tag(tag)) return;
        this.taglist.splice(this.taglist.indexOf(tag), 1);
        var c = this.tags.children;
        if (c) {
            for (var i = 0; i < c.length; i++) {
                var tagnode = c[i];
                if (tagnode.tag === tag) {
                    tag.remove_node(tagnode);
                    this.remove_child(tagnode);
                    break;
                }
            }
        }
        if (purge)
            B.remove_tag(tag);
        this.fire_event("tagremoved", tag);
    },
    empty: function () {
        var T = this.taglist;
        while (T.length)
            this.remove_tag(T[0]);
    },
    tag_to_string: function (tag) {
        return this.options.backend.tag_to_string.call(this, tag);
    },
    find_tag: function (tag) {
        this.options.backend.find_tag.call(this, tag);
    },
});

})(this, TK)
