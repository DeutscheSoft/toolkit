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
 * The event is emitted for the option <code>show</code>.
 *
 * @event TK.Knob#useraction
 * @param {string} name - The name of the option which was changed due to the users action
 * @param {mixed} value - The new value of the option
 */
 
"use strict";
(function(w){
function hide_arrows() {
    if (!this._prev.parentNode) return;
    var E = this.element;
    if (E.firstChild === this._prev) E.removeChild(this._prev);
    if (E.lastChild === this._next) E.removeChild(this._next);
    TK.remove_class(E, "toolkit-over");
    this.trigger_resize();
}
function show_arrows() {
    if (this._prev.parentNode) return;
    this.element.insertBefore(this._prev, this._clip);
    this.element.appendChild(this._next);
    TK.add_class(this.element, "toolkit-over");
    this.trigger_resize();
}
function prev_clicked(e) {
    this.useraction("show", this.options.show - 1);
}

function next_clicked(e) {
    this.useraction("show", this.options.show + 1);
}

function button_clicked(button) {
    this.useraction("show", this.buttons.indexOf(button));
}

w.TK.ButtonArray = w.ButtonArray = $class({
    /**
     * TK.ButtonArray is a list of buttons ({@link TK.Button}) layouted
     * either vertically or horizontally. TK.ButtonArray automatically
     * adds arrow buttons if the overal width is smaller than the buttons
     * list.
     *
     * @param {Object} options
     * 
     * @property {Array} [options.buttons=[]] - A list of button options
     *   or label strings which is converted to button instances on init.
     *   If get is called, the converted list of button instances is
     *   returned.
     * @property {boolean} [options.auto_arrows=true] - If arrow buttons are
     *   added automatically
     * @property {string} [options.direction="horizontal"] - The direction of
     *   the button list, either "horizontal" or "vertical".
     * @property {integer|TK.Button} [options.show=-1] - The button to scroll
     *   to, either the button index starting from zero or the button object
     *   itself.
     * 
     * @class TK.ButtonArray
     * 
     * @extends TK.Container
     */
    _class: "ButtonArray",
    Extends: TK.Container,
    _options: Object.assign(Object.create(TK.Container.prototype._options), {
        buttons: "array",
        auto_arrows: "boolean",
        direction: "string",
        show: "int",
        resized: "boolean",
    }),
    options: {
        buttons: [],
        auto_arrows: true,
        direction: "horizontal",
        show: -1,
        resized: false,
    },
    initialize: function (options) {
        /**
         * @member {Array} TK.ButtonArray#buttons - An array holding all buttons.
         */
        this.buttons = [];
        TK.Container.prototype.initialize.call(this, options);
        /**
         * @member {HTMLDivElement} TK.ButtonArray#element - The main DIV container.
         *   Has class <code>toolkit-buttonarray</code>.
         */
        TK.add_class(this.element, "toolkit-buttonarray");
        /**
         * @member {HTMLDivElement} TK.ButtonArray#_clip - A clipping area containing the list of buttons.
         *    Has class <code>toolkit-clip</code>.
         */
        this._clip      = TK.element("div", "toolkit-clip");
        /**
         * @member {HTMLDivElement} TK.ButtonArray#_container - A container for all the buttons.
         *    Has class <code>toolkit-container</code>.
         */
        this._container = TK.element("div", "toolkit-container");
        this.element.appendChild(this._clip);
        this._clip.appendChild(this._container);
        
        var vert = this.get("direction") === "vertical";
        
        /**
         * @member {TK.Button} TK.ButtonArray#prev - The previous arrow {@link TK.Button} instance.
         */
        this.prev = new TK.Button({class: "toolkit-previous"});
        /**
         * @member {TK.Button} TK.ButtonArray#next - The next arrow {@link TK.Button} instance.
         */
        this.next = new TK.Button({class: "toolkit-next"});
        this.prev.add_event("click", prev_clicked.bind(this));
        this.next.add_event("click", next_clicked.bind(this));
        
        /**
         * @member {HTMLDivElement} TK.ButtonArray#_prev - The HTMLDivElement of the previous button.
         */
        this._prev = this.prev.element;
        /**
         * @member {HTMLDivElement} TK.ButtonArray#_next - The HTMLDivElement of the next button.
         */
        this._next = this.next.element;
        
        this.set("direction", this.options.direction);
        this.add_children([this.prev, this.next]);
        this.add_buttons(this.options.buttons);
        this._sizes = null;
    },
    
    resize: function () {
        var tmp, e;

        this._sizes = {
            container: this._container.getBoundingClientRect(),
            clip: {
                height: TK.inner_height(this._clip),
                width: TK.inner_width(this._clip),
            },
            buttons: [],
            buttons_pos: [],
            element: this.element.getBoundingClientRect(),
        };

        for (var i = 0; i < this.buttons.length; i++) {
            e = this.buttons[i].element;
            this._sizes.buttons[i] = e.getBoundingClientRect();
            this._sizes.buttons_pos[i] = { left: e.offsetLeft, top: e.offsetTop };
        }

        TK.Container.prototype.resize.call(this);
    },
    
    /**
     * Adds an array of buttons to the end of the list.
     *
     * @method TK.ButtonArray#add_buttons
     * 
     * @param {Array.<string|object>} options - An Array containing objects
     *   with options for the buttons (see {@link TK.Button} for more
     *   information) or strings for the buttons labels.
     */
    add_buttons: function (options) {
        for (var i = 0; i < options.length; i++)
            this.add_button(options[i]);
    },
    
    /**
     * Adds a {@link TK.Button} to the TK.ButtonArray.
     *
     * @method TK.ButtonArray#add_button
     * 
     * @param {Object|string} options - An object containing options for the
     *   {@link TK.Button} to add or a string for the label.
     * @param {integer} [position] - The position to add the {@link TK.Button}
     *   to. If avoided the {@link TK.Button} is added to the end of the list.
     * 
     * @returns {TK.Button} The {@link TK.Button} instance.
     */
    add_button: function (options, position) {
        if (typeof options === "string")
            options = {label: options}
        var b    = new TK.Button(options);
        var len  = this.buttons.length;
        var vert = this.options.direction === "vertical";
        if (position === void(0))
            position = this.buttons.length;
        if (position === len) {
            this.buttons.push(b);
            this._container.appendChild(b.element);
        } else {
            this.buttons.splice(position, 0, b);
            this._container.insertBefore(b.element,
                this._container.childNodes[position]);
        }

        this.add_child(b);

        this.trigger_resize();
        b.add_event("click", button_clicked.bind(this, b));
        /**
         * A {@link TK.Button} was added to the ButtonArray.
         *
         * @event TK.ButtonArray#added
         * 
         * @param {TK.Button} button - The button which was added to ButtonArray.
         */
        if (b === this.current())
            b.set("state", true);
        this.fire_event("added", b);

        return b;
    },
    /**
     * Removes a {@link TK.Button} from the ButtonArray.
     *
     * @method TK.ButtonArray#remove_button
     * 
     * @param {integer|TK.Button} button - Button index or the {@link TK.Button}
     *   instance.
     */
    remove_button: function (button) {
        if (typeof button === "object")
            button = this.buttons.indexOf(button);
        if (button < 0 || button >= this.buttons.length)
            return;
        /**
         * A {@link TK.Button} was removed from the ButtonArray.
         *
         * @event TK.ButtonArray#removed
         * 
         * @param {TK.Button} button - The {@link TK.Button} instance which was removed.
         */
        this.fire_event("removed", this.buttons[button]);
        if (this.current() && button <= this.options.show) {
            this.options.show --;
            this.invalid.show = true;
            this.trigger_draw();
        }
        this.buttons[button].destroy();
        this.buttons.splice(button, 1);
        this.trigger_resize();
    },
    
    destroy: function () {
        for (var i = 0; i < this.buttons.length; i++)
            this.buttons[i].destroy();
        this.prev.destroy();
        this.next.destroy();
        this._container.remove();
        this._clip.remove();
        TK.Container.prototype.destroy.call(this);
    },

    redraw: function() {
        TK.Container.prototype.redraw.call(this);
        var I = this.invalid;
        var O = this.options;

        if (I.direction) {
            var E = this.element;
            TK.remove_class(E, "toolkit-vertical", "toolkit-horizontal");
            TK.add_class(E, "toolkit-"+O.direction);
        }

        if (I.validate("direction", "auto_arrows") || I.resized) {
            if (O.auto_arrows && O.resized) {
                var dir      = O.direction === "vertical";
                var subd     = dir ? 'top' : 'left';
                var subs     = dir ? 'height' : 'width';

                var elemsize = this._sizes.element[subs];
                var listsize = this._sizes.buttons_pos[this.buttons.length-1][subd] +
                               this._sizes.buttons[this.buttons.length-1][subs];

                if (listsize > elemsize)
                    show_arrows.call(this);
                else
                    hide_arrows.call(this);
            } else if (!O.auto_arrows) {
                hide_arrows.call(this);
            }
        }
        if (I.validate("show", "direction", "resized")) {
            if (O.resized) {
                if (O.show >= 0 && O.show < this.buttons.length) {
                    /* move the container so that the requested button is shown */
                    var dir      = O.direction === "vertical";
                    var subd     = dir ? 'top' : 'left';
                    var subs     = dir ? 'height' : 'width';

                    var btnrect  = this._sizes.buttons[O.show];
                    var clipsize = this._sizes.clip[subs];
                    var listsize = this._sizes.buttons_pos[this.buttons.length-1][subd] +
                                   this._sizes.buttons[this.buttons.length-1][subs];
                    var btnsize  = this._sizes.buttons[O.show][subs];
                    var btnpos   = this._sizes.buttons_pos[O.show][subd];

                    this._container.style[subd] = -(Math.max(0, Math.min(listsize - clipsize, btnpos - (clipsize / 2 - btnsize / 2)))) + "px";
                }
            }
        }
    },
    
    /**
     * The currently active button.
     *
     * @method TK.ButtonArray#current
     * 
     * @returns {TK.Button} The active {@link TK.Button} or null.
     */
    current: function() {
        var n = this.options.show;
        if (n >= 0 && n < this.buttons.length) {
            return this.buttons[n];
        }
        return null;
    },
    
    set: function (key, value) {
        var button;
        if (key === "show") {
            if (value < 0) value = 0;
            if (value >= this.buttons.length) value = this.buttons.length - 1;
            if (value === this.options.show) return value;

            button = this.current();
            if (button) button.set("state", false);
        }
        value = TK.Container.prototype.set.call(this, key, value);
        switch (key) {
            case "show":
                button = this.current();
                if (button) {
                    button.set("state", true);
                    /**
                     * Is fired when a button is activated.
                     * 
                     * @event TK.ButtonArray#changed
                     * 
                     * @param {TK.Button} button - The {@link TK.Button} which was clicked.
                     * @param {int} the ID of the clicked {@link TK.Button}.
                     */
                    this.fire_event("changed", button, value);
                }
                break;
            case "buttons":
                for (var i = 0; i < this.buttons.length; i++)
                    this.buttons[i].destroy();
                this.buttons = [];
                this.add_buttons(value);
                break;
            case "direction":
                this.prev.set("label", value === "vertical" ? "\u25B2" : "\u25C0");
                this.next.set("label", value === "vertical" ? "\u25BC" : "\u25B6");
                break;
        }
        return value;
    },
    get: function (key) {
        if (key === "buttons") return this.buttons;
        return TK.Container.prototype.get.call(this, key);
    }
});
})(this);
