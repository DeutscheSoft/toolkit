 /* toolkit provides different widgets, implements and modules for 
 * building audio based applications in webbrowsers.
 * 
 * Invented 2013 by Markus Schmidt <schmidt@boomshop.net>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General
 * Public License along with this program; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, 
 * Boston, MA  02110-1301  USA
 */
    
window.addEventListener('DOMContentLoaded', function () {
    this.sections = [
        { "id" : "extends",    "name" : "Inheritance",      "description" : "This item is based on other items. Click on an item to switch to its full documentation." },
        //{ "id" : "implements", "name" : "Implements",   "description" : "This item implements the functionality of other items. Click on an item to switch to its full documentation." },
        { "id" : "options",    "name" : "Options",      "description" : "These options are accessible via item.set() and item.get() and can be set in the options object for the constructor." },
        { "id" : "elements",   "name" : "DOM-Elements", "description" : "The item has one or more elements added to the DOM which are listed here with their classes." },
        { "id" : "methods",    "name" : "Methods",      "description" : "A list of public methods." },
        { "id" : "modules",    "name" : "Modules",      "description" : "This item implements one or more other items as distinct objects." }, 
        { "id" : "events",     "name" : "Events",       "description" : "Bind callback functions to events via item.add_event()." },
        { "id" : "files",      "name" : "Files",        "description" : "The item uses the following external files:" },
        { "id" : "example",    "name" : "Example",      "description" : "See the item in action and take a look on the corresponding code." }
    ]
    this.replacements = {
        "[c]" : "<i class=classified title='This element is classified. E.g. calling item.add_class() affects this element.'>❇</i>",
        "[d]" : "<i class=delegated title='This element is delegated. E.g. calling item.add_event() is delegated to this element.'>⇄</i>",
        "[s]" : "<i class=stylized title='This element is stylized. E.g. calling item.set_style() sets the css styles on this element.'>✎</i>",
    }
    this.app = "index.html";
    this.hash_separator = ":";
    this.itemids = [ "widgets", "modules", "implements" ];
    this.process_cols = [ "name", "description", "text" ];
    this.init = function (items) {
        this.items = items;
        this.tm = this.timemachine(this);
        
        var t = this;
        var back = TK.element("a", "back", "hidden");
        back.setAttribute("id", "back");
        back.onclick = function () { t.tm.back() };
        document.body.appendChild(back);
        var next = TK.element("a", "next", "hidden");
        next.setAttribute("id", "next");
        next.onclick = function () { t.tm.next() };
        document.body.appendChild(next);
        
        this.build_navigation(items);
        window["SC"] = this;
        
        var regex = "#(";
        var lst = this.all_items();
        for (var i = lst.length-1; i >= 0 ; i--) {
            // TODO: reversing is just a trashy fix of matching only Button in ButtonArray
            regex += lst[i].name + "|"; 
        }
        if (regex) regex = regex.substr(0, regex.length-1);
        this.proc_text_regex = new RegExp(regex + ")", "ig");
        
        var item = window.location.href.split("?", 2);
        
        var parts = window.location.hash.substring(1).split(this.hash_separator, 2);
        var item = parts[0];
        var hash = parts.length > 1 ? parts[1] : "";
        if (item) {
            var i = this.find_item(item);
            if (i)
                this._show_item(i);
            if (hash && typeof window["run_" + hash] == "function") {
                var that = this;
                setTimeout( function () {
                    document.body.scrollTop = TK.get_id("anchor_" + hash).offsetTop;
                    if (hash == "example")
                        that.run_example(i.id);
                }, 100);
            }
        }
    }
    
    this.build_navigation = function (items) {
        var c = document.createDocumentFragment();
        var nav = TK.element("ul", "hidden");
        nav.setAttribute("id", "navigation");
        c.appendChild(nav);
        var but = TK.element("div");
        but.setAttribute("id", "navbutton");
        nav.appendChild(but);
        TK.set_text(but, "MENU");
        but.onclick = function () {
            TK.toggle_class(TK.get_id("navigation"), "hidden");
        }

        var keys = Object.keys(items);

        keys.sort();
        
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            // loop over categories
            var _i = items[key];
            var type = TK.element("li");
            nav.appendChild(type);
            TK.set_text(type, _i.name);
            //type.setAttribute("title", _i.description);
            var list = TK.element("ul");
            type.appendChild(list);
            var widgets = Object.keys(_i.items);
            widgets.sort();
            for (var j = 0; j < widgets.length; j++) {
                var w_name = widgets[j];
                // loop over items in category
                var _j = _i.items[w_name];
                var item = TK.element("li");
                var a = TK.element("a");
                a.setAttribute("href", this.app + "#" + _j.name);
                TK.set_text(a, _j.name);
                list.appendChild(item);
                item.appendChild(a);
                item.onclick = (function (t, i) { 
                    return function () { t.show_item(i); }
                })(this, _j)
            }
        }
        TK.get_id("wrapper").appendChild(c);
    }
    
    this.build_item = function (item) {
        var div = TK.element("div");
        div.setAttribute("id", "item");
        
        var top = TK.element("div");
        top.setAttribute("id", "top");
        
        var header = TK.element("h2");
        TK.set_text(header, item.name);
        
        var a = TK.element("a");
        a.setAttribute("href", this.app + "#" + item.name);
        a.appendChild(header);
        top.appendChild(a);
        
        if (item.hasOwnProperty("description")) {
            var desc = TK.element("p");
            desc.innerHTML = this.process_text(item.description);
            top.appendChild(desc);
        }
        div.appendChild(top);
        
        // subnavigation
        var subnav = TK.element("ul");
        subnav.setAttribute("id", "subnav");
        div.appendChild(subnav);
        var h = TK.element("h3");
        TK.set_text(h, "Jump To:");
        var li = TK.element("li");
        li.appendChild(h);
        subnav.appendChild(li);
        
        for (var s in this.sections) {
            // add sections
            var sect = this.sections[s];
            //if (sect.id != "example" && !item.hasOwnProperty(sect.id)) continue;
            this.build_section(sect, item, div, subnav);
        }
        return div;
    }
    
    this.build_tree = function (item) {
        var lst = [];
        var ul = TK.element("ul", "tree");
        ul.setAttribute("id", "tree");
        this.bubble_tree(item, function (it) {
            lst.push(it);
        }, ["extends"]);
        if (lst.length > 1 || (lst[0].hasOwnProperty("implements") && lst[0].implements.length)) {
            for (var i = lst.length - 1; i >= 0; i--) {
                var li = TK.element("li");
                var a = this.link_item(lst[i].name);
                li.appendChild(a);
                if (lst[i].hasOwnProperty("implements")) {
                    for (var j = 0; j < lst[i].implements.length; j++) {
                        var arr = TK.element("span", "arrow_left");
                        TK.set_text(arr, "⬅");
                        li.appendChild(arr);
                        li.appendChild(this.link_item(lst[i].implements[j]));
                    }
                }
                if (i) {
                    var arr = TK.element("div", "arrow_down");
                    TK.set_text(arr, "⬇");
                    li.appendChild(arr);
                }
                ul.appendChild(li);
            }
        }
        return ul;
    }
    
    this.link_item = function (name) {
        var it = this.find_item(name);
        if (it) {
            var a = TK.element("a");
            a.setAttribute("href", this.app + "#" + name);
            var t = this;
            a.onclick = function (e) {
                //e.preventDefault();
                t.show_item(it);
            }
        } else
            var a = TK.element("span");
        TK.set_text(a, name);
        return a;
    }
    
    this.build_section = function (sect, item, div, subnav) {
        var subf = document.createDocumentFragment();
        var headf = document.createDocumentFragment();
        var divf = document.createDocumentFragment();
        switch(sect.id) {
            default:
                this.build_section_header(sect, item, headf, subf);
                this.build_tables_recursively(sect.id, item, divf);
                break;
            case "methods":
                this.build_section_header(sect, item, headf, subf);
                this.build_tables_recursively(sect.id, item, divf);
                break;
            case "extends":
                this.build_section_header(sect, item, headf, subf);
                var ul = this.build_tree(item);
                if (ul.children.length)
                    divf.appendChild(ul);
                break;
            case "files":
                this.build_section_header(sect, item, headf, subf);
                var a = [];
                this.bubble_tree(item, function (i) {
                    if (!i.hasOwnProperty("files")) return;
                    a = a.concat(i.files);
                }, ['extends', 'implements']);
                divf.appendChild(this.build_list(a, sect.id));
                break;
            case "example":
                id = item.name.toLowerCase();
                if (typeof window["run_" + id] != "undefined") {
                    this.build_section_header(sect, item, headf, subf);
                    this.build_example(item.name, divf, sect.name);
                }
                break;
        }
        if (divf.children.length) {
            div.appendChild(headf);
            div.appendChild(divf);
            subnav.appendChild(subf);
        }
    }
    
    this.build_section_header = function (sect, item, div, subnav) {
        // subnav
        var l = TK.element("li");
        var a = TK.element("a", sect.id, "icon");
        l.appendChild(a);
        a.setAttribute("href", "#" + item.name + this.hash_separator + sect.id);
        TK.set_text(a, sect.name);
        subnav.appendChild(l);
        // header and description
        var h = TK.element("h3", sect.id, "icon");
        h.innerHTML = "<a name='" + item.name + this.hash_separator + sect.id + "' id='anchor_" + sect.id + "'></a>" + sect.name;
        var p = TK.element("p");
        p.innerHTML = this.process_text(sect.description);
        div.appendChild(h);
        div.appendChild(p);
    }
    
    this.build_list = function (list, id, name) {
        //builds an ul>li list of an array
        var ul = TK.element("ul", id);
        for (var i = 0; i < list.length; i++) {
            var a = TK.element("li");
            if (name)
                li.appendChild(this.link_item(list[i]));
            else
                TK.set_text(a, list[i]);
            ul.appendChild(a);
        }
        return ul;
    }
    
    this.build_tables_recursively = function (id, item, div) {
        this.bubble_tree(item, function (it) {
            if (!it.hasOwnProperty(id)) return;
            if (it.id != item.id) {
                var h = TK.element("h4");
                var l = TK.element("a");
                TK.set_text(l, it.name);
                l.setAttribute("href", this.app + "#" + it.name);
                l.onclick = (function (that, item) {
                    return function () {
                        that.show_item(item);
                    }
                })(this, it);
                TK.set_text(h, "Inherited from ");
                h.appendChild(l);
                div.appendChild(h);
            }
            div.appendChild(this.build_table(it[id], id == "methods" ? "name" : false));
        }, ["extends", "implements"]);
    }
    
    this.build_table = function (data, headers) {
        // build column order array
        var cols = [];
        if (data.length) {
            var hasname = 0;
            var hasdesc = 0;
            for(var i = 0; i < data.length; i++) {
                for (var key in data[i]) {
                    hasname = hasname || data[i].hasOwnProperty("name");
                    hasdesc = hasdesc || data[i].hasOwnProperty("description");
                    if (!data[i].hasOwnProperty(key)) continue;
                    if (hasname && key == "name") continue;
                    if (hasdesc && key == "description") continue;
                    if (cols.indexOf(key) >= 0) continue;
                    cols.push(key);
                }
            }
            if (hasdesc) cols.unshift("description");
            if (hasname) cols.unshift("name");
        }
        
        // build table and header
        var table = TK.element("table");
        var head = TK.element("tr");
        table.appendChild(head);
        for(var c in cols) {
            var th = TK.element("th");
            head.appendChild(th);
            TK.set_text(th, cols[c]);
        }
        
        // build rows
        for (var i in data) {
            if (!data.hasOwnProperty(i)) continue;
            var item = data[i];
            if (headers && item.hasOwnProperty(headers)) {
                // this is soooo dirty ^^
                var row = TK.element("tr");
                var td = TK.element("td", "headline");
                td.setAttribute("colspan", 999);
                td.innerHTML = item[headers];
                item[headers] = item[headers].split("(")[0];
                row.appendChild(td);
                table.appendChild(row);
            }
            var row = TK.element("tr");
            table.appendChild(row);
            for (var c in cols) {
                var td = TK.element("td");
                if (this.process_cols.indexOf(cols[c]) >= 0)
                    td.innerHTML = this.process_text(item[cols[c]]);
                else if (typeof item[cols[c]] == "object")
                    td.appendChild(this.build_table(item[cols[c]]));
                else if (item[cols[c]])
                    td.innerHTML = item[cols[c]];
                row.appendChild(td);
            }
        }
        return table;
    }
    
    this.build_example = function (name, div, button) {
        var id = name.toLowerCase();
        var but = TK.element("a", "toolkit-button");
        var url = window.location.href.split("#")[0] + "#" + name + this.hash_separator + "example";
        but.setAttribute("href", url);
        but.addEventListener("click", (function (that, id) {
            return function (e) { that.run_example(id); }
        })(this, id));
        TK.set_text(but, button);
        div.appendChild(but);
    }
    
    this.run_example = function (id) {
        var fun = "run_" + id;
        
        var dover = TK.element("div", "demo_overlay");
        dover.setAttribute("id", "demo_overlay");

        var root = new Root({
            container : dover,
            "class" : "demo",
            "id" : "demo",
        });

        root.add_class("box");
        root.add_class(id);

        document.body.appendChild(dover);
        
        var code = TK.element("code", "code", "hidden");
        code.setAttribute("id", "code");
        TK.set_text(code, window["run_" + id].toString());
        dover.appendChild(code);
        
        var menu = TK.element("div", "menu");
        dover.appendChild(menu);
        
        var tog = TK.element("div", "toolkit-button");
        tog.setAttribute("id", "code_button");
        TK.set_text(tog, "Show Code");
        menu.appendChild(tog);
        tog.addEventListener("click", function (e) {
            root.toggle_hidden();
            TK.toggle_class(code, "hidden");
        });
        
        var exit = TK.element("a", "toolkit-button");
        exit.setAttribute("id", "exit_button");
        var href = window.location.href;
        var hash = window.location.hash;
        var url = href;
        if (hash.indexOf(this.hash_separator) > -1)
            url = href.substr(0, href.lastIndexOf(this.hash_separator));
        exit.setAttribute("href", url);
        TK.set_text(exit, "Close");
        menu.appendChild(exit);
        exit.addEventListener("click", function () {
            document.body.removeChild(dover);
            root.destroy();
        });
        
        dover.onscroll = function (e) { console.log("scroll"); e.preventDefault(); e.stopPropagation(); }
        
        window[fun](root);
    }
    
    this.find_item = function (name, section) {
        // this function searches for additional sections of extended
        // or implemented items
        for (var m in this.itemids ) {
            var _m = this.itemids[m];
            if (!items.hasOwnProperty(_m)) continue;
            for (var e in items[_m].items) {
                if (!items[_m].items.hasOwnProperty(e)) continue;
                if (items[_m].items[e].name == name
                 && (!section || items[_m].items[e].hasOwnProperty(section)))
                        return items[_m].items[e];
            }
        }
    }
    
    this.bubble_tree = function (item, fun, extensions) {
        fun.call(this, item);
        for (var e in extensions) {
            var _e = extensions[e];
            if (!item.hasOwnProperty(_e)) continue;
            for (var i = 0; i < item[_e].length; i++) {
                var ex = this.find_item(item[_e][i]);
                if (!ex) continue;
                this.bubble_tree(ex, fun, extensions);
            }
        }
    }
    this.process_text = function (text) {
        if (!text) return;
        text = TK.escapeHTML(text);
        var r = this.replacements;
        for (var i in r) {
            text = text.replace(i, r[i]);
        }
        while (text.match(this.proc_text_regex)) {
            text = text.replace(this.proc_text_regex, "<a href='" + this.app + "*\$1' onclick='SC.show_item(\"\$1\")'>\$1</a>")
        }
        return text.replace("href='" + this.app + "*", "href='" + this.app + "#");
    }
    
    this.show_item = function (item) {
        if (typeof item == "string")
            item = this.find_item(item);
        this.tm.push(item);
        this._show_item(item);
    }
    
    this._show_item = function (item, pos) {
        pos = pos || 0;
        var i = TK.get_id("item");
        if (i)
            TK.get_id("wrapper").removeChild(i);
        TK.get_id("wrapper").appendChild(this.build_item(item));
        //window.location.href = this.app + "#" + item.name;
        setTimeout(function() {
            document.body.scrollTop = pos;
        }, 100);
        TK.add_class(TK.get_id("navigation"), "hidden");
    }
    
    this.timemachine = function (parent) {
        this.parent = parent;
        this.hist = [];
        this.pointer = -1;
        this.push = function (item) {
            this.set_scroll_pos();
            if (this.hist[this.pointer] == item)
                return;
            this.hist.splice(this.pointer + 1, this.hist.length - this.pointer);
            this.hist.push({ item : item, position : 0 });
            this.pointer = this.hist.length - 1;
            this.arrows(this.pointer);
        }
        this.back = function () {
            this.show(Math.max(-1, this.pointer-1));
        }
        this.next = function () {
            this.show(Math.min(this.hist.length-1, this.pointer+1));
        }
        this.show = function (p) {
            this.set_scroll_pos();
            this.pointer = p;
            if (p > -1 && this.hist.length) {
                window.location = this.parent.app + "#" + this.hist[p].item.name;
                _show_item(this.hist[p].item, this.hist[p].position);
            }
            this.arrows(p);
        }
        this.arrows = function (p) {
            TK[(p > 0 ? "remove" : "add") + "_class"](TK.get_id("back"), "hidden");
            TK[(p < this.hist.length-1 ? "remove" : "add") + "_class"](TK.get_id("next"), "hidden");
        }
        this.set_scroll_pos = function () {
            if (this.hist.length && this.hist.length > this.pointer)
                this.hist[this.pointer].position = document.body.scrollTop;
        }
        return this;
    }
    
    this.all_items = function () {
        var a = [];
        if (this.items.hasOwnProperty("implements")) for(var i in this.items.implements.items)
            a.push(this.items.implements.items[i])
        if (this.items.hasOwnProperty("modules")) for(var i in this.items.modules.items)
            a.push(this.items.modules.items[i])
        if (this.items.hasOwnProperty("widgets")) for(var i in this.items.widgets.items)
            a.push(this.items.widgets.items[i])
        return a;
    }
    
    this.init(items);
});
