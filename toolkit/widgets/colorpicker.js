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
        fevent.call(this, "colorset", true);
    }
}
var cancel = function () {
    /**
     * Is fired whenever the cancel button gets clicked or ESC is hit on input.
     * 
     * @event TK.ColorPicker#cancel
     */
    fevent.call(this, "cancel");
}
var apply = function () {
    /**
     * Is fired whenever the apply button gets clicked or return is hit on input.
     * 
     * @event TK.ColorPicker#apply
     * @param {object} colors - Object containing all color objects: `rgb`, `hsl`, `hex`, `hue`, `saturation`, `lightness`, `red`, `green`, `blue`
     */
    fevent.call(this, "apply", true);
}

var fevent = function (e, useraction) {
    var O = this.options;
    if (useraction) {
        this.fire_event("userset", "rgb", O.rgb);
        this.fire_event("userset", "hsl", O.hsl);
        this.fire_event("userset", "hex", O.hex);
        this.fire_event("userset", "hue", O.hue);
        this.fire_event("userset", "saturation", O.saturation);
        this.fire_event("userset", "lightness", O.lightness);
        this.fire_event("userset", "red", O.red);
        this.fire_event("userset", "green", O.green);
        this.fire_event("userset", "blue", O.blue);
    }
    this.fire_event(e, {
        rgb: O.rgb,
        hsl: O.hsl,
        hex: O.hex,
        hue: O.hue,
        saturation: O.saturation,
        lightness: O.lightness,
        red: O.red,
        green: O.green,
        blue: O.blue,
    });
}

function set_atoms () {
    var O = this.options;
    O.hue = O.hsl["h"];
    O.saturation = O.hsl["s"];
    O.lightness = O.hsl["l"];
    O.red = O.rgb["r"];
    O.green = O.rgb["g"];
    O.blue = O.rgb["b"];
}


/**
 * TK.ColorPicker provides an easy way to choose a color by clicking in
 * a HSL image and selecting a saturation.
 * 
 * @mixin TK.Colors
 * 
 */


TK.ColorPicker = TK.class({
    
    _class: "ColorPicker",
    Extends: TK.Container,
    Implements: [TK.Colors],
    
    _options: Object.assign(Object.create(TK.Container.prototype._options), {
        hsl: "object",
        rgb: "object",
        hex: "string",
        hue: "number",
        saturation: "number",
        lightness: "number",
        red: "number",
        green: "number",
        blue: "number",
    }),
    options: {
        hsl: {h:0, s:0.5, l:0},
        rgb: {r:0, g:0, b:0},
        hex: "000000",
        hue: 0,
        saturation: 0.5,
        lightness:  0,
        red: 0,
        green: 0,
        blue: 0,
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
            this.set("saturation", value);
        }).bind(this));
        
        this.cancel.add_event("click", cancel.bind(this));
        this.apply.add_event("click", apply.bind(this));
        
        this.rangeH = new TK.Range({
            min: 0,
            max: 1,
            basis: 200,
        });
        this.rangeV = new TK.Range({
            min: 0,
            max: 1,
            basis: 200,
            reverse: true,
        });
        this.dragH = new TK.DragValue(this, {
            node: this._crosshair,
            range: (function () { return this.rangeH; }).bind(this),
            get: function () { return this.parent.options.hue; },
            set: function (v) { this.parent.set("hue", v); },
            direction: "horizontal",
            onstartcapture: function (e) {
                var x = e.stouch.clientX - this.parent._crosshair.getBoundingClientRect().left;
                this.parent.set("hue", this.options.range().px2val(x));
            }
        });
        this.dragV = new TK.DragValue(this, {
            node: this._crosshair,
            range: (function () { return this.rangeV; }).bind(this),
            get: function () { return this.parent.options.lightness; },
            set: function (v) { this.parent.set("lightness", v); },
            direction: "vertical",
            onstartcapture: function (e) {
                var y = e.stouch.clientY - this.parent._crosshair.getBoundingClientRect().top;
                this.parent.set("lightness", 1 - this.options.range().px2val(y));
            }
        });
        
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
        var O = this.options;
        switch (key) {
            case "rgb":
                O.hsl = this.rgb2hsl(value);
                O.hex = this.rgb2hex(value);
                set_atoms.call(this);
                break;
            case "hsl":
                O.rgb = this.hsl2rgb(value);
                O.hex = this.rgb2hex(O.rgb);
                set_atoms.call(this);
                break;
            case "hex":
                O.rgb = this.hex2rgb(value);
                O.hsl = this.rgb2hsl(O.rgb);
                set_atoms.call(this);
                break;
            case "hue":
                this.set("hsl", {h:value, s:O.saturation, l:O.lightness});
                break;
            case "saturation":
                this.set("hsl", {h:O.hue, s:value, l:O.lightness});
                break;
            case "lightness":
                this.set("hsl", {h:O.hue, s:O.saturation, l:value});
                break;
            case "red":
                this.set("rgb", {r:value, g:O.green, b:O.blue});
                break;
            case "green":
                this.set("rgb", {r:O.red, g:value, b:O.blue});
                break;
            case "blue":
                this.set("rgb", {r:O.red, g:value, b:O.blue});
                break;
        }
        return TK.Container.prototype.set.call(this, key, value);
    }
});
})(this, this.TK);
