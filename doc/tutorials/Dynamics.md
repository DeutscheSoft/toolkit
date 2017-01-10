    function run_dynamics (root) {
        comp = new TK.Dynamics({
            size: 298,
        });
        gcomp = comp.add_graph({
            dots: [{x:-96, y:-72},
                   {x:-24, y:0},
                   {x:24, y: 12},
            ],
            mode: "line"
        });
        expand = new TK.Dynamics({
            size: 298,
            type: "expander",
            threshold: -12,
            ratio: 4,
            range: -36
        });
        dyna = new TK.Dynamics({
            size: 298,
        });
        gdyna = dyna.add_graph({
            dots: [{x:-60, y:-96},
                   {x:-48, y:-48},
                   {x:-36, y:-24},
                   {x:-12, y:-12},
                   {x:24, y:-8}
            ],
            mode: "line"
        });
        root.append_children([ comp, expand, dyna ]);
        TK.seat_all_svg()
    }
<pre class='css prettyprint source'><code>
.toolkit-dynamics {
    width: 40%;
    height: 40%;
}
</code></pre>
<script> prepare_example(); </script>
