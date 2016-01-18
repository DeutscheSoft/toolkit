    function run_state(root) {
        s1 = new State({ });
        s2 = new State({ color: "#00ff00"
        });
        s3 = new State({
            color: "blue",
            state: 1
        });
        s4 = new State({
            color: "blue",
            state: 1,
        });
        s5 = new State({
            color: "#cc0000",
            state: 1,
        });
        s6 = new State({
            color: "#ff8800",
            state: 1,
        });
        s7 = new State({
            color: "grey",
            state: 1,
        });
        s8 = new State({
            color: "#d00",
            state: 0,
            "class": "on_air",
            onClick: function () { this.set("state", !this.get("state")) }
        });

        root.append_children([ s1, s2, s3, s4, s5, s6, s7, s8 ]);

        var _s1 = 0;
        var _s2 = 0;
        var _s3 = 0;

        function __s1 () {
            if (!s1) return;
            _s1 = !_s1;
            s1.set("state", _s1);
            if(s1)
                window.setTimeout(__s1, 1000);
        }

        function __s2 () {
            if (!s2) return;
            if (s2.get("state") >= 1)
                _s2 = -0.02;
            else if (s2.get("state") <= 0)
                _s2 = 0.02;
            s2.set("state", s2.get("state") + _s2);
            if(s2)
                window.setTimeout(__s2, 20);
        }

        function __s3 () {
            if (!s3) return;
            _s3 = !_s3;
            s3.set("color", _s3 ? "#def" : "#0af");
            if(s3)
                window.setTimeout(__s3, 500);
        }

        __s1();
        __s2();
        __s3();
    }

<script> prepare_example(); </script>
