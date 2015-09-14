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
(function(w){ 
w.MeterBase = $class({
    // MeterBase is a base class to build different meters like LevelMeter.
    // MeterBase extends Gradient and implements Widget.
    // MeterBase has a Scale widget.
    
    _class: "MeterBase",
    Extends: Widget,
    Implements: [Ranged, Gradient],
    options: {
        layout:           _TOOLKIT_LEFT,  // how to draw the meter:
                                          // _TOOLKIT_LEFT:   vertical, meter on
                                          //                  the left
                                          // _TOOLKIT_RIGHT:  vertical, meter on
                                          //                  the right,
                                          // _TOOLKIT_TOP:    horizontal, meter
                                          //                  on top
                                          // _TOOLKIT_BOTTOM: horizontal, meter
                                          //                  on bottom
        segment:         1,               // size of the segments (imagine as
                                          // size of a single LED)
        value:           0,               // the initial value
        base:            false,           // if base value is set, meter starts
                                          // at this point and shows values
                                          // above and beneath starting at base.
                                          // set to false if you don't need it
                                          // to save some cpu
        label:           false,           // the initial value for the label,
                                          // false = value
        title:           "",              // "name" of the meter
        show_title:      false,           // true for drawing the title
        show_label:      false,           // true for drawing the value label
        show_scale:      true,            // true for drawing the scale
        show_labels:     true,            // true for drawing scale labels
        show_marker:     false,           // true for drawing bar markers
                                          // (relies on a drawn scale)
        format_label:    function (value) { return value.toFixed(2); },
                                          // callback function for formatting
                                          // the label
        division:         1,              // minimum step size
        levels:           [1, 5, 10],     // array of steps where to draw labels
                                          // and marker
        scale_base:       false,          // base value where dots and labels are
                                          // drawn from
        format_labels:    function (val) { return val.toFixed(2); },
                                          // callback function for formatting
                                          // the labels of the scale
        gap_dots:         4,              // minimum gap between dots (pixel)
        gap_labels:       40,             // minimum gap between labels (pixel)
        show_max:         true,           // always show label and dot for max value
        show_min:         true,           // always show label and dot for min value
        show_base:        true            // always show label and dot for base value
    },
    
    initialize: function (options, hold) {
        this.__margin = 0;
        this.__based = false;
        Widget.prototype.initialize.call(this, options);
        this.element = this.widgetize(
                       TK.element("div", "toolkit-meter-base"), false, true, true);
        
        if (this.options.reverse)
            TK.add_class(this.element, "toolkit-reverse");
        
        if (TK.get_style(this.element, "position") != "absolute"
            && TK.get_style(this.element, "position") != "relative")
            this.element.style["position"] = "relative";
        
        this._title  = TK.element("div", "toolkit-title");
        this._label  = TK.element("div", "toolkit-label");
        this._scale  = TK.element("div", "toolkit-meter-scale");
        this._bar    = TK.element("div", "toolkit-bar");
        switch (this.options.layout) {
            case _TOOLKIT_LEFT:
                this.element.appendChild(this._label);
                this.element.appendChild(this._scale);
                this.element.appendChild(this._bar);
                this.element.appendChild(this._title);
                TK.add_class(this.element, "toolkit-vertical");
                TK.add_class(this.element, "toolkit-left");
                break;
            case _TOOLKIT_RIGHT:
                this.element.appendChild(this._label);
                this.element.appendChild(this._scale);
                this.element.appendChild(this._bar);
                this.element.appendChild(this._title);
                TK.add_class(this.element, "toolkit-vertical");
                TK.add_class(this.element, "toolkit-right");
                break;
            case _TOOLKIT_TOP:
                this.element.appendChild(this._bar);
                this.element.appendChild(this._scale);
                this.element.appendChild(this._label);
                this.element.appendChild(this._title);
                TK.add_class(this.element, "toolkit-horizontal");
                TK.add_class(this.element, "toolkit-top");
                break;
            case _TOOLKIT_BOTTOM:
                this.element.appendChild(this._title);
                this.element.appendChild(this._label);
                this.element.appendChild(this._scale);
                this.element.appendChild(this._bar);
                TK.add_class(this.element, "toolkit-horizontal");
                TK.add_class(this.element, "toolkit-bottom");
                break;
            default:
                throw("unsupported layout");
        }
        
        this._base   = TK.element("div", "toolkit-base");
        this._mark   = TK.element("div", "toolkit-mark");
        this._over   = TK.element("div", "toolkit-over");

        this._bar.appendChild(this._base);
        this._bar.appendChild(this._mark);
        this._bar.appendChild(this._over);
        
        this._mask1  = TK.element("div", "toolkit-mask", "toolkit-mask1");
        this._mask2  = TK.element("div", "toolkit-mask", "toolkit-mask2");

        this._bar.appendChild(this._mask1);
        this._bar.appendChild(this._mask2);
        
        TK.set_styles(this._bar, {
            position: "relative",
            overflow: "hidden"
        });
        TK.set_styles(this._base, {
            position: "absolute",
            width:    "100%",
            height:   "100%",
            zIndex:   "0"
        });
        TK.set_styles(this._mark, {
            position: "absolute",
            width:    "100%",
            height:   "100%",
            zIndex:   "10"
        });
        TK.set_styles(this._over, {
            position: "absolute",
            width:    "100%",
            height:   "100%",
            zIndex:   "100"
        });
        TK.set_styles(this._mask1, {
            position: "absolute",
            zIndex:   "1000"
        });
        TK.set_styles(this._mask2, {
            position: "absolute",
            zIndex:   "1000"
        });
        if (this.options.layout == _TOOLKIT_LEFT) {
            TK.set_styles(this._scale, {
                "cssFloat": "right"
            });
            TK.set_styles(this._bar, {
                "cssFloat": "left"
            });
        }
        if (this.options.layout == _TOOLKIT_RIGHT) {
            TK.set_styles(this._scale, {
                "cssFloat": "left"
            });
            TK.set_styles(this._bar, {
                "cssFloat": "right"
            });
        }
        if (this._vert()) {
            if (this.options.reverse) {
                TK.set_styles(this._mask1, {
                    width:  "100%",
                    height: "0px",
                    bottom: "0px"
                });
                TK.set_styles(this._mask2, {
                    width:  "100%",
                    height: "0px",
                    top:    "0px"
                });
            } else {
                TK.set_styles(this._mask1, {
                    width:  "100%",
                    height: "0px",
                    top:    "0px"
                });
                TK.set_styles(this._mask2, {
                    width:  "100%",
                    height: "0px",
                    bottom: "0px"
                });
            }
        } else {
            TK.set_styles(this._scale, {
                "clear": "both"
            });
            //toolkit.set_styles(this._title, {
                //"clear": "both"
            //});
            if (this.options.reverse) {
                TK.set_styles(this._mask1, {
                    height: "100%",
                    width:  "0px",
                    left:   "0px"
                });
                TK.set_styles(this._mask2, {
                    height: "100%",
                    width:  "0px",
                    right:  "0px"
                });
            } else {
                TK.set_styles(this._mask1, {
                    height: "100%",
                    width:  "0px",
                    right:  "0px"
                });
                TK.set_styles(this._mask2, {
                    height: "100%",
                    width:  "0px",
                    left:   "0px"
                });
            }
        }
        
        if (this.options.container)
            this.set("container", this.options.container);
        if (this.options.background)
            this.set("background", this.options.background);
        if (this.options.gradient)
            this.set("gradient", this.options.gradient);
        
        if (this.options.label === false)
            this.options.label = this.options.value;
        
        this.set("base", this.options.base, true);
        
        this.set("show_label", this.options.show_label);
        this.set("show_title", this.options.show_title);
        this.set("show_scale", this.options.show_scale);
        
        var options = Object.assign({}, this.options);
        options.base = this.__based?this.options.base:this.options.scale_base;
        options.container = this._scale,
        options.id = false;
        this.scale = new Scale(options);
        
        this.set("show_max", this.options.show_max, true);
        this.set("show_min", this.options.show_min, true);
        this.set("show_base", this.options.show_base, true);
        
        this.delegate(this._bar);
        
        if (!hold)
            this.redraw();
        Widget.prototype.initialized.call(this);
    },
    
    resize: function () {
        this.redraw();
    },
    
    destroy: function () {
        TK.destroy(this._label);
        TK.destroy(this._scale);
        TK.destroy(this._bar);
        TK.destroy(this._title);
        TK.destroy(this._base);
        TK.destroy(this._mark);
        TK.destroy(this._over);
        TK.destroy(this._mask1);
        TK.destroy(this._mask2);
        TK.destroy(this.element);
        Widget.prototype.destroy.call(this);
    },
    redraw: function () {
        var O = this.options;
        this.set("title", O.title);
        this.set("label", O.label);
        this.set("value", O.value);
        switch (O.layout) {
            case _TOOLKIT_LEFT:
            case _TOOLKIT_RIGHT:
                var s = this._bar_size(O.layout);
                TK.outer_height(this._bar, true, s);
                TK.outer_height(this._scale, true, s);
                var i = TK.inner_height(this._bar);
                if (i != O.basis) {
                    O.basis = i;
                    this.scale.set("basis", i);
                }
                TK.inner_height(this._scale, i);
                break;
            case _TOOLKIT_TOP:
            case _TOOLKIT_BOTTOM:
                var s = this._bar_size(O.layout);
                TK.outer_width(this._bar, true, s);
                TK.outer_width(this._scale, true, s);
                var i = TK.inner_width(this._bar);
                if (i != O.basis) {
                    O.basis = i;
                    this.scale.set("basis", i);
                }
                break;
        }
        this.draw_meter();
        if (O.show_scale) {
            this.scale.redraw();
            if (O.show_marker) {
                TK.empty(this._mark);
                var c = this.scale.element.children;
                for (var i = 0; i < c.length; i++) {
                    var e = c[i];
                    if (!TK.has_class(e, "toolkit-dot"))
                        return;
                    
                    var d = e.clone();
                    var p = TK["position_" + this._vert() ? "top" : "left"](e, this._scale);
                    d.style[this._vert() ? "width" : "height"] = "100%";
                    d.style[this._vert() ? "top" : "left"] = 
                               (p + p % O.segment) + "px";
                    this._mark.appendChild(d);
                }
            }
        }
        if (this._vert())
            TK.inner_width(this.element,
                TK.outer_width(this._bar, true)
                + (O.show_scale ? TK.outer_width(this._scale, true) : 0));
        Widget.prototype.redraw.call(this);
        return this;
    },
    
    draw_meter: function (value) {
        var O = this.options;
        if (value === undefined) value = O.value;
        // Set the mask elements according to options.value to show a value in
        // the meter bar
        var pos = Math.max(0,
                  this._val2seg(Math.min(O.max, Math.max(O.base, value))));
        this._mask1.style[this._vert() ? "height" : "width"] = (O.basis - pos).toFixed(0) + "px";
        if (!this.__based) return;
        var pos = Math.max(0,
                  this._val2seg(Math.min(O.base, value)));
        this._mask2.style[this._vert() ? "height" : "width"] = pos + "px";
    },
    
    // HELPERS & STUFF
    _val2seg: function (val) {
        // rounds values to fit in the segments size
        // always returns values without taking options.reverse into account
        var s = +this.val2px(val)
        s -= s % +this.options.segment;
        if (!!this.options.reverse)
            s = +this.options.basis - s;
        return s;
    },
    _bar_size: function () {
        // determine a size for the meter bar based on several conditions
        var s = toolkit[this._vert() ? "inner_height" : "inner_width"](this.element);
        if (this.options.show_label && this._vert())
            s -= TK.outer_height(this._label, true);
        if (this.options.show_title && this._vert())
            s -= TK.outer_height(this._title, true);
        return s;
    },
    _vert: function () {
        // returns true if the meter is drawn vertically
        return this.options.layout == _TOOLKIT_LEFT
            || this.options.layout == _TOOLKIT_RIGHT;
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "gradient":
            case "background":
                if (!hold) {
                    this.draw_gradient(this._base, this.options.gradient);
                }
                break;
            case "show_label":
                if (!hold)
                    this._label.style["display"] = value ? "block" : "none";
                break;
            case "show_title":
                if (!hold)
                    this._title.style["display"] = value ? "block" : "none";
                break;
            case "show_scale":
                if (!hold)
                    this._scale.style["display"] = value ? "block" : "none";
                break;
            case "label":
                this.fire_event("labelchanged", value);
                if (!hold) {
                    var s = this.options.format_label(value);
                    var n = this._label;
                    if (n.firstChild) {
                        n.firstChild.nodeValue = s;
                    } else n.appendChild(document.createTextNode(s));
                }
                break;
            case "value":
                this.fire_event("valuechanged", value);
                this.trigger_draw();
                break;
            case "title":
                this.fire_event("titlechanged", value);
                if (!hold)
                    this._title.innerHTML = value;
                break;
            case "segment":
                if (!hold)
                    this.set("value", this.options.value);
                break;
            case "division":
            case "min":
            case "max":
            case "reverse":
            case "log_factor":
            case "step":
            case "round":
            case "snap":
            case "scale":
            case "basis":
            case "gap_dots":
            case "gap_labels":
            case "show_labels":
            case "show_max":
            case "show_min":
            case "show_base":
                this.scale.set(key, value, hold);
                this.fire_event("scalechanged", key, value);
                if (!hold) this.redraw();
                break;
            case "format_labels":
                this.fire_event("scalechanged", key, value);
                this.scale.set("labels", value, hold);
                if (!hold) this.redraw();
                break;
            case "scale_base":
                this.fire_event("scalechanged", key, value);
                this.scale.set("base", value, hold);
                if (!hold) this.redraw();
                break;
            case "base":
                if (value === false) {
                    this.options.base = this.options.min;
                    this.__based = false;
                } else {
                    this.__based = true;
                }
                this.fire_event("basechanged", value);
                if (!hold) this.redraw();
                key = false;
                break;
            default:
                Widget.prototype.set.call(this, key, value, hold);
                break;
        }
        return this;
    }
});
})(this);
