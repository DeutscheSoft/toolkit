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

Widget = new Class({
    // Widget is the base class for all widgets drawing DOM elements. It
    // provides basic functionality like delegating events, setting options and
    // firing some events.Widget implements AudioMath, Options and Events.
    ____options_: {
        // these options are of less use and only here to show what we need
        container: false, // A DOM element as container to inject the element
                          // into
        id:        "",    // a id toset on the element. If omitted a random
                          // string is generated.
        "class":   "",    // A CSS class to add to the main element
        styles:    {},    // If an element was stylized, styles can be applied
        active:    true   // Widgets can be disabled by setting this to false
    },
    Implements: [AudioMath, Options, Events],
    initialize: function (options) {
        // Main actions every widget needs to take
        this.fireEvent("initialize", this);
        this.setOptions(Object.merge(this.____options_, options));
        if (!this.options.id)
            this.options.id = String.uniqueID();
        return this;
    },
    initialized: function () {
        // Main actions every widget needs to take
        this.fireEvent("initialized", this);
        return this;
    },
    redraw: function () {
        this.fireEvent("redraw", this);
        return this;
    },
    destroy: function () {
        this.fireEvent("destroy", this);
        return this;
    },
    
    delegate: function (element) {
        // Takes a DOM element and delegates its main events to the widget class
        element.addEvents({
            "mouseenter" : function (e) {
                this.fireEvent("mouseenter", [e, this, element]); }.bind(this),
            "mouseleave" : function (e) {
                this.fireEvent("mouseleave", [e, this, element]); }.bind(this),
            "mousewheel"  : function (e) {
                this.fireEvent("mousewheel", [e, this, element]); }.bind(this),
            "click"      : function (e) {
                this.fireEvent("click",      [e, this, element]); }.bind(this),
            "mousedown"  : function (e) {
                this.fireEvent("mousedown",  [e, this, element]); }.bind(this),
            "mouseup"    : function (e) {
                this.fireEvent("mouseup",    [e, this, element]); }.bind(this),
            "mousemove"  : function (e) {
                this.fireEvent("mousemove",  [e, this, element]); }.bind(this),
            "startdrag"  : function (e) {
                this.fireEvent("startdrag",  [e, this, element]); }.bind(this),
            "stopdrag"  : function (e) {
                this.fireEvent("stopdrag",   [e, this, element]); }.bind(this),
            "touchstart" : function (e) {
                this.fireEvent("touchstart", [e, this, element]); }.bind(this),
            "touchend"   : function (e) {
                this.fireEvent("touchend",   [e, this, element]); }.bind(this),
            "touchmove"  : function (e) {
                this.fireEvent("touchmove",  [e, this, element]); }.bind(this),
            "dblclick"   : function (e) {
                this.fireEvent("dblclick",   [e, this, element]); }.bind(this),
            "keydown"    : function (e) {
                this.fireEvent("keydown",    [e, this, element]); }.bind(this),
            "keypress"   : function (e) {
                this.fireEvent("keypress",   [e, this, element]); }.bind(this),
            "keyup"      : function (e) {
                this.fireEvent("keyup",      [e, this, element]); }.bind(this),
            "scroll"     : function (e) {
                this.fireEvent("scroll",     [e, this, element]); }.bind(this),
            "focus"      : function (e) {
                this.fireEvent("focus",      [e, this, element]); }.bind(this),
            "blur"       : function (e) {
                this.fireEvent("blur",       [e, this, element]); }.bind(this)
        });
        this.__delegated = element;
        this.fireEvent("delegated", [element, this]);
        return element;
    },
    classify: function (element) {
        // Takes a DOM element and adds its CSS functionality to the
        // widget instance
        this.addClass    = function (c) { element.addClass(c); }.bind(this);
        this.removeClass = function (c) { element.removeClass(c); }.bind(this);
        this.setStyle    = function (c, d) { element.setStyle(c, d); }.bind(this);
        this.setStyles   = function (c) { element.setStyles(c); }.bind(this);
        this.getStyle    = function (c) { return element.getStyle(c); }.bind(this);
        this.__classified = element;
        this.fireEvent("classified", [element, this]);
        return element;
    },
    stylize: function (element) {
        // Marks a DOM element as receiver for the "styles" options
        this.__stylized = element;
        this.set("styles", this.options.styles);
        this.fireEvent("stylized", [element, this]);
        this.set("active", this.options.active);
        return element;
    },
    widgetize: function (element, delegate, classify, stylize) {
        // create a widget from a DOM element. Basically it means to add the id
        // from options and set a basic CSS class. If delegate is true, basic
        // events will be delegated from the element to the widget instance
        // if classify is true, CSS functions will be bound to the widget
        // instance
        element.addClass("toolkit-widget");
        if (this.options.id)
            element.set("id", this.options.id);
        if (this.options["class"])
            element.addClass(this.options["class"]);
        if (delegate)
            this.delegate(element);
        if (classify)
            this.classify(element);
        if (stylize)
            this.stylize(element);
        this.__widgetized = element;
        this.fireEvent("widgetized", [element, this]);
        return element;
    },
    
    "import": function (from, to) {
        
    },
    
    // GETTER & SETTER
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "container":
                if (!hold && this.element)
                    this.element.inject(this.options.container);
                break;
            case "id":
                if (!hold && this.element)
                    this.element.set("id", this.options.id);
                break;
            case "class":
                if (!hold && this.__classified)
                    this.__classified.addClass(this.options["class"]);
                break;
            case "styles":
                if (!hold && this.__stylized)
                    this.__stylized.setStyles(this.options.styles);
                break;
            case "active":
                if (!hold && this.__stylized)
                    if (value)
                        this.__stylized.removeClass("toolkit-inactive")
                    else
                        this.__stylized.addClass("toolkit-inactive")
        }
        this.fireEvent("set", [key, value, hold, this]);
        this.fireEvent("set_" + key, [value, hold, this]);
        return this;
    },
    get: function (key) {
        this.fireEvent("get", [key, this.options[key], this]);
        return this.options[key];
    }
})
