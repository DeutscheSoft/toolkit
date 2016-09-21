    function run_multimeter(root) {
        mv = new MultiMeter({
            count: 6,
            layout: 'left',
            scale: 'decibel',
            segment: 2,
            min: -60,
            max: 12,
            values: 18,
            scale_base: 0,
            title: "Channel 1 (mv)",
            titles: ['L', 'R', 'C', 'LFE', 'LS', 'RS'],
            show_title: true,
            show_titles: [true, true, true, true, true, true],
            show_label: true,
            gradient: {"-60": "#001f83", "-0.1": "#008bea", "0": "#ff6000", "12": "#ffa000"},
            levels: [1, 3, 6, 12],
            gap_labels: 20
        });
        root.append_child(mv);
        mh = new MultiMeter({
            count: 6,
            layout: 'bottom',
            scale: 'decibel',
            segment: 2,
            min: -60,
            max: 12,
            values: 18,
            scale_base: 0,
            title: "Channel 2 (mh)",
            titles: ['L', 'R', 'C', 'LFE', 'LS', 'RS'],
            show_title: true,
            show_titles: [true, true, true, true, true, true],
            show_label: true,
            gradient: {"-60": "#001f83", "-0.1": "#008bea", "0": "#ff6000", "12": "#ffa000"},
            levels: [1, 3, 6, 12],
            gap_labels: 20
        });
        root.append_child(mh);
    }
<pre class='css prettyprint source'><code>
.toolkit-multi-meter.toolkit-vertical {
    height: 320px;
}
.toolkit-multi-meter.toolkit-horizontal {
    width: 320px;
}
</code></pre>
<script> prepare_example(); </script>
