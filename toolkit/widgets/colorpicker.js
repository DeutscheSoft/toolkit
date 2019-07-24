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

var color_options = [ "rgb", "hsl", "hex", "hue", "saturation", "lightness", "red", "green", "blue" ];

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

var color_atoms = { "hue":"hsl", "saturation":"hsl", "lightness":"hsl", "red":"rgb", "green":"rgb", "blue":"rgb" };

function set_atoms (key, value) {
    var O = this.options;
    var atoms = Object.keys(color_atoms);
    for ( var i = 0; i < atoms.length; i++) {
        var atom = atoms[i];
        if (key !== atom) {
            O[atom] = O[color_atoms[atom]][atom.substr(0,1)]
            this[atom].set("value", O[atom]);
        }
    }
    if (key !== "hex")
        O.hex = this.rgb2hex(O.rgb);
}


/**
 * TK.ColorPicker provides a collection of widgets to select a color in
 * RGB or HSL color space.
 * 
 * @implements TK.Colors
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
        
        //this.cancel = new TK.Button({
            //container:E, "class":"toolkit-cancel", "label":"Cancel"});
        //this.apply = new TK.Button({
            //container:E, "class":"toolkit-apply", "label":"Apply"});
            
        //this._color.onkeyup = checkinput.bind(this);
        //this._color.onpaste = checkinput.bind(this);

        //this.cancel.add_event("click", cancel.bind(this));
        //this.apply.add_event("click", apply.bind(this));
        
        this.range_x = new TK.Range({
            min: 0,
            max: 1,
        });
        this.range_y = new TK.Range({
            min: 0,
            max: 1,
            reverse: true,
        });
        this.drag_x = new TK.DragValue(this, {
            range: (function () { return this.range_x; }).bind(this),
            get: function () { return this.parent.options.hue; },
            set: function (v) { this.parent.userset("hue", this.parent.range_x.snap(v)); },
            direction: "horizontal",
            onstartcapture: function (e) {
                if (e.start.target.classList.contains("toolkit-indicator")) return;
                var ev = e.stouch ? e.stouch : e.start;
                var x = ev.clientX - this.parent._canvas.getBoundingClientRect().left;
                this.parent.set("hue", this.options.range().px2val(x));
            }
        });
        this.drag_y = new TK.DragValue(this, {
            range: (function () { return this.range_y; }).bind(this),
            get: function () { return this.parent.options.lightness; },
            set: function (v) { this.parent.userset("lightness", this.parent.range_y.snap(v)); },
            direction: "vertical",
            onstartcapture: function (e) {
                if (e.start.target.classList.contains("toolkit-indicator")) return;
                var ev = e.stouch ? e.stouch : e.start;
                var y = ev.clientY - this.parent._canvas.getBoundingClientRect().top;
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
    resize: function () {
        var rect = this._canvas.getBoundingClientRect();
        this.range_x.set("basis", rect.width);
        this.range_y.set("basis", rect.height);
    },
    redraw: function () {
        TK.Container.prototype.redraw.call(this);
        var I = this.invalid;
        var O = this.options;
        var E = this.element;
        if (I.validate("rgb", "hsl", "hex", "hue", "saturation", "lightness", "red", "green", "blue")) {
            var bw = this.rgb2bw(O.rgb);
            var bg = "rgb("+parseInt(O.red)+","+parseInt(O.green)+","+parseInt(O.blue)+")";
            this.hex._input.style.backgroundColor = bg;
            this.hex._input.style.color = bw;
            this.hex._input.value = O.hex;
            
            this._indicator.style.left = (O.hue * 100) + "%";
            this._indicator.style.top  = (O.lightness * 100) + "%";
            this._indicator.style.backgroundColor = bg;
            this._indicator.style.color = bw;
            
            this._grayscale.style.opacity = 1 - O.saturation;
        }
    },
    set: function (key, value) {
        var O = this.options;
        if (color_options.indexOf(key) > -1) {
            switch (key) {
                case "rgb":
                    O.hsl = this.rgb2hsl(value);
                    break;
                case "hsl":
                    O.rgb = this.hsl2rgb(value);
                    break;
                case "hex":
                    O.rgb = this.hex2rgb(value);
                    O.hsl = this.rgb2hsl(O.rgb);
                    break;
                case "hue":
                    O.hsl = {h:Math.min(1,Math.max(0,value)), s:O.saturation, l:O.lightness};
                    O.rgb = this.hsl2rgb(O.hsl);
                    break;
                case "saturation":
                    O.hsl = {h:O.hue, s:Math.min(1,Math.max(0,value)), l:O.lightness};
                    O.rgb = this.hsl2rgb(O.hsl);
                    break;
                case "lightness":
                    O.hsl = {h:O.hue, s:O.saturation, l:Math.min(1,Math.max(0,value))};
                    O.rgb = this.hsl2rgb(O.hsl);
                    break;
                case "red":
                    O.rgb = {r:Math.min(255,Math.max(0,value)), g:O.green, b:O.blue};
                    O.hsl = this.rgb2hsl(O.rgb);
                    break;
                case "green":
                    O.rgb = {r:O.red, g:Math.min(255,Math.max(0,value)), b:O.blue};
                    O.hsl = this.rgb2hsl(O.rgb);
                    break;
                case "blue":
                    O.rgb = {r:O.red, g:O.green, b:Math.min(255,Math.max(0,value))};
                    O.hsl = this.rgb2hsl(O.rgb);
                    break;
            }
            set_atoms.call(this, key, value);
        }
        return TK.Container.prototype.set.call(this, key, value);
    }
});

TK.ChildElement(TK.ColorPicker, "canvas", {
    show: true,
    append: function () {
        this.element.appendChild(this._canvas);
        this.drag_x.set("node", this._canvas);
        this.drag_y.set("node", this._canvas);
    },
});
TK.ChildElement(TK.ColorPicker, "grayscale", {
    show: true,
    append: function () {
        this._canvas.appendChild(this._grayscale);
    },
});
TK.ChildElement(TK.ColorPicker, "indicator", {
    show: true,
    append: function () {
        this._canvas.appendChild(this._indicator);
    },
});

TK.ChildWidget(TK.ColorPicker, "hex", {
    create: TK.Value,
    show: true,
    static_events: {
        "userset": function (key, val) {
            if (key == "value") this.parent.userset("hex", val);
        },
        "keyup": function (e) { checkinput.call(this.parent, e); },
        "paste": function (e) { checkinput.call(this.parent, e); },
    },
    default_options: {
        format: TK.FORMAT("%s"),
        "class": "toolkit-hex",
        set: function (v) {
            var p=0, tmp;
            if (v[0] == "#")
                v = v.substring(1);
            while (v.length < 6) {
                console.log(p,v);
                tmp = v.slice(0, p+1);
                console.log(tmp);
                tmp += v[p];
                console.log(tmp);
                tmp += v.slice(p+1);
                console.log(tmp);
                v = tmp;
                p+=2;
            }
            return v;
        },
        size: 7,
        maxlength: 7,
    },
    map_options: {
        "hex" : "value"
    },
    inherit_options: true,
});

TK.ChildWidget(TK.ColorPicker, "hue", {
    create: TK.ValueKnob,
    option: "show_hsl",
    show: true,
    static_events: {
        "userset": function (key, val) {
            if (key == "value") this.parent.userset("hue", val);
        },
    },
    default_options: {
        title: "Hue",
        min: 0,
        max: 1,
        "class": "toolkit-hue",
    },
    map_options: {
        "hue" : "value"
    },
    inherit_options: true,
    blacklist_options: ["x", "y", "value"],
});
TK.ChildWidget(TK.ColorPicker, "saturation", {
    create: TK.ValueKnob,
    show: true,
    static_events: {
        "userset": function (key, val) {
            if (key == "value") this.parent.userset("saturation", val);
        },
    },
    default_options: {
        title: "Saturation",
        min: 0,
        max: 1,
        "class": "toolkit-saturation",
    },
    map_options: {
        "saturation" : "value"
    },
    inherit_options: true,
    blacklist_options: ["x", "y", "value"],
});
TK.ChildWidget(TK.ColorPicker, "lightness", {
    create: TK.ValueKnob,
    option: "show_hsl",
    show: true,
    static_events: {
        "userset": function (key, val) {
            if (key == "value") this.parent.userset("lightness", val);
        },
    },
    default_options: {
        title: "Lightness",
        min: 0,
        max: 1,
        "class": "toolkit-lightness",
    },
    map_options: {
        "lightness" : "value"
    },
    inherit_options: true,
    blacklist_options: ["x", "y", "value"],
});

TK.ChildWidget(TK.ColorPicker, "red", {
    create: TK.ValueKnob,
    option: "show_rgb",
    show: true,
    static_events: {
        "userset": function (key, val) {
            if (key == "value") this.parent.userset("red", val);
        },
    },
    default_options: {
        title: "Red",
        min: 0,
        max: 255,
        snap: 1,
        value_format: function (v) { return parseInt(v); },
        set: function (v) { return Math.round(v); },
        "class": "toolkit-red",
    },
    map_options: {
        "red" : "value"
    },
    inherit_options: true,
    blacklist_options: ["x", "y", "value"],
});
TK.ChildWidget(TK.ColorPicker, "green", {
    create: TK.ValueKnob,
    option: "show_rgb",
    show: true,
    static_events: {
        "userset": function (key, val) {
            if (key == "value") this.parent.userset("green", val);
        },
    },
    default_options: {
        title: "Green",
        min: 0,
        max: 255,
        snap: 1,
        value_format: function (v) { return parseInt(v); },
        set: function (v) { return Math.round(v); },
        "class": "toolkit-green",
    },
    map_options: {
        "green" : "value"
    },
    inherit_options: true,
    blacklist_options: ["x", "y", "value"],
});
TK.ChildWidget(TK.ColorPicker, "blue", {
    create: TK.ValueKnob,
    option: "show_rgb",
    show: true,
    static_events: {
        "userset": function (key, val) {
            if (key == "value") this.parent.userset("blue", val);
        },
    },
    default_options: {
        title: "Blue",
        min: 0,
        max: 255,
        snap: 1,
        value_format: function (v) { return parseInt(v); },
        set: function (v) { return Math.round(v); },
        "class": "toolkit-blue",
    },
    map_options: {
        "blue" : "value"
    },
    inherit_options: true,
    blacklist_options: ["x", "y", "value"],
});
TK.ChildWidget(TK.ColorPicker, "apply", {
    create: TK.Button,
    show: true,
    static_events: {
        "click": function () { apply.call(this.parent); },
    },
    default_options: {
        "label" : "Apply",
        "class": "toolkit-apply",
    },
});
TK.ChildWidget(TK.ColorPicker, "cancel", {
    create: TK.Button,
    show: true,
    static_events: {
        "click": function () { cancel.call(this.parent); },
    },
    default_options: {
        "label" : "Cancel",
        "class" : "toolkit-cancel",
    },
});
    
})(this, this.TK);
