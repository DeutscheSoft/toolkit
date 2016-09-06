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
(function(w){
var notes = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ];
w.TK.Notes = w.Notes = $class({
    /**
     * Notes converts between frequencies, midi notes
     * and note names.
     *
     * @mixin Notes
     */
    _class: "Notes",
    midi2note: function (num) {
        return notes[num % 12] + parseInt(num / 12);
    },
    midi2freq: function (num, base) {
        if (!base) base = 440;
        return Math.pow(2, (num - 69) / 12) * base;
    },
    freq2midi: function (freq, base) {
        if (!base) base = 440;
        var f2 = Math.log2(freq / base);
        return Math.max(0, Math.round(12 * f2 + 69));
    },
    freq2cents: function (freq, base) {
        if (!base) base = 440;
        var f2 = Math.log2(freq / base);
        f2 *= 1200;
        f2 %= 100;
        return (f2 < -50) ? 100 + f2 : (f2 > 50) ? -(100 - f2) : f2;
    },
    freq2note: function (freq, base) {
        if (!base) base = 440;
        return this.midi2note(this.freq2midi(freq, base));
    }
});
})(this);
