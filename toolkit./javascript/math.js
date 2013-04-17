Math.log2 = function (n) {
    return Math.log(Math.max(1e-32, n)) / Math.LN2;
}
Math.log10 = function (n) {
    return Math.log(Math.max(1e-32, n)) / Math.LN10;
}