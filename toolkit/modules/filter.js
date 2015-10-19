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
function FilterModule(stdlib, foreign, heap) {
    "use asm";
    var freq = +foreign.freq;
    var q    = +foreign.q;
    var gain = +foreign.gain;

    var exp = stdlib.Math.exp;
    var log = stdlib.Math.log;
    var pow = stdlib.Math.pow;
    var MAX = stdlib.Math.max;
    var sqrt = stdlib.Math.sqrt;

    var LN2 = stdlib.Math.LN2;
    var LN10 = stdlib.Math.LN10;
    var PI = stdlib.Math.PI;

    function log2(v) {
        v = +v;
        return +log(v) / LN2;
    }

    function log10(v) {
        v = +v;
        return +log(v) / LN10;
    }
    function lpf_order1(f) {
        f = +f;
        var wo = 0.0, wo2 = 0.0, Re2 = 0.0, w = 0.0, w2 = 0.0, Im = 0.0, den = 0.0;
        wo  = 2.0 * PI * freq;
        wo2 = wo * wo;
        Re2 = wo2 * wo2;
        w   = 2.0 * PI * f;
        w2  = w * w;
        Im  = -w * wo;
        den = wo2 + w2;

        return 20.0 * +log10(+sqrt((Re2) + (Im * Im)) / den);
    }
    function lpf_order2(f) {
        f = +f;
        var wo = 0.0, wo2 = 0.0, wo4 = 0.0, Q2 = 0.0, wo3Q = 0.0, w = 0.0, w2 = 0.0, wo2w22 = 0.0, beta = 0.0, Re = 0.0, Im = 0.0, den = 0.0;

        wo   = 2.0 * PI * freq;
        wo2  = wo * wo;
        wo4  = wo2 * wo2;
        Q2   = q * q;
        wo3Q = -(wo * wo2) / q;
        w      = 2.0 * PI * f;
        w2     = w * w;
        wo2w22 = wo2 - w2;
        wo2w22 = wo2w22 * wo2w22;
        beta  = wo2 * w2;
        Re     = wo4 - beta;
        Im     = wo3Q * w;
        den    = wo2w22 + (beta / Q2);

        return 20.0 * +log10(+sqrt( (Re * Re) + (Im * Im)) / den);
    }
    function lpf_order3(f) {
        f = +f;
        return +lpf_order1(f) + +lpf_order2(f);
    }
    function lpf_order4(f) {
        f = +f;
        return 2.0 * +lpf_order2(f);
    }
    function hpf_order1(f) {
        f = +f;
        var wo = 0.0, wo2 = 0.0, w = 0.0, w2 = 0.0, Im = 0.0, den = 0.0;
        wo  = 2.0 * PI * freq;
        wo2 = wo * wo;
        w   = 2.0 * PI * f;
        w2  = w * w;
        Im  = w * wo;
        den = wo2 + w2;

        return 20.0 * +log10(+sqrt( (w2 * w2) +(Im * Im)) / den);
    }
    function hpf_order2(f) {
        f = +f;
        var wo = 0.0, wo2 = 0.0, Q2 = 0.0, woQ = 0.0, w = 0.0, w2 = 0.0, wo2w22 = 0.0,
            beta = 0.0, Re = 0.0, Im = 0.0, den = 0.0;
        wo  = 2.0 * PI * freq;
        wo2 = wo * wo;
        Q2  = q * q;
        woQ = wo / q;
        w      = 2.0 * PI * f;
        w2     = w * w;
        wo2w22 = wo2 - w2;
        wo2w22 = wo2w22 * wo2w22;
        beta  = wo2 * w2;
        Re     = (w2 * w2) - beta;
        Im     = woQ * w * w2;
        den    = wo2w22 + (beta / Q2);

        return 20.0 * +log10(+sqrt( (Re * Re) +(Im * Im)) / den);
    }
    function hpf_order3(f) {
        f = +f;
        return +hpf_order1(f) + +hpf_order2(f);
    }
    function hpf_order4(f) {
        f = +f;
        return 2.0 * +hpf_order2(f);
    }
    function low_shelf(f) {
        f = +f;
        var wo = 0.0, A = 0.0, wo2 = 0.0, wo4 = 0.0, Q2 = 0.0, A2 = 0.0, AQ2 = 0.0,
            wo2AQ2_A2_1 = 0.0, ArAQ = 0.0, wo3 = 0.0, AQ2wo2 = 0.0, w = 0.0, w2 = 0.0,
            Re = 0.0, Im = 0.0, den = 0.0;
        wo          = 2.0 * PI * freq;
        A           = +pow(10.0, gain / 40.0);
        wo2         = wo * wo;
        wo4         = wo2 * wo2;
        Q2          = q * q;
        A2          = A * A;
        AQ2         = A / Q2;
        wo2AQ2_A2_1 = (AQ2 - A2 - 1.0) * wo2;
        ArAQ        = (1.0 - A) * ((A * +sqrt(A)) / q)
        wo3         = wo2 * wo;
        AQ2wo2      = AQ2 * wo2;
        w   = 2.0 * PI * f;
        w2  = w * w;
        Re  = A * (A * (wo4 + w2 * w2) + w2 * wo2AQ2_A2_1);
        Im  = ArAQ * (wo3 * w + wo * w2 * w);
        den = wo2 - A * w2;
        den = den * den;
        den = den + AQ2wo2 * w2;

        f = 20.0 * +log10(+sqrt( (Re * Re) + (Im * Im)) / den);

        //Force zero to avoid some drawing noise
        if (f > 0.1) return f;
        if (f < 0.1) return f;
        return 0.0;
    }
    function high_shelf(f) {
        f = +f;
        var wo = 0.0, A = 0.0, wo2 = 0.0, wo4 = 0.0, Q2 = 0.0, A2 = 0.0, AQ2 = 0.0, wo2AQ2_A2_1 = 0.0,
            ArAQ = 0.0, wo3 = 0.0, AQ2wo2 = 0.0, w = 0.0, w2 = 0.0, Re = 0.0, Im = 0.0, den = 0.0;
        wo          = 2.0 * PI * freq;
        A           = +pow(10.0, gain / 40.0);
        wo2         = wo * wo;
        wo4         = wo2 * wo2;
        Q2          = q * q;
        A2          = A * A;
        AQ2         = A / Q2;
        wo2AQ2_A2_1 = (AQ2 - A2 - 1.0) * wo2;
        ArAQ        = (1.0 - A) * ((A * +sqrt(A)) / q);
        wo3         = wo2 * wo;
        AQ2wo2      = AQ2 * wo2;
        w   = 2.0 * PI * f;
        w2  = w * w;
        Re  = A * (A * (wo4 + w2 * w2) + w2 * wo2AQ2_A2_1);
        Im  = ArAQ * (wo3 * w + wo * w2 * w);
        den = A * wo2 - w2;
        den = den * den;
        den = den + AQ2wo2 * w2;

        f = 20.0 * +log10(+sqrt( (Re * Re) + (Im * Im)) / den);

        //Force zero to avoid some drawing noise
        if (f > 0.1) return f;
        if (f < 0.1) return f;
        return 0.0;
    }
    function peak(f) {
        f = +f;
        var wo = 0.0, A = 0.0, A2 = 0.0, wo2 = 0.0, wo3 = 0.0, Q2 = 0.0, wo2Q2 = 0.0, gamma = 0.0,
            w = 0.0, w2 = 0.0, wo2w22 = 0.0, beta = 0.0, Re = 0.0, Im = 0.0, den = 0.0;
        wo    = 2.0 * PI * freq;
        A     = +pow(10.0, gain/40.0);
        A2    = A * A;
        wo2   = wo * wo;
        wo3   = wo2 * wo;
        Q2    = q*q;
        wo2Q2 = wo2 / Q2;
        gamma = (A2 - 1.0) / (A * q);
        w      = 2.0 * PI * f;
        w2     = w * w;

        wo2w22 = wo2 - w2;
        wo2w22 = wo2w22 * wo2w22;
        beta  = wo2Q2 * w2;

        Re     = wo2w22 + beta;
        Im     = gamma * ((wo3 * w) - (wo * w2 * w));
        den    = wo2w22 + (beta / A2);

        return 20.0 * +log10(+sqrt((Re * Re) + (Im * Im)) / den);
    }
    function notch(f) {
        f = +f;
        var wo = 0.0, wo2 = 0.0, wo4 = 0.0, Q2 = 0.0, doswo2 = 0.0, woQ = 0.0, wo2Q2 = 0.0, w = 0.0,
            w2 = 0.0, Re = 0.0, Im = 0.0, den = 0.0;
        wo = 2.0 * PI * freq;
        wo2 = wo * wo;
        wo4 = wo2 * wo2;
        Q2 = q * q;
        doswo2 = 2.0 * wo2;
        woQ = wo / q;
        wo2Q2 = wo2 / Q2;
        w   = 2.0 * PI * f;
        w2  = w * w;
        Re  = wo4 + w2 * w2 - doswo2 * w2;
        Im  = woQ * w * (w2 - wo2);
        den = wo2 - w2;
        den = den * den;
        den = den + wo2Q2 * w2;

        if (w >= wo) return -100.0;
        return 20.0 * +log10(+sqrt( (Re * Re) + (Im * Im)) / den);
    }

    return {
        lpf_order1:lpf_order1,
        lpf_order2:lpf_order2,
        lpf_order3:lpf_order3,
        lpf_order4:lpf_order4,
        hpf_order1:hpf_order1,
        hpf_order2:hpf_order2,
        hpf_order3:hpf_order3,
        hpf_order4:hpf_order4,
        low_shelf:low_shelf,
        high_shelf:high_shelf,
        peak:peak,
        notch:notch
    };
};

