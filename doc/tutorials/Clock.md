    function run_clock (root) {
        clock = new Clock();
        root.append_child(clock);
        TK.seat_all_svg()
    }
<pre class='css prettyprint source'><code>
.toolkit-clock {
    width: 40%;
    height: 40%;
}
</code></pre>
<script> prepare_example(); </script>
