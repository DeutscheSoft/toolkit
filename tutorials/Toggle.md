    function run_toggle(root) {
        toggle = new Toggle({
            label: "Mic Active",
            label_active: "Mic Muted",
            icon: "images/icons_big/microphone.png",
            icon_active: "images/icons_big/microphone_muted.png"
        });
        press = new Toggle({
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
<pre class='css prettyprint source'>
.toolkit-toggle {
    margin-right: 10px;
}
</pre>
<script> prepare_example(); </script>
