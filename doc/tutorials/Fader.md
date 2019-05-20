    function run_fader(root) {
        function delay (v) {
            var t = this;
            setTimeout( function () {
                if (parseInt(t.options.id) > 1)
                    t.set("pointer", v);
                else
                    t.set("bar", v);
            }, 200);
        }
        faders = [];
        var options = {
            id: "0",
            min: -580,
            max: 60,
            value: 0,
            labels: TK.FORMAT("%d", "%/4"),
            format: TK.FORMAT("%.2fdB", "%/4"),
            "value.set": function (v) { return parseFloat(v)*4; },
            tooltip: false,
            step: 1,
            base: 0,
            gap_dots: 5,
            gap_labels: 20,
            log_factor: 2,
            division: 1,
            snap: 1,
            scale:"decibel",
            show_label: true,
            show_value: true,
            bar: 0,
            onset_value: function (v) { delay.call(this, v); },
            bind_click: true,
        }
        options.layout = "right";
        options.label = "Left";
        options.id = "0";
        options.fixed_dots = [60, 40, 20, 0, -20, -40, -60, -80, -120, -160, -200, -280, -580];
        options.fixed_labels = [60, 40, 20, 0, -20, -40, -60, -80, -120, -160, -200, -280, -580];
        faders.push(new TK.Fader(options));
        
        options.layout = "left";
        options.label = "Right";
        options.id = "1";
        faders.push(new TK.Fader(options));
        
        options.layout = "bottom";
        options.label = "Left";
        options.id = "2";
        options.fixed_dots = false;
        options.fixed_labels = false;
        options.gap_labels = 20;
        options.levels = [4, 20];
        options.bar = false;
        options.pointer = 0;
        faders.push(new TK.Fader(options));
        
        options.layout = "top";
        options.label = "Right";
        options.id = "3";
        faders.push(new TK.Fader(options));
        
        root.append_children(faders);

        fadertt = new TK.Toggle({
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
<pre class='css prettyprint source'><code>
.toolkit-fader {
    vertical-align: top;
    display: block;
    float: left;
    margin: 8px;
}
.toolkit-fader:nth-child(2),
.toolkit-fader:nth-child(3) {
    height: 400px;
}
.toolkit-fader:nth-child(4),
.toolkit-fader:nth-child(5) {
    width: 400px;
}
.toolkit-fader .toolkit-input {
    font-size: 12px !important;
}
</code></pre>
<script> prepare_example(); </script>
