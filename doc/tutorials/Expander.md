    function run_chart (root) {
        chart = new TK.Chart({
            _collapsed: true,
            range_x: {scale: "linear", min:0, max:1},
            range_y: {scale: "linear", min:0, max:1},
            grid_x: [{pos:0.0, label:"0"},
                     {pos:0.1},
                     {pos:0.2, label:"20"},
                     {pos:0.3},
                     {pos:0.4, label:"40"},
                     {pos:0.5, label: "50", color: "rgba(255,255,255,0.66)"},
                     {pos:0.6, label:"60"},
                     {pos:0.7},
                     {pos:0.8, label:"80"},
                     {pos:0.9},
                     {pos:1.0, label:"100"}],
            grid_y: [{pos:0.0, label:"0"},
                     {pos:0.2, label:"20"},
                     {pos:0.4, label:"40"},
                     {pos:0.5, label: "50", color: "rgba(255,255,255,0.66)"},
                     {pos:0.6, label:"60"},
                     {pos:0.8, label:"80"},
                     {pos:1.0, label:"100"}],
            key: "top-left",
            title: "Click Chart for Fullscreen",
            title_position: "top-right",
        });
        cgraph1 = chart.add_graph({
            dots: [{x:0.0, y:0.0},
                   {x:0.1, y:1.0},
                   {x:0.2, y:0.5},
                   {x:0.3, y:0.7},
                   {x:0.4, y:0.2},
                   {x:0.5, y:0.8},
                   {x:0.6, y:0.9},
                   {x:0.7, y:0.5},
                   {x:0.8, y:0.6},
                   {x:0.9, y:0.2},
                   {x:1.0, y:0.0}
            ],
            type: "H3",
            mode: "bottom",
            key:  "foobar"
        });
        expander = new TK.Expander({"class":"toolkit-popup"});
        root.append_child(expander);
        expander.append_child(chart);
        TK.seat_all_svg();
    }
<pre class='css prettyprint source'><code>
.toolkit-expander {
    margin: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
}
.toolkit-chart {
    width: 100%;
    height: 100%;
}

</code></pre>
<script> prepare_example(); </script>
