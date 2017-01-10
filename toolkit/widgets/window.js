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
 
 /**
 * The <code>useraction</code> event is emitted when a widget gets modified by user interaction.
 * The event is emitted for the options <code>maximize</code>, <code>minimize</code>, <code>shrink</code>, <code>width</code>, <code>height</code>, <code>x</code> and <code>y</code>.
 * 
 * @event TK.Window#useraction
 * 
 * @param {string} name - The name of the option which was changed due to the users action
 * @param {mixed} value - The new value of the option
 * 
 */
 
"use strict";
(function(w, TK){
function header_action() {
    switch (this.options.header_action) {
        case "shrink":
            this.toggle_shrink();
            break;
        case "maximize":
            this.toggle_maximize();
            break;
        case "maximize-horizontal":
            this.toggle_maximize_horizontal();
            break;
        case "maximize-vertical":
            this.toggle_maximize_vertical();
            break;
        case "minimize":
            this.toggle_minimize();
            break;
        case "close":
            this.destroy();
            break;
    }
    /**
     * The user double-clicked on the header.
     * 
     * @event TK.Window.headeraction
     * 
     * @param {string} action - The function which was executed, e.g. <code>shrink</code>, <code>maximize</code> or <code>close</code>.
     */
    this.fire_event("headeraction", this.options.header_action);
}
function mout(e) {
    if(this.options.auto_active && !this.dragging && !this.resizing)
        TK.remove_class(this.element, "toolkit-active");
}
function mover(e) {
    if(this.options.auto_active)
        TK.add_class(this.element, "toolkit-active");
}
function max_height() {
    // returns the max height of the window
    return (this.options.max_height < 0 ? Number.MAX_SAFE_INTEGER : this.options.max_height);
}
function max_width() {
    // returns the max width of the window
    return (this.options.max_width < 0 ? Number.MAX_SAFE_INTEGER : this.options.max_width);
}
function close(e) {
    /**
     * The user clicked the close button.
     * 
     * @event TK.Window.closeclicked
     */
    this.fire_event("closeclicked");
    if (this.options.auto_close)
        this.destroy();
}
function maximize(e) {
    if (this.options.auto_maximize) this.toggle_maximize();
    /**
     * The user clicked the maximize button.
     * 
     * @event TK.Window.maximizeclicked
     * 
     * @param {Object} maximize - The maximize option.
     */
    this.fire_event("maximizeclicked", this.options.maximize);
    this.fire_event("useraction", "maximize", this.options.maximize);
}
function maximizevertical(e) {
    if (this.options.auto_maximize) this.toggle_maximize_vertical();
    /**
     * The user clicked the maximize-vertical button.
     * 
     * @event TK.Window.maximizeverticalclicked
     * 
     * @param {Object} maximize - The maximize option.
     */
    this.fire_event("maximizeverticalclicked", this.options.maximize.y);
    this.fire_event("useraction", "maximize", this.options.maimize);
}
function maximizehorizontal(e) {
    if (this.options.auto_maximize) this.toggle_maximize_horizontal();
    /**
     * The user clicked the maximize-horizontal button.
     * 
     * @event TK.Window.maximizehorizontalclicked
     * 
     * @param {Object} maximize - The maximize option.
     */
    this.fire_event("maximizehorizontalclicked", this.options.maximize.x);
    this.fire_event("useraction", "maximize", this.options.maximize);
}
function minimize(e) {
    if (this.options.auto_minimize) this.toggle_minimize();
    /**
     * The user clicked the minimize button.
     * 
     * @event TK.Window.minimizeclicked
     * 
     * @param {Object} minimize - The minimize option.
     */
    this.fire_event("minimizeclicked", this.options.minimize);
    this.fire_event("useraction", "minimize", this.options.minimize);
}
function shrink(e) {
    if (this.options.auto_shrink) this.toggle_shrink();
    /**
     * The user clicked the shrink button.
     * 
     * @event TK.Window.shrinkclicked
     * 
     * @param {Object} shrink - The shrink option.
     */
    this.fire_event("shrinkclicked", this.options.shrink);
    this.fire_event("useraction", "shrink", this.options.shrink);
}
function start_resize(el, ev) {
    this.__docmouse = TK.get_style(document.body, "cursor");
    document.body.style.cursor = TK.get_style(this._resize, "cursor");
    this.resizing = true;
    TK.add_class(this.element, "toolkit-resizing");
    /**
     * The user starts resizing the window.
     * 
     * @event TK.Window.startresize
     * 
     * @param {DOMEvent} event - The DOM event.
     */
    this.fire_event("startresize", ev);
}
function stop_resize(el, ev) {
    document.body.style.cursor = this.__docmouse;
    this.resizing = false;
    TK.remove_class(this.element, "toolkit-resizing");
    set_content.call(this);
    check_header.call(this, true);
    check_footer.call(this, true);
    calculate_dimensions.call(this);
    /**
     * The user stops resizing the window.
     * 
     * @event TK.Window.stopresize
     * 
     * @param {DOMEvent} event - The DOM event.
     */
    this.fire_event("stopresize", ev);
}
function resizing(el, ev) {
    if (this.options.resizing === "continuous") {
        set_content.call(this);
        size_header.call(this, true);
        size_footer.call(this);
        calculate_dimensions.call(this);
    }
    /**
     * The user resizes the window.
     * 
     * @event TK.Window.resizing
     * 
     * @param {DOMEvent} event - The DOM event.
     */
    this.fire_event("resizing", ev);
    
    this.fire_event("useraction", "width", this.options.width);
    this.fire_event("useraction", "height", this.options.height);
}
function build_header() {
    build_from_const.call(this, "header_left");
    build_from_const.call(this, "header_center");
    build_from_const.call(this, "header_right");
    check_header.call(this, false);
    /**
     * The header changed.
     * 
     * @event TK.Window.headerchanged
     */
    this.fire_event("headerchanged");
}
function build_footer() {
    build_from_const.call(this, "footer_left");
    build_from_const.call(this, "footer_center");
    build_from_const.call(this, "footer_right");
    check_footer.call(this, false);
    /**
     * The footer changed.
     * 
     * @event TK.Window.footerchanged
     */
    this.fire_event("footerchanged");
}
function set_content() {
    /**
     * The content was set.
     * 
     * @event TK.Window.contentresized
     */
    this.fire_event("contentresized");
}
function size_header() {
    TK.outer_width(this._header_center, true,
      TK.inner_width(this._header)
    - TK.outer_width(this._header_left, true)
    - TK.outer_width(this._header_right, true));
}
function calculate_dimensions() {
    var x = TK.outer_width(this.element, true);
    var y = TK.outer_height(this.element, true);
    this.dimensions.width  = this.options.width  = x;
    this.dimensions.height = this.options.height = y;
    this.dimensions.x2     = x + this.dimensions.x1;
    this.dimensions.y2     = y + this.dimensions.y1;
}
function calculate_position() {
    var posx  = TK.position_left(this.element);
    var posy  = TK.position_top(this.element);
    var pos1 = this.translate_anchor(this.options.anchor, posx, posy,
                                      this.options.width, this.options.height);
    this.dimensions.x      = this.options.x = pos1.x;
    this.dimensions.y      = this.options.y = pos1.y;
    this.dimensions.x1     = posx;
    this.dimensions.y1     = posy;
    this.dimensions.x2     = posx + this.dimensions.width;
    this.dimensions.y2     = posy + this.dimensions.height;
}
function horiz_max() {
    // returns true if maximized horizontally
    return this.options.maximize.x;
}
function vert_max() {
    // returns if maximized vertically
    return this.options.maximize.y;
}
function check_header(hold) {
    // checks whether to hide or show the header element
    if (!this._header_left.firstChild
     && !this._header_center.firstChild
     && !this._header_right.firstChild) {
        this._header.style.display = "none";
    } else {
        this._header.style.display = "block";
        this._header_center.style.left = TK.outer_width(this._header_left, true) + "px";
        size_header.call(this);
    }
}
function check_footer(hold) {
    // checks whether to hide or show the footer element
    if (!this._footer_left.firstChild
     && !this._footer_center.firstChild
     && !this._footer_right.firstChild) {
        this._footer.style.display = "none";
    } else {
        this._footer.style.display = "block";
        this._footer_center.style.left = TK.outer_width(this._footer_left, true) + "px";
        size_footer.call(this);
    }
}
function start_drag(ev, el) {
    // if window is maximized, we have to replace the window according
    // to the position of the mouse
    var x = y = 0;
    if (vert_max.call(this)) {
        var y = (!this.options.fixed ? window.scrollY : 0);
    }
    if (horiz_max.call(this)) {
        var x = ev.clientX - (ev.clientX / TK.width())
                            * this.options.width;
        x += (!this.options.fixed ? window.scrollX : 0);
    }
    var pos = this.translate_anchor(
        this.options.anchor, x, y, this.options.width, this.options.height);
    
    if (horiz_max.call(this)) this.options.x = pos.x;
    if (vert_max.call(this))  this.options.y = pos.y;
    
    this.drag._xpos += x;
    this.drag._ypos += y;
    
    TK.add_class(this.element, "toolkit-dragging");
    /**
     * The user starts dragging the window.
     * 
     * @event TK.Window.startdrag
     * 
     * @param {DOMEvent} event - The DOM event.
     */
    this.fire_event("startdrag", ev);
    
    this.fire_event("useraction", "x", this.options.x);
    this.fire_event("useraction", "y", this.options.y);
}
function stop_drag(ev, el) {
    this.dragging = false;
    calculate_position.call(this);
    TK.remove_class(this.element, "toolkit-dragging");
    /**
     * The user stops dragging the window.
     * 
     * @event TK.Window.stopdrag
     * 
     * @param {DOMEvent} event - The DOM event.
     */
    this.fire_event("stopdrag", ev);
    
    this.fire_event("useraction", "x", this.options.x);
    this.fire_event("useraction", "y", this.options.y);
}
function dragging(ev, el) {
    if (!this.dragging) {
        this.dragging = true;
        // un-maximize
        if (horiz_max.call(this)) {
            this.set("maximize", {x: false});
            this.fire_event("useraction", "maximize", this.options.maximize);
        }
        if (vert_max.call(this)) {
            this.set("maximize", {y: false});
            this.fire_event("useraction", "maximize", this.options.maximize);
        }
    }
    calculate_position.call(this);
    /**
     * The user is dragging the window.
     * 
     * @event TK.Window.dragging
     * 
     * @param {DOMEvent} event - The DOM event.
     */
    this.fire_event("dragging", ev);
    
    this.fire_event("useraction", "x", this.options.x);
    this.fire_event("useraction", "y", this.options.y);
}
function size_footer() {
    TK.outer_width(this._footer_center, true,
      TK.inner_width(this._footer)
    - TK.outer_width(this._footer_left, true)
    - TK.outer_width(this._footer_right, true));
}
function init_position(pos) {
    if (pos) {
        var x0 = this.options.fixed ? 0 : window.scrollX;
        var y0 = this.options.fixed ? 0 : window.scrollY;
        var pos1 = this.translate_anchor(
            this.options.open, x0, y0,
            window.innerWidth - this.options.width,
            window.innerHeight - this.options.height);
        var pos2 = this.translate_anchor(
            this.options.anchor, pos1.x, pos1.y,
            this.options.width,
            this.options.height);
        this.options.x = pos2.x;
        this.options.y = pos2.y;
    }
    set_dimensions.call(this);
    set_position.call(this);
}
function set_position() {
    var width  = TK.inner_width(this.element);
    var height = TK.inner_height(this.element);
    var pos = this.translate_anchor(this.options.anchor,
                                 this.options.x,
                                 this.options.y,
                                 -width,
                                 -height);
    if (horiz_max.call(this)) {
        this.element.style.left = (this.options.fixed ? 0 : window.scrollX) + "px";
    } else {
        this.element.style.left = pos.x + "px";
    }
    if (vert_max.call(this)) {
        this.element.style.top = (this.options.fixed ? 0 : window.scrollY) + "px";
    } else {
        this.element.style.top = pos.y + "px";
    }
    this.dimensions.x      = this.options.x;
    this.dimensions.y      = this.options.y;
    this.dimensions.x1     = pos.x;
    this.dimensions.y1     = pos.y;
    this.dimensions.x2     = pos.x + this.dimensions.width;
    this.dimensions.y2     = pos.y + this.dimensions.height;
    /**
     * The position of the window changed.
     * 
     * @event TK.Window.positionchanged
     * 
     * @param {Object} event - The {@link TK.Window#dimensions} dimensions object.
     */
    this.fire_event("positionchanged", this.dimensions);
}
function set_dimensions() {
    if (this.options.width >= 0) {
        this.options.width = Math.min(max_width.call(this),
                             Math.max(this.options.width,
                                      this.options.min_width));
        if (horiz_max.call(this)) {
            TK.outer_width(this.element, true, TK.width());
            this.dimensions.width = TK.width();
        } else {
            TK.outer_width(this.element, true, this.options.width);
            this.dimensions.width = this.options.width;
        }
    } else {
        this.dimensions.width = TK.outer_width(this.element);
    }
    if (this.options.height >= 0) {
        this.options.height = Math.min(max_height.call(this),
                              Math.max(this.options.height,
                                       this.options.min_height));
        if (vert_max.call(this)) {
            TK.outer_height(this.element, true, TK.height());
            this.dimensions.height = TK.height();
        } else {
            TK.outer_height(this.element, true, this.options.height);
            this.dimensions.height = this.options.height;
        }
    } else {
        this.dimensions.height = TK.outer_height(this.element, true);
    }
    this.dimensions.x2 = this.dimensions.x1 + this.dimensions.width;
    this.dimensions.y2 = this.dimensions.y1 + this.dimensions.height;
    set_content.call(this);
    /**
     * The dimensions of the window changed.
     * 
     * @event TK.Window.dimensionschanged
     * 
     * @param {Object} event - The {@link TK.Window#dimensions} dimensions object.
     */
    this.fire_event("dimensionschanged", this.dimensions);
}
function build_from_const(element) {
    for (var i = 0; i < this.options[element].length; i++) {
        var targ;
        switch (this.options[element][i]) {
            case "close":
                targ = this.close.element;
                break;
            case "maximize":
                targ = this.maximize.element;
                break;
            case "maximize-horizontal":
                targ = this.maximize_horiz.element;
                break;
            case "maximize-vertical":
                targ = this.maximize_vert.element;
                break;
            case "minimize":
                targ = this.minimize.element;
                break;
            case "shrink":
                targ = this.shrink.element;
                break;
            case "title":
                targ = this._title;
                break;
            case "status":
                targ = this._status;
                break;
            case "icon":
                targ = this._icon;
                break;
        }
        this["_" + element].appendChild(targ);

    }
}
    
TK.Window = TK.class({
    /**
     * This widget is a flexible overlay window.
     *
     * @class TK.Window
     * 
     * @extends TK.Container
     * 
     * @param {Object} options
     * 
     * @property {Number} [options.width=500] - Initial width, can be a CSS length or an integer (pixels).
     * @property {Number} [options.height=200] - Initial height, can be a CSS length or an integer (pixels).
     * @property {Number} [options.x=0] - X position of the window.
     * @property {Number} [options.y=0] - Y position of the window.
     * @property {Number} [options.min_width=64] - Minimum width of the window.
     * @property {Number} [options.max_width=-1] - Maximum width of the window, -1 ~ infinite.
     * @property {Number} [options.min_height=64] - Minimum height of the window.
     * @property {Number} [options.max_height=-1] - Maximum height of the window, -1 ~ infinite.
     * @property {String} [options.anchor="top-left"] - Anchor of the window, can be one out of
     *   "top-left", "top", "top-right",
     *   "left", "center", "right",
     *   "bottom-left", "bottom", "bottom-right"
     * @property {Boolean} [options.modal=false] - If modal window blocks all other elements
     * @property {String} [options.dock=false] - Docking of the window, can be one out of
     *   "top-left", "top", "top-right",
     *   "left", "center", "right",
     *   "bottom-left", "bottom", "bottom-right"
     * @property {Object|Boolean} [options.maximize=false] - Boolean or object with members <code>x</code> and <code>y</code> as boolean to determine the maximized state.
     * @property {Boolean} [options.minimize=false] - Minimize window (does only make sense with a
     *   window manager application to keep track of it)
     * @property {Boolean} [options.shrink=false] - Shrink rolls the window up into the title bar.
     * @property {String|HTMLElement} [options.content=""] - The content of the window.
     * @property {String} [options.open="center"] - initial position of the window, can be one out of
     *   "top-left", "top", "top-right",
     *   "left", "center", "right",
     *   "bottom-left", "bottom", "bottom-right"
     * @property {Integer} [options.z_index=10000] - Z index for piling windows. does make more sense
     *   when used together with a window manager
     * @property {String|Array<String>} [options.header_left=["icon"]] - Single element or array of
     *   "title", "icon",
     *   "close", "minimize",
     *   "shrink",
     *   "maximize", "maximize-vertical"
     *   "maximize-horizontal", "status".
     * @property {String|Array<String>} [options.header_center=["title"]] - Single element or array of
     *   "title", "icon",
     *   "close", "minimize",
     *   "shrink",
     *   "maximize", "maximize-vertical"
     *   "maximize-horizontal", "status".
     * @property {String|Array<String>} [options.header_right=["maximize", "close"]] - Single element or array of
     *   "title", "icon",
     *   "close", "minimize",
     *   "shrink",
     *   "maximize", "maximize-vertical"
     *   "maximize-horizontal", "status".
     * @property {String|Array<String>} [options.footer_left=[]] - Single element or array of
     *   "title", "icon",
     *   "close", "minimize",
     *   "shrink",
     *   "maximize", "maximize-vertical"
     *   "maximize-horizontal", "status".
     * @property {String|Array<String>} [options.footer_center=[]] - Single element or array of
     *   "title", "icon",
     *   "close", "minimize",
     *   "shrink",
     *   "maximize", "maximize-vertical"
     *   "maximize-horizontal", "status".
     * @property {String|Array<String>} [options.footer_right=[]] - Single element or array of
     *   "title", "icon",
     *   "close", "minimize",
     *   "shrink",
     *   "maximize", "maximize-vertical"
     *   "maximize-horizontal", "status".
     * @property {String} [options.title=""] - Window title.
     * @property {String} [options.status=""] Window status.
     * @property {String} [options.icon=""] URL to window icon.
     * @property {Boolean} [options.fixed=true] - Whether the window sticks to the viewport
     *   rather than the document
     * @property {Boolean} [options.auto_active=false] - Auto-toggle the active-class when mouseovered
     * @property {Boolean} [options.auto_close=true] - Set whether close destroys the window or not
     * @property {Boolean} [options.auto_maximize=true] - Set whether maximize toggles the window or not
     * @property {Boolean} [options.auto_minimize=true] - Set whether minimize toggles the window or not
     * @property {Boolean} [options.auto_shrink=true] - Set whether shrink toggles the window or not
     * @property {Boolean} [options.draggable=true] - Set whether the window is draggable
     * @property {Boolean} [options.resizable=true] - Set whether the window is resizable
     * @property {String} [options.resizing="continuous"] - Resizing policy, "continuous"
     *   or "compressor"LETE
     * @property {Number} [options.header_action="maximize"] - Action for double clicking the window header, one out of "close", "minimize",
     *   "shrink",
     *   "maximize", "maximize-vertical"
     *   "maximize-horizontal"
     * @property {Boolean} [options.active=true] - Active state of the window.
     * @property {Integer} [options.hide_status=0] - If set to !0 status message hides after [n] milliseconds.
     */
    _class: "Window",
    Extends: TK.Container,
    Implements: TK.Anchor,
    _options: Object.assign(Object.create(TK.Container.prototype._options), {
        width: "number",
        height: "number",
        x: "number",
        y: "number",
        min_width: "number",
        max_width: "number",
        min_height: "number",
        max_height: "number",
        anchor: "string",
        modal: "boolean",
        dock: "boolean",
        maximize: "boolean",
        minimize: "boolean",
        shrink: "boolean",
        open: "int",
        z_index: "int",
        header_left: "array",
        header_center: "array",
        header_right: "array",
        footer_left: "array",
        footer_center: "array",
        footer_right: "array",
        title: "string",
        status: "string",
        icon: "string",
        fixed: "boolean",
        auto_active: "boolean",
        auto_close: "boolean",
        auto_maximize: "boolean",
        auto_minimize: "boolean",
        auto_shrink: "boolean",
        draggable: "boolean",
        resizable: "boolean",
        resizing: "int",
        header_action: "int",
        active: "boolean",
        hide_status: "int",
    }),
    options: {
        width:         500,   // initial width, can be a css length, an int (pixels)
        height:        200,   // initial height, can be a css length, an int (pixels)
        x:             0,     // X position of the window
        y:             0,     // Y position of the window
        min_width:     64,   // minimum width
        max_width:     -1,    // maximum width, -1 ~ infinite
        min_height:    64,   // minimum height
        max_height:    -1,    // maximum height, -1 ~ infinite
        anchor:        "top-left", // anchor of the window, can be one out of:
                       // "top-left", "top", "top-right",
                       // "left", "center", "right",
                       // "bottom-left", "bottom", "bottom-right"
        modal:         false, // if modal window blocks all other elements
        dock:          false,   // docking of the window, can be one out of:
                       // "top-left", "top", "top-right",
                       // "left", "center", "right",
                       // "bottom-left", "bottom", "bottom-right"
        maximize:      false, // false or object with members x and y as bool
        minimize:      false, // minimize window (does only make sense with a
                              // window manager application to keep track of it)
        shrink:        false, // shrink rolls the window up into the title bar
        content:       "",
        open:          "center", // initial position of the window, can be one out of:
                       // "top-left", "top", "top-right",
                       // "left", "center", "right",
                       // "bottom-left", "bottom", "bottom-right"
        z_index:       10000, // z index for piling windows. does make more sense
                              // when used together with a window manager
        header_left:   ["icon"], // single element or array of:
                                        // "title", "icon",
                                        // "close", "minimize",
                                        // "shrink",
                                        // "maximize", "maximize-vertical"
                                        // "maximize-horizontal", "status"
        header_center: ["title"],
        header_right:  ["maximize", "close"],
        footer_left:   [],
        footer_center: [],
        footer_right:  [],
        title:         "",
        status:        "",
        icon:          "",
        fixed:         true, // whether the window sticks to the viewport
                              // rather than the document
        auto_active:   false, // auto-toggle the active-class when mouseovered
        auto_close:    true,  // set whether close destroys the window or not
        auto_maximize: true,  // set whether maximize toggles the window or not
        auto_minimize: true,  // set whether minimize toggles the window or not
        auto_shrink:   true,  // set whether shrink toggles the window or not
        draggable:     true,  // set whether the window is draggable
        resizable:     true,   // set whether the window is resizable
        resizing:      "continuous",// resizing policy, "continuous"
                                           // or "compressor"LETE
        header_action: "maximize",  // "close", "minimize",
                                           // "shrink",
                                           // "maximize", "maximize-vertical"
                                           // "maximize-horizontal"
        active:        true,
        hide_status:   0 // if set to !0 status message hides after n milliseconds
    },
    static_events: {
        mouseenter: mover,
        mouseleave: mout,
    },
    initialize: function (options) {
        this.dimensions = {anchor: "top-left", x: 0, x1: 0, x2: 0, y: 0, y1: 0, y2: 0, width: 0, height: 0};
        TK.Container.prototype.initialize.call(this, options);
        
        TK.add_class(this.element, "toolkit-window");
        
        this._header = TK.element("div", "toolkit-header");
        this._footer = TK.element("div", "toolkit-footer");
        this._content = TK.element("div", "toolkit-content");

        this.element.appendChild(this._header);
        this.element.appendChild(this._footer);
        this.element.appendChild(this._content);
        
        this._header_left =
            (toolkit.element("div", "toolkit-header-left"));
        this._header_center =
            (toolkit.element("div", "toolkit-header-center"));
        this._header_right =
            (toolkit.element("div", "toolkit-header-right"));

        this._header.appendChild(this._header_left);
        this._header.appendChild(this._header_center);
        this._header.appendChild(this._header_right);
        
        this._footer_left = (toolkit.element("div", "toolkit-footer-left"));
        this._footer_center = (toolkit.element("div", "toolkit-footer-center"));
        this._footer_right = (toolkit.element("div", "toolkit-footer-right"));

        this._footer.appendChild(this._footer_left);
        this._footer.appendChild(this._footer_center);
        this._footer.appendChild(this._footer_right);
            
        this._title  = TK.element("div", "toolkit-title");
        this._status = TK.element("div", "toolkit-status");
        this._icon   = TK.element("img", "toolkit-icon");
        
        this.close = new TK.Button({"class": "toolkit-close"});
        this.close.add_event("click", close.bind(this));
        this.close.add_event("mousedown", function (e) { e.stopPropagation(); });
        
        this.maximize = new TK.Button({"class": "toolkit-maximize"});
        this.maximize.add_event("click", maximize.bind(this));
        this.maximize.add_event("mousedown", function (e) { e.stopPropagation(); });
        
        this.maximize_vert = new TK.Button({"class": "toolkit-maximize-vertical"});
        this.maximize_vert.add_event("click", maximizevertical.bind(this));
        this.maximize_vert.add_event("mousedown", function (e) { e.stopPropagation(); });
        
        this.maximize_horiz = new TK.Button({"class": "toolkit-maximize-horizontal"});
        this.maximize_horiz.add_event("click", maximizehorizontal.bind(this));
        this.maximize_horiz.add_event("mousedown", function (e) { e.stopPropagation(); });
        
        this.minimize = new TK.Button({"class": "toolkit-minimize"});
        this.minimize.add_event("click", minimize.bind(this));
        this.minimize.add_event("mousedown", function (e) { e.stopPropagation(); });
        
        this.shrink = new TK.Button({"class": "toolkit-shrink"});
        this.shrink.add_event("click", shrink.bind(this));
        this.shrink.add_event("mousedown", function (e) { e.stopPropagation(); });
        
        this.__buttons = [this.close, this.maximize, this.maximize_vert,
                          this.maximize_horiz, this.minimize, this.shrink];
        for (var i = 0; i < this.__buttons.length; i++) {
            this.__buttons[i].element.appendChild(
                TK.element("div", "toolkit-icon")
            );
            this.__buttons[i]._icon.remove();
            this.__buttons[i]._label.remove();
        }
        
        this.set("width", this.options.width, true);
        this.set("height", this.options.height, true);
        this.set("x", this.options.x, true);
        this.set("y", this.options.y, true);
        this.set("z_index", this.options.z_index);
        this.set("title", this.options.title);
        this.set("hide_status", this.options.hide_status);
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
        
        this.__dblclick_cb = header_action.bind(this)
        this._header.addEventListener("dblclick", this.__dblclick_cb);
        
        this.drag = new TK.Drag({
            node        : this.element,
            handle      : this._header,
            onDragstart : start_drag.bind(this),
            onDragstop  : stop_drag.bind(this),
            onDragging  : dragging.bind(this),
            min         : {x: 0 - this.options.width + 20, y: 0},
            max         : {x: TK.width() - 20, y: TK.height() - 20}
        });
        
        this._resize = TK.element("div", "toolkit-resize");
        this.element.appendChild(this._resize);
        
        this.Resize = new TK.Resize({
            node         : this.element,
            handle       : this._resize,
            min          : {x: this.options.min_width, y: this.options.min_height},
            max          : {x: max_width.call(this), y: max_height.call(this)},
            onResizestart : start_resize.bind(this),
            onResizestop : stop_resize.bind(this),
            onResizing   : resizing.bind(this)
        });
        
        init_position.call(this, this.options.open);
        
        this.set("resizable", this.options.resizable);
        this.set("draggable", this.options.draggable);
        
        build_header.call(this);
        build_footer.call(this);
        
        this.set("maximize", this.options.maximize);
        //this.set("shrink", this.options.shrink);
        //this.set("minimize", this.options.minimize);
    },
    
    redraw: function () {
        var I = this.invalid;
        set_dimensions.call(this);
        set_position.call(this);
        set_content.call(this);
        /* TODO: prevent TK.Container from setting the content */
        I.content = false;
        TK.Container.prototype.redraw.call(this);
    },
    
    destroy: function () {
        this._header.addEventListener("dblclick", this.__dblclick_cb);

        this._title.remove();
        this._status.remove();
        this._icon.remove();
        this._content.remove();
        this._header_left.remove();
        this._header_center.remove();
        this._header_right.remove();
        this._footer_left.remove();
        this._footer_center.remove();
        this._footer_right.remove();
        this._header.remove();
        this._footer.remove();
        this._resize.remove();
        this.close.destroy();
        this.maximize.destroy();
        this.maximize_vert.destroy();
        this.maximize_horiz.destroy();
        this.minimize.destroy();
        this.shrink.destroy();
        this.element.remove();
        TK.Container.prototype.destroy.call(this);
    },
    
    /**
     * Appends a new child to the window content area.
     * 
     * @method TK.Window#append_child
     * 
     * @param {TK.Widget} child - The child widget to add to the windows content area.
     */
    append_child : function(child) {
        child.set("container", this._content);
        this.add_child(child);
    },
    
    /**
     * Toggles the overall maximize state of the window.
     * 
     * @method TK.Window#toggle_maximize
     * 
     * @param {Boolean} maximize - State of maximization. If window is already
     *   maximized in one or both directions it is un-maximized, otherwise maximized.
     */
    toggle_maximize: function () {
        if (!vert_max.call(this) || !horiz_max.call(this))
            this.set("maximize", {x: true, y: true});
        else
            this.set("maximize", {x: false, y: false});
    },
    /**
     * Toggles the vertical maximize state of the window.
     * 
     * @method TK.Window#toggle_maximize_vertical
     * 
     * @param {Boolean} maximize - The new vertical maximization.
     */
    toggle_maximize_vertical: function () {
        this.set("maximize", {y: !this.options.maximize.y});
    },
    /**
     * Toggles the horizontal maximize state of the window.
     * 
     * @method TK.Window#toggle_maximize_horizontal
     * 
     * @param {Boolean} maximize - The new horizontal maximization.
     */
    toggle_maximize_horizontal: function () {
        this.set("maximize", {x: !this.options.maximize.x});
    },
    /**
     * Toggles the minimize state of the window.
     * 
     * @method TK.Window#toggle_minimize
     * 
     * @param {Boolean} minimize - The new minimization.
     */
    toggle_minimize: function () {
        this.set("minimize", !this.options.minimize);
    },
    /**
     * Toggles the shrink state of the window.
     * 
     * @method TK.Window#toggle_shrink
     * 
     * @param {Boolean} shrink - The new shrink state.
     */
    toggle_shrink: function () {
        this.set("shrink", !this.options.shrink);
    },
    
    set: function (key, value, hold) {
        switch (key) {
            case "maximize":
                if (this.options.shrink)
                    this._footer.style.display = "block";
                this.options.shrink = false;
                if (value === false) value = this.options.maximize = {x: false, y: false};
                else value = Object.assign(this.options.maximize, value);
                if (value.x) {
                    TK.add_class(this.element, "toolkit-maximized-horizontal");
                } else {
                    TK.remove_class(this.element, "toolkit-maximized-horizontal");
                }
                if (value.y) {
                    TK.add_class(this.element, "toolkit-maximized-vertical");
                } else {
                    TK.remove_class(this.element, "toolkit-maximized-vertical");
                }
                break;
        }
        
        this.options[key] = value;
        
        switch (key) {
            case "anchor":
                this.dimensions.anchor = value;
                if (!hold) {
                    set_dimensions.call(this);
                    set_position.call(this);
                }
                break;
            case "width":
                if (!hold) set_dimensions.call(this);
                break;
            case "height":
                if (!hold) set_dimensions.call(this);
                break;
            case "x":
                if (!hold) set_position.call(this);
                break;
            case "y":
                if (!hold) set_position.call(this);
                break;
            case "z_index":
                if (!hold) this.element.style.zIndex = value;
                break;
            case "title":
                if (!hold) TK.set_content(this._title, value);
                break;
            case "status":
                if (!hold) {
                    if (value)
                        TK.set_content(this._status, value);
                    else
                        TK.empty(this._status);
                    if (this.options.hide_status) {
                        if (this.__status_to)
                            window.clearTimeout(this.__status_to);
                        if (value)
                            this.__status_to = window.setTimeout(function () {
                                this.set("status", false);
                                this.__status_to = false;
                            }.bind(this), this.options.hide_status);
                    }
                }
                break;
            case "icon":
                if (!hold) {
                    this._icon.setAttribute("src", value);
                    this._icon.style.display = value ? "block" : "none"; 
                }
                break;
            case "header_left":
            case "header_right":
            case "header_center":
                if (!Array.isArray(value)) {
                    this.options[key] = [value];
                    value = [value];
                }
                if (!hold) {
                    build_header.call(this);
                    set_content.call(this);
                }
                break;
            case "footer_left":
            case "footer_right":
            case "footer_center":
                if (!Array.isArray(value)) {
                    this.options[key] = [value];
                    value = [value];
                }
                if (!hold) {
                    build_footer.call(this);
                    set_content.call(this);
                }
                break;
            case "fixed":
                this.element.style.position = value ? "fixed" : "absolute";
                if (!hold) set_position.call(this);
                break;
            case "content":
                TK.set_content(this._content, value);
                break;
            case "shrink":
                this.options.maximize.y = false;
                if (!hold) {
                    if (value)
                        this.add_class("toolkit-shrinked");
                    else
                        this.remove_class("toolkit-shrinked");
                }
                break;
            case "minimize":
                if (!hold) {
                    if (value) {
                        this.element.remove();
                    } else {
                        this.set("container", this.options.container)
                    }
                }
                break;
            case "draggable":
                if (value) {
                    //this.drag.set("active", true);
                    TK.add_class(this.element, "toolkit-draggable");
                } else {
                    //this.drag.set("active", false);
                    TK.remove_class(this.element, "toolkit-draggable");
                }
                break;
            case "resizable":
                if (value) {
                    this.Resize.set("active", true);
                    TK.add_class(this.element, "toolkit-resizable");
                } else {
                    this.Resize.set("active", false);
                    TK.remove_class(this.element, "toolit-resizable");
                }
                break;
            case "min_width":
            case "max_width":
            case "min_height":
            case "max_height":
                break;
            case "active":
                if (value) {
                    //this.drag.set("active", true);
                    TK.add_class(this.element, "toolkit-active");
                } else {
                    //this.drag.set("active", false);
                    TK.remove_class(this.element, "toolkit-active");
                }
                break;
        }
        return TK.Container.prototype.set.call(this, key, value, hold);
    }
});
})(this, this.TK);
