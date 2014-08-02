 /* toolkit. provides different widgets, implements and modules for 
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
    $$(".collapse").each(function (e) {
        var toggle = new Element("div", {"class":"toolkit-button", html:e.get("title") + " (" + (e.getChildren()[0].getChildren().length - 1) + ")"});
        toggle.inject(e.getParent().getChildren(".buttons")[0]);
        var toggleFx = new Fx.Slide(e).hide();
        toggle.addEventListener("click", function(){toggleFx.toggle()});
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
            t.addEventListener("click", function(){toggleFx.toggle()});
            m.addEventListener("click", function(){toggleFx.toggle()});
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
            but.addEventListener("click", window["run_" + id]);
            l.addEventListener("click", window["run_" + id]);
            
            var pre = new Element("pre.box", {html: "<code data-language='python'>" + window["run_" + id].toString() + "</code>"}).inject(e.getChildren(".buttons")[0], "after");
            var tog = new Element("div.toolkit-button", {html: "⌨ Code"}).inject(e.getChildren(".buttons")[0]);
            var togFx = new Fx.Slide(pre).hide();
            tog.addEventListener("click", function(){togFx.toggle()});
        }
    });
    var modex = window.location.hash.substring(1);
    if (modex && typeof window["run_" + modex] != "undefined") {
        window["run_" + modex]();
    }
});


// PAGER
run_pager = function () {
    if (typeof pager != "undefined") {
        pager.destroy();
        pager = undefined;
        return;
    }
    pager = new Pager({
        pages: [
            {label: "Page #1", content: "<h1>Page #1</h1><p>This is Page #1.</p>"},
            {label: "Page #2", content: "<h1>Page #2</h1><p>This is Page #2.</p>"},
            {label: "Page #3", content: "<h1>Page #3</h1><p>This is Page #3.</p>"},
            {label: "Page #4", content: "<h1>Page #4</h1><p>This is Page #4.</p>"},
            {label: "Page #5", content: "<h1>Page #5</h1><p>This is Page #5.</p>"},
            {label: "Page #6", content: "<h1>Page #6</h1><p>This is Page #6.</p>"},
            {label: "Page #7", content: "<h1>Page #7</h1><p>This is Page #7.</p>"},
            {label: "Page #8", content: "<h1>Page #8</h1><p>This is Page #8.</p>"}
        ],
        show: 4,
        container: $("sc_pager")
    });
        
}

// BUTTONARRAY
run_buttonarray = function () {
    if (typeof ba_vert1 != "undefined") {
        // remove buttonarray
        ba_vert1.destroy();
        ba_vert1 = undefined;
        ba_horiz1.destroy();
        ba_horiz1 = undefined;
        ba_vert2.destroy();
        ba_vert2 = undefined;
        ba_horiz2.destroy();
        ba_horiz2 = undefined;
        return;
    }
    ba_horiz1 = new ButtonArray({
        container: $("sc_buttonarray"),
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
        container: $("sc_buttonarray"),
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
        container: $("sc_buttonarray"),
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
        container: $("sc_buttonarray"),
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
}


// KEYBOARD
run_keyboard = function () {
    if (typeof keyboard != "undefined") {
        // remove value and keyboard
        keyboard.destroy();
        value.destroy();
        keyboard = undefined;
        $("sc_keyboard").removeClass("box");
        return;
    }
    
    value = new Value({
        container: $("sc_keyboard"),
        value: 123.97,
        format: function (val) { return val.toFixed(3) + " Hz"; },
        set: function (val) { console.log("the value was set to " + val); return val; }
    });
    value.add_event("click", function () {
        if (typeof keyboard !== "undefined") {
            keyboard.destroy()
            keyboard = undefined;
            return
        }
        keyboard = new Keyboard({
            width: 320,
            height: 240,
            container: $$("body")[0],
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
    });
    $("sc_keyboard").addClass("box");
}


// LABEL
run_label = function () {
    if (typeof label != "undefined") {
        // remove label
        label.destroy();
        label = undefined;
        $("sc_label").removeClass("box");
        return;
    }
    label = new Label({
        container: $("sc_label"),
        label: "Lorem ipsum dolor sit amet"
    });
    $("sc_label").addClass("box");
}

// SELECT
run_select = function () {
    if (typeof select != "undefined") {
        // remove example
        select.destroy();
        select = undefined;
        $("sc_select").removeClass("box");
        return;
    }
    select = new Select({
        list: [
            "haha",
            "huu",
            "höhö",
            "foo",
            "bar",
            "foobar",
            "wtf"
        ],
        container: $("sc_select"),
        selected: "bar"
    });
    $("sc_select").addClass("box");
}

// FADER
run_fader = function () {
    if (typeof faders != "undefined") {
        // remove example
        for (var i = 0; i < faders.length; i++) {
            faders[i].destroy();
        }
        faders = undefined;
        fadertt.destroy();
        $("sc_fader").removeClass("box");
        return;
    }
    faders = [];
    for (var i = 0; i < 8; i ++) {
        faders.push(new Fader({
            container: $("sc_fader"),
            min: -60,
            max: 12,
            base: 0,
            value: 0,
            scale: _TOOLKIT_DB,
            log_factor: 2,
            //snap: [-60, -50, -40, -30, -20, -10, 0, 10, 12]
        }));
    }
    fadertt = new Toggle({
        label: "Tooltips",
        container: $("sc_fader"),
        onToggled: function (state) {
            var t = state ? function (val) { return val.toFixed(2) + " dB"; } : false;
            for (var i = 0; i < faders.length; i++) {
                faders[i].set("tooltip", t);
            }
        }
    });
    $("sc_fader").addClass("box");
}

// VALUE
run_value = function () {
    if (typeof value != "undefined") {
        // remove example
        value.destroy();
        value = undefined;
        $("sc_value").removeClass("box");
        return;
    }
    value = new Value({
        container: $("sc_value"),
        value: 123.97,
        format: function (val) { return val.toFixed(3) + " Hz"; },
        set: function (val) { console.log("the value was set to " + val); return val; }
    });
    $("sc_value").addClass("box");
}


// KNOB
function run_knob () {
    if (typeof knob != "undefined") {
        // remove example
        knob.destroy();
        knob = undefined;
        knob1.destroy();
        knob2.destroy();
        return;
    }
    knob1 = new Knob({
        container: $("sc_knob"),
        size: 50,
        margin: 2,
        thickness: 3,
        min: -96,
        max: 24,
        value: -20,
        dot: {length: 3, margin: 2, width: 1},
        marker: {thickness: 3, margin: 2},
        markers: [
            {from: 0, to: 24}
        ],
        
        hand: {width: 2, length: 4, margin: 11.5},
    });
    knob = new Knob({
        container: $("sc_knob"),
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
        container: $("sc_knob"),
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
        styles: {backgroundSize: "56%"}
    });
    repositionSVGs()
}




// WINDOW

function run_window () {
    if (typeof winbutton != "undefined") {
        // remove example
        winbutton.destroy();
        winbutton = undefined;
        return;
    }
    winbutton = new Button({
        container: $("sc_window"),
        label: "Demo Window",
        icon: "images/icons_big/window.png"
    });
    winbutton.add_event("click", function () { 
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
            content: "<div style='margin: 6px'><img src=images/toolkit.png "
                   + "style=\"float: left; margin-right: 20px;\">"
                   + "Thanks for testing toolkit. We hope you like "
                   + "the functionality, complexity and style. If you have any "
                   + "sugestions or bug reports, please let us know.</div>"
        });
        var ok = new Button({
            label: "OK",
            container: win._content
        });
        ok.add_event("click", win.destroy.bind(win));
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
        // remove example
        clock.destroy();
        clock = undefined;
        return;
    }
    clock = new Clock({
        container: $("sc_clock"),
        timeout: 10
    });
    repositionSVGs()
}


// GAUGE
function run_gauge () {
    if (typeof gauge != "undefined") {
        // remove example
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
    repositionSVGs()
}


// TOGGLE

function run_toggle () {
    if (typeof toggle != "undefined") {
        // remove example
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
        // remove example
        button.destroy();
        button = undefined;
        return;
    }
    button = new Button({
        container: $("sc_button"),
        label: "Demo Button",
        icon: "images/icons_big/showcase.png"
    });
    button.add_event("click", function () { alert("clicked") });
}

// VALUE BUTTON

function run_valuebutton () {
    var vbutton = document.getElementById("sc_vbutton");
    if (typeof thres != "undefined") {
        // remove example
        thres.destroy();
        thres = undefined;
        ratio.destroy();
        ratio = undefined;
        attack.destroy();
        attack = undefined;
        release.destroy();
        release = undefined;
        vbutton.innerHTML = "";
        return;
    }
    thres = new ValueButton({
        container: vbutton,
        label: "Threshold",
        icon: "images/icons_small/threshold.png",
        value_position: _TOOLKIT_BOTTOM,
        value_format: function (val) { return val.toFixed(1) + " dB"; },
        min: -96,
        max: 24,
        step: 1,
        basis: 300,
        shift_up: 4,
        shift_down: 0.25,
        value: 0
    });
    attack = new ValueButton({
        "class": "attack",
        container: vbutton,
        label: "Attack",
        icon: "images/icons_small/attack.png",
        value_position: _TOOLKIT_BOTTOM,
        value_format: function (val) { return val.toFixed(1) + " ms"; },
        min: 1,
        max: 1000,
        step: 1,
        basis: 300,
        shift_up: 4,
        shift_down: 0.25,
        value: 100,
        scale: _TOOLKIT_FREQ
    });
    
    var br = document.createElement("br");
    vbutton.appendChild(br);
    
    ratio = new ValueButton({
        container: vbutton,
        label: "Ratio",
        icon: "images/icons_small/ratio.png",
        value_position: _TOOLKIT_BOTTOM,
        value_format: function (val) { return val.toFixed(1) + " : 1"; },
        min: 1,
        max: 10,
        step: 1,
        basis: 300,
        shift_up: 4,
        shift_down: 0.25,
        value: 2
    });
    
    release = new ValueButton({
        container: vbutton,
        label: "Release",
        icon: "images/icons_small/release.png",
        value_position: _TOOLKIT_BOTTOM,
        value_format: function (val) { return val.toFixed(1) + " ms"; },
        min: 1,
        max: 1000,
        step: 1,
        basis: 300,
        shift_up: 4,
        shift_down: 0.25,
        value: 100,
        scale: _TOOLKIT_FREQ
    });
}

// SCALE

function run_scale () {
    if (typeof scales != "undefined") {
        // remove example
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
        scale: _TOOLKIT_DB,
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
        // remove example
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
        // remove example
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
        // remove example
        comp.destroy();
        comp = undefined;
        expand.destroy();
        expand = undefined;
        dyna.destroy();
        dyna = undefined;
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
    expand = new Dynamics({
        size: 298,
        container: $("sc_dynamics"),
        type: _TOOLKIT_EXPANDER,
        threshold: -12,
        ratio: 4,
        range: -36
    });
    dyna = new Dynamics({
        size: 298,
        container: $("sc_dynamics")
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
    repositionSVGs()
}



// EQUALIZER
function run_equalizer () {
    if (typeof eq != "undefined") {
        // remove example
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
                     label: function (title, x, y, z) { return title + "\n" + x + " Hz"; } },
        {x:15000, z: 1, type:_TOOLKIT_LP4, title:"Low Pass",
                     preferences: [_TOOLKIT_TOP_LEFT, _TOOLKIT_TOP, _TOOLKIT_TOP_RIGHT,
                                   _TOOLKIT_LEFT, _TOOLKIT_CENTER, _TOOLKIT_RIGHT,
                                   _TOOLKIT_BOTTOM_LEFT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_RIGHT],
                     label: function (title, x, y, z) { return title + "\n" + x + " Hz"; } }]
    });
    repositionSVGs()
}

function run_spectralsignature () {
    if (typeof ssig != "undefined") {
        // remove example
        ssig.destroy();
        ssig = undefined;
        $("sc_ssig").removeClass("box");
        return;
    }
    $("sc_ssig").addClass("box");
    ssig = new SpectralSignature.Widget({
        container: $("sc_ssig"),
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
    repositionSVGs()
}



// RESPONSE HANDLER
function run_responsehandler () {
    if (typeof rh != "undefined") {
        // remove example
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
                       label: function(title, x, y, z){ return title + "\n" + parseInt(x) + " Hz"; }
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
                       label: function(title, x, y, z){ return title + "\n" + parseInt(x) + " Hz"; }
                       }),
        rh.add_handle({y: -24,
                       z: 3,
                       mode: _TOOLKIT_LINE_HORIZONTAL,
                       z_handle: _TOOLKIT_TOP,
                       title: "handle 8",
                       preferences: [_TOOLKIT_TOP_LEFT, _TOOLKIT_BOTTOM_LEFT, _TOOLKIT_TOP_RIGHT,
                                     _TOOLKIT_BOTTOM_RIGHT, _TOOLKIT_TOP, _TOOLKIT_BOTTOM],
                       label: function(title, x, y, z){ return title + "\n" + parseInt(y) + " dB"; }
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
                       label: function (title, x, y, z) { return title + "\n" + parseInt(y) + " dB"; }
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
                       label: function (title, x, y, z) { return title + "\n" + parseInt(x) + " Hz"; } 
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
                       label: function (title, x, y, z) { return title + "\n" + parseInt(x) + " Hz"; } 
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
                       label: function (title, x, y, z) { return title + "\n" + parseInt(x) + " Hz"; } 
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
                       label: function (title, x, y, z) { return title + "\n" + parseInt(y) + " dB"; } 
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
                       label: function (title, x, y, z) { return title + "\n" + parseInt(y) + " dB"; } 
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
                       label: function (title, x, y, z) { return title + "\n" + parseInt(y) + " dB"; } 
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
                       label: function (title, x, y, z) { return title + "\n" + parseInt(y) + " dB"; } 
                       })
    ]
    repositionSVGs()
}


// STATE

function run_state () {
    if (typeof s1 != "undefined") {
        // remove example
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
    });
    s5 = new State({
        container: $("sc_state"),
        color: "#cc0000",
        state: 1,
    });
    s6 = new State({
        container: $("sc_state"),
        color: "#ff8800",
        state: 1,
    });
    s7 = new State({
        container: $("sc_state"),
        color: "grey",
        state: 1,
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
        // remove example
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
        // remove example
        for(var i in meters) {
            meters[i].destroy();
            meters[i] = undefined;
        }
        $("sc_levelmeter_buttons").style["display"] = "none";
        return;
    }
    $("sc_levelmeter_buttons").style["display"] = "block";
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
    /*
    run1();
    run2();
    run3();
    run4();
    run5();
    run6();
    run7();
    */
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
