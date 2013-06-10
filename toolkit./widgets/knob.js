Knob = new Class({
    Extends: Circular,
    options: {
        size: 100,
        hand: {width: 2, length: 8, margin: 15},
        margin: 4,
        thickness: 6,
        step: 1,
        shift_up: 4,
        shift_down: 0.25,
        show_base: false,
        dot: {margin: 6, length: 2, width: 2},
        marker: {margin: 5, thickness: 1},
    },
    
    initialize: function (options) {
        this.setOptions(options);
        this._svg = this.widgetize(makeSVG("svg", {"class": "toolkit-knob"}),
                        true, true, true);
        if (this.options.container)
            this._svg.inject(this.options.container);
        
        this.parent(Object.merge(options, {container: this._svg}), true);
        
        this._svg.addEvents({
            "mousewheel":  this._scrollwheel.bind(this),
            "contextmenu": function () {return false;},
            "mousedown":   this._mousedown.bind(this),
            "touchstart":  this._touchstart.bind(this)
        });
        document.addEvent("mousemove", this._mousemove.bind(this));
        document.addEvent("mouseup",   this._mouseup.bind(this));
        document.addEvent("touchmove", this._touchmove.bind(this));
        document.addEvent("touchend",  this._touchend.bind(this));
        
        this.set("size", this.options.size);
        this.initialized();
    },
    
    redraw: function () {
        
        
        this.parent();
    },
    destroy: function () {
        this._svg.destroy();
        this.parent();
    },
    // HELPERS & STUFF
    _scrollwheel: function (e) {
        e.event.preventDefault();
        if (this.__sto) window.clearTimeout(this.__sto);
        this._svg.addClass("toolkit-active");
        this.__sto = window.setTimeout(function () {
            this._svg.removeClass("toolkit-active");
            this.fireEvent("scrollended", [this.options.value, this]);
        }.bind(this), 250);
        var s = this.get("step") * e.wheel;
        if (e.control && e.shift)
            s *= this.get("shift_down");
        else if (e.shift)
            s *= this.get("shift_up");
        this.set("value", Math.max(
            this.options.min,
            Math.min(this.options.max, this.get("value") + s)));
        if (!this._wheel)
            this.fireEvent("scrollstarted", [this.options.value, this]);
        this.fireEvent("scrolling", [this.options.value, this]);
        this._wheel = true;
    },
    _mousedown: function (e) {
        e.event.preventDefault();
        // touch
        if (e.touches && e.touches.length > 1) {
            var ev = e.touches[0];
        } else {
            ev = e.event;
        }
        
        // classes and stuff
        this._svg.addClass("toolkit-active");
        this.__active = true;
        this._clickVal  = this.optons.value;
        this._pageX   = ev.pageX;
        this._pageY   = ev.pageY;
        this.fireEvent("startdrag", [this]);
        return false;
    },
    _mouseup: function (e) {
        if (!this.__active) return;
        e.event.preventDefault();
        this._svg.removeClass("toolkit-active");
        this.fireEvent("stopdrag", [this]);
        this.__active = false;
        return false;
    },
    _mousemove: function (e) {
        if (!this.__active) return;
        e.event.preventDefault();
        if (e.touches && e.touches.length > 1) {
            var ev = e.touches[0];
        } else {
            var ev = e.event;
        }
        var mx = this.options.step || 1;
        if (e.control && e.shift) {
            mx *= this.get("shift_down");
        } else if (e.shift) {
            mx *= this.get("shift_up");
        }
        this.set("value", this.px2val(this._clickVal
            + ((ev.pageX - this._offsetX) - this._clickVal) * mx));
        this.fireEvent("dragging", [this]);
        return false;
    },
    _touchstart: function (e) {
        this._mousedown(e);
    },
    _touchend: function (e) {
        this._mouseup(e);
    },
    _touchmove: function (e) {
        if (!this.__active) return;
        this._mousemove(e);
    },
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "size":
                this._svg.set("width", value);
                this._svg.set("height", value);
                if (!hold) this.redraw();
                break;
        }
        this.parent(key, value, hold);
    }
});
