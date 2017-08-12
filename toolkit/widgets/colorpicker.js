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
(function (w, TK) {


/* TODO: switch to native DragCapture */

function Drag (node, callback) {
    this.node = node;
    this.callback = callback;
    this.active = false;
    this.rect = null;
    
    node.addEventListener("mousedown", this.down.bind(this));
    this._move = this.move.bind(this);
    this._up = this.up.bind(this);
}

Drag.prototype = {
    down: function (e) {
        this.active = true;
        this.rect = this.node.getBoundingClientRect();
        document.addEventListener("mousemove", this._move);
        document.addEventListener("mouseup", this._up);
    },
    up: function (e) {
        if (!this.active) return;
        this.move(e);
        this.active = false;
        document.removeEventListener("mousemove", this._move);
        document.removeEventListener("mouseup", this._up);
    },
    move: function (e) {
        if (!this.active) return;
        e.preventDefault();
        e = this.get_event(e);
        if (this.callback)
            this.callback(Math.max(0, Math.min(1, (e.pageX - this.rect.left) / this.rect.width)),
                          Math.max(0, Math.min(1, (e.pageY - this.rect.top) / this.rect.height)));
    },
    get_event(e) {
        if (e.hasOwnProperty("touches") && touches.length)
            return e.touches[0];
        return e;
    }
}
Drag.prototype.constructor = Drag;

var checkinput = function (e) {
    var I = this._color;
    if (e.keyCode && e.keyCode == 13) {
        apply.call(this);
        return;
    }
    if (e.keyCode && e.keyCode == 27) {
        cancel.call(this);
        return;
    }
    if (I.value.substr(0, 1) == "#")
        I.value = I.value.substr(1);
    if (e.type == "paste" && I.value.length == 3) {
        I.value = I.value[0] + I.value[0] +
                  I.value[1] + I.value[1] +
                  I.value[2] + I.value[2];
    }
    if (I.value.length == 6) {
        this.set("hex", I.value);
        fevent.call(this, "colorset");
    }
}
var cancel = function () {
    /**
     * Is fired whenever the cancel button gets clicked or ESC is hit on input.
     * 
     * @event TK.ColorPicker#cancel
     */
    this.fire_event("cancel");
}
var apply = function () {
    fevent.call(this, "apply");
    /**
     * Is fired whenever the apply button gets clicked or return is hit on input.
     * 
     * @event TK.ColorPicker#cancel
     * 
     * @param {object} rgb - Object with members r, g and b (0..255)
     * @param {object} hsl - Object with members h, s and l (0..1)
     * @param {string} hex - Hexadecimal representation
     */
}

var set_color_at = function (x, y) {
    this.set("hsl", {h:x, s:this.options.hsl.s, l:y});
    fevent.call(this, "colorset");
    /**
     * Is fired whenever the color is changed via gradient or saturation fader.
     * 
     * @event TK.ColorPicker#colorset
     * 
     * @param {object} rgb - Object with members r, g and b (0..255)
     * @param {object} hsl - Object with members h, s and l (0..1)
     * @param {string} hex - Hexadecimal representation
     */
}
    
var set_saturation = function (s) {
    this.set("hsl", {h:this.options.hsl.h,
                     s:s,
                     l:this.options.hsl.l});
    fevent.call(this, "colorset");
}

var fevent = function (e) {
    this.fire_event(e, this.options.rgb,
                       this.options.hsl,
                       this.options.hex);
}

/**
 * TK.ColorPicker provides an easy way to choose a color by clicking in
 * a HSL image and selecting a saturation.
 * 
 * @mixin TK.Colors
 * 
 * 
 */


TK.ColorPicker = TK.class({
    
    _class: "ColorPicker",
    Extends: TK.Container,
    Implements: [TK.Colors],
    
    _options: Object.assign(Object.create(TK.Container.prototype._options), {
        hsl: "object",
        rgb: "object",
        hex: "string"
    }),
    options: {
        hsl: {h:0, s:0.5, l:0},
        rgb: {r:0, g:0, b:0},
        hex: "000000",
    },
    initialize: function (options) {
        TK.Container.prototype.initialize.call(this, options);
        var E = this.element;
        /** @member {HTMLDivElement} TK.Label#element - The main DIV container.
         * Has class <code>toolkit-color-picker-hsl</code>.
         */
        TK.add_class(E, "toolkit-color-picker");
        
        this._gradient = TK.element("div", "toolkit-gradient-hsl");
        E.appendChild(this._gradient);
        
        this._grayscale = TK.element("div", "toolkit-grayscale");
        E.appendChild(this._grayscale);
        
        this._crosshair = TK.element("div", "toolkit-crosshair");
        E.appendChild(this._crosshair);
        this._indicator = TK.element("div", "toolkit-indicator");
        this._crosshair.appendChild(this._indicator);
        
        this._color = TK.element("input", "toolkit-color");
        E.appendChild(this._color);
        this._color.setAttribute("type", "text");
        
        this.cancel = new TK.Button({
            container:E, "class":"toolkit-cancel", "label":"Cancel"});
        this.apply = new TK.Button({
            container:E, "class":"toolkit-apply", "label":"Apply"});
            
        this.saturation = new TK.Fader({
            container:E, "class":"toolkit-saturation",
            min:0, max:1, value:0.5, show_scale:false});
        
        this.add_children([this.cancel, this.apply, this.saturation]);
        
        this._color.onkeyup = checkinput.bind(this);
        this._color.onpaste = checkinput.bind(this);

        this.saturation.add_event("useraction", (function (key, value) {
                set_saturation.call(this, value);
        }).bind(this));
        
        this.cancel.add_event("click", cancel.bind(this));
        this.apply.add_event("click", apply.bind(this));
        
        this.colordrag = new Drag(
            this._grayscale, set_color_at.bind(this));
        
        if (options.rgb)
            this.set("rgb", options.rgb);
        if (options.hex)
            this.set("hex", options.hex);
        if (options.hsl)
            this.set("hsl", options.hsl);
    },
    redraw: function () {
        TK.Container.prototype.redraw.call(this);
        var I = this.invalid;
        var O = this.options;
        var E = this.element;
        if (I.rgb || I.hsl || I.hex) {
            I.rgb = I.hsl = I.hex = false;
            this.options.hsl.s = Math.max(1e-10, Math.min(1, this.options.hsl.s));
            var C = O.rgb;
            var S = O.hsl.s;
            var bw = this.rgb2bw(C);
            this._color.style.backgroundColor = "rgb(" +
                parseInt(C.r) + "," +
                parseInt(C.g) + "," + 
                parseInt(C.b) + ")";
            this._color.style.color = bw;
            this._color.value = O.hex;
            
            this.saturation.set("value", S);
            this._grayscale.style.opacity = 1 - S;
            
            this._indicator.style.left = (O.hsl.h * 100) + "%";
            this._indicator.style.top  = (O.hsl.l * 100) + "%";
            this._indicator.style.color = bw;
        }
    },
    set: function (key, value) {
        switch (key) {
            case "rgb":
                this.options.hsl = this.rgb2hsl(value);
                this.options.hex = this.rgb2hex(value);
                break;
            case "hsl":
                this.options.rgb = this.hsl2rgb(value);
                this.options.hex = this.rgb2hex(this.options.rgb);
                break;
            case "hex":
                this.options.rgb = this.hex2rgb(value);
                this.options.hsl = this.rgb2hsl(this.options.rgb);
                break;
                
        }
        return TK.Container.prototype.set.call(this, key, value);
    }
});
})(this, this.TK);
