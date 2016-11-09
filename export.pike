string DIR = dirname(__FILE__);

array(string) input_files = ({
    "toolkit/polyfill/raf.js",
    "toolkit/G.js",
    "toolkit/toolkit.js",
    "toolkit/implements/base.js",
    "toolkit/implements/audiomath.js",
    "toolkit/implements/anchor.js",
    "toolkit/implements/ranges.js",
    "toolkit/implements/globalcursor.js",
    "toolkit/implements/ranged.js",
    "toolkit/implements/warning.js",
    "toolkit/implements/gradient.js",
    "toolkit/implements/notes.js",
    "toolkit/widgets/widget.js",
    "toolkit/widgets/tooltips.js",
    "toolkit/modules/grid.js",
    "toolkit/modules/range.js",
    "toolkit/modules/scale.js",
    "toolkit/modules/scrollvalue.js",
    "toolkit/modules/graph.js",
    "toolkit/modules/circular.js",
    "toolkit/modules/filter.js",
    "toolkit/modules/resize.js",
    "toolkit/modules/responsehandle.js",
    "toolkit/modules/eqband.js",
    "toolkit/modules/dragvalue.js",
    "toolkit/modules/drag.js",
    "toolkit/widgets/container.js",
    "toolkit/widgets/root.js",
    "toolkit/widgets/button.js",
    "toolkit/widgets/valuebutton.js",
    "toolkit/widgets/buttonarray.js",
    "toolkit/widgets/clock.js",
    "toolkit/widgets/state.js",
    "toolkit/widgets/pager.js",
    "toolkit/widgets/expander.js",
    "toolkit/widgets/meterbase.js",
    "toolkit/widgets/levelmeter.js",
    "toolkit/widgets/chart.js",
    "toolkit/widgets/dynamics.js",
    "toolkit/widgets/gauge.js",
    "toolkit/widgets/frequencyresponse.js",
    "toolkit/widgets/responsehandler.js",
    "toolkit/widgets/equalizer.js",
    "toolkit/widgets/fader.js",
    "toolkit/widgets/value.js",
    "toolkit/widgets/label.js",
    "toolkit/widgets/knob.js",
    "toolkit/widgets/valueknob.js",
    "toolkit/widgets/select.js",
    "toolkit/widgets/window.js",
    "toolkit/widgets/toggle.js",
    "toolkit/widgets/multimeter.js",
});

string find_name(string line) {
    if (-1 == search(line, "$class")) return 0;
    array(string) tmp = line / "=";

    tmp = map(tmp, String.trim_all_whites);

    array tmp2;

    tmp2 = filter(tmp, has_prefix, "TK.");
    if (sizeof(tmp2)) return tmp2[0][3..];
    tmp2 = filter(tmp, has_prefix, "w.TK.");
    if (sizeof(tmp2)) return tmp2[0][5..];
    return 0;
}

string filter_comment(string in) {
    String.Buffer out = String.Buffer();

    for (int i = 0; i < sizeof(in); i++) {
        int c = in[i];

        if (c == '/' && i+1 < sizeof(in)) {
            if (in[i+1] == '/') {
                int end = search(in, '\n', i);
                if (end == -1) error("EOF in comment\n");
                i = end;
                continue;
            } else if (in[i+1] == '*') {
                int end = search(in, "*/", i+2);
                if (end == -1) error("EOF in comment\n");
                i = end;
                continue;
            }
        }
        out->putchar(c);
    }

    return out->get();
}

int main(int argc, array(string) argv) {
    array(string) src = map(map(map(map(input_files, Function.curry(combine_path)(DIR)), Stdio.read_file),
                                utf8_to_string), filter_comment);
    mapping(string:int) files = ([ ]);
    mapping(string:string) widget_to_file = ([]);
    mapping(string:string) file_to_widget = ([]);
    mapping(string:array(string)) dependencies = ([]);

    foreach (src; int i; string file) {
        array(string) lines = filter(file/"\n", has_value, '$');
        if (!sizeof(lines)) {
            /* no class definiton found, so we need this */
            files[input_files[i]] = 1;
            continue;
        }
        foreach (lines;; string line) {
            string name = find_name(line);
            if (name) {
                widget_to_file[name] = input_files[i];
                file_to_widget[input_files[i]] = name;
                break;
            }
        }
    }

    foreach (src; int i; string file) {
        array(string) tmp = ({ });

        foreach (widget_to_file; string widget; string fname) {
            if (input_files[i] == fname) continue;
            if (search(file, "TK."+widget) != -1) {
                tmp += ({ widget });
            }
        }

        if (file_to_widget[input_files[i]]) {
            // it is a widget
            dependencies[file_to_widget[input_files[i]]] = tmp;
            //werror("%s -> %{%O, %} \n", file_to_widget[input_files[i]], tmp);
        } else {
            // it is not a widget, so we have to take all dependencies
            foreach (tmp;; string widget) files[widget_to_file[widget]] = 1;
        }
    }

    void collect_dependencies(mapping files, string widget) {
        string file = widget_to_file[widget];
        if (files[file]) return;
        files[file] = 1;
        foreach (dependencies[widget];; string w) {
            collect_dependencies(files, w);
        }
    };

    for (int i = 1; i < argc; i++) {
        collect_dependencies(files, argv[i]);
    }

    Stdio.mkdirhier(combine_path(DIR, "export"));

    array(string) cmd = ({ "closure-compiler", "--language_in", "ECMASCRIPT5_STRICT" }) +
            filter(input_files, files);

    werror("Running '%s'\n", cmd*" ");

    Process.create_process(
            cmd,
            ([
                "stderr" : Stdio.stderr,
                "stdout" : Stdio.stdout,
             ])
    )->wait();
    
    return 0;
}
