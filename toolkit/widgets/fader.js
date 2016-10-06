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

var supports_transform = 'transform' in w.document.createElement("div").style;

function vert(O) {
    return O.layout === "left" || O.layout === "right";
}
function get_value(ev) {
    var is_vertical = vert(this.options);
    var pos, real, hsize;
    hsize = this._handle_size / 2;
    if (is_vertical) {
        /* we calculate the position from the bottom of the scale */
        real  = this.options.basis - (ev.offsetY - hsize);
    } else {
        /* we calculate the position from the left of the scale */
        real  = ev.offsetX - hsize;
    }
    return this.real2val(real);
}
function tooltip_by_position(ev, tt) {
    if (this._handle.contains(ev.target)) {
        tooltip_by_value.call(this, ev, tt);
        return;
    }
    var val = this.snap(get_value.call(this, ev));
    TK.set_text(tt, this.options.tooltip(val));
}
function tooltip_by_value(ev, tt) {
    TK.set_text(tt, this.options.tooltip(this.options.value));
}
function mouseenter (ev) {
    if (!this.options.tooltip) return;
    TK.tooltip.add(1, this.tooltip_by_position);
}
function clicked(ev) {
    var value;
    if (this._handle.contains(ev.target)) return;
    value = SET.call(this, get_value.call(this, ev));
    if (this.options.tooltip && TK.tooltip._entry)
        TK.set_text(TK.tooltip._entry, this.options.tooltip(this.options.value));
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
    TK.set_text(TK.tooltip._entry, this.options.tooltip(this.options.value));
}
function dblclick(ev) {
    SET.call(this, this.options.reset);
    this.fire_event("doubleclick", this.options.value);
}
function GET() {
    return this.value;
}
function THIS() {
    return this;
}
function SET(v) {
    v = this.set("value", v);
    this.fire_event("useraction", "value", v);
    return v;
}
function create_scale() {
    if (!this.scale) {
        var O = this.options;
        var so = TK.object_and(O, TK.Scale.prototype._options);
        so = TK.object_sub(so, TK.Widget.prototype._options);
        
        this.scale = new TK.Scale(so);
        this.add_child(this.scale);
    }
}
function remove_scale() {
    if (this.scale) {
        this.scale.destroy();
        this.scale = null;
    }
}

function activate_tooltip() {
    if (!this.tooltip_by_position) {
        this.tooltip_by_position = tooltip_by_position.bind(this);
        this.tooltip_by_value = tooltip_by_value.bind(this);
        this.__startdrag = startdrag.bind(this);
        this.__stopdrag = stopdrag.bind(this);
        this.__scrolling = scrolling.bind(this);
    }
    this.add_event("mouseenter", mouseenter);
    this.add_event("mouseleave", mouseleave);
    this.drag.add_event("startdrag", this.__startdrag);
    this.drag.add_event("stopdrag", this.__stopdrag);
    this.scroll.add_event("scrolling", this.__scrolling);
}

