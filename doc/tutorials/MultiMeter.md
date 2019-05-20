    function run_multimeter(root) {
        mr = new TK.MultiMeter({
            count: 6,
            layout: 'right',
            scale: 'decibel',
            segment: 2,
            min: -60,
            max: 12,
            values: 18,
            scale_base: 0,
            title: 'console: mr',
            titles: ['L', 'R', 'C', 'LFE', 'LS', 'RS'],
            show_label: true,
            gradient: {&quot;-60&quot;: &quot;#001f83&quot;, &quot;-0.1&quot;: &quot;#008bea&quot;, &quot;0&quot;: &quot;#ff6000&quot;, &quot;12&quot;: &quot;#ffa000&quot;},
            levels: [1, 3, 6, 12],
            gap_labels: 20,
            format_label: TK.FORMAT("%d")
        });
        ml = new TK.MultiMeter({
            count: 6,
            layout: 'left',
            scale: 'decibel',
            segment: 2,
            min: -60,
            max: 12,
            values: 18,
            scale_base: 0,
            title: 'console: ml',
            titles: ['L', 'R', 'C', 'LFE', 'LS', 'RS'],
            show_label: true,
            gradient: {&quot;-60&quot;: &quot;#001f83&quot;, &quot;-0.1&quot;: &quot;#008bea&quot;, &quot;0&quot;: &quot;#ff6000&quot;, &quot;12&quot;: &quot;#ffa000&quot;},
            levels: [1, 3, 6, 12],
            gap_labels: 20,
            format_label: TK.FORMAT("%d"),
            show_clip: true
        });
        mb = new TK.MultiMeter({
            count: 6,
            layout: 'bottom',
            scale: 'decibel',
            segment: 2,
            min: -60,
            max: 12,
            values: 18,
            scale_base: 0,
            title: 'console: mb',
            titles: ['L', 'R', 'C', 'LFE', 'LS', 'RS'],
            show_label: true,
            gradient: {&quot;-60&quot;: &quot;#001f83&quot;, &quot;-0.1&quot;: &quot;#008bea&quot;, &quot;0&quot;: &quot;#ff6000&quot;, &quot;12&quot;: &quot;#ffa000&quot;},
            levels: [1, 3, 6, 12],
            gap_labels: 20
        });
        mt = new TK.MultiMeter({
            count: 6,
            layout: 'top',
            scale: 'decibel',
            segment: 2,
            min: -60,
            max: 12,
            values: 18,
            scale_base: 0,
            title: 'console: mt',
            titles: ['L', 'R', 'C', 'LFE', 'LS', 'RS'],
            show_label: true,
            gradient: {&quot;-60&quot;: &quot;#001f83&quot;, &quot;-0.1&quot;: &quot;#008bea&quot;, &quot;0&quot;: &quot;#ff6000&quot;, &quot;12&quot;: &quot;#ffa000&quot;},
            levels: [1, 3, 6, 12],
            gap_labels: 40,
            show_clip: true
        });
        root.append_children([mr, ml, mb, mt]);
        ml.set("value", [-6, -56, 12, 3, -24, 0]);
        mr.set("value", [6, -12, 6, 3, -3, -24]);
        mt.set("value", [-6, -56, 12, 3, -24, 0]);
        mb.set("value", [6, -12, 6, 3, -3, -24]);
        
        ml.set("clip", [0, 0, 1, 1, 0, 1]);
        mr.set("clip", [1, 0, 1, 1, 0, 0]);
        mt.set("clip", [0, 0, 1, 1, 0, 1]);
        mb.set("clip", [1, 0, 1, 1, 0, 0]);
    }
<pre class='css prettyprint source'><code>
.toolkit-multi-meter {
    
}
.toolkit-multi-meter.toolkit-vertical {
    height: 320px;
    float: left;
}
.toolkit-multi-meter.toolkit-horizontal {
    width: 320px;
    margin-left: 300px;
}
.toolkit-multi-meter.toolkit-horizontal .toolkit-level-meter {
    grid-template-columns: 24px 1fr auto 40px !important;
}
</code></pre>
<script> prepare_example(); </script>
