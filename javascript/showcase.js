window.addEvent('domready', function () {
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
        if (!cls || !id) return;
        id = id.toLowerCase();
        var title = e.get("id");
        var ctitle = cls.charAt(0).toUpperCase() + cls.substr(1);
        
        // SUBMENU
        if (!$$("#navigation ul." + cls).length) {
            var l = new Element("li").inject($("navigation"));
            var t = new Element("span", {html: ctitle + "s"}).inject(l);
            var m = new Element("ul." + cls, {id: cls}).inject(l);
            var toggleFx = new Fx.Slide(m, {duration:300}).hide();
            t.addEvent("click", function(){toggleFx.toggle()});
            m.addEvent("click", function(){toggleFx.toggle()});
        }
        
        // MENU
        var l = new Element("a", {href: "#" + id, html: title, style: e.get("style")}).inject(new Element("li").inject($(cls)));
        
        // HEADLINE
        var h = new Element("h2", {html: "<a name=\"" + id + "\"></a>" + title}).inject(e, "top");
        
        // UP BUTTON
        var up = new Element("a.button", {style:"float: right; margin: 0 0 24px 24px;", href: "#", html: "up ⤴"}).inject(e, "bottom");
        var hr = new Element("hr").inject(e, "bottom");
        
        // EXAMPLE STUFF
        if (typeof window["run_" + id] != "undefined") {
            var but = new Element("div.toolkit-button", {html: "⚄ Example"}).inject(e.getChildren(".buttons")[0]);
            but.addEvent("click", window["run_" + id]);
            l.addEvent("click", window["run_" + id]);
            
            var pre = new Element("pre.box", {html: "<code data-language='python'>" + window["run_" + id].toString() + "</code>"}).inject(e.getChildren(".buttons")[0], "after");
            var tog = new Element("div.toolkit-button", {html: "⌨ Code"}).inject(e.getChildren(".buttons")[0]);
            var togFx = new Fx.Slide(pre).hide();
            tog.addEvent("click", function(){togFx.toggle()});
        }
    });
    var modex = window.location.hash.substring(1);
    if (modex && typeof window["run_" + modex] != "undefined") {
        window["run_" + modex]();
    }
});


// KNOB
function run_knob () {
    if (typeof knob != "undefined") {
        knob.destroy();
        knob = undefined;
        return;
    }
    knob = new Knob({
        container: $("sc_knob"),
        min: -96,
        max: 24,
        scale: _TOOLKIT_LINEAR,
        value: 0,
        markers: [
            {from: 0, to: 24}
        ],
        dots: [
            {pos: -96}, {pos: -84}, {pos: -72}, {pos: -60}, {pos: -48}, {pos: -36}, {pos: -24},
            {pos: -12}, {pos: 0, color: "#c00"}, {pos: 12}, {pos: 24}
        ],
        labels: [
            {pos: -96}, {pos: 24, label: "+24"}
        ],
        label: {align: _TOOLKIT_OUTER, margin: 2}
    });
}




// WINDOW

function run_window () {
    if (typeof winbutton != "undefined") {
        winbutton.destroy();
        winbutton = undefined;
        return;
    }
    winbutton = new Button({
        container: $("sc_window"),
        label: "Demo Window",
        icon: "images/icons_big/window.png"
    });
    winbutton.addEvent("click", function () { 
        win = new Window({
            container: $$("body")[0],
            height: 233,
            width: 640,
            open: _TOOLKIT_CENTER,
            title: "Example Window",
            status: "Integrity of the Cloud at 112%! Hull breach impending!",
            icon: "images/toolkit_win_icon.png",
            header_left: _TOOLKIT_ICON,
            header_right: [_TOOLKIT_MAX_X, _TOOLKIT_MAX_Y, _TOOLKIT_MAX,
                           _TOOLKIT_MINIMIZE, _TOOLKIT_SHRINK, _TOOLKIT_CLOSE],
            footer_left: _TOOLKIT_STATUS,
            fixed: true,
            content: "<div style='margin: 6px'><img src=images/junger_toolkit.png "
                   + "style=\"float: left; margin-right: 20px;\">"
                   + "Thanks for testing the JUNGER toolkit. We hope you like "
                   + "the functionality, complexity and style. If you have any "
                   + "sugestions or bug reports, please let us know.</div>"
        });
        var ok = new Button({
            label: "OK",
            container: win._content,
            onClick: win.destroy.bind(win)
        });
        ok.setStyles({
            position: "absolute",
            bottom: 0,
            right: 0
        });
    });
}


// CLOCK

