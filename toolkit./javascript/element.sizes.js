Class.refactor(Element, {
    splitCSSnum: function (str) {
        // return value and sign together in an object of "20px", "50%", 2, "0.1em"
        //debug(arguments.callee.caller);
        this._sanitizeSize(str);
        switch (str.substr(-1)) {
            case "%":
                return {unit:"%", value:parseFloat(str.substr(0, str.length -1))}; break;
            case "x":
                return {unit:"px", value:parseFloat(str.substr(0, str.length -2))}; break;
            case "m":
                return {unit:"em", value:parseFloat(str.substr(0, str.length -2))}; break;
            case "t":
                return {unit:"pt", value:parseFloat(str.substr(0, str.length -2))}; break;
        }
        return {unit:"px", value:parseFloat(str)};
    },
    
    _sanitizeSize: function (size) {
        // converts a number to string and appends "px" if neccessary
        if (typeof(size) == "number" || (parseInt(size) + "").length == size.length) {
            size += "px";
        }
        return size;
    },
    
    _width: function (size) {
        // sets the width of an object in px or % including border and padding
        if (size) {
            size = this._sanitizeSize(size);
            var px = this.CSSSize2px(size, this.getParent().getSize().x);
            if (px > -1) {
                if (this.boxModel() != "border-box" ) {
                    var s = this.CSSSpace("padding", "border");
                    px -= (s.left + s.right);
                }
                this.setStyle("width", px)
            } else {
                this.setStyle("width", "auto");
            }
        }
        // returns the width of an object including border and padding
        var w = this.getSize().x;
        var s = this.CSSSpace("padding", "border");
        return w + s.left + s.right;
    },
    
    _height: function (size) {
        // sets the height of an object in px or % including border and padding
        if (size) {
            size = this._sanitizeSize(size);
            var px = this.CSSSize2px(size, this.getParent().getSize().y);
            if (px > -1) {
                if (this.boxModel() != "border-box") {
                    var s = this.CSSSpace("padding", "border");
                    px -= (s.top + s.bottom);
                }
                this.setStyle("height", px)
            } else {
                this.setStyle("height", "auto");
            }
        }
        // returns the height of an object including border and padding
        var h = this.getSize().y;
        var s = this.CSSSpace("padding", "border");
        return h + s.top + s.bottom;
    },
    
    outerWidth: function (size, parent) {
        // sets the overall width of an object in px or % including border, padding
        // and margin
        // if arguments are overloaded (duration [and easing]), the sizing is animated
        //debug(obj, size, parent);
        //debug(arguments.callee.caller);
        var p = (typeof(parent) == "object") ? parent : this.getParent();
        if (size) {
            size = this._sanitizeSize(size);
            var px = this.CSSSize2px(size, p.getSize().x);
            if (px > -1) {
                if (this.boxModel() == "border-box") {
                    var s = this.CSSSpace("margin");
                    px -= (s.left + s.right);
                } else {
                    var s = this.CSSSpace("padding", "border", "margin");
                    px -= (s.left + s.right);
                }
                this.setStyle("width", px)
            } else {
                this.setStyle("width", "auto");
            }   
        }
        // returns the overall width including margin, padding and border
        var w = this.getSize().x;
        var s = this.CSSSpace("margin");
        return w + s.left + s.right;
    },
    
    outerHeight: function (size, parent) {
        // sets the overall height of an object in px or % including border, padding
        // and margin
        var p = (typeof(parent) == "object") ? parent : this.getParent();
        if (size) {
            size = this._sanitizeSize(size);
            var px = this.CSSSize2px(size, p.getSize().y);
            if (px > -1) {
                if (this.boxModel() == "border-box") {
                    var s = this.CSSSpace("margin");
                    px -= (s.top + s.bottom);
                } else {
                    var s = this.CSSSpace("padding", "border", "margin");
                    px -= (s.top + s.bottom);
                }
                this.setStyle("height", px)
            } else {
                this.setStyle("height", "auto");
            }    
        }
        // returns the overall height including margin, padding and border
        var h = this.getSize().y;
        var s = this.CSSSpace("margin");
        return h + s.top + s.bottom;
    },
    
    innerWidth: function (size) {
        if (size) {
            size = this._sanitizeSize(size);
            var px = this.CSSSize2px(size, this.getParent().innerWidth());
            if (this.boxModel() == "border-box") {
                var s = _this.CSSSpace("padding", "border");
                px -= (s.left + s.right);
            }
            this.setStyle("width", px)
        }
//         if (this.boxModel() == "border-box") {
//             return this.getSize().x;
//         } else {
            var s = this.CSSSpace("padding", "border");
            return this.getSize().x - (s.left + s.right);
//         }
    },
    
    innerHeight: function (size) {
        // if arguments are overloaded (duration [and easing]), the sizing is animated
        if (size) {
            size = this._sanitizeSize(size);
            var px = this.CSSSize2px(size, this.getParent().innerHeight());
            if (this.boxModel() == "border-box") {
                var s = this.CSSSpace("padding", "border");
                px -= (s.top + s.bottom);
            }
            this.setStyle("height", px)
        }
//         if (this.boxModel() == "border-box") {
//             return this.getSize().y;
//         } else {
            var s = this.CSSSpace("padding", "border");
            return this.getSize().y - (s.top + s.bottom);
//         }
    },
    
    CSSSpace: function () {
        // get spacings in all directions of an object
        // arguments are strings like "margin", "padding", "border"
        // returns: {top: top, bottom: bot, left: left, right: right, x: x, y: y};
        var top = 0;
        var bot = 0;
        var left = 0;
        var right = 0;
        for (var i = 0; i < arguments.length; i++) {
            var add = (arguments[i] == "border") ? "-width" : "";
            var v = this.getStyle(arguments[i] + add);
            if (v) {
                var va = v.split(" ");
                switch (va.length) {
                    case 1:
                        top += this.CSSSize2px(va[0], this.getSize().y);
                        bot += this.CSSSize2px(va[0], this.getSize().y);
                        left += this.CSSSize2px(va[0], this.getSize().x);
                        right += this.CSSSize2px(va[0], this.getSize().x);
                        break;
                    case 2:
                        top += this.CSSSize2px(va[0], this.getSize().y);
                        bot += this.CSSSize2px(va[0], this.getSize().y);
                        left += this.CSSSize2px(va[1], this.getSize().x);
                        right += this.CSSSize2px(va[1], this.getSize().x);
                        break;
                    case 3:
                        top += thiss.CSSSize2px(va[0], this.getSize().y);
                        bot += this.CSSSize2px(va[2], this.getSize().y);
                        left += this.CSSSize2px(va[1], this.getSize().x);
                        right += this.CSSSize2px(va[1], this.getSize().x);
                        break;
                    case 4:
                        top += this.CSSSize2px(va[0], this.getSize().y);
                        bot += this.CSSSize2px(va[2], this.getSize().y);
                        left += this.CSSSize2px(va[3], this.getSize().x);
                        right += this.CSSSize2px(va[1], this.getSize().x);
                        break;
                }
            } else {
                var t = this.CSSSize2px(this.getStyle(arguments[i] + "-top" + add), this.getSize().y);
                if (t > -1) {top += t;}
                var b = this.CSSSize2px(this.getStyle(arguments[i] + "-bottom" + add), this.getSize().y);
                if (b > -1) {bot += b;}
                var l = this.CSSSize2px(this.getStyle(arguments[i] + "-left" + add), this.getSize().x);
                if (l > -1) {left += l;}
                var r = this.CSSSize2px(this.getStyle(arguments[i] + "-right" + add), this.getSize().x);
                if (r > -1) {right += r;}
            }
        }
        
        return {top: top, bottom: bot, left: left, right: right, x: left + right, y: top + bot};
    },
    
    CSSSize2px: function (size, parent) {
        // takes a string or number (interpreted as px) and returns a value
        // in pixel depending on its unit. px is left unmodified and % and em
        // are converted to pixel depending on the size of the parent element.
        // examples (parent element of 200px inner width):
        // "20px" -> 20
        // 20 -> 20
        // 0 -> 0
        // "20%" -> 40
        // "0.5em" -> 100
        // "auto" -> -1
        // "" -> -2
        size = this._sanitizeSize(size);
        if (size != "auto" && size != "" && typeof(size) != "undefined") {
            size = this.splitCSSnum(size);
            var px = 0;
            switch (size.unit) {
                case "%":
                    px = parent * (size.value / 100);
                    px = parseInt(px);
                    break;
                case "em":
                    px = parent * size.value;
                    px = parseInt(px);
                    break;
                case "px":
                default:
                    px = size.value;
                    break;
            }        
            return px;
        } else if (size == "auto") {
            return -1;
        } else if (size == "") {
            return -2;
        } else if (typeof(size) == "undefinded") {
            return -3;
        }
        return -255;
    },
    
    boxModel: function () {
        // returns the box model of the jQuery element or empty string
        if (this.getStyle("box-sizing")) return this.getStyle("box-sizing");
        if (this.getStyle("-moz-box-sizing")) return this.getStyle("-moz-box-sizing");
        if (this.getStyle("-ms-box-sizing")) return this.getStyle("-ms-box-sizing");
        if (this.getStyle("-webkit-box-sizing")) return this.getStyle("-webkit-box-sizing");
        if (this.getStyle("-khtml-box-sizing")) return this.getStyle("-khtml-box-sizing");
        return ""
    }
});