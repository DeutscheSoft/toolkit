    function run_clock (root) {
        clock = new Clock();
        root.append_child(clock);
        TK.seat_all_svg()
    }

<script> prepare_example(); </script>
