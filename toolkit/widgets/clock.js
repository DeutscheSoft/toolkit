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
function draw_time(force) {
    var tmp, drawn;
    var O = this.options;
    var t = O.time;

    if ((tmp = t.getSeconds()) != this.__sec || force) {
        this.circulars.seconds.set("value", tmp);
        this.__sec = tmp;
    }
    if ((tmp = t.getMinutes()) != this.__min || force) {
        this.circulars.minutes.set("value", tmp);
        this.__min = tmp;
    }
    if ((tmp = t.getHours() % 12) != this.__hour || force) {
        this.circulars.hours.set("value", tmp);
        this.__hour = tmp;
    }
    
    var args = [t,
                t.getFullYear(),
                t.getMonth(),
                t.getDate(),
                t.getDay(),
                t.getHours(),
                t.getMinutes(),
                t.getSeconds(),
                t.getMilliseconds(),
                Math.round(t.getMilliseconds() / (1000 / O.fps)),
                O.months,
                O.days];
    if ((tmp = O.label.apply(this, args)) != this.__label || force) {
        TK.set_text(this._label, tmp);
        this.__label = tmp;
        drawn = true;
    }
    if ((tmp = O.label_upper.apply(this, args)) != this.__upper || force) {
        TK.set_text(this._label_upper, tmp);
        this.__upper = tmp;
        drawn = true;
    }
    if ((tmp = O.label_lower.apply(this, args)) != this.__lower || force) {
        TK.set_text(this._label_lower, tmp);
        this.__lower = tmp;
        drawn = true;
    }
    
    if (drawn)
        this.fire_event("timedrawn", O.time);
}
function set_labels() {
    var O = this.options;
    var E = this._label;
    var s = O.label(new Date(2000, 8, 30, 24, 59, 59, 999), 2000, 8,
                                               30, 6, 24, 59, 59, 999, 999,
                                               O.months, O.days);
    TK.set_text(E, s);
    
    E.setAttribute("transform", "");

    /* FORCE_RELAYOUT */
    
    TK.S.add(function() {
        var bb = E.getBoundingClientRect();
        if (bb.width === 0) return; // we are hidden
        var mleft   = parseInt(TK.get_style(E, "margin-left")) || 0;
        var mright  = parseInt(TK.get_style(E, "margin-right")) || 0;
        var mtop    = parseInt(TK.get_style(E, "margin-top")) || 0;
        var mbottom = parseInt(TK.get_style(E, "margin-bottom")) || 0;
        var space   = O.size - mleft - mright - this._margin * 2;
        var scale   = space / bb.width;
        var pos     = O.size / 2;
        
        TK.S.add(function() {
            E.setAttribute("transform", "translate(" + pos + "," + pos + ") "
                + "scale(" + scale + ")");

            /* FORCE_RELAYOUT */
            
            TK.S.add(function() {
                bb = E.getBoundingClientRect();
                
                TK.S.add(function() {
                    this._label_upper.setAttribute("transform", "translate(" + pos + "," + (pos - bb.height / 2 - mtop) + ") "
                        + "scale(" + (scale * O.label_scale) + ")");
                    this._label_lower.setAttribute("transform", "translate(" + pos + "," + (pos + bb.height / 2 + mtop) + ") "
                        + "scale(" + (scale * O.label_scale) + ")");
                    draw_time.call(this, true);
                }.bind(this));
            }.bind(this), 1);
        }.bind(this));
    }.bind(this), 1);
}
function timeout() {
    if (this.__to)
        window.clearTimeout(this.__to);
    var O = this.options;
    if (!O) return;
    if (O.timeout) {
        var d = O.time;
        var ts = +Date.now();

        if (O.offset) {
            ts += (O.offset|0);
        }

        d.setTime(ts);
        this.set("time", d);
            
        var targ = (O.timeout|0);
        if (O.timeadd) {
            targ += (O.timeadd|0) - ((ts % 1000)|0)
        }
        this.__to = w.setTimeout(this.__timeout, targ);
    } else this.__to = false;
}
function onhide() {
    if (this.__to) {
        window.clearTimeout(this.__to);
        this.__to = false;
    }
}

