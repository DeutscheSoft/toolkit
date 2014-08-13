WidgetContainer = $class({
    Extends : Container,
    initialize : function(options) {
        Container.prototype.initialize.call(this, options);
        this.widgets = [];
    },
    register_widget : function(widget) {
        this.widgets.push(widget);
    },
    fire_event : function(type, a) {
        var i;
        Widget.prototype.fire_event.call(this, type, a); 
        switch (type) {
        case "hide":
        case "show":
        case "resize":
            for (i = 0; i < this.widgets.length; i++)
                this.widgets[i].fire_event(type, [ this ]);
            break;
        }
    }
});
