    function run_toggle(root) {
        toggle = new TK.Toggle({
            label: "Mic Active",
            label_active: "Mic Muted",
            icon: "images/icons_big/microphone.png",
            icon_active: "images/icons_big/microphone_muted.png"
        });
        press = new TK.Toggle({
            label: "Mic Active",
            label_active: "Mic Muted",
            icon: "images/icons_big/microphone.png",
            icon_active: "images/icons_big/microphone_muted.png",
            press: 200,
            toggle: true
        });
        root.append_child(toggle);
        root.append_child(press);
    }
<pre class='css prettyprint source'><code>
.toolkit-toggle {
    margin-right: 10px;
}
</code></pre>
<script> prepare_example(); </script>
