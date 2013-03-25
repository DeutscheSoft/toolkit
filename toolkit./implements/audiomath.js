AudioMath = new Class({
    log10: function (n) {
        return Math.log(Math.max(1e-32, n)) / Math.LN10;
    },
    log2: function (n) {
        return Math.log(Math.max(1e-32, n)) / Math.LN2;
    },
    freq2px: function (freq, min, max, size) {
        // freq: frequency as float or int
        // min: minimum frequency already sent through log10
        // max: maximum frequency already sent through log10
        // size: the size in pixels
        return ((this.log10(freq + 1e-32) - min) / (max - min)) * size;
    },
    db2px: function (db, min, max, size) {
        // freq: dB as float (1 = 0dB)
        // min: minimum dB already sent through log2
        // max: maximum dB already sent through log2
        // size: the size in pixels
        return ((this.log2(db + 1e-32) - min) / (max - min)) * size;
    }
});
