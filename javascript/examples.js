
// VALUEKNOB
run_valueknob = function (root) {
    valueknob = new ValueKnob({
        min: -100,
        max: 100,
        value: -20,
        snap: 0.01
    });
    root.append_child(valueknob);
}


// PAGER
run_pager = function (root) {
    pager1 = new Pager({
        pages: [
            {label: "Page #1", content: TK.html("<h1>Page #1</h1><p>This is Page #1.</p>") },
            {label: "Page #2", content: TK.html("<h1>Page #2</h1><p>This is Page #2.</p>") },
            {label: "Page #3", content: TK.html("<h1>Page #3</h1><p>This is Page #3.</p>") },
            {label: "Page #4", content: TK.html("<h1>Page #4</h1><p>This is Page #4.</p>") },
            {label: "Page #5", content: TK.html("<h1>Page #5</h1><p>This is Page #5.</p>") },
            {label: "Page #6", content: TK.html("<h1>Page #6</h1><p>This is Page #6.</p>") },
            {label: "Page #7", content: TK.html("<h1>Page #7</h1><p>This is Page #7.</p>") },
            {label: "Page #8", content: TK.html("<h1>Page #8</h1><p>This is Page #8.</p>") },
            {label: "Page #9", content: TK.html("<h1>Page #9</h1><p>This is Page #9.</p>") },
            {label: "Page #10", content: TK.html("<h1>Page #10</h1><p>This is Page #10.</p>") },
            {label: "Page #11", content: TK.html("<h1>Page #11</h1><p>This is Page #11.</p>") },
            {label: "Page #12", content: TK.html("<h1>Page #12</h1><p>This is Page #12.</p>") }
        ],
        show: 4,
        position: _TOOLKIT_RIGHT,
        direction: _TOOLKIT_HORIZ,
        "class": "pager-newspaper",
    });
    pager2 = new Pager({
        pages: [
            {label: "Page #1", content: TK.html("<h1>Page #1</h1><p>This is Page #1.</p>") },
            {label: "Page #2", content: TK.html("<h1>Page #2</h1><p>This is Page #2.</p>") },
            {label: "Page #3", content: TK.html("<h1>Page #3</h1><p>This is Page #3.</p>") },
            {label: "Page #4", content: TK.html("<h1>Page #4</h1><p>This is Page #4.</p>") },
            {label: "Page #5", content: TK.html("<h1>Page #5</h1><p>This is Page #5.</p>") },
            {label: "Page #6", content: TK.html("<h1>Page #6</h1><p>This is Page #6.</p>") },
            {label: "Page #7", content: TK.html("<h1>Page #7</h1><p>This is Page #7.</p>") },
            {label: "Page #8", content: TK.html("<h1>Page #8</h1><p>This is Page #8.</p>") },
            {label: "Page #9", content: TK.html("<h1>Page #9</h1><p>This is Page #9.</p>") },
            {label: "Page #10", content: TK.html("<h1>Page #10</h1><p>This is Page #10.</p>") },
            {label: "Page #11", content: TK.html("<h1>Page #11</h1><p>This is Page #11.</p>") },
            {label: "Page #12", content: TK.html("<h1>Page #12</h1><p>This is Page #12.</p>") }
        ],
        show: 4,
    });
    root.append_child(pager1);
    root.append_child(pager2);
}

