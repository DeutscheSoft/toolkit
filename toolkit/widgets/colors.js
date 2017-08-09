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
(function(w, TK){

var pad = function (n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var args2object = function () {
    var out = {};
    if (arguments[0][0] instanceof Array) {
        for (var i = 0; i < arguments.length - 1; i++)
            out[arguments[i+1]] = arguments[0][0][i];
    } else if (typeof(arguments[0][0]) === "object") {
        out = arguments[0][0];
    } else {
        for (var i = 0; i < arguments.length - 1; i++)
            out[arguments[i+1]] = arguments[0][i];
    }
    return out;
}


var rgb2bw = function (r, g, b) {
    return rgb2gray(r, g, b) > 0.5 ? "#000000" : "#ffffff";
}
var rgb2gray = function (r, g, b) {
    var col = args2object(arguments, "r", "g", "b");
    return (col.r * 0.2126 + col.g * 0.7152 + col.b * 0.0722) / 255;
}
var rgb2hsl = function (r, g, b) {
    var col = args2object(arguments, "r", "g", "b");
    var r = col.r, g = col.g, b = col.b;
    
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
    
        h /= 6;
    }

    return { h:h, s:s, l:l };
}
var hsl2rgb = function (h, s, l) {
    var col = args2object(arguments, "h", "s", "l");
    var h = col.h, s = col.s, l = col.l;
    
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
    
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return { r:r * 255, g:g * 255, b:b * 255 };
}
var hex2rgb = function (hex) {
    hex = hex || "000000";
    if (hex[0] == "#")
        hex = hex.substr(1);
    if (hex.length == 3)
        return { r: parseInt("0x"+hex[0] + hex[0]),
                 g: parseInt("0x"+hex[1] + hex[1]),
                 b: parseInt("0x"+hex[2] + hex[2]) };
    return { r: parseInt("0x"+hex.substr(0,2)),
             g: parseInt("0x"+hex.substr(2,2)),
             b: parseInt("0x"+hex.substr(4,2)) };
}
var rgb2hex = function (r, g, b) {
    var col = args2object(arguments, "r", "g", "b");
    return pad(parseInt(col.r).toString(16),2) +
           pad(parseInt(col.g).toString(16),2) +
           pad(parseInt(col.b).toString(16),2);
}
var hsl2hex = function (h, s, l) {
    var col = args2object(arguments, "h", "s", "l");
    return rgb2hex(hsl2rgb(col));
}
var hex2hsl = function (hex) {
    return rgb2hsl(hex2rgb(hex))
}

var name2hex = function (name) {
    return color_names[name.toLowerCase];
}
/**
 * TK.Colors provides a couple of functions for easy color calculations
 * and conversions.
 * 
 * @mixin TK.Colors
 */

TK.Colors = TK.class({
    /**
     * Returns the highest contrast from red, green and blue (0..255) regarding
     * ITU-R BT.709 as hex string
     * 
     * @method TK.Colors#rgb2bw
     * 
     * @param {number|array|object} r - red (0..255) or object with members r, g and b or array of RGB
     * @param {number} g - green (0..255)
     * @param {number} b - blue (0..255)
     * 
     * @returns {string} color ("#000000" or "#ffffff")
     */
    rgb2bw: rgb2bw,
    /**
     * Returns gray (0..1) from red, green and blue (0..255) regarding
     * ITU-R BT.709
     * 
     * @method TK.Colors#rgb2gray
     * 
     * @param {number|array|object} r - red (0..255) or object with members r, g and b or array of RGB
     * @param {number} g - green (0..255)
     * @param {number} b - blue (0..255)
     * 
     * @returns {number} gray lightness (0..1)
     */
    rgb2gray: rgb2gray,
    /**
     * Returns hue, saturation and lightness (0..1) from red, green
     * and blue (0..255).
     * 
     * @method TK.Colors#rgb2hsl
     * 
     * @param {number|array|object} r - red (0..255) or object with members r, g and b or array of RGB
     * @param {number} g - green (0..255)
     * @param {number} b - blue (0..255)
     * 
     * @returns {object} Object with members h, s and l as numbers (0..1)
     */
    rgb2hsl: rgb2hsl,
    /**
     * Returns red, green and blue (0..255) from hue, saturation
     * and lightness (0..1)
     * 
     * @param {number|array|object} h - hue (0..1) or object with members h, s and l or array of HSL
     * @param {number} s - saturation (0..1)
     * @param {number} l - lightness (0..1)
     * 
     * @returns {object} Object with members r, g and b as numbers (0..255)
     */
    hsl2rgb: hsl2rgb,
    /**
     * Returns an object containing red, green and blue from a
     * hexadecimal rgb color string
     * 
     * @param {string} hex - Color string like "#FF0099"
     * 
     * @returns {object} Object with members r, g and b as numbers (0..255)
     */
    hex2rgb: hex2rgb,
    /**
     * Returns hexadecimal color string from r, g and b as numbers (0..255)
     * 
     * @param {number|array|object} r - red as number (0..255) or object with members r, g and b or array of RGB
     * @param {number} g - green as number (0..255)
     * @param {number} b - blue as number (0..255)
     * 
     * @returns {string} hexadecimal string to be used in CSS or SVG
     */
    rgb2hex: rgb2hex,
    /**
     * Returns an object containing hue, stauration and lightness from a
     * hexadecimal rgb color string
     * 
     * @param {string} hex - Color string like "#FF0099"
     * 
     * @returns {object} Object with members h, s and l as numbers (0..1)
     */
    hex2hsl: hex2hsl,
    /**
     * Returns hexadecimal color string from h, s and l as numbers (0..1)
     * 
     * @param {number|array|object} h - red as number (0..1) or object with members h, s and l or array of HSL
     * @param {number} s - green as number (0..1)
     * @param {number} l - blue as number (0..1)
     * 
     * @returns {string} hexadecimal string to be used in CSS or SVG
     */
    hsl2hex: hsl2hex,
    /**
     * Returns hexadecimal color string from color name
     * 
     * @param {string} colorname - name of the color, e.g. "white", "IslamicGreen" or "lightCoral"
     * 
     * @returns {string} hexadecimal string to be used in CSS or SVG
     */
    name2hex: name2hex,
});

var color_names = {
    "lightcoral" : "f08080",
    "salmon" : "fa8072",
    "darksalmon" : "e9967a",
    "lightsalmon" : "ffa07a",
    "crimson" : "dc143c",
    "red" : "ff0000",
    "firebrick" : "b22222",
    "darkred" : "8b0000",
    "pink" : "ffc0cb",
    "lightpink" : "ffb6c1",
    "hotpink" : "ff69b4",
    "deeppink" : "ff1493",
    "mediumvioletred" : "c71585",
    "palevioletred" : "db7093",
    "lightsalmon" : "ffa07a",
    "coral" : "ff7f50",
    "tomato" : "ff6347",
    "orangered" : "ff4500",
    "darkorange" : "ff8c00",
    "orange" : "ffa500",
    "gold" : "ffd700",
    "yellow" : "ffff00",
    "lightyellow" : "ffffe0",
    "lemonchiffon" : "fffacd",
    "lightgoldenrodyellow" : "fafad2",
    "papayawhip" : "ffefd5",
    "moccasin" : "ffe4b5",
    "peachpuff" : "ffdab9",
    "palegoldenrod" : "eee8aa",
    "khaki" : "f0e68c",
    "darkkhaki" : "bdb76b",
    "lavender" : "e6e6fa",
    "thistle" : "d8bfd8",
    "plum" : "dda0dd",
    "violet" : "ee82ee",
    "orchid" : "da70d6",
    "fuchsia" : "ff00ff",
    "magenta" : "ff00ff",
    "mediumorchid" : "ba55d3",
    "mediumpurple" : "9370db",
    "amethyst" : "9966cc",
    "blueviolet" : "8a2be2",
    "darkviolet" : "9400d3",
    "darkorchid" : "9932cc",
    "darkmagenta" : "8b008b",
    "purple" : "800080",
    "indigo" : "4b0082",
    "slateblue" : "6a5acd",
    "darkslateblue" : "483d8b",
    "mediumslateblue" : "7b68ee",
    "greenyellow" : "adff2f",
    "chartreuse" : "7fff00",
    "lawngreen" : "7cfc00",
    "lime" : "00ff00",
    "limegreen" : "32cd32",
    "palegreen" : "98fb98",
    "lightgreen" : "90ee90",
    "mediumspringgreen" : "00fa9a",
    "springgreen" : "00ff7f",
    "mediumseagreen" : "3cb371",
    "seagreen" : "2e8b57",
    "forestgreen" : "228b22",
    "green" : "008000",
    "darkgreen" : "006400",
    "yellowgreen" : "9acd32",
    "olivedrab" : "6b8e23",
    "olive" : "808000",
    "darkolivegreen" : "556b2f",
    "mediumaquamarine" : "66cdaa",
    "darkseagreen" : "8fbc8f",
    "lightseagreen" : "20b2aa",
    "darkcyan" : "008b8b",
    "teal" : "008080",
    "aqua" : "00ffff",
    "cyan" : "00ffff",
    "lightcyan" : "e0ffff",
    "paleturquoise" : "afeeee",
    "aquamarine" : "7fffd4",
    "turquoise" : "40e0d0",
    "mediumturquoise" : "48d1cc",
    "darkturquoise" : "00ced1",
    "cadetblue" : "5f9ea0",
    "steelblue" : "4682b4",
    "lightsteelblue" : "b0c4de",
    "powderblue" : "b0e0e6",
    "lightblue" : "add8e6",
    "skyblue" : "87ceeb",
    "lightskyblue" : "87cefa",
    "deepskyblue" : "00bfff",
    "dodgerblue" : "1e90ff",
    "cornflowerblue" : "6495ed",
    "mediumslateblue" : "7b68ee",
    "royalblue" : "4169e1",
    "blue" : "0000ff",
    "mediumblue" : "0000cd",
    "darkblue" : "00008b",
    "navy" : "000080",
    "midnightblue" : "191970",
    "cornsilk" : "fff8dc",
    "blanchedalmond" : "ffebcd",
    "bisque" : "ffe4c4",
    "navajowhite" : "ffdead",
    "wheat" : "f5deb3",
    "burlywood" : "deb887",
    "tan" : "d2b48c",
    "rosybrown" : "bc8f8f",
    "sandybrown" : "f4a460",
    "goldenrod" : "daa520",
    "darkgoldenrod" : "b8860b",
    "peru" : "cd853f",
    "chocolate" : "d2691e",
    "saddlebrown" : "8b4513",
    "sienna" : "a0522d",
    "brown" : "a52a2a",
    "maroon" : "800000",
    "white" : "ffffff",
    "snow" : "fffafa",
    "honeydew" : "f0fff0",
    "mintcream" : "f5fffa",
    "azure" : "f0ffff",
    "aliceblue" : "f0f8ff",
    "ghostwhite" : "f8f8ff",
    "whitesmoke" : "f5f5f5",
    "seashell" : "fff5ee",
    "beige" : "f5f5dc",
    "oldlace" : "fdf5e6",
    "floralwhite" : "fffaf0",
    "ivory" : "fffff0",
    "antiquewhite" : "faebd7",
    "linen" : "faf0e6",
    "lavenderblush" : "fff0f5",
    "mistyrose" : "ffe4e1",
    "gainsboro" : "dcdcdc",
    "lightgrey" : "d3d3d3",
    "silver" : "c0c0c0",
    "darkgray" : "a9a9a9",
    "gray" : "808080",
    "dimgray" : "696969",
    "lightslategray" : "778899",
    "slategray" : "708090",
    "darkslategray" : "2f4f4f",
    "black" : "000000"
}

})(this, this.TK);
