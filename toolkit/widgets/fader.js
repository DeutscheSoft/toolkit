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
w.Fader = $class({
    _class: "Fader",
    Extends: Widget,
    Implements: [Ranged, Warning, Tooltip, GlobalCursor],
    options: {
        value: 0,
        division: 1,
        levels: [1, 6, 12, 24],
        gap_dots: 3,
        gap_labels: 40,
        show_labels: true,
        labels: function (val) { return val.toFixed(2); },
        tooltip: false,
        layout: _TOOLKIT_LEFT,
        fixed_dots: false,
        fixed_labels: false
    },
    initialize: function (options) {
        this.__tt = false;
        Widget.prototype.initialize.call(this, options);
        
        this.element = this.widgetize(TK.element("div","toolkit-fader"),
                       true, true, true);
        
        if (TK.get_style(this.element, "position") != "absolute"
            && TK.get_style(this.element, "position") != "relative")
            this.element.style["position"] = "relative";
            
        this._background_top    = TK.element("div", "toolkit-background-top-left");
        this._background_center = TK.element("div", "toolkit-background-center");
        this._background_bottom = TK.element("div", "toolkit-background-bottom-right");

        this.element.appendChild(this._background_top);
        this.element.appendChild(this._background_center);
        this.element.appendChild(this._background_bottom);

        if (this.options.container)
            this.set("container", this.options.container);
        
        var opt = Object.assign({}, this.options, {
            container:   this.element,
        });
        this.scale = new Scale(opt);
        this._scale = this.scale.element;
        
        this._handle = TK.element("div", "toolkit-handle");
        this.element.appendChild(this._handle);
            
        this.drag = new DragValue({
            element: this._handle,
            range:   function () { return this }.bind(this),
            get:     function () { return this.options.value; }.bind(this),
            set:     function (v) {
                this.set("value", v);
                this.fire_event("useraction", "value", v);
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
                this.fire_event("useraction", "value", v);
            }.bind(this),
            events: function () { return this }.bind(this),
        });
        
        this.set("layout", this.options.layout);
        
        this.element.addEventListener("click",    this._clicked.bind(this));
        this.element.addEventListener("mouseenter", this._mouseenter.bind(this));
        this.element.addEventListener("mouseleave", this._mouseleave.bind(this));
        this.element.addEventListener("mousemove",  this._move.bind(this));
        
        if (typeof this.options.reset == "undefined")
            this.options.reset = this.options.value;
        this.element.addEventListener("dblclick", function () {
            this.set("value", this.options.reset);
            this.fire_event("doubleclick", this.options.value);
        }.bind(this));
        
        this.drag.add_event("dragging", function (ev) {
            this.__dragging = true;
            this._move(ev);
        }.bind(this));
        
        this.drag.add_event("stopdrag", function (ev) {
            this.__dragging = false;
            if (!this.__entered)
                this.__tt = this.tooltip(false, this.__tt);
        }.bind(this));
        
        this.scroll.add_event("scrolling", function (ev) {
            if (!this.options.tooltip) return;
            this.__tt = this.tooltip(this.options.tooltip(
                this.get("value")), this.__tt);
        }.bind(this));
        this.update_ranged();
    },
    
    redraw: function () {
        Widget.prototype.redraw.call(this);
        var I = this.invalid;
        var O = this.options;
        var E = this.element;
        var value;
        var h;

        if (I.layout) {
            I.layout = false;
            value = O.layout;
            TK.remove_class(E, "toolkit-vertical");
            TK.remove_class(E, "toolkit-horizontal");
            TK.remove_class(E, "toolkit-left");
            TK.remove_class(E, "toolkit-right");
            TK.remove_class(E, "toolkit-top");
            TK.remove_class(E, "toolkit-bottom");
            var c = this._vert() ? "vertical" : "horizontal";
            TK.add_class(E, "toolkit-" + c);
            var d = value == _TOOLKIT_LEFT   ? "left" :
                    value == _TOOLKIT_RIGHT  ? "right" :
                    value == _TOOLKIT_TOP    ? "top" : "bottom";
            TK.add_class(E, "toolkit-" + d);
        }

        if (I.value) {
            I.value = false;
            this._handle.style[this._vert() ? "bottom" : "right"] = this.val2real(this.snap(O.value), true) + "px";
        }

        if (I.validate("reverse", "log_factor", "step", "round", "scale", "basis")) {
            TK.S.enqueue(function() {
                if (this._vert()) {
                    h  = TK.inner_height(E);
                    this._handlesize = TK.outer_height(this._handle, true);
                } else {
                    h  = TK.inner_width(E);
                    this._handlesize = TK.outer_width(this._handle, true);
                }
                var s = h - this._handlesize;
                if (s != O.basis) {
                    O.basis = s;
                    this.scale.set("basis", s);
                }
                this.scale.trigger_draw();
                I.value = true;
                this.trigger_draw();
            }.bind(this), 1);
        }
    },
    resize: function () {
        this.redraw();
    },
    destroy: function () {
        TK.destroy(this._background_top);
        TK.destroy(this._background_bottom);
        TK.destroy(this._background_center);
        TK.destroy(this._handle);
        this.scale.destroy();
        TK.destroy(this.element);
        Widget.prototype.destroy.call(this);
    },
    
    // HELPERS & STUFF
    _vert: function () {
        return this.options.layout == _TOOLKIT_LEFT
            || this.options.layout == _TOOLKIT_RIGHT;
    },
    _clicked: function (ev) {
        if (this._handle.contains(ev.target)) return;
        this.set("value", this._get_value(ev));
        if (!this.__entered)
            this.__tt = this.tooltip(false, this.__tt);
        this.fire_event("useraction", "value", this.get("value"));
    },
    _move: function (ev) {
        if (!this.options.tooltip) return;
        var s = this.__dragging ? this.get("value") : this._get_value(ev);
        // NOTE: mouseenter/mouseleave do not fire when left mouse button is pressed
        // so dont show tooltip here
        if (this.__entered)
            this.__tt = this.tooltip(this.options.tooltip(s), this.__tt);
    },
    _mouseenter : function (ev) {
        this.__entered = true;
    },
    _mouseleave : function (ev) {
        this.__entered = false;
        if (!this.options.tooltip) return;
        if (!this.__dragging)
            this.__tt = this.tooltip(false, this.__tt);
    },
    _get_value: function (ev) {
        var pos   = TK[this._vert() ? "position_top" : "position_left"](this.element) + this._handlesize / 2;
        var click = ev[
                    this._vert() ? "pageY" : "pageX"];
        var size  = TK[
                    this._vert() ? "outer_height" : "outer_width"](this._scale, true);
        var real = click - pos
        if (this._vert()) real = size - real;
        return this.snap(this.real2val(real, true));
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        switch (key) {
            case "value":
                if (value > this.options.max || value < this.options.min)
                    this.warning(this.element);
                value = this.snap(value);
                break;
            case "layout":
                this.scale.set("layout", value);
                this.options.direction = this._vert() ? _TOOLKIT_VERT : _TOOLKIT_HORIZ;
                this.drag.set("direction", this.options.direction);
                this.scroll.set("direction", this.options.direction);
                break;
            case "min":
            case "max":
            case "snap":
                this.update_ranged();
                break;
        }
        Widget.prototype.set.call(this, key, value, hold);
    }
});
})(this);
