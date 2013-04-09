LevelMeter = new Class({
    Extends: MeterBase,
    options: {
        clip:         false,    // state of the clipping LED
        falling:      0,        // if falling is active set a step size per frame
        falling_fps:  24,       // frames per second for falling
        falling_init: 2,        // frames of the initial falling (avoid flickering while using external and internal falling)
        peak:         false,    // peak value; false = value
        top:          false,    // top hold value; false = value
        bottom:       false,    // bottom hold value (if we have a base other than min)
        hold_size:    1,        // amount of segments for top hold
        show_peak:    false,    // show the peak marker
        show_clip:    false,    // show clipping LED
        show_hold:    false,    // show peak hold LEDs
        clipping:     0,        // if auto_clip is active, value when clipping appears
        auto_clip:    false,    // set to a number when clipping appears or to false if disabled
                                //     -1:    infinite positioning
                                //     n:     in milliseconds to auto-reset
                                //     false: no auto peak
        auto_peak:    false,    // if the peak automatically follows the program:
                                //     -1:    infinite positioning
                                //     n:     in milliseconds to auto-reset
                                //     false: no auto peak
        peak_label:   false,    // if the label automatically shows the max peak
                                //     -1:    infinite display
                                //     n:     in milliseconds to auto-reset
                                //     false: no peak label
        auto_hold:    false,    // if the hold automatically follows the program:
                                //     -1:    infinite positioning
                                //     n:     in milliseconds to auto-reset
                                //     false: no auto hold
        format_peak: function (value) { return sprintf("%0.2f", value); }
    },
    
    initialize: function (options) {
        this.parent(options, true);
        this.element.addClass("toolkit-level-meter");
        
        this.__state = new State({
            "class": "toolkit-clip"
        });
        this._clip = this.__state.element;
        
        if(this.options.layout == _TOOLKIT_TOP || this.options.layout == _TOOLKIT_BOTTOM) {
            this.__state.element.inject(this._bar, "after");
        } else {
            this.__state.element.inject(this._scale, "before");
        }
        this._peak = new Element("div.toolkit-peak").inject(this.element);
        this._peak_label = new Element("div.toolkit-peak-label").inject(this._peak);
        this._mask3  = new Element("div.toolkit-mask.toolkit-mask3").inject(this._bar);
        this._mask4  = new Element("div.toolkit-mask.toolkit-mask4").inject(this._bar);
        
        this._falling = this.options.value;
        if(this.options.peak === false)
            this.options.peak = this.options.value;
        if(this.options.top === false)
            this.options.top = this.options.value;
        if(this.options.bottom === false)
            this.options.bottom = this.options.value;
        this._mask3.setStyles({
            position: "absolute",
            zIndex:  1000
        });
        this._mask4.setStyles({
            position: "absolute",
            zIndex:  1000
        });
        if(this.options.layout == _TOOLKIT_LEFT || this.options.layout == _TOOLKIT_RIGHT) {
            if(this.options.reverse) {
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
            if(this.options.reverse) {
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
    },
    
    redraw: function () {
        this.parent();
        switch(this.options.layout) {
            case _TOOLKIT_LEFT:
            case _TOOLKIT_RIGHT:
                this.__margin = this._bar.CSSSpace("margin", "border", "padding").top + this._bar.getPosition(this.element).y;
                var m = (this.options.show_clip ? this._clip.outerHeight() : 0);
                this._scale.setStyle("top", m);
                break;
            case _TOOLKIT_TOP:
            case _TOOLKIT_BOTTOM:
                this.__margin = this._bar.CSSSpace("margin", "border", "padding").left + this._bar.getPosition(this.element).x;
                break;
        }
        this.set("peak", this.options.peak);
    },
    destroy: function () {
        this.__state.destroy();
        this._peak.destroy();
        this._peak_label.destroy();
        this._mask3.destroy();
        this._mask4.destroy();
        this.element.destroy();
    },
    reset_peak: function () {
        this.set("peak", this.options.value);
    },
    reset_label: function () {
        this.set("label", this.options.value);
    },
    reset_clip: function () {
        this.set("clip", false);
    },
    reset_top: function () {
        this.set("top", this.options.value);
    },
    reset_bottom: function () {
        this.set("bottom", this.options.value);
    },
    reset_all: function () {
        this.reset_label();
        this.reset_peak();
        this.reset_clip();
        this.reset_top();
        this.reset_bottom();
    },
    
    _draw_meter: function (value) {
        var _c = true;
        var vert = this.options.layout == _TOOLKIT_LEFT || this.options.layout == _TOOLKIT_RIGHT
        if(this.options.falling) {
            if(this.options.value > this._falling && this.options.value > this.options.base
            || this.options.value < this._falling && this.options.value < this.options.base) {
                this._falling = this.options.value;
                this.__falling = false;
            } else if(typeof value == "undefined"){
                if (this._falling > this.options.base)
                    this._falling -= Math.min(Math.abs(this._falling - this.options.base), Math.abs(this.options.falling));
                else if (this._falling < this.options.base)
                    this._falling += Math.min(Math.abs(this.options.base - this._falling), Math.abs(this.options.falling));
                _c = false;
                this.__falling = true;
            }
            this.options.value = this._falling;
            this._falling_timeout();
        }
        if(this.options.peak_label !== false
        && this.options.value > this.options.label && this.options.value > this.options.base
        || this.options.value < this.options.label && this.options.value < this.options.base) {
            this.set("label", this.options.value);
        }
        if(this.options.auto_peak !== false
        && this.options.value > this.options.peak && this.options.value > this.options.base
        || this.options.value < this.options.peak && this.options.value < this.options.base) {
            this.set("peak", this.options.value);
        }
        if(this.options.auto_clip !== false && _c && this.options.value > this.options.clipping && !this.__based) {
            this.set("clip", true);
        }
        if(this.options.auto_hold !== false && this.options.show_hold && this.options.value > this.options.top) {
            this.set("top", this.options.value, true);
        }
        if(this.options.auto_hold !== false && this.options.show_hold && this.options.value < this.options.bottom && this.__based) {
            this.set("bottom", this.options.value, true);
        }
        
        if(!this.options.show_hold) {
            this.parent();
            if(!this.__tres) {
                this.__tres = true;
                this._mask3.setStyle(vert ? "height" : "width", 0);
                this._mask4.setStyle(vert ? "height" : "width", 0);
            }
        } else {
            this.__tres = false;
            
            var m1 = {};
            var m2 = {};
            var m3 = {};
            var m4 = {};
            
            var r        = this.options.reverse;
            var base     = this.options.base;
            var top      = this.val2seg(Math.max(this.options.top, this.options.base));
            var top_val  = this.val2seg(Math.max(this.options.value, this.options.base));
            var top_top  = Math.max(top_val, top);
            var top_bot  = top_top - this.options.segment * this.options.hold_size;
            var top_size = Math.max(0, top - top_val - this.options.segment * this.options.hold_size);
            
            
            m1[vert ? "height" : "width"] = Math.max(0, this.__size - top_top);
            m3[vert ? "height" : "width"] = top_size;
            m3[vert ? (r ? "bottom" : "top") : (r ? "left" : "right")] = this.__size - top_bot;
            
            this._mask1.setStyles(m1);
            this._mask3.setStyles(m3);
            
            if(this.__based) {
                var bot      = this.val2seg(Math.min(this.options.bottom, this.options.base));
                var bot_val  = this.val2seg(Math.min(this.options.value, this.options.base));
                var bot_bot  = Math.min(bot_val, bot);
                var bot_top  = bot_bot + this.options.segment * this.options.hold_size;
                var bot_size = Math.max(0, bot_val - bot_top);
                
                m2[vert ? "height" : "width"] = Math.max(0, bot_bot);
                m4[vert ? "height" : "width"] = bot_size;
                m4[vert ? (r ? "top" : "bottom") : (r ? "right" : "left")] = bot_top;
                
                this._mask2.setStyles(m2);
                this._mask4.setStyles(m4);
            }
        }
    },
    
    _draw_peak: function () {
        var r = this.options.reverse;
        this._peak_label.set("html", this.options.format_peak(this.options.peak));
        if(this.options.peak > this.options.min && this.options.peak < this.options.max && this.options.show_peak) {
            this._peak.setStyle("display", "block");
            switch(this.options.layout) {
                case _TOOLKIT_LEFT:
                case _TOOLKIT_RIGHT:
                    if(r) this._peak.setStyle("top", Math.min(this.__size + this.__margin, Math.max(this.__margin, this.val2px(this.options.peak) + this.__margin)));
                    else  this._peak.setStyle("top", Math.min(this.__size + this.__margin, Math.max(this.__margin, this.__size - this.val2px(this.options.peak) + this.__margin)));
                    break;
                case _TOOLKIT_TOP:
                case _TOOLKIT_BOTTOM:
                    if(r) this._peak.setStyle("left", Math.min(this.__size + this.__margin, Math.max(this.__margin, this.__size - this.val2px(this.options.peak) + this.__margin)));
                    else  this._peak.setStyle("left", Math.min(this.__size + this.__margin, Math.max(this.__margin, this.val2px(this.options.peak) + this.__margin)));
                    break;
            }
        } else {
            this._peak.setStyle("display", "none");
        }
    },
    
    // HELPERS & STUFF
    _bar_size: function () {
        var s = this.parent();
        if(this.options.show_clip)
            s -= this._clip[this.options.layout == _TOOLKIT_LEFT || this.options.layout == _TOOLKIT_RIGHT ? "outerHeight" : "outerWidth"]();
        return s;
    },
    
    _clip_timeout: function () {
        if(!this.options.auto_clip || this.options.auto_clip < 0) return false;
        if(this.__cto) window.clearTimeout(this.__cto);
        if(this.options.clip)
            this.__cto = window.setTimeout(this.reset_clip.bind(this), this.options.auto_clip);
        else
            this.__cto = null;
    },
    _peak_timeout: function () {
        if(!this.options.auto_peak || this.options.auto_peak < 0) return false;
        if(this.__pto) window.clearTimeout(this.__pto);
        if(this.options.peak > this.options.base && this.options.value > this.options.base
        || this.options.peak < this.options.base && this.options.value < this.options.base)
            this.__pto = window.setTimeout(this.reset_peak.bind(this), this.options.auto_peak);
        else
            this.__pto = null;
    },
    _label_timeout: function () {
        if(!this.options.peak_label || this.options.peak_label < 0) return false;
        if(this.__lto) window.clearTimeout(this.__lto);
        if(this.options.label > this.options.base && this.options.value > this.options.base
        || this.options.label < this.options.base && this.options.value < this.options.base)
            this.__lto = window.setTimeout(this.reset_label.bind(this), this.options.peak_label);
        else
            this.__lto = null;
    },
    _top_timeout: function () {
        if(!this.options.auto_hold || this.options.auto_hold < 0) return false;
        if(this.__tto) window.clearTimeout(this.__tto);
        if(this.options.top > this.options.base)
            this.__tto = window.setTimeout(this.reset_top.bind(this), this.options.auto_hold);
        else
            this.__tto = null;
    },
    _bottom_timeout: function () {
        if(!this.options.auto_hold || this.options.auto_hold < 0) return false;
        if(this.__bto) window.clearTimeout(this.__bto);
        if(this.options.bottom < this.options.base)
            this.__bto = window.setTimeout(this.reset_bottom.bind(this), this.options.auto_hold);
        else
            this.__bto = null;
    },
    _falling_timeout: function () {
        if(!this.options.falling) return false;
        if(this.__fto) window.clearTimeout(this.__fto);
        if(this._falling > this.options.base && this.options.value > this.options.base
        || this._falling < this.options.base && this.options.value < this.options.base)
            this.__fto = window.setTimeout(this._draw_meter.bind(this), 1000 / this.options.falling_fps * (this.__falling ? 1 : this.options.falling_init));
        else
            this.__fto = null;
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.parent(key, value, hold);
        switch(key) {
            case "show_peak":
                if(!hold) this._peak.setStyle("display",  value  ? "block" : "none");
                break;
            case "show_clip":
                if(!hold) {
                    this._clip.setStyle("display",  value  ? "block" : "none");
                    this.redraw();
                }
                break;
            case "show_hold":
                if(!hold) {
                    this._draw_meter();
                }
                break;
            case "peak":
                if(!hold) {
                    this._peak_timeout();
                    this._draw_peak();
                }
                this.fireEvent("peakchanged");
                break;
            case "label":
                if(!hold) {
                    this._label_timeout();
                }
                break;
            case "clip":
                this._clip_timeout();
                if(!hold && value) {
                    this.fireEvent("clipping");
                    this.element.addClass("toolkit-clipping");
                    this.__state.set("state", 1);
                } else {
                    this.element.removeClass("toolkit-clipping");
                    this.__state.set("state", 0);
                }
                break;
            case "top":
                this._top_timeout();
                if(!hold) {
                    this._draw_meter();
                }
                this.fireEvent("topchanged");
                break;
            case "bottom":
                this._bottom_timeout();
                if(!hold) {
                    this._draw_meter();
                }
                this.fireEvent("bottomchanged");
                break;
            case "auto_clip":
                if(this.__cto && !value || value < 0)
                    window.clearTimeout(this.__cto);
                break;
            case "auto_peak":
                if(this.__pto && !value || value < 0)
                    window.clearTimeout(this.__pto);
                break;
            case "peak_label":
                if(this.__lto && !value || value < 0)
                    window.clearTimeout(this.__lto);
                break;
            case "auto_hold":
                if(this.__tto && !value || value < 0)
                    window.clearTimeout(this.__tto);
                if(this.__bto && !value || value < 0)
                    window.clearTimeout(this.__bto);
                break;
        }
    }
});
