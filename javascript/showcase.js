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
        { "id" : "extends",    "name" : "Extends",      "description" : "This item is based on other items. Click on an item to switch to its full documentation." },
        { "id" : "implements", "name" : "Implements",   "description" : "This item implements the functionality of other items. Click on an item to switch to its full documentation." },
        { "id" : "options",    "name" : "Options",      "description" : "These options are accessible via item.set() and item.get() and can be set in the options object for the constructor." },
        { "id" : "elements",   "name" : "DOM-Elements", "description" : "The item has one or more elements added to the DOM which are listed here with their classes." },
        { "id" : "methods",    "name" : "Methods",      "description" : "A list of public methods." },
        { "id" : "modules",    "name" : "Modules",      "description" : "This item implements one or more other items as distinct objects." }, 
        { "id" : "events",     "name" : "Events",       "description" : "Bind callback functions to events via item.add_event()." },
        { "id" : "files",      "name" : "Files",        "description" : "The item uses the following external files:" },
        { "id" : "example",    "name" : "Example",      "description" : "See the item in action." }
    ]
    this.replacements = {
        "[c]" : "<i class=classified></i>",
        "[d]" : "<i class=delegated></i>",
        "[s]" : "<i class=stylized></i>",
    }
    this.extensions = [ "extends", "implements" ];
    this.itemids = [ "widgets", "modules", "implements" ];
    this.process_cols = [ "name", "description", "text" ];
    this.init = function (items) {
        this.items = items;
        this.tm = new this.timemachine;
        
        var t = this;
        var back = TK.element("div", "back", "hidden");
        back.setAttribute("id", "back");
        back.onclick = function () { t.tm.back() };
        document.body.appendChild(back);
        var next = TK.element("div", "next", "hidden");
        next.setAttribute("id", "next");
        next.onclick = function () { t.tm.next() };
        document.body.appendChild(next);
        
        this.build_navigation(items);
        window["SC"] = this;
        
        
        var modex = window.location.hash.substring(1);
        if (modex && typeof window["run_" + modex.toLowerCase()] != "undefined")
            this.show_item(modex);
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
        
        for (var i in items) {
            // loop over categories
            if (!items.hasOwnProperty(i)) continue;
            var _i = items[i];
            var type = TK.element("li");
            nav.appendChild(type);
            TK.set_text(type, _i.name);
            //type.setAttribute("title", _i.description);
            var list = TK.element("ul");
            type.appendChild(list);
            for (var j in _i.items) {
                // loop over items in category
                if (!_i.items.hasOwnProperty(j)) continue;
                var _j = _i.items[j];
                var item = TK.element("li");
                list.appendChild(item);
                TK.set_text(item, _j.name);
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
        top.appendChild(header);
        
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
            if (sect.id != "example" && !item.hasOwnProperty(sect.id)) continue;
            this.build_section(sect, item, div, subnav);
        }
        return div;
    }
    
    this.build_section = function (sect, item, div, subnav) {
        this.build_section_header(sect, div, subnav);
        switch(sect.id) {
            default:
                this.build_tables_recursively(sect.id, item, div);
                break;
            case "extends":
            case "implements":
                div.appendChild(this.build_list(item[sect.id], sect.id, true));
                break;
            case "files":
                div.appendChild(this.build_list(item[sect.id], sect.id));
                break;
            case "example":
                id = item.name.toLowerCase();
                if (typeof window["run_" + id] != "undefined") {
                    this.build_example(id, div, sect.name)
                }
                break;
        }
    }
    
    this.build_section_header = function (sect, div, subnav) {
        var l = TK.element("li");
        var a = TK.element("a", sect.id, "icon");
        l.appendChild(a);
        a.setAttribute("href", "#" + sect.id);
        TK.set_text(a, sect.name);
        subnav.appendChild(l);
        var h = TK.element("h3", sect.id, "icon");
        h.innerHTML = "<a name='" + sect.id + "'></a>" + sect.name;
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
            TK.set_text(a, list[i]);
            if (name) {
                var it = find_item(list[i]);
                if (it) {
                    a.onclick = (function (t, i) {
                        return function () { t.show_item(i); }
                    })(this, it);
                    TK.add_class(a, "clickable");
                }
            }
            ul.appendChild(a);
        }
        return ul;
    }
    
    this.build_tables_recursively = function (id, item, div) {
        div.appendChild(this.build_table(item[id]));
        for (var e in this.extensions) {
            var _e = this.extensions[e]
            if (!item.hasOwnProperty(_e)) continue;
            for (var i = 0; i < item[_e].length; i++) {
                var ex = this.find_item(item[_e][i], id);
                if (!ex) continue;
                var h = TK.element("h4");
                var l = TK.element("a");
                TK.set_text(l, ex.name);
                l.onclick = (function (that, item) {
                    return function () {
                        that.show_item(item);
                    }
                })(this, ex);
                TK.set_text(h, "Inherited from ");
                h.appendChild(l);
                div.appendChild(h);
                this.build_tables_recursively(id, ex, div);
            }
        }
    }
    
    this.build_table = function (data) {
        // build column order array
        var cols = [];
        if (data.length) {
            var hasname = data[0].hasOwnProperty("name");
            var hasdesc = data[0].hasOwnProperty("description");
            if (hasname) cols.push("name");
            if (hasdesc) cols.push("description");
            for (var key in data[0]) {
                if (!data[0].hasOwnProperty(key)) continue;
                if (hasname && key == "name") continue;
                if (hasdesc && key == "description") continue;
                cols.push(key);
            }
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
            var row = TK.element("tr");
            table.appendChild(row);
            for (var c in cols) {
                var td = TK.element("td");
                if (cols[c] in this.process_cols)
                    td.innerHTML = this.process_text(item[cols[c]]);
                else if (typeof item[cols[c]] == "object")
                    td.appendChild(this.build_table(item[cols[c]]));
                else
                    td.innerHTML = item[cols[c]];
                row.appendChild(td);
            }
        }
        return table;
    }
    
    this.build_example = function (id, div, button) {
        var but = TK.element("div", "toolkit-button")
        but.addEventListener("click", (function (fun) {
            return function () {
                window[fun]();
                setTimeout(function(){
                    document.body.scrollTop = TK.get_id("demo").offsetTop;
                }, 100);
            }
        })("run_" + id));
        TK.set_text(but, button);
        div.appendChild(but);
        var tog = TK.element("div", "toolkit-button");
        TK.set_text(tog, " Code");
        div.appendChild(tog);
        var demo = TK.element("div");
        demo.setAttribute("id", "demo");
        div.appendChild(demo);
        var pre = TK.element("pre", "box", "code");
        var code = TK.element("code");
        code.setAttribute("id", "code");
        TK.set_text(code, window["run_" + id].toString());
        pre.appendChild(code);
        div.appendChild(pre);
        tog.addEventListener("click", (function (pre) {
            return function (e) {
                TK.toggle_class(pre, "show");
                setTimeout(function(){
                    document.body.scrollTop = TK.get_id("code").offsetTop;
                }, 100);
            }
        })(pre));
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
    
    this.bubble_tree = function (item, fun) {
        
    }
    this.process_text = function (text) {
        if (!text) return;
        var r = this.replacements;
        for (var i in r) {
            text = text.replace(i, r[i]);
        }
        return text;
    }
    
    this.show_item = function (item) {
        if (typeof item == "string")
            item = this.find_item(item);
        this._show_item(item);
        this.tm.push(item);
    }
    
    this._show_item = function (item) {
        var i = TK.get_id("item");
        if (i)
            TK.get_id("wrapper").removeChild(i);
        TK.get_id("wrapper").appendChild(this.build_item(item));
        setTimeout(function(){
            document.body.scrollTop = 0;
        }, 100);
        TK.add_class(TK.get_id("navigation"), "hidden");
    }
    
    this.timemachine = function (parent) {
        this.hist = [];
        this.pointer = -1;
        this.push = function (item) {
            if (this.hist[this.hist.length-1] != item)
                this.hist.push(item);
            this.pointer = this.hist.length - 1;
            this.arrows();
        }
        this.back = function () {
            this.pointer = Math.max(-1, this.pointer-1);
            if (this.pointer > -1 && this.hist.length)
                _show_item(this.hist[this.pointer]);
            this.arrows();
        }
        this.next = function () {
            this.pointer = Math.min(this.hist.length-1, this.pointer+1);
            if (this.pointer > -1 && this.hist.length)
                _show_item(this.hist[this.pointer]);
            this.arrows();
        }
        this.arrows = function () {
            TK[(this.pointer > 0 ? "remove" : "add") + "_class"](TK.get_id("back"), "hidden");
            TK[(this.pointer < this.hist.length-1 ? "remove" : "add") + "_class"](TK.get_id("next"), "hidden");
        }
    }
    
    this.init(items);
});
