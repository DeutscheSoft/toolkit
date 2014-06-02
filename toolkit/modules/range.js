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
 
Range = new Class({
    // Ranges are classes for calculating linear scales from different values.
    // They are useful to build coordinate systems, calculating pixel positions
    // for different scale types and the like. Ranges are used e.g. in Scale,
    // MeterBase and Graph to draw elements on a certain position according to
    // a value on an arbitrary scale. Range implements AudioMath, Options and
    // Events.
    _class: "Range",
    Implements: [Options, Events, Ranged],
    options: {
        scale:      _TOOLKIT_LINEAR, // What kind of value are we having?
                                     // _TOOLKIT_LINEAR
                                     // _TOOLKIT_DECIBEL / _TOOLKIT_LOG2
                                     // _TOOLKIT_FREQUENCY / _TOOLKIT_LOG10
                                     // function (value, options, coef) {}
                                     // 
                                     // If a function instead of a constant
                                     // is handed over, it receives the
                                     // actual options object as the second
                                     // argument and is supposed to return a
                                     // coefficient between 0 and 1. If the
                                     // third argument "coef" is true, it is
                                     // supposed to return a value depending
                                     // on a coefficient handed over as the 
                                     // first argument.
        reverse:    false,           // true if the range is reversed
        basis:      0,               // Dimensions of the range, set to
                                     // width/height in pixels, if you need
                                     // it for drawing purposes, to 100 if
                                     // you need percentual values or to 1
                                     // if you just need a linear
                                     // coefficient for a e.g. logarithmic
                                     // scale.
        min:        0,               // Minimum value of the range
        max:        0,               // Maximum value of the range
        step:       0,               // Step size, needed for e.g. user
                                     // interaction
        shift_up:   4,               // Multiplier for e.g. SHIFT pressed
                                     // while stepping
        shift_down: 0.25,            // Multiplier for e.g. SHIFT + CONTROL
                                     // pressed while stepping
        snap:       0,               // Snap the value to a virtual grid
                                     // with this distance
                                     // Using snap option with float values
                                     // causes the range to reduce its
                                     // minimum and maximum values depending
                                     // on the amount of decimal digits
                                     // because of the implementation of
                                     // math in JavaScript.
                                     // Using a step size of e.g. 1.125
                                     // reduces the maximum usable value
                                     // from 9,007,199,254,740,992 to
                                     // 9,007,199,254,740.992 (note the
                                     // decimal point)
        round:      false            // if snap is set decide how to jump
                                     // between snaps. Setting this to true
                                     // slips to the next snap if the value
                                     // is more than on its half way to it.
                                     // Otherwise the value has to reach the
                                     // next snap until it is hold there
                                     // again.
    },
    
    initialize: function (options, hold) {
        this.setOptions(options);
        this.fire_event("initialize", this);
        this.fire_event("initialized", this);
        return this;
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            
        }
        this.fire_event("set", [key, value, hold, this]);
        this.fire_event("set_" + key, [value, hold, this]);
        return this;
    },
    get: function (key) {
        this.fire_event("get", [key, this.options[key], this]);
        return this.options[key];
    }
});
