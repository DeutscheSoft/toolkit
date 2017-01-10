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
                header_left: "icon",
                header_right: ["maximize-horizontal", "maximize-vertical", "maximize",
                               "minimize", "shrink", "close"],
                footer_left: "status",
                fixed: true,
                content: TK.html("<div style='margin: 6px'><img src=images/toolkit.png "
                       + "style=\"float: left; margin-right: 20px; width:128px;height:auto\">"
                       + "Thanks for testing TK. We hope you like "
                       + "the functionality, complexity and style. If you have any "
                       + "sugestions or bug reports, please let us know.</div>")
            });
            var ok = new TK.Button({
                label: "OK",
            });
            win.append_child(ok);
            ok.add_event("click", win.destroy.bind(win));
            TK.set_styles(ok.element, {
                position: "absolute",
                bottom: 0,
                right: 0
            });
            root.add_child(win);
        });
    }
<script> prepare_example(); </script>
