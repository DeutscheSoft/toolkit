 /* toolkit. provides different widgets, implements and modules for
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

Filter = new Class({
    _class: "Filter",
    Implements: [AudioMath, Options, Events],
    options: {
        type: _TOOLKIT_PARAMETRIC, // the type of the filter
        freq: 0,                   // the initial frequency
        gain: 0,                   // the initial gain of the filter
        q:    1                    // the initial q of the filter
    },

    initialize: function (options) {
        this.setOptions(options);
        this.reset();
        this.fireEvent("initialized", this);
    },
    reset: function () {
        switch (this.options.type) {
            case _TOOLKIT_PARAM: this.freq2gain = this.gen_peak(); break;
            case _TOOLKIT_NOTCH: this.freq2gain = this.gen_notch(); break;
            case _TOOLKIT_LOSHELF: this.freq2gain = this.gen_low_shelf(); break;
            case _TOOLKIT_HISHELF: this.freq2gain = this.gen_high_shelf(); break;
            case _TOOLKIT_LP1: this.freq2gain = this.gen_lpf_order1(); break;
            case _TOOLKIT_LP2: this.freq2gain = this.gen_lpf_order2(); break;
            case _TOOLKIT_LP3: this.freq2gain = this.gen_lpf_order3(); break;
            case _TOOLKIT_LP4: this.freq2gain = this.gen_lpf_order4(); break;
            case _TOOLKIT_HP1: this.freq2gain = this.gen_hpf_order1(); break;
            case _TOOLKIT_HP2: this.freq2gain = this.gen_hpf_order2(); break;
            case _TOOLKIT_HP3: this.freq2gain = this.gen_hpf_order3(); break;
            case _TOOLKIT_HP4: this.freq2gain = this.gen_hpf_order4(); break;
            default: throw new Error("undefined type!\n");
        }
        this.fireEvent("reset");
    },

    gen_lpf_order1: function () {
        var wo  = 2 * Math.PI * this.options.freq;
        var wo2 = wo * wo;
        var Re2 = wo2 * wo2;

        return function (freq) {
            var w   = 2 * Math.PI * freq;
            var w2  = w * w;
            var Im  = -w * wo;
            var den = wo2 + w2;

            return 20 * Math.log10(
                Math.sqrt((Re2) + (Im * Im)) / den);
        };
    },

    gen_lpf_order2: function () {
        var wo   = 2 * Math.PI * this.options.freq;
        var wo2  = wo * wo;
        var wo4  = wo2 * wo2;
        var Q2   = this.options.q * this.options.q;
        var wo3Q = -(wo * wo2) / this.options.q;

        return function (freq) {
            var w      = 2 * Math.PI * freq;
            var w2     = w * w;
            var wo2w22 = wo2 - w2;
            var wo2w22 = wo2w22 * wo2w22;
            var betha  = wo2 * w2;
            var Re     = wo4 - betha;
            var Im     = wo3Q * w;
            var den    = wo2w22
                               + (betha / Q2);

            return 20 * Math.log10(Math.sqrt( (Re * Re) + (Im * Im)) / den);
        };
    },

    gen_lpf_order3: function () {
        var f1 = this.gen_lpf_order1();
        var f2 = this.gen_lpf_order2();
        return function (freq) {
            return f1(freq) + f2(freq);
        };
    },

    gen_lpf_order4: function () {
        var f2 = this.gen_lpf_order2();
        return function (freq) {
            return 2 * f2(freq);
        };
    },

    gen_hpf_order1: function () {
        var wo  = 2 * Math.PI * this.options.freq;
        var wo2 = wo * wo;

        return function(freq) {
            var w   = 2 * Math.PI * freq;
            var w2  = w * w;
            var Im  = w * wo;
            var den = wo2 + w2;

            return 20 * Math.log10(Math.sqrt( (w2 * w2) +(Im * Im)) / den);
        };
    },

    gen_hpf_order2: function () {
        var wo  = 2 * Math.PI * this.options.freq;
        var wo2 = wo * wo;
        var Q2  = this.options.q * this.options.q;
        var woQ = wo / this.options.q;

        return function(freq) {
            var w      = 2 * Math.PI * freq;
            var w2     = w * w;
            var wo2w22 = wo2 - w2;
            var wo2w22 = wo2w22 * wo2w22;
            var betha  = wo2 * w2;
            var Re     = (w2 * w2) - betha;
            var Im     = woQ * w * w2;
            var den    = wo2w22 + (betha / Q2);

            return 20 * Math.log10(Math.sqrt( (Re * Re) +(Im * Im)) / den);
        };
    },

    gen_hpf_order3: function () {
        var f1 = this.gen_hpf_order1();
        var f2 = this.gen_hpf_order2();

        return function(freq) {
            return f1(freq) + f2(freq);
        };
    },

    gen_hpf_order4: function (freq) {
        var f2 = this.gen_hpf_order2();
        return function (freq) {
            return 2 * f2(freq);
        };
    },

    gen_low_shelf: function () {
        var wo          = 2 * Math.PI * this.options.freq;
        var A           = Math.pow(10,((this.options.gain) / 40));
        var wo2         = wo * wo;
        var wo4         = wo2 * wo2;
        var Q2          = this.options.q * this.options.q;
        var A2          = A * A;
        var AQ2         = A / Q2;
        var wo2AQ2_A2_1 = (AQ2 - A2 - 1) * wo2;
        var ArAQ        = (1 - A) * ((A * Math.sqrt(A)) / this.options.q);
        var wo3         = wo2 * wo;
        var AQ2wo2      = AQ2 * wo2;
        return function (freq) {
            var w   = 2 * Math.PI * freq;
            var w2  = w * w;
            var Re  = A * (A * (wo4 + w2 * w2) + w2 * wo2AQ2_A2_1);
            var Im  = ArAQ * (wo3 * w + wo * w2 * w);
            var den = wo2 - A * w2;
            var den = den * den;
            var den = den + AQ2wo2 * w2;

            var r = 20 * Math.log10(Math.sqrt( (Re * Re) + (Im * Im)) / den);

            //Force zero to avoid some drawing noise
            if (r < 0.1 && r > -0.1) {
                return 0.0;
            }
            return r;
        };
    },

    gen_high_shelf: function () {
        var wo          = 2 * Math.PI * this.options.freq;
        var A           = Math.pow(10, ((this.options.gain) / 40));
        var wo2         = wo * wo;
        var wo4         = wo2 * wo2;
        var Q2          = this.options.q * this.options.q;
        var A2          = A * A;
        var AQ2         = A / Q2;
        var wo2AQ2_A2_1 = (AQ2 - A2-1) * wo2;
        var ArAQ        = (1 - A) * ((A * Math.sqrt(A)) / this.options.q);
        var wo3         = wo2 * wo;
        var AQ2wo2      = AQ2 * wo2;
        return function (freq) {
            var w   = 2 * Math.PI * freq;
            var w2  = w * w;
            var Re  = A * (A * (wo4 + w2 * w2) + w2 * wo2AQ2_A2_1);
            var Im  = ArAQ * (wo3 * w + wo * w2 * w);
            var den = A * wo2 - w2;
            var den = den * den;
            var den = den + AQ2wo2 * w2;

            var r =  20 * Math.log10(Math.sqrt( (Re * Re) + (Im * Im)) / den);

            //Force zero to avoid some drawing noise
            if (r < 0.1 && r > -0.1) {
                return 0.0;
            }
            return r;
        };
    },

    gen_peak: function () {
        var wo    = 2 * Math.PI * this.options.freq;
        var A     = Math.pow(10, ((this.options.gain) / 40));
        var A2    = A * A;
        var wo2   = wo * wo;
        var wo3   = wo2 * wo;
        var Q2    = this.options.q * this.options.q;
        var wo2Q2 = wo2 / Q2;
        var gamma = (A2 - 1) / (A * this.options.q);

        return function (freq) {
            var w      = 2 * Math.PI * freq;
            var w2     = w * w;

            var wo2w22 = wo2 - w2;
            var wo2w22 = wo2w22 * wo2w22;
            var betha  = wo2Q2 * w2;

            var Re     = wo2w22 + betha;
            var Im     = gamma * ((wo3 * w) - (wo * w2 * w));
            var den    = wo2w22 + (betha / A2);

            return 20 * Math.log10(Math.sqrt((Re * Re) + (Im * Im)) / den);
        };
    },

    gen_notch: function (freq) {
        var wo = 2 * Math.PI * this.options.freq;
        var wo2 = wo * wo;
        var wo4 = wo2 * wo2;
        var Q2 = this.options.q * this.options.q;
        var doswo2 = 2 * wo2;
        var woQ = wo / this.options.q;
        var wo2Q2 = wo2 / Q2;
        return function(freq) {
            var w   = 2 * Math.PI * freq;
            var w2  = w * w;
            var Re  = wo4 + w2 * w2 - doswo2 * w2;
            var Im  = woQ * w * (w2 - wo2);
            var den = wo2 - w2;
            var den = den * den;
            var den = den + wo2Q2 * w2;

            if (w >= wo) {
                return -100.0;
            } else {
                return 20 * Math.log10(Math.sqrt( (Re * Re)
                      + (Im * Im)) / den);
            }
        };
        /*
         REMEBER because of this IsCenterFreq
        if ( w >= wo && !bIsCenterFreq)
        {
          band_y[bd_ix][i] = -100.0;
          bIsCenterFreq = true;
        }
        else
        {
          band_y[bd_ix][i]=(double)20*log10(sqrt((Re*Re)+(Im*Im))/den);
        }
        */
    },
    set: function (key, value, hold) {
        this.options[key] = value;
        if (!hold) {
            this.reset();
        }
        this.fireEvent("set", [key, value, hold, this]);
        this.fireEvent("set_" + key, [value, hold, this]);
    },
    get: function (key) {
        this.fireEvent("get", [key, this.options[key], this]);
        return this.options[key];
    }
});
