    function run_valuebutton(root) {
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
<pre class='css prettyprint source'>
.toolkit-valuebutton {
    width: 220px;
}
</pre>
<script> prepare_example(); </script>
