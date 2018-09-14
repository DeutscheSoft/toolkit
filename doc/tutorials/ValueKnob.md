    function run_valueknob(root) {
        valueknob = new TK.ValueKnob({
            min: -100,
            max: 100,
            value: -20,
            base: 0,
            snap: 0.01,
            label: "Value",
            show_label: true
        });
        root.append_child(valueknob);
    }
<script> prepare_example(); </script>
