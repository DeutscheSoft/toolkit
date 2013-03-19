window.addEvent('domready', function(){
    $$(".collapse").each(function (e) {
        var toggle = new Element("div", {"class":"toggle button", html:e.get("title") + " (" + (e.getChildren()[0].getChildren().length - 1) + ")"});
        toggle.inject(e.getParent().getChildren(".buttons")[0]);
        var toggleFx = new Fx.Slide(e).hide();
        toggle.addEvent("click", function(){toggleFx.toggle()});
    });
    var c = 0;
    $$("ul.wrapper>li").each( function (e) {
        if (!c) {
            var hr = new Element("hr").inject(e, "bottom");
            c ++;
            return;
        }
        var up = new Element("a.button", {style:"float: right; margin: 0 0 24px 24px;", href: "#", html: "up ⤴"}).inject(e, "bottom");
        var hr = new Element("hr").inject(e, "bottom");
    });
});