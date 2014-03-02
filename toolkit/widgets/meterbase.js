 /* toolkit. provides different widgets, implements and modules for 
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
 
var MeterBase = new Class({
    // MeterBase is a base class to build different meters like LevelMeter.
    // MeterBase extends Gradient and implements Widget.
    // MeterBase has a Scale widget.
    
    _class: "MeterBase",
    Extends: Widget,
    Implements: [Ranged, Gradient],
    __margin:   0,
    __based:    false,
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
        format_label:    function (value) { return sprintf("%0.2f", value); },
                                          // callback function for formatting
                                          // the label
        division:         1,              // minimum step size
        levels:           [1, 5, 10],     // array of steps where to draw labels
                                          // and marker
        scale_base:       false,          // base value where dots and labels are
                                          // drawn from
        format_labels:    function (val) { return sprintf("%0.2f",  val); },
                                          // callback function for formatting
                                          // the labels of the scale
        gap_dots:         4,              // minimum gap between dots (pixel)
        gap_labels:       40              // minimum gap between labels (pixel)
    },
    
    initialize: function (options, hold) {
        this.parent(options);
        this.element = this.widgetize(
                       new Element("div.toolkit-meter-base"), false, true, true);
        
        if (this.options.reverse)
            this.element.addClass("toolkit-reverse");
        
        if (this.element.getStyle("position") != "absolute"
            && this.element.getStyle("position") != "relative")
            this.element.setStyle("position", "relative");
        
        switch (this.options.layout) {
            case _TOOLKIT_LEFT:
                this._label  = new Element(
                    "div.toolkit-label").inject(this.element);
                this._scale  = new Element(
                    "div.toolkit-meter-scale").inject(this.element);
                this._bar    = new Element(
                    "div.toolkit-bar").inject(this.element);
                this._title  = new Element(
                    "div.toolkit-title").inject(this.element);
                this.element.addClass("toolkit-vertical toolkit-left");
                break;
            case _TOOLKIT_RIGHT:
                this._label  = new Element(
                    "div.toolkit-label").inject(this.element);
                this._scale  = new Element(
                    "div.toolkit-meter-scale").inject(this.element);
                this._bar    = new Element(
                    "div.toolkit-bar").inject(this.element);
                this._title  = new Element(
                    "div.toolkit-title").inject(this.element);
                this.element.addClass("toolkit-vertical toolkit-right");
                break;
            case _TOOLKIT_TOP:
                this._bar    = new Element(
                    "div.toolkit-bar").inject(this.element);
                this._scale  = new Element(
                    "div.toolkit-meter-scale").inject(this.element);
                this._title  = new Element(
                    "div.toolkit-title").inject(this.element);
                this._label  = new Element(
                    "div.toolkit-label").inject(this.element);
                this.element.addClass("toolkit-horizontal toolkit-top");
                break;
            case _TOOLKIT_BOTTOM:
                this._title  = new Element(
                    "div.toolkit-title").inject(this.element);
                this._label  = new Element(
                    "div.toolkit-label").inject(this.element);
                this._scale  = new Element(
                    "div.toolkit-meter-scale").inject(this.element);
                this._bar    = new Element(
                    "div.toolkit-bar").inject(this.element);
                this.element.addClass("toolkit-horizontal toolkit-bottom");
                break;
        }
        
        this._base   = new Element("div.toolkit-base").inject(this._bar);
        this._mark   = new Element("div.toolkit-mark").inject(this._bar);
        this._over   = new Element("div.toolkit-over").inject(this._bar);
        
        this._mask1  = new Element(
            "div.toolkit-mask.toolkit-mask1").inject(this._bar);
        this._mask2  = new Element(
            "div.toolkit-mask.toolkit-mask2").inject(this._bar);
        
        this._bar.setStyles({
            position: "relative",
            overflow: "hidden"
        });
        this._base.setStyles({
            position: "absolute",
            width:    "100%",
            height:   "100%",
            zIndex:   0
        });
        this._mark.setStyles({
            position: "absolute",
            width:    "100%",
            height:   "100%",
            zIndex:   10
        });
        this._over.setStyles({
            position: "absolute",
            width:    "100%",
            height:   "100%",
            zIndex:   100
        });
        this._mask1.setStyles({
            position: "absolute",
            zIndex:   1000
        });
        this._mask2.setStyles({
            position: "absolute",
            zIndex:   1000
        });
        if (this.options.layout == _TOOLKIT_LEFT) {
            this._scale.setStyles({
                "float": "right"
            });
            this._bar.setStyles({
                "float": "left"
            });
        }
        if (this.options.layout == _TOOLKIT_RIGHT) {
            this._scale.setStyles({
                "float": "left"
            });
            this._bar.setStyles({
                "float": "right"
            });
        }
        if (this._vert()) {
            if (this.options.reverse) {
                this._mask1.setStyles({
                    width:  "100%",
                    height: 0,
                    bottom: 0
                });
                this._mask2.setStyles({
                    width:  "100%",
                    height: 0,
                    top:    0
                });
            } else {
                this._mask1.setStyles({
                    width:  "100%",
                    height: 0,
                    top:    0
                });
                this._mask2.setStyles({
                    width:  "100%",
                    height: 0,
                    bottom: 0
                });
            }
        } else {
            this._scale.setStyles({
                "clear": "both"
            });
            this._title.setStyles({
                "clear": "both"
            });
            if (this.options.reverse) {
                this._mask1.setStyles({
                    height: "100%",
                    width:  0,
                    left:   0
                });
                this._mask2.setStyles({
                    height: "100%",
                    width:  0,
                    right:  0
                });
            } else {
                this._mask1.setStyles({
                    height: "100%",
                    width:  0,
                    right:  0
                });
                this._mask2.setStyles({
                    height: "100%",
                    width:  0,
                    left:   0
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
        
        var options = Object.merge({}, this.options);
        options. base = this.__based?this.options.base:this.options.scale_base;
        options.container = this._scale,
        this.scale = new Scale(options);
        
        this.delegate(this._bar);
        
        if (!hold)
            this.redraw();
        this.initialized();
        return this;
    },
    destroy: function () {
        this._label.destroy();
        this._scale.destroy();
        this._bar.destroy();
        this._title.destroy();
        this._base.destroy();
        this._mark.destroy();
        this._over.destroy();
        this._mask1.destroy();
        this._mask2.destroy();
        this.element.destroy();
        this.parent();
    },
    redraw: function () {
        this.set("title", this.options.title);
        this.set("label", this.options.label);
        this.set("value", this.options.value);
        switch (this.options.layout) {
            case _TOOLKIT_LEFT:
            case _TOOLKIT_RIGHT:
                var s = this._bar_size(this.options.layout);
                this._bar.outerHeight(s);
                this._scale.outerHeight(s);
                var i = this._bar.innerHeight();
                if (i != this.options.basis) {
                    this.options.basis = i;
                    this.scale.set("basis", i);
                }
                this._scale.innerHeight(i);
                break;
            case _TOOLKIT_TOP:
            case _TOOLKIT_BOTTOM:
                var s = this._bar_size(this.options.layout);
                this._bar.outerWidth(s);
                this._scale.outerWidth(s);
                var i = this._bar.innerWidth();
                if (i != this.options.basis) {
                    this.options.basis = i;
                    this.scale.set("basis", i);
                }
                break;
        }
        this.draw_meter();
        if (this.options.show_scale) {
            this.scale.redraw();
            if (this.options.show_marker) {
                this._mark.empty();
                this.scale.element.getChildren(".toolkit-dot").each(
                    function (e) {
                        var d = e.clone();
                        var p = e.getPosition(this._scale)[this._vert()?"y":"x"];
                        d.setStyle(this._vert() ? "width" : "height", "100%");
                        d.setStyle(this._vert() ? "top" : "left",
                                   p + p % this.options.segment);
                        d.inject(this._mark);
                    }.bind(this));
            }
        }
        if (this._vert())
            this.element.innerWidth(
                this._bar.outerWidth()
                + (this.options.show_scale ? this._scale.outerWidth() : 0));
        this.parent();
        return this;
    },
    
    draw_meter: function () {
        // Set the mask elements according to options.value to show a value in
        // the meter bar
        var pos = Math.max(0,
                  this._val2seg(Math.min(this.options.max, Math.max(this.options.base, this.options.value))));
        this._mask1.style[this._vert() ? "height" : "width"] = (this.options.basis - pos) + "px";
        if (!this.__based) return;
        var pos = Math.max(0,
                  this._val2seg(Math.min(this.options.base, this.options.value)));
        this._mask2.style[this._vert() ? "height" : "width"] = pos + "px";
        //this._mask2.setStyle(this._vert() ? "height" : "width", pos);
    },
    
    // HELPERS & STUFF
    _val2seg: function (val) {
        // rounds values to fit in the segments size
        // always returns values without taking options.reverse into account
        var s = this.val2px(val)
        s -= s % this.options.segment;
        if (this.options.reverse)
            s = this.options.basis - s;
        return s;
    },
    _bar_size: function () {
        // determine a size for the meter bar based on several conditions
        var s = this.element[this._vert() ? "innerHeight" : "innerWidth"]();
        if (this.options.show_label && this._vert())
            s -= this._label.outerHeight();
        if (this.options.show_title && this._vert())
            s -= this._title.outerHeight();
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
                    this._label.setStyle("display", value ? "block" : "none");
                break;
            case "show_title":
                if (!hold)
                    this._title.setStyle("display", value ? "block" : "none");
                break;
            case "show_scale":
                if (!hold)
                    this._scale.setStyle("display", value ? "block" : "none");
                break;
            case "label":
                this.fireEvent("labelchanged", [value, this]);
                if (!hold) {
                    var s = this.options.format_label(value);
                    var n = this._label;
                    if (n.firstChild) {
                        n.removeChild(n.firstChild);
                    }
                    n.appendChild(document.createTextNode(s));
                    //this._label.set("html", this.options.format_label(value));
                }

                break;
            case "value":
                this.fireEvent("valuechanged", [value, this]);
                if (!hold)
                    this.draw_meter(value);
                break;
            case "title":
                this.fireEvent("titlechanged", [value, this]);
                if (!hold)
                    this._title.set("html", value);
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
                this.fireEvent("scalechanged", [key, value, this]);
                if (!hold) this.redraw();
                break;
            case "format_labels":
                this.fireEvent("scalechanged", [key, value, this]);
                this.scale.set("labels", value, hold);
                if (!hold) this.redraw();
                break;
            case "scale_base":
                this.fireEvent("scalechanged", [key, value, this]);
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
                this.fireEvent("basechanged", [value, this]);
                if (!hold) this.redraw();
                key = false;
                break;
        }
        this.parent(key, value, hold);
        return this;
    }
});
