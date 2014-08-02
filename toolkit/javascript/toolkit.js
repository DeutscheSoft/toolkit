toolkit = {
    setStyles : function(elem, styles) {
        var key;
        for (key in styles) if (styles.hasOwnProperty(key))
            elem.style[key] = styles[key];
    },
    element : function(tag) {
        var n = document.createElement(tag);
        var i, v, j;
        for (i = 1; i < arguments.length; i++) {
            v = arguments[i]; 
            if (typeof v == "object") {
                toolkit.setStyles(n, v);
            } else if (typeof v == "string") {
                n.classList.add(v);
            } else throw("unsupported argument to toolkit.element");
        }
        return n;
    },
    set_text : function(node, s) {
        if (node.firstChild) {
            node.firstChild.nodeValue = s;
        } else node.appendChild(document.createTextNode(s));
    }
};
