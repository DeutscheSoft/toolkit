items={
  "implements": {
    "name": "Implements",
    "items": {},
    "description": ""
  },
  "widgets": {
    "name": "Widgets",
    "items": {
      "Button": {
        "name": "Button",
        "files": [
          "./toolkit/widgets/button.js",
          "./toolkit/templates/default/css/button.css"
        ],
        "elements": [
          {
            "description": "The main button element",
            "class": "div.toolkit-button",
            "name": "[d][c][s]element"
          },
          {
            "description": "An internal container for label and icon",
            "class": "div.toolkit-cell",
            "name": "_cell"
          },
          {
            "description": "The icon of the button",
            "class": "img.toolkit-icon",
            "name": "_icon"
          },
          {
            "description": "The label of the button",
            "class": "div.toolkit-label",
            "name": "_label"
          }
        ],
        "description": "Button is a simple, clickable widget to trigger funcions. It fires a couple of click-related events and consists of a label and an icon. Buttons are used as a base to build different other widgets from, too.",
        "extends": ["Widget"],
        "options": [
          {
            "description": "Text for the buttons label",
            "default": "\"\"",
            "type": "String",
            "name": "label"
          },
          {
            "description": "URL to an icon for the button",
            "default": "\"\"",
            "type": "String",
            "name": "icon"
          },
          {
            "description": "State of the button",
            "default": "false",
            "type": "Bool",
            "name": "state"
          },
          {
            "description": "Background color of the state indication",
            "default": "false",
            "type": "Bool",
            "name": "state_color"
          }
        ]
      },
      "ButtonArray": {
        "elements": [
          {
            "description": "A clipping area containing the list of buttons",
            "class": "div.toolkit-clip",
            "name": "_clip"
          },
          {
            "description": "A container for all the buttons",
            "class": "div.toolkit-container",
            "name": "_container"
          }
        ],
        "name": "ButtonArray",
        "files": [
          "./toolkit/widgets/buttonarray.js",
          "./toolkit/templates/default/css/buttonarray.css"
        ],
        "extends": ["Container"],
        "description": "ButtonArray is a list of buttons (#Button) layouted either vertically or horizontally. ButtonArray automatically adds arrow buttons if the overal width is smaller than the buttons list.",
        "events": [
          {
            "description": "When a #Button or an arrow gets clicked",
            "arguments": "Button, ID, Widget",
            "name": "clicked"
          },
          {
            "description": "A #Button was added to the ButtonArray",
            "arguments": "Button, Widget",
            "name": "added"
          },
          {
            "description": "A #Button was removed from the ButtonArray",
            "arguments": "Button, Widget",
            "name": "removed"
          }
        ],
        "methods": [
          {
            "description": "Adds an array of buttons to the end of the list.",
            "name": "add_buttons",
            "options": [{
              "description": "An Array containing objects with options for the buttons (see #Button for more information) or strings for the buttons labels",
              "default": "undefined",
              "type": "Array[String|Object]",
              "name": "options"
            }]
          },
          {
            "name": "add_button",
            "options": [
              {
                "description": "An object containing options for the #Button to add or a string for the label",
                "default": "undefined",
                "type": "Object|String",
                "name": "options"
              },
              {
                "description": "The position to add the #Button to. If avoided the #Button is added to the end of the list description: Adds a #Button to the ButtonArray",
                "default": "undefined",
                "type": "Int|Undefined",
                "name": "pos"
              }
            ]
          },
          {
            "description": "Removes a #Button from the ButtonArray",
            "name": "remove_button",
            "options": [{
              "description": "ID or #Button instance",
              "default": "undefined",
              "type": "Int|Button",
              "name": "button"
            }]
          }
        ],
        "modules": [
          {
            "description": "The previous arrow #Button instance",
            "name": "prev"
          },
          {
            "description": "The next arrow #Button instance",
            "name": "next"
          }
        ],
        "options": [
          {
            "description": "A list of button options or label strings which is converted to button instances on init. If get is called, the converted list of button instances is returned.",
            "default": "[]",
            "type": "Array",
            "name": "buttons"
          },
          {
            "description": "If arrow buttons are added automatically",
            "default": "true",
            "type": "Bool",
            "name": "auto_arrows"
          },
          {
            "description": "The direction of the button list, one out of _TOOLKIT_HORIZONTAL or _TOOLKIT_VERTICAL",
            "default": "_TOOLKIT_HORIZONTAL",
            "type": "Int",
            "name": "direction"
          },
          {
            "description": "The button to scroll to, either an ID or a button instance",
            "default": "-1",
            "type": "Int|Button",
            "name": "show"
          }
        ]
      }
    },
    "description": "Widgets are fully functional elements to build user interfaces.\nThey typically rely on other elements like #Modules and #Implements and\nare somehow based on #Widget itself or other widgets."
  }
}