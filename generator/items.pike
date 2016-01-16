#! /usr/bin/env pike

import Stdio;

bool VERBOSE = 0;
bool COMPACT = 0;

string OUT_VARIABLE    = "items";
string OUT_FILE        = combine_path(dirname(__FILE__), "..", "javascript", "items.js");
string CATEGORY_DIR    = combine_path(dirname(__FILE__), "..", "toolkit");
string CSS_DIR         = combine_path(dirname(__FILE__), "..", "toolkit", "templates", "default", "css");
string IMAGE_DIR       = combine_path(dirname(__FILE__), "..", "toolkit", "templates", "default", "images");
string CATEGORY_MARKER = "@category: ";
constant KEYWORDS        = ({ "class", "element", "event", "module", "method" });
constant CLASS_KEYWORDS  = ({ "implements", "extends", "option", "description" });
constant METHOD_KEYWORDS = ({ "parameter", "description", "returns" });
constant ELEMENT_ATOMS   = ({ "name", "class", "description" });
constant MODULE_ATOMS    = ({ "name", "description" });
constant OPTION_ATOMS    = ({ "name", "type", "default", "description" });
constant PARAMETER_ATOMS = ({ "name", "type", "default", "description" });
constant RETURN_ATOMS    = ({ "type", "description" });
constant EVENT_ATOMS     = ({ "name", "arguments", "description" });

constant auto_gobble = ([
    "description" : 1,
]);

constant auto_description = ([
    "method" : 1,
    "class"  : 1,
]);

mapping(string:mixed) _recipient;

array(string) trim_array (array(string) a) {
    for (int i = 0; i < sizeof(a); i++)
        a[i] = String.trim_all_whites(a[i]);
    return a - ({ "" });
}

mapping(string:string) get_atoms_mapping (string c, array(string) keys) {
    mapping(string:string) m = ([]);
    array(string) a = trim_array(c / ";");
    for (int i = 0; i < sizeof(keys); i++)
        m[keys[i]] = a[i];
    return m;
}

void process_element (string type, string content, mapping map) {
    if (VERBOSE) write("type: " + type + "\n" + content + "\n\n");
    string c = String.trim_all_whites(content);
    switch (type) {
        case "class":
            if (!c) error("missing class name\n");
            map->name = c;
            _recipient = map;
            break;
        case "element":
            map->elements += ({ get_atoms_mapping(c, ELEMENT_ATOMS) });
            break;
        case "event":
            map->events += ({ get_atoms_mapping(c, EVENT_ATOMS) });
            break;
        case "module":
            map->modules += ({ get_atoms_mapping(c, MODULE_ATOMS) });
            break;
        case "method":
            map->methods += ({ ([ "name" : c ]) });
            _recipient = map->methods[-1];
            break;
        case "implements":
            map->implements += trim_array(c / ",");
            break;
        case "extends":
            map->extends += trim_array(c / ",");
            break;
        case "option":
            mapping(string:string) m = get_atoms_mapping(c, OPTION_ATOMS);
            if (!_recipient) error("No recipient!\n");
            if (!m->name) error("Option is missing name.\n");
            _recipient->options += ([ m->name : m ]);
            break;
        case "param":
        case "parameter":
            {
                mapping m = ([]);

                if (sscanf(c, "\{%[^}]}%*[\ \t][%[A-Za-z0-9_]=%[^\]]]%*[\ \t]-%*[\ \t]%s",
                           m->type, m->name, m["default"], m->description) == 7) {
                } else if (sscanf(c, "\{%[^}]}%*[\ \t]%[A-Za-z0-9_]%*[\ \t]-%*[\ \t]%s",
                           m->type, m->name, m->description) == 6) {
                } else {
                    werror("Could not parse %O\n", c);
                }
                _recipient->parameters += ({ m });
            }
            break;
        case "returns":
            _recipient->returns += ({ get_atoms_mapping(c, RETURN_ATOMS) });
            break;
        case "description":
            if (!_recipient) error("No recipient!\n");
            _recipient->description = c;
            break;
        default:
            werror("Unknown type %O: %O\n", type, content);
            break;
    }
}

