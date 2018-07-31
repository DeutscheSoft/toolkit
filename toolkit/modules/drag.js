/*
 * This file is part of Toolkit.
 *
 * Toolkit is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * Toolkit is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU General
 * Public License along with this program; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA  02110-1301  USA
 */
"use strict";
(function(w, TK){
function startdrag(e, drag) {
    this._dragged = 0;
    var O = this.options;
    if (!O.active) return;
    if (e.button !== void(0) && e.button > 0) return;
    this._xstart = this._xlast = e.pageX;
    this._ystart = this._ylast = e.pageY;
    this._xpos   = O.node.offsetLeft;
    this._ypos   = O.node.offsetTop;
    TK.add_class(O.node, "toolkit-dragging");
    /** 
     * The user started dragging this item.
     * 
     * @event TK.Drag#dragstart
     * 
     * @param {DOMEvent} event - The native DOM event.
     */
}
function stopdrag(e, drag) {
    if (!this.options.active) return;
    if (e.button !== void(0) && e.button > 0) return;
    TK.remove_class(this.options.node, "toolkit-dragging");
    /**
     * The user stopped dragging this item.
     * 
     * @event TK.Drag#dragstop
     * 
     * @param {DOMEvent} event - The native DOM event.
     */
}
function dragging(e, drag) {
    var O = this.options;
    if (!O.active) return;
    if (e.button !== void(0) && e.button > 0) return;
    this._dragged += (Math.abs(e.pageX - this._xlast)
                    + Math.abs(e.pageY - this._ylast)) / 2;
    if (this._dragged < O.initial) return;
    this._xlast = e.pageX;
    this._ylast = e.pageY;
    var x = this._xpos + e.pageX - this._xstart;
    var y = this._ypos + e.pageY - this._ystart;
    if (O.min.x !== false) x = Math.max(O.min.x, x);
    if (O.max.x !== false) x = Math.min(O.max.x, x);
    if (O.min.y !== false) y = Math.max(O.min.y, y);
    if (O.max.y !== false) y = Math.min(O.max.y, y);
    O.node.style.top = y + "px";
    O.node.style.left = x + "px";
    /**
     * The user is dragging this item.
     * The arguments are the native DOM event object and both the x and y coordinate.
     *
     * @event TK.Drag#dragging
     * 
     * @param {DOMEvent} event - The native DOM event.
     * @param {int} x - The new x position.
     * @param {int} y - The new y position.
     */
}
function set_handle() {
    var h = this.options.handle;
    if (this.drag)
        this.drag.destroy();
    var range = new TK.Range({});
    this.drag = new TK.DragValue(this, {
        node: h,
        range: function () { return range; },
        get: function() { return 0; },
        set: function(v) { return; },
    });
}
/**
 * TK.Drag enables dragging of absolutely positioned
 * elements on the screen.
 * 
 * @param {Object} options
 * 
 * @property {HTMLElement|SVGElement} options.node - The element to drag
 * @property {HTMLElement|SVGElement} [options.handle=options.node] A DOM node to be used as a handle. If not set options.node is used.
 * @property {boolean} [options.active=true] - Enable or disable dragging
 * @property {{ x: number, y: number }} [options.min={x: -1, y: -1}] - Object containing the minimum positions for x and y. A value of false is interpreted as no minimum.
 * @property {{ x: number, y: number }} [options.max={x: -1, y: -1}] - Object containing the maximum positions for x and y. A value of false is interpreted as no maximum.
 * @property {number} [options.initial=2] - Number of pixels the user has to move until dragging starts.
 * 
 * @extends TK.Base
 * 
 * @class TK.Drag
 */
TK.Drag = TK.class({
    _class: "Drag",
    Extends: TK.Base,
    _options: {
        node    : "object",
        handle  : "object",
        active  : "boolean",
        min     : "object",
        max     : "object",
        initial : "number"
    },
    options: {
        node      : null,
        handle    : null,
        active    : true,
        min       : {x: -1, y: -1},
        max       : {x: -1, y: -1},
        initial   : 2,
    },
    static_events: {
        startdrag: startdrag,
        dragging: dragging,
        stopdrag: stopdrag,
    },
    initialize: function (options) {
        TK.Base.prototype.initialize.call(this, options);
        this.set("handle", this.options.handle);
    },
    // GETTERS & SETTERS
    set: function (key, value) {
        if (key === "handle" && !value)
            value = this.options.node;

        TK.Base.prototype.set.call(this, key, value);

        if (key === "handle") set_handle.call(this);
        if (key === "initial" && this.drag) this.drag.set("initial", value);
    }
});
})(this, this.TK);
