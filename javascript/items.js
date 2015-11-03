items={
  "implements": {
    "id": "implements",
    "name": "Implements",
    "items": {},
    "description": ""
  },
  "widgets": {
    "id": "widgets",
    "name": "Widgets",
    "items": {
      "Button": {
        "name": "Button",
        "id": "button",
        "extends": ["Widget"],
        "files": [
          "/home/markus/DeusO/toolkit/toolkit/widgets/button.js",
          "/home/markus/DeusO/toolkit/toolkit/templates/default/css/button.css"
        ],
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
        ],
        "elements": [
          {
            "description": "The main button element",
            "class": "div.toolkit-button",
            "name": "element [d][c][s]"
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
        "description": "Button is a simple, clickable widget to trigger funcions. It fires a couple of click-related events and consists of a label and an icon. Buttons are used as a base to build different other widgets from, too."
      },
      "ButtonArray": {
        "name": "ButtonArray",
        "id": "buttonarray",
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
        "extends": ["Button"],
        "files": [
          "/home/markus/DeusO/toolkit/toolkit/widgets/buttonarray.js",
          "/home/markus/DeusO/toolkit/toolkit/templates/default/css/buttonarray.css"
        ],
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
        ],
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
        "description": "ButtonArray is a list of buttons (#Button) layouted either vertically or horizontally. ButtonArray automatically adds arrow buttons if the overal width is smaller than the buttons list.",
        "methods": [
          {
            "description": "Adds an array of buttons to the end of the list.",
            "options": [{
              "description": "An Array containing objects with options for the buttons (see #Button for more information) or strings for the buttons labels",
              "default": "undefined",
              "type": "Array[String|Object]",
              "name": "options"
            }],
            "name": "add_buttons"
          },
          {
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
            ],
            "name": "add_button"
          },
          {
            "description": "Removes a #Button from the ButtonArray",
            "options": [{
              "description": "ID or #Button instance",
              "default": "undefined",
              "type": "Int|Button",
              "name": "button"
            }],
            "name": "remove_button"
          }
        ]
      },
      "Pager": {
        "name": "Pager",
        "id": "pager",
        "modules": [{
          "description": "The #ButtonArray instance acting as the menu",
          "name": "buttonarray"
        }],
        "extends": ["Container"],
        "files": [
          "/home/markus/DeusO/toolkit/toolkit/widgets/pager.js",
          "/home/markus/DeusO/toolkit/toolkit/templates/default/css/pager.css"
        ],
        "events": [
          {
            "description": "A page was added to the Pager",
            "arguments": "Page, Widget",
            "name": "added"
          },
          {
            "description": "A page was removed from the Pager",
            "arguments": "Page, Widget",
            "name": "removed"
          }
        ],
        "options": [
          {
            "description": "The position of the ButtonArray",
            "default": "_TOOLKIT_TOP",
            "type": "Int",
            "name": "position"
          },
          {
            "description": "Direction the pages appearance",
            "default": "_TOOLKIT_RIGHT",
            "type": "Int",
            "name": "direction"
          },
          {
            "description": "an array of mappings (objects) containing the members \"label\" and \"content\". \"label\" is a string for the buttons label or an object containing options for a button and content is a string containing HTML or a ready-to-use DOM node, e.g. [{label: \"Empty Page 1\", content: document.createElement(\"span\")}, {label: {label:\"Foobar\", class:\"foobar\"}, content: \"<h1>Foobar</h1><p>Lorem ipsum dolor sit amet</p>\"}]",
            "default": "[]",
            "type": "Array",
            "name": "pages"
          },
          {
            "description": "The page to show",
            "default": "-1",
            "type": "Int",
            "name": "show"
          },
          {
            "description": "if true pages aren't resized so the #ButtonArray overlaps the contents",
            "default": "false",
            "type": "Bool",
            "name": "overlap"
          }
        ],
        "elements": [
          {
            "description": "The main pager element",
            "class": "div.toolkit-container.toolkit-pager",
            "name": "element [d][c][s]"
          },
          {
            "description": "An internal container for layout purposes containing the #ButtonArray.",
            "class": "div.toolkit-wrapper.toolkit-buttonarray-wrapper",
            "name": "_buttonarray_wrapper"
          },
          {
            "description": "An internal container for layout purposes containing the _clip element.",
            "class": "div.toolkit-wrapper.toolkit-container-wrapper",
            "name": "_container_wrapper"
          },
          {
            "description": "The clipping area containing the pages containers",
            "class": "div.toolkit-clip",
            "name": "_clip"
          }
        ],
        "description": "Pager, also known as Notebook in other UI toolkits, provides multiple containers for displaying contents which are switchable via a #ButtonArray.",
        "methods": [
          {
            "description": "Adds an array of pages.",
            "options": [{
              "description": "An Array containing objects with options for the page and its button. Members are: label - a string for the #Button, content: a string or a #Container instance.",
              "default": "undefined",
              "type": "Array[{label:String, content:Container|String}[, ...]]",
              "name": "options"
            }],
            "name": "add_pages"
          },
          {
            "description": "Adds a #Container to the Pager and a #Button to the pagers #ButtonArray",
            "options": [
              {
                "description": "A string with the #Button s label or an object cotaining options for the #Button",
                "default": "undefined",
                "type": "String|Object",
                "name": "button"
              },
              {
                "description": "The content of the page. Either a #Container (or derivate) widget, a class (needs option \"options\" to be set) or a string which get embedded in a new #Container",
                "default": "undefined",
                "type": "Widget|Class|String",
                "name": "content"
              },
              {
                "description": "An object containing options for the #Container to add as a page",
                "default": "undefined",
                "type": "Object",
                "name": "options"
              },
              {
                "description": "The position to add the new page to. If avoided the page is added to the end of the list",
                "default": "undefined",
                "type": "Int|Undefined",
                "name": "pos"
              }
            ],
            "name": "add_page"
          },
          {
            "description": "Removes a page from the Pager.",
            "options": [{
              "description": "The container to remove. Either a position or the #Container widget generated by add_page",
              "default": "undefined",
              "type": "Int|Container",
              "name": "page"
            }],
            "name": "remove_page"
          },
          {
            "description": "Returns the index of the actual displayed page or null if none is shown",
            "name": "current"
          }
        ]
      }
    },
    "description": "Widgets are fully functional elements to build user interfaces.\nThey typically rely on other elements like #Modules and #Implements and\nare somehow based on #Widget itself or other widgets."
  }
}
