'use strict';

var env = require('jsdoc/env');
var fs = require('jsdoc/fs');
var markdown = require('jsdoc/util/markdown');
var path = require('path');

exports.handlers = {
    parseComplete: function(e) {
        var extra_files = env.conf.extra_mainpages;
        extra_files.forEach(function (f) {
            var location = typeof f === "object" ? f.path : f;
            var name = typeof f === "object" ? f.name : path.basename(f, ".md");
            var content = fs.readFileSync(location, env.opts.encoding);
            var parse = markdown.getParser();
            name = name.substr(0, 1).toUpperCase() + name.substr(1);
            e.doclets.push({
                kind : "mainpage",
                readme : parse(content),
                longname : name,
            });
        });
    }
}