function deactivate_tooltip() {
    if (!this.tooltip_by_position) return;
    TK.tooltip.remove(0, this.tooltip_by_value);
    TK.tooltip.remove(1, this.tooltip_by_position);
    this.remove_event("mouseenter", mouseenter);
    this.remove_event("mouseleave", mouseleave);
    this.drag.remove_event("startdrag", this.__startdrag);
    this.drag.remove_event("stopdrag", this.__stopdrag);
    this.scroll.remove_event("scrolling", this.__scrolling);
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
 * @property {function} options.tooltip - An optional formatting function for
 *      the tooltip value. The tooltip will show that value the mouse cursor is
 *      currently hovering over. If this option is not set, no tooltip will be shown.
 * @property {boolean} [options.bind_click=false] - If true, a <code>click</code>
 *      on the fader will move the handle to the pointed position.
 * @property {boolean} [options.bind_dblclick=true] - If true, a <code>dblclick</code>
 *      on the fader will reset the fader value to <code>options.reset</code>.
 * @property {number} [options.reset=options.value] - The reset value, which is used by
 *      the <code>dblclick</code> event and the {@link TK.Fader#reset} method.
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
        show_scale: "boolean",
        labels: "function",
        tooltip: "function",
        layout: "string",
        fixed_dots: "boolean",
        fixed_labels: "boolean",
        direction: "int",
        reset: "number",
        bind_click: "boolean",
        bind_dblclick: "boolean",
    }),
    options: {
        value: 0,
        division: 1,
        levels: [1, 6, 12, 24],
        gap_dots: 3,
        gap_labels: 40,
        show_labels: true,
        show_scale: true,
        labels: function (val) { return val.toFixed(2); },
        tooltip: false,
        layout: "left",
        fixed_dots: false,
        fixed_labels: false,
        bind_click: false,
        bind_dblclick: true,
    },
    initialize: function (options) {
        this.__tt = false;
        TK.Widget.prototype.initialize.call(this, options);

        var E, O = this.options;
        
        if (!(E = this.element)) this.element = E = TK.element("div");
        TK.add_class(E, "toolkit-fader");
        this.widgetize(E, true, true, true);

        this.scale = this._scale = null;
        
        this._handle = TK.element("div", "toolkit-handle");
        this._handle_size = 0;
        this.element.appendChild(this._handle);

        if (O.reset === void(0))
            O.reset = O.value;

        if (O.direction === void(0))
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
        
        this.set("bind_click", O.bind_click);
        this.set("bind_dblclick", O.bind_dblclick);
        this.set("tooltip", O.tooltip);
        this.set("show_scale", O.show_scale);
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
        var tmp;

        if (I.show_scale) {
            I.show_scale = false;
            if (O.show_scale) {
                if (!this._scale) {
                    this._scale = this.scale.element;
                    E.appendChild(this._scale);
                }
                TK.add_class(this.element, "toolkit-has-scale");
            } else {
                if (this._scale) {
                    E.removeChild(this._scale)
                    this._scale = null;
                }
                TK.remove_class(this.element, "toolkit-has-scale");
            }
        }

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
            tmp = value === "left"   ? "toolkit-left" :
                    value === "right"  ? "toolkit-right" :
                    value === "top"    ? "toolkit-top" : "toolkit-bottom";
            TK.add_class(E, tmp);

            I.value = false;
        }

        if (I.validate.apply(I, Object.keys(Ranged.prototype._options)) || I.value) {
            I.value = false;
            // TODO: value is snapped already in set(). This is not enough for values which are set during
            // initialization.
            tmp = this.val2real(this.snap(O.value)) + "px"

            // TODO: this does not work on IE9

            if (vert(O)) {
                if (supports_transform)
                    this._handle.style.transform = "translateY(-"+tmp+")";
                else
                    this._handle.style.bottom = tmp;
            } else {
                if (supports_transform)
                    this._handle.style.transform = "translateX("+tmp+")";
                else
                    this._handle.style.left = tmp;
            }
        }
    },
    resize: function () {
        var O = this.options;
        var E = this.element, H = this._handle;
        var basis;

        TK.Widget.prototype.resize.call(this);

        if (vert(O)) {
            this._handle_size = TK.outer_height(H, true);
            basis = TK.inner_height(E) - this._handle_size;
        } else {
            this._handle_size = TK.outer_width(H, true);
            basis = TK.inner_width(E) - this._handle_size;
        }

        this.set("basis", basis);
    },
    destroy: function () {
        this._handle.remove();
        remove_scale.call(this);
        this.element.remove();
        TK.Widget.prototype.destroy.call(this);
        TK.tooltip.remove(0, this.tooltip_by_value);
        TK.tooltip.remove(1, this.tooltip_by_position);
    },

    /**
     * Resets the fader value to <code>options.reset</code>.
     *
     * @method TK.Fader#reset
     */
    reset: function() {
        this.set("value", this.options.reset);
    },
    
    // GETTER & SETTER
    set: function (key, value) {
        switch (key) {
            case "tooltip":
                if (value) {
                    activate_tooltip.call(this);
                } else {
                    deactivate_tooltip.call(this);
                }
                break;
            case "value":
                if (value > this.options.max || value < this.options.min)
                    this.warning(this.element);
                value = this.snap(value);
                break;
            case "layout":
                if (this.scale) this.scale.set("layout", value);
                this.options.direction = vert(this.options) ? "vertical" : "horizontal";
                this.drag.set("direction", this.options.direction);
                this.scroll.set("direction", this.options.direction);
                break;
            case "show_scale":
                if (value) {
                    create_scale.call(this);
                } else {
                    remove_scale.call(this);
                }
                break;
            case "bind_click":
                if (value) this.add_event("click", clicked);
                else this.remove_event("click", clicked);
                break;
            case "bind_dblclick":
                if (value) this.add_event("dblclick", dblclick);
                else this.remove_event("dblclick", dblclick);
                break;
        }

        if (this.scale && !TK.Widget.prototype._options[key] && TK.Scale.prototype._options[key]) {
            this.scale.set(key, value);
            this.fire_event("scalechanged", key, value);
        }

        return TK.Widget.prototype.set.call(this, key, value);
    }
});
})(this);
