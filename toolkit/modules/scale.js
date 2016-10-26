/*
 * This file is part of toolkit.
 *
 * toolkit is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * toolkit is distributed in the hope that it will be useful,
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
function get_base(O) {
    return Math.max(Math.min(O.max, O.base), O.min);
}
function vert(O) {
    return O.layout === "left" || O.layout === "right";
}
function fill_interval(range, levels, i, from, to, min_gap, result) {
    var level = levels[i];
    var x, j, pos, last_pos, last;
    var diff;

    var to_pos = range.val2px(to);
    last_pos = range.val2px(from);

    if (Math.abs(to_pos - last_pos) < min_gap) return;

    if (!result) result = {
        values: [],
        positions: [],
    };

    var values = result.values;
    var positions = result.positions;

    if (from > to) level = -level;
    last = from;

    for (j = ((to-from)/level)|0, x = from + level; j > 0; x += level, j--) {
        pos = range.val2px(x);
        diff = Math.abs(last_pos - pos);
        if (Math.abs(to_pos - pos) < min_gap) break;
        if (diff >= min_gap) {
            if (i > 0 && diff >= min_gap * 2) {
                // we have a chance to fit some more labels in
                fill_interval(range, levels, i-1,
                              last, x, min_gap, result);
            }
            values.push(x);
            positions.push(pos);
            last_pos = pos;
            last = x;
        }
    }

    if (i > 0 && Math.abs(last_pos - to_pos) >= min_gap * 2) {
        fill_interval(range, levels, i-1, last, to, min_gap, result);
    }

    return result;
}
// remove collisions from a with b given a minimum gap
function remove_collisions(a, b, min_gap, vert) {
    var pa = a.positions, pb = b.positions;
    var va = a.values;
    var dim;

    min_gap = +min_gap;

    if (typeof vert === "boolean")
        dim = vert ? b.height : b.width;

    if (!(min_gap > 0)) min_gap = 1;

    if (!pb.length) return a;

    var i, j;
    var values = [];
    var positions = [];
    var pos_a, pos_b;
    var size;

    var last_pos = +pb[0],
        last_size = min_gap;

    if (dim) last_size += +dim[0] / 2;

    // If pb is just length 1, it does not matter
    var direction = pb.length > 1 && pb[1] < last_pos ? -1 : 1;

    for (i = 0, j = 0; i < pa.length && j < pb.length;) {
        pos_a = +pa[i];
        pos_b = +pb[j];
        size = min_gap;

        if (dim) size += dim[j] / 2;

        if (Math.abs(pos_a - last_pos) < last_size ||
            Math.abs(pos_a - pos_b) < size) {
            // try next position
            i++;
            continue;
        }

        if (j < pb.length - 1 && (pos_a - pos_b)*direction > 0) {
            // we left the current interval, lets try the next one
            last_pos = pos_b;
            last_size = size;
            j++;
            continue;
        }

        values.push(+va[i]);
        positions.push(pos_a);

        i++;
    }

    return {
        values: values,
        positions: positions,
    };
}
function create_dom_nodes(data, create) {
    var nodes = [];
    var values, positions;
    var i;
    var E = this.element;
    var node;

    data.nodes = nodes;
    values = data.values;
    positions = data.positions;

    for (i = 0; i < values.length; i++) {
        nodes.push(node = create(values[i], positions[i]));
        E.appendChild(node);
    }
}
function create_label(value, position) {
    var O = this.options;
    var elem = document.createElement("SPAN");
    elem.className = "toolkit-label";
    elem.style.position = "absolute";
    elem.style.cssFloat = "left";
    elem.style.display = "block";

    if (vert(O)) {
        elem.style.bottom = position.toFixed(1) + "px";
        elem.style.transform = "translateY(50%)";
    } else {
        elem.style.left = position.toFixed(1) + "px";
        elem.style.transform = "translateX(-50%)";
    }

    TK.set_content(elem, O.labels(value));

    if (get_base(O) === value)
        TK.add_class(elem, "toolkit-base");
    else if (O.max === value)
        TK.add_class(elem, "toolkit-max");
    else if (O.min === value)
        TK.add_class(elem, "toolkit-min");

    return elem;
}
function create_dot(value, position) {
    var O = this.options;
    var elem = document.createElement("DIV");
    elem.className = "toolkit-dot";
    elem.style.position = "absolute";
    
    if (O.layout === "left" || O.layout === "right") {
        elem.style.bottom = Math.round(position + 0.5) + "px";
    } else {
        elem.style.left = Math.round(position - 0.5) + "px";
    }
    
    if (get_base(O) === value)
        TK.add_class(elem, "toolkit-base");
    else if (O.max === value)
        TK.add_class(elem, "toolkit-max");
    else if (O.min === value)
        TK.add_class(elem, "toolkit-min");

    return elem;
}
function measure_dimensions(data) {
    var nodes = data.nodes;
    var width = [];
    var height = [];

    for (var i = 0; i < nodes.length; i++) {
        width.push(TK.outer_width(nodes[i]));
        height.push(TK.outer_height(nodes[i]));
    }

    data.width = width;
    data.height = height;
}
function handle_end(O, labels, i) {
    var node = labels.nodes[i];
    var v = labels.values[i];
    var is_vert = vert(O);
    var start;

    if (v === O.min) {
        TK.add_class(node, "toolkit-min");
        start = !O.reverse;
    } else if (v === O.max) {
        TK.add_class(node, "toolkit-max");
        start = !!O.reverse;
    } else return;

    var size;

    if (labels.width) {
        size = is_vert ? labels.height[i] : labels.width[i];
    }

    if (start) {
        if (size) labels.positions[i] += size/2; 
        node.style.removeProperty("transform");
    } else {
        if (size) labels.positions[i] -= size/2; 
        if (vert(O)) {
            node.style.transform = "translateY(100%)";
        } else {
            node.style.transform = "translateX(-100%)";
        }
    }
}
function generate_scale(from, to, include_from, show_to) {
    var O = this.options;
    var labels;

    if (O.show_labels || O.show_markers)
        labels = {
            values: [],
            positions: [],
        };

    var dots = {
        values: [],
        positions: [],
    };
    var is_vert = vert(O);
    var tmp;

    if (include_from) {
        tmp = this.val2px(from);

        if (labels) {
            labels.values.push(from);
            labels.positions.push(tmp);
        }

        dots.values.push(from);
        dots.positions.push(tmp);
    }

    var levels = O.levels;

    fill_interval(this, levels, levels.length - 1, from, to, O.gap_dots, dots);

    if (labels) {
        if (O.levels_labels) levels = O.levels_labels;

        fill_interval(this, levels, levels.length - 1, from, to, O.gap_labels, labels);

        tmp = this.val2px(to);

        if (show_to || Math.abs(tmp - this.val2px(from)) >= O.gap_labels) {
            labels.values.push(to);
            labels.positions.push(tmp);

            dots.values.push(to);
            dots.positions.push(tmp);
        }
    } else {
        dots.values.push(to);
        dots.positions.push(this.val2px(to));
    }

    if (O.show_labels) {
        create_dom_nodes.call(this, labels, create_label.bind(this));

        if (labels.values.length && labels.values[0] === get_base(O)) {
            TK.add_class(labels.nodes[0], "toolkit-base");
        }
    }

    var render_cb = function() {
        var markers;

        if (O.show_markers) {
            markers = {
                values: labels.values,
                positions: labels.positions,
            };
            create_dom_nodes.call(this, markers, create_dot.bind(this));
            for (var i = 0; i < markers.nodes.length; i++)
                TK.add_class(markers.nodes[i], "toolkit-marker");
        }

        if (O.show_labels && labels.values.length > 1) {
            handle_end(O, labels, 0);
            handle_end(O, labels, labels.nodes.length-1);
        }

        if (O.avoid_collisions && O.show_labels) {
            dots = remove_collisions(dots, labels, O.gap_dots, is_vert);
        } else if (markers) {
            dots = remove_collisions(dots, markers, O.gap_dots);
        }

        create_dom_nodes.call(this, dots, create_dot.bind(this));

        if (O.auto_size && O.show_labels) auto_size.call(this, labels);
    };

    if (O.show_labels && O.avoid_collisions || O.auto_size)
        TK.S.add(function() {
            measure_dimensions(labels);
            TK.S.add(render_cb.bind(this), 3);
        }.bind(this), 2);
    else render_cb.call(this);
}
function auto_size(labels) {
    var size_fun;
    var new_size;

    if (!labels.width.length) return;

    if (vert(this.options)) {
        size_fun = TK.outer_width;
        new_size = Math.max.apply(Math, labels.width);
    } else {
        size_fun = TK.outer_height;
        new_size = Math.max.apply(Math, labels.height);
    }

    TK.S.add(function() {
        if (new_size > size_fun(this.element))
            TK.S.add(size_fun.bind(this, this.element, true, new_size), 1);
    }.bind(this));
}
function mark_markers(labels, dots) {
    var i, j;

    var a = labels.values;
    var b = dots.values;
    var nodes = dots.nodes;

    for (i = j = 0; i < a.length && j < b.length;) {
        if (a[i] < b[j]) i++;
        else if (a[i] > b[j]) j++;
        else {
            TK.add_class(nodes[j], "toolkit-marker");
            i++;
            j++;
        }
    }
}
/**
 * TK.Scale can be used to draw scales. It is used in {@link TK.MeterBase} and
 * {@link TK.Fader}. TK.Scale draws labels and markers based on its parameters
 * and the available space. Scales can be drawn both vertically and horizontally.
 * Scale mixes in {@link TK.Ranged} and inherits all its options.
 *
 * @extends TK.Widget
 * @mixes TK.Ranged
 * @class TK.Scale
 *
 * @param {Object} options
 * @property {string} [options.layout="right"] - The layout of the Scale. <code>"right"</code> and
 *   <code>"left"</code> are vertical layouts with the labels being drawn right and left of the scale,
 *   respectively. <code>"top"</code> and <code>"bottom"</code> are horizontal layouts for which the 
 *   labels are drawn on top and below the scale, respectively.
 * @property {int} [options.division=1] - Minimal step size of the markers.
 * @property {Array} [options.levels=[1]] - Array of steps for labels and markers.
 * @property {number} [options.base=false]] - Base of the scale. If set to <code>false</code> it will
 *   default to the minimum value.
 * @property {function} [options.labels=TK.FORMAT("%.2f")] - Formatting function for the scale labels.
 * @property {int} [options.gap_dots=4] - Minimum gap in pixels between two adjacent markers.
 * @property {int} [options.gap_labels=40] - Minimum gap in pixels between two adjacent labels.
 * @property {boolean} [options.show_labels=true] - If <code>true</code>, labels are drawn.
 * @property {boolean} [options.show_max=true] - If <code>true</code>, display a label and a
 *   dot for the 'max' value.
 * @property {boolean} [options.show_min=true] - If <code>true</code>, display a label and a
 *   dot for the 'min' value.
 * @property {boolean} [options.show_base=true] - If <code>true</code>, display a label and a
 *   dot for the 'base' value.
 * @property {Array} [options.fixed_dots] - This option can be used to specify fixed positions
 *   for the markers to be drawn at. The values must be sorted in ascending order.
 * @property {Array} [options.fixed_labels] - This option can be used to specify fixed positions
 *   for the labels to be drawn at. The values must be sorted in ascending order.
 * @property {boolean} [options.show_markers=true] - If true, every dot which is located at the same
 *   position as a label has the <code>toolkit-marker</code> class set.
 */
