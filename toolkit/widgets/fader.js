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
    return O.layout == "left" || O.layout == "right";
}
function get_value(ev) {
    var is_vertical = vert(this.options);
    var pos, click, real;
    if (is_vertical) {
        /* we calculate the position from the bottom of the scale */
        var size = this.options.basis;
        pos   = TK.position_top(this._scale);
        click = ev.pageY;
        real  = size - (click - pos);
    } else {
        /* we calculate the position from the left of the scale */
        pos   = TK.position_left(this._scale);
        click = ev.pageX;
        real  = click - pos;
    }
    return this.real2val(real);
}
function tooltip_by_position(ev, tt) {
    var val = this.snap(get_value.call(this, ev));
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
/**
 * TK.Fader is a fader widget. It is implemented as a slidable control which
 * can be both dragged and scrolled. TK.Fader implements {@link TK.Ranged},
 * {@link TK.Warning} and {@link TL.GlobalCursor} and inherits its options.
 * Additionally it contains an instance of {@link TK.Scale} whose options
 * it inherits, aswell.
 *
 * @class TK.Fader
 * @extends TK.Widget
 *
 * @param {Object} options
 * @property {number} [options.value] - The fader position. This options is
 *      modified by user interaction.
 * @property {function} [options.tooltip] - An optional formatting function for
 *      the tooltip value. The tooltip will show that value the mouse cursor is
 *      currently hovering over.
 */
w.TK.Fader = w.Fader = $class({
    _class: "Fader",
    Extends: TK.Widget,
    Implements: [Ranged, Warning, GlobalCursor],
    _options: Object.assign(Object.create(TK.Widget.prototype._options),
                            Ranged.prototype._options, TK.Scale.prototype._options, {
        value:    "number",
        division: "number",
        levels:   "array",
        gap_dots: "number",
        gap_labels: "number",
        show_labels: "boolean",
        labels: "function",
        tooltip: "function",
        layout: "int",
        fixed_dots: "boolean",
        fixed_labels: "boolean",
        direction: "int",
        reset: "number",
    }),
    options: {
        value: 0,
        division: 1,
        levels: [1, 6, 12, 24],
        gap_dots: 3,
        gap_labels: 40,
        show_labels: true,
        labels: function (val) { return val.toFixed(2); },
        tooltip: false,
        layout: "left",
        fixed_dots: false,
        fixed_labels: false
    },
    initialize: function (options) {
        this.__tt = false;
        TK.Widget.prototype.initialize.call(this, options);

        var E, O = this.options;
        
        if (!(E = this.element)) this.element = E = TK.element("div");
        TK.add_class(E, "toolkit-fader");
        this.widgetize(E, true, true, true);

        var so = TK.object_and(O, TK.Scale.prototype._options);
        so = TK.object_sub(so, TK.Widget.prototype._options);
        so.container = E;
        
        this.scale = new TK.Scale(so);
        this._scale = this.scale.element;
        
        this._handle = TK.element("div", "toolkit-handle");
        this.element.appendChild(this._handle);

        this.add_child(this.scale);

        if (typeof O.reset === "undefined")
            O.reset = O.value;

        if (typeof O.direction === "undefined")
            O.direction = vert(O) ? "vertical" : "horizontal";
            
        var self = THIS.bind(this);
        var get = GET.bind(O);
        var set = SET.bind(this);
        this.drag = new TK.DragValue({
            node:    this._handle,
            range:   self,
            get:     get,
            set:     set,
            events:  self,
            direction: O.direction
        });
        this.scroll = new TK.ScrollValue({
            node:    this.element,
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
        TK.Widget.prototype.initialized.call(this);
        Ranged.prototype.initialized.call(this);
    },
    
    redraw: function () {
        TK.Widget.prototype.redraw.call(this);
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
            var d = value == "left"   ? "toolkit-left" :
                    value == "right"  ? "toolkit-right" :
                    value == "top"    ? "toolkit-top" : "toolkit-bottom";
            TK.add_class(E, d);
        }

        if (I.validate.apply(I, Object.keys(Ranged.prototype._options)) || I.value) {
            I.value = false;
            // TODO: value is snapped already in set(). This is not enough for values which are set during
            // initialization.
            this._handle.style[vert(O) ? "bottom" : "left"] = this.val2real(this.snap(O.value)) + "px";
        }
    },
    resize: function () {
        var O = this.options;
        var E = this.element, H = this._handle;
        var basis;

        if (vert(O)) {
            basis = TK.inner_height(E) - TK.outer_height(H, true);
        } else {
            basis = TK.inner_width(E) - TK.outer_width(H, true);
        }

        this.set("basis", basis);
        this.scale.set("basis", basis);

        TK.Widget.prototype.resize.call(this);
    },
    destroy: function () {
        this._handle.remove();
        this.scale.destroy();
        this.element.remove();
        TK.Widget.prototype.destroy.call(this);
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
                this.options.direction = vert(this.options) ? "vertical" : "horizontal";
                this.drag.set("direction", this.options.direction);
                this.scroll.set("direction", this.options.direction);
                break;
        }

        if (!TK.Widget.prototype._options[key] && TK.Scale.prototype._options[key]) {
            this.scale.set(key, value);
            this.fire_event("scalechanged", key, value);
        }

        return TK.Widget.prototype.set.call(this, key, value);
    }
});
})(this);
