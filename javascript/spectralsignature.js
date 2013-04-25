/*
 * Modules:
 * 
 * upper: upper ResponseHandler
 * input: graph in upper
 * gain:  graph in upper
 * difference: graph (combined input & gain) in upper
 * thresholds[]: all gate threshold handles in upper
 * 
 * lower: lower ResponseHandler
 * signatures[]: array containing Graphs in lower
 * sighandles[]: all signature handles in lower
 * 
 * states[]: all States
 * toggles[]: all Toggles
 * 
 * 
 * 
 */

SpectralSignature = new Class({

    Extends: Widget,
    Implements: [Ranges],
    options: {
        range_x: {},                 // range or range options for all x ranges
        range_y_upper: {},           // y range for upper graph
        range_y_lower: {},           // y range for lower graph
        range_y_relative: {reverse:true},        // y range for relative grid in lower graph
        range_z_maxgain: {},         // z range for maxgain in lower graph
        
        bands: [],                   // array containing all center frequencies
        input: [],                   // array containing decibel values for input graph
        gain:  [],                   // array containing decibel values for gain graph
        type: "H2",                  // type of the graphs
        toggle_icon: "",             // image for off state of toggles
        toggle_icon_active:  "",     // image for on state of toggles
        thresholds: {},              // options for gate threshold block handles in upper
        signatures: {}               // options for signature handles in lower
        
    },
    states: [],
    toggles: [],
    thresholds: [],
    signatures: [],
    sighandles: [],
    
    initialize: function (options) {
        this.setOptions(options);
        this.parent(options);
        
        this.element = this.widgetize(new Element("div.spectralsignature"), true, true);
        if(this.options.container)
            this.element.inject(this.options.container);
        
        this.add_range(this.options.range_x, "range_x");
        this.add_range(this.options.range_y_upper, "range_y_upper");
        this.add_range(this.options.range_y_lower, "range_y_lower");
        this.add_range(this.options.range_y_relative, "range_y_relative");
        this.add_range(this.options.rage_z_maxgain, "range_z_maxgain");
        
        this.range_x.addEvent("set", this.set_elements.bind(this));
        
        this.upper = new ResponseHandler({
            range_x: function () { return this.range_x }.bind(this),
            range_y: function () { return this.range_y_upper }.bind(this),
            container: this.element,
            grid_x: this.options.grid_x,
            "class": "upper"
        });
        this._states = new Element("div.states").inject(this.element);
        this.lower = new ResponseHandler({
            range_x: function () { return this.range_x }.bind(this),
            range_y: function () { return this.range_y_lower }.bind(this),
            range_z: function () { return this.range_z_maxgain }.bind(this),
            db_grid: 10,
            grid_x: this.options.grid_x,
            container: this.element,
            "class": "lower"
        });
        this._toggles = new Element("div.toggles").inject(this.element);
        
        for (var i = 0; i < this.options.bands.length; i++) {
            this.states[i] = new State({
                container: this._states
            });
            this.toggles[i] = new Toggle({
                container: this._toggles,
                icon: this.options.toggle_icon,
                icon_active: this.options.toggle_icon_active
            });
            
            if (!i) {
                // first element
                var min = this.range_x.get("min");
                var max = this.range_x.px2val(
                          (this.range_x.val2px(this.options.bands[i + 1])
                        - this.range_x.val2px(this.options.bands[i])) / 2
                        + this.range_x.val2px(this.options.bands[i]));
            } else if (i >= this.options.bands.length - 1) {
                // last element
                var max = this.range_x.get("max");
                var min = this.range_x.px2val(
                          this.range_x.val2px(this.options.bands[i])
                        - (this.range_x.val2px(this.options.bands[i])
                        - this.range_x.val2px(this.options.bands[i - 1])) / 2);
            } else {
                // all others
                var pos  = this.range_x.val2px(this.options.bands[i]);
                var pre  = this.range_x.val2px(this.options.bands[i - 1]);
                var post = this.range_x.val2px(this.options.bands[i + 1]);
                var min = this.range_x.px2val((pos - pre) / 2 + pre);
                var max = this.range_x.px2val((post - pos) / 2 + pos);
            }
            
            var thr = Object.merge({}, this.options.thresholds, {
                x_min: min,
                x_max: max,
                x: this.options.bands[i],
                mode: _TOOLKIT_BLOCK_BOTTOM,
                y: -60
            });
            thr.title = sprintf(thr.title, (i+1));
            this.thresholds[i] = this.upper.add_handle(thr);
            
            var sig = Object.merge({}, this.options.signatures, {
                x: this.options.bands[i],
                y: 0,
                x_min: this.options.bands[i],
                z_handle: _TOOLKIT_RIGHT,
                x_max: this.options.bands[i]
            });
            sig.title = sprintf(sig.title, (i+1));
            this.sighandles[i] = this.lower.add_handle(sig);
            this.sighandles[i].addEvents({
                "startdrag": this._startdrag.bind(this),
                "stopdrag": this._stopdrag.bind(this),
                "dragging": this._dragging.bind(this)
            });
        }
        this.set_elements();
        this.lower.addEvent("mouseup", this._stopdrag.bind(this));
        this.input = this.upper.add_graph({
            "class": "input",
            type: this.options.type,
            mode: _TOOLKIT_LINE,
            range_x: function () { return this.range_x }.bind(this),
            range_y: function () { return this.range_y_upper }.bind(this)
        })
        this.gain = this.upper.add_graph({
            "class": "gain",
            type: this.options.type,
            mode: _TOOLKIT_LINE,
            range_x: function () { return this.range_x }.bind(this),
            range_y: function () { return this.range_y_upper }.bind(this)
        })
        this.difference = this.upper.add_graph({
            "class": "difference",
            type: this.options.type,
            mode: _TOOLKIT_LINE,
            range_x: function () { return this.range_x }.bind(this),
            range_y: function () { return this.range_y_upper }.bind(this)
        });
        
        var obj = [];
        for (var i = this.range_y_relative.get("min");
                 i < this.range_y_relative.get("max");
                 i += this.options.db_grid_relative)
            obj.push({pos: i, label:i + "dB", "class": i ? "" : "toolkit-highlight"});
        
        this.relative = new Grid({
            container: this.lower.element,
            range_x: function () { return this.range_x }.bind(this),
            range_y: function () { return this.range_y_relative }.bind(this),
            db_grid: this.options.db_grid_relative,
            grid_x: [],
            grid_y: obj
                
        });
        
        if (this.options.input.length)
            this.draw_input();
        if (this.options.gain.length)
            this.draw_gain();
        
        this.initialized();
    },
    set_elements: function () {
        for (var i = 0; i < this.options.bands.length; i++) {
            this.states[i].element.setStyles({
                position: "absolute",
                left:     this.range_x.val2px(this.options.bands[i])
                        - this.states[i].element.outerWidth() / 2
            });
            this.toggles[i].element.setStyles({
                position: "absolute",
                left:     this.range_x.val2px(this.options.bands[i])
                        - this.toggles[i].element.outerWidth() / 2
            });
        }
    },
    
    draw_difference: function () {
        var dots = [{x: this.range_x.get("min"), y: this.options.input[0]}];
        for (var i = 0; i < this.options.bands.length; i++) {
            dots.push({x: this.options.bands[i], y: this.options.input[i]});
        }
        dots.push({x: this.range_x.get("max"),
                   y: this.options.input[this.options.input.length - 1]});
        dots.push({x: this.range_x.get("max"),
                   y: this.options.input[this.options.input.length - 1]
                    + this.options.gain[this.options.gain.length - 1]
        });
        for (var i = this.options.bands.length - 1; i > -1; i--) {
            dots.push({x: this.options.bands[i],
                       y: this.options.input[i] + this.options.gain[i]});
        }
        dots.push({x: this.range_x.get("min"), y: this.options.input[0]});
        this.difference.set("dots", dots);
        this.fireEvent("differencedrawn", this);
    },
    draw_input: function (hold) {
        var dots = [{x: this.range_x.get("min"), y: this.options.input[0]}];
        for (var i = 0; i < this.options.bands.length; i++) {
            dots.push({x: this.options.bands[i], y: this.options.input[i]});
        }
        dots.push({x: this.range_x.get("max"),
                   y: this.options.input[this.options.input.length - 1]});
        this.input.set("dots", dots);
        this.fireEvent("inputdrawn", this);
        if(!hold)
            this.draw_difference();
    },
    draw_gain: function (hold) {
        var dots = [{x: this.range_x.get("min"), y: this.options.gain[0]
                                                  + this.options.input[0]}];
        for (var i = 0; i < this.options.bands.length; i++) {
            dots.push({x: this.options.bands[i],
                       y: this.options.gain[i] + this.options.input[i]});
        }
        dots.push({x: this.range_x.get("max"),
                   y: this.options.gain[this.options.gain.length - 1]
                    + this.options.input[this.options.input.length - 1]});
        this.gain.set("dots", dots);
        this.fireEvent("gaindrawn", this);
        if(!hold)
            this.draw_difference();
    },
    draw_signature: function (signature, values) {
        var dots = [{x: this.range_x.get("min"), y: values[0]}];
        for (var i = 0; i < this.options.bands.length; i++) {
            dots.push({x: this.options.bands[i], y: values[i]});
        }
        dots.push({x: this.range_x.get("max"),
                   y: values[values.length - 1]});
        signature.set("dots", dots);
        this.fireEvent("signaturedrawn", [signature, this]);
    },
    add_signature: function (options, dots, activate) {
        options["container"] = this._graphs;
        if(!options.range_x)
            options.range_x = function () { return this.range_x; }.bind(this);
        if(!options.range_y)
            options.range_y = function () { return this.range_y_lower; }.bind(this);
        if(!options.type)
            options.type = this.options.type;
        var g = this.lower.add_graph(options);
        this.signatures.push(g);
        this.fireEvent("signatureadded", [g, this]);
        if (dots)
            this.draw_signature(g, dots);
        if (activate)
            this.activate_signature(g);
        return g;
    },
    remove_signature: function (signature) {
        for (var i = 0; i < this.signatures.length; i++) {
            if (this.signatures[i] == signature) {
                this.signatures.splice(i, 1);
                this.fireEvent("signaturesremoved", this);
                break;
            }
        }
        this.lower.remove_graph(signature);
    },
    remove_signatures: function () {
        // remove all signatures from the widget.
        for (var i = 0; i < this.signatures.length; i++) {
            this.remove_signature(this.signatures[i]);
        }
        this.signatures = [];
        this.fireEvent("emptied", this)
    },
    activate_signature: function (signature) {
        for (var i = 0; i < this.signatures.length; i++) {
            if (this.signatures[i] != signature)
                this.signatures[i].element.removeClass("active");
        }
        signature.element.addClass("active");
        for(var i = 0; i < this.options.bands.length; i++) {
            this.sighandles[i].set("y", signature.get("dots")[i + 1].y);
        }
    },
    
    
    _startdrag: function (coords, obj) {
        this.lower.grid.setStyle("display", "none");
        this.relative.element.setStyle("display", "block");
        this.relative.element.set("transform", "translate(0,"
            + (-this.range_y_relative.get("basis") / 2 + coords.pos_y) + ")");
    },
    _stopdrag: function (coords, obj) {
        this.lower.grid.setStyle("display", "block");
        this.relative.element.setStyle("display", "none");
    },
    _dragging: function (coords, obj) {
        this.relative.element.set("transform", "translate(0,"
            + (-this.range_y_relative.get("basis") / 2 + coords.pos_y) + ")");
    },
    
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "input":
                this.draw_input();
            case "gain":
                this.draw_gain();
        }
        this.parent(key, value, hold);
    }
});
