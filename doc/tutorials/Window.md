    function run_window(root) {
        winbutton = new TK.Button({
            label: "Demo Window",
            icon: "images/icons_big/window.png"
        });
        root.append_child(winbutton);

        winbutton.add_event("click", function () { 
            win = new TK.Window({
                container: document.body,
                height: 233,
                width: 640,
                open: "center",
                title: "Example Window",
                status: "Integrity of the Cloud at 112%! Hull breach impending!",
                icon: "images/toolkit_win_icon.png",
                header: ["icon", "title", "maximizehorizontal", "maximizevertical", "maximize",
                               "minimize", "shrink", "close"],
                footer: ["status", "resize"],
                fixed: true,
                content: TK.html("<div style='margin: 6px; text-align: left;'><img src=images/toolkit.png "
                       + "style=\"float: left; margin-right: 20px; width:128px;height:auto\">"
                       + "Thanks for testing TK. We hope you like "
                       + "the functionality, complexity and style. If you have any "
                       + "sugestions or bug reports, please let us know.</div>")
            });
            root.add_child(win);
        });
        
    }
<script> prepare_example(); </script>
