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

constant ARGS = ({
    ({ "mode", Getopt.HAS_ARG, ({ "-m", "--mode" }) }),
    ({ "theme", Getopt.HAS_ARG, ({ "-t", "--theme" }) }),
    ({ "output", Getopt.HAS_ARG, ({ "-o", "--output" }) }),
    ({ "help", Getopt.NO_ARG, ({ "-h", "--help" }) }),
});

void help() {
    werror(
#"Usage: pike export.pike [OPTIONS]

This export script scans the toolkit source code to build a dependency graph.
This dependency graph can then be used to generate custom minified versions
of both the JavaScript code and the CSS files.

Options:
    --mode              Export mode. Either 'js' or 'css'. Defaults to 'js'.
    -m

    --output            Output directory. All files will be placed into the
    -o                  directory specified here.

    --help              Print this help.
    -h


");
}

mapping(string:array(string)) calculate_dependencies(mapping(string:string) widget_to_file,
                                                     mapping(string:string) file_to_widget,
                                                     mapping(string:int) js_files) {
    array(string) src = map(map(map(map(input_files, Function.curry(combine_path)(DIR)), Stdio.read_file),
                                utf8_to_string), filter_comment);
    mapping(string:array(string)) dependencies = ([]);

    foreach (src; int i; string file) {
        array(string) lines = filter(file/"\n", has_value, '$');
        if (!sizeof(lines)) {
            /* no class definiton found, so we need this */
            js_files[input_files[i]] = 1;
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
            if (widget == "Base" || search(file, "TK."+widget) != -1) {
                tmp += ({ widget });
            }
        }

        if (file_to_widget[input_files[i]]) {
            // it is a widget
            dependencies[file_to_widget[input_files[i]]] = tmp;
            //werror("%s -> %{%O, %} \n", file_to_widget[input_files[i]], tmp);
        } else {
            // it is not a widget, so we have to take all dependencies
            foreach (tmp;; string widget) js_files[widget_to_file[widget]] = 1;
        }
    }

    return dependencies;
}

void add_dependencies(mapping(string:array(string)) dependencies, mapping(string:int) widgets,
                      string widget) {
    if (widgets[widget]) return;
    widgets[widget] = 1;
    if (!dependencies[widget])
        error("No such widget: %s\n", widget);
    foreach (dependencies[widget];; string w) {
        add_dependencies(dependencies, widgets, w);
    }
}


array(string) dependency_sort(mapping(string:int) widgets, mapping(string:array(string)) dependencies) {
    array(string) ret = ({ });

    void add(string widget) {
        if (widgets[widget]) {
            widgets[widget] = 0;
            map(sort(dependencies[widget]), add);
            ret += ({ widget });
        }
    };

    map(sort(indices(widgets)), add);

    return ret;
}

int main(int argc, array(string) argv) {
    mapping(string:string|array|int) options = ([]);
    
    array(string) orig_args = argv[1..];

    {
        array(array) args = Getopt.find_all_options(argv, ARGS);

        foreach (args;; array arg) {
            if (!has_index(options, arg[0]))
                options[arg[0]] = arg[1];
            else if (arrayp(options[arg[0]]))
                options[arg[0]] += ({ arg[1] });
            else
                options[arg[0]] = ({ options[arg[0]], arg[1] });
        }
    }

    if (options->help) {
        help();
        exit(0);
    }

    if (!options->mode) options->mode = "js";
    if (!options->output) {
        werror("Missing output directory.\n");
        help();
        exit(1);
    }

    if (!Stdio.is_dir(options->output)) {
        werror("No such directory: %s\n", options->output);
        exit(1);
    }

    if (!options->theme) options->theme = "plain";

    /* js files to _always_ include */
    mapping(string:int) js_files = ([ ]);

    mapping(string:string) widget_to_file = ([]);
    mapping(string:string) file_to_widget = ([]);

    mapping(string:array(string)) dependencies = calculate_dependencies(widget_to_file, file_to_widget,
                                                                        js_files);
    /* widgets we need */
    mapping(string:int) widgets = ([]);

    for (int i = 1; i < sizeof(argv); i++) {
        if (stringp(argv[i]))
            add_dependencies(dependencies, widgets, argv[i]);
    }

    if (options->mode == "js") {
        foreach (widgets; string w;) {
            js_files[widget_to_file[w]] = 1;
        }
        array(string) cmd = ({ "closure-compiler", "--language_in", "ECMASCRIPT5_STRICT" }) +
                filter(input_files, js_files);


        string fname = combine_path(options->output, "toolkit.min.js");

        werror("Running '%s' with output to '%s'\n", cmd*" ", fname);

        Stdio.File out = Stdio.File(fname, "wc");

        out->truncate(0);
        out->write(
#"/* This file is part of the Toolkit library.
 * It has been generated using the command
 *  pike export.pike %{%s %}
 */
", orig_args);

        Process.create_process(
                cmd,
                ([
                    "stderr" : Stdio.stderr,
                    "stdout" : out,
                 ])
        )->wait();

        out->close();
    } else if (options->mode == "css") {
        string DST = combine_path(options->output, "css");
        string SRC = combine_path(DIR, "toolkit", "styles");

        array(string) files = ({ "toolkit.css" });
        
        if (!Stdio.is_dir(combine_path(SRC, options->theme))) {
            werror("Cannot find theme directory: %s\n", combine_path(SRC, options->theme));
            exit(1);
        }

        Stdio.mkdirhier(DST);

        string theme_dir = combine_path(SRC, options->theme);
        array(string) W = dependency_sort(widgets, dependencies);

        /* super slow */
        foreach (W;; string widget) {
            widget = lower_case(widget) + ".css";
            foreach (Filesystem.Traversion(theme_dir); string dir; string file) {
                string path = combine_path(dir, file);
                path = path[sizeof(theme_dir)+1..];
                if (file == widget) {
                    files += ({ combine_path(options->theme, path) });
                    break;
                }
            }
        }

        foreach (files;; string path) {
            string dst = combine_path(DST, path);
            Stdio.mkdirhier(dirname(dst));
            if (!Stdio.cp(combine_path(SRC, path), dst)) {
                werror("cp '%s' '%s' failed.\n", combine_path(SRC, path), dst);
            }
        }

        Stdio.File out = Stdio.File(combine_path(DST, "toolkit.all.css"), "wc");
        out->truncate(0);
        out->write(
#"/* This file is part of the Toolkit library.
 * It has been generated using the command
 *  pike export.pike %{%s %}
 */
", orig_args);
        foreach (files;; string path) {
            /* this is not really json, but works for this purpose */
            out->write("@import %s;\n", string_to_utf8(Standards.JSON.encode(path)));
        }
        out->close();

    } else if (options->mode == "print") {
        werror("Dependencies:\n");
        array(string) W = dependency_sort(widgets, dependencies);

        foreach (W;; string widget) {
            array(string) widgets = dependencies[widget];
            werror("%20s -> %{%s %}\n", widget, sort(widgets));
        }
        werror("Result: %{ %s %}\n", W);
    } else {
        werror("No such mode: %s\n", options->mode);
        help();
        exit(1);
    }
    
    return 0;
}