function run_clock () {
    if (typeof clock != "undefined") {
        clock.destroy();
        clock = undefined;
        return;
    }
    clock = new Clock({
        container: $("sc_clock"),
        timeout: 10
    });
}


// GAUGE
function run_gauge () {
    if (typeof gauge != "undefined") {
        gauge[0].destroy();
        gauge[1].destroy();
        gauge[2].destroy();
        gauge[3].destroy();
        gauge[4].destroy();
        gauge[5].destroy();
        gauge = undefined;
        $("sc_gauge").removeClass("box");
        return;
    }
    $("sc_gauge").addClass("box");
    gauge = [];
    
    gauge[0] = new Gauge({
        id: "gauge0",
        min:0,
        max:10,
        value: 3,
        size: 116,
        width: 100,
        height: 55,
        start: 195,
        basis: 150,
        x:-10,
        y:-10,
        margin: 20,
        thickness: 27,
        show_value: false,
        markers: [{from:0, to:2, margin:20, thickness: 5, color: "rgba(255,0,0,0.8)"}],
        label: {align:_TOOLKIT_OUTER, margin: 20},
        show_hand: true,
        hand: {margin: 29, length: 21, width: 2, color:"white"},
        container: $("sc_gauge"),
        labels: [{pos:0},{pos:2},{pos:4},{pos:6},{pos:8},{pos:10}]
    });
    gauge[1] = new Gauge({
        id: "gauge1",
        min:0,
        max:60,
        margin: 20,
        value:22,
        start: 270,
        basis: 360,
        title: {margin:38,title:"t/sec"},
        dot: {width: 1, length: 1, margin: 17},
        label: {align:_TOOLKIT_OUTER, margin:17},
        show_hand: false,
        container: $("sc_gauge"),
        dots:[{pos:0},{pos:5},{pos:10},{pos:15},{pos:20},{pos:25},{pos:30},
              {pos:35},{pos:40},{pos:45}, {pos:50},{pos:55}],
        labels: [{pos:0},{pos:5},{pos:10},{pos:15},{pos:20},{pos:30},{pos:40},{pos:50}]
    });
    gauge[2] = new Gauge({
        id: "gauge2",
        min:-60,
        max:12,
        value:-10,
        title: "dBu",
        container: $("sc_gauge"),
        markers: [{from:0, to:12}],
        dots:[{pos:-60},{pos:-50},{pos:-40},{pos:-30},{pos:-20},{pos:-10},
              {pos:0},{pos:5},{pos:10},{pos:120}],
        labels: [{pos:-60},{pos:-40},{pos:-20},{pos:0,label:"0 dB"},{pos:12,label:"+12"}]
    });
    gauge[3] = new Gauge({
        id: "gauge3",
        min:-100,
        max:100,
        value:50,
        base: 0,
        title: "Temp °C",
        container: $("sc_gauge"),
        label: {format: function (val) { return val + "°"; }},
        markers: [{from:80, to:100}, {from:-80, to:-100}],
        dots:[{pos:0},{pos:10},{pos:20},{pos:30},{pos:40},{pos:50},{pos:60},{pos:70},{pos:80},{pos:90},{pos:100},
              {pos:-10},{pos:-20},{pos:-30},{pos:-40},{pos:-50},{pos:-60},{pos:-70},{pos:-80},{pos:-90},{pos:-100}],
        labels: [{pos:0, label:"0"},{pos:20},{pos:60},{pos:40},{pos:80},{pos:100},
                 {pos:-20},{pos:-60},{pos:-40},{pos:-80},{pos:-100}]
    });
    gauge[4] = new Gauge({
        id: "gauge4",
        "class": "inset",
        min:-40,
        max:12,
        value:-25,
        width: 170,
        height: 70,
        size: 350,
        start: 245,
        basis: 50,
        x: -90,
        y: 5,
        margin: 20,
        thickness: 1.5,
        dot: {margin: 12, width: 1, length: 10},
        marker: {margin: 11, thickness: 10},
        hand: {margin: 12, length:70, width:2},
        label: {margin: 12, align: _TOOLKIT_OUTER},
        title: {margin: 46, pos: 270, title: "VU"},
        show_value: false,
        container: $("sc_gauge"),
        markers: [{from:0, to:12},
                  {from:-20, to:0, margin: 23, thickness: 3}
        ],
        dots:[{pos:-60},{pos:-50},{pos:-40},{pos:-30},{pos:-20},{pos:-10},
              {pos:0},{pos:5},{pos:10},{pos:120},
              {pos:-20, margin:23, length: 7},
              {pos:-10, margin:23, length: 7},
              {pos:0, margin:23, length: 7}
        ],
        labels: [{pos:-40},{pos:-20},{pos:0,label:"0 dB"},{pos:12,label:"+12"},
            {pos: -20, label:"0", margin: 29, align:_TOOLKIT_INNER},
            {pos: -10, label:"50", margin: 29, align:_TOOLKIT_INNER},
            {pos: -0, label:"100%", margin: 29, align:_TOOLKIT_INNER}
        ]
    });
    gauge[5] = new Gauge({
        id: "gauge5",
        "class": "inset",
        min:-40,
        max:12,
        value:-25,
        width: 170,
        height: 70,
        size: 350,
        start: 245,
        basis: 50,
        x: -90,
        y: 5,
        margin: 20,
        thickness: 1.5,
        dot: {margin: 12, width: 1, length: 10},
        marker: {margin: 11, thickness: 10},
        hand: {margin: 12, length:70, width:2},
        label: {margin: 12, align: _TOOLKIT_OUTER},
        title: {margin: 46, pos: 270, title: "VU"},
        show_value: false,
        container: $("sc_gauge"),
        markers: [{from:0, to:12},
                  {from:-20, to:0, margin: 23, thickness: 3, color:"rgba(0,0,0,0.8)"}
        ],
        dots:[{pos:-60},{pos:-50},{pos:-40},{pos:-30},{pos:-20},{pos:-10},
              {pos:0},{pos:5},{pos:10},{pos:120},
              {pos:-20, margin:23, length: 7},
              {pos:-10, margin:23, length: 7},
              {pos:0, margin:23, length: 7}
        ],
        labels: [{pos:-40,label:"-40"},{pos:-20,label:"-20"},{pos:0,label:"0 dB"},{pos:12,label:"+12"},
            {pos: -20, label:"0", margin: 29, align:_TOOLKIT_INNER},
            {pos: -10, label:"50", margin: 29, align:_TOOLKIT_INNER},
            {pos: -0, label:"100%", margin: 29, align:_TOOLKIT_INNER}
        ]
    });
}


