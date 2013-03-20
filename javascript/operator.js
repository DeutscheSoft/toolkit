window.addEvent('domready', function(){
    operator = new OperatorUI({
        title: "Microphone 1"
    });
});
OperatorUI = new Class({
    Implements: [Options],
    options: {
        on_air: false,
        clip:   false,
        level:  -96,
        mute:   false,
        state:  false,
        title:  ""
    },
    initialize: function (options) {
        this.setOptions(options);
        this.meter = new LevelMeter({
            min: -96,
            max: 24,
            value: this.options.level,
            scale_base: 0,
            levels: [1, 6, 12],
            container: $("meter_container"),
            gradient: {"-96": "#001f83", "-0.1": "#008bea", "0": "#ff6000", "24": "#ffa000"},
            show_label: true,
            show_clip: true
        });
        this.toggle = new Toggle({
            label: "Mic Active",
            label_active: "Mic Muted",
            icon: "images/icons_big/microphone.png",
            icon_active: "images/icons_big/microphone_muted.png",
            press: 200,
            press_disable: true,
            state: this.options.mute
        });
        this.on_air = new State({
            "class": "on-air",
            color: "#a00",
            state: this.options.on_air
        });
        this.state = new State({
            color: "#a00",
            state: true
        });
        this.title = new Element("h1", {html: this.options.title, id:"title"});
        this.title.inject($("mainblock"), "top");
        this.toggle.element.inject($("control_container"), "top");
        this.on_air.element.inject($("control_container"), "top");
        this.state.element.inject($("stateblock"), "bottom");
        
        window.addEvent("resize", this._resize.bind(this));
        this.toggle.addEvent("toggled", function () {
            this.options.toggle = this.toggle.get("state");
        }.bind(this));
        this.on_air.addEvent("statechanged", function () {
            this.options.on_air = this.on_air.get("state");
        }.bind(this));
        this.meter.addEvent("valuechanged", function () {
            this.options.level = this.meter.get("value");
        }.bind(this));
        
        this.set("state", this.options.state);
        
        this._resize();
    },
    
    
    _resize: function () {
        var wrap  = $("wrapper");
        var main  = $("mainblock");
        var float = $("floatblock");
        var bw = wrap.innerWidth();
        var bh = wrap.innerHeight();
        var br = bw / bh;
        console.log(bw, bh, bh / 4);
        if(br > 1) {
            // landscape
            main.outerWidth((bw / 4) * 3 - 1);
            main.outerHeight(bh);
            float.outerWidth((bw / 4) * 1 - 1);
            float.outerHeight(bh);
            wrap.removeClass("portrait");
            wrap.addClass("landscape");
        } else {
            // portrait
            main.outerWidth(bw);
            main.outerHeight((bh / 4) * 3);
            float.outerWidth(bw);
            float.outerHeight((bh / 4) * 1);
            wrap.removeClass("landscape");
            wrap.addClass("portrait");
        }
        wrap.setStyles({
            "margin-left": 0,
            "margin-top": 0
        });
        wrap.setStyles({
            "margin-left": wrap.outerWidth() / -2,
            "margin-top": wrap.outerHeight() / -2
        });
        this.meter.element.outerHeight($("meter_container").innerHeight());
        this.meter.redraw();
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        switch(key) {
            case "mute":
                this.toggle.set("state", value);
                break;
            case "level":
                this.meter.set("value", value);
                break;
            case "clip":
                this.on_air.set("state", value);
                break;
            case "state":
                this.state.set("color", value ? "#39e673" : "#f00");
                break;
            case "title":
                this.title.set("html", value);
                break;
        }
    },
});
