    function run_frequencyresponse(root) {
        fr = new TK.FrequencyResponse({
            db_grid: 12
        });
        frgraph = fr.add_graph({
            dots: [{x:20, y:0.0},
                   {x:100, y:24},
                   {x:200, y:-12},
                   {x:500, y:0},
                   {x:1000, y:0},
                   {x:4000, y:30},
                   {x:20000, y:-36}
            ],
            type: "H4",
            mode: "line"
        });
        root.append_child(fr);
        TK.seat_all_svg()
    }
<pre class='css prettyprint source'><code>
.toolkit-frequency-response {
    margin: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
}
</code></pre>
<script> prepare_example(); </script>
