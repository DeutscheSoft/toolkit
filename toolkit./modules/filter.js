Filter = new Class({
    Implements: [AudioMath, Options, Events],
    options: {
        type: _TOOLKIT_PARAMETRIC, // the type of the filter
        freq: 0,                   // the initial frequency
        gain: 0,                   // the initial gain of the filter
        q: 0                       // the initial q of the filter
    },
    
    _flpf1:  { init: false },
    _flpf2:  { init: false },
    _fhpf1:  { init: false },
    _fhpf2:  { init: false },
    _flosh:  { init: false },
    _fhish:  { init: false },
    _fpeak:  { init: false },
    _fnotch: { init: false },
    
    initialize: function (options) {
        this.setOptions(options);
        this.fireEvent("initialized", this);
    },
    reset: function () {
        this._flpf1.init  = false;
        this._flpf2.init  = false;
        this._fhpf1.init  = false;
        this._fhpf2.init  = false;
        this._flosh.init  = false;
        this._fhish.init  = false;
        this._fpeak.init  = false;
        this._fnotch.init = false;
        this.fireEvent("reset");
    },
    
    freq2gain: function (freq) {
        switch (this.options.type) {
            case _TOOLKIT_PARAM:
                return this.peak(freq);
            case _TOOLKIT:
                return this.notch(freq);
            case _TOOLKIT:
                return this.low_shelf(freq);
            case _TOOLKIT:
                return this.high_shelf(freq);
            case _TOOLKIT:
                return this.lpf_order1(freq);
            case _TOOLKIT:
                return this.lpf_order2(freq);
            case _TOOLKIT:
                return this.lpf_order3(freq);
            case _TOOLKIT:
                return this.lpf_order4(freq);
            case _TOOLKIT:
                return this.hpf_order1(freq);
            case _TOOLKIT:
                return this.hpf_order2(freq);
            case _TOOLKIT:
                return this.hpf_order3(freq);
            case _TOOLKIT:
                return this.hpf_order4(freq);
        }
    },
    
    lpf_order1: function (freq) {
        if (!this._flpf1.init) {
            this._flpf1.wo  = 2 * Math.PI * this.options.freq;
            this._flpf1.wo2 = this._flpf1.wo * this._flpf1.wo;
            this._flpf1.Re2 = this._flpf1.wo2 * this._flpf1.wo2;
        }
        this._flpf1.w   = 2 * Math.PI * freq; 
        this._flpf1.w2  = this._flpf1.w * this._flpf1.w;
        this._flpf1.Im  = -this._flpf1.w * this._flpf1.wo;
        this._flpf1.den = this._flpf1.wo2 + this._flpf1.w2;

        return 20 * Math.log10(
            Math.sqrt((this._flpf1.Re2) + (this._flpf1.Im * this._flpf1.Im))
          / this._flpf1.den);
    },
 
    lpf_order2: function (freq) {
        if (!this._flpf2.init) {
            this._flpf2.wo   = 2 * Math.PI * this.options.freq;
            this._flpf2.wo2  = this._flpf2.wo * this._flpf2.wo;
            this._flpf2.wo4  = this._flpf2.wo2 * this._flpf2.wo2;
            this._flpf2.Q2   = this.options.q * this.options.q;
            this._flpf2.wo3Q = -(this._flpf2.wo * this._flpf2.wo2)
                               / this.options.q;
        }
        this._flpf2.w      = 2 * Math.PI * freq; 
        this._flpf2.w2     = this._flpf2.w * this._flpf2.w;
        this._flpf2.wo2w22 = this._flpf2.wo2 - this._flpf2.w2;
        this._flpf2.wo2w22 = this._flpf2.wo2w22 * this._flpf2.wo2w22;
        this._flpf2.betha  = this._flpf2.wo2 * this._flpf2.w2;
        this._flpf2.Re     = this._flpf2.wo4 - this._flpf2.betha;
        this._flpf2.Im     = this._flpf2.wo3Q * this._flpf2.w;
        this._flpf2.den    = this._flpf2.wo2w22
                           + (this._flpf2.betha / this._flpf2.Q2);

        return 20 * Math.log10(Math.sqrt(
            (this._flpf2.Re * this._flpf2.Re)
          + (this._flpf2.Im * this._flpf2.Im)) / this._flpf2.den);
    },
 
    lpf_order3: function (freq) {
        return this.lpf_order1(freq) + this.lpf_order2(freq)
    },
 
    lpf_order4: function (freq) {
        return this.lpf_order2(freq) * 2;
    },
 
    hpf_order1: function (freq) {
        if (!this._fhpf1.init) {
            this._fhpf1.wo  = 2 * Math.PI * this.options.freq;
            this._fhpf1.wo2 = this._fhpf1.wo * this._fhpf1.wo;
        }
        this._fhpf1.w   = 2 * Math.PI * freq; 
        this._fhpf1.w2  = this._fhpf1.w * this._fhpf1.w;
        this._fhpf1.Im  = this._fhpf1.w * this._fhpf1.wo;
        this._fhpf1.den = this._fhpf1.wo2 + this._fhpf1.w2;

        return 20 * Math.log10(Math.sqrt(
            (this._fhpf1.w2 * this._fhpf1.w2)
           +(this._fhpf1.Im * this._fhpf1.Im)) / this._fhpf1.den);
    },
 
    hpf_order2: function (freq) {
        if (!this._fhpf2.init) {
            this._fhpf2.wo  = 2 * Math.PI * freq;
            this._fhpf2.wo2 = this._fhpf2.wo * this._fhpf2.wo;
            this._fhpf2.Q2  = this.options.q * this.options.q;
            this._fhpf2.woQ = this._fhpf2.wo / this.options.q;
        }
        this._fhpf2.w      = 2 * Math.PI * freq; 
        this._fhpf2.w2     = this._fhpf2.w * this._fhpf2.w;
        this._fhpf2.wo2w22 = this._fhpf2.wo2 - this._fhpf2.w2;
        this._fhpf2.wo2w22 = this._fhpf2.wo2w22 * this._fhpf2.wo2w22;
        this._fhpf2.betha  = this._fhpf2.wo2 * this._fhpf2.w2;
        this._fhpf2.Re     = (this._fhpf2.w2 * this._fhpf2.w2)
                           - this._fhpf2.betha;
        this._fhpf2.Im     = this._fhpf2.woQ * this._fhpf2.w * this._fhpf2.w2;
        this._fhpf2.den    = this._fhpf2.wo2w22
                           + (this._fhpf2.betha / this._fhpf2.Q2);

        return 20 * Math.log10(Math.sqrt(
            (this._fhpf2.Re * this._fhpf2.Re)
           +(this._fhpf2.Im * this._fhpf2.Im)) / this._fhpf2.den);
    },

    hpf_order3: function (freq) {
        return this.hpf_order1(freq) + this.hpf_order2(freq)
    },
 
    hpf_order4: function (freq) {
        return this.hpf_order2(freq) * 2;
    },
 
    low_shelf: function (freq) {
        if (!this._flosh.init) {
            this._flosh.wo          = 2 * Math.PI * this.options.freq;
            this._flosh.A           = Math.pow(10,((this.options.gain) / 40));
            this._flosh.wo2         = this._flosh.wo * this._flosh.wo;
            this._flosh.wo4         = this._flosh.wo2 * this._flosh.wo2;
            this._flosh.Q2          = tihs.options.q * this.options.q;
            this._flosh.A2          = this._flosh.A * this._flosh.A;
            this._flosh.AQ2         = this._flosh.A / Q2;
            this._flosh.wo2AQ2_A2_1 = (this._flosh.AQ2 - this._flosh.A2 - 1)
                                    * this._flosh.wo2;
            this._flosh.ArAQ        = (1 - this._flosh.A)
                                    * ((this._flosh.A * Math.sqrt(this._flosh.A))
                                    / this.options.q);
            this._flosh.wo3         = this._flosh.wo2 * this._flosh.wo;
            this._flosh.AQ2wo2      = this._flosh.AQ2 * this._flosh.wo2;
        }
        this._flosh.w   = 2 * Math.PI * freq; 
        this._flosh.w2  = this._flosh.w * this._flosh.w;
        this._flosh.Re  = this._flosh.A * (this._flosh.A
                        * (this._flosh.wo4 + this._flosh.w2 * this._flosh.w2)
                        + this._flosh.w2 * this._flosh.wo2AQ2_A2_1);
        this._flosh.Im  = this._flosh.ArAQ * (this._flosh.wo3 * this._flosh.w 
                        + this._flosh.wo * this._flosh.w2 * this._flosh.w);
        this._flosh.den = this._flosh.wo2 - this._flosh.A * this._flosh.w2;
        this._flosh.den = this._flosh.den * this._flosh.den;
        this._flosh.den = this._flosh.den + this._flosh.AQ2wo2 * this._flosh.w2;

        var r = 20 * Math.log10(Math.sqrt(
            (this._flosh.Re * this._flosh.Re)
          + (this._flosh.Im * this._flosh.Im)) / this._flosh.den);

        //Force zero to avoid some drawing noise
        if (r < 0.1 && r > -0.1) {
            return 0.0;
        }
        return r;
    },
 
    high_shelf: function (freq) {
        if (!this._fhish.init) {
            this._fhish.wo          = 2 * Math.PI * this.options.freq; 
            this._fhish.A           = Math.pow(10, ((this.options.gain) / 40));
            this._fhish.wo2         = this._fhish.wo * this._fhish.wo;
            this._fhish.wo4         = this._fhish.wo2 * this._fhish.wo2;
            this._fhish.Q2          = this.options.q * this.options.q;
            this._fhish.A2          = this._fhish.A * this._fhish.A;
            this._fhish.AQ2         = this._fhish.A / this._fhish.Q2;
            this._fhish.wo2AQ2_A2_1 = (this._fhish.AQ2 - this._fhish.A2-1)
                                    * this._fhish.wo2;
            this._fhish.ArAQ        = (1 - this._fhish.A)
                                    * ((this._fhish.A * Math.sqrt(this._fhish.A))
                                    / this.options.q);
            this._fhish.wo3         = this._fhish.wo2 * this._fhish.wo;
            this._fhish.AQ2wo2      = this._fhish.AQ2 * this._fhish.wo2;
        }
        this._fhish.w   = 2*Math.PI*f[i]; 
        this._fhish.w2  = this._fhish.w * this._fhish.w;
        this._fhish.Re  = this._fhish.A * (this._fhish.A
                        * (this._fhish.wo4 + this._fhish.w2 * this._fhish.w2)
                        + this._fhish.w2 * this._fhish.wo2AQ2_A2_1);
        this._fhish.Im  = this._fhish.ArAQ * (this._fhish.wo3
                        * this._fhish.w + this._fhish.wo
                        * this._fhish.w2 * this._fhish.w);
        this._fhish.den = this._fhish.A * this._fhish.wo2 - this._fhish.w2;
        this._fhish.den = this._fhish.den * this._fhish.den;
        this._fhish.den = this._fhish.den + this._fhish.AQ2wo2 * this._fhish.w2;
        
        var r =  20 * Math.log10(Math.sqrt(
            (this._fhish.Re * this._fhish.Re)
          + (this._fhish.Im * this._fhish.Im)) / this._fhish.den);

        //Force zero to avoid some drawing noise
        if (r < 0.1 && r > -0.1) {
            return 0.0;
        }
        return r;
    },
 
    peak: function (freq) {
        if (!this._fnotch.init) {
            this._fnotch.wo    = 2 * Math.PI * this.options.freq; 
            this._fnotch.A     = Math.pow(10, ((this.options.gain) / 40));
            this._fnotch.A2    = this._fnotch.A * this._fnotch.A;
            this._fnotch.wo2   = this._fnotch.wo * this._fnotch.wo;
            this._fnotch.wo3   = this._fnotch.wo2 * this._fnotch.wo;
            this._fnotch.Q2    = this.options.q * this.options.q;
            this._fnotch.wo2Q2 = this._fnotch.wo2 / this._fnotch.Q2;
            this._fnotch.gamma = (this._fnotch.A2 - 1)
                               / (this._fnotch.A * this.options.q);
        }
        this._fpeak.w      = 2 * Math.PI * freq; 
        this._fpeak.w2     = this._fpeak.w * this._fpeak.w;

        this._fpeak.wo2w22 = this._fpeak.wo2 - this._fpeak.w2;
        this._fpeak.wo2w22 = this._fpeak.wo2w22 * this._fpeak.wo2w22;
        this._fpeak.betha  = this._fpeak.wo2Q2 * this._fpeak.w2;

        this._fpeak.Re     = this._fpeak.wo2w22 + this._fpeak.betha;
        this._fpeak.Im     = this._fpeak.gamma
                           * ((this._fpeak.wo3 * this._fpeak.w)
                           - (this._fpeak.wo * this._fpeak.w2 * this._fpeak.w));
        this._fpeak.den    = this._fpeak.wo2w22
                           + (this._fpeak.betha / this._fpeak.A2);

        return 20 * Math.log10(Math.sqrt((this._fpeak.Re * this._fpeak.Re)
                  + (this._fpeak.Im * this._fpeak.Im)) / this._fpeak.den);
    },
 
    notch: function (freq) {
        if (!this._fnotch.init) {
            this._fnotch.wo = 2 * Math.PI * this.options.freq;
            this._fnotch.wo2 = this._fnotch.wo * this._fnotch.wo;
            this._fnotch.wo4 = this._fnotch.wo2 * this._fnotch.wo2;
            this._fnotch.Q2 = this.options.q * this.options.q;
            this._fnotch.doswo2 = 2 * this._fnotch.wo2;
            this._fnotch.woQ = this._fnotch.wo / this.options.q;
            this._fnotch.wo2Q2 = this._fnotch.wo2 / this._fnotch.Q2;
        }
        this._fnotch.w   = 2 * Math.PI * freq; 
        this._fnotch.w2  = this._fnotch.w * this._fnotch.w;
        this._fnotch.Re  = this._fnotch.wo4 + this._fnotch.w2 * this._fnotch.w2
                         - this._fnotch.doswo2 * this._fnotch.w2;
        this._fnotch.Im  = this._fnotch.woQ * this._fnotch.w
                         * (this._fnotch.w2 - this._fnotch.wo2);
        this._fnotch.den = this._fnotch.wo2 - this._fnotch.w2;
        this._fnotch.den = this._fnotch.den * this._fnotch.den;
        this._fnotch.den = this._fnotch.den + this._fnotch.wo2Q2
                         * this._fnotch.w2;

        if (this._fnotch.w >= this._fnotch.wo) {
            return -100.0;
        } else {
            return 20 * Math.log10(Math.sqrt(
                (this._fnotch.Re * this._fnotch.Re)
              + (this._fnotch.Im * this._fnotch.Im)) / this._fnotch.den);
        }
        /*
         REMEBER because of this IsCenterFreq
        if( w >= wo && !bIsCenterFreq)
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
        if(!hold) {
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
