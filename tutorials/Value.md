<pre class='javascript prettyprint source'>
    function run_value(root) {
        value = new Value({
            value: 123.97,
            format: TK.FORMAT("%.3f Hz"),
            set: function (val) { val = parseFloat(val); console.log("the value was set to " + val); return val; }
        });
        root.append_child(value);
    }
</pre>
<script> prepare_example(); </script>
