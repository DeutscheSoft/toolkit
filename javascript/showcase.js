window.addEvent('domready', function(){
    $$(".collapse").each(function (e) {
        var toggle = new Element("div", {"class":"toolkit-button", html:e.get("title") + " (" + (e.getChildren()[0].getChildren().length - 1) + ")"});
        toggle.inject(e.getParent().getChildren(".buttons")[0]);
        var toggleFx = new Fx.Slide(e).hide();
        toggle.addEvent("click", function(){toggleFx.toggle()});
    });
    var c = 0;
    $$("ul.wrapper>li").each( function (e) {
        var id = e.get("id");
        var cls   = e.get("class");
        if(!cls || !id) return;
        var title = id.charAt(0).toUpperCase() + id.substr(1);
        var ctitle = cls.charAt(0).toUpperCase() + cls.substr(1);
        
        // SUBMENU
        if(!$$("#navigation ul." + cls).length) {
            var l = new Element("li").inject($("navigation"));
            var t = new Element("span", {html: ctitle + "s"}).inject(l);
            var m = new Element("ul." + cls, {id: cls}).inject(l);
            var toggleFx = new Fx.Slide(m).hide();
            t.addEvent("click", function(){toggleFx.toggle()});
            m.addEvent("click", function(){toggleFx.toggle()});
        }
        
        // MENU
        var l = new Element("a", {href: "#" + id, html: title}).inject(new Element("li").inject($(cls)));
        
        // HEADLINE
        var h = new Element("h2", {html: "<a name=\"" + id + "\"></a>" + title}).inject(e, "top");
        
        // UP BUTTON
        var up = new Element("a.button", {style:"float: right; margin: 0 0 24px 24px;", href: "#", html: "up ⤴"}).inject(e, "bottom");
        var hr = new Element("hr").inject(e, "bottom");
        
        // EXAMPLE BUTTON
        if(typeof window["run_" + id] != "undefined") {
            var but = new Element("div.toolkit-button", {html: "⚄ Example"}).inject(e.getChildren(".buttons")[0], "top");
            but.addEvent("click", window["run_" + id]);
        }
    });
    var modex = window.location.hash.substring(1);
    if(modex && typeof window["run_" + modex] != "undefined") {
        window["run_" + modex]();
    }
});


// TOGGLE

function run_toggle () {
    if(typeof t != "undefined") {
        t.destroy();
        t = undefined;
        return;
    }
    t = new Toggle({
        container: $("sc_toggle"),
        label: "Mic Active",
        label_active: "Mic Muted",
        icon: "images/icons_big/microphone.png",
        icon_active: "images/icons_big/microphone_muted.png",
        press: 200,
        press_disable: true
    });
}


// BUTTON

function run_button () {
    if(typeof b != "undefined") {
        b.destroy();
        b = undefined;
        return;
    }
    b = new Button({
        container: $("sc_button"),
        label: "Demo Button",
        icon: "images/icons_big/showcase.png"
    });
    b.addEvent("click", function () { alert("clicked") });
}


// SCALE

function run_scale () {
    if(typeof svl != "undefined") {
        svl.destroy();
        svr.destroy();
        sht.destroy();
        shb.destroy();
        svl = undefined;
        $("sc_scale").removeClass("box");
        return;
    }
    $("sc_scale").addClass("box");
    svl = new Scale({
        container: $("sc_scale"),
        layout: 1,
        division: 1,
        levels: [1, 6, 12],
        min: -96,
        max: +24,
        base: 0,
        size: 200,
        id: "sc_scale_v_l"
    })
    svr = new Scale({
        container: $("sc_scale"),
        layout: 2,
        division: 1,
        levels: [1, 6, 12],
        min: -96,
        max: +24,
        base: 0,
        size: 200,
        id: "sc_scale_v_r"
    })
    sht = new Scale({
        container: $("sc_scale"),
        layout: 3,
        division: 1,
        levels: [1, 6, 12],
        min: -24,
        max: +24,
        base: 0,
        size: 750,
        gap_labels: 50,
        id: "sc_scale_h_t"
    })
    shb = new Scale({
        container: $("sc_scale"),
        layout: 4,
        division: 1,
        levels: [1, 6, 12],
        min: -24,
        max: +24,
        base: 0,
        size: 750,
        gap_labels: 50,
        id: "sc_scale_h_b"
    })
}


// CHART

