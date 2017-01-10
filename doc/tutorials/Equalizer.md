    function run_equalizer (root) {
        eq = new TK.Equalizer({
            styles: {
                "margin": "10px",
            },
            width: "calc(100% - 20px)",
            height: "calc(100% - 20px)",
            depth: 120,
            db_grid: 12,
            range_z: {min: 0.4, max: 4, step: 0.1, shift_up: 10, shift_down: 0.2, reverse: true},
            bands: [{x:600, y:-12, z:3, type:"parametric",
                         z_handle: "right", title:"Band 1", z_min: 0.4, z_max: 4},
            {x:2000, y:12, z:1, type:"parametric",
                         z_handle: "right", title:"Band 1", z_min: 0.4, z_max: 4},
            {x:200, y:-12, z:1, type:"low-shelf",
                         z_handle: "right", title:"Low Shelf",
                         preferences: ["top-right", "top", "top-left",
                                       "right", "center", "left",
                                       "bottom-right", "bottom", "bottom-left"],
                         z_min: 0.4, z_max: 4},
            {x:7000, y: 12, z:1, type:"high-shelf",
                         z_handle: "left", title:"High Shelf",
                         preferences: ["top-left", "top", "top-right",
                                       "left", "center", "right",
                                       "bottom-left", "bottom", "bottom-right"],
                         z_min: 0.4, z_max: 4},
            {x:40, z: 1, type:"lowpass2", title:"High Pass",
                         preferences: ["top-right", "top", "top-left",
                                       "right", "center", "left",
                                       "bottom-right", "bottom", "bottom-left"],
                         label: function (title, x, y, z) { return title + "\n" + TK.sprintf("%.2f", x) + " Hz"; } },
            {x:15000, z: 1, type:"lowpass4", title:"Low Pass",
                         preferences: ["top-left", "top", "top-right",
                                       "left", "center", "right",
                                       "bottom-left", "bottom", "bottom-right"],
                         label: function (title, x, y, z) { return title + "\n" + TK.sprintf("%.2f", x) + " Hz"; } }]
        });
        root.append_child(eq);
        TK.seat_all_svg()
    }
<pre class='css prettyprint source'><code>
.toolkit-equalizer {
    margin: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
}
</code></pre>

<script> prepare_example(); </script>
