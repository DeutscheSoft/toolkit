window.addEvent('domready', function(){
    s1 = new State({
        container: $$("#sc_state")[0]
    });
    s2 = new State({
        container: $$("#sc_state")[0],
        color: "#00ff00"
    });
    s3 = new State({
        container: $$("#sc_state")[0],
        color: "blue",
        state: 1
    });
    s4 = new State({
        container: $$("#sc_state")[0],
        color: "blue",
        state: 1,
        "class": "junger"
    });
    s5 = new State({
        container: $$("#sc_state")[0],
        color: "#cc0000",
        state: 1,
        "class": "junger"
    });
    s6 = new State({
        container: $$("#sc_state")[0],
        color: "#ff8800",
        state: 1,
        "class": "junger"
    });
    s7 = new State({
        container: $$("#sc_state")[0],
        color: "grey",
        state: 1,
        "class": "junger"
    });
    s8 = new State({
        container: $$("#sc_state")[0],
        color: "#d00",
        state: 0,
        "class": "on_air"
    });
    var br = new Element("br", {style:"clear:both"}).inject($$("#sc_state")[0])
    __s1();
    __s2();
    __s3();
});
var _s1 = 0;
var _s2 = 0;
var _s3 = 0;

function __s1 () {
    _s1 = !_s1;
    s1.set("state", _s1);
    window.setTimeout(__s1, 1000);
}

function __s2 () {
    if(s2.get("state") >= 1)
        _s2 = -0.02;
    else if(s2.get("state") <= 0)
        _s2 = 0.02;
    s2.set("state", s2.get("state") + _s2);
    window.setTimeout(__s2, 20);
}

function __s3 () {
    _s3 = !_s3;
    s3.set("color", _s3 ? "#def" : "#0af");
    window.setTimeout(__s3, 500);
}