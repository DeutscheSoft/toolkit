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
<pre class='css prettyprint source'>
.toolkit-fader {
    display: block;
    float: left;
    vertical-align: top;
}
.toolkit-fader:nth-child(1),
.toolkit-fader:nth-child(2) {
    height: 400px;
}
.toolkit-fader:nth-child(3),
.toolkit-fader:nth-child(4) {
    width: 400px;
}
</pre>
<script> prepare_example(); </script>

