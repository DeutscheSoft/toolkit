    function run_buttonarray(root) {
        ba_horiz1 = new ButtonArray({
            buttons: [
                {label: "Button 1"},
                {label: "Button 2"},
                {label: "Button 3"},
                {label: "Button 4"},
                {label: "Button 5"},
                {label: "Button 6"},
                //{label: "Button 7"},
                //{label: "Button 8"},
                //{label: "Button 9"},
                //{label: "Button 10"},
                //{label: "Button 11"},
                //{label: "Button 12"},
                //{label: "Button 13"},
                //{label: "Button 14"},
                //{label: "Button 15"},
                //{label: "Button 16"}
            ],
            show: 3
        });
        ba_horiz2 = new ButtonArray({
            buttons: [
                {label: "Button 1"},
                {label: "Button 2"},
                {label: "Button 3"},
                {label: "Button 4"},
                {label: "Button 5"},
                {label: "Button 6"},
                {label: "Button 7"},
                {label: "Button 8"},
                {label: "Button 9"},
                {label: "Button 10"},
                {label: "Button 11"},
                {label: "Button 12"},
                {label: "Button 13"},
                {label: "Button 14"},
                {label: "Button 15"},
                {label: "Button 16"}
            ],
            show: 1
        });
        ba_vert1 = new ButtonArray({
            direction: _TOOLKIT_VERT,
            buttons: [
                {label: "Button 1"},
                {label: "Button 2"},
                {label: "Button 3"},
                {label: "Button 4"},
                {label: "Button 5"},
                {label: "Button 6"},
                {label: "Button 7"},
                {label: "Button 8"},
                {label: "Button 9"},
                //{label: "Button 10"},
                //{label: "Button 11"},
                //{label: "Button 12"},
                //{label: "Button 13"},
                //{label: "Button 14"},
                //{label: "Button 15"},
                //{label: "Button 16"}
            ],
            show: 8
        });
        ba_vert2 = new ButtonArray({
            direction: _TOOLKIT_VERT,
            buttons: [
                {label: "Button 1"},
                {label: "Button 2"},
                {label: "Button 3"},
                {label: "Button 4"},
                {label: "Button 5"},
                {label: "Button 6"},
                {label: "Button 7"},
                {label: "Button 8"},
                {label: "Button 9"},
                {label: "Button 10"},
                {label: "Button 11"},
                {label: "Button 12"},
                {label: "Button 13"},
                {label: "Button 14"},
                {label: "Button 15"},
                {label: "Button 16"}
            ],
            show: 15
        });
        root.append_child(ba_vert1);
        root.append_child(ba_horiz1);
        root.append_child(ba_vert2);
        root.append_child(ba_horiz2);
    }
<pre class='css prettyprint source'><code>
.toolkit-buttonarray.toolkit-vertical {
    height: 400px;
    margin-right: 20px;
    float: left;
}
.toolkit-buttonarray.toolkit-horizontal {
    width: 75%;
    float: right;
    margin-bottom: 20px;
}
</code></pre>
<script> prepare_example(); </script>
