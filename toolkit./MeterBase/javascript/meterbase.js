var MeterBase = new Class({
    Implements: [Options, Events, Range],
    __size:   0,
    __margin: 0,
    __based:  false,
    options: {
        "class":           "",
        id:              "",
        layout:          1,              // how to draw the meter:
                                         // 1: vertical, meter on the left
                                         // 2: vertical, meter on the right,
                                         // 3: horizontal, meter on top
                                         // 4: horizontal, meter on bottom
        reverse:         false,          // if the scale/meter is reversed
        segment:         1,              // size of the segments (imagine as size of a single LED)
        container:       false,          // if there's already a container for injection
        
        value:           0,              // the initial value
        base:            false,          // if base value is set, meter starts at this point and shows values above
                                         // and beneath starting at base
                                         // set to false if you don't need it to save some cpu
        label:           false,          // the initial value for the label, false = value
        
        title:           "",             // name of the meter
        gradient:        false,          // gradient for the background
                                         // keys are ints or floats as string corresponding to the chosen scale
                                         // values are valid css color strings like #ff8000 or rgb(0,56,103)
        background:      null,           // background if no gradient is used
        
        show_title:      false,          // bool if the title should be drawn
        show_label:      false,          // bool if the value label should be drawn
        show_scale:      true,           // bool if the scale should be drawn
        show_labels:     true,           // bool if labels in scale should be drawn
        
        format_label:     function (value) { return sprintf("%0.2f", value); },
            
        division:         1,              // minimum step size
        levels:           [1, 5, 10],     // array of steps where to draw labels and marker
        scale_base:       false,          // base where dots and labels are drawn from
        format_labels:    function (val) { return sprintf("%0.2f",  val); },
        gap_dots:         4,              // minimum gap between dots (pixel)
        gap_labels:       40              // minimum gap between labels (pixel)
    },
    
    initialize: function (options, hold) {
        this.setOptions(options);
        if(!this.options.id) this.options.id = String.uniqueID();
        this.element = new Element("div.meter-base", {
            "id":    this.options.id
        });
        if(this.options.reverse)
            this.element.addClass("reverse");
        
        if(this.element.getStyle("position") != "absolute" && this.element.getStyle("position") != "relative")
            this.element.setStyle("position", "relative");
        
        switch(this.options.layout) {
            case 1:
                this._label  = new Element("div.label").inject(this.element);
                this._scale  = new Element("div.meter-scale").inject(this.element);
                this._bar    = new Element("div.bar").inject(this.element);
                this._title  = new Element("div.title").inject(this.element);
                this.element.addClass("vertical left");
                break;
            case 2:
                this._label  = new Element("div.label").inject(this.element);
                this._scale  = new Element("div.meter-scale").inject(this.element);
                this._bar    = new Element("div.bar").inject(this.element);
                this._title  = new Element("div.title").inject(this.element);
                this.element.addClass("vertical right");
                break;
            case 3:
                this._bar    = new Element("div.bar").inject(this.element);
                this._scale  = new Element("div.meter-scale").inject(this.element);
                this._title  = new Element("div.title").inject(this.element);
                this._label  = new Element("div.label").inject(this.element);
                this.element.addClass("horizontal top");
                break;
            case 4:
                this._title  = new Element("div.title").inject(this.element);
                this._label  = new Element("div.label").inject(this.element);
                this._scale  = new Element("div.meter-scale").inject(this.element);
                this._bar    = new Element("div.bar").inject(this.element);
                this.element.addClass("horizontal bottom");
                break;
        }
        
        this._base   = new Element("div.base").inject(this._bar);
        this._mark   = new Element("div.mark").inject(this._bar);
        this._over   = new Element("div.over").inject(this._bar);
        this._mask1  = new Element("div.mask.mask1").inject(this._bar);
        this._mask2  = new Element("div.mask.mask2").inject(this._bar);
        
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
        if(this.options.layout == 1) {
            this._scale.setStyles({
                "float": "right"
            });
            this._bar.setStyles({
                "float": "left"
            });
        }
        if(this.options.layout == 2) {
            this._scale.setStyles({
                "float": "left"
            });
            this._bar.setStyles({
                "float": "right"
            });
        }
        if(this.options.layout < 3) {
            if(this.options.reverse) {
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
            if(this.options.reverse) {
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
        
        if(this.options.container)  this.set("container",  this.options.container);
        
        if(this.options["class"])   this.set("class",      this.options["class"]);
        if(this.options.background) this.set("background", this.options.background);
        if(this.options.gradient)   this.set("gradient",   this.options.gradient);
        
        if(this.options.label === false)
            this.options.label = this.options.value;
        
        this.set("base", this.options.base, true);
        
        this.set("show_label", this.options.show_label);
        this.set("show_title", this.options.show_title);
        this.set("show_scale", this.options.show_scale);
        
        //this.element.addEvent("resize", this.redraw.bind(this));
        
        this.__scale = new Scale({
            min:           this.options.min,
            max:           this.options.max,
            division:      this.options.division,
            levels:        this.options.levels,
            gap_dots:      this.options.gap_dots,
            gap_labels:    this.options.gap_labels,
            show_labels:   this.options.show_labels,
            labels:        this.options.format_labels,
            layout:        this.options.layout,
            reverse:       this.options.reverse,
            base:          this.__based ? this.options.base : this.options.scale_base,
            container:     this._scale,
            size:          this.__size
        });
        
        if(!hold)
            this.redraw();
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
    },
    redraw: function () {
        this.set("title", this.options.title);
        this.set("label", this.options.label);
        this.set("value", this.options.value);
        switch(this.options.layout) {
            case 1:
            case 2:
                var s = this._bar_size(this.options.layout);
                this._bar.outerHeight(s);
                this._scale.outerHeight(s);
                var i = this._bar.innerHeight();
                if(i != this.__size) {
                    this.__size = i;
                    this.__scale.set("size", i);
                }
                this._scale.innerHeight(i);
                break;
            case 3:
            case 4:
                var s = this._bar_size(this.options.layout);
                this._bar.outerWidth(s);
                this._scale.outerWidth(s);
                var i = this._bar.innerWidth();
                if(i != this.__size) {
                    this.__size = i;
                    this.__scale.set("size", i);
                }
                break;
        }
        this._draw_meter();
        this.__scale.redraw();
        if(this.options.layout < 3)
            this.element.innerWidth(this._bar.outerWidth() + this._scale.outerWidth());
    },
    
    _draw_meter: function () {
        this._mask1.setStyle(this.options.layout < 3 ? "height" : "width",
            Math.max(0, this.__size - this.val2seg(Math.max(this.options.base, this.options.value))));
        if(this.__based)
            this._mask2.setStyle(this.options.layout < 3 ? "height" : "width",
                Math.max(0, this.val2seg(Math.min(this.options.base, this.options.value))));
    },
    
    _draw_gradient: function (grad) {
        // the argument is: {"-96": "rgb(30,87,153)", "-0.001": "rgb(41,137,216)", "0": "rgb(32,124,202)", "24": "rgb(125,185,232)"}
        // The goal is:
//         background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><linearGradient id='gradient'><stop offset='10%' stop-color='#F00'/><stop offset='90%' stop-color='#fcc'/> </linearGradient><rect fill='url(#gradient)' x='0' y='0' width='100%' height='100%'/></svg>");
//         background: -moz-linear-gradient(top, rgb(30,87,153) 0%, rgb(41,137,216) 50%, rgb(32,124,202) 51%, rgb(125,185,232) 100%);
//         background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgb(30,87,153)), color-stop(50%,rgb(41,137,216)), color-stop(51%,rgb(32,124,202)), color-stop(100%,rgb(125,185,232)));
//         background: -webkit-linear-gradient(top, rgb(30,87,153) 0%,rgb(41,137,216) 50%,rgb(32,124,202) 51%,rgb(125,185,232) 100%);
//         background: -o-linear-gradient(top, rgb(30,87,153) 0%,rgb(41,137,216) 50%,rgb(32,124,202) 51%,rgb(125,185,232) 100%);
//         background: -ms-linear-gradient(top, rgb(30,87,153) 0%,rgb(41,137,216) 50%,rgb(32,124,202) 51%,rgb(125,185,232) 100%);
//         background: linear-gradient(to bottom, rgb(30,87,153) 0%,rgb(41,137,216) 50%,rgb(32,124,202) 51%,rgb(125,185,232) 100%);
//         filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1e5799', endColorstr='#7db9e8',GradientType=0 );

        var ms_first   = "";
        var ms_last    = "";
        var m_svg      = "";
        var m_regular  = "";
        var m_webkit   = "";
        var s_ms       = "background filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='%s', endColorstr='%s', GradientType='%d' );";
        var s_svg      = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%%' height='100%%'><linearGradient id='%s_gradient' %s>%s</linearGradient><rect fill='url(#%s_gradient)' x='0' y='0' width='100%%' height='100%%'/></svg>\");";
        var s_regular  = "%slinear-gradient(%s, %s);";
        var s_webkit   = "-webkit-gradient(linear, %s, %s);";
        var c_svg      = "<stop offset='%s%%' stop-color='%s'/>";
        var c_regular  = "%s %s%%, ";
        var c_webkit   = "color-stop(%s%%, %s), ";
        var d_w3c      = [["", ""], ["to top", "to bottom"], ["to top", "to bottom"], ["to right", "to left"], ["to right", "to left"]];
        var d_regular  = [["", ""], ["bottom", "top"], ["bottom", "top"], ["left", "right"], ["left", "right"]];
        var d_webkit   = [["", ""], ["left bottom, left top", "left top, left bottom"], ["left bottom, left top", "left top, left bottom"], ["left top, right top", "right top, left top"], ["left top, right top", "right top, left top"]];
        var d_ms       = [["", ""], ['x1="0%" y1="100%" x2="0%" y2="0%"', 'x1="0%" y1="0%" x2="0%" y2="100%"'], ['x1="0%" y1="100%" x2="0%" y2="0%"', 'x1="0%" y1="0%" x2="0%" y2="100%"'], ['x1="0%" y1="0%" x2="100%" y2="0%"', 'x1="100%" y1="0%" x2="0%" y2="0%"']];
        
        var keys = Object.keys(grad);
        for(var i = 0; i < keys.length; i++) {
            keys[i] = parseFloat(keys[i]);
        }
        keys = keys.sort(function(a,b){return a-b});
        
        for(var i = 0; i < keys.length; i++) {
            var ps = this.val2perc(keys[i]) * 100;
            if(!ms_first) ms_first = grad[i];
            ms_last = grad[keys[i] + ""];
            
            m_svg     += sprintf(c_svg, ps, grad[keys[i] + ""]);
            m_regular += sprintf(c_regular, grad[keys[i] + ""], ps);
            m_webkit  += sprintf(c_webkit, ps, grad[keys[i] + ""]);
        }
        m_regular = m_regular.substr(0, m_regular.length -2);
        m_webkit  = m_regular.substr(0, m_webkit.length -2);
        
        var background = "";
        if(Browser.ie && Browser.version <= 8)
            if(this.options.reverse)
                background = (sprintf(s_ms, ms_first, ms_last, this.options.layout < 3 ? 0 : 1));
            else
                background = (sprintf(s_ms, ms_last, ms_first, this.options.layout < 3 ? 0 : 1));
            
        else if(Browser.ie9)
            background = (sprintf(s_svg, this.options.id, d_ms[this.options.layout][this.options.reverse ? 1 : 0], m_svg, this.options.id));
        
        else if(Browser.ie && Browser.version >= 10)
            background = (sprintf(s_regular, "-ms-", d_regular[this.options.layout][this.options.reverse ? 1 : 0], m_regular));
        
        else if(Browser.firefox)
            background = (sprintf(s_regular, "-moz-", d_regular[this.options.layout][this.options.reverse ? 1 : 0], m_regular));
        
        else if(Browser.opera && Browser.version >= 11)
            background = (sprintf(s_regular, "-o-", d_regular[this.options.layout][this.options.reverse ? 1 : 0], m_regular));
        
        else if(Browser.chrome && Browser.version < 10 || Browser.safari && Browser.version < 5.1)
            background = (sprintf(s_webkit, d_webkit[this.options.layout][this.options.reverse ? 1 : 0], m_regular));
        
        else if(Browser.chrome || Browser.safari)
            background = (sprintf(s_regular, "-webkit-", d_regular[this.options.layout][this.options.reverse ? 1 : 0], m_regular));
        
        else
            background = (sprintf(s_regular, "", d_w3c[this.options.layout][this.options.reverse ? 1 : 0], m_regular));
        
        this._base.set("style", "width: 100%; height: 100%; z-index: 10; position: absolute; background: " + background);
    },
    
    // HELPERS & STUFF
    val2px: function (val) {
        return this.__size * this.val2perc(val);
    },
    
    val2seg: function (val) {
        var s = this.val2px(val)
        return s - s % this.options.segment;
    },
    
    px2val: function (px) {
        return (parseFloat(px) / parseFloat(this.__size)) * (this.options.max - this.options.min) + this.options.min;
    },
    base_value: function () {
        this.set("value", this.options.base);
    },
    _bar_size: function () {
        var s = this.element[this.options.layout < 3 ? "innerHeight" : "innerWidth"]();
        if(this.options.show_label && this.options.layout < 3)
            s -= this._label.outerHeight();
        if(this.options.show_title && this.options.layout < 3)
            s -= this._title.outerHeight();
        return s;
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch(key) {
            case "container":
                if(!hold) this.element.inject(this.options.container);
                break;
            case "id":
                if(!hold) this.element.set("id", this.options.id);
                break;
            case "class":
                if(!hold) this.element.addClass(this.options.class);
                break;
            case "gradient":
            case "background":
                this.fireEvent("colorchanged");
                if(!hold) {
                    if(this.options.gradient)
                        this._draw_gradient(this.options.gradient);
                    else
                        this._base.setStyle("background", this.options.background);
                }
                break;
            case "show_label":
                if(!hold) this._label.setStyle("display", value ? "block" : "none");
                break;
            case "show_title":
                if(!hold) this._title.setStyle("display", value ? "block" : "none");
                break;
            case "show_scale":
                if(!hold) this._scale.setStyle("display", value ? "block" : "none");
                break;
            case "label":
                this.fireEvent("labelchanged");
                if(!hold) this._label.set("html", this.options.format_label(value));
                break;
            case "value":
                this.fireEvent("valuechanged");
                if(!hold) this._draw_meter(value);
                break;
            case "title":
                this.fireEvent("titlechanged");
                if(!hold) this._title.set("html", value);
                break;
            case "segment":
                if(!hold) this.set("value", this.options.value);
                break;
            case "division":
            case "reverse":
            case "levels":
            case "min":
            case "max":
            case "scale":
            case "gap_dots":
            case "gap_labels":
            case "show_labels":
                this.fireEvent("scalechanged");
                this.__scale.set(key, value, hold);
                if(!hold) this.redraw();
                break;
            case "format_labels":
                this.fireEvent("scalechanged");
                this.__scale.set("labels", value, hold);
                if(!hold) this.redraw();
                break;
            case "scale_base":
                this.fireEvent("scalechanged");
                this.__scale.set("base", value, hold);
                if(!hold) this.redraw();
                break;
            case "base":
                this.fireEvent("basechanged");
                if(value === false) {
                    this.options.base = this.options.min;
                    this.__based = false;
                } else {
                    this.__based = true;
                }
                if(!hold) this.redraw();
                break;
        }
    },
    get: function (key) {
        if(typeof this.options[key] != "undefined")
            return this.options[key];
    }
});
