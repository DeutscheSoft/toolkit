<pre class='javascript prettyprint source'>
    function run_meterbase(root) {
        mbvl = new MeterBase({
            layout: _TOOLKIT_RIGHT,
            scale: _TOOLKIT_DECIBEL,
            segment: 2,
            min: -60,
            max: 3,
            value: 18,
            scale_base: 0,
            title: "left",
            show_title: true,
            show_label: true,
            gradient: {"-96": "#001f83", "-0.1": "#008bea", "0": "#ff6000", "24": "#ffa000"},
            levels: [1, 3, 6, 12],
            gap_labels: 20
        });
        mbvr = new MeterBase({
            layout: _TOOLKIT_LEFT,
            segment: 2,
            min: -96,
            max: 24,
            value: 6,
            scale_base: 0,
            title: "right",
            show_title: true,
            show_label: true,
            gradient: {"-96": "#001f83", "-0.1": "#008bea", "0": "#ff6000", "24": "#ffa000"},
            levels: [1, 6, 12],
            gap_labels: 30
        });
        mbhb = new MeterBase({
            layout: _TOOLKIT_BOTTOM,
            segment: 2,
            min: -15,
            max: 15,
            value: -6.25,
            base: 0,
            scale_base: 0,
            title: "left",
            show_title: true,
            show_label: true,
            gradient: {"-15": "#001f83", "0": "#008bea", "15": "#001f83"},
            levels: [1, 5]
        });
        mbht = new MeterBase({
            layout: _TOOLKIT_TOP,
            segment: 2,
            min: -15,
            max: 15,
            value: 12.5,
            base: 0,
            scale_base: 0,
            title: "right",
            show_title: true,
            show_label: true,
            gradient: {"-15": "#001f83", "0": "#008bea", "15": "#001f83"},
            levels: [1, 5]
        });
        root.append_children([ mbvl, mbvr, mbhb, mbht ]);
    }
</pre>
<pre class='css prettyprint source'>
.toolkit-meter-base.toolkit-vertical {
    height: 280px;
    float: left;
}
.toolkit-meter-base.toolkit-horizontal {
    width: 500px;
    float: left;
    height: 137px;
}
</pre>
<script> prepare_example(); </script>
