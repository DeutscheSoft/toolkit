    function run_scale(root) {
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
<pre class='css prettyprint source'><code>
.toolkit-scale {
    display: block;
}
</code></pre>
<script> prepare_example(); </script>
