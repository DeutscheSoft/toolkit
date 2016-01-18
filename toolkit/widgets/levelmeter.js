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
function vert(O) {
    return O.layout == _TOOLKIT_LEFT || O.layout == _TOOLKIT_RIGHT;
}
function clip_timeout() {
    var O = this.options;
    if (!O.auto_clip || O.auto_clip < 0) return false;
    if (this.__cto) return;
    if (O.clip)
        this.__cto = window.setTimeout(this._reset_clip, O.auto_clip);
}
function peak_timeout() {
    var O = this.options;
    if (!O.auto_peak || O.auto_peak < 0) return false;
    if (this.__pto) window.clearTimeout(this.__pto);
    var value = +this.effective_value();
    if (O.peak > O.base && value > O.base ||
        O.peak < O.base && value < O.base)
        this.__pto = window.setTimeout(this._reset_peak, O.auto_peak);
}
function label_timeout() {
    var O = this.options;
    var peak_label = (0 | O.peak_label);
    var base = +O.base;
    var label = +O.label;
    var value = +this.effective_value();

    if (peak_label <= 0) return false;

    if (this.__lto) return;

    if (label > base && value > base ||
        label < base && value < base)

        this.__lto = window.setTimeout(this._reset_label, peak_label);
}
function top_timeout() {
    var O = this.options;
    if (!O.auto_hold || O.auto_hold < 0) return false;
    if (this.__tto) window.clearTimeout(this.__tto);
    if (O.top > O.base)
        this.__tto = window.setTimeout(
            this._reset_top,
            O.auto_hold);
    else
        this.__tto = null;
}
function bottom_timeout() {
    var O = this.options;
    if (!O.auto_hold || O.auto_hold < 0) return false;
    if (this.__bto) window.clearTimeout(this.__bto);
    if (O.bottom < O.base)
        this.__bto = window.setTimeout(this._reset_bottom, O.auto_hold);
    else
        this.__bto = null;
}
function draw_peak() {
    var O = this.options;
    var n = this._peak_label;
    var v = O.format_peak(O.peak);
    if (n.firstChild) {
        n.firstChild.nodeValue = v;
    } else n.appendChild(document.createTextNode(v));
    if (O.peak > O.min && O.peak < O.max && O.show_peak) {
        this._peak.style["display"] = "block";
        var pos = 0;
        if (vert(O)) {
            pos = O.basis - this.val2px(this.snap(O.peak));
            pos = Math.min(O.basis, pos);
            this._peak.style["top"] = pos + "px";
        } else {
            pos = this.val2px(this.snap(O.peak));
            pos = Math.min(O.basis, pos)
            this._peak.style["left"] = pos + "px";
        }
    } else {
        this._peak.style["display"] = "none";
    }
    this.fire_event("drawpeak");
}
    