function run_chart () {
    if(typeof c != "undefined") {
        c.destroy();
        c = undefined;
        $("sc_chart").removeClass("box");
        return;
    }
    $("sc_chart").addClass("box");
    c = new Chart({
        width: 908,
        height: 300,
        container: $("sc_chart"),
        mode_x: 1,
        mode_y: 1,
        grid_x: [{pos:0.0, label:"0"},
                 {pos:0.1},
                 {pos:0.2, label:"20"},
                 {pos:0.3},
                 {pos:0.4, label:"40"},
                 {pos:0.5, label: "50", color: "rgba(255,255,255,0.66)"},
                 {pos:0.6, label:"60"},
                 {pos:0.7},
                 {pos:0.8, label:"80"},
                 {pos:0.9},
                 {pos:1.0, label:"100"}],
        grid_y: [{pos:0.0, label:"0"},
                 {pos:0.2, label:"20"},
                 {pos:0.4, label:"40"},
                 {pos:0.5, label: "50", color: "rgba(255,255,255,0.66)"},
                 {pos:0.6, label:"60"},
                 {pos:0.8, label:"80"},
                 {pos:1.0, label:"100"}]
        
    });
    g1 = c.add_graph({
        dots: [{x:0.0, y:0.0},
               {x:0.1, y:1.0},
               {x:0.2, y:0.5},
               {x:0.3, y:0.7},
               {x:0.4, y:0.2},
               {x:0.5, y:0.8},
               {x:0.6, y:0.9},
               {x:0.7, y:0.5},
               {x:0.8, y:0.6},
               {x:0.9, y:0.2},
               {x:1.0, y:0.0}
        ],
        type: "H3",
        mode: 1
    });
    g2 = c.add_graph({
        dots: [{x:0.0, y:0.5},
               {x:0.2, y:0.1},
               {x:0.4, y:0.5},
               {x:0.6, y:0.4},
               {x:0.8, y:0.3},
               {x:1.0, y:0.9}
        ],
        color: "#dd0000"
    });
}

// FREQUENCY RESPONSE

function run_frequencyresponse () {
    if(typeof fr != "undefined") {
        fr.destroy();
        fr = undefined;
        $("sc_frequencyresponse").removeClass("box");
        return;
    }
    $("sc_frequencyresponse").addClass("box");
    fr = new FrequencyResponse({
        width: 908,
        height: 300,
        container: $("sc_frequencyresponse"),
        db_grid: 12
    });
    g3 = fr.add_graph({
        dots: [{x:20, y:0.0},
               {x:100, y:24},
               {x:200, y:-12},
               {x:500, y:0},
               {x:1000, y:0},
               {x:4000, y:30},
               {x:20000, y:-36}
        ],
        type: "H4",
        mode: 0
    });
}

// STATE

function run_state () {
    if(typeof s1 != "undefined") {
        s1.destroy();
        s2.destroy();
        s3.destroy();
        s4.destroy();
        s5.destroy();
        s6.destroy();
        s7.destroy();
        s8.destroy();
        s1 = undefined;
        $("sc_state").empty();
        $("sc_state").removeClass("box");
        return;
    }
    $("sc_state").addClass("box");
    s1 = new State({
        container: $("sc_state")
    });
    s2 = new State({
        container: $("sc_state"),
        color: "#00ff00"
    });
    s3 = new State({
        container: $("sc_state"),
        color: "blue",
        state: 1
    });
    s4 = new State({
        container: $("sc_state"),
        color: "blue",
        state: 1,
        "class": "junger"
    });
    s5 = new State({
        container: $("sc_state"),
        color: "#cc0000",
        state: 1,
        "class": "junger"
    });
    s6 = new State({
        container: $("sc_state"),
        color: "#ff8800",
        state: 1,
        "class": "junger"
    });
    s7 = new State({
        container: $("sc_state"),
        color: "grey",
        state: 1,
        "class": "junger"
    });
    s8 = new State({
        container: $("sc_state"),
        color: "#d00",
        state: 0,
        "class": "on_air"
    });
    var br = new Element("br", {style:"clear:both"}).inject($$("#sc_state")[0])
    __s1();
    __s2();
    __s3();
}
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


// METER BASE

