/*******************************************************************************
 * toolkit. by Junger
 * 
 * This toolkit provides different widgets, implements and modules for building
 * audio based applications in webbrowsers.
 * 
 * Concept and realization by Markus Schmidt <schmidt@boomshop.net> for:
 * 
 * Jünger Audio GmbH
 * Justus-von-Liebig-Straße 7
 * 12489 Berlin · Germany
 * Tel: +49 30 67 77 21 0
 * http://junger-audio.com
 * info@junger-audio.com
 * 
 * toolkit. relies on mootools: http://mootools.net/
 * 
 * There is no license by now - all rights reserved. Hope we can fix this major
 * bug soon.
 ******************************************************************************/

Window = new Class({
    Extends: Widget,
    options: {
        width:         500,   // initial width, can be a css length, an int (pixels)
        height:        200,   // initial height, can be a css length, an int (pixels)
        x:             0,     // X position of the window
        y:             0,     // Y position of the window
        min_width:     300,   // minimum width
        max_width:     -1,    // maximum width, -1 ~ infinite
        min_height:    100,   // minimum height
        max_height:    -1,    // maximum height, -1 ~ infinite
        anchor:        _TOOLKIT_TOP_LEFT, // anchor of the window, can be one out of:
                       // _TOOLKIT_TOP_LEFT, _TOOLKIT_TOP, _TOOLKIT_TOP_RIGHT,
                       // _TOOLKIT_LEFT, _TOOLKIT_CENTER, _TOOLKIT_RIGHT,
                       // _TOOLKIT_BOTTOM_LEFT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_RIGHT
        modal:         false, // if modal window blocks all other elements
        dock:          false,   // docking of the window, can be one out of:
                       // _TOOLKIT_TOP_LEFT, _TOOLKIT_TOP, _TOOLKIT_TOP_RIGHT,
                       // _TOOLKIT_LEFT, _TOOLKIT_CENTER, _TOOLKIT_RIGHT,
                       // _TOOLKIT_BOTTOM_LEFT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_RIGHT
        maximize:      false, // false or object with members x and y as bool
        minimize:      false, // minimize window (does only make sense with a
                              // window manager application to keep track of it)
        shrink:        false, // shrink rolls the window up into the title bar
        content:       "",
        open:          _TOOLKIT_CENTER, // initial position of the window, can be one out of:
                       // _TOOLKIT_TOP_LEFT, _TOOLKIT_TOP, _TOOLKIT_TOP_RIGHT,
                       // _TOOLKIT_LEFT, _TOOLKIT_CENTER, _TOOLKIT_RIGHT,
                       // _TOOLKIT_BOTTOM_LEFT, _TOOLKIT_BOTTOM, _TOOLKIT_BOTTOM_RIGHT
        z_index:       10000, // z index for piling windows. does make more sense
                              // when used together with a window manager
        header_left:   [_TOOLKIT_ICON], // single element or array of:
                                        // _TOOLKIT_TITLE, _TOOLKIT_ICON,
                                        // _TOOLKIT_CLOSE, _TOOLKIT_MINIMIZE,
                                        // _TOOLKIT_SHRINK,
                                        // _TOOLKIT_MAXIMIZE, _TOOLKIT_MAXIMIZE_VERT
                                        // _TOOLKIT_MAXIMIZE_HORIZ, _TOOLKIT_STATUS
        header_center: [_TOOLKIT_TITLE],
        header_right:  [_TOOLKIT_MAXIMIZE, _TOOLKIT_CLOSE],
        footer_left:   [],
        footer_center: [],
        footer_right:  [],
        title:         "",
        status:        "",
        icon:          "",
        fixed:         true, // whether the window sticks to the viewport
                              // rather than the document
        active:        true,  // state of the window (mainly a css-class)
        auto_active:   false, // auto-toggle the active-class when mouseovered
        auto_close:    true,  // set whether close destroys the window or not
        auto_maximize: true,  // set whether maximize toggles the window or not
        auto_minimize: true,  // set whether minimize toggles the window or not
        auto_shrink:   true,  // set whether shrink toggles the window or not
        draggable:     true,  // set whether the window is draggable
        resizable:     true,   // set whether the window is resizable
        resizing:      _TOOLKIT_CONTINUOUS,// resizing policy, _TOOLKIT_CONTINUOUS
                                           // or _TOOLKIT_COMPLETE
        header_action: _TOOLKIT_MAXIMIZE   // _TOOLKIT_CLOSE, _TOOLKIT_MINIMIZE,
                                           // _TOOLKIT_SHRINK,
                                           // _TOOLKIT_MAXIMIZE, _TOOLKIT_MAXIMIZE_VERT
                                           // _TOOLKIT_MAXIMIZE_HORIZ
    },
    __inited: false,
    dimensions: {anchor: 0, x: 0, x1: 0, x2: 0, y: 0, y1: 0, y2: 0, width: 0, height: 0},
    initialize: function (options) {
        this.parent(options);
        
        this.element = this.widgetize(new Element("div.toolkit-window"),
                                      true, true, true);
        
        this._header = (new Element("div.toolkit-header")).inject(this.element);
        this._footer = (new Element("div.toolkit-footer")).inject(this.element);
        this._content = (new Element("div.toolkit-content")).inject(this.element);
        
        this._header_left =
            (new Element("div.toolkit-header-left")).inject(this._header);
        this._header_center =
            (new Element("div.toolkit-header-center")).inject(this._header);
        this._header_right =
            (new Element("div.toolkit-header-right")).inject(this._header);
        
        this._footer_left =
            (new Element("div.toolkit-footer-left")).inject(this._footer);
        this._footer_center =
            (new Element("div.toolkit-footer-center")).inject(this._footer);
        this._footer_right =
            (new Element("div.toolkit-footer-right")).inject(this._footer);
            
        this._title  = new Element("div.toolkit-title");
        this._status = new Element("div.toolkit-status");
        this._icon   = new Element("img.toolkit-icon");
        
        this.close = new Button({
            "class": "toolkit-close",
            onClick: this.__close.bind(this)
        });
        this.maximize = new Button({
            "class": "toolkit-maximize",
            onClick: this.__maximize.bind(this)
        });
        this.maximize_vert = new Button({
            "class": "toolkit-maximize-vertical",
            onClick: this.__maximizevertical.bind(this)
        });
        this.maximize_horiz = new Button({
            "class": "toolkit-maximize-horizontal",
            onClick: this.__maximizehorizontal.bind(this)
        });
        this.minimize = new Button({
            "class": "toolkit-minimize",
            onClick: this.__minimize.bind(this)
        });
        this.shrink = new Button({
            "class": "toolkit-shrink",
            onClick: this.__shrink.bind(this)
        });
        this.__buttons = [this.close, this.maximize, this.maximize_vert,
                          this.maximize_horiz, this.minimize, this.shrink];
        for (var i = 0; i < this.__buttons.length; i++) {
            new Element("div.toolkit-icon").inject(this.__buttons[i].element);
            this.__buttons[i]._icon.dispose();
            this.__buttons[i]._label.dispose();
        }
        
        if (this.options.container)
            this.set("container", this.options.container);
        
        this.set("width", this.options.width, true);
        this.set("height", this.options.height, true);
        this.set("x", this.options.x, true);
        this.set("y", this.options.y, true);
        this.set("z_index", this.options.z_index);
        this.set("title", this.options.title);
        this.set("status", this.options.status);
        this.set("icon", this.options.icon);
        this.set("active", this.options.active);
        this.set("auto_active", this.options.auto_active);
        this.set("fixed", this.options.fixed);
        
        this.set("header_left", this.options.header_left, true);
        this.set("header_right", this.options.header_right, true);
        this.set("header_center", this.options.header_center);

        this.set("footer_left", this.options.footer_left, true);
        this.set("footer_right", this.options.footer_right, true);
        this.set("footer_center", this.options.footer_center);
        
        this.set("min_width", this.options.min_width);
        this.set("max_width", this.options.max_width);
        this.set("min_height", this.options.min_height);
        this.set("max_height", this.options.max_height);
        
        this.set("content", this.options.content);
        
        this.element.addEvent("mouseenter", this.__mover.bind(this));
        this.element.addEvent("mouseleave", this.__mout.bind(this));
        this._header.addEvent("dblclick", this.__header_action.bind(this));
        
        this.drag = new Drag(this.element, {
            handle: this._header,
            onStart: this.__start_drag.bind(this),
            onComplete: this.__stop_drag.bind(this),
            onDrag: this.__dragging.bind(this),
            limit: {x: [0 - this.options.width + 20,
                        window.getSize().x - 20],
                    y: [0, window.getSize().y - 20]}
        });
        
        this._resize = new Element("div.toolkit-resize").inject(this.element);
        this.resize = this.element.makeResizable({
            handle: this._resize,
            onStart: this.__start_resize.bind(this),
            onComplete: this.__stop_resize.bind(this),
            onDrag: this.__resizing.bind(this),
            limit: {x: [this.options.min_width, this.__max_width()],
                    y: [this.options.min_height, this.__max_height()]}
        });
        
        this.set("resizable", this.options.resizable);
        this.set("draggable", this.options.draggable);
        
        this._build_header();
        this._build_footer();
        
        this.set("maximize", this.options.maximize);
        //this.set("shrink", this.options.shrink);
        //this.set("minimize", this.options.minimize);
        
        this.redraw();
        this.initialized();
    },
    
    redraw: function () {
        this._set_dimensions();
        this._set_position();
        this._set_content();
        this.parent();
    },
    
    destroy: function () {
        this._title.destroy();
        this._status.destroy();
        this._icon.destroy();
        this._content.destroy();
        this._header_left.destroy();
        this._header_center.destroy();
        this._header_right.destroy();
        this._footer_left.destroy();
        this._footer_center.destroy();
        this._footer_right.destroy();
        this._header.destroy();
        this._footer.destroy();
        this._resize.destroy();
        this.close.destroy();
        this.maximize.destroy();
        this.maximize_vert.destroy();
        this.maximize_horiz.destroy();
        this.minimize.destroy();
        this.shrink.destroy();
        this.element.destroy();
        this.parent();
    },
    
    toggle_maximize: function () {
        if (!this.__vert_max() || !this.__horiz_max())
            this.set("maximize", {x: true, y: true});
        else
            this.set("maximize", {x: false, y: false});
        this.fireEvent("maximizetoggled", [this, this.options.maximize]);
    },
    toggle_maximize_vertical: function () {
        this.set("maximize", {y: !this.options.maximize.y});
        this.fireEvent("maximizetoggled", [this, this.options.maximize]);
    },
    toggle_maximize_horizontal: function () {
        this.set("maximize", {x: !this.options.maximize.x});
        this.fireEvent("maximizetoggled", [this, this.options.maximize]);
    },
    toggle_minimize: function () {
        this.set("minimize", !this.options.minimize);
        this.fireEvent("minimizetoggled", [this, this.options.minimize]);
    },
    toggle_shrink: function () {
        this.set("shrink", !this.options.shrink);
        this.fireEvent("shrinktoggled", [this, this.options.shrink]);
    },
    
    // HELPERS & STUFF
    _set_dimensions: function () {
        this.options.width = Math.min(this.__max_height(),
                             Math.max(this.options.width,
                                      this.options.min_width));
        this.options.height = Math.min(this.__max_width(),
                              Math.max(this.options.height,
                                       this.options.min_height));
        if (this.__horiz_max()) {
            this.element.outerWidth(window.getSize().x);
            this.dimensions.width = window.getSize().x;
        } else {
            this.element.outerWidth(this.options.width);
            this.dimensions.width = this.options.width;
        }
        if (this.__vert_max()) {
            this.element.outerHeight(window.getSize().y);
            this.dimensions.height = window.getSize().y;
        } else {
            this.element.outerHeight(this.options.height);
            this.dimensions.height = this.options.height;
        }
        this.dimensions.x2 = this.dimensions.x1 + this.dimensions.width;
        this.dimensions.y2 = this.dimensions.y1 + this.dimensions.height;
        this._set_content();
        this.fireEvent("dimensionschanged", [this, this.dimensions]);
    },
    _set_position: function () {
        var width  = this.element.innerWidth();
        var height = this.element.innerHeight();
        pos = this._translate_anchor(this.options.anchor,
                                     this.options.x,
                                     this.options.y,
                                     -width,
                                     -height);
        if (this.__horiz_max()) {
            this.element.setStyle("left", this.options.fixed ? 0 : window.scrollX);
        } else {
            this.element.setStyle("left", pos.x);
        }
        if (this.__vert_max()) {
            this.element.setStyle("top", this.options.fixed ? 0 : window.scrollY);
        } else {
            this.element.setStyle("top", pos.y);
        }
        this.dimensions.x      = this.options.x;
        this.dimensions.y      = this.options.y;
        this.dimensions.x1     = pos.x;
        this.dimensions.y1     = pos.y;
        this.dimensions.x2     = pos.x + this.dimensions.width;
        this.dimensions.y2     = pos.y + this.dimensions.height;
        this.fireEvent("positionchanged", [this, this.dimensions]);
    },
    _set_content: function () {
        var elmt = this.element.innerHeight();
        var head = this._header.outerHeight();
        var foot = this._footer.outerHeight();
        this._content.outerHeight(elmt - head - foot);
        if (this.options.width == _TOOLKIT_VAR)
            this._content.setStyle("width", "auto");
        else
            this._content.outerWidth(this.element.innerWidth());
        this._content.setStyle("top", head);
        this.fireEvent("contentresized", [this]);
    },
    _init_position: function (pos) {
        if (pos) {
            var x0 = this.options.fixed ? 0 : window.scrollX;
            var y0 = this.options.fixed ? 0 : window.scrollY;
            var pos1 = this._translate_anchor(
                this.options.open, x0, y0,
                window.getSize().x - this.options.width,
                window.getSize().y - this.options.height);
            var pos2 = this._translate_anchor(
                this.options.anchor, pos1.x, pos1.y,
                this.options.width,
                this.options.height);
            this.options.x = pos2.x;
            this.options.y = pos2.y;
        }
        this._set_dimensions();
        this._set_position();
    },
    
    _build_header: function () {
        this.__build_from_const("header_left");
        this.__build_from_const("header_center");
        this.__build_from_const("header_right");
        this._check_header();
        this.fireEvent("headerchanged", [this]);
    },
    _build_footer: function () {
        this.__build_from_const("footer_left");
        this.__build_from_const("footer_center");
        this.__build_from_const("footer_right");
        this._check_footer();
        this.fireEvent("footerchanged", [this]);
    },
    __build_from_const: function (element) {
        for (var i = 0; i < this.options[element].length; i++) {
            var targ;
            switch (this.options[element][i]) {
                case _TOOLKIT_CLOSE:
                    targ = this.close.element;
                    break;
                case _TOOLKIT_MAXIMIZE:
                    targ = this.maximize.element;
                    break;
                case _TOOLKIT_MAXIMIZE_X:
                    targ = this.maximize_horiz.element;
                    break;
                case _TOOLKIT_MAXIMIZE_Y:
                    targ = this.maximize_vert.element;
                    break;
                case _TOOLKIT_MINIMIZE:
                    targ = this.minimize.element;
                    break;
                case _TOOLKIT_SHRINK:
                    targ = this.shrink.element;
                    break;
                case _TOOLKIT_TITLE:
                    targ = this._title;
                    break;
                case _TOOLKIT_STATUS:
                    targ = this._status;
                    break;
                case _TOOLKIT_ICON:
                    targ = this._icon;
                    break;
            }
            targ.inject(this["_" + element]);
        }
    },
    
    _check_header: function (hold) {
        // checks whether to hide or show the header element
        if (!this._header_left.get("html")
         && !this._header_center.get("html")
         && !this._header_right.get("html")) {
            this._header.setStyle("display", "none");
        } else {
            this._header.setStyle("display", "block");
            this._header_center.setStyle("left", this._header_left.outerWidth());
            this.__size_header();
        }
    },
    __size_header: function () {
        this._header_center.outerWidth(
          this._header.innerWidth()
        - this._header_left.outerWidth()
        - this._header_right.outerWidth());
    },
    _check_footer: function (hold) {
        // checks whether to hide or show the footer element
        if (!this._footer_left.get("html")
         && !this._footer_center.get("html")
         && !this._footer_right.get("html")) {
            this._footer.setStyle("display", "none");
        } else {
            this._footer.setStyle("display", "block");
            this._footer_center.setStyle("left", this._footer_left.outerWidth());
            this.__size_footer();
        }
    },
    __size_footer: function () {
        this._footer_center.outerWidth(
          this._footer.innerWidth()
        - this._footer_left.outerWidth()
        - this._footer_right.outerWidth());
    },
    
    __vert_max: function () {
        // returns if maximized vertically
        return this.options.maximize.y;
    },
    __horiz_max: function () {
        // returns true if maximized horizontally
        return this.options.maximize.x;
    },
    __max_width: function () {
        // returns the max width of the window
        return (this.options.max_width < 0 ? 999999999 : this.options.max_width);
    },
    __max_height: function () {
        // returns the max height of the window
        return (this.options.max_height < 0 ? 999999999 : this.options.max_height);
    },
    
    _translate_anchor: function (anchor, x, y, width, height) {
        switch (anchor) {
            case _TOOLKIT_TOP_LEFT:
                break;
            case _TOOLKIT_TOP:
                x += width / 2;
                break;
            case _TOOLKIT_TOP_RIGHT:
                x += width;
                break;
            case _TOOLKIT_LEFT:
                y += height / 2;
                break;
            case _TOOLKIT_CENTER:
                x += width / 2;
                y += height / 2;
                break;
            case _TOOLKIT_RIGHT:
                x += width;
                y += height / 2;
                break;
            case _TOOLKIT_BOTTOM_LEFT:
                y += height;
                break;
            case _TOOLKIT_BOTTOM:
                x += width / 2;
                y += height;
                break;
            case _TOOLKIT_BOTTOM_RIGHT:
                x += width;
                y += height;
                break;
        }
        return {x: Math.round(x), y: Math.round(y)};
    },
    
    // EVENT STUFF
    __start_drag: function (el, ev) {
        // if window is maximized, we have to replace the window according
        // to the position of the mouse
        var x = y = 0;
        if (this.__vert_max()) {
            var y = (!this.options.fixed ? window.scrollY : 0);
        }
        if (this.__horiz_max()) {
            var x = ev.client.x - (ev.client.x / window.getSize().x)
                                * this.options.width;
            x += (!this.options.fixed ? window.scrollX : 0);
        }
        var pos = this._translate_anchor(
            this.options.anchor, x, y, this.options.width, this.options.height);
        
        if (this.__horiz_max()) this.options.x = pos.x;
        if (this.__vert_max())  this.options.y = pos.y;
        
        this.drag.value.now.x += x;
        this.drag.mouse.now.x += x;
        this.drag.mouse.pos.x -= x;
        this.drag.value.now.y += y;
        this.drag.mouse.now.y += y;
        this.drag.mouse.pos.y -= y;
        
        // un-maximize
        if (this.__horiz_max()) this.set("maximize", {x: false});
        if (this.__vert_max())  this.set("maximize", {y: false});
        
        this.dragging = true;
        this.element.addClass("toolkit-dragging");
        this.fireEvent("startdrag", [this, ev]);
    },
    __stop_drag: function (el, ev) {
        this.dragging = false;
        this.__set_position();
        this.element.removeClass("toolkit-dragging");
        this.fireEvent("stopdrag", [this, ev]);
    },
    __dragging: function (el, ev) {
        this.__set_position();
        this.fireEvent("dragging", [this, ev]);
    },
    __set_position: function () {
        var pos  = this.element.getPosition();
        var pos1 = this._translate_anchor(this.options.anchor, pos.x, pos.y,
                                          this.options.width, this.options.height);
        this.dimensions.x      = this.options.x = pos1.x;
        this.dimensions.y      = this.options.y = pos1.y;
        this.dimensions.x1     = pos.x;
        this.dimensions.y1     = pos.y;
        this.dimensions.x2     = pos.x + this.dimensions.width;
        this.dimensions.y2     = pos.y + this.dimensions.height;
    },
    __start_resize: function (el, ev) {
        this.__docmouse = $$("body")[0].getStyle("cursor");
        $$("body")[0].setStyle("cursor", this._resize.getStyle("cursor"));
        this.resizing = true;
        this.element.addClass("toolkit-resizing");
        this.fireEvent("startresize", [this, ev]);
    },
    __stop_resize: function (el, ev) {
        $$("body")[0].setStyle("cursor", this.__docmouse);
        this.resizing = false;
        this.element.removeClass("toolkit-resizing");
        this._set_content();
        this._check_header(true);
        this._check_footer(true);
        this.__set_dimensions();
        this.fireEvent("stopresize", [this, ev]);
    },
    __resizing: function (el, ev) {
        if (this.options.resizing == _TOOLKIT_CONTINUOUS) {
            this._set_content();
            this.__size_header(true);
            this.__size_footer(true);
            this.__set_dimensions();
        }
        this.fireEvent("resizing", [this, ev]);
    },
    __set_dimensions: function () {
        var x = this.element.outerWidth();
        var y = this.element.outerHeight();
        this.dimensions.width  = this.options.width  = x;
        this.dimensions.height = this.options.height = y;
        this.dimensions.x2     = x + this.dimensions.x1;
        this.dimensions.y2     = y + this.dimensions.y1;
    },
    
    __mout: function (e) {
        if(this.options.auto_active && !this.dragging && !this.resizing)
            this.element.removeClass("toolkit-active");
    },
    __mover: function (e) {
        if(this.options.auto_active)
            this.element.addClass("toolkit-active");
    },
    __close: function () {
        this.fireEvent("closeclicked");
        if (this.options.auto_close)
            this.destroy();
    },
    __maximize: function () {
        if (this.options.auto_maximize) this.toggle_maximize();
        this.fireEvent("maximizeclicked", [this, this.options.maximize]);
    },
    __maximizevertical: function () {
        if (this.options.auto_maximize) this.toggle_maximize_vertical();
        this.fireEvent("maximizeverticalclicked", [this, this.options.maximize.y]);
    },
    __maximizehorizontal: function () {
        if (this.options.auto_maximize) this.toggle_maximize_horizontal();
        this.fireEvent("maximizehorizontalclicked", [this, this.options.maximize.x]);
    },
    __minimize: function () {
        if (this.options.auto_minimize) this.toggle_minimize();
        this.fireEvent("minimizeclicked", [this, this.options.minimize]);
    },
    __shrink: function () {
        if (this.options.auto_shrink) this.toggle_shrink();
        this.fireEvent("shrinkclicked", [this, this.options.shrink]);
    },
    __header_action: function () {
        switch (this.options.header_action) {
            case _TOOLKIT_SHRINK:
                this.toggle_shrink();
                break;
            case _TOOLKIT_MAX:
                this.toggle_maximize();
                break;
            case _TOOLKIT_MAX_X:
                this.toggle_maximize_horizontal();
                break;
            case _TOOLKIT_MAX_Y:
                this.toggle_maximize_vertical();
                break;
            case _TOOLKIT_MIN:
                this.toggle_minimize();
                break;
            case _TOOLKIT_CLOSE:
                this.destroy();
                break;
        }
        this.fireEvent("headeraction", [this, this.options.header_action]);
    },
        
    // GETTERS & SETTERS
    set: function (key, value, hold) {
        switch (key) {
            case "maximize":
                if (this.options.shrink)
                    this._footer.setStyle("display", "block");
                this.options.shrink = false;
                if (value === false) value = this.options.maximize = {x: false, y: false};
                value = Object.merge(this.options.maximize, value);
                if (this.__horiz_max()) {
                    this.element.addClass("toolkit-maximized-horizontal");
                } else {
                    this.element.removeClass("toolkit-maximized-horizontal");
                }
                if (this.__vert_max()) {
                    this.element.addClass("toolkit-maximized-vertical");
                } else {
                    this.element.removeClass("toolkit-maximized-vertical");
                }
                if (!hold) this.redraw();
                break;
        }
        
        this.options[key] = value;
        
        switch (key) {
            case "container":
                this.element.inject(value);
                if (!this.__inited) {
                    this.__inited = true;
                    if (!hold) this._init_position(this.options.open);
                }
                break;
            case "anchor":
                this.dimensions.anchor = value;
                if (!hold) {
                    this._set_dimensions();
                    this._set_position();
                }
                break;
            case "width":
                if (!hold) this._set_dimensions();
                break;
            case "height":
                if (!hold) this._set_dimensions();
                break;
            case "x":
                if (!hold) this._set_position();
                break;
            case "y":
                if (!hold) this._set_position();
                break;
            case "z_index":
                if (!hold) this.element.setStyle("z-index", value);
                break;
            case "title":
                if (!hold) this._title.set("html", value);
                break;
            case "status":
                if (!hold) this._status.set("html", value);
                break;
            case "icon":
                if (!hold) {
                    this._icon.set("src", value);
                    this._icon.setStyle("display", value ? "block" : "none"); 
                }
                break;
            case "header_left":
            case "header_right":
            case "header_center":
                if (typeOf(value) != "array") {
                    this.options[key] = [value];
                    value = [value];
                }
                if (!hold) {
                    this._build_header();
                    this._set_content();
                }
                break;
            case "footer_left":
            case "footer_right":
            case "footer_center":
                if (typeOf(value) != "array") {
                    this.options[key] = [value];
                    value = [value];
                }
                if (!hold) {
                    this._build_footer();
                    this._set_content();
                }
                break;
            case "active":
                if (value) this.element.addClass("toolkit-active");
                else       this.element.removeClass("toolkit-active");
                break;
            case "fixed":
                this.element.setStyle("position", value ? "fixed" : "absolute");
                if (!hold) this._set_position();
                break;
            case "content":
                this._content.set("html", value);
                break;
            case "shrink":
                this.options.maximize.y = false;
                if (!hold) {
                    this.element.setStyle("height",
                    value ? this._header.outerHeight() : this.options.height);
                    this._footer.setStyle("display", value ? "none" : "block");
                }
                break;
            case "minimize":
                if (!hold) {
                    if (value) {
                        this.element.dispose()
                    } else {
                        this.set("container", this.options.container)
                        this.redraw();
                    }
                }
                break;
            case "draggable":
                if (value) this.drag.attach();
                else this.drag.detach();
                break;
            case "resizable":
                if (value) {
                    this.resize.attach();
                    this._resize.setStyle("display", "block");
                } else {
                    this.resize.detach();
                    this._resize.setStyle("display", "none");
                }
                break;
            case "min_width":
            case "max_width":
            case "min_height":
            case "max_height":
                break;
        }
        this.parent(key, value, hold);
    }
});
