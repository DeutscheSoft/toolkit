    function run_levelmeter(root) {
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
        var running = false
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

    }

<script> prepare_example(); </script>