// TOGGLE

function run_toggle () {
    if (typeof toggle != "undefined") {
        toggle.destroy();
        toggle = undefined;
        press.destroy();
        press = undefined;
        return;
    }
    toggle = new Toggle({
        container: $("sc_toggle"),
        label: "Mic Active",
        label_active: "Mic Muted",
        icon: "images/icons_big/microphone.png",
        icon_active: "images/icons_big/microphone_muted.png"
    });
    press = new Toggle({
        container: $("sc_toggle"),
        label: "Mic Active",
        label_active: "Mic Muted",
        icon: "images/icons_big/microphone.png",
        icon_active: "images/icons_big/microphone_muted.png",
        press: 200,
        toggle: true
    });
}


// BUTTON

function run_button () {
    if (typeof button != "undefined") {
        button.destroy();
        button = undefined;
        return;
    }
    button = new Button({
        container: $("sc_button"),
        label: "Demo Button",
        icon: "images/icons_big/showcase.png"
    });
    button.addEvent("click", function () { alert("clicked") });
}

// VALUE BUTTON

function run_valuebutton () {
    if (typeof thres != "undefined") {
        thres.destroy();
        thres = undefined;
        ratio.destroy();
        ratio = undefined;
        attack.destroy();
        attack = undefined;
        release.destroy();
        release = undefined;
        $("sc_vbutton").set("html", "");
        return;
    }
    thres = new ValueButton({
        container: $("sc_vbutton"),
        label: "Threshold",
        icon: "images/icons_small/threshold.png",
        value_position: "icon",
        value_format: function (val) { return sprintf("%.1f dB", val); },
        min: -96,
        max: 24,
        step: 1,
        basis: 600,
        shift_up: 4,
        shift_down: 0.25,
        value: 0
    });
    attack = new ValueButton({
        "class": "attack",
        container: $("sc_vbutton"),
        label: "Attack",
        icon: "images/icons_small/attack.png",
        value_position: "icon",
        value_format: function (val) { return sprintf("%.1f ms", val); },
        min: 1,
        max: 1000,
        step: 1,
        basis: 600,
        shift_up: 4,
        shift_down: 0.25,
        value: 100,
        scale: _TOOLKIT_FREQ
    });
    
    var br = new Element("br").inject($("sc_vbutton"));
    
    ratio = new ValueButton({
        container: $("sc_vbutton"),
        label: "Ratio",
        icon: "images/icons_small/ratio.png",
        value_position: "icon",
        value_format: function (val) { return sprintf("%.1f : 1", val); },
        min: 1,
        max: 10,
        step: 1,
        basis: 600,
        shift_up: 4,
        shift_down: 0.25,
        value: 2
    });
    
    release = new ValueButton({
        container: $("sc_vbutton"),
        label: "Release",
        icon: "images/icons_small/release.png",
        value_position: "icon",
        value_format: function (val) { return sprintf("%.1f ms", val); },
        min: 1,
        max: 1000,
        step: 1,
        basis: 600,
        shift_up: 4,
        shift_down: 0.25,
        value: 100,
        scale: _TOOLKIT_FREQ
    });
}

