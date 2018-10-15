(function (w) {
var fun;
var navsearch = {};
w.__init__ = function () {
    var nav = document.getElementById("navigation");
    var hash = location.hash.substr(1);
    
    if (hash == "run") {
        setTimeout(run_example, 500);
    } else {
        var match = hash.match(/nav:([0-9]*)/);
        if (match && match.length)
            nav.scrollTop = parseInt(match[1]);
    }
    
    var url = w.location.pathname;
    url = url.substring(url.lastIndexOf('/')+1);
    
    function setscroll (e) {
        if (!TK.get_id("nf_input").value)
            this.href = this.href.split("#")[0] + "#nav:" + parseInt(nav.scrollTop);
    }
    
    if (url) {
        var c = document.querySelectorAll("nav#navigation div.navblock ul.itemsnav a");
        for (var o of c) {
            var href = o.getAttribute("href");
            if (href && href.indexOf(url) >= 0) {
                o.classList.add("active");
                if (!match)
                    nav.scrollTop = o.offsetTop - nav.offsetHeight / 2 + o.offsetHeight / 2;
            }
            
            o.addEventListener("mousedown", setscroll);
            o.addEventListener("touchstart", setscroll);
            var key = o.textContent.toLowerCase();
            while (navsearch[key])
                key += "_";
            navsearch[key] = o;
        };
    }
    
    var nfinput = TK.get_id("nf_input");
    var nfclear = TK.get_id("nf_clear");
    nfinput.addEventListener("keyup", function () {
        filter_nav(this.value.toLowerCase());
    });
    nfclear.addEventListener("click", function () {
        nfinput.value = "";
        filter_nav("");
    });
    
    TK.get_id("h1").appendChild(document.querySelector("header h1").cloneNode(true));
}
window.addEventListener("load", __init__);

w.prepare_example = function () {
    window.addEventListener("load", setup_example.bind(this, document.currentScript));
}

function filter_nav (str) {
    for (var key in navsearch) {
        var display = "block";
        if (str && key.indexOf(str) == -1)
            display = "none";
        navsearch[key].parentElement.style.display = display;
    }
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
    b.setAttribute("class", "closebutton toolkit-icon close");
    b.addEventListener("click", hide_root);
    window.example.root.element.appendChild(b);
    
    fun(window.example.root);

    return false;
}
})(this);
