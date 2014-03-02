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
 
LevelMeter = new Class({
    // LevelMeter is a fully functional display of numerical values. They are
    // enhanced MeterBases containing a clip LED, a peak pin with value label
    // and hold markers. LevelMeters have some automatically triggered
    // functionality like falling and resetting all kinds of values after a
    // time. All additional elements can be set automatically as soon as the
    // value rises above them.
    _class: "LevelMeter",
    Extends: MeterBase,
    options: {
        clip:         false,   // state of the clipping LED
        falling:      0,       // if falling is active set a step size per frame
        falling_fps:  24,      // frames per second for falling
        falling_init: 2,       // frames of the initial falling (avoid
                               // flickering while using external and internal
                               // falling)
        peak:         false,   // peak value; false = value
        top:          false,   // top hold value; false = value
        bottom:       false,   // bottom hold value (if we have a base other
                               // than min)
        hold_size:    1,       // amount of segments for top hold
        show_peak:    false,   // show the peak marker
        show_clip:    false,   // show clipping LED
        show_hold:    false,   // show peak hold LEDs
        clipping:     0,       // if auto_clip is active, value when clipping
                               // appears
        auto_clip:    false,   // set to a number when clipping appears or to
                               // false if disabled
                               //     -1:    infinite positioning
                               //     n:     in milliseconds to auto-reset
                               //     false: no auto peak
        auto_peak:    false,   // if the peak automatically follows the program:
                               //     -1:    infinite positioning
                               //     n:     in milliseconds to auto-reset
                               //     false: no auto peak
        peak_label:   false,   // if the label automatically shows the max peak
                               //     -1:    infinite display
                               //     n:     in milliseconds to auto-reset
                               //     false: no peak label
        auto_hold:    false,   // if the hold automatically follows the program:
                               //     -1:    infinite positioning
                               //     n:     in milliseconds to auto-reset
                               //     false: no auto hold
        format_peak: function (value) { return sprintf("%0.2f", value); },
        clip_options: {}       // add options for the clipping LED
    },
    
    initialize: function (options) {
        this.parent(options, true);
        this.element.addClass("toolkit-level-meter");
        
        this.state = new State(Object.append({
            "class": "toolkit-clip"
        }, this.options.clip_options));
        this._clip = this.state.element;
        
        if (this.options.layout == _TOOLKIT_TOP
        || this.options.layout == _TOOLKIT_BOTTOM) {
            this.state.element.inject(this._bar, "after");
        } else {
            this.state.element.inject(this._scale, "before");
        }
        this._peak       = new Element(
                           "div.toolkit-peak").inject(this.element);
        this._peak_label = new Element(
                           "div.toolkit-peak-label").inject(this._peak);
        this._mask3      = new Element(
                           "div.toolkit-mask.toolkit-mask3").inject(this._bar);
        this._mask4      = new Element(
                           "div.toolkit-mask.toolkit-mask4").inject(this._bar);
        
        this._falling = this.options.value;
        if (this.options.peak === false)
            this.options.peak = this.options.value;
        if (this.options.top === false)
            this.options.top = this.options.value;
        if (this.options.bottom === false)
            this.options.bottom = this.options.value;
        this._mask3.setStyles({
            position: "absolute",
            zIndex:  1000
        });
        this._mask4.setStyles({
            position: "absolute",
            zIndex:  1000
        });
        if (this.options.layout == _TOOLKIT_LEFT
        || this.options.layout == _TOOLKIT_RIGHT) {
            if (this.options.reverse) {
                this._mask3.setStyles({
                    width:  "100%",
                    height: 0,
                    bottom:    0
                });
                this._mask4.setStyles({
                    width:  "100%",
                    height: 0,
                    top: 0
                });
            } else {
                this._mask3.setStyles({
                    width:  "100%",
                    height: 0,
                    top: 0
                });
                this._mask4.setStyles({
                    width:  "100%",
                    height: 0,
                    bottom:    0
                });
            }
        } else {
            if (this.options.reverse) {
                this._mask3.setStyles({
                    height: "100%",
                    width:  0,
                    left:   0
                });
                this._mask4.setStyles({
                    height: "100%",
                    width:  0,
                    right:  0
                });
            } else {
                this._mask3.setStyles({
                    height: "100%",
                    width:  0,
                    right:  0
                });
                this._mask4.setStyles({
                    height: "100%",
                    width:  0,
                    left:   0
                });
            }
        }
        
        this.set("show_peak", this.options.show_peak);
        this.set("show_clip", this.options.show_clip);
        this.set("show_hold", this.options.show_hold);
        this.set("clip", this.options.clip);
        this.redraw();
        this.initialized();
    },
    
    redraw: function () {
        switch (this.options.layout) {
            case _TOOLKIT_LEFT:
            case _TOOLKIT_RIGHT:
                this.__margin = this._bar.CSSSpace(
                    "margin", "border", "padding"
                ).top + this._bar.getPosition(this.element).y;
                var m = (this.options.show_clip ? this._clip.outerHeight() : 0);
                this._scale.style["top"] = m + "px";
                break;
            case _TOOLKIT_TOP:
            case _TOOLKIT_BOTTOM:
                this.__margin = this._bar.CSSSpace(
                    "margin", "border", "padding"
                ).left + this._bar.getPosition(this.element).x;
                break;
        }
        this.set("peak", this.options.peak);
        this.parent();
    },
    destroy: function () {
        this.state.destroy();
        this._peak.destroy();
        this._peak_label.destroy();
        this._mask3.destroy();
        this._mask4.destroy();
        this.parent();
    },
    reset_peak: function () {
        this.set("peak", this.options.value);
        this.fireEvent("resetpeak", this);
    },
    reset_label: function () {
        delete this.__lto;
        this.set("label", this.options.value);
        this.fireEvent("resetlabel", this);
    },
    reset_clip: function () {
        this.set("clip", false);
        this.fireEvent("resetclip", this);
    },
    reset_top: function () {
        this.set("top", this.options.value);
        this.fireEvent("resettop", this);
    },
    reset_bottom: function () {
        this.set("bottom", this.options.value);
        this.fireEvent("resetbottom", this);
    },
    reset_all: function () {
        this.reset_label();
        this.reset_peak();
        this.reset_clip();
        this.reset_top();
        this.reset_bottom();
    },
    
    draw_meter: function (value) {
        var _c = true;
        if (this.options.falling) {
            if (this.options.value > this._falling
            && this.options.value > this.options.base
            || this.options.value < this._falling
            && this.options.value < this.options.base) {
                this._falling = this.options.value;
                this.__falling = false;
            } else if (typeof value == "undefined") {
                if (this._falling > this.options.base)
                    this._falling -= Math.min(Math.abs(
                        this._falling - this.options.base
                    ), Math.abs(this.options.falling));
                else if (this._falling < this.options.base)
                    this._falling += Math.min(Math.abs(
                        this.options.base - this._falling
                    ), Math.abs(this.options.falling));
                _c = false;
                this.__falling = true;
            }
            this.options.value = this._falling;
            this._falling_timeout();
        }
        if (this.options.peak_label !== false
        && this.options.value > this.options.label
        && this.options.value > this.options.base
        || this.options.value < this.options.label
        && this.options.value < this.options.base) {
            this.set("label", this.options.value);
        }
        if (this.options.auto_peak !== false
        && this.options.value > this.options.peak
        && this.options.value > this.options.base
        || this.options.value < this.options.peak
        && this.options.value < this.options.base) {
            this.set("peak", this.options.value);
        }
        if (this.options.auto_clip !== false
        && _c
        && this.options.value > this.options.clipping
        && !this.__based) {
            this.set("clip", true);
        }
        if (this.options.auto_hold !== false
        && this.options.show_hold
        && this.options.value > this.options.top) {
            this.set("top", this.options.value, true);
        }
        if (this.options.auto_hold !== false
        && this.options.show_hold
        && this.options.value < this.options.bottom
        && this.__based) {
            this.set("bottom", this.options.value, true);
        }
        
        if (!this.options.show_hold) {
            this.parent();
            if (!this.__tres) {
                this.__tres = true;
                this._mask3.style[this._vert() ? "height" : "width"] = 0;
                this._mask4.style[this._vert() ? "height" : "width"] = 0;
            }
        } else {
            this.__tres = false;
            
            var m1 = {};
            var m2 = {};
            var m3 = {};
            var m4 = {};
            
            // shorten things
            var r         = this.options.reverse;
            var base      = this.options.base;
            var size      = this.options.basis;
            var value     = this.options.value;
            var top       = this.options.top;
            var bottom    = this.options.bottom;
            var hold_size = this.options.hold_size;
            var segment   = this.options.segment;
            
            var _top      = this._val2seg(Math.max(top, base));
            var top_val   = this._val2seg(Math.max(value, base));
            var top_top   = Math.max(top_val, _top);
            var top_bot   = top_top - segment * hold_size;
            var top_size  = Math.max(0, _top - top_val - segment * hold_size);
            
            m1[this._vert() ? "height" : "width"] = Math.max(0, size - top_top);
            m3[this._vert() ? (r ? "bottom" : "top")
                            : (r ? "left" : "right")] = size - top_bot;
            m3[this._vert() ? "height" : "width"] = top_size;
            
            this._mask1.setStyles(m1);
            this._mask3.setStyles(m3);
            
            if (this.__based) {
                var _bot     = this._val2seg(Math.min(bottom, base));
                var bot_val  = this._val2seg(Math.min(value, base));
                var bot_bot  = Math.min(bot_val, _bot);
                var bot_top  = bot_bot + segment * hold_size;
                var bot_size = Math.max(0, bot_val - bot_top);
                
                m2[this._vert() ? "height" : "width"] = Math.max(0, bot_bot);
                m4[this._vert() ? (r ? "top" : "bottom")
                                : (r ? "right" : "left")] = bot_top;
                m4[this._vert() ? "height" : "width"] = bot_size;
                
                this._mask2.setStyles(m2);
                this._mask4.setStyles(m4);
            }
            this.fireEvent("drawmeter", this);
        }
    },
    
    draw_peak: function () {
        var n = this._peak_label;
        var v = this.options.format_peak(this.options.peak);
        if (n.firstChild) {
            n.removeChild(n.firstChild);
        }
        n.appendChild(document.createTextNode(v));
        if (this.options.peak > this.options.min
        && this.options.peak < this.options.max
        && this.options.show_peak) {
            this._peak.style["display"] = "block";
            var pos = 0;
            switch (this.options.layout) {
                case _TOOLKIT_LEFT:
                case _TOOLKIT_RIGHT:
                    pos = this.options.basis
                        - this.val2px(this.options.peak)
                        + this.__margin;
                    pos = Math.max(this.__margin, pos);
                    pos = Math.min(this.options.basis + this.__margin, pos);
                    this._peak.style["top"] = pos + "px";
                    break;
                case _TOOLKIT_TOP:
                case _TOOLKIT_BOTTOM:
                    pos = this.val2px(this.options.peak)
                        + this.__margin;
                    pos = Math.max(this.__margin, pos);
                    pos = Math.min(this.options.basis + this.__margin, pos)
                    this._peak.style["left"] = pos + "px";
                    break;
            }
        } else {
            this._peak.style["display"] = "none";
        }
        this.fireEvent("drawpeak", this);
    },
    
    // HELPERS & STUFF
    _bar_size: function () {
        var s = this.parent();
        if (this.options.show_clip) {
            var d = (this.options.layout == _TOOLKIT_LEFT
                  || this.options.layout == _TOOLKIT_RIGHT)
                   ? "outerHeight" : "outerWidth";
            s -= this._clip[d]();
        }
        return s;
    },
    _clip_timeout: function () {
        if (!this.options.auto_clip || this.options.auto_clip < 0) return false;
        if (this.__cto) window.clearTimeout(this.__cto);
        if (this.options.clip)
            this.__cto = window.setTimeout(
                this.reset_clip.bind(this),
                this.options.auto_clip);
        else
            this.__cto = null;
    },
    _peak_timeout: function () {
        if (!this.options.auto_peak || this.options.auto_peak < 0) return false;
        if (this.__pto) window.clearTimeout(this.__pto);
        if (this.options.peak > this.options.base
        && this.options.value > this.options.base
        || this.options.peak < this.options.base
        && this.options.value < this.options.base)
            this.__pto = window.setTimeout(
                this.reset_peak.bind(this),
                this.options.auto_peak);
        else
            this.__pto = null;
    },
    _label_timeout: function () {
        if (!this.options.peak_label || this.options.peak_label < 0) return false;
        if (this.__lto) return;
        if (this.options.label > this.options.base
        && this.options.value > this.options.base
        || this.options.label < this.options.base
        && this.options.value < this.options.base)
            this.__lto = window.setTimeout(
                this.reset_label.bind(this),
                this.options.peak_label);
        else
            this.__lto = null;
    },
    _top_timeout: function () {
        if (!this.options.auto_hold || this.options.auto_hold < 0) return false;
        if (this.__tto) window.clearTimeout(this.__tto);
        if (this.options.top > this.options.base)
            this.__tto = window.setTimeout(
                this.reset_top.bind(this),
                this.options.auto_hold);
        else
            this.__tto = null;
    },
    _bottom_timeout: function () {
        if (!this.options.auto_hold || this.options.auto_hold < 0) return false;
        if (this.__bto) window.clearTimeout(this.__bto);
        if (this.options.bottom < this.options.base)
            this.__bto = window.setTimeout(
                this.reset_bottom.bind(this),
                this.options.auto_hold);
        else
            this.__bto = null;
    },
    _falling_timeout: function () {
        if (!this.options.falling) return false;
        if (this.__fto) window.clearTimeout(this.__fto);
        if (this._falling > this.options.base
        && this.options.value > this.options.base
        || this._falling < this.options.base
        && this.options.value < this.options.base)
            this.__fto = window.setTimeout(
                this.draw_meter.bind(this),
                1000 / this.options.falling_fps
              * (this.__falling ? 1 : this.options.falling_init));
        else
            this.__fto = null;
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "show_peak":
                if (!hold)
                    this._peak.style["display"] =  value  ? "block" : "none";
                break;
            case "show_clip":
                if (!hold) {
                    this._clip.style["display"] =  value  ? "block" : "none";
                    this.redraw();
                }
                break;
            case "show_hold":
                if (!hold) {
                    this.draw_meter();
                }
                break;
            case "peak":
                if (!hold) {
                    this._peak_timeout();
                    this.draw_peak();
                }
                this.fireEvent("peakchanged");
                break;
            case "label":
                if (!hold) {
                    this._label_timeout();
                }
                break;
            case "clip":
                this._clip_timeout();
                if (!hold && value) {
                    this.fireEvent("clipping");
                    this.element.addClass("toolkit-clipping");
                    this.state.set("state", 1);
                } else {
                    this.element.removeClass("toolkit-clipping");
                    this.state.set("state", 0);
                }
                break;
            case "top":
                this._top_timeout();
                if (!hold) {
                    this.draw_meter();
                }
                this.fireEvent("topchanged");
                break;
            case "bottom":
                this._bottom_timeout();
                if (!hold) {
                    this.draw_meter();
                }
                this.fireEvent("bottomchanged");
                break;
            case "auto_clip":
                if (this.__cto && !value || value < 0)
                    window.clearTimeout(this.__cto);
                break;
            case "auto_peak":
                if (this.__pto && !value || value < 0)
                    window.clearTimeout(this.__pto);
                break;
            case "peak_label":
                if (this.__lto && !value || value < 0)
                    window.clearTimeout(this.__lto);
                break;
            case "auto_hold":
                if (this.__tto && !value || value < 0)
                    window.clearTimeout(this.__tto);
                if (this.__bto && !value || value < 0)
                    window.clearTimeout(this.__bto);
                break;
        }
        this.parent(key, value, hold);
    }
});
