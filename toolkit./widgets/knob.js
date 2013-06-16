Knob = new Class({
    Extends: Circular,
    options: {
        size: 100,
        hand: {width: 2, length: 6, margin: 22},
        margin: 13,
        thickness: 5,
        step: 1,
        shift_up: 4,
        shift_down: 0.25,
        show_base: true,
        dot: {margin: 13, length: 5, width: 2},
        marker: {margin: 13, thickness: 5},
        label: {margin: 10, align: _TOOLKIT_OUTER},
        direction: _TOOLKIT_VERTICAL
    },
    
    initialize: function (options) {
        this.setOptions(options);
        this._svg = this.widgetize(makeSVG("svg", {"class": "toolkit-knob"}),
                        true, true, true);
        if (this.options.container)
            this._svg.inject(this.options.container);
        
        this.parent(Object.merge(options, {container: this._svg}), true);
        
        this.drag = new DragValue({
            element: this._svg,
            range:   function () { return this }.bind(this),
            get:     function () { return this.options.value; }.bind(this),
            set:     function (v) { this.set("value", v); }.bind(this),
            direction: this.options.direction
        });
        this.scroll = new ScrollValue({
            element: this._svg,
            range:   function () { return this }.bind(this),
            get:     function () { return this.options.value; }.bind(this),
            set:     function (v) { this.set("value", v); }.bind(this)
        })
        this.set("size", this.options.size);
        this.initialized();
    },
    
    destroy: function () {
        this._svg.destroy();
        this.parent();
    },
    
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "size":
                this._svg.set("width", value);
                this._svg.set("height", value);
                if (!hold) this.redraw();
                break;
            case "direction":
                this.drag.set("direction", value);
                break;
        }
        this.parent(key, value, hold);
    }
});