// SCALE

function run_scale () {
    if (typeof scales != "undefined") {
        scales.left.destroy();
        scales.right.destroy();
        scales.top.destroy();
        scales.bottom.destroy();
        scales = undefined;
        $("sc_scale").removeClass("box");
        return;
    }
    $("sc_scale").addClass("box");
    scales = {};
    scales.left = new Scale({
        container: $("sc_scale"),
        layout: _TOOLKIT_LEFT,
        division: 1,
        levels: [1, 6, 12],
        min: -96,
        max: +24,
        base: 0,
        basis: 200,
        id: "sc_scale_v_l"
    })
    scales.right = new Scale({
        container: $("sc_scale"),
        layout: _TOOLKIT_RIGHT,
        division: 1,
        levels: [1, 6, 12],
        min: -96,
        max: +24,
        base: 0,
        basis: 200,
        id: "sc_scale_v_r"
    })
    scales.top = new Scale({
        container: $("sc_scale"),
        layout: _TOOLKIT_TOP,
        division: 1,
        levels: [1, 6, 12],
        min: -24,
        max: +24,
        base: 0,
        basis: 750,
        gap_labels: 50,
        id: "sc_scale_h_t"
    })
    scales.bottom = new Scale({
        container: $("sc_scale"),
        layout: _TOOLKIT_BOTTOM,
        division: 1,
        levels: [1, 6, 12],
        min: -24,
        max: +24,
        base: 0,
        basis: 750,
        gap_labels: 50,
        id: "sc_scale_h_b"
    })
}


// CHART

function run_chart () {
    if (typeof chart != "undefined") {
        chart.destroy();
        chart = undefined;
        $("sc_chart").removeClass("box");
        return;
    }
    $("sc_chart").addClass("box");
    chart = new Chart({
        range_x: {basis:908, scale: _TOOLKIT_LINEAR, min:0, max:1},
        range_y: {basis:300, scale: _TOOLKIT_LINEAR, min:0, max:1},
        container: $("sc_chart"),
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
                 {pos:1.0, label:"100"}],
        key: _TOOLKIT_TOP_LEFT,
        title: "Chart Example",
        title_position: _TOOLKIT_TOP_RIGHT
    });
    cgraph1 = chart.add_graph({
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
        mode: _TOOLKIT_BOTTOM,
        key:  "foo"
    });
    cgraph2 = chart.add_graph({
        dots: [{x:0.0, y:0.5},
               {x:0.2, y:0.1},
               {x:0.4, y:0.5},
               {x:0.6, y:0.4},
               {x:0.8, y:0.3},
               {x:1.0, y:0.9}
        ],
        color: "#dd0000",
        key:   "bar"
    });
    cgraph3 = chart.add_graph({
        dots: [{x:0.0, y:0.1},
               {x:0.2, y:0.5},
               {x:0.4, y:0.7},
               {x:0.6, y:0.3},
               {x:0.8, y:0.5},
               {x:1.0, y:0.1}
        ],
        color: "#ffffff",
        key:   "baz"
    });
    repositionSVGs()
}

// FREQUENCY RESPONSE

function run_frequencyresponse () {
    if (typeof fr != "undefined") {
        fr.destroy();
        fr = undefined;
        $("sc_frequencyresponse").removeClass("box");
        return;
    }
    $("sc_frequencyresponse").addClass("box");
    fr = new FrequencyResponse({
        width: 906,
        height: 300,
        container: $("sc_frequencyresponse"),
        db_grid: 12
    });
    frgraph = fr.add_graph({
        dots: [{x:20, y:0.0},
               {x:100, y:24},
               {x:200, y:-12},
               {x:500, y:0},
               {x:1000, y:0},
               {x:4000, y:30},
               {x:20000, y:-36}
        ],
        type: "H4",
        mode: _TOOLKIT_LINE
    });
    repositionSVGs()
}

// DYNAMICS

