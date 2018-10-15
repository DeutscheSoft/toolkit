    function run_button (root) {
        button = new TK.Button({
            label: "Demo Button",
            icon: "images/icons_big/showcase.png",
            onclick: function () { alert("clicked") }
        });
        button2 = new TK.Button({
            label: "Demo Button",
            icon: "warning",
            layout: "horizontal",
            onclick: function () { alert("clicked") }
        });
        button3 = new TK.Button({
            icon: "message",
            onclick: function () { alert("clicked") }
        });
        button4 = new TK.Button({
            label: "Demo Button",
            onclick: function () { alert("clicked") }
        });
        root.append_children([ button, button2, button3, button4 ]);
    }
<script> prepare_example(); </script>
