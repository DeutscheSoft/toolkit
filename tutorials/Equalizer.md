    function run_equalizer (root) {
        eq = new Equalizer({
            width: 908,
            height: 300,
            depth: 120,
            db_grid: 12,
            range_z: {min: 0.4, max: 4, step: 0.1, shift_up: 10, shift_down: 0.2, reverse: true},
            bands: [{x:600, y:-12, z:3, type:_TOOLKIT_PARAMETRIC,
                         z_handle: _TOOLKIT_RIGHT, title:"Band 1", z_min: 0.4, z_max: 4},
            {x:2000, y:12, z:1, type:_TOOLKIT_PARAMETRIC,
                         z_handle: _TOOLKIT_RIGHT, title:"Band 1", z_min: 0.4, z_max: 4},
            {x:200, y:-12, z:1, type:_TOOLKIT_LOWSHELF,
                         z_handle: _TOOLKIT_RIGHT, title:"Low Shelf",
                         preferences: [_TOOLKIT_TOP_RIGHT, _TOOLKIT_TOP, _TOOLKIT_TOP_LEFT,
                                       _TOOLKIT_RIGHT, _TOOLKIT_CENTER, _TOOLKIT_LEFT,
                                       _TOOLKIT_BOTTOM_RIGHT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_LEFT],
                         z_min: 0.4, z_max: 4},
            {x:7000, y: 12, z:1, type:_TOOLKIT_HIGHSHELF,
                         z_handle: _TOOLKIT_LEFT, title:"High Shelf",
                         preferences: [_TOOLKIT_TOP_LEFT, _TOOLKIT_TOP, _TOOLKIT_TOP_RIGHT,
                                       _TOOLKIT_LEFT, _TOOLKIT_CENTER, _TOOLKIT_RIGHT,
                                       _TOOLKIT_BOTTOM_LEFT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_RIGHT],
                         z_min: 0.4, z_max: 4},
            {x:40, z: 1, type:_TOOLKIT_HP2, title:"High Pass",
                         preferences: [_TOOLKIT_TOP_RIGHT, _TOOLKIT_TOP, _TOOLKIT_TOP_LEFT,
                                       _TOOLKIT_RIGHT, _TOOLKIT_CENTER, _TOOLKIT_LEFT,
                                       _TOOLKIT_BOTTOM_RIGHT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_LEFT],
                         label: function (title, x, y, z) { return title + "\n" + TK.sprintf("%.2f", x) + " Hz"; } },
            {x:15000, z: 1, type:_TOOLKIT_LP4, title:"Low Pass",
                         preferences: [_TOOLKIT_TOP_LEFT, _TOOLKIT_TOP, _TOOLKIT_TOP_RIGHT,
                                       _TOOLKIT_LEFT, _TOOLKIT_CENTER, _TOOLKIT_RIGHT,
                                       _TOOLKIT_BOTTOM_LEFT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_RIGHT],
                         label: function (title, x, y, z) { return title + "\n" + TK.sprintf("%.2f", x) + " Hz"; } }]
        });
        root.append_child(eq);
        TK.seat_all_svg()
    }

<script> prepare_example(); </script>
