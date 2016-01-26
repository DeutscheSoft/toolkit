    function run_valueknob(root) {
        valueknob = new ValueKnob({
            min: -100,
            max: 100,
            value: -20,
            snap: 0.01
        });
        root.append_child(valueknob);
    }
<script> prepare_example(); </script>
