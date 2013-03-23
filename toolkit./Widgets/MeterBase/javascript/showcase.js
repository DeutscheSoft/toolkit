window.addEvent('domready', function(){
    mbvl = new MeterBase({
        container: $$("#sc_meterbase")[0],
        layout: 2,
        segment: 2,
        min: -96,
        max: 24,
        value: 18,
        scale_base: 0,
        title: "left",
        show_title: true,
        show_label: true,
        gradient: {"-96": "#001f83", "-0.1": "#008bea", "0": "#ff6000", "24": "#ffa000"},
        levels: [1, 6, 12],
        gap_labels: 30
    });
    mbvr = new MeterBase({
        container: $$("#sc_meterbase")[0],
        layout: 1,
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
        container: $$("#sc_meterbase")[0],
        layout: 4,
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
        container: $$("#sc_meterbase")[0],
        layout: 3,
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
});