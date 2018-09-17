    function run_slider (root) {
        slider1 = new TK.Slider({
            frames: 65,
            image: "images/lata.png",
            min: 0,
            max: 128,
            value: 0
        });
        slider2 = new TK.Slider({
            frames: 65,
            image: "images/lata.png",
            min: 0,
            max: 128,
            value: 48
        });
        slider3 = new TK.Slider({
            frames: 65,
            image: "images/lata.png",
            min: 0,
            max: 128,
            value: 96
        });
        slider4 = new TK.Slider({
            frames: 65,
            image: "images/lata.png",
            min: 0,
            max: 128,
            value: 128
        });
        root.append_child(slider1);
        root.append_child(slider2);
        root.append_child(slider3);
        root.append_child(slider4);
    }
<pre class='css prettyprint source'><code>
.toolkit-slider {
    width: 64px;
    height: 64px;
    margin: 8px;
}
.toolkit-root {
    background: url(images/background_plugin.png);
}
</code></pre>
<script> prepare_example(); </script>