// BUTTONARRAY
run_buttonarray = function (root) {
    ba_horiz1 = new ButtonArray({
        buttons: [
            {label: "Button 1"},
            {label: "Button 2"},
            {label: "Button 3"},
            {label: "Button 4"},
            {label: "Button 5"},
            {label: "Button 6"},
            //{label: "Button 7"},
            //{label: "Button 8"},
            //{label: "Button 9"},
            //{label: "Button 10"},
            //{label: "Button 11"},
            //{label: "Button 12"},
            //{label: "Button 13"},
            //{label: "Button 14"},
            //{label: "Button 15"},
            //{label: "Button 16"}
        ],
        show: 3
    });
    ba_horiz2 = new ButtonArray({
        buttons: [
            {label: "Button 1"},
            {label: "Button 2"},
            {label: "Button 3"},
            {label: "Button 4"},
            {label: "Button 5"},
            {label: "Button 6"},
            {label: "Button 7"},
            {label: "Button 8"},
            {label: "Button 9"},
            {label: "Button 10"},
            {label: "Button 11"},
            {label: "Button 12"},
            {label: "Button 13"},
            {label: "Button 14"},
            {label: "Button 15"},
            {label: "Button 16"}
        ],
        show: 1
    });
    ba_vert1 = new ButtonArray({
        direction: _TOOLKIT_VERT,
        buttons: [
            {label: "Button 1"},
            {label: "Button 2"},
            {label: "Button 3"},
            {label: "Button 4"},
            {label: "Button 5"},
            {label: "Button 6"},
            {label: "Button 7"},
            {label: "Button 8"},
            {label: "Button 9"},
            //{label: "Button 10"},
            //{label: "Button 11"},
            //{label: "Button 12"},
            //{label: "Button 13"},
            //{label: "Button 14"},
            //{label: "Button 15"},
            //{label: "Button 16"}
        ],
        show: 8
    });
    ba_vert2 = new ButtonArray({
        direction: _TOOLKIT_VERT,
        buttons: [
            {label: "Button 1"},
            {label: "Button 2"},
            {label: "Button 3"},
            {label: "Button 4"},
            {label: "Button 5"},
            {label: "Button 6"},
            {label: "Button 7"},
            {label: "Button 8"},
            {label: "Button 9"},
            {label: "Button 10"},
            {label: "Button 11"},
            {label: "Button 12"},
            {label: "Button 13"},
            {label: "Button 14"},
            {label: "Button 15"},
            {label: "Button 16"}
        ],
        show: 15
    });
    root.append_child(ba_vert1);
    root.append_child(ba_horiz1);
    root.append_child(ba_vert2);
    root.append_child(ba_horiz2);
}


// KEYBOARD
run_keyboard = function (root) {
    value = new Value({
        container: root.element,
        value: 123.97,
        format: TK.FORMAT("%.3f Hz"),
        set: function (val) { console.log("the value was set to " + val); return val; }
    });
    root.add_child(value);
    value.add_event("click", function () {
        if (typeof keyboard !== "undefined") {
            keyboard.destroy()
            keyboard = undefined;
            return;
        }
        keyboard = new Keyboard({
            width: 320,
            height: 240,
            container: document.body,
            buffer: value._input,
            rows: [
                {
                    keys: [
                        {
                            label_default:"1",
                        },
                        {
                            label_default:"2",
                        },
                        {
                            label_default:"3",
                        },
                        {
                            label_default:"Clear",
                        }
                    ]
                },
                {
                    keys: [
                        {
                            label_default:"4",
                        },
                        {
                            label_default:"5",
                        },
                        {
                            label_default:"6",
                        },
                        {
                            label_default:"Enter",
                            height: 2,
                            default: function () {
                                value.set("value", keyboard.get("content"));
                                keyboard.destroy();
                            }
                        }
                    ]
                },
                {
                    styles:{width:"75%"},
                    keys: [
                        {
                            label_default:"7",
                        },
                        {
                            label_default:"8",
                        },
                        {
                            label_default:"9",
                        },
                        
                    ]
                },
                {
                    keys: [
                        {
                            label_default:"0",
                            width: 2
                        },
                        {
                            label_default:".",
                        },
                        {
                            label_default:"Esc",
                            default: function () { keyboard.destroy() }
                        }
                    ]
                }
            ],
        });
        keyboard.show();
    });
}


// LABEL
run_label = function (root) {
    label = new Label({
        label: "Lorem ipsum dolor sit amet"
    });
    root.append_child(label);
}