w.TK.LevelMeter = w.LevelMeter = $class({
    /**
     * LevelMeter is a fully functional display of numerical values. They are
     * enhanced MeterBases containing a clip LED, a peak pin with value label
     * and hold markers. LevelMeters have some automatically triggered
     * functionality like falling and resetting all kinds of values after a
     * time. All additional elements can be set automatically as soon as the
     * value rises above them.
     * 
     * @class TK.LevelMeter
     * @extends TK.MeterBase
     */
    _class: "LevelMeter",
    Extends: MeterBase,
    _options: Object.assign(Object.create(MeterBase.prototype._options), {
        clip: "boolean",
        falling: "number",
        falling_fps: "number",
        falling_init: "number",
        peak: "number",
        top: "number",
        bottom: "number",
        hold_size: "int",
        show_peak: "boolean",
        show_clip: "boolean",
        show_hold: "boolean",
        clipping: "number",
        auto_clip: "int",
        auto_peak: "int",
        peak_label: "int",
        auto_hold: "int",
        format_peak: "function",
        clip_options: "object",
    }),
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
        format_peak: function (value) { return (+value).toFixed(2); },
        clip_options: {}       // add options for the clipping LED
    },
    
    initialize: function (options) {
        MeterBase.prototype.initialize.call(this, options, true);
        this._reset_label = this.reset_label.bind(this);
        this._reset_clip = this.reset_clip.bind(this);
        this._reset_peak = this.reset_peak.bind(this);
        this._reset_top = this.reset_top.bind(this);
        this._reset_bottom = this.reset_bottom.bind(this);
        TK.add_class(this.element, "toolkit-level-meter");

        var O = this.options;
        
        this.state = new State(Object.assign({
            "class": "toolkit-clip"
        }, O.clip_options));
        this.add_child(this.state);
        
        this._clip       = this.state.element;
        this._peak       = TK.element("div","toolkit-peak");
        this._peak_label = TK.element("div","toolkit-peak-label");
        this._mask3      = TK.element("div","toolkit-mask","toolkit-mask3");
        this._mask4      = TK.element("div","toolkit-mask","toolkit-mask4");
        
        this.element.appendChild(this._clip);
        this._peak.appendChild(this._peak_label);
        this._bar.appendChild(this._mask3);
        this._bar.appendChild(this._mask4);
        this._bar.appendChild(this._peak);
        
        if (O.peak === false)
            O.peak = O.value;
        if (O.top === false)
            O.top = O.value;
        if (O.bottom === false)
            O.bottom = O.value;
        if (O.falling < 0)
            O.falling = -O.falling;
    },
    
    redraw: function () {
        var O = this.options;
        var I = this.invalid;
        var E = this.element;

        if (I.show_hold) {
            I.show_hold = false;
            (O.show_hold ? TK.add_class : TK.remove_class)(E, "toolkit-has-hold");
        }
        if (I.show_clip) {
            I.show_clip = false;
            this._clip.style["display"] =  O.show_clip  ? "block" : "none";
            (O.show_clip ? TK.add_class : TK.remove_class)(E, "toolkit-has-clip");
        }
        if (I.show_peak) {
            I.show_peak = false;
            this._peak.style["display"] =  O.show_peak  ? "block" : "none";
            (O.show_peak ? TK.add_class : TK.remove_class)(E, "toolkit-has-peak");
        }

        MeterBase.prototype.redraw.call(this);

        if (I.peak) {
            I.peak = false;
            draw_peak.call(this);
        }
        if (I.clip) {
            I.clip = false;
            if (O.clip) {
                TK.add_class(E, "toolkit-clipping");
            } else {
                TK.remove_class(E, "toolkit-clipping");
            }
        }
    },
    destroy: function () {
        this.state.destroy();
        this._peak.remove();
        this._peak_label.remove();
        this._mask3.remove();
        this._mask4.remove();
        MeterBase.prototype.destroy.call(this);
    },
    reset_peak: function () {
        if (this.__pto) clearTimeout(this.__pto);
        this.__pto = false;
        this.set("peak", this.effective_value());
        this.fire_event("resetpeak");
    },
    reset_label: function () {
        if (this.__lto) clearTimeout(this.__lto);
        this.__lto = false;
        this.set("label", this.effective_value());
        this.fire_event("resetlabel");
    },
    reset_clip: function () {
        if (this.__cto) clearTimeout(this.__cto);
        this.__cto = false;
        this.set("clip", false);
        this.fire_event("resetclip");
    },
    reset_top: function () {
        this.set("top", this.effective_value());
        this.fire_event("resettop");
    },
    reset_bottom: function () {
        this.set("bottom", this.effective_value());
        this.fire_event("resetbottom");
    },
    reset_all: function () {
        this.reset_label();
        this.reset_peak();
        this.reset_clip();
        this.reset_top();
        this.reset_bottom();
    },

    effective_value: function() {
        var O = this.options;
        var falling = +O.falling;
        if (O.falling <= 0) return O.value;
        var value = +O.value, base = +O.base;
        var age = +(Date.now() - this.value_time.value);

        var frame_length = 1000.0 / +O.falling_fps;

        if (age > O.falling_init * frame_length) {
            if (value > base) {
                value -= falling * (age / frame_length);
                if (value < base) value = base;
            } else {
                value += falling * (age / frame_length);
                if (value > base) value = base;
            }
        }

        return value;
    },
    
    draw_meter: function () {
        var O = this.options;
        var falling = +O.falling;
        var value   = +O.value;
        var base    = +O.base;

        if (falling) {
            value = this.effective_value();
            // continue animation
            if (value !== base) {
                this.invalid.value = true;
                // request another frame
                this.trigger_draw_next();
            }
        }

        var is_vertical = !!vert(O);
        
        if (!O.show_hold) {
            MeterBase.prototype.draw_meter.call(this, value);
        } else {
            var m1 = this._mask1.style;
            var m3 = this._mask3.style;
           
            // shorten things
            var r         = O.reverse;
            var size      = O.basis;
            var top       = O.top;
            var hold_size = O.hold_size;
            var segment   = O.segment;
            
            var _top      = +this._val2seg(Math.max(top, base));
            var top_val   = +this._val2seg(Math.max(value, base));
            var top_top   = Math.max(top_val, _top);
            var top_bot   = top_top - segment * hold_size;
            var top_size  = Math.max(0, _top - top_val - segment * hold_size);
            
            m1[is_vertical ? "height" : "width"] = Math.max(0, size - top_top) + "px";
            m3[is_vertical ? (r ? "bottom" : "top")
                            : (r ? "left" : "right")] = (size - top_bot) + "px";
            m3[is_vertical ? "height" : "width"] = top_size + "px";
            
            if (this.__based) {
                var bottom    = O.bottom;

                var m2 = this._mask2.style;
                var m4 = this._mask4.style;
                var _bot     = +this._val2seg(Math.min(bottom, base));
                var bot_val  = +this._val2seg(Math.min(value, base));
                var bot_bot  = Math.min(bot_val, _bot);
                var bot_top  = bot_bot + segment * hold_size;
                var bot_size = Math.max(0, bot_val - bot_top);
                
                m2[is_vertical ? "height" : "width"] = Math.max(0, bot_bot) + "px";
                m4[is_vertical ? (r ? "top" : "bottom")
                        : (r ? "right" : "left")] = bot_top + "px";
                m4[is_vertical ? "height" : "width"] = bot_size + "px";
            }
            this.fire_event("drawmeter");
        }
    },
    
    // GETTER & SETTER
    set: function (key, value) {
        var O = this.options;
        if (key == "value") {
            if (O.falling) {
                var v = this.effective_value();
                var base = O.base;
                if (v > base && value > base && value < v) return;
                if (v < base && value < base && value > v) return;
            }
            if (O.auto_clip !== false && value > O.clipping && !this.__based) {
                this.set("clip", true);
            }
            if (O.peak_label !== false &&
                (value > O.label && value > base || value < O.label && value < base)) {
                this.set("label", value);
            }
            if (O.auto_peak !== false &&
                (value > O.peak && value > base || value < O.peak && value < base)) {
                this.set("peak", value);
            }
            if (O.auto_hold !== false && O.show_hold && value > O.top) {
                this.set("top", value, true);
            }
            if (O.auto_hold !== false && O.show_hold && value < O.bottom && this.__based) {
                this.set("bottom", value);
            }
        }
        value = MeterBase.prototype.set.call(this, key, value);
        switch (key) {
            case "peak":
                this.fire_event("peakchanged");
                peak_timeout.call(this);
                break;
            case "clip":
                if (value) {
                    this.fire_event("clipping");
                    clip_timeout.call(this);
                }
                this.state.set("state", value);
                break;
            case "top":
                top_timeout.call(this);
                this.fire_event("topchanged");
                break;
            case "bottom":
                bottom_timeout.call(this);
                this.fire_event("bottomchanged");
                break;
            case "label":
                label_timeout.call(this);
                break;
            case "auto_clip":
                if (this.__cto && 0|value <=0)
                    window.clearTimeout(this.__cto);
                break;
            case "auto_peak":
                if (this.__pto && 0|value <=0)
                    window.clearTimeout(this.__pto);
                break;
            case "peak_label":
                if (this.__lto && 0|value <=0)
                    window.clearTimeout(this.__lto);
                break;
            case "auto_hold":
                if (this.__tto && 0|value <=0)
                    window.clearTimeout(this.__tto);
                if (this.__bto && 0|value <=0)
                    window.clearTimeout(this.__bto);
                break;
        }

        return value;
    }
});
})(this);
