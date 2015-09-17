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
    var col = TK.get_class("collapse");
    for (var i = 0; i < col.length; i++) {
        var c = col[i];
        var t = TK.element("div", "toolkit-button");
        TK.set_text(t, c.getAttribute("title") + " (" + (c.children[0].children.length - 1) + ")");
        TK.get_class("buttons", c.parentElement)[0].appendChild(t);
        c.style.display = "none";
        t.addEventListener("click", (function (c) {
            return function (e) { c.style.display = c.style.display ? "" : "none"; }
        })(c));
    }
    var wrp = TK.get_class("wrapper");
    var lis = TK.get_id("wrapper").children;
    for (var i = 0; i < lis.length; i++) {
        var e = lis[i];
        var id  = e.getAttribute("id");
        var cls = e.getAttribute("class");
        if (!id)
            continue;
        
        // SUBMENU
        var n = TK.get_id("navigation");
        if (!TK.get_class(cls, n).length) {
            var _l = TK.element("li");
            var s = TK.element("span");
            var m = TK.element("ul", cls);
            TK.set_text(s, cls.charAt(0).toUpperCase() + cls.substr(1) + "s");
            m.setAttribute("id", cls);
            _l.appendChild(s);
            _l.appendChild(m);
            n.appendChild(_l);
            s.addEventListener("click", (function (m) {
                return function (e) { m.classList.toggle("show"); }
            })(m));
            m.addEventListener("click", (function (m) {
                return function (e) { m.classList.toggle("show"); }
            })(m));
        }
        
        // MENU ENTRY
        var li = TK.element("li");
        var a  = TK.element("a");
        a.setAttribute("href", "#" + id);
        a.setAttribute("style", e.getAttribute("style"));
        TK.set_text(a, id);
        TK.get_id(cls).appendChild(li).appendChild(a);
        
        // HEADLINE
        var h = TK.element("h2");
        TK.set_text(h, id);
        e.insertBefore(h, e.firstChild);
        
        // ANCHOR
        var a = TK.element("a");
        a.setAttribute("name", id);
        e.insertBefore(a, e.firstChild);
        
        // UP BUTTON
        var b = TK.element("a", "button");
        b.setAttribute("href", "#");
        b.setAttribute("style", "float: right; margin: 0 0 24px 24px;");
        TK.set_text(b, "up ⤴");
        e.appendChild(b);
        e.appendChild(TK.element("hr"));
        
        // EXAMPLE STUFF
        id = id.toLowerCase();
        if (typeof window["run_" + id] != "undefined") {
            var bl  = TK.get_class("buttons", e)[0];
            var but = TK.element("div", "toolkit-button");
            TK.set_text(but, "⚄ Example");
            but.addEventListener("click", window["run_" + id]);
            li.addEventListener("click", window["run_" + id]);
            bl.appendChild(but);
            var pre = TK.element("pre", "box", "code");
            var code = TK.element("code");
            TK.set_text(code, window["run_" + id].toString());
            pre.appendChild(code);
            TK.insert_after(pre, bl);
            var tog = TK.element("div", "toolkit-button");
            TK.set_text(tog, "⌨ Code");
            bl.appendChild(tog);
            tog.addEventListener("click", (function (pre) {
                return function (e) {
                    pre.classList.toggle("show");
                }
            })(pre));
        }
    }
    var modex = window.location.hash.substring(1).toLowerCase();
    if (modex == "all") {
        for (var name in window) {
            if (name.substr(0, 4) == "run_") {
                try {
                    window[name]();
                } catch (e) {};
            }
        }
    } else if (modex && typeof window["run_" + modex] != "undefined") {
        window["run_" + modex]();
    }
});