w.Filter = $class({
    _class: "Filter",
    Extends: BASE,
    Implements: [AudioMath],
    options: {
        type: _TOOLKIT_PARAMETRIC, // the type of the filter
        freq: 0,                   // the initial frequency
        gain: 0,                   // the initial gain of the filter
        q:    1                    // the initial q of the filter
    },

    initialize: function (options) {
        BASE.prototype.initialize.call(this);
        this.set_options(options);
        this.freq2gain = function(){};
    },
    initialized: function () {
        this.reset();
        this.fire_event("initialized");
    },
    reset: function () {
        var m = FilterModule(window, this.options);

        switch (this.options.type) {
            case _TOOLKIT_PARAM: this.freq2gain = m.peak; break;
            case _TOOLKIT_NOTCH: this.freq2gain = m.notch; break;
            case _TOOLKIT_LOSHELF: this.freq2gain = m.low_shelf; break;
            case _TOOLKIT_HISHELF: this.freq2gain = m.high_shelf; break;
            case _TOOLKIT_LP1: this.freq2gain = m.lpf_order1; break;
            case _TOOLKIT_LP2: this.freq2gain = m.lpf_order2; break;
            case _TOOLKIT_LP3: this.freq2gain = m.lpf_order3; break;
            case _TOOLKIT_LP4: this.freq2gain = m.lpf_order4; break;
            case _TOOLKIT_HP1: this.freq2gain = m.hpf_order1; break;
            case _TOOLKIT_HP2: this.freq2gain = m.hpf_order2; break;
            case _TOOLKIT_HP3: this.freq2gain = m.hpf_order3; break;
            case _TOOLKIT_HP4: this.freq2gain = m.hpf_order4; break;
            default: throw new Error("undefined type!\n");
        }
        this.fire_event("reset");
    },
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
        case "freq":
        case "type":
        case "q":
        case "gain":
            this.reset();
            break;
        }
        this.fire_event("set", key, value, hold);
        this.fire_event("set_" + key, value, hold);
    },
    get: function (key) {
        return this.options[key];
    }
});
})(this);
