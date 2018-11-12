    function run_valuebutton(root) {
        thres = new TK.ValueButton({
            label: "Threshold",
            icon: "images/icons_small/threshold.png",
            value_position: "bottom",
            value_format: TK.FORMAT("%.1f dB"),
            min: -96,
            max: 24,
            step: 1,
            basis: 300,
            shift_up: 4,
            shift_down: 0.25,
            value: 0,
        });

        attack = new TK.ValueButton({
            "class": "attack",
            label: "Attack",
            icon: "images/icons_small/attack.png",
            value_position: "bottom",
            value_format: TK.FORMAT("%.1f ms"),
            min: 1,
            max: 1000,
            step: 1,
            basis: 300,
            shift_up: 4,
            shift_down: 0.25,
            value: 100,
            scale: "frequency"
        });
        
        ratio = new TK.ValueButton({
            label: "Ratio",
            icon: "images/icons_small/ratio.png",
            value_position: "bottom",
            value_format: TK.FORMAT("%.1f : 1"),
            min: 1,
            max: 10,
            step: 1,
            basis: 300,
            shift_up: 4,
            shift_down: 0.25,
            value: 2
        });
        
        release = new TK.ValueButton({
            label: "Release",
            icon: "images/icons_small/release.png",
            value_position: "bottom",
            value_format: TK.FORMAT("%.1f ms"),
            min: 1,
            max: 1000,
            step: 1,
            basis: 300,
            shift_up: 4,
            shift_down: 0.25,
            value: 100,
            scale: "frequency"
        });
        
        root.append_children([ thres, attack, ratio, release ]);
    }
<pre class='css prettyprint source'><code>
.toolkit-valuebutton {
    width: 240px;
}
</code></pre>
<script> prepare_example(); </script>