// SELECT
run_select = function (root) {
    select = new Select({
        entries: [
            {title:"haha", value:11},
            {title:"huu", value:12},
            {title:"höhö", value:13},
            {title:"foo", value:14},
            {title:"bar", value:15},
            {title:"foobar",value:16},
            {title:"wtf",value:17}
        ],
        selected: 4
    });
    root.append_child(select);
}

// FADER
run_fader = function (root) {
    faders = [];
    var options = {
        min: -580,
        max: 60,
        value: 0,
        labels: TK.FORMAT("%d", "%/4"),
        format: TK.FORMAT("%.2f dB", "%/4"),
        tooltip: false,
        step: 1,
        base: 0,
        gap_dots: 1,
        gap_labels: 1,
        log_factor: 2,
        division: 1,
        snap: 1,
        fixed_dots: [40, 20, -20, -40, -60, -80, -120, -160, -200, -280],
        fixed_labels: [40, 20, -20, -40, -60, -80, -120, -160, -200, -280],
        scale:_TOOLKIT_DB
    }
    options.layout = _TOOLKIT_RIGHT;
    faders.push(new Fader(options));
    
    options.layout = _TOOLKIT_LEFT;
    faders.push(new Fader(options));
    
    options.layout = _TOOLKIT_BOTTOM;
    faders.push(new Fader(options));
    
    options.layout = _TOOLKIT_TOP;
    faders.push(new Fader(options));
    
    root.append_children(faders);

    fadertt = new Toggle({
        label: "Tooltips",
        onToggled: function (state) {
            var t = state ? TK.FORMAT("%.2f dB", "%/4") : false;
            for (var i = 0; i < faders.length; i++) {
                faders[i].set("tooltip", t);
            }
        }
    });
    root.append_child(fadertt);
}

// VALUE
run_value = function (root) {
    value = new Value({
        value: 123.97,
        format: TK.FORMAT("%.3f Hz"),
        set: function (val) { val = parseFloat(val); console.log("the value was set to " + val); return val; }
    });
    root.append_child(value);
}


// KNOB
function run_knob (root) {
    knob1 = new Knob({
        "class": "knob1",
        margin: 5.5,
        thickness: 3,
        min: -96,
        max: 24,
        value: -20,
        dot: {length: 3, margin: 2, width: 1},
        marker: {thickness: 3, margin: 5.5},
        markers: [
            {from: 0, to: 24}
        ],
        
        hand: {width: 1, length: 12, margin: 21.5},
        styles: {backgroundSize: "100%"}
    });
    knob = new Knob({
        "class": "knob",
        min: -96,
        max: 24,
        value: -20,
        markers: [
            {from: 0, to: 24}
        ],
        dots: [
            {pos: -96}, {pos: -84}, {pos: -72}, {pos: -60}, {pos: -48}, {pos: -36}, {pos: -24},
            {pos: -12}, {pos: 0}, {pos: 12}, {pos: 24}
        ],
        labels: [
            {pos: -96}, {pos: -72}, {pos: -48}, {pos: -24}, {pos: -12}, {pos: 0, label: "±0"}, {pos: 12}, {pos: 24}
        ]
    });
    knob2 = new Knob({
        "class": "knob2",
        margin: 0,
        thickness: 4,
        min: 20,
        max: 20000,
        value: 1000,
        scale: _TOOLKIT_FREQ,
        dot: {length: 4, margin: 0, width: 1},
        label: {align: _TOOLKIT_INNER, margin: 6},
        dots: [
            {pos: 20}, {pos: 30}, {pos: 40}, {pos: 50}, {pos: 60}, {pos: 70}, {pos: 80}, {pos: 90},
            {pos: 100}, {pos: 200}, {pos: 300}, {pos: 400}, {pos: 500}, {pos: 600}, {pos: 700}, {pos: 800}, {pos: 900},
            {pos: 1000}, {pos: 2000}, {pos: 3000}, {pos: 4000}, {pos: 5000}, {pos: 6000}, {pos: 7000}, {pos: 8000}, {pos: 9000},
            {pos: 10000}, {pos: 20000}
        ],
        labels: [
            {pos: 20}, {pos: 100}, {pos: 1000, label: "1k"}, {pos: 2000, label: "2k"}, {pos: 3000, label: "3k"}, {pos: 4000, label: "4k"},
            {pos: 10000, label: "10k"}, {pos: 20000, label:"20k"}
        ],
        hand: {width: 2, length: 3.5, margin: 32},
        styles: {backgroundSize: "50%"}
    });
    root.append_children([ knob, knob1, knob2 ]);
}