function run_dynamics () {
    if (typeof comp != "undefined") {
        comp.destroy();
        comp = undefined;
        gate.destroy();
        gate = undefined;
        comp2.destroy();
        comp2 = undefined;
        $("sc_dynamics").removeClass("box");
        return;
    }
    $("sc_dynamics").addClass("box");
    comp = new Dynamics({
        size: 298,
        container: $("sc_dynamics")
    });
    gcomp = comp.add_graph({
        dots: [{x:-96, y:-72},
               {x:-24, y:0},
               {x:24, y: 12},
        ],
        mode: _TOOLKIT_LINE
    });
    gate = new Dynamics({
        size: 298,
        container: $("sc_dynamics")
    });
    ggate = gate.add_graph({
        dots: [{x:-48, y:-96},
               {x:-24, y:-24},
               {x:24, y: 24},
        ],
        mode: _TOOLKIT_LINE
    });
    comp2 = new Dynamics({
        size: 298,
        container: $("sc_dynamics")
    });
    gcomp2 = comp2.add_graph({
        dots: [{x:-60, y:-96},
               {x:-48, y:-48},
               {x:-36, y:-24},
               {x:-12, y:-12},
               {x:24, y:-8}
        ],
        mode: _TOOLKIT_LINE
    });
    repositionSVGs()
}



// EQUALIZER
function run_equalizer () {
    if (typeof eq != "undefined") {
        eq.destroy();
        eq = undefined;
        $("sc_equalizer").removeClass("box");
        return;
    }
    $("sc_equalizer").addClass("box");
    eq = new Equalizer({
        width: 908,
        height: 300,
        depth: 120,
        container: $("sc_equalizer"),
        db_grid: 12,
        range_z: {min: 0.4, max: 4, step: 0.1, shift_up: 10, shift_down: 0.2, reverse: true}
    });
    bands = [
        eq.add_band({x:600, y:-12, z:3, type:_TOOLKIT_PARAMETRIC,
                     z_handle: _TOOLKIT_RIGHT, title:"Band 1", z_min: 0.4, z_max: 4}),
        eq.add_band({x:2000, y:12, z:1, type:_TOOLKIT_PARAMETRIC,
                     z_handle: _TOOLKIT_RIGHT, title:"Band 1", z_min: 0.4, z_max: 4}),
        eq.add_band({x:200, y:-12, z:1, type:_TOOLKIT_LOWSHELF,
                     z_handle: _TOOLKIT_RIGHT, title:"Low Shelf",
                     preferences: [_TOOLKIT_TOP_RIGHT, _TOOLKIT_TOP, _TOOLKIT_TOP_LEFT,
                                   _TOOLKIT_RIGHT, _TOOLKIT_CENTER, _TOOLKIT_LEFT,
                                   _TOOLKIT_BOTTOM_RIGHT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_LEFT],
                     z_min: 0.4, z_max: 4}),
        eq.add_band({x:7000, y: 12, z:1, type:_TOOLKIT_HIGHSHELF,
                     z_handle: _TOOLKIT_LEFT, title:"High Shelf",
                     preferences: [_TOOLKIT_TOP_LEFT, _TOOLKIT_TOP, _TOOLKIT_TOP_RIGHT,
                                   _TOOLKIT_LEFT, _TOOLKIT_CENTER, _TOOLKIT_RIGHT,
                                   _TOOLKIT_BOTTOM_LEFT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_RIGHT],
                     z_min: 0.4, z_max: 4}),
        eq.add_band({x:40, z: 1, type:_TOOLKIT_HP2, title:"High Pass",
                     preferences: [_TOOLKIT_TOP_RIGHT, _TOOLKIT_TOP, _TOOLKIT_TOP_LEFT,
                                   _TOOLKIT_RIGHT, _TOOLKIT_CENTER, _TOOLKIT_LEFT,
                                   _TOOLKIT_BOTTOM_RIGHT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_LEFT],
                     label: function (title, x, y, z) { return sprintf("%s\n%d Hz", title, x); } }),
        eq.add_band({x:15000, z: 1, type:_TOOLKIT_LP4, title:"Low Pass",
                     preferences: [_TOOLKIT_TOP_LEFT, _TOOLKIT_TOP, _TOOLKIT_TOP_RIGHT,
                                   _TOOLKIT_LEFT, _TOOLKIT_CENTER, _TOOLKIT_RIGHT,
                                   _TOOLKIT_BOTTOM_LEFT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_RIGHT],
                     label: function (title, x, y, z) { return sprintf("%s\n%d Hz", title, x); } })
    ]
    repositionSVGs()
}


