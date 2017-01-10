    function run_value(root) {
        value = new TK.Value({
            size: 10,
            value: 123.97,
            format: TK.FORMAT("%.3f Hz"),
            set: function (val) { val = parseFloat(val); console.log("the value was set to " + val); return val; }
        });
        root.append_child(value);
    }
<script> prepare_example(); </script>
