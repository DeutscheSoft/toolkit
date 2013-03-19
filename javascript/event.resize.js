document._resizes = [];
document._monitoring_resizes = -1;
document._monitor_resizes = function () {
    for(var i = 0; i < document._resizes.length; i++) {
        var r = document._resizes[i];
        if(r.element.offsetWidth != r.x || r.element.offsetHeight != r.y) {
            r.x = r.element.offsetWidth;
            r.y = r.element.offsetHeight;
            r.element.fireEvent("resize");
        }
    }
    if(document._resizes.length) {
        document._monitoring_resizes = window.setTimeout("document._monitor_resizes()", 100);
    }
}
document._add_resize = function (element) {
    document._resizes.push({element: element, x: element.offsetWidth, y: element.offsetHeight});
    if(document._monitoring_resizes < 0) {
        document._monitoring_resizes = window.setTimeout("document._monitor_resizes()", 100);
    }
}
document._remove_resize = function (element) {
    for(var i = 0; i < document._resizes; i++) {
        if(element == document._resizes[i]) document._resizes.splice(i, 1);
        if(!document._resizes.length && document._monitoring_resizes < 0){
            window.clearTimeout(document._monitoring_resizes);
            document._monitoring_resizes = -1;
        }
    }
}

Class.refactor(Element, {
    addEvent: function (event, func) {
        if(event == "resize" && this.get("tag") !== "window")
            document._add_resize(this)
        this.previous(event, func);
    },
    removeEvent: function (event, func) {
        if(event == "resize" && this.get("tag") !== "window")
            document._remove_resize(this)
        this.previous(event, func);
    }
});