// WINDOW

function run_window (root) {
    winbutton = new Button({
        label: "Demo Window",
        icon: "images/icons_big/window.png"
    });
    root.append_child(winbutton);

    winbutton.add_event("click", function () { 
        win = new Window({
            container: document.body,
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
            content: TK.html("<div style='margin: 6px'><img src=images/toolkit.png "
                   + "style=\"float: left; margin-right: 20px;\">"
                   + "Thanks for testing TK. We hope you like "
                   + "the functionality, complexity and style. If you have any "
                   + "sugestions or bug reports, please let us know.</div>")
        });
        var ok = new Button({
            label: "OK",
        });
        win.append_child(ok);
        ok.add_event("click", win.destroy.bind(win));
        TK.set_styles(ok.element, {
            position: "absolute",
            bottom: 0,
            right: 0
        });
        root.add_child(win);
    });
}


// CLOCK

function run_clock (root) {
    clock = new Clock();
    root.append_child(clock);
    TK.seat_all_svg()
}


// GAUGE
function run_gauge (root) {
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
        label: {format: TK.FORMAT("%d °")},
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
    TK.seat_all_svg()
    root.append_children(gauge);
}


// TOGGLE

function run_toggle (root) {
    toggle = new Toggle({
        label: "Mic Active",
        label_active: "Mic Muted",
        icon: "images/icons_big/microphone.png",
        icon_active: "images/icons_big/microphone_muted.png"
    });
    press = new Toggle({
        label: "Mic Active",
        label_active: "Mic Muted",
        icon: "images/icons_big/microphone.png",
        icon_active: "images/icons_big/microphone_muted.png",
        press: 200,
        toggle: true
    });
    root.append_child(toggle);
    root.append_child(press);
}


// BUTTON

function run_button () {
    button = new Button({
        label: "Demo Button",
        icon: "images/icons_big/showcase.png",
        onclick: function () { alert("clicked") }
    });
    button2 = new Button({
        label: "Demo Button",
        icon: "images/icons_big/showcase.png",
        layout: _TOOLKIT_HORIZONTAL,
        onclick: function () { alert("clicked") }
    });
    button3 = new Button({
        icon: "images/icons_big/showcase.png",
        onclick: function () { alert("clicked") }
    });
    button4 = new Button({
        label: "Demo Button",
        onclick: function () { alert("clicked") }
    });
    root.append_children([ button, button2, button3, button4 ]);
}

// VALUE BUTTON

function run_valuebutton (root) {
    thres = new ValueButton({
        label: "Threshold",
        icon: "images/icons_small/threshold.png",
        value_position: _TOOLKIT_BOTTOM,
        value_format: TK.FORMAT("%.1f dB"),
        min: -96,
        max: 24,
        step: 1,
        basis: 300,
        shift_up: 4,
        shift_down: 0.25,
        value: 0,
    });

    attack = new ValueButton({
        "class": "attack",
        label: "Attack",
        icon: "images/icons_small/attack.png",
        value_position: _TOOLKIT_BOTTOM,
        value_format: TK.FORMAT("%.1f ms"),
        min: 1,
        max: 1000,
        step: 1,
        basis: 300,
        shift_up: 4,
        shift_down: 0.25,
        value: 100,
        scale: _TOOLKIT_FREQ
    });
    
    ratio = new ValueButton({
        label: "Ratio",
        icon: "images/icons_small/ratio.png",
        value_position: _TOOLKIT_BOTTOM,
        value_format: TK.FORMAT("%.1f : 1"),
        min: 1,
        max: 10,
        step: 1,
        basis: 300,
        shift_up: 4,
        shift_down: 0.25,
        value: 2
    });
    
    release = new ValueButton({
        label: "Release",
        icon: "images/icons_small/release.png",
        value_position: _TOOLKIT_BOTTOM,
        value_format: TK.FORMAT("%.1f ms"),
        min: 1,
        max: 1000,
        step: 1,
        basis: 300,
        shift_up: 4,
        shift_down: 0.25,
        value: 100,
        scale: _TOOLKIT_FREQ
    });
    
    root.append_children([ thres, attack, ratio, release ]);
}

