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
function get_value(ev) {
    var is_vertical = vert(this.options);
    var pos   = TK[is_vertical ? "position_top" : "position_left"](this.element) + this._handlesize / 2;
    var click = ev[is_vertical ? "pageY" : "pageX"];
    var size  = TK[is_vertical ? "outer_height" : "outer_width"](this._scale, true);
    var real = click - pos
    if (is_vertical) real = size - real;
    return this.snap(this.real2val(real));
}
function tooltip_by_position(ev, tt) {
    var val = get_value.call(this, ev);
    tt.innerText = this.options.tooltip(val);
}
function tooltip_by_value(ev, tt) {
    tt.innerText = this.options.tooltip(this.options.value);
}
function mouseenter (ev) {
    if (!this.options.tooltip) return;
    TK.tooltip.add(1, this.tooltip_by_position);
}
function clicked(ev) {
    if (this._handle.contains(ev.target)) return;
    this.set("value", get_value.call(this, ev));
    if (this.options.tooltip && TK.tooltip._entry)
        TK.tooltip._entry.innerText = this.options.tooltip(this.options.value);
    this.fire_event("useraction", "value", this.get("value"));
}
function mouseleave (ev) {
    TK.tooltip.remove(1, this.tooltip_by_position);
}
function startdrag(ev) {
    if (!this.options.tooltip) return;
    TK.tooltip.add(0, this.tooltip_by_value);
}
function stopdrag(ev) {
    TK.tooltip.remove(0, this.tooltip_by_value);
}
function scrolling(ev) {
    if (!this.options.tooltip) return;
    TK.tooltip._entry.innerText = this.options.tooltip(this.options.value);
}
function dblclick(ev) {
    this.set("value", this.options.reset);
    this.fire_event("doubleclick", this.options.value);
}
function GET() {
    return this.value;
}
function THIS() {
    return this;
}
function SET(v) {
    this.set("value", v);
    this.fire_event("useraction", "value", v);
}
w.Fader = $class({
    /* @class: Fader
     */
    _class: "Fader",
    Extends: Widget,
    Implements: [Ranged, Warning, GlobalCursor],
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

        var E, O = this.options;
        
        this.element = this.widgetize(E = TK.element("div","toolkit-fader"), true, true, true);
        
        this.scale = new Scale(TK.merge({}, O, { container: E }));
        this._scale = this.scale.element;
        
        this._handle = TK.element("div", "toolkit-handle");
        this.element.appendChild(this._handle);

        this.add_child(this.scale);

        if (typeof O.reset === "undefined")
            O.reset = O.value;

        if (typeof O.direction === "undefined")
            O.direction = vert(O) ? _TOOLKIT_VERT : _TOOLKIT_HORIZ;
            
        var self = THIS.bind(this);
        var get = GET.bind(O);
        var set = SET.bind(this);
        this.drag = new DragValue({
            element: this._handle,
            range:   self,
            get:     get,
            set:     set,
            events:  self,
            direction: O.direction
        });
        this.scroll = new ScrollValue({
            element: this.element,
            range:   self,
            get:     get,
            set:     set,
            events:  self
        });

        this.tooltip_by_position = tooltip_by_position.bind(this);
        this.tooltip_by_value = tooltip_by_value.bind(this);
        
        this.add_event("click", clicked);
        this.add_event("mouseenter", mouseenter);
        this.add_event("mouseleave", mouseleave);
        this.add_event("dblclick", dblclick);
        
        this.drag.add_event("startdrag", startdrag.bind(this));
        this.drag.add_event("stopdrag", stopdrag.bind(this));
        this.scroll.add_event("scrolling", scrolling.bind(this));
    },

    initialized: function () {
        Widget.prototype.initialized.call(this);
        Ranged.prototype.initialized.call(this);
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
            TK.add_class(E, vert(O) ? "toolkit-vertical" : "toolkit-horizontal");
            var d = value == _TOOLKIT_LEFT   ? "toolkit-left" :
                    value == _TOOLKIT_RIGHT  ? "toolkit-right" :
                    value == _TOOLKIT_TOP    ? "toolkit-top" : "toolkit-bottom";
            TK.add_class(E, d);
        }

        if (I.value) {
            I.value = false;
            this._handle.style[vert(O) ? "bottom" : "right"] = this.val2real(this.snap(O.value)) + "px";
        }

        if (I.validate("reverse", "log_factor", "step", "round", "scale", "basis")) {
            TK.S.add(function() {
                if (vert(O)) {
                    h  = TK.inner_height(E);
                    this._handlesize = TK.outer_height(this._handle, true);
                } else {
                    h  = TK.inner_width(E);
                    this._handlesize = TK.outer_width(this._handle, true);
                }
                var s = h - this._handlesize;
                if (s != O.basis) {
                    this.set("basis", s);
                    this.scale.set("basis", s);
                }
                this.scale.trigger_draw();
                I.value = true;
                this.trigger_draw();
            }.bind(this), 1);
        }
    },
    resize: function () {
        this.invalid.reverse = true;
        this.trigger_draw();

        Widget.prototype.resize.call(this);
    },
    destroy: function () {
        this._handle.remove();
        this.scale.destroy();
        this.element.remove();
        Widget.prototype.destroy.call(this);
        TK.tooltip.remove(0, this.tooltip_by_value);
        TK.tooltip.remove(1, this.tooltip_by_position);
    },
    
    // GETTER & SETTER
    set: function (key, value) {
        switch (key) {
            case "tooltip":
                if (!value) {
                    TK.tooltip.remove(0, this.tooltip_by_value);
                    TK.tooltip.remove(1, this.tooltip_by_position);
                }
                break;
            case "value":
                if (value > this.options.max || value < this.options.min)
                    this.warning(this.element);
                value = this.snap(value);
                break;
            case "layout":
                this.scale.set("layout", value);
                this.options.direction = vert(this.options) ? _TOOLKIT_VERT : _TOOLKIT_HORIZ;
                this.drag.set("direction", this.options.direction);
                this.scroll.set("direction", this.options.direction);
                break;
        }
        Widget.prototype.set.call(this, key, value);
        Ranged.prototype.set.call(this, key, value);
    }
});
})(this);