void parse_comment_block(string c, mapping map) {
    string current_type, current_content;;

    c = Regexp.PCRE("\n[ \t]*[\*][ \t]*")->replace(c, "\n"); // remove possible * and spaces on newlines
    c = Regexp.PCRE("^[ \t]*")->replace(c, ""); // replace leading spaces
    c = Regexp.PCRE("[ \t]+")->replace(c, " "); // replace multiple spaces

    foreach (c/"\n";; string line) {
        line = String.trim_all_whites(line);
        if (!sizeof(line)) continue;
        string type;
        if (3 == sscanf(line, "@%[^:\ ]%*[:]%s", type, line)) {
            if (current_type) {
                process_element(current_type, current_content, map);
            }
            current_type = type;
            current_content = line;
            continue;
        }

        if (auto_description[current_type]) {
            process_element(current_type, current_content, map);
            current_type = "description";
            current_content = line;
        } else if (current_content) {
            current_content += "\n" + line;
        } else werror("Unrecognized line: %O\n", line);
    }

    // process last line
    if (current_type) {
        process_element(current_type, current_content, map);
    }
}

mapping(string:mixed) parse_code(string code) {
    mapping(string:mixed) map = ([]);
    array(string) elements = ({});
    int i  = 0;
    int to = 0;
    while ((i = search(code, "/**", i)) > -1) { // loop over comment openers "/*"
        if ((to = search(code, "*/", i+3) - 1) < i) continue; // no closing comment tag was found
        string c = code[(i + 3)..(i = to)]; // extract the comment
        parse_comment_block(c, map);
    }
    return map;
}

mapping(string:mapping) process_category (string dir) {
    mapping(string:mapping) list = ([]);
    foreach (get_dir(dir), string file) {
        if (!has_suffix(file, ".js")) continue;
        mapping(string:mixed) m = parse_code(utf8_to_string(read_bytes(combine_path(dir, file))));
        if (!equal(m, ([]))) {
            string f;
            string id = file[..sizeof(file)-4];
            m->id = id;
            m->files = ({ combine_path(dir, file) });
            if (!m->name) error("File %O is missing class name:\n%O\n", file, m);
            f = combine_path(CSS_DIR, id + ".css");
            if (exist(f))
                m->files += ({ f });
            f = combine_path(IMAGE_DIR, file[..sizeof(file)-4]);
            if (exist(f))
                m->files += get_dir(f);
            list[m->name] = m;
        }
    }
    return list;
}

mapping(string:mapping) traverse_categories (string cats) {
    mapping(string:mapping) categories = ([]);
    foreach (get_dir(cats), string dir) {
        string dir_ = combine_path(cats, dir);
        if (!is_dir(dir_)) continue;
        string fname = combine_path(dir_, "README");
        if (exist(fname)
        && utf8_to_string(Stdio.read_bytes(fname, 0, sizeof(CATEGORY_MARKER))) == CATEGORY_MARKER) {
            string name = String.trim_all_whites(utf8_to_string(Stdio.read_file(fname, 0, 1))[sizeof(CATEGORY_MARKER)..]);
            mapping(string:mixed) map = ([]);
            map->description = String.trim_all_whites(utf8_to_string(Stdio.read_file(fname, 1)));
            map->items = process_category(dir_);
            map->name = name;
            map->id = dir;
            categories[dir] = map;
        }
    }
    return categories;
}

int main (int argc, array(string) argv) {
    foreach(argv, string arg) {
        if (equal(arg, "-v"))
            VERBOSE = 1;
        if (equal(arg, "-c"))
            COMPACT = 1;
    }
    mapping(string:mapping) cats = traverse_categories(CATEGORY_DIR);
    int flag = COMPACT ? 0 : Standards.JSON.HUMAN_READABLE;
    Stdio.write_file(OUT_FILE, OUT_VARIABLE + "=" + string_to_utf8(Standards.JSON.encode(cats, flag)));
    return 0;
}