function run_meterbase () {
    if(typeof mbvl != "undefined") {
        mbvl.destroy();
        mbvr.destroy();
        mbhb.destroy();
        mbht.destroy();
        mbvl = undefined;
        return;
    }
    mbvl = new MeterBase({
        container: $$("#sc_meterbase")[0],
        layout: 2,
        segment: 2,
        min: -96,
        max: 24,
        value: 18,
        scale_base: 0,
        title: "left",
        show_title: true,
        show_label: true,
        gradient: {"-96": "#001f83", "-0.1": "#008bea", "0": "#ff6000", "24": "#ffa000"},
        levels: [1, 6, 12],
        gap_labels: 30
    });
    mbvr = new MeterBase({
        container: $$("#sc_meterbase")[0],
        layout: 1,
        segment: 2,
        min: -96,
        max: 24,
        value: 6,
        scale_base: 0,
        title: "right",
        show_title: true,
        show_label: true,
        gradient: {"-96": "#001f83", "-0.1": "#008bea", "0": "#ff6000", "24": "#ffa000"},
        levels: [1, 6, 12],
        gap_labels: 30
    });
    mbhb = new MeterBase({
        container: $$("#sc_meterbase")[0],
        layout: 4,
        segment: 2,
        min: -15,
        max: 15,
        value: -6.25,
        base: 0,
        scale_base: 0,
        title: "left",
        show_title: true,
        show_label: true,
        gradient: {"-15": "#001f83", "0": "#008bea", "15": "#001f83"},
        levels: [1, 5]
    });
    mbht = new MeterBase({
        container: $$("#sc_meterbase")[0],
        layout: 3,
        segment: 2,
        min: -15,
        max: 15,
        value: 12.5,
        base: 0,
        scale_base: 0,
        title: "right",
        show_title: true,
        show_label: true,
        gradient: {"-15": "#001f83", "0": "#008bea", "15": "#001f83"},
        levels: [1, 5]
    });
}


// LEVEL METER

function run_levelmeter () {
    if(typeof meters != "undefined" && typeof meters.mvr != "undefined") {
        for(var i in meters) {
            meters[i].destroy();
            meters[i] = undefined;
        }
        $("sc_levelmeter_buttons").setStyle("display", "none");
        return;
    }
    $("sc_levelmeter_buttons").setStyle("display", "block");
    meters = {
        mvr: new LevelMeter({
            layout: 2,
            reverse: false,
            segment: 2,
            min: -96,
            max: 24,
            value: -96,
            scale_base: 0,
            falling: 2,
            title: "mvr",
            show_title: true,
            show_peak: true,
            auto_peak: 20000,
            peak_label: 500,
            show_label: true,
            show_clip: true,
            auto_clip: 1000,
            show_hold: false,
            auto_hold: 2000,
            hold_size: 2,
            clipping: 0,
            container: $$("#sc_levelmeter")[0],
//                         background: "#13963e"
            gradient: {"-96": "#001f83", "-0.1": "#008bea", "0": "#ff6000", "24": "#ffa000"},
            levels: [1, 6, 12]
        }),
        mvl: new LevelMeter({
            reverse: false,
            segment: 2,
            min: -96,
            max: 24,
            value: -96,
            scale_base: 0,
            falling: 2,
            title: "mvl",
            show_title: true,
            show_peak: true,
            auto_peak: 20000,
            peak_label: 500,
            show_label: true,
            show_clip: true,
            auto_clip: 1000,
            show_hold: false,
            auto_hold: 2000,
            hold_size: 2,
            clipping: 0,
            container: $$("#sc_levelmeter")[0],
//                         background: "#13963e"
            gradient: {"-96": "#001f83", "-0.1": "#008bea", "0": "#ff6000", "24": "#ffa000"},
            levels: [1, 6, 12]
        }),
        
        mvrr: new LevelMeter({
            layout: 2,
            reverse: true,
            segment: 2,
            min: -24,
            max: 24,
            value: 0,
            base: 0,
            falling: 0.5,
            title: "mvrr",
            show_title: true,
            peak_label: 500,
            show_label: true,
            show_hold: false,
            auto_hold: 2000,
            hold_size: 2,
            container: $$("#sc_levelmeter")[0],
//                         background: "#13963e"
            gradient: {"-24": "#001f83", "24": "#008bea"},
            levels: [1, 6, 12]
        }),
        mvlr: new LevelMeter({
            reverse: true,
            segment: 2,
            min: -24,
            max: 24,
            value: 0,
            base: 0,
            falling: 0.5,
            title: "mvlr",
            show_title: true,
            peak_label: 500,
            show_label: true,
            show_hold: false,
            auto_hold: 2000,
            hold_size: 2,
            container: $$("#sc_levelmeter")[0],
//                         background: "#13963e"
            gradient: {"0": "#001f83", "24": "#008bea"},
            levels: [1, 6, 12]
        }),
        
        mhb: new LevelMeter({
            segment: 2,
            layout: 4,
            min: -96,
            max: 24,
            value: -96,
            scale_base: 0,
            falling: 2,
            title: "mhb",
            show_title: true,
            show_peak: true,
            auto_peak: 20000,
            peak_label: 500,
            show_label: true,
            show_clip: true,
            auto_clip: 1000,
            show_hold: false,
            auto_hold: 2000,
            hold_size: 2,
            clipping: 0,
            container: $$("#sc_levelmeter")[0],
//                         background: "#13963e"
            gradient: {"-96": "#001f83", "-0.1": "#008bea", "0": "#ff6000", "24": "#ffa000"},
            levels: [1, 6, 12]
        }),
        mht: new LevelMeter({
            segment: 2,
            layout: 3,
            min: -96,
            max: 24,
            value: -96,
            scale_base: 0,
            falling: 2,
            title: "mht",
            show_title: true,
            show_peak: true,
            auto_peak: 20000,
            peak_label: 500,
            show_label: true,
            show_clip: true,
            auto_clip: 1000,
            show_hold: false,
            auto_hold: 2000,
            hold_size: 2,
            clipping: 0,
            container: $$("#sc_levelmeter")[0],
//                         background: "#13963e"
            gradient: {"-96": "#001f83", "-0.1": "#008bea", "0": "#ff6000", "24": "#ffa000"},
            levels: [1, 6, 12]
        }),
        
        mhbr: new LevelMeter({
            segment: 2,
            layout: 4,
            reverse: true,
            min: 0,
            max: 24,
            value: 0,
            falling: 0.5,
            title: "mhbr",
            show_title: true,
            show_peak: true,
            auto_peak: 20000,
            peak_label: 500,
            show_label: true,
            show_clip: true,
            auto_clip: 1000,
            show_hold: false,
            auto_hold: 2000,
            hold_size: 2,
            clipping: 24,
            container: $$("#sc_levelmeter")[0],
//                         background: "#13963e"
            gradient: {"0": "#001f83", "24": "#008bea"},
            levels: [1, 6, 12]
        }),
        mhtr: new LevelMeter({
            segment: 2,
            reverse: true,
            layout: 3,
            min: 0,
            max: 25,
            value: 0,
            falling: 0.5,
            title: "mhtr",
            show_title: true,
            show_peak: true,
            auto_peak: 20000,
            peak_label: 500,
            show_label: true,
            show_clip: true,
            auto_clip: 1000,
            show_hold: false,
            auto_hold: 2000,
            hold_size: 2,
            clipping: 24,
            container: $$("#sc_levelmeter")[0],
//                         background: "#13963e"
            gradient: {"0": "#001f83", "24": "#008bea"},
            levels: [1, 5, 10]
        })
    }
}

