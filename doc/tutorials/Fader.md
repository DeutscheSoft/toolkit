    function run_fader(root) {
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
            fixed_dots: [60, 40, 20, 0, -20, -40, -60, -80, -120, -160, -200, -280, -580],
            fixed_labels: [60, 40, 20, 0, -20, -40, -60, -80, -120, -160, -200, -280, -580],
            scale:"decibel"
        }
        options.layout = "right";
        faders.push(new TK.Fader(options));
        
        options.layout = "left";
        faders.push(new TK.Fader(options));
        
        options.layout = "bottom";
        faders.push(new TK.Fader(options));
        
        options.layout = "top";
        faders.push(new TK.Fader(options));
        
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
<pre class='css prettyprint source'><code>
.toolkit-fader {
    vertical-align: top;
    display: block;
    float: left;
}
.toolkit-fader:nth-child(2),
.toolkit-fader:nth-child(3) {
    height: 400px;
}
.toolkit-fader:nth-child(4),
.toolkit-fader:nth-child(5) {
    width: 400px;
}
</code></pre>
<script> prepare_example(); </script>
