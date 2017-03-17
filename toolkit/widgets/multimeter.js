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
function add_meters (cnt, options) {
    for (var i = 0; i < cnt; i++)
        this.add_meter(options);
}
function add_meter (options) {
    var l = this.meters.length;
    var O = options;
    var opt = {
        "container": this.element,
        title: (typeof O.titles[l] !== "undefined") ? O.titles[l] : O.title,
        value: (typeof O.values[l] !== "undefined") ? O.values[l] : O.value,
        label: (typeof O.labels[l] !== "undefined") ? O.labels[l] : O.label,
        clip: (typeof O.clips[l] !== "undefined") ? O.clips[l] : O.clip,
        peak: (typeof O.peaks[l] !== "undefined") ? O.peaks[l] : O.peak,
        bottom: (typeof O.bottoms[l] !== "undefined") ? O.bottoms[l] : O.bottom,
        top: (typeof O.tops[l] !== "undefined") ? O.tops[l] : O.top,
    }
    opt = TK.merge(TK.object_sub(O, TK.Widget.prototype._options), opt);
    var m = new TK.LevelMeter(opt);
    this.meters.push(m);
    this.add_child(m);
}
function remove_meter (meter) {
    /* meter can be int or meter instance */
    var I = this.invalid;
    var M = this.meters;
    
    var m = -1;
    if (typeof meter == "number") {
        m = meter;
    } else  {
        for (var i = 0; i < M.length; i++) {
            if (M[i] == meter) {
                m = i;
                break;
            }
        }
    }
    if (m < 0 || m > M.length - 1) return;
    this.remove_child(M[m]);
    M[m].set("container", null);
    // TODO: no destroy function in levelmeter at this point?
    //this.meters[m].destroy();
    M = M.splice(m, 1);
}
    
    
TK.MultiMeter = TK.class({
    /**
     * TK.MultiMeter is a collection of {@link TK.LevelMeter}s to show levels of full channels
     * containing multiple audio streams. It offers all options of {@link TK.LevelMeter} and
     * {@link TK.MeterBase} which are passed to all instantiated level meters.
     *
     * @class TK.MultiMeter
     * 
     * @extends TK.Container
     * 
     * @param {Object} options
     * 
     * @property {number} [options.count=2] - The amount of level meters
     * @property {string} [options.title=""] - The title of the multi meter
     * @property {Array} [options.titles=["L", "R"]] - An Array containing titles for the level meters. Their order is the same as the meters.
     * @property {Array} [options.values=[]] - An Array containing values for the level meters. Their order is the same as the meters.
     * @property {Array} [options.labels=[]] - An Array containing label values for the level meters. Their order is the same as the meters.
     * @property {Array} [options.clips=[]] - An Array containing clippings for the level meters. Their order is the same as the meters.
     * @property {Array} [options.peaks=[]] - An Array containing peak values for the level meters. Their order is the same as the meters.
     * @property {Array} [options.tops=[]] - An Array containing values for top for the level meters. Their order is the same as the meters.
     * @property {Array} [options.bottoms=[]] - An Array containing values for bottom for the level meters. Their order is the same as the meters.
     */
    _class: "MultiMeter",
    Extends: TK.Container,
    
    /* TODO: The following sucks cause we need to maintain it according to
    LevelMeters and MeterBases options. */
    _options: Object.assign(Object.create(TK.LevelMeter.prototype._options), {
        count: "int",
        titles: "array",
        values: "array",
        labels: "array",
        clips: 'array',
        peaks: "array",
        tops: "array",
        bottoms: "array",
    }),
    options: {
        clip:         false,
        falling:      0,
        falling_fps:  24,
        falling_init: 2,
        peak:         false,
        top:          false,
        bottom:       false,
        hold_size:    1,
        show_peak:    false,
        show_clip:    false,
        show_hold:    false,
        clipping:     0,
        auto_clip:    false,
        auto_peak:    false,
        peak_label:   false,
        auto_hold:    false,
        format_peak: TK.FORMAT("%.2f"),
        clip_options: {},
        layout:          "left",
        segment:         1,
        value:           0,
        base:            false,
        label:           false,
        title:           "",
        show_title:      false,
        show_label:      false,
        show_scale:      true,
        show_labels:     true,
        format_label:    TK.FORMAT("%.2f"),
        levels:          [1, 5, 10],
        scale_base:       false,
        format_labels:    TK.FORMAT("%.2f"),
        background:      false,
        gradient:        false,
        
        count: 2,
        
        // Convenient stuff - setting values for internal meters as array
        // 
        // Probably there's a better solution which makes it more generic
        // so every option can be set as array containing values for all
        // child meters
        titles: ["L", "R"],
        values: [],
        labels: [],
        clips: [],
        peaks: [],
        tops: [],
        bottoms: [],
    },
    /* end of bloat */
    initialize: function (options) {
        TK.Container.prototype.initialize.call(this, options, true);
        /**
         * @member {HTMLDivElement} TK.MultiMeter#element - The main DIV container.
         *   Has class <code>toolkit-multi-meter</code>.
         */
        TK.add_class(this.element, "toolkit-multi-meter");
        this.meters = [];
        var O = this.options;
        
        /**
         * @member {TK.Label} TK.MultiMeter#itle - The title of the MultiMeter.
         *   Has class <code>toolkit-title</code>.
         */
        this.title = new TK.Label({
            "class": "toolkit-title",
            "label": O.title,
            "container": this.element
        });
        /**
         * @member {HTMLDivElement} TK.MultiMeter#_title - The DIV element of the {@link TK.Label} module.
         */
        this._title = this.title.element;
        this.add_child(this.title);
        
        this.set("count", O.count);
        this.set("values", O.values);
        this.set("labels", O.labels);
        this.set("titles", O.titles);
        this.set("peaks", O.peaks);
        this.set("tops", O.tops);
        this.set("bottoms", O.bottoms);
        
        this.redraw();
        
        this.set("layout", O.layout);
    },
    
    
    redraw: function () {
        var O = this.options;
        var I = this.invalid;
        var E = this.element;
        var M = this.meters;
        
        if (I.count) {
            I.count = false;
            while (M.length > O.count)
                remove_meter.call(this, M[M.length-1]);
            while (M.length < O.count)
                add_meter.call(this, this.options);
            E.setAttribute("class", E.getAttribute("class").replace(/toolkit-count-[0-9]*/g, ""));
            E.setAttribute("class", E.getAttribute("class").replace(/ +/g, " "));
            TK.add_class(E, "toolkit-count-" + O.count);
        }
        
        if (I.layout) {
            I.layout = false;
            TK.remove_class(E, "toolkit-vertical", "toolkit-horizontal", "toolkit-left",
                            "toolkit-right", "toolkit-top", "toolkit-bottom");
            switch (O.layout) {
                case "left":
                    TK.add_class(E, "toolkit-vertical", "toolkit-left");
                    break;
                case "right":
                    TK.add_class(E, "toolkit-vertical", "toolkit-right");
                    break;
                case "top":
                    TK.add_class(E, "toolkit-horizontal", "toolkit-top");
                    break;
                case "bottom":
                    TK.add_class(E, "toolkit-horizontal", "toolkit-bottom");
                    break;
                default:
                    throw("unsupported layout");
            }
            switch (O.layout) {
                case "top":
                case "left":
                    for (var i = 0; i < M.length - 1; i++)
                        M[i].set("show_scale", false);
                    if (M.length)
                        M[this.meters.length - 1].set("show_scale", O.show_scale);
                    break;
                case "bottom":
                case "right":
                    for (var i = 0; i < M.length; i++)
                        M[i].set("show_scale", false);
                    if (M.length)
                        M[0].set("show_scale", O.show_scale);
                    break;
            }
        }
        
        if (I.title) {
            I.title = false;
            TK.toggle_class(E, "toolkit-has-title", !!O.title);
        }
        
        TK.Container.prototype.redraw.call(this);
    },
    destroy: function () {
        this.title.destroy();
        TK.Container.prototype.destroy.call(this);
    },
    // GETTER & SETTER
    set: function (key, value) {
        var O = this.options;
        var E = this.element;
        var M = this.meters;
        var I = this.invalid;
        value = TK.Container.prototype.set.call(this, key, value);
        switch (key) {
            case "count":
                I.layout = true;
                break;
            case "title":
                this.title.set("label", value);
                break;
            case "values":
            case "labels":
            case "titles":
            case "clips":
            case "peaks":
            case "tops":
            case "bottoms":
                var k = key.substr(0, key.length-1);
                for (var i = 0; i < M.length; i++)
                    M[i].set(k, (value[i] === void 0) ? O[k] : value[i]);
                break;
            default:
                if (!TK.Container.prototype._options[key]) {
                    for (var i = 0; i < M.length; i++)
                        M[i].set(key, value);
                }
                break;
        }
        return value;
    }
});
})(this, this.TK);
