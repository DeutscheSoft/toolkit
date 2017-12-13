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
            title: &quot;Channel 0 (mr)&quot;,
            titles: ['L', 'R', 'C', 'LFE', 'LS', 'RS'],
            show_title: true,
            show_titles: [true, true, true, true, true, true],
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
            title: &quot;Channel 1 (ml)&quot;,
            titles: ['L', 'R', 'C', 'LFE', 'LS', 'RS'],
            show_title: true,
            show_titles: [true, true, true, true, true, true],
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
            title: &quot;Channel 2 (mb)&quot;,
            titles: ['L', 'R', 'C', 'LFE', 'LS', 'RS'],
            show_title: true,
            show_titles: [true, true, true, true, true, true],
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
            title: &quot;Channel 3 (mt)&quot;,
            titles: ['L', 'R', 'C', 'LFE', 'LS', 'RS'],
            show_title: true,
            show_titles: [true, true, true, true, true, true],
            show_label: true,
            gradient: {&quot;-60&quot;: &quot;#001f83&quot;, &quot;-0.1&quot;: &quot;#008bea&quot;, &quot;0&quot;: &quot;#ff6000&quot;, &quot;12&quot;: &quot;#ffa000&quot;},
            levels: [1, 3, 6, 12],
            gap_labels: 40,
            show_clip: true
        });
        root.append_children([mr, ml, mb, mt]);
        ml.set("values", [-6, -56, 12, 3, -24, 0]);
        mr.set("values", [6, -12, 6, 3, -3, -24]);
        mt.set("values", [-6, -56, 12, 3, -24, 0]);
        mb.set("values", [6, -12, 6, 3, -3, -24]);
        
        ml.set("clips", [0, 0, 1, 1, 0, 1]);
        mr.set("clips", [1, 0, 1, 1, 0, 0]);
        mt.set("clips", [0, 0, 1, 1, 0, 1]);
        mb.set("clips", [1, 0, 1, 1, 0, 0]);
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
    display: block;
    margin-left: 300px;
}
</code></pre>
<script> prepare_example(); </script>
