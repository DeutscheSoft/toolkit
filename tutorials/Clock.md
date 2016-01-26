<pre class='javascript prettyprint source'>
    function run_clock (root) {
        clock = new Clock();
        root.append_child(clock);
        TK.seat_all_svg()
    }
</pre>
<pre class='css prettyprint source'>
.toolkit-clock {
    width: 40%;
    height: 40%;
}
</pre>
<script> prepare_example(); </script>
