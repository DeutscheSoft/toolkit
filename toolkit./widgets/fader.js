Fader = new Class({
    Extends: Widget,
    Implements: [Ranged, Warning, Tooltip, GlobalCursor],
    options: {
        value: 0,
        division: 1,
        levels: [1, 6, 12, 24],
        gap_dots: 3,
        gap_labels: 40,
        show_labels: true,
        labels: function (val) { return sprintf("%0.2f",  val); },
        tooltip: false,
        layout: _TOOLKIT_LEFT
    },
    
    initialize: function (options) {
        this.parent(Object.merge(this.__options, options));
        
        this.element = this.widgetize(new Element("div.toolkit-fader"),
                       true, true, true);
        
        if (this.element.getStyle("position") != "absolute"
            && this.element.getStyle("position") != "relative")
            this.element.setStyle("position", "relative");
            
        this._background_top    = new Element(
            "div.toolkit-background-top-left").inject(this.element);
        this._background_center = new Element(
            "div.toolkit-background-center").inject(this.element);
        this._background_bottom = new Element(
            "div.toolkit-background-bottom-right").inject(this.element);
        
        var opt = Object.merge({}, this.options, {
            container:   this.element,
        });
        this.scale = new Scale(opt);
        this._scale = this.scale.element;
        
        this._handle = new Element(
            "div.toolkit-handle").inject(this.element);
            
        if (this.options.container)
            this.set("container", this.options.container);
        
        this.drag = new DragValue({
            element: this._handle,
            range:   function () { return this }.bind(this),
            get:     function () { return this.options.value; }.bind(this),
            set:     function (v) {
                this.set("value", v);
                this.fireEvent("useraction", ["value", v, this]);
            }.bind(this),
            events: function () { return this }.bind(this),
            direction: this.options.direction
        });
        this.scroll = new ScrollValue({
            element: this.element,
            range:   function () { return this }.bind(this),
            get:     function () { return this.options.value; }.bind(this),
            set:     function (v) {
                this.set("value", v);
                this.fireEvent("useraction", ["value", v, this]);
            }.bind(this),
            events: function () { return this }.bind(this),
        });
        
        this.set("layout", this.options.layout);
        
        this.element.addEvents({
            "mousedown":  function () { this.__down = true; }.bind(this),
            "mouseenter": this._mouseenter.bind(this),
            "mouseleave": this._mouseleave.bind(this)
        });
        
        this.element.addEvent("mousedown", function (ev) {
            this.__down = true;
        }.bind(this));
        
        this.element.addEvent("mouseup", this._clicked.bind(this));
        this.element.addEvent("mousemove", this._move.bind(this));
        
        this.drag.addEvent("dragging", function (ev) {
            this.__down = false;
        }.bind(this));
        this.drag.addEvent("dragging", function (ev) {
            this.__dragging = true;
            this._move(ev);
        }.bind(this));
        this.drag.addEvent("stopdrag", function (ev) {
            this.__dragging = false;
            this.__down = true;
            if (!this.__entered)
                this.tooltip(false, this.__tt);
        }.bind(this));
        
        this.scroll.addEvent("scrolling", function (ev) {
            if (!this.options.tooltip) return;
            this.tooltip(this.options.tooltip(
                this.get("value")), this.__tt);
        }.bind(this));
        
        this.redraw();
        this.initialized();
    },
    
    redraw: function () {
        if (this._vert()) {
            // VERTICAL
            this._background_top.setStyles({
                position: "absolute",
                top: 0,
                left: undefined
            });
            this._background_bottom.setStyles({
                position: "absolute",
                bottom: 0,
                right: undefined
            });
            
            var h  = this.element.innerHeight();
            var hl = this._background_top.outerHeight();
            var hr = this._background_bottom.outerHeight();
            
            this._background_center.setStyles({
                position: "absolute",
                top: hl,
                left: undefined,
                height: h - hl - hr
            });
            
            var p = this.element.innerWidth();
            this._background_top.outerWidth(p);
            this._background_bottom.outerWidth(p);
            this._background_center.outerWidth(p);
            this._scale.outerWidth(p);
            
            this._handle.setStyles({
                position: "absolute",
                bottom: 0,
                right: undefined
            });
            this._handlesize = this._handle.outerHeight();
            this._scale.outerHeight(h - this._handlesize);
            this._scale.setStyle("top", this._handlesize / 2);
        } else {
            // HORIZONTAL
            this._background_top.setStyles({
                position: "absolute",
                left: 0,
                top: undefined
            });
            this._background_bottom.setStyles({
                position: "absolute",
                right: 0,
                bottom: undefined
            });
            
            var h  = this.element.innerWidth();
            var hl = this._background_top.outerWidth();
            var hr = this._background_bottom.outerWidth();
            
            this._background_center.setStyles({
                position: "absolute",
                left: hl,
                top: undefined,
                width: h - hl - hr
            });
            
            var p = this.element.innerHeight();
            this._background_top.outerHeight(p);
            this._background_bottom.outerHeight(p);
            this._background_center.outerHeight(p);
            this._scale.outerHeight(p);
            
            this._handle.setStyles({
                position: "absolute",
                right: 0,
                bottom: undefined
            });
            this._handlesize = this._handle.outerWidth();
            this._scale.outerWidth(h - this._handlesize);
            this._scale.setStyle("left", this._handlesize / 2);
        }
        var s = h - this._handlesize;
        if (s != this.options.basis) {
            this.options.basis = s;
            this.scale.set("basis", s);
        }
        this.set("value", this.options.value);
        this.scale.redraw();
        
        this.element.innerWidth(Math.max(this._handle.outerWidth(),
                                         this._scale.outerWidth()));
        
        this.parent();
    },
    
    destroy: function () {
        this._background_top.destroy();
        this._background_bottom.destroy();
        this._background_center.destroy();
        this._handle.destroy();
        this.scale.destroy();
        this.element.destroy();
        this.parent();
    },
    
    // HELPERS & STUFF
    _vert: function () {
        return this.options.layout == _TOOLKIT_LEFT
            || this.options.layout == _TOOLKIT_RIGHT;
    },
    _clicked: function (ev) {
        if (!this.__down) return;
        this.set("value", this._get_value(ev));
        this.fireEvent("useraction", ["value", this.get("value"), this]);
    },
    _move: function (ev) {
        if (!this.options.tooltip) return;
        if (!this.__tt)
            this.__tt = this.tooltip("");
        var s = this.__dragging ? this.get("value") : this._get_value(ev);
        this.tooltip(this.options.tooltip(s), this.__tt);
    },
    _mouseenter : function (ev) {
        //this.global_cursor("crosshair");
        this.__entered = true;
    },
    _mouseleave : function (ev) {
        if (!this.options.tooltip) return;
        if (!this.__dragging)
            this.tooltip(false, this.__tt);
        //this.remove_cursor("crosshair");
        this.__entered = false;
    },
    _get_value: function (ev) {
        var pos   = this.element.getPosition()[
                     this._vert() ? "y" : "x"] + this._handlesize / 2;
        var click = ev.event[
                     this._vert() ? "pageY" : "pageX"];
        var size  = this._scale[
                     this._vert() ? "outerHeight" : "outerWidth"]();
        var real = click - pos
        if (this._vert()) real = size - real;
        return Math.max(this.options.min,
               Math.min(this.real2val(real), this.options.max));
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "value":
                this.options.value = Math.min(this.options.max,
                                     Math.max(this.options.min, value));
                if (value > this.options.max || value < this.options.min)
                    this.warning(this.element);
                this.fireEvent("set_value", [this.options.value, this]);
                this.fireEvent("set", ["value", this.options.value, this]);
                if (!hold)
                    this._handle.setStyle(
                        (this._vert() ? "bottom" : "right"),this.val2real()
                    );
                return;
            case "layout":
                this.element.removeClass("toolkit-vertical");
                this.element.removeClass("toolkit-horizontal");
                this.element.removeClass("toolkit-left");
                this.element.removeClass("toolkit-right");
                this.element.removeClass("toolkit-top");
                this.element.removeClass("toolkit-bottom");
                var c = this._vert() ? "vertical" : "horizontal";
                this.element.addClass("toolkit-" + c);
                this.scale.set("layout", value);
                this.options.direction = this._vert() ? _TOOLKIT_VERT
                                                      : _TOOLKIT_HORIZ;
                this.drag.set("direction", this.options.direction);
                this.scroll.set("direction", this.options.direction);
                break;
            case "min":
            case "max":
            case "reverse":
            case "log_factor":
            case "step":
            case "round":
            case "snap":
            case "scale":
            case "basis":
                if (!hold) this.redraw();
                break;
        }
        this.parent(key, value, hold);
    }
});
