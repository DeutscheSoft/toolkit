#! /usr/bin/env pike

#define CATEGORY_DIR "./toolkit/"
#define CATEGORY_MARKER "@category: "

import Stdio;

//[
    //"name" : "ButtonArray",
    //"extends" : "Widget",
    //"implements" : "Ranges",
    //"description" : "Description of widget class",
    //"options" : [
        //"option1" : [
            //"description" : Description of option1,
            //"default"     : Default Value,
            //"type"        : Type
        //],
        //"option2" : [
            //"description" : Description of option2,
            //"default"     : Default Value,
            //"type"        : Type
        //]
    //],
    //"elements" : [
        //"element" : [
            //"description" : "The base element of this widget",
            //"class" : "div.toolkit-buttonarray"
        //],
        //"_container" : [
            //"description" : "Blablubb container",
            //"class" : "div.toolkit-container"
        //]
    //],
    //"modules" : [
        //"rangeX" : [
            //"class" : "Range",
            //"description" : "Description of this module"
        //],
        //"rangeY" : [
            //"class" : "Range",
            //"description" : "Description of this module"
        //]
    //],
    //"events" : [
        //"whatever" : [
            //"arguments" : "Button, ID, Widget",
            //"description" : "If whatever happens"
        //]
    //],
//]
        

mapping(string:mixed) parse_code(string code) {
    mapping(string:mixed) map = ([ ]);
    // do something useful with code
    return map;
}

void process_category (string dir) {
    array(string) i = get_dir(dir);
    foreach (i, string file) {
        if (!has_suffix(file, ".js")) continue;
        mapping(string:mixed) elements = parse_code(read_bytes(dir + "/" + file));
    }
}

void traverse_categories (string cats) {
    array(string) i = get_dir(cats);
    foreach (i, string dir) {
        if (!is_dir(cats + dir)) continue;
        string fname = cats + dir + "/README";
        if (exist(fname)
        && Stdio.read_bytes(fname, 0, sizeof(CATEGORY_MARKER)) == CATEGORY_MARKER)
            process_category(cats + dir);
    }
}

int main () {
    traverse_categories(CATEGORY_DIR);
    return 0;
}
