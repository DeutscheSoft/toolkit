    function run_button (root) {
        button = new Button({
            label: "Demo Button",
            icon: "images/icons_big/showcase.png",
            onclick: function () { alert("clicked") }
        });
        button2 = new Button({
            label: "Demo Button",
            icon: "images/icons_big/showcase.png",
            layout: _TOOLKIT_HORIZONTAL,
            onclick: function () { alert("clicked") }
        });
        button3 = new Button({
            icon: "images/icons_big/showcase.png",
            onclick: function () { alert("clicked") }
        });
        button4 = new Button({
            label: "Demo Button",
            onclick: function () { alert("clicked") }
        });
        root.append_children([ button, button2, button3, button4 ]);
    }
<pre class='css prettyprint source'><code>
.toolkit-button .toolkit-icon {
    width: 3em;
    height: auto;
}
</code></pre>
<script> prepare_example(); </script>
