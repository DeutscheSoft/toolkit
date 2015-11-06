 /* toolkit provides different widgets, implements and modules for 
 * building audio based applications in webbrowsers.
 * 
 * Invented 2013 by Markus Schmidt <schmidt@boomshop.net>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General
 * Public License along with this program; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, 
 * Boston, MA  02110-1301  USA
 */
"use strict";
(function(w) { 
function check_dots(start, stop, step, level, comp) {
    var O = this.options;
    // test if dots can be drawn between two positions and trigger drawing
    var iter = start;
    while (comp(iter, stop - step)) {
        iter += step;
        for (var i = level - 1; i >= 0; i--) {
            var l = O.levels[i];
            var diff = Math.abs(start - iter);
            if (!(diff % l)
            && this._val2px(Math.abs(start - iter)
                + O.min) >= O.gap_dots
            && this._val2px(iter) >= O.gap_dots) {
                this.draw_dot(iter);
                start = iter;
            }
        }
    }
}
function check_label(iter, step, last) {
    var O = this.options;
    // test if a label can be draw at a position and trigger drawing if so
    for (var i = O.levels.length - 1; i >= 0; i--) {
        var level = O.levels[i];
        var diff = Math.abs(O.base - iter);
        if (!(diff % level)
        && (level >= Math.abs(last - iter)
            || i == O.levels.length - 1)
        && this._val2px(Math.abs(last - iter)
            + O.min) >= O.gap_labels
        && this._val2px(iter) >= O.gap_labels) {
            var label;
            if (iter > O.min && iter < O.max) {
                label = low_draw_label.call(this, iter);
                this.draw_dot(iter, "toolkit-marker");
            }
            return [ i, label ];
        }
    }
    return false;
}
function low_draw_label(val, cls) {
    var label = TK.element("span", "toolkit-label", {
        position: "absolute",
        display: "block",
        cssFloat: "left"
    });
    TK.set_content(label, this.options.labels(val));
    if (cls) TK.add_class(label, cls);
    this.element.appendChild(label);

    return [val, label];
}
function correct_labels(labels) {
    var i, label;
    var position_prop, size_fun, lsize_fun;
    var vert = this._vert();
    if (vert) {
        position_prop = "bottom";
        size_fun = TK.outer_width;
    } else {
        position_prop = "left";
        size_fun = TK.outer_height;
    }
    var sizes = [];
    var new_size = 0, tmp;
    var elem_size, pos;
    var auto_size = this.options.auto_size;

    for (i = 0; i < labels.length; i++) {
        label = labels[i][1];
        pos = Math.round(this.val2px(this.snap(labels[i][0])));
        label.style[position_prop] = pos + "px";
    }

    if (!this.options.auto_size) return;

    TK.S.add(function() {
        // calculate the size of all labels for positioning
        for (i = 0; i < labels.length; i++) {
            label = labels[i][1];
            tmp = size_fun(label, true);
            if (tmp > new_size) new_size = tmp;
        }

        if (auto_size)
            elem_size = size_fun(this.element, true);

        if (new_size > elem_size)
            TK.S.add(function() {
                size_fun(this.element, true, new_size);
            }.bind(this));
    }.bind(this), 1);
}
w.Scale = $class({
    // Scale can be used to draw dots and labels as markers next to a meter, a
    // fader or a frequency response graph. Depending on some parameters it
    // tries to decide on its own where to draw labels and dots depending on the
    //  available space and the scale. Scales can be drawn vertically and
    // horizontally. Scale extends Widget and implements Ranges.
    _class: "Scale",
    
    Extends: Widget,
    Implements: [Ranged],
    options: {
        layout:           _TOOLKIT_RIGHT, // how to draw the scale:
                                          // _TOOLKIT_LEFT:   vertical, labels
                                          //                  on the left
                                          // _TOOLKIT_RIGHT:  vertical, labels
                                          //                  on the right,
                                          // _TOOLKIT_TOP:    horizontal, labels
                                          //                  on top
                                          // _TOOLKIT_BOTTOM: horizontal, labels
                                          //                  on bottom
        division:         1,              // minimum step size
        levels:           [1],            // array of steps where to draw labels
                                          // and marker
        base:             false,          // base where dots and labels are
                                          // drawn from
        labels:           function (val) { return val.toFixed(2); },
                                          // callback function for formatting
                                          // the labels
        gap_dots:         4,              // minimum gap between dots (pixel)
        gap_labels:       40,             // minimum gap between labels (pixel)
        show_labels:      true,           // if labels should be drawn
        show_min:         true,           // always draw a label at min
        show_max:         true,           // always draw a label at max
        show_base:        true,           // always draw a label at base
        fixed_dots:       false,          // if fixed dots should be drawn.
                                          // array containing real values or false
        fixed_labels:     false,          // if fixed labels should be drawn.
                                          // array contianing real values or false
        auto_size:        false           // the overall size can be set automatically
                                          // according to labels width/height
    },
    
    initialize: function (options) {
        this.__size = 0;
        Widget.prototype.initialize.call(this, options);
        var E = TK.element("div","toolkit-scale");
        this.element = this.widgetize(E, true, true, true);
    },

    initialized: function() {
        Widget.prototype.initialized.call(this);
        Ranged.prototype.initialized.call(this);
    },
    
    redraw: function () {
        Widget.prototype.redraw.call(this);

        var I = this.invalid;
        var O = this.options;
        var E = this.element;

        if (I.layout) {
            I.layout = false;
            TK.remove_class(E, "toolkit-vertical");
            TK.remove_class(E, "toolkit-horizontal");
            TK.remove_class(E, "toolkit-top");
            TK.remove_class(E, "toolkit-bottom");
            TK.remove_class(E, "toolkit-right");
            TK.remove_class(E, "toolkit-left");
            switch (O.layout) {
            case _TOOLKIT_LEFT:
                TK.add_class(E, "toolkit-vertical");
                TK.add_class(E, "toolkit-left");
                break;
            case _TOOLKIT_RIGHT:
                TK.add_class(E, "toolkit-vertical");
                TK.add_class(E, "toolkit-right");
                break;
            case _TOOLKIT_TOP:
                TK.add_class(E, "toolkit-horizontal");
                TK.add_class(E, "toolkit-top");
                break;
            case _TOOLKIT_BOTTOM:
                TK.add_class(E, "toolkit-horizontal");
                TK.add_class(E, "toolkit-bottom");
                break;
            }
        }

        if (I.auto_size) {
            I.auto_size = false;
            if (O.auto_size) {
                I.basis = true;
            } else {
                this.element.style.removeProperty(this._vert() ? "height" : "width"); 
            }
        }

        if (I.basis || I.auto_size) {
            I.auto_size = false;
            if (O.auto_size) {
                if (this._vert()) this.element.style.height = O.basis + "px";
                else this.element.style.width = O.basis + "px";
            }
        }

        if (I.validate("base", "show_base", "gap_labels", "min", "show_min", "division", "max",
                       "fixed_dots", "fixed_labels", "levels", "basis", "scale", "reverse")) {
            this.__size = 0;
            if (O.base === false)
                O.base = O.max
            TK.empty(this.element);

            var labels = [];
            
            // draw base
            this.draw_dot(O.base, this.__based ? "toolkit-base" : "toolkit-base");
            if (O.show_base) {
                labels.push(low_draw_label.call(this, O.base, "toolkit-base"));
            }
            // draw top
            if (this._val2px(O.base - O.min) >= O.gap_labels) {
                this.draw_dot(O.min, "toolkit-min");
                if (O.show_min)
                    labels.push(low_draw_label.call(this, O.min, "toolkit-min"));
            }
            
            // draw bottom
            if (this._val2px(O.max - O.base) >= O.gap_labels) {
                this.draw_dot(O.max, "toolkit-max");
                if (O.show_max)
                    labels.push(low_draw_label.call(this, O.max, "toolkit-max"));
            }
            
            if (O.fixed_dots && O.fixed_labels) {
                for (var i = 0; i < O.fixed_dots.length; i++) {
                    this.draw_dot(O.fixed_dots[i]);
                }
                for (var i = 0; i < O.fixed_labels.length; i++) {
                    labels.push(low_draw_label.call(this, O.fixed_labels[i]));
                }
            } else {
                
                var level;
                
                // draw beneath base
                var iter = O.base;
                var last = iter;
                while (iter > O.min) {
                    //console.log("beneath", O.reverse, iter)
                    iter -= O.division;
                    if (level = check_label.call(this, iter, O.division, last)) {
                        if (level[1]) {
                            labels.push(level[1]);
                        }
                        level = level[0];
                        check_dots.call(this, last, iter, -O.division, level,
                                        function (a, b) { return a > b });
                        last = iter;
                    }
                }
                // draw dots between last label and min
                check_dots.call(this, last, iter, -O.division, O.levels.length - 1,
                                function (a, b) { return a > b });
                
                // draw above base
                iter = O.base;
                last = iter;
                while (iter < O.max) {
                    //console.log("above", O.reverse, iter)
                    iter += O.division;
                    if (level = check_label.call(this, iter, O.division, last)) {
                        if (level[1]) {
                            labels.push(level[1]);
                        }
                        level = level[0];
                        check_dots.call(this, last, iter, O.division, level,
                                        function (a, b) { return a < b });
                        last = iter;
                    }
                }
                // draw dots between last label and max
                check_dots.call(this, last, iter, O.division, O.levels.length - 1,
                                function (a, b) { return a < b });
            }
            correct_labels.call(this, labels);
        }
    },
    destroy: function () {
        TK.empty(this.element);
        this.element.remove();
        Widget.prototype.destroy.call(this);
        // ??
        return this;
    },
    
    draw_dot: function (val, cls) {
        // draws a dot at a certain value and adds a class if needed
        var d = TK.element("div", "toolkit-dot", { position: "absolute" });
        if (cls) TK.add_class(d, cls);
        
        // position dot element
        var pos = Math.round(this.val2px(this.snap(val)));
        pos = Math.min(Math.max(0, pos), this.options.basis - 1);
        d.style[this._vert() ? "bottom" : "left"] = pos + "px";
        this.element.appendChild(d);
        return this;
    },
    draw_label: function (val, cls) {
        // draws a label at a certain value and adds a class if needed
        if (!this.options.show_labels) return;
                  
        // create label element
        var label = low_draw_label.call(this, val, cls); 
        // resize the main element if labels are wider
        // because absolute positioning destroys dimensions
        correct_labels.call(this, label);
        return this;
    },
    
    // HELPERS & STUFF
    _val2px: function (value) {
        // returns a positions according to a value without taking
        // options.reverse into account
        return this.options.reverse ?
            this.options.basis - this.val2px(this.snap(value)) : this.val2px(this.snap(value));
    },
    _vert: function () {
        // returns true if the meter is drawn vertically
        return this.options.layout == _TOOLKIT_LEFT
            || this.options.layout == _TOOLKIT_RIGHT;
    },
    
    // GETTER & SETTER
    set: function (key, value) {
        Widget.prototype.set.call(this, key, value);
        Ranged.prototype.set.call(this, key, value);
        switch (key) {
            case "division":
            case "levels":
            case "labels":
            case "gap_dots":
            case "gap_labels":
            case "show_labels":
                this.fire_event("scalechanged")
                break;
            case "base":
                if (value === false) {
                    this.options.base = this.options.min;
                    this.__based = false;
                } else {
                    this.__based = true;
                }
                this.fire_event("basechanged", value);
                break;
        }
    }
});
})(this);
