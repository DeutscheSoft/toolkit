(function (w) {
var fun;
w.__init__ = function () {
    var nav = document.getElementById("navigation");
    var targPos = nav.offsetHeight / 2;
    var hash = location.hash.substr(1);
    if (hash == "run") {
        setTimeout(run_example, 500);
    } else {
        var match = hash.match(/nav:([0-9]*)/);
        if (match && match.length)
            targPos = parseInt(match[1]);
        location.hash = "";
    }
    var url = w.location.pathname;
    url = url.substring(url.lastIndexOf('/')+1);
    if (url) {
        var c = document.querySelectorAll("nav#navigation div.navblock ul.itemsnav a");
        for (var o of c) {
            var href = o.getAttribute("href");
            if (href && href.indexOf(url) >= 0) {
                o.classList.add("active");
                nav.scrollTop = o.offsetTop - targPos + o.offsetHeight / 2;
            }
            function setscroll (e) {
                this.href = this.href.split("#")[0] + "#nav:" + e.pageY;
            }
            o.addEventListener("mousedown", setscroll);
            o.addEventListener("touchstart", setscroll);
        };
    }
}
window.addEventListener("load", __init__);

w.prepare_example = function () {
    window.addEventListener("load", setup_example.bind(this, document.currentScript));
}

function setup_javascript(current, code) {
    var source = code.textContent;
    if (source.match(/^\s*function/)) {
        fun = new Function("", "return "+source)();
    } else return;

    var b = document.createElement("button");
    b.setAttribute("class", "runbutton");
    b.addEventListener("click", run_example);
    b.appendChild(document.createTextNode("Run!"));
    current.parentNode.insertBefore(b, current.nextSibling);

    var h = document.createElement("h2");
    h.appendChild(document.createTextNode("JavaScript"));
    code.parentNode.insertBefore(h, code);
}
function setup_stylesheet(current, code) {
    var style = document.createElement("STYLE");
    style.setAttribute("type", "text/css");
    if (style.styleSheet) style.styleSheet.cssText = code.textContent;
    else style.appendChild(document.createTextNode(code.textContent));
    document.head.appendChild(style);
    var h = document.createElement("h2");
    h.appendChild(document.createTextNode("Stylesheet"));
    code.parentNode.insertBefore(h, code);
}
function setup_example(current) {
    var code = current.parentNode.getElementsByTagName("pre");
    if (!code.length) return;

    for (var i = 0; i < code.length; i++) {
        if (TK.has_class(code[i], "css")) {
            setup_stylesheet(current, code[i]);
        } else {
            setup_javascript(current, code[i]);
        }
    }
}
function run_example () {
    var hide_root = function (e) {
        window.example.root.destroy();
        window.example.blinder.parentNode.removeChild(window.example.blinder);
        window.example = null;
    }
    
    if (window.example && window.example.root)
        window.example.root.destroy();
    window.example = {};
    var blinder = document.createElement("DIV");
    blinder.setAttribute("class", "blinder");
    document.body.appendChild(blinder);
    window.example['blinder'] = blinder;
    window.example['root'] = new TK.Root({
        container: blinder
    });
    var b = document.createElement("button");
    b.setAttribute("class", "closebutton");
    b.addEventListener("click", hide_root);
    b.appendChild(document.createTextNode("Close"));
    window.example.root.element.appendChild(b);
    
    fun(window.example.root);

    return false;
}
})(this);
