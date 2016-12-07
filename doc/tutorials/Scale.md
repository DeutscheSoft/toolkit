    function run_scale(root) {
        scales = {};
        scales.left = new Scale({
            layout: "left",
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
            layout: "right",
            division: 1,
            levels: [1, 6, 12],
            min: -96,
            max: +24,
            base: 0,
            basis: 200,
            id: "sc_scale_v_r"
        })
        scales.top = new Scale({
            layout: "top",
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
            layout: "bottom",
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
    position: absolute;
}
#sc_scale_v_l {
    height: calc(100% - 60px);
    top: 30px;
    left: 10px;
}
#sc_scale_v_r {
    height: calc(100% - 60px);
    top: 30px;
    right: 10px;
    
}
#sc_scale_h_t {
    width: calc(100% - 94px);
    left: 47px;
    top: 10px;
}
#sc_scale_h_b {
    width: calc(100% - 94px);
    left: 47px;
    bottom: 10px;
}
</code></pre>
<script> prepare_example(); </script>
