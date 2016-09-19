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
function add_meters (cnt, options) {
    for (var i = 0; i < cnt; i++)
        this.add_meter(options);
}
function add_meter (options) {
    var l = this.meters.length;
    var O = this.options;
    var opt = {
        "container": this.element,
        title: typeof O.titles[l] !== "undefined" ? O.titles[l] : O.title,
        value: typeof O.values[l] !== "undefined" ? O.values[l] : O.value,
        clip: typeof O.clips[l] !== "undefined" ? O.clips[l] : O.clip,
        peak: typeof O.peaks[l] !== "undefined" ? O.peaks[l] : O.peak,
        bottom: typeof O.bottoms[l] !== "undefined" ? O.bottoms[l] : O.bottom,
        top: typeof O.tops[l] !== "undefined" ? O.tops[l] : O.top,
    }
    var m = new TK.LevelMeter(Object.assign(O, opt));
    this.meters.push(m);
    this.add_child(m);
}
function remove_meter (meter) {
    /* meter can be int or meter instance */
    var m = -1;
    if (typeof meter == "number") {
        m = meter;
    } else  {
        for (var i = 0; i < this.meters.length; i++) {
            if (this.meters[i] == meter) {
                m = i;
                break;
            }
        }
    }
    if (m < 0 || m > this.meters.length - 1) return;
    
    this.meters[m].destroy();
    this.meters.splice(m, 1); 
}
    
    
w.TK.MultiMeter = w.MultiMeter = $class({
    /**
     * TK.MultiMeter is a collection of {@link TK.LevelMeter}s to show levels of full channels
     * containing multiple audio streams. It offers all options of {@link TK.LevelMeter} and
     * {@link TK.MeterBase} which are passed to all instantiated level meters.
     * 
     * @param {Object} options
     * @property {number} [options.count=2] - The amount of level meters
     * @property {string} [options.title=""] - The title of the multi meter
     * @property {Array} [options.titles=[]] - An Array containing titles for the level meters. Their order is the same as the meters.
     * @property {Array} [options.values=[]] - An Array containing values for the level meters. Their order is the same as the meters.
     * @property {Array} [options.clips=[]] - An Array containing clippings for the level meters. Their order is the same as the meters.
     * @property {Array} [options.peaks=[]] - An Array containing peak values for the level meters. Their order is the same as the meters.
     * @property {Array} [options.tops=[]] - An Array containing values for top for the level meters. Their order is the same as the meters.
     * @property {Array} [options.bottoms=[]] - An Array containing values for bottom for the level meters. Their order is the same as the meters.
     *
     * @class TK.MultiMeter
     * @extends TK.Container
     */
    _class: "MultiMeter",
    Extends: TK.Container,
    
    /* TODO: The following sucks cause we need to maintain it according to
    LevelMeters and MeterBases options. */
    _options: Object.assign(Object.create(TK.Container.prototype._options), {
        clip: "boolean",
        falling: "number",
        falling_fps: "number",
        falling_init: "number",
        peak: "number",
        top: "number",
        bottom: "number",
        hold_size: "int",
        show_peak: "boolean",
        show_clip: "boolean",
        show_hold: "boolean",
        clipping: "number",
        auto_clip: "int",
        auto_peak: "int",
        peak_label: "int",
        auto_hold: "int",
        format_peak: "function",
        clip_options: "object",
        layout: "string",
        segment: "number",
        value: "number",
        base: "number",
        min: "number",
        max: "number",
        label: "string",
        title: "string",
        show_title: "boolean",
        show_label: "boolean",
        show_scale: "boolean",
        show_labels: "boolean",
        format_label: "function",
        scale_base: "number",
        format_labels: "function",
        
        titles: "array",
        values: "array",
        clips: 'array',
        peaks: "array",
        tops: "array",
        bottoms: "array",
        count: "int"
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
        levels:          [1, 5, 10],     // array of steps where to draw labels
        scale_base:       false,
        format_labels:    TK.FORMAT("%.2f"),
        
        titles: ["Left", "Right"],
        values: [],
        clips: [],
        peaks: [],
        tops: [],
        bottoms: [],
        count: 2,
        
    },
    /* end of bloat */
    initialize: function (options) {
        TK.Container.prototype.initialize.call(this, options, true);
        TK.add_class(this.element, "toolkit-multi-meter");
        
        this.meters = [];
        var O = this.options;
        
        this.title = new TK.Label({
            "class": "toolkit-title",
            "label": O.title,
            "container": this.element
        });
        this.add_child(this.title);
        this._title = this.title.element;
        
        this.set("count", O.count);
        this.set("values", O.values);
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
        
        if (I.count) {
            I.count = false;
            while (this.meters.length > O.count)
                remove_meter.call(this, this.meters[this.meters.length-1]);
            while (this.meters.length < O.count)
                add_meter.call(this, this.options);
        }
        
        if (I.layout) {
            I.layout = false;
            TK.remove_class(E, "toolkit-vertical");
            TK.remove_class(E, "toolkit-horizontal");
            TK.remove_class(E, "toolkit-left");
            TK.remove_class(E, "toolkit-right");
            TK.remove_class(E, "toolkit-top");
            TK.remove_class(E, "toolkit-bottom");
            switch (O.layout) {
                case "left":
                    TK.add_class(E, "toolkit-vertical");
                    TK.add_class(E, "toolkit-left");
                    break;
                case "right":
                    TK.add_class(E, "toolkit-vertical");
                    TK.add_class(E, "toolkit-right");
                    break;
                case "top":
                    TK.add_class(E, "toolkit-horizontal");
                    TK.add_class(E, "toolkit-top");
                    break;
                case "bottom":
                    TK.add_class(E, "toolkit-horizontal");
                    TK.add_class(E, "toolkit-bottom");
                    break;
                default:
                    throw("unsupported layout");
            }
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
        value = TK.Container.prototype.set.call(this, key, value);
        switch (key) {
            case "title":
                this.title.set("label", value);
                if (value)
                    TK.add_class(E, "toolkit-has-title");
                else
                    TK.remove_class(E, "toolkit-has-title");
                break;
            case "layout":
                switch (value) {
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
                for (var i = 0; i < M.length; i++)
                    M[i].set(key, value);
                break;
            case "values":
            case "titles":
            case "clips":
            case "peaks":
            case "tops":
            case "bottoms":
                var k = key.substr(0, key.length-1);
                for (var i = 0; i < M.length; i++)
                    M[i].set(k, typeof value[i] !== "undefined" ? value[i] : O[k]);
                break;
            default:
                if (key !== "container"
                 && key !== "title"
                 && key !== "count"
                 && key !== "title") {
                    for (var i = 0; i < M.length; i++)
                        M[i].set(key, value);
                }
                break;
        }
        return value;
    }
});
})(this);
