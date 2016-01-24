    function run_select(root) {
        select = new Select({
            entries: [
                {title:"haha", value:11},
                {title:"huu", value:12},
                {title:"h&ouml;h&ouml;", value:13},
                {title:"foo", value:14},
                {title:"bar", value:15},
                {title:"foobar",value:16},
                {title:"wtf",value:17}
            ],
            selected: 4
        });
        root.append_child(select);
    }

<script> prepare_example(); </script>