w.TK.Clock = w.Clock = $class({
    /* @class: Clock
     * @description: Clock shows a customized clock with circulars displaying hours, minutes
     * and seconds. It has three free formatable labels.
     */
    _class: "Clock",
    Extends: Widget,
    _options: Object.assign(Object.create(Widget.prototype._options), {
        thickness:    "int",
        margin:       "int",
        size:         "int",
        show_seconds: "boolean",
        show_minutes: "boolean",
        show_hours:   "boolean",
        timeout:      "int",
        timeadd:      "int",
        offset:       "int",
        fps:          "int",
        months:       "array",
        days:         "array",
        label:        "function",
        label_upper:  "function",
        label_lower:  "function",
        label_scale:  "number",
    }),
    options: {
        thickness:    10,         // thickness of the rings
        margin:       0,          // margin between the circulars
        size:         200,        // diameter of the whole clock
        show_seconds: true,       // show the seconds ring
        show_minutes: true,       // show the minutes ring
        show_hours:   true,       // show the hours ring
        timeout:      1000,          // set a timeout to update the clock with the
                                  // system clock regulary
        timeadd:      10,          // set additional milliseconds for the
                                  // timeout target
                                  // system clock regulary
        offset:       0,          // if a timeout is set offset the system time
                                  // in milliseconds
        fps:          25,         // framerate for calculatind SMTP frames
        months:       ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        days:         ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        label: function (_date, year, month, date, day, hour, minute, second, millisecond, frame, months, days) {
            return ((hour < 10) ? ("0" + hour) : hour) + ":" +
                   ((minute < 10) ? ("0" + minute) : minute) + ":" +
                   ((second < 10) ? ("0" + second) : second);
        },
        label_upper: function (_date, year, month, date, day, hour, minute, second, millisecond, frame, months, days) {
            return days[day];
        },
        label_lower: function (_date, year, month, date, day, hour, minute, second, millisecond, frame, months, days) {
            return ((date < 10) ? ("0" + date) : date) + ". " + months[month] + " " + year;
        },
        label_scale: 0.33           // the scale of the upper and lower labels
                                   // compared to the main label
    },
    initialize: function (options) {
        var E;
        this.circulars = {};
        this._margin = -1;
        Widget.prototype.initialize.call(this, options);
        this.options.time = new Date();
        E = TK.make_svg("svg", {"class": "toolkit-clock"});
        this.element = this.widgetize(E, true, true, true);
        
        this.set("container", this.options.container);
        
        this._label       = TK.make_svg("text", {
            "class":       "toolkit-label",
            "text-anchor": "middle",
            "style":       "dominant-baseline: central;"
        });
        this._label_upper = TK.make_svg("text", {
            "class": "toolkit-label-upper",
            "text-anchor": "middle",
            "style":       "dominant-baseline: central;"
        });
        this._label_lower = TK.make_svg("text", {
            "class": "toolkit-label-lower",
            "text-anchor": "middle",
            "style":       "dominant-baseline: central;"
        });
        E.appendChild(this._label);
        E.appendChild(this._label_upper);
        E.appendChild(this._label_lower);

        this.add_event("hide", onhide);
        this.add_event("show", timeout);
        
        var circ_options = {
            container: E,
            show_hand: false,
            start: 270,
            basis: 360,
            min: 0
        };

        this.circulars.seconds = new Circular(Object.assign({}, circ_options,
            {max: 60, "class": "toolkit-seconds"}));
        this.circulars.minutes = new Circular(Object.assign({}, circ_options,
            {max: 60, "class": "toolkit-minutes"}));
        this.circulars.hours   = new Circular(Object.assign({}, circ_options,
            {max: 12, "class": "toolkit-hours"}));

        this.add_child(this.circulars.seconds);
        this.add_child(this.circulars.minutes);
        this.add_child(this.circulars.hours);
        
        this.set("size", this.options.size, true);

        // start the clock
        this.__timeout = timeout.bind(this);
    },

    redraw: function () {
        var I = this.invalid, O = this.options;

        Widget.prototype.redraw.call(this);

        if (I.size) {
            var tmp = O.size;
            this.element.setAttribute("width", (typeof tmp == "number" ? tmp + "px" : tmp));
            this.element.setAttribute("height", (typeof tmp == "number" ? tmp + "px" : tmp));
        }

        if (I.validate("show_hours", "show_minutes", "show_seconds", "thickness", "margin") || I.size) {
            var margin = 0;
            for (var i in this.circulars) {
                var circ = this.circulars[i];
                if (O["show_" + i]) {
                    circ.set("thickness", O.thickness);
                    circ.set("show_base", true);
                    circ.set("show_value", true);
                    circ.set("size", O.size);
                    circ.set("margin", margin);
                    margin += O.thickness;
                    margin += circ._get_stroke();
                    margin += O.margin;
                } else {
                    circ.set("show_base", false);
                    circ.set("show_value", false);
                }
            }
            if(this._margin < 0) {
                this._margin = margin;
            } else {
                this._margin = margin;
            }
            // force set_labels
            I.label = true;
        }

        if (I.validate("label", "months", "days", "size", "label_scale")) {
            set_labels.call(this);
        }

        if (I.validate("time", "label", "label_upper", "label_lower", "label_scale")) {
            draw_time.call(this, false);
        }
    },
    
    destroy: function () {
        this._label.remove();
        this._label_upper.remove();
        this._label_lower.remove();
        this.element.remove();
        this.circulars.seconds.destroy();
        this.circulars.minutes.destroy();
        this.circulars.hours.destroy();
        if (this.__to)
            window.clearTimeout(this.__to);
        Widget.prototype.destroy.call(this);
    },
    
    // GETTERS & SETTERS
    set: function (key, value) {
        if (key == "timeout") timeout.call(this);
        return Widget.prototype.set.call(this, key, value);
    }
});
})(this);
