    function run_knob(root) {
        knob1 = new TK.Knob({
            id: "knob1",
            min: -96,
            max: 24,
            value: -20,
            markers: [
                {from: 0, to: 24}
            ],
            dots: [
                {pos: -96}, {pos: -84}, {pos: -72}, {pos: -60}, {pos: -48}, {pos: -36}, {pos: -24},
                {pos: -12}, {pos: 0}, {pos: 12}, {pos: 24}
            ],
            labels: [
                {pos: -96}, {pos: -72}, {pos: -48}, {pos: -24}, {pos: -12}, {pos: 0, label: "\u00B10"}, {pos: 12}, {pos: 24}
            ]
        });
        knob2 = new TK.Knob({
            id: "knob2",
            margin: 0,
            thickness: 4,
            min: 20,
            max: 20000,
            value: 1000,
            scale: "frequency",
            dot: {length: 4, margin: 0, width: 1},
            label: {align: "inner", margin: 3},
            dots: [
                {pos: 20}, {pos: 30}, {pos: 40}, {pos: 50}, {pos: 60}, {pos: 70}, {pos: 80}, {pos: 90},
                {pos: 100}, {pos: 200}, {pos: 300}, {pos: 400}, {pos: 500}, {pos: 600}, {pos: 700}, {pos: 800}, {pos: 900},
                {pos: 1000}, {pos: 2000}, {pos: 3000}, {pos: 4000}, {pos: 5000}, {pos: 6000}, {pos: 7000}, {pos: 8000}, {pos: 9000},
                {pos: 10000}, {pos: 20000}
            ],
            labels: [
                {pos: 20}, {pos: 100}, {pos: 1000, label: "1k"}, {pos: 2000, label: "2k"}, {pos: 3000, label: "3k"}, {pos: 4000, label: "4k"},
                {pos: 10000, label: "10k"}, {pos: 20000, label:"20k"}
            ],
            hand: {width: 3, length: 3, margin: 24},
            styles: {backgroundImage: "url(images/knob2.png)"}
        });
        root.append_children([ knob1, knob2 ]);
    }
<pre class='css prettyprint source'><code>
.toolkit-knob {
    margin: 10px;
}

#knob1 {
    width: 80px;
    height: 80px;
}

#knob2 {
    width: 120px;
    heigh: 120px;
    background-size: 75%;
}
#knob2 .toolkit-value {
    fill: rgba(0, 47, 66, 1);
}
#knob2 .toolkit-warn .toolkit-value {
    fill: #c00;
}
#knob2 .toolkit-dot {
    fill: white;
}
#knob2 .toolkit-base {
    fill: rgba(0, 47, 66, 0.5);
}

</code></pre>
<script> prepare_example(); </script>
