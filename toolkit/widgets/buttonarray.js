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
function hide_arrows() {
    var E = this.element;
    if (E.firstChild == this._prev) E.removeChild(this._prev);
    if (E.lastChild == this._next) E.removeChild(this._next);
    TK.remove_class(E, "toolkit-over");
}
function show_arrows() {
    this.element.insertBefore(this._prev, this._clip);
    this.element.appendChild(this._next);
    TK.add_class(this.element, "toolkit-over");
}
function check_arrows(force) {
    var I = this.invalid;
    var O = this.options;
    if (!I.check_arrows && O.auto_arrows) {
        I.check_arrows = true;
        this.trigger_draw();
    }
}

function prev_clicked(e) {
    /**
     * When a {@link TK.Button} or an arrow gets clicked and
     * the currently active button changes.
     *
     * @event clicked
     * @type Button
     */
    this.set("show", this.options.show - 1);
}

function next_clicked(e) {
    this.set("show", this.options.show + 1);
}

function button_clicked(button) {
    this.set("show", this.buttons.indexOf(button));
}

function scroll_to() {
    /* move the container so that the requested button is shown */
    /* hand over a button instance or a number */

    // TODO: the id==this.options.show check breaks the button array. for some reason
    // the style calculations here can be completely wrong on the first time and get
    // ignored henceforward
    var current = this.current();
    if (current) {
        var n = this.buttons.indexOf(current);
        var dir      = this.options.direction == _TOOLKIT_VERTICAL;
        var subd     = dir ? 'top' : 'left';
        var subs     = dir ? 'height' : 'width';

        /* FORCE_RELAYOUT */

        TK.S.add(function() {
            var btnrect  = this._container.childNodes[n].getBoundingClientRect();
            var conrect  = this._container.getBoundingClientRect();
            var clipsize = this._clip.getBoundingClientRect()[subs];
            var listsize = conrect[subs];
            var btnsize  = btnrect[subs];
            var btnpos   = btnrect[subd] - conrect[subd];

            /* WILL_INVALIDATE */

            TK.S.add(function() {
                this._container.style[subd] = -(Math.max(0, Math.min(listsize - clipsize, btnpos - (clipsize / 2 - btnsize / 2)))) + "px";
            }.bind(this));
        }.bind(this), 1);
    }
}
w.TK.ButtonArray = w.ButtonArray = $class({
    /**
     * TK.ButtonArray is a list of buttons ({@link TK.Button}) layouted either vertically or
     * horizontally. TK.ButtonArray automatically adds arrow buttons if the
     * overal width is smaller than the buttons list.
     *
     * @class TK.ButtonArray
     * 
     * @property {Array} [options.buttons=[]] - A list of button options. or label strings which
     *                              is converted to button instances
     *                              on init. If get is called, the
     *                              converted list of button instances is
     *                              returned.
     * @property {boolean} [options.auto_arrows=true] - If arrow buttons are added automatically
     * @property {integer} [options.direction=_TOOLKIT_HORIZONTAL] - The direction of the button list, one out of
     *                          _TOOLKIT_HORIZONTAL or _TOOLKIT_VERTICAL
     * @property {integer|TK.Button} [options.show=-1] - The button to scroll to, either an ID or a button instance
     * 
     * @extends TK.Container
     * 
     */
    _class: "ButtonArray",
    Extends: TK.Container,
    _options: Object.assign(Object.create(TK.Container.prototype._options), {
        buttons: "array",
        auto_arrows: "boolean",
        direction: "int",
        show: "int",
    }),
    options: {
        buttons: [],
        auto_arrows: true,
        direction: _TOOLKIT_HORIZONTAL,
        show: -1
    },
    initialize: function (options) {
        this.buttons = [];
        TK.Container.prototype.initialize.call(this, options);
        TK.add_class(this.element, "toolkit-buttonarray");
        /** @member {HTMLDivElement} TK.ButtonArray#_clip - A clipping area containing the list of buttons.
         *      Has class <code>toolkit-clip</code> */
        this._clip      = TK.element("div", "toolkit-clip");
        /** @member {HTMLDivElement} TK.ButtonArray#_container - A container for all the buttons.
         *      Has class <code>toolkit-container</code> */
        this._container = TK.element("div", "toolkit-container");
        this.element.appendChild(this._clip);
        this._clip.appendChild(this._container);
        
        var vert = this.get("direction") == _TOOLKIT_VERTICAL;
        
        /** @member {TK.Button} TK.ButtonArray#prev - The previous arrow {@link TK.Button} instance. */
        this.prev = new TK.Button({label: vert ? "▲" : "◄",
                                class: "toolkit-previous"});
        /** @member {TK.Button} TK.ButtonArray#next - The next arrow {@link TK.Button} instance. */
        this.next = new TK.Button({label: vert ? "▼" : "►",
                                class: "toolkit-next"});
        this.prev.add_event("click", prev_clicked.bind(this));
        this.next.add_event("click", next_clicked.bind(this));
        this._prev = this.prev.element;
        this._next = this.next.element;
        
        this.set("direction", this.options.direction);
        this.add_children([this.prev, this.next]);
        this.add_buttons(this.options.buttons);
    },
    
    resize: function () {
        check_arrows.call(this);
        this.invalid.show = true;
        this.trigger_draw();

        TK.Container.prototype.resize.call(this);
    },
    
    add_buttons: function (options) {
        /**
         * Adds an array of buttons to the end of the list.
         *
         * @param {Array.<string|object>} options - An Array containing objects with options for the buttons (see {@link TK.Button} for more information) or strings for the buttons labels
         * @method TK.add_buttons
         */
        for (var i = 0; i < options.length; i++)
            this.add_button(options[i]);
    },
    
    add_button: function (options, position) {
        /**
         * Adds a {@link TK.Button} to the TK.ButtonArray 
         *
         * @method TK.Button#add_button
         * @param {Object|string} options - An object containing options for the {@link TK.Button} to add or a string for the label
         * @param {integer} [position] - The position to add the {@link TK.Button} to. If avoided the {@link TK.Button} is added to the end of the list
         * @returns {TK.Button} The {@link TK.Button} instance
         */
        if (typeof options === "string")
            options = {label: options}
        var b    = new TK.Button(options);
        var len  = this.buttons.length;
        var vert = this.options.direction == _TOOLKIT_VERT;
        if (typeof position == "undefined")
            position = this.buttons.length;
        if (position == len) {
            this.buttons.push(b);
            this._container.appendChild(b.element);
        } else {
            this.buttons.splice(position, 0, b);
            this._container.insertBefore(b.element,
                this._container.childNodes[position]);
        }

        this.add_child(b);

        check_arrows.call(this);
        b.add_event("click", function () {
            button_clicked.call(this, b);
        }.bind(this));
        /**
         * A {@link TK.Button} was added to the ButtonArray
         *
         * @event added
         * @type Button
         */
        if (b === this.current())
            b.set("state", true);

        this.fire_event("added", b);

        return b;
    },
    remove_button: function (button) {
        /**
         * Removes a {@link TK.Button} from the ButtonArray
         *
         * @method TK.Button#remove_button
         * @param {integer|TK.Button} button - ID or {@link TK.Button} instance
         */
        if (typeof button == "object")
            button = this.buttons.indexOf(button);
        if (button < 0 || button >= this.buttons.length)
            return;
        /**
         * A {@link TK.Button} was removed from the ButtonArray
         *
         * @event removed
         * @type Button
         */
        this.fire_event("removed", this.buttons[button]);
        if (this.current() && button <= this.options.show) {
            this.options.show --;
            this.invalid.show = true;
            this.trigger_draw();
        }
        this.buttons[button].destroy();
        this.buttons.splice(button, 1);
        check_arrows.call(this);
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
            TK.remove_class(E, "toolkit-vertical");
            TK.remove_class(E, "toolkit-horizontal");
            TK.add_class(E, O.direction == _TOOLKIT_VERT ? "toolkit-vertical" : "toolkit-horizontal");
        }

        if (I.auto_arrows || I.direction) {
            I.auto_arrows = false;
            if (!O.auto_arrows) {
                hide_arrows.call(this);
                I.show = true;
            } else {
                I.check_arrows = true;
            }
        }

        if (I.check_arrows || I.direction) {
            I.check_arrows = false;
            if (O.auto_arrows) {
                /* we invalidate show and direction here because the scroll_to case
                 * will be trigger from here later */
                I.show = I.direction = false;
                TK.S.add(function() {
                    var erect = this.element.getBoundingClientRect();
                    var brect = this._container.getBoundingClientRect();
                    var subs  = O.direction == _TOOLKIT_VERT ? "height" : "width";
                    TK.S.add(function() {
                        if (brect[subs] > erect[subs])
                            show_arrows.call(this);
                        else
                            hide_arrows.call(this);

                        scroll_to.call(this);
                    }.bind(this));
                }.bind(this), 1);
            }
        }
        if (I.validate("show", "direction")) {
            scroll_to.call(this);
        }
    },
    
    current: function() {
        /**
         * Get the actually selected #Button
         *
         * @method TK.Button#current
         * @returns {TK.Button} The selected {@link TK.Button} or null
         */
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
            if (value === this.options.show) return;

            button = this.current();
            if (button) button.set("state", false);
        }
        value = TK.Container.prototype.set.call(this, key, value);
        switch (key) {
            case "show":
                button = this.current();
                if (button) {
                    button.set("state", true);
                    this.fire_event("changed", button, value);
                }
                break;
            case "buttons":
                if (hold)
                    break;
                for (var i = 0; i < this.buttons.length; i++)
                    this.buttons[i].destroy();
                this.buttons = [];
                this.add_buttons(value);
                break;
            case "direction":
                this.prev.set("label", value == _TOOLKIT_VERT ? "▲" : "◀");
                this.next.set("label", value == _TOOLKIT_VERT ? "▼" : "▶");
                break;
        }
        return value;
    },
    get: function (key) {
        if (key == "buttons") return this.buttons;
        return TK.Container.prototype.get.call(this, key);
    }
});
})(this);
