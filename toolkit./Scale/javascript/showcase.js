window.addEvent('domready', function(){
    svl = new Scale({
        container: $$("#sc_scale_v_l")[0],
        layout: 1,
        division: 1,
        levels: [1, 6, 12],
        min: -96,
        max: +24,
        base: 0,
        size: 200
    })
    svr = new Scale({
        container: $$("#sc_scale_v_r")[0],
        layout: 2,
        division: 1,
        levels: [1, 6, 12],
        min: -96,
        max: +24,
        base: 0,
        size: 200
    })
    sht = new Scale({
        container: $$("#sc_scale_h_t")[0],
        layout: 3,
        division: 1,
        levels: [1, 6, 12],
        min: -24,
        max: +24,
        base: 0,
        size: 750,
        gap_labels: 50
    })
    shb = new Scale({
        container: $$("#sc_scale_h_b")[0],
        layout: 4,
        division: 1,
        levels: [1, 6, 12],
        min: -24,
        max: +24,
        base: 0,
        size: 750,
        gap_labels: 50
    })
});