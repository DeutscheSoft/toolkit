toolkit = {
    setStyles : function(elem, styles) {
        var key;
        for (key in styles) if (styles.hasOwnProperty(key))
            elem.style[key] = styles[key];
    }
};
