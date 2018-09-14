    function run_confirmbutton (root) {
        confirm = new TK.ConfirmButton({
            label: "Do something unsafe",
            icon: "gear",
            label_confirm: "Are you sure?",
            icon_confirm: "questionmark",
            onconfirmed: function () { alert("Something unsafe was done!") }
        });
        root.append_child(confirm);
    }
<pre class='css prettyprint source'><code>
.toolkit-button {
    width: 180px;
}
</code></pre>
<script> prepare_example(); </script>
