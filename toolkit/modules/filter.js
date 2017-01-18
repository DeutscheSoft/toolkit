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

function BiquadModule(stdlib, foreign) {
    "use asm";

    var a0 = +foreign.a0;
    var a1 = +foreign.a1;
    var a2 = +foreign.a2;
    var b0 = +foreign.b0;
    var b1 = +foreign.b1;
    var b2 = +foreign.b2;
    var sample_rate = +foreign.sample_rate;
    var log = stdlib.Math.log;
    var sin = stdlib.Math.sin;
    var LN10 = stdlib.Math.LN10;
    var PI = stdlib.Math.PI;

    var Ra = (a0 + a1 + a2) * (a0 + a1 + a2) / 4;
    var Rb = (b0 + b1 + b2) * (b0 + b1 + b2) / 4;
    var Xa = 4 * a0 * a2;
    var Ya = a1 * (a0 + a2);
    var Xb = 4 * b0 * b2;
    var Yb = b1 * (b0 + b2);

    function log10(v) {
        v = +v;
        return +log(v) / LN10;
    }

    function freq2gain(f) {
        f = +f;
        var w = PI * f / sample_rate;
        var S = +sin(w)
        S *= S;
        return 10 * ( log10(Rb - S * (Xb * (1 - S) + Yb)) 
                    - log10(Ra - S * (Xa * (1 - S) + Ya)) );
    }

    return { freq2gain: freq2gain };
}

function BiquadFilter1(trafo) {
    function factory(stdlib, O) {
        return BiquadModule(stdlib, trafo(O));
    }

    return factory;
}

function BiquadFilterN(trafos) {
    function factory(stdlib, O) {
        var A = new Array(trafos.length);
        var i;

        for (i = 0; i < trafos.length; i ++) {
            A[i] = BiquadModule(stdlib, trafos[i](O)).freq2gain;
        }

        return {
            freq2gain: function(f) {
                var ret = 0.0;
                var i;

                for (i = 0; i < A.length; i++) {
                    ret += A[i](f);
                }

                return ret;
            }
        };
    }

    return factory;
}

function BiquadFilter() {
    if (arguments.length === 1) return BiquadFilter1(arguments[0]);

    return BiquadFilterN.call(this, Array.prototype.slice.call(arguments));
}

TK.BiquadFilter = BiquadFilter;

function reset() {
    this.freq2gain = null;
    /**
     * Is fired when a filters drawing function is reset.
     * 
     * @event TK.Filter#reset
     */
    this.fire_event("reset");
}

TK.Filter = TK.class({
    /**
     * TK.Filter provides the math for calculating a gain from
     * a given frequency for different types of biquad filters.
     *
     * @param {Object} options
     * 
     * @property {integer} [options.type="parametric"] - The type of the filter,  "parametric"|"notch"|"low-shelf"|"high-shelf"|"lowpass"+[n]|"highpass"+[n].
     * @property {number} [options.freq=0] - The initial frequency.
     * @property {number} [options.gain=0] - The initial gain.
     * @property {number} [options.q=1] - The initial Q of the filter.
     *
     * @mixin TK.Filter
     * 
     * @extends TK.Base
     * 
     * @mixes TK.AudioMath
     * @mixes TK.Notes
     */
     
     /**
      * Returns the gain for a given frequency
      * 
      * @method TK.Filter#freq2gain
      * 
      * @param {number} frequency - The frequency to calculate the gain for.
      * 
      * @returns {number} gain - The gain at the given frequency.
      */ 
    _class: "Filter",
    Extends: TK.Base,
    _options: {
        type: "mixed",
        freq: "number",
        gain: "number",
        q: "number",
    },
    options: {
        type: "parametric",
        freq: 0,
        gain: 0,
        q:    1
    },
    static_events: {
        set_freq: reset,
        set_type: reset,
        set_q: reset,
        set_gain: reset,
        initialized: reset,
    },
    create_freq2gain: function() {
        var O = this.options;
        var m;

        if (typeof(O.type) === "string") {
            m = FilterModule(window, O);

            switch (this.options.type) {
                case "parametric": this.freq2gain = m.peak; break;
                case "notch": this.freq2gain = m.notch; break;
                case "low-shelf": this.freq2gain = m.low_shelf; break;
                case "high-shelf": this.freq2gain = m.high_shelf; break;
                case "lowpass1": this.freq2gain = m.lpf_order1; break;
                case "lowpass2": this.freq2gain = m.lpf_order2; break;
                case "lowpass3": this.freq2gain = m.lpf_order3; break;
                case "lowpass4": this.freq2gain = m.lpf_order4; break;
                case "highpass1": this.freq2gain = m.hpf_order1; break;
                case "highpass2": this.freq2gain = m.hpf_order2; break;
                case "highpass3": this.freq2gain = m.hpf_order3; break;
                case "highpass4": this.freq2gain = m.hpf_order4; break;
                default: throw new Error("undefined type!\n");
            }
        } else if (typeof(O.type) === "function") {
            m = O.type(window, O);

            this.freq2gain = m.freq2gain;
        } else {
            TK.error("Unsupported option 'type'.");
        }
        /**
         * Is fired when a filters drawing function is reset.
         * 
         * @event TK.Filter#reset
         */
        this.fire_event("reset");
    },
    get_freq2gain: function() {
        if (this.freq2gain === null) this.create_freq2gain();
        return this.freq2gain;
    },
    reset: reset,
});
})(this, this.TK);
