    function run_pager(root) {
        pager1 = new Pager({
            pages: [
                {label: "Page #1", content: TK.html("<h1>Page #1</h1><p>This is Page #1.</p>") },
                {label: "Page #2", content: TK.html("<h1>Page #2</h1><p>This is Page #2.</p>") },
                {label: "Page #3", content: TK.html("<h1>Page #3</h1><p>This is Page #3.</p>") },
                {label: "Page #4", content: TK.html("<h1>Page #4</h1><p>This is Page #4.</p>") },
                {label: "Page #5", content: TK.html("<h1>Page #5</h1><p>This is Page #5.</p>") },
                {label: "Page #6", content: TK.html("<h1>Page #6</h1><p>This is Page #6.</p>") },
                {label: "Page #7", content: TK.html("<h1>Page #7</h1><p>This is Page #7.</p>") },
                {label: "Page #8", content: TK.html("<h1>Page #8</h1><p>This is Page #8.</p>") },
                {label: "Page #9", content: TK.html("<h1>Page #9</h1><p>This is Page #9.</p>") },
                {label: "Page #10", content: TK.html("<h1>Page #10</h1><p>This is Page #10.</p>") },
                {label: "Page #11", content: TK.html("<h1>Page #11</h1><p>This is Page #11.</p>") },
                {label: "Page #12", content: TK.html("<h1>Page #12</h1><p>This is Page #12.</p>") }
            ],
            show: 4,
            position: _TOOLKIT_RIGHT,
            "class": "pager-newspaper",
        });
        pager2 = new Pager({
            pages: [
                {label: "Page #1", content: TK.html("<h1>Page #1</h1><p>This is Page #1.</p>") },
                {label: "Page #2", content: TK.html("<h1>Page #2</h1><p>This is Page #2.</p>") },
                {label: "Page #3", content: TK.html("<h1>Page #3</h1><p>This is Page #3.</p>") },
                {label: "Page #4", content: TK.html("<h1>Page #4</h1><p>This is Page #4.</p>") },
                {label: "Page #5", content: TK.html("<h1>Page #5</h1><p>This is Page #5.</p>") },
                {label: "Page #6", content: TK.html("<h1>Page #6</h1><p>This is Page #6.</p>") },
                {label: "Page #7", content: TK.html("<h1>Page #7</h1><p>This is Page #7.</p>") },
                {label: "Page #8", content: TK.html("<h1>Page #8</h1><p>This is Page #8.</p>") },
                {label: "Page #9", content: TK.html("<h1>Page #9</h1><p>This is Page #9.</p>") },
                {label: "Page #10", content: TK.html("<h1>Page #10</h1><p>This is Page #10.</p>") },
                {label: "Page #11", content: TK.html("<h1>Page #11</h1><p>This is Page #11.</p>") },
                {label: "Page #12", content: TK.html("<h1>Page #12</h1><p>This is Page #12.</p>") }
            ],
            show: 4,
        });
        root.append_child(pager1);
        root.append_child(pager2);
    }
<pre class='css prettyprint source'><code>
.toolkit-pager {
    width: 100%;
    height: 200px;
    margin-bottom: 30px;
}
</code></pre>
<script> prepare_example(); </script>