running = false
function run () {
    if(running) return;
    running = true;
    run1();
    run2();
    run3();
    run4();
    run5();
    run6();
    run7();
    run8();
}
function run1 () {
    var v = Math.random() * 118 - 96;
    meters.mvl.set("value", v);
    if(running) window.setTimeout(run1, Math.random() * 500); 
}
function run2 () {
    var v = Math.random() * 118 - 96;
    meters.mvr.set("value", v);
    if(running) window.setTimeout(run2, Math.random() * 500); 
}
function run3 () {
    var v = Math.random() * 118 - 96;
    meters.mht.set("value", v);
    if(running) window.setTimeout(run3, Math.random() * 500); 
}
function run4 () {
    var v = Math.random() * 118 - 96;
    meters.mhb.set("value", v);
    if(running) window.setTimeout(run4, Math.random() * 500); 
}
function run5 () {
    var v = Math.random() * 44 - 22;
    meters.mvlr.set("value", v);
    if(running) window.setTimeout(run5, Math.random() * 500); 
}
function run6 () {
    var v = Math.random() * 44 - 22;
    meters.mvrr.set("value", v);
    if(running) window.setTimeout(run6, Math.random() * 500); 
}
function run7 () {
    var v = Math.random() * 22;
    meters.mhtr.set("value", v);
    if(running) window.setTimeout(run7, Math.random() * 500); 
}
function run8 () {
    var v = Math.random() * 22;
    meters.mhbr.set("value", v);
    if(running) window.setTimeout(run8, Math.random() * 500); 
}
    
function reset () {
    for(i in meters) {
        meters[i].reset_peak();
    }
}
function hold (h) {
    h = !meters.mvr.get("show_hold");
    for(i in meters) {
        meters[i].set("show_hold", h);
    }
}