w.TK.Scale = w.Scale = $class({
    _class: "Scale",
    
    Extends: TK.Widget,
    Implements: [Ranged],
    _options: Object.assign(Object.create(TK.Widget.prototype._options), Ranged.prototype._options, {
        layout: "string",
        division: "number",
        levels: "array",
        levels_labels: "array",
        base: "number",
        labels: "function",
        gap_dots: "number",
        gap_labels: "number",
        show_labels: "boolean",
        show_min: "boolean",
        show_max: "boolean",
        show_base: "boolean",
        fixed_dots: "array",
        fixed_labels: "array",
        auto_size: "boolean",
        avoid_collisions: "boolean",
        show_markers: "boolean",
    }),
    options: {
        layout:           "right",
        division:         1,
        levels:           [1],
        base:             false,
        labels:           TK.FORMAT("%.2f"),
        avoid_collisions: false,
        gap_dots:         4,
        gap_labels:       40,
        show_labels:      true,
        show_min:         true,
        show_max:         true,
        show_base:        true,
        show_markers:     true,
        fixed_dots:       false,
        fixed_labels:     false,
        auto_size:        false           // the overall size can be set automatically
                                          // according to labels width/height
    },
    
    initialize: function (options) {
        var E;
        TK.Widget.prototype.initialize.call(this, options);
        /** @member {HTMLDivElement} TK.Scale#element - The main DIV element. Has class <code>toolkit-scale</code> 
         */
        if (!(E = this.element)) this.element = E = TK.element("div");
        TK.add_class(E, "toolkit-scale");
        this.element = this.widgetize(E, true, true, true);
    },

    initialized: function() {
        TK.Widget.prototype.initialized.call(this);
        Ranged.prototype.initialized.call(this);
    },
    
    redraw: function () {
        TK.Widget.prototype.redraw.call(this);

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
            case "left":
                TK.add_class(E, "toolkit-vertical");
                TK.add_class(E, "toolkit-left");
                break;
            case "right":
                TK.add_class(E, "toolkit-vertical");
                TK.add_class(E, "toolkit-right");
                break;
            case "top":
                TK.add_class(E, "toolkit-horizontal");
                TK.add_class(E, "toolkit-top");
                break;
            case "bottom":
                TK.add_class(E, "toolkit-horizontal");
                TK.add_class(E, "toolkit-bottom");
                break;
            default:
                TK.warn("Unsupported layout setting:", O.layout);
            }
        }

        if (I.auto_size) {
            I.auto_size = false;
            if (O.auto_size) {
                I.basis = true;
            } else {
                this.element.style.removeProperty(vert(O) ? "height" : "width"); 
            }
        }

        if (I.basis || I.auto_size) {
            I.auto_size = false;
            if (O.auto_size) {
                if (vert(O)) this.element.style.height = O.basis + "px";
                else this.element.style.width = O.basis + "px";
            }
        }

        if (I.validate("base", "show_base", "gap_labels", "min", "show_min", "division", "max", "show_markers",
                       "fixed_dots", "fixed_labels", "levels", "basis", "scale", "reverse", "show_labels")) {
            TK.empty(E);

            if (O.fixed_dots && O.fixed_labels) {
                var labels;

                if (O.show_labels) {
                    labels = {
                        values: O.fixed_labels,
                        positions: O.fixed_labels.map(this.val2px, this),
                    };
                    create_dom_nodes.call(this, labels, create_label.bind(this));
                    if (O.auto_size) {
                        TK.S.add(function() {
                            measure_dimensions(labels);
                            TK.S.add(auto_size.bind(this, labels), 1);
                        }.bind(this));
                    }
                }

                var dots = {
                    values: O.fixed_dots,
                    positions: O.fixed_dots.map(this.val2px, this),
                };
                create_dom_nodes.call(this, dots, create_dot.bind(this));

                if (O.show_markers && labels) {
                    mark_markers(labels, dots);
                }
            } else {
                var base = get_base(O);

                if (base !== O.max) generate_scale.call(this, base, O.max, true, O.show_max);
                if (base !== O.min) generate_scale.call(this, base, O.min, base === O.max, O.show_min);
            }
        }
    },
    // GETTER & SETTER
    set: function (key, value) {
        TK.Widget.prototype.set.call(this, key, value);
        switch (key) {
            case "division":
            case "levels":
            case "labels":
            case "gap_dots":
            case "gap_labels":
            case "show_labels":
                /**
                 * Gets fired when an option the rendering depends on was changed
                 * @param {string} key - The name of the option which changed the {@link TK.Scale}.
                 * @param {mixed} value - The value of the option.
                 * @event TK.Scale#scalechanged
                 */
                this.fire_event("scalechanged", key, value)
                break;
        }
    }
});
})(this);