// RESPONSE HANDLER
function run_responsehandler () {
    if (typeof rh != "undefined") {
        rh.destroy();
        rh = undefined;
        $("sc_responsehandler").removeClass("box");
        return;
    }
    $("sc_responsehandler").addClass("box");
    rh = new ResponseHandler({
        width: 908,
        height: 300,
        depth: 120,
        container: $("sc_responsehandler"),
        db_grid: 12,
        range_z: {min: 1, max: 20, step: 0.1, shift_up: 5, shift_down: 0.2}
    });
    handles = [
        rh.add_handle({x:200, y:0, z: 5, mode:_TOOLKIT_CIRCULAR,
                       z_handle: _TOOLKIT_RIGHT, title:"handle 1", z_min: 1, z_max: 20}),
        rh.add_handle({x:6000, y:22, z: 7, mode:_TOOLKIT_CIRCULAR,
                       z_handle: _TOOLKIT_RIGHT, title:"handle 2", z_min: 1, z_max: 20}),
        rh.add_handle({x:400, y:0, z: 3, mode:_TOOLKIT_CIRCULAR,
                       z_handle: _TOOLKIT_RIGHT, title:"handle 3", z_min: 1, z_max: 20}),
        rh.add_handle({x:50, y:-12, z: 7, mode:_TOOLKIT_CIRCULAR,
                       z_handle: _TOOLKIT_RIGHT, title:"handle 4", z_min: 1, z_max: 20}),
        rh.add_handle({x:200, y:24, z: 3, mode:_TOOLKIT_CIRCULAR,
                       z_handle: _TOOLKIT_RIGHT, title:"handle 5", z_min: 1, z_max: 20}),
        rh.add_handle({x: 3000,
                       z: 3,
                       mode: _TOOLKIT_LINE_VERTICAL,
                       z_handle: _TOOLKIT_LEFT,
                       title: "handle 6",
                       z_min: 1,
                       z_max: 20,
                       preferences:[_TOOLKIT_TOP_LEFT, _TOOLKIT_TOP_RIGHT, _TOOLKIT_BOTTOM_LEFT,
                                    _TOOLKIT_BOTTOM_RIGHT, _TOOLKIT_LEFT, _TOOLKIT_RIGHT],
                       label: function(title, x, y, z){ return sprintf("%s\n%d Hz", title, x); }
                       }),
        rh.add_handle({x: 5000,
                       z: 3,
                       mode: _TOOLKIT_LINE_VERTICAL,
                       z_handle: _TOOLKIT_TOP_RIGHT,
                       title: "handle 7",
                       y_min: -12,
                       y_max: 12,
                       z_min: 1,
                       z_max: 20,
                       preferences:[_TOOLKIT_LEFT, _TOOLKIT_RIGHT],
                       label: function(title, x, y, z){ return sprintf("%s\n%d Hz", title, x); }
                       }),
        rh.add_handle({y: -24,
                       z: 3,
                       mode: _TOOLKIT_LINE_HORIZONTAL,
                       z_handle: _TOOLKIT_TOP,
                       title: "handle 8",
                       preferences: [_TOOLKIT_TOP_LEFT, _TOOLKIT_BOTTOM_LEFT, _TOOLKIT_TOP_RIGHT,
                                     _TOOLKIT_BOTTOM_RIGHT, _TOOLKIT_TOP, _TOOLKIT_BOTTOM],
                       label: function(title, x, y, z){ return sprintf("%s\n%d dB", title, y); }
                       }),
        rh.add_handle({y: 12,
                       z: 3,
                       mode: _TOOLKIT_LINE_HORIZONTAL,
                       z_handle: _TOOLKIT_TOP_RIGHT,
                       title: "handle 9",
                       x_min: 1000,
                       x_max: 2000,
                       z_min: 1,
                       z_max: 20,
                       preferences:[_TOOLKIT_TOP, _TOOLKIT_BOTTOM],
                       label: function (title, x, y, z) { return sprintf("%s\n%d dB", title, y); }
                       }),
        rh.add_handle({x: 100,
                       z: 3,
                       mode: _TOOLKIT_BLOCK_LEFT,
                       title: "handle 10",
                       x_max: 2000,
                       z_min: 1,
                       z_max: 20,
                       min_drag: 5,
                       preferences: [_TOOLKIT_TOP_RIGHT, _TOOLKIT_TOP, _TOOLKIT_TOP_LEFT,
                                     _TOOLKIT_RIGHT, _TOOLKIT_CENTER, _TOOLKIT_LEFT,
                                     _TOOLKIT_BOTTOM_RIGHT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_LEFT],
                       label: function (title, x, y, z) { return sprintf("%s\n%d Hz", title, x); } 
                       }),
        rh.add_handle({x: 8000,
                       z: 3,
                       mode: _TOOLKIT_BLOCK_RIGHT,
                       title: "handle 11",
                       x_min: 2000,
                       y_min: 0,
                       z_min: 1,
                       z_max: 20,
                       preferences: [_TOOLKIT_TOP_LEFT, _TOOLKIT_TOP, _TOOLKIT_TOP_RIGHT,
                                     _TOOLKIT_LEFT, _TOOLKIT_CENTER, _TOOLKIT_RIGHT,
                                     _TOOLKIT_BOTTOM_LEFT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_RIGHT],
                       label: function (title, x, y, z) { return sprintf("%s\n%d Hz", title, x); } 
                       }),
        rh.add_handle({x: 10000,
                       z: 3,
                       mode: _TOOLKIT_BLOCK_RIGHT,
                       title: "handle 11",
                       x_min: 2000,
                       y_max: 0,
                       z_min: 1,
                       z_max: 20,
                       preferences: [_TOOLKIT_TOP_LEFT, _TOOLKIT_TOP, _TOOLKIT_TOP_RIGHT,
                                     _TOOLKIT_LEFT, _TOOLKIT_CENTER, _TOOLKIT_RIGHT,
                                     _TOOLKIT_BOTTOM_LEFT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_RIGHT],
                       label: function (title, x, y, z) { return sprintf("%s\n%d Hz", title, x); } 
                       }),
        rh.add_handle({y: 20,
                       z: 3,
                       mode: _TOOLKIT_BLOCK_TOP,
                       z_handle: _TOOLKIT_BOTTOM,
                       title: "handle 11",
                       x_min: 500,
                       x_max: 1000,
                       z_min: 1,
                       z_max: 20,
                       preferences: [_TOOLKIT_TOP, _TOOLKIT_CENTER, _TOOLKIT_BOTTOM],
                       label: function (title, x, y, z) { return sprintf("%s\n%d dB", title, y); } 
                       }),
        rh.add_handle({y: 26,
                       z: 3,
                       mode: _TOOLKIT_BLOCK_TOP,
                       title: "handle 12",
                       x_min: 1000,
                       x_max: 2000,
                       z_min: 1,
                       z_max: 20,
                       preferences: [_TOOLKIT_TOP, _TOOLKIT_CENTER, _TOOLKIT_BOTTOM],
                       label: function (title, x, y, z) { return sprintf("%s\n%d dB", title, y); } 
                       }),
        rh.add_handle({y: -6,
                       z: 3,
                       mode: _TOOLKIT_BLOCK_BOTTOM,
                       title: "handle 13",
                       x_min: 500,
                       x_max: 1000,
                       z_min: 1,
                       z_max: 20,
                       preferences: [_TOOLKIT_BOTTOM, _TOOLKIT_CENTER, _TOOLKIT_TOP],
                       label: function (title, x, y, z) { return sprintf("%s\n%d dB", title, y); } 
                       }),
        rh.add_handle({y: -16,
                       z: 3,
                       mode: _TOOLKIT_BLOCK_BOTTOM,
                       title: "handle 14",
                       x_min: 1000,
                       x_max: 2000,
                       z_min: 1,
                       z_max: 20,
                       preferences: [_TOOLKIT_BOTTOM, _TOOLKIT_CENTER, _TOOLKIT_TOP],
                       label: function (title, x, y, z) { return sprintf("%s\n%d dB", title, y); } 
                       })
    ]
}


