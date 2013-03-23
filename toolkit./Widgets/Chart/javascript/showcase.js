window.addEvent("domready", function () {
    c = new Chart({
        width: 948,
        height: 300,
        container: $("sc_chart"),
        mode_x: 1,
        mode_y: 1,
        grid_x: [{pos:0.0, label:"0"},
                 {pos:0.1},
                 {pos:0.2, label:"20"},
                 {pos:0.3},
                 {pos:0.4, label:"40"},
                 {pos:0.5, label: "50", color: "#c00"},
                 {pos:0.6, label:"60"},
                 {pos:0.7},
                 {pos:0.8, label:"80"},
                 {pos:0.9},
                 {pos:1.0, label:"100"}],
        grid_y: [{pos:0.0, label:"0"},
                 {pos:0.2, label:"20"},
                 {pos:0.4, label:"40"},
                 {pos:0.5, label: "50", color: "#c00"},
                 {pos:0.6, label:"60"},
                 {pos:0.8, label:"80"},
                 {pos:1.0, label:"100"}]
        
    });
    g1 = c.add_graph({
        dots: [{x:0.0, y:0.0},
               {x:0.1, y:1.0},
               {x:0.2, y:0.5},
               {x:0.3, y:0.7},
               {x:0.4, y:0.2},
               {x:0.5, y:0.8},
               {x:0.6, y:0.9},
               {x:0.7, y:0.5},
               {x:0.8, y:0.6},
               {x:0.9, y:0.2},
               {x:1.0, y:0.0}
        ],
        type: "H3",
        mode: 1
    });
    g2 = c.add_graph({
        dots: [{x:0.0, y:0.5},
               {x:0.2, y:0.1},
               {x:0.4, y:0.5},
               {x:0.6, y:0.4},
               {x:0.8, y:0.3},
               {x:1.0, y:0.9}
        ],
    });
});
