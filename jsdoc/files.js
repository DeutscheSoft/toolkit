'use strict';

var env = require('jsdoc/env');
var fs = require('jsdoc/fs');
var markdown = require('jsdoc/util/markdown');
var path = require('path');

exports.handlers = {
    parseComplete: function(e) {
        var extra_files = env.conf.extra_mainpages;
        extra_files.forEach(function (f) {
            let content = fs.readFileSync(f, env.opts.encoding);
            let parse = markdown.getParser();
            let name = path.basename(f, ".md");
            name = name.substr(0, 1).toUpperCase() + name.substr(1);
            e.doclets.push({
                kind : "mainpage",
                readme : parse(content),
                longname : name,
            });
        });
    }
}
