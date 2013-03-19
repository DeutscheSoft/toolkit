window.addEvent('domready', function(){
    b1 = new Button({
        container: $("sc_button"),
        label: "Demo Button",
        icon: "images/icons_big/showcase.png"
    });
    b1.addEvent("click", function () { alert("clicked") });
});