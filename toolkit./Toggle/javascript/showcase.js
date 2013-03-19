window.addEvent('domready', function(){
    t = new Toggle({
        container: $("sc_toggle"),
        label: "Toggle",
        label_active: "Active!",
        icon: "images/icons_big/showcase.png",
        icon_active: "images/icons_big/showcase_red.png",
        press: 200,
        press_disable: true
    });
});