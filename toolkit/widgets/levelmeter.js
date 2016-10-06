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
(function(w){ 
function vert(O) {
    return O.layout == "left" || O.layout == "right";
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

    if (this.__lto) window.clearTimeout(this.__lto);

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
     * TK.LevelMeter is a fully functional display of numerical values. They are
     * enhanced {@link TK.MeterBase}'s containing a clip LED, a peak pin with value label
     * and hold markers. In addition, LevelMeter has an optional falling animation,
     * top and bottom peak values and more.
     *
     * @param {Object} options
     * @property {boolean} [options.show_clip=false] - If set to <code>true</code>, show the clipping LED.
     * @property {number} [options.clipping=0] - If clipping is enabled, this is the threshold for the
     *  clipping effect.
     * @property {int|boolean} [options.auto_clip=false] - This is the clipping timeout. If set to
     *  <code>false</code> automatic clipping is disabled. If set to <code>n</code> the clipping effect
     *  times out after <code>n</code> ms, if set to <code>-1</code> it remains forever.
     * @property {boolean} [options.clip=false] - If clipping is enabled, this option is set to
     *  <code>true</code> when clipping happens. When automatic clipping is disabled, it can be set to
     *  <code>true</code> to set the clipping state.
     * @property {Object} [options.clip_options={}] - Additional options for the {@link TK.State} clip LED.
     * @property {boolean} [options.show_hold=false] - If set to <code>true</code>, show the hold value LED.
     * @property {int} [options.hold_size=1] - Size of the hold value LED in the number of segments.
     * @property {number|boolean} [options.auto_hold=false] - If set to <code>false</code> the automatic
     *  hold LED is disabled, if set to <code>n</code> the hold value is reset after <code>n</code> ms and
     *  if set to <code>-1</code> the hold value is not reset automatically.
     * @property {number} [options.top=false] - The top hold value. If set to <code>false</code> it will
     *  equal the meter level.
     * @property {number} [options.bottom=false] - The bottom hold value. This only exists if a
     *  <code>base</code> value is set and the value falls below the base.
     * @property {boolean} [options.show_peak=false] - If set to <code>true</code>, show the peak label.
     * @property {int|boolean} [options.peak_label=false] - If set to <code>false</code> the automatic peak
     *  label is disabled, if set to <code>n</code> the peak label is reset after <code>n</code> ms and
     *  if set to <code>-1</code> it remains forever.
     * @property {function} [options.format_peak=TK.FORMAT("%.2f")] - Formatting function for the peak label.
     * @property {number} [options.falling=0] - If set to a positive number, activates the automatic falling
     *  animation. The meter level will fall by this amount per frame.
     * @property {number} [options.falling_fps=24] - This is the number of frames of the falling animation.
     *  It is not an actual frame rate, but instead is used to determine the actual speed of the falling
     *  animation together with the option <code>falling</code>.
     * @property {number} [options.falling_init=2] - Initial falling delay in number of frames. This option
     *  can be used to delay the start of the falling animation in order to avoid flickering if internal
     *  and external falling are combined.
     *
     * @class TK.LevelMeter
     * @extends TK.MeterBase
     */
    _class: "LevelMeter",
    Extends: TK.MeterBase,
    _options: Object.assign(Object.create(TK.MeterBase.prototype._options), {
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
        clip:         false,
        falling:      0,
        falling_fps:  24,
        falling_init: 2,
        peak:         false,
        top:          false,
        bottom:       false,
        hold_size:    1,
        show_peak:    false,
        show_clip:    false,
        show_hold:    false,
        clipping:     0,
        auto_clip:    false,
        auto_peak:    false,
        peak_label:   false,
        auto_hold:    false,
        format_peak: TK.FORMAT("%.2f"),
        clip_options: {}
    },
    
    initialize: function (options) {
        TK.MeterBase.prototype.initialize.call(this, options, true);
        this._reset_label = this.reset_label.bind(this);
        this._reset_clip = this.reset_clip.bind(this);
        this._reset_peak = this.reset_peak.bind(this);
        this._reset_top = this.reset_top.bind(this);
        this._reset_bottom = this.reset_bottom.bind(this);
        TK.add_class(this.element, "toolkit-level-meter");

        var O = this.options;
        
        this.state = new TK.State(Object.assign({
            "class": "toolkit-clip"
        }, O.clip_options));
        this.add_child(this.state);
        
        this._clip       = this.state.element;
        this._peak       = TK.element("div","toolkit-peak");
        this._peak_label = TK.element("div","toolkit-peak-label");
        
        this.element.appendChild(this._clip);
        this._peak.appendChild(this._peak_label);
        this._bar.appendChild(this._peak);
        
        if (O.peak === false)
            O.peak = O.value;
        if (O.top === false)
            O.top = O.value;
        if (O.bottom === false)
            O.bottom = O.value;
        if (O.falling < 0)
            O.falling = -O.falling;

        /* track the age of the value option */
        this.track_option("value");
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

        TK.MeterBase.prototype.redraw.call(this);

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
        TK.MeterBase.prototype.destroy.call(this);
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

        var age = +this.value_time.value;

        if (!(age > 0)) age = Date.now();
        else age = +(Date.now() - age);

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

    /*
     * This is an _internal_ method, which calculates the non-filled regions
     * in the overlaying canvas as pixel positions. The canvas is only modified
     * using this information when it has _actually_ changed. This can save a lot
     * of performance in cases where the segment size is > 1 or on small devices where
     * the meter has a relatively small pixel size.
     */
    calculate_meter: function(to, value) {
        var O = this.options;
        var falling = +O.falling;
        var base    = +O.base;
        value = +value;

        // this is a bit unelegant...
        if (falling) {
            value = this.effective_value();
            // continue animation
            if (value !== base) {
                this.invalid.value = true;
                // request another frame
                this.trigger_draw_next();
            }
        }

        TK.MeterBase.prototype.calculate_meter.call(this, to, value);

        if (!O.show_hold) return;

        // shorten things
        var hold       = +O.top;
        var segment   = O.segment|0;
        var hold_size = (O.hold_size|0) * segment;
        var base      = +O.base;
        var pos;

        if (hold > base) {
            /* TODO: lets snap in set() */
            pos = this.val2px(this.snap(hold))|0;
            if (segment !== 1) pos = segment*(Math.round(pos/segment)|0);

            to.push(pos, pos+hold_size);
        }

        hold = +O.bottom;

        if (hold < base) {
            pos = this.val2px(this.snap(hold))|0;
            if (segment !== 1) pos = segment*(Math.round(pos/segment)|0);

            to.push(pos, pos+hold_size);
        }
    },
    
    // GETTER & SETTER
    set: function (key, value) {
        var O = this.options;
        if (key == "value") {
            var base = O.base;

            // snap will enforce clipping
            value = this.snap(value);

            if (O.falling) {
                var v = this.effective_value();
                if (v >= base && value >= base && value < v ||
                    v <= base && value <= base && value > v) {
                    /* NOTE: we are doing a falling animation, but maybe its not running */
                    if (!this.invalid.value) {
                        this.invalid.value = true;
                        this.trigger_draw();
                    }
                    return;
                }
            }
            if (O.auto_clip !== false && value > O.clipping && !this.__based) {
                this.set("clip", true);
            }
            if (O.show_label && O.peak_label !== false &&
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
        value = TK.MeterBase.prototype.set.call(this, key, value);
        switch (key) {
            case "show_peak":
            case "show_clip":
                this.trigger_resize();
                // fallthrough
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