// SCALE

function run_scale (root) {
    scales = {};
    scales.left = new Scale({
        layout: _TOOLKIT_LEFT,
        division: 1,
        levels: [1, 6, 12],
        min: -96,
        max: +24,
        base: 0,
        basis: 200,
        scale: _TOOLKIT_DB,
        id: "sc_scale_v_l"
    })
    scales.right = new Scale({
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

    root.append_children([ scales.left, scales.right, scales.top, scales.bottom ]);
}


// CHART

function run_chart (root) {
    chart = new Chart({
        range_x: {basis:908, scale: _TOOLKIT_LINEAR, min:0, max:1},
        range_y: {basis:300, scale: _TOOLKIT_LINEAR, min:0, max:1},
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
    TK.seat_all_svg()
    root.append_child(chart);
}

// FREQUENCY RESPONSE

function run_frequencyresponse (root) {
    fr = new FrequencyResponse({
        width: 906,
        height: 300,
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
    root.append_child(fr);
    TK.seat_all_svg()
}

// DYNAMICS

function run_dynamics (root) {
    comp = new Dynamics({
        size: 298,
    });
    gcomp = comp.add_graph({
        dots: [{x:-96, y:-72},
               {x:-24, y:0},
               {x:24, y: 12},
        ],
        mode: _TOOLKIT_LINE
    });
    expand = new Dynamics({
        size: 298,
        type: _TOOLKIT_EXPANDER,
        threshold: -12,
        ratio: 4,
        range: -36
    });
    dyna = new Dynamics({
        size: 298,
    });
    gdyna = dyna.add_graph({
        dots: [{x:-60, y:-96},
               {x:-48, y:-48},
               {x:-36, y:-24},
               {x:-12, y:-12},
               {x:24, y:-8}
        ],
        mode: _TOOLKIT_LINE
    });
    root.append_children([ comp, expand, dyna ]);
    TK.seat_all_svg()
}



// EQUALIZER
function run_equalizer (root) {
    eq = new Equalizer({
        width: 908,
        height: 300,
        depth: 120,
        db_grid: 12,
        range_z: {min: 0.4, max: 4, step: 0.1, shift_up: 10, shift_down: 0.2, reverse: true},
        bands: [{x:600, y:-12, z:3, type:_TOOLKIT_PARAMETRIC,
                     z_handle: _TOOLKIT_RIGHT, title:"Band 1", z_min: 0.4, z_max: 4},
        {x:2000, y:12, z:1, type:_TOOLKIT_PARAMETRIC,
                     z_handle: _TOOLKIT_RIGHT, title:"Band 1", z_min: 0.4, z_max: 4},
        {x:200, y:-12, z:1, type:_TOOLKIT_LOWSHELF,
                     z_handle: _TOOLKIT_RIGHT, title:"Low Shelf",
                     preferences: [_TOOLKIT_TOP_RIGHT, _TOOLKIT_TOP, _TOOLKIT_TOP_LEFT,
                                   _TOOLKIT_RIGHT, _TOOLKIT_CENTER, _TOOLKIT_LEFT,
                                   _TOOLKIT_BOTTOM_RIGHT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_LEFT],
                     z_min: 0.4, z_max: 4},
        {x:7000, y: 12, z:1, type:_TOOLKIT_HIGHSHELF,
                     z_handle: _TOOLKIT_LEFT, title:"High Shelf",
                     preferences: [_TOOLKIT_TOP_LEFT, _TOOLKIT_TOP, _TOOLKIT_TOP_RIGHT,
                                   _TOOLKIT_LEFT, _TOOLKIT_CENTER, _TOOLKIT_RIGHT,
                                   _TOOLKIT_BOTTOM_LEFT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_RIGHT],
                     z_min: 0.4, z_max: 4},
        {x:40, z: 1, type:_TOOLKIT_HP2, title:"High Pass",
                     preferences: [_TOOLKIT_TOP_RIGHT, _TOOLKIT_TOP, _TOOLKIT_TOP_LEFT,
                                   _TOOLKIT_RIGHT, _TOOLKIT_CENTER, _TOOLKIT_LEFT,
                                   _TOOLKIT_BOTTOM_RIGHT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_LEFT],
                     label: function (title, x, y, z) { return title + "\n" + TK.sprintf("%.2f", x) + " Hz"; } },
        {x:15000, z: 1, type:_TOOLKIT_LP4, title:"Low Pass",
                     preferences: [_TOOLKIT_TOP_LEFT, _TOOLKIT_TOP, _TOOLKIT_TOP_RIGHT,
                                   _TOOLKIT_LEFT, _TOOLKIT_CENTER, _TOOLKIT_RIGHT,
                                   _TOOLKIT_BOTTOM_LEFT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_RIGHT],
                     label: function (title, x, y, z) { return title + "\n" + TK.sprintf("%.2f", x) + " Hz"; } }]
    });
    root.append_child(eq);
    TK.seat_all_svg()
}

/* TODO: remove this? */
function run_spectralsignature (root) {
    ssig = new SpectralSignature.Widget({
            range_x: {min: 40, max: 24000, basis: 800, scale: _TOOLKIT_FREQUENCY},
            range_y_upper: {min: -84, max: 0, basis: 200, scale: _TOOLKIT_LINEAR, step: 1, shift_up: 2, shift_down: 0.5},
            range_y_upper_norm: {min: -12, max: 12, basis: 200, base: 0, scale: _TOOLKIT_LINEAR, reverse: true},
            range_y_lower: {min: -40, max: 40, basis: 300, base: 0, scale: _TOOLKIT_LINEAR},
            range_y_relative: {min: -80, max: 80, base: 0, basis: 600, scale: _TOOLKIT_LINEAR},
            range_z_maxgain: {min: 0, max: 12, basis: 45, step: 0.25, shift_down: 0.2, shift_up: 4, scale: _TOOLKIT_LINEAR},
            bands: [63, 100, 160, 250, 400, 630, 1000, 1600, 2500, 4000, 6300, 10000, 16000],

            grid_x: [
                {pos:    63, label: "63Hz"},
                {pos:    100, label: "100Hz"},
                {pos:    160, label: "160Hz"},
                {pos:    250, label: "250Hz"},
                {pos:    400, label: "400Hz"},
                {pos:    630, label: "630Hz"},
                {pos:    1000, label: "1kHz"},
                {pos:    1600, label: "1.6kHz"},
                {pos:    2500, label: "2.5kHz"},
                {pos:    4000, label: "4kHz"},
                {pos:    6300, label: "6.3kHz"},
                {pos:    10000, label: "10kHz"},
                {pos:    16000, label: "16kHz"}
            ],

            toggle_icon:        "/controls/checkbox/checkbox_false.png",
            toggle_icon_active: "/controls/checkbox/checkbox_true.png",

            type: "H2.5",

            thresholds: {
                preferences: [_TOOLKIT_TOP, _TOOLKIT_CENTER, _TOOLKIT_BOTTOM],
                title: "Gate %s",
                label: function (title, x, y, z) { return title + "\n" + y.toFixed(1); },
                min_drag: 5
            },

            signatures: {
                preferences: [_TOOLKIT_TOP, _TOOLKIT_BOTTOM],
                title: "Band %s",
                label: function (title, x, y, z) { return title + "\n" + y.toFixed(1) + " dB\nMAX:\n" + z.toFixed(1) +" dB"; },
                min_size: 20,
                z_min: 0,
                z_max: 12,
                y_min: -40,
                y_max: 40,
                min_drag: 5,
                z_handle: _TOOLKIT_BOTTOM
            },

            db_grid_relative: 10,

            state_color: '#dde1e8',

            state_colors: {
                OFF:     '#ccc',
                Gated:   '#f3e18f',
                Active:  '#93d593'
            },

            upper_normalized: false,

            key_upper: false,
            key_input: "Input Spectrum",
            key_gain:  "Output Spectrum",
            key_difference: "Difference",

            key_lower: false,

            /*title_upper: "Spectrum",*/
            position_upper: _TOOLKIT_TOP_RIGHT,

            /*title_lower: "Signature",*/
            position_lower: _TOOLKIT_TOP_RIGHT
    });
    ssig.add_signature({}, [-10, 20, 30, -20, -40, 40, 20, 10], true);
    root.append_child(ssig);
    TK.seat_all_svg()
}


// RESPONSE HANDLER
function run_responsehandler (root) {
    rh = new ResponseHandler({
        width: 908,
        height: 300,
        depth: 120,
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
                       label: function(title, x, y, z){ return title + "\n" + (x|0) + " Hz"; }
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
                       label: function(title, x, y, z){ return title + "\n" + (x|0) + " Hz"; }
                       }),
        rh.add_handle({y: -24,
                       z: 3,
                       mode: _TOOLKIT_LINE_HORIZONTAL,
                       z_handle: _TOOLKIT_TOP,
                       title: "handle 8",
                       preferences: [_TOOLKIT_TOP_LEFT, _TOOLKIT_BOTTOM_LEFT, _TOOLKIT_TOP_RIGHT,
                                     _TOOLKIT_BOTTOM_RIGHT, _TOOLKIT_TOP, _TOOLKIT_BOTTOM],
                       label: function(title, x, y, z){ return title + "\n" + (y|0) + " dB"; }
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
                       label: function (title, x, y, z) { return title + "\n" + (y|0) + " dB"; }
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
                       label: function (title, x, y, z) { return title + "\n" + (x|0) + " Hz"; } 
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
                       label: function (title, x, y, z) { return title + "\n" + (x|0) + " Hz"; } 
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
                       label: function (title, x, y, z) { return title + "\n" + (x|0) + " Hz"; } 
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
                       label: function (title, x, y, z) { return title + "\n" + (y|0) + " dB"; } 
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
                       label: function (title, x, y, z) { return title + "\n" + (y|0) + " dB"; } 
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
                       label: function (title, x, y, z) { return title + "\n" + (y|0) + " dB"; } 
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
                       label: function (title, x, y, z) { return title + "\n" + (y|0) + " dB"; } 
                       })
    ];
    root.append_child(rh);
    TK.seat_all_svg()
}


// STATE

function run_state (root) {
    s1 = new State({ });
    s2 = new State({ color: "#00ff00"
    });
    s3 = new State({
        color: "blue",
        state: 1
    });
    s4 = new State({
        color: "blue",
        state: 1,
    });
    s5 = new State({
        color: "#cc0000",
        state: 1,
    });
    s6 = new State({
        color: "#ff8800",
        state: 1,
    });
    s7 = new State({
        color: "grey",
        state: 1,
    });
    s8 = new State({
        color: "#d00",
        state: 0,
        "class": "on_air"
    });
    root.append_children([ s1, s2, s3, s4, s5, s6, s7, s8 ]);
    __s1();
    __s2();
    __s3();
}
var _s1 = 0;
var _s2 = 0;
var _s3 = 0;

function __s1 () {
    if (!s1) return;
    _s1 = !_s1;
    s1.set("state", _s1);
    if(s1)
        window.setTimeout(__s1, 1000);
}

function __s2 () {
    if (!s2) return;
    if (s2.get("state") >= 1)
        _s2 = -0.02;
    else if (s2.get("state") <= 0)
        _s2 = 0.02;
    s2.set("state", s2.get("state") + _s2);
    if(s2)
        window.setTimeout(__s2, 20);
}

function __s3 () {
    if (!s3) return;
    _s3 = !_s3;
    s3.set("color", _s3 ? "#def" : "#0af");
    if(s3)
        window.setTimeout(__s3, 500);
}

// METER BASE

function run_meterbase (root) {
    mbvl = new MeterBase({
        layout: _TOOLKIT_RIGHT,
        scale: _TOOLKIT_DECIBEL,
        segment: 2,
        min: -60,
        max: 3,
        value: 18,
        scale_base: 0,
        title: "left",
        show_title: true,
        show_label: true,
        gradient: {"-96": "#001f83", "-0.1": "#008bea", "0": "#ff6000", "24": "#ffa000"},
        levels: [1, 3, 6, 12],
        gap_labels: 20
    });
    mbvr = new MeterBase({
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
    root.append_children([ mbvl, mbvr, mbhb, mbht ]);
}


// LEVEL METER

function run_levelmeter (root) {
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
            gradient: {"0": "#001f83", "24": "#008bea"},
            levels: [1, 5, 10]
        })
    }
    root.append_children([
        meters.mvr,
        meters.mvl,
        meters.mvrr,
        meters.mvlr,
        meters.mhb,
        meters.mht,
        meters.mhbr,
        meters.mhtr
    ]);
    root.append_child(new Button({
        onclick: run,
        label : "Run",
    }));
    root.append_child(new Button({
        label : "Stop",
        onclick: function() { running = false; }
    }));
    root.append_child(new Button({
        onclick: reset,
        label : "Reset",
    }));
    root.append_child(new Button({
        onclick: hold,
        label : "Toggle Hold",
    }));

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
    if (!running) return;
    var v = Math.random() * 118 - 96;
    meters.mvl.set("value", v);
    window.setTimeout(run1, Math.random() * 500); 
}
function run2 () {
    if (!running) return;
    var v = Math.random() * 118 - 96;
    meters.mvr.set("value", v);
    window.setTimeout(run2, Math.random() * 500); 
}
function run3 () {
    if (!running) return;
    var v = Math.random() * 118 - 96;
    meters.mht.set("value", v);
    window.setTimeout(run3, Math.random() * 500); 
}
function run4 () {
    if (!running) return;
    var v = Math.random() * 118 - 96;
    meters.mhb.set("value", v);
    window.setTimeout(run4, Math.random() * 500); 
}
function run5 () {
    if (!running) return;
    var v = Math.random() * 44 - 22;
    meters.mvlr.set("value", v);
    window.setTimeout(run5, Math.random() * 500); 
}
function run6 () {
    if (!running) return;
    var v = Math.random() * 44 - 22;
    meters.mvrr.set("value", v);
    window.setTimeout(run6, Math.random() * 500); 
}
function run7 () {
    if (!running) return;
    var v = Math.random() * 22;
    meters.mhtr.set("value", v);
    window.setTimeout(run7, Math.random() * 500); 
}
function run8 () {
    if (!running) return;
    var v = Math.random() * 22;
    meters.mhbr.set("value", v);
    window.setTimeout(run8, Math.random() * 500); 
}
    
function reset () {
    if (!running) return;
    for(i in meters) {
        meters[i].reset_peak();
    }
}
function hold (h) {
    if (!running) return;
    h = !meters.mhbr.get("show_hold");
    for(var i = 0; i < Object.keys(meters).length; i++) {
        meters[Object.keys(meters)[i]].set("show_hold", h);
    }
}