// STATE

function run_state () {
    if (typeof s1 != "undefined") {
        s1.destroy();
        s2.destroy();
        s3.destroy();
        s4.destroy();
        s5.destroy();
        s6.destroy();
        s7.destroy();
        s8.destroy();
        s1 = undefined;
        s2 = undefined;
        s3 = undefined;
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
    if(s1)
        window.setTimeout(__s1, 1000);
}

function __s2 () {
    if (s2.get("state") >= 1)
        _s2 = -0.02;
    else if (s2.get("state") <= 0)
        _s2 = 0.02;
    s2.set("state", s2.get("state") + _s2);
    if(s2)
        window.setTimeout(__s2, 20);
}

function __s3 () {
    _s3 = !_s3;
    s3.set("color", _s3 ? "#def" : "#0af");
    if(s3)
        window.setTimeout(__s3, 500);
}


// METER BASE

function run_meterbase () {
    if (typeof mbvl != "undefined") {
        mbvl.destroy();
        mbvr.destroy();
        mbhb.destroy();
        mbht.destroy();
        mbvl = undefined;
        return;
    }
    mbvl = new MeterBase({
        container: $$("#sc_meterbase")[0],
        layout: _TOOLKIT_RIGHT,
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
        layout: _TOOLKIT_LEFT,
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
        layout: _TOOLKIT_BOTTOM,
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
        layout: _TOOLKIT_TOP,
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
    if (typeof meters != "undefined" && typeof meters.mvr != "undefined") {
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
            layout: _TOOLKIT_RIGHT,
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
            hold_size: 1,
            clipping: 0,
            container: $$("#sc_levelmeter")[0],
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
            hold_size: 1,
            clipping: 0,
            container: $$("#sc_levelmeter")[0],
            gradient: {"-96": "#001f83", "-0.1": "#008bea", "0": "#ff6000", "24": "#ffa000"},
            levels: [1, 6, 12]
        }),
        
        mvrr: new LevelMeter({
            layout: _TOOLKIT_RIGHT,
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
            hold_size: 1,
            container: $$("#sc_levelmeter")[0],
            gradient: {"-24": "#008bea", "0": "#001f83", "24": "#008bea"},
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
            hold_size: 1,
            container: $$("#sc_levelmeter")[0],
            gradient: {"-24": "#008bea", "0": "#001f83", "24": "#008bea"},
            levels: [1, 6, 12]
        }),
        
        mhb: new LevelMeter({
            segment: 2,
            layout: _TOOLKIT_BOTTOM,
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
            hold_size: 1,
            clipping: 0,
            container: $$("#sc_levelmeter")[0],
            gradient: {"-96": "#001f83", "-0.1": "#008bea", "0": "#ff6000", "24": "#ffa000"},
            levels: [1, 6, 12]
        }),
        mht: new LevelMeter({
            segment: 2,
            layout: _TOOLKIT_TOP,
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
            hold_size: 1,
            clipping: 0,
            container: $$("#sc_levelmeter")[0],
            gradient: {"-96": "#001f83", "-0.1": "#008bea", "0": "#ff6000", "24": "#ffa000"},
            levels: [1, 6, 12]
        }),
        
        mhbr: new LevelMeter({
            segment: 2,
            layout: _TOOLKIT_BOTTOM,
            reverse: false,
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
            hold_size: 1,
            clipping: 24,
            container: $$("#sc_levelmeter")[0],
            gradient: {"0": "#001f83", "24": "#008bea"},
            levels: [1, 6, 12]
        }),
        mhtr: new LevelMeter({
            segment: 2,
            reverse: true,
            layout: _TOOLKIT_TOP,
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
            hold_size: 1,
            clipping: 24,
            container: $$("#sc_levelmeter")[0],
            gradient: {"0": "#001f83", "24": "#008bea"},
            levels: [1, 5, 10]
        })
    }
}

running = false
function run () {
    if (running) return;
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
    if (running) window.setTimeout(run1, Math.random() * 500); 
}
function run2 () {
    var v = Math.random() * 118 - 96;
    meters.mvr.set("value", v);
    if (running) window.setTimeout(run2, Math.random() * 500); 
}
function run3 () {
    var v = Math.random() * 118 - 96;
    meters.mht.set("value", v);
    if (running) window.setTimeout(run3, Math.random() * 500); 
}
function run4 () {
    var v = Math.random() * 118 - 96;
    meters.mhb.set("value", v);
    if (running) window.setTimeout(run4, Math.random() * 500); 
}
function run5 () {
    var v = Math.random() * 44 - 22;
    meters.mvlr.set("value", v);
    if (running) window.setTimeout(run5, Math.random() * 500); 
}
function run6 () {
    var v = Math.random() * 44 - 22;
    meters.mvrr.set("value", v);
    if (running) window.setTimeout(run6, Math.random() * 500); 
}
function run7 () {
    var v = Math.random() * 22;
    meters.mhtr.set("value", v);
    if (running) window.setTimeout(run7, Math.random() * 500); 
}
function run8 () {
    var v = Math.random() * 22;
    meters.mhbr.set("value", v);
    if (running) window.setTimeout(run8, Math.random() * 500); 
}
    
function reset () {
    for(i in meters) {
        meters[i].reset_peak();
    }
}
function hold (h) {
    h = !meters.mhbr.get("show_hold");
    for(var i = 0; i < Object.keys(meters).length; i++) {
        meters[Object.keys(meters)[i]].set("show_hold", h);
    }
}