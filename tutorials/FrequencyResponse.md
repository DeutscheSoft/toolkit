    function run_frequencyresponse(root) {
        fr = new FrequencyResponse({
            width: 906,
            height: 300,
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
            mode: _TOOLKIT_LINE
        });
        root.append_child(fr);
        TK.seat_all_svg()
    }

<script> prepare_example(); </script>
