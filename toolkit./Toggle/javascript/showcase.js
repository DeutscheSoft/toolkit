window.addEvent('domready', function(){
    t = new Toggle({
        container: $("sc_toggle"),
        label: "Mic Active",
        label_active: "Mic Muted",
        icon: "images/icons_big/microphone.png",
        icon_active: "images/icons_big/microphone_muted.png",
        press: 200,
        press_disable: true
    });
});