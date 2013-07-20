Select = new Class({
    // Select provides a button with a select list to choose from
    // different options.
    
    Extends: Button,
    options: {
        list: [],
        selected: false,
        auto_size: true
    },
    __open: false,
    __width: 0,
    initialize: function (options)  {
        this.parent(options);
        this.element.addClass("toolkit-select");
        
        this.addEvent("click", function (e) {
            this.show_list(!this.__open);
        }.bind(this));
        
        this._list = new Element("ul.toolkit-select-list");
        this._list.set("tween", {
            onComplete: this._hide_list.bind(this)
        });
        document.addEvent("click", function () {
            if (this.__open && !this.__transition) {
                this.show_list(false);
            }
        }.bind(this));
        
        this._arrow = new Element("div.toolkit-arrow").inject(this.element)
        
        this.set("options", this.options.list);
        
        this.initialized();
    },
    list: {},
    destroy: function () {
        this._list.destroy();
        this.element.destroy();
        this.parent();
    },
    set_options: function (list) {
        this._list.empty();
        this.list = {};
        this.add_options(list);
    },
    add_options: function (list) {
        for (var i = 0; i < list.length; i++)
            this.add_option(list[i], true);
        this.resize();
    },
    add_option: function (option, hold) {
        var li = new Element("li.toolkit-option");
        li.inject(this._list);
        var opt = {};
        opt.element = li;
        opt.title = (typeof option == "string")
                       ? option : typeof options.title != "undefined"
                       ? options.title : option.value
        opt.value = (typeof option == "string") ? option : typeof options.value;
        
        li.set("html", opt.title);
        li.addEvent("click", function (e) {
            this.fireEvent("select", [opt.value, li, this, opt]);
            this.select(opt.title);
            
        }.bind(this));
        
        this.list[opt.value] = opt;
        
        if (this.options.selected == opt.value) {
            this.select(opt.value);
        }
        
        if (!hold) this.resize();
    },
    remove_option: function (key) {
        if (typeof this.list[key] != "undefined") {
            this.list.key.destroy();
        }
        if (this.options.selected == key) {
            this.options.selected = false;
            this.set("label", "");
        }
    },
    remove_options: function (list) {
        for (var i = 0; i < list.length; i++)
            this.remove_option(list[i]);
    },
    resize: function () {
        if (!this.options.auto_size) {
            this.element.setStyle("width", null);
            return;
        };
        for (var i in this.list) {
            var t = this._label.get("html");
            this._label.set("html", this.list[i].title);
            this.__width = Math.max(this.__width, this.element.outerWidth());
            this.element.outerWidth(this.__width + 1);
            this._label.set("html", t);
        }
    },
    select: function (key) {
        if (this.list[key]) {
            this.set("label", this.list[key].title);
            if (this.options.selected) {
                this.list[this.options.selected].element.removeClass("toolkit-active");
            }
            this.list[key].element.addClass("toolkit-active");
            this.options.selected = key;
        }
    },
    show_list: function (show) {
        if (show) {
            var pos = this.element.getPosition();
            pos.y += this.element.outerHeight();
            this._list.inject($$("body")[0]);
            var lw = this._list.outerWidth();
            var lh = this._list.outerHeight();
            var cw = window.getSize().x;
            var ch = window.getSize().y;
            var sx = (window.pageXOffset !== undefined) ? window.pageXOffset
                   : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
            var sy = (window.pageYOffset !== undefined) ? window.pageYOffset
                   : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            this._list.setStyles({
                "top": Math.min(this.element.getPosition().y + this.element.outerHeight(), ch + sy - lh),
                "left": Math.min(this.element.getPosition().x, cw + sx - lw),
                "opacity": 0,
            });
        }
        this.__transition = true;
        this._list.tween("opacity", show ? 1 : 0);
        this.__open = show;
    },
    _hide_list: function () {
        this.__transition = false;
        if (!this.__open) {
            this._list.dispose()
        }
    },
    
    set: function (key, value, hold) {
        this.options[key] = value;
        switch (key) {
            case "options":
                this.set_options(value);
                break;
            case "selected":
                this.select(value);
                break;
            case "auto_size":
                this.resize();
                break;
        }
        this.parent(key, value, hold);
    }
});
