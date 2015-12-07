items={
  "implements": {
    "id": "implements",
    "name": "Implements",
    "items": {
      "Warning": {
        "name": "Warning",
        "files": ["/home/markus/DeusO/toolkit/toolkit/implements/warning.js"],
        "id": "warning",
        "events": [{
          "description": "Gets fired when a warning was requested",
          "arguments": "Widget",
          "name": "warning"
        }],
        "methods": [{
          "name": "warning(element, timeout)",
          "description": "Adds the class \"toolkit-warn\" to the given element and sets a timeout after which the class is removed again. If there already is a timeout waiting it gets updated.",
          "parameters": [
            {
              "description": "The DOM node the class should be added to",
              "default": "undefined",
              "type": "DOMNode",
              "name": "element"
            },
            {
              "description": "Te timeout in milliseconds until the class is removed again",
              "default": "250",
              "type": "Number",
              "name": "timeout"
            }
          ]
        }]
      },
      "Ranged": {
        "name": "Ranged",
        "files": ["/home/markus/DeusO/toolkit/toolkit/implements/ranged.js"],
        "id": "ranged",
        "description": "Ranged provides functions for calculating linear scales from different values. It is useful for building coordinate systems, calculating pixel positions for different scale types and the like. Ranged is used e.g. in #Scale, #MeterBase and #Graph to draw elements on a certain position according to a value on an arbitrary scale.",
        "options": [
          {
            "description": "The type of the scale. Either an integer (_TOOLKIT_LINEAR, _TOOLKIT_DECIBEL|_TOOLKIT_LOG2, _TOOLKIT_FREQUENCY|_TOOLKIT_LOG10) or a function like function (value, options, coef) {}. If a function instead of an integer is handed over, it receives the actual options object as the second argument and is supposed to return a coefficient between 0 and 1. If the third argument \"coef\" is true, it is supposed to return a value depending on a coefficient handed over as the first argument.",
            "default": "_TOOLKIT_LINEAR",
            "type": "Int|Function",
            "name": "scale"
          },
          {
            "description": "Reverse the scale of the range",
            "default": "false",
            "type": "Bool",
            "name": "reverse"
          },
          {
            "description": "Dimensions of the range. set to width/height in pixels if you need it for drawing purposes, to 100 if you need percentual values or to 1 if you just need a linear equivalent for a e.g. logarithmic scale.",
            "default": "0",
            "type": "Number",
            "name": "basis"
          },
          {
            "description": "Minimum value of the range",
            "default": "0",
            "type": "Number",
            "name": "min"
          },
          {
            "description": "Maximum value of the range",
            "default": "0",
            "type": "Number",
            "name": "max"
          },
          {
            "description": "Step size, needed for user interaction",
            "default": "0",
            "type": "Number",
            "name": "step"
          },
          {
            "description": "Multiplier if SHIFT is hold while stepping",
            "default": "0",
            "type": "Number",
            "name": "shift_up"
          },
          {
            "description": "Multiplier if SHIFT + CONTROL is hold while stepping",
            "default": "0",
            "type": "Number",
            "name": "shift_down"
          },
          {
            "description": "Snap the value to a virtual grid with this distance. Using snap option with float values causes the range to reduce its minimum and maximum values depending on the amount of decimal digits because of the implementation of math in JavaScript. Using a step size of e.g. 1.125 reduces the maximum usable value from 9,007,199,254,740,992 to 9,007,199,254,740.992 (note the decimal point). Alternatively set this to an array containing possible values",
            "default": "0",
            "type": "Number|Array",
            "name": "snap"
          },
          {
            "description": "If snap is set decide how to jump between snaps. Setting this to true slips to the next snap if the value is more than on its half way to it. Otherwise the value has to reach the next snap first until it is fixed there again.",
            "default": "true",
            "type": "Bool",
            "name": "round"
          },
          {
            "description": "Used to range logarithmic curves. The factor is used to stretch the used range of the logarithmic curve",
            "default": "1",
            "type": "Number",
            "name": "log_factor"
          }
        ]
      },
      "Anchor": {
        "name": "Anchor",
        "files": ["/home/markus/DeusO/toolkit/toolkit/implements/anchor.js"],
        "id": "anchor",
        "methods": [{
          "returns": [{
            "description": "Object with members x and y as numbers",
            "type": "Object"
          }],
          "name": "translate_anchor(anchor, x, y, width, height)",
          "description": "returns real x and y values from a relative positioning",
          "parameters": [
            {
              "description": "Position of the anchor",
              "default": "_TOOLKIT_TOP_LEFT",
              "type": "Int",
              "name": "anchor"
            },
            {
              "description": "X position to translate",
              "default": "undefined",
              "type": "Number",
              "name": "x"
            },
            {
              "description": "Y position to translate",
              "default": "undefined",
              "type": "Number",
              "name": "y"
            },
            {
              "description": "Width of the element",
              "default": "undefined",
              "type": "Number",
              "name": "width"
            },
            {
              "description": "Height of the element",
              "default": "undefined",
              "type": "Number",
              "name": "height"
            }
          ]
        }],
        "description": "Anchor provides a single function translate_anchor which returns real x and y values from a relative positioning. For example positioning a #Window with anchor _TOOLKIT_CENTER needs to subtract half of its width from y and half of its height from x to appear at the correct position."
      },
      "Ranges": {
        "name": "Ranges",
        "files": ["/home/markus/DeusO/toolkit/toolkit/implements/ranges.js"],
        "id": "ranges",
        "events": [{
          "description": "Gets fired when a new range is added",
          "arguments": "Range",
          "name": "rangeadded"
        }],
        "methods": [{
          "returns": [{
            "description": "The newly created #Range",
            "type": "Range"
          }],
          "name": "add_range(from, name)",
          "description": "Add a new range. If name is set and this.options[name] exists, is an object and from is an object, too, both are merged before a range is created.",
          "parameters": [{
            "description": "A function returning a #Range instance or an object containing options for a new #Range.",
            "default": "undefined",
            "type": "Function|Object",
            "name": "from"
          }]
        }],
        "description": "Ranges provides multiple #Range for a widget. They might be used for e.g. building coordinate systems and the like."
      },
      "Gradient": {
        "id": "gradient",
        "methods": [{
          "returns": [{
            "description": "A string to be used as background CSS",
            "type": "String"
          }],
          "name": "draw_gradient(element, gradient, fallback, range)",
          "description": "This function generates a string from a given gradient object to set as a CSS background for a DOM element. If element is given, the function automatically sets the background. If gradient is omitted, the gradient is taken from options. Fallback is used if no gradient can be created. If fallback is omitted, options.background is used. if no range is set Gradient assumes that the implementing instance has Range functionality.",
          "parameters": [
            {
              "description": "The DOM node to appy the gradient to",
              "default": "undefined",
              "type": "DOMNode",
              "name": "element"
            },
            {
              "description": "Gradient definition for the background, e.g. {\"-96\": \"rgb(30,87,153)\", \"-0.001\": \"rgb(41,137,216)\", \"0\": \"rgb(32,124,202)\", \"24\": \"rgb(125,185,232)\"}",
              "default": "undefined",
              "type": "Object",
              "name": "gradient"
            },
            {
              "description": "If no gradient can be applied, use this as background color string",
              "default": "undefined",
              "type": "String",
              "name": "fallback"
            },
            {
              "description": "If a specific range is set, it is used for the calculations. If not, we expect the widget itself provides #Ranged functionality.",
              "default": "undefined",
              "type": "#Range",
              "name": "range"
            }
          ]
        }],
        "files": ["/home/markus/DeusO/toolkit/toolkit/implements/gradient.js"],
        "events": [{
          "description": "Is fired when the gradient was created",
          "arguments": "DOMNode, String",
          "name": "backgroundchanged"
        }],
        "name": "Gradient",
        "description": "Gradient provides a function to set the background of a DOM element to a CSS gradient according on the users browser and version. Gradient needs a Range to be implemented on.",
        "options": [
          {
            "description": "Gradient definition for the background. Keys are ints or floats as string corresponding to the widgets scale. Values are valid css color strings like \"#ff8000\" or \"rgb(0,56,103)\".",
            "default": "false",
            "type": "Bool|Object",
            "name": "gradient"
          },
          {
            "description": "Background color if no gradient is used",
            "default": "\"#000000\"",
            "type": "String",
            "name": "background"
          }
        ]
      },
      "GlobalCursor": {
        "name": "GlobalCursor",
        "files": ["/home/markus/DeusO/toolkit/toolkit/implements/globalcursor.js"],
        "id": "globalcursor",
        "events": [
          {
            "description": "Is fired when a cursor gets set",
            "arguments": "Cursor, Widget",
            "name": "globalcursor"
          },
          {
            "description": "Is fired when a cursor is removed",
            "arguments": "Cursor, Widget",
            "name": "cursorremoved"
          }
        ],
        "methods": [
          {
            "name": "global_cursor(cursor)",
            "description": "Adds a specific class to the body DOM node to show a specific cursor",
            "parameters": [{
              "description": "The decriptor of the cursor to show (http://www.echoecho.com/csscursors.htm)",
              "default": "undefined",
              "type": "String",
              "name": "cursor"
            }]
          },
          {
            "name": "remove_cursor(cursor)",
            "description": "Removes a specific class to the body DOM node to show a specific cursor",
            "parameters": [{
              "description": "The decriptor of the cursor to remove (http://www.echoecho.com/csscursors.htm)",
              "default": "undefined",
              "type": "String",
              "name": "cursor"
            }]
          }
        ],
        "description": "GlobalCursor adds global cursor classes to enshure one of the standard cursors (http://www.echoecho.com/csscursors.htm) is shown in the overall application"
      },
      "BASE": {
        "name": "BASE",
        "files": ["/home/markus/DeusO/toolkit/toolkit/implements/base.js"],
        "id": "base",
        "methods": [
          {
            "name": "destroy()",
            "description": "Destroys all event handlers and the options object"
          },
          {
            "name": "set_options(options)",
            "description": "merges a new options object into the existing one including deep copies of objects. If an option key begins with the string \"on\" it is considered as event handler. In this case the value should be the handler function for the event with the corresponding name without the first \"on\" characters.",
            "parameters": [{
              "description": "An object containing initial options",
              "default": "{ }",
              "type": "Object",
              "name": "options"
            }]
          },
          {
            "returns": [{
              "description": "The element",
              "type": "HTMLElement"
            }],
            "name": "delegate_events(element)",
            "parameters": [{
              "description": "The element all native events should be bound to",
              "default": "undefined",
              "type": "HTMLElement",
              "name": "element"
            }]
          },
          {
            "name": "add_event(event, func, prevent, stop)",
            "parameters": [
              {
                "description": "The event descriptor",
                "default": "undefined",
                "type": "String",
                "name": "event"
              },
              {
                "description": "The function to call when the event happens",
                "default": "undefined",
                "type": "Function",
                "name": "func"
              },
              {
                "description": "Set to true if the event should prevent the default behavior",
                "default": "undefined",
                "type": "Bool",
                "name": "prevent"
              },
              {
                "description": "Set to true if the event should stop bubbling up the tree",
                "default": "undefined",
                "type": "Bool",
                "name": "stop"
              }
            ]
          },
          {
            "name": "remove_event(event, func)",
            "description": "Removes the given function from the event queue. If it is a native DOM event, it removes the DOM event listener as well.",
            "parameters": [
              {
                "description": "The event descriptor",
                "default": "undefined",
                "type": "String",
                "name": "event"
              },
              {
                "description": "The function to remove",
                "default": "undefined",
                "type": "Function",
                "name": "func"
              }
            ]
          },
          {
            "name": "fire_event(event)",
            "description": "Calls all functions in the events queue",
            "parameters": [{
              "description": "The event descriptor",
              "default": "undefined",
              "type": "String",
              "name": "event"
            }]
          },
          {
            "returns": [{
              "description": "True if the event has some handler functions in the queue, false if not",
              "type": "Bool"
            }],
            "name": "has_event_listeners(event)",
            "description": "Test if the event descriptor has some handler functions in the queue",
            "parameters": [{
              "description": "The event desriptor",
              "default": "undefined",
              "type": "String",
              "name": "event"
            }]
          },
          {
            "name": "add_events(events, func)",
            "description": "Add multiple event handlers at once, either as dedicated event handlers or a list of event descriptors with a single handler function",
            "parameters": [
              {
                "description": "Object with event descriptors as keys and functions as values or Array of event descriptors. The latter requires a handler function as the second argument.",
                "default": "undefined",
                "type": "Object | Array",
                "name": "events"
              },
              {
                "description": "A function to add as event handler if the first argument is an array of event desriptors",
                "default": "undefined",
                "type": "Function",
                "name": "func"
              }
            ]
          },
          {
            "name": "remove_events(events, func)",
            "description": "Remove multiple event handlers at once, either as dedicated event handlers or a list of event descriptors with a single handler function",
            "parameters": [
              {
                "description": "Object with event descriptors as keys and functions as values or Array of event descriptors. The latter requires the handler function as the second argument.",
                "default": "undefined",
                "type": "Object | Array",
                "name": "events"
              },
              {
                "description": "A function to remove from event handler queue if the first argument is an array of event desriptors",
                "default": "undefined",
                "type": "Function",
                "name": "func"
              }
            ]
          },
          {
            "name": "fire_events(events)",
            "description": "Calls the event handler functions of multiple events",
            "parameters": [{
              "description": "A list of event descriptors to fire",
              "default": "undefined",
              "type": "Array",
              "name": "events"
            }]
          }
        ],
        "description": "This is the base class for all widgets in toolkit. It provides an API for event handling and other basic implementations."
      },
      "AudioMath": {
        "name": "AudioMath",
        "files": ["/home/markus/DeusO/toolkit/toolkit/implements/audiomath.js"],
        "id": "audiomath",
        "methods": [
          {
            "returns": [{
              "description": "The logarithm with base 2 of the value",
              "type": "Number"
            }],
            "name": "log2(value)",
            "description": "Calculate the logarithm with base 2 of a given value. It is used for calculations with decibels in linear scales.",
            "parameters": [{
              "description": "The value for the log",
              "default": "undefined",
              "type": "Number",
              "name": "value"
            }]
          },
          {
            "returns": [{
              "description": "The logarithm with base 10 of the value",
              "type": "Number"
            }],
            "name": "log10(value)",
            "description": "Calculate the logarithm with base 10 of a given value. It is used for calculations with hertz in linear scales.",
            "parameters": [{
              "description": "The value for the log",
              "default": "undefined",
              "type": "Number",
              "name": "value"
            }]
          },
          {
            "returns": [{
              "description": "A value between 0.0 (min) and 1.0 (max)",
              "type": "Number"
            }],
            "name": "db2coef(value, min, max, reverse, factor)",
            "description": "Calculates a linear value between 0.0 and 1.0 from a value and its lower and upper boundaries in decibels",
            "parameters": [
              {
                "description": "The value in decibels",
                "default": "undefined",
                "type": "Number",
                "name": "value"
              },
              {
                "description": "The minimum value in decibels",
                "default": "undefined",
                "type": "Number",
                "name": "min"
              },
              {
                "description": "The maximum value in decibels",
                "default": "undefined",
                "type": "Number",
                "name": "max"
              },
              {
                "description": "If the scale is reversed",
                "default": "undefined",
                "type": "Bool",
                "name": "reverse"
              },
              {
                "description": "Changes the deflection of the logarithm if other than 1.0",
                "default": "undefined",
                "type": "Number",
                "name": "factor"
              }
            ]
          },
          {
            "returns": [{
              "description": "The result in decibels",
              "type": "Number"
            }],
            "name": "coef2db(coef, min, max, reverse, factor)",
            "description": "Calculates a value in decibels from a value between 0.0 and 1.0 and some lower and upper boundaries in decibels",
            "parameters": [
              {
                "description": "A value between 0.0 and 1.0",
                "default": "undefined",
                "type": "Number",
                "name": "coef"
              },
              {
                "description": "The minimum value in decibels",
                "default": "undefined",
                "type": "Number",
                "name": "min"
              },
              {
                "description": "The maximum value in decibels",
                "default": "undefined",
                "type": "Number",
                "name": "max"
              },
              {
                "description": "If the scale is reversed",
                "default": "undefined",
                "type": "Bool",
                "name": "reverse"
              },
              {
                "description": "Changes the deflection of the logarithm if other than 1.0",
                "default": "undefined",
                "type": "Number",
                "name": "factor"
              }
            ]
          },
          {
            "returns": [{
              "description": "A value between 0.0 and scale",
              "type": "Number"
            }],
            "name": "db2scale(value, min, max, scale, reverse, factor)",
            "description": "Calculates a linear value between 0.0 and scale from a value and its lower and upper boundaries in decibels",
            "parameters": [
              {
                "description": "The value in decibels",
                "default": "undefined",
                "type": "Number",
                "name": "value"
              },
              {
                "description": "The minimum value in decibels",
                "default": "undefined",
                "type": "Number",
                "name": "min"
              },
              {
                "description": "The maximum value in decibels",
                "default": "undefined",
                "type": "Number",
                "name": "max"
              },
              {
                "description": "If the scale is reversed",
                "default": "undefined",
                "type": "Bool",
                "name": "reverse"
              },
              {
                "description": "Changes the deflection of the logarithm if other than 1.0",
                "default": "undefined",
                "type": "Number",
                "name": "factor"
              }
            ]
          },
          {
            "returns": [{
              "description": "The result in decibels",
              "type": "Number"
            }],
            "name": "scale2db(value, min, max, scale, reverse, factor)",
            "description": "Calculates a value in decibels from a value between 0.0 and scale and some lower and upper boundaries in decibels",
            "parameters": [
              {
                "description": "A value between 0.0 and scale",
                "default": "undefined",
                "type": "Number",
                "name": "value"
              },
              {
                "description": "The minimum value in decibels",
                "default": "undefined",
                "type": "Number",
                "name": "min"
              },
              {
                "description": "The maximum value in decibels",
                "default": "undefined",
                "type": "Number",
                "name": "max"
              },
              {
                "description": "If the scale is reversed",
                "default": "undefined",
                "type": "Bool",
                "name": "reverse"
              },
              {
                "description": "Changes the deflection of the logarithm if other than 1.0",
                "default": "undefined",
                "type": "Number",
                "name": "factor"
              }
            ]
          },
          {
            "returns": [{
              "description": "A value between 0.0 (min) and 1.0 (max)",
              "type": "Number"
            }],
            "name": "freq2coef(value, min, max, reverse)",
            "description": "Calculates a linear value between 0.0 and 1.0 from a value and its lower and upper boundaries in hertz",
            "parameters": [
              {
                "description": "The value in hertz",
                "default": "undefined",
                "type": "Number",
                "name": "value"
              },
              {
                "description": "The minimum value in hertz",
                "default": "undefined",
                "type": "Number",
                "name": "min"
              },
              {
                "description": "The maximum value in hertz",
                "default": "undefined",
                "type": "Number",
                "name": "max"
              },
              {
                "description": "If the scale is reversed",
                "default": "undefined",
                "type": "Bool",
                "name": "reverse"
              }
            ]
          },
          {
            "returns": [{
              "description": "The result in hertz",
              "type": "Number"
            }],
            "name": "coef2freq(coef, min, max, reverse)",
            "description": "Calculates a value in hertz from a value between 0.0 and 1.0 and some lower and upper boundaries in hertz",
            "parameters": [
              {
                "description": "A value between 0.0 and 1.0",
                "default": "undefined",
                "type": "Number",
                "name": "coef"
              },
              {
                "description": "The minimum value in hertz",
                "default": "undefined",
                "type": "Number",
                "name": "min"
              },
              {
                "description": "The maximum value in hertz",
                "default": "undefined",
                "type": "Number",
                "name": "max"
              },
              {
                "description": "If the scale is reversed",
                "default": "undefined",
                "type": "Bool",
                "name": "reverse"
              },
              {
                "description": "Changes the deflection of the logarithm if other than 1.0",
                "default": "undefined",
                "type": "Number",
                "name": "factor"
              }
            ]
          },
          {
            "returns": [{
              "description": "A value between 0.0 and scale",
              "type": "Number"
            }],
            "name": "freq2scale(value, min, max, scale, reverse)",
            "description": "Calculates a linear value between 0.0 and scale from a value and its lower and upper boundaries in hertz",
            "parameters": [
              {
                "description": "The value in hertz",
                "default": "undefined",
                "type": "Number",
                "name": "value"
              },
              {
                "description": "The minimum value in hertz",
                "default": "undefined",
                "type": "Number",
                "name": "min"
              },
              {
                "description": "The maximum value in hertz",
                "default": "undefined",
                "type": "Number",
                "name": "max"
              },
              {
                "description": "If the scale is reversed",
                "default": "undefined",
                "type": "Bool",
                "name": "reverse"
              }
            ]
          },
          {
            "returns": [{
              "description": "The result in hertz",
              "type": "Number"
            }],
            "name": "scale2freq(value, min, max, scale, reverse)",
            "description": "Calculates a value in hertz from a value between 0.0 and scale and some lower and upper boundaries in hertz",
            "parameters": [
              {
                "description": "A value between 0.0 and scale",
                "default": "undefined",
                "type": "Number",
                "name": "value"
              },
              {
                "description": "The minimum value in hertz",
                "default": "undefined",
                "type": "Number",
                "name": "min"
              },
              {
                "description": "The maximum value in hertz",
                "default": "undefined",
                "type": "Number",
                "name": "max"
              },
              {
                "description": "If the scale is reversed",
                "default": "undefined",
                "type": "Bool",
                "name": "reverse"
              },
              {
                "description": "Changes the deflection of the logarithm if other than 1.0",
                "default": "undefined",
                "type": "Number",
                "name": "factor"
              }
            ]
          }
        ],
        "description": "AudioMath provides a couple of functions for turning linear values into logarithmic ones and vice versa. If you need an easy convertion between dB or Hz and a linear scale implement this class."
      }
    },
    "description": ""
  },
  "widgets": {
    "id": "widgets",
    "name": "Widgets",
    "items": {
      "Equalizer": {
        "name": "Equalizer",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/equalizer.js"],
        "id": "equalizer",
        "description": "Equalizer is a ResponseHandler adding some EqBands instead of simple ResponseHandles."
      },
      "ValueButton": {
        "name": "ValueButton",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/valuebutton.js"],
        "id": "valuebutton"
      },
      "Toggle": {
        "name": "Toggle",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/toggle.js"],
        "id": "toggle"
      },
      "Button": {
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
        "id": "button",
        "extends": ["Widget"],
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/button.js"],
        "name": "Button",
        "description": "Button is a simple, clickable widget to trigger funcions. It fires a couple of click-related events and consists of a label and an icon. Buttons are used as a base to build different other widgets from, too.",
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
          },
          {
            "description": "Determine the arrangement of label and icon. _TOOLKIT_VERTICAL means icon on top of the label, _TOOLKIT_HORIZONTAL puts the icon left to the label.",
            "default": "_TOOLKIT_VERTICAL",
            "type": "Int",
            "name": "layout"
          }
        ]
      },
      "MeterBase": {
        "name": "MeterBase",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/meterbase.js"],
        "id": "meterbase",
        "description": "MeterBase is a base class to build different meters like LevelMeter. MeterBase extends Gradient and implements Widget. MeterBase has a Scale widget."
      },
      "Pager": {
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
        "id": "pager",
        "methods": [
          {
            "name": "add_pages",
            "description": "Adds an array of pages.",
            "parameters": [{
              "description": "An Array containing objects with options for the page and its button. Members are: label - a string for the #Button, content: a string or a #Container instance.",
              "default": "undefined",
              "type": "Array[{label:String, content:Container|String}[, ...]]",
              "name": "options"
            }]
          },
          {
            "name": "add_page(button, content, pos, options)",
            "description": "Adds a #Container to the Pager and a #Button to the pagers #ButtonArray",
            "parameters": [
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
                "name": "position"
              }
            ]
          },
          {
            "name": "remove_page",
            "description": "Removes a page from the Pager.",
            "parameters": [{
              "description": "The container to remove. Either a position or the #Container widget generated by add_page",
              "default": "undefined",
              "type": "Int|Container",
              "name": "page"
            }]
          },
          {
            "name": "current",
            "description": "Returns the index of the actual displayed page or null if none is shown"
          }
        ],
        "modules": [{
          "description": "The #ButtonArray instance acting as the menu",
          "name": "buttonarray"
        }],
        "extends": ["Container"],
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/pager.js"],
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
        "name": "Pager",
        "description": "Pager, also known as Notebook in other UI toolkits, provides multiple containers for displaying contents which are switchable via a #ButtonArray.",
        "options": [
          {
            "description": "The position of the ButtonArray",
            "default": "_TOOLKIT_TOP",
            "type": "Int",
            "name": "position"
          },
          {
            "description": "An array of mappings (objects) containing the members \"label\" and \"content\". \"label\" is a string for the buttons label or an object containing options for a button and content is a string containing HTML or a ready-to-use DOM node, e.g. [{label: \"Empty Page 1\", content: document.createElement(\"span\")}, {label: {label:\"Foobar\", class:\"foobar\"}, content: \"<h1>Foobar</h1><p>Lorem ipsum dolor sit amet</p>\"}]",
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
            "description": "If true pages aren't resized so the #ButtonArray overlaps the contents",
            "default": "false",
            "type": "Bool",
            "name": "overlap"
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
        "id": "buttonarray",
        "methods": [
          {
            "name": "add_buttons(options)",
            "description": "Adds an array of buttons to the end of the list.",
            "parameters": [{
              "description": "An Array containing objects with options for the buttons (see #Button for more information) or strings for the buttons labels",
              "default": "undefined",
              "type": "Array[String|Object]",
              "name": "options"
            }]
          },
          {
            "returns": [{
              "description": "The #Button instance",
              "type": "Button"
            }],
            "name": "add_button(options, position)",
            "description": "Adds a #Button to the ButtonArray",
            "parameters": [
              {
                "description": "An object containing options for the #Button to add or a string for the label",
                "default": "undefined",
                "type": "Object|String",
                "name": "options"
              },
              {
                "description": "The position to add the #Button to. If avoided the #Button is added to the end of the list",
                "default": "undefined",
                "type": "Int|Undefined",
                "name": "position"
              }
            ]
          },
          {
            "name": "remove_button(button)",
            "description": "Removes a #Button from the ButtonArray",
            "parameters": [{
              "description": "ID or #Button instance",
              "default": "undefined",
              "type": "Int|Button",
              "name": "button"
            }]
          },
          {
            "returns": [{
              "description": "The selected #Button or null",
              "type": "Button"
            }],
            "name": "current()",
            "description": "Get the actually selected #Button"
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
        "extends": ["Container"],
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/buttonarray.js"],
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
        "name": "ButtonArray",
        "description": "ButtonArray is a list of buttons (#Button) layouted either vertically or horizontally. ButtonArray automatically adds arrow buttons if the overal width is smaller than the buttons list.",
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
      },
      "Knob": {
        "name": "Knob",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/knob.js"],
        "id": "knob",
        "description": "Knob is a Circular injected into a SVG and extended by ScrollValue and DragValue to set its value. Knob uses DragValue and Scrollvalue for setting its value."
      },
      "LevelMeter": {
        "name": "LevelMeter",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/levelmeter.js"],
        "id": "levelmeter",
        "description": "LevelMeter is a fully functional display of numerical values. They are enhanced MeterBases containing a clip LED, a peak pin with value label and hold markers. LevelMeters have some automatically triggered functionality like falling and resetting all kinds of values after a time. All additional elements can be set automatically as soon as the value rises above them."
      },
      "Keyboard": {
        "name": "Keyboard",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/keyboard.js"],
        "id": "keyboard",
        "description": "Keyboard provides an on-screen keyboard for textual input via touch or mouse events"
      },
      "Value": {
        "name": "Value",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/value.js"],
        "id": "value",
        "description": "Value is a formatted text field displaying numbers and providing a input field for editing the value"
      },
      "Chart": {
        "name": "Chart",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/chart.js"],
        "id": "chart",
        "description": "Chart is an SVG image containing one or more Graphs. There are functions to add and remove graphs. Chart extends Widget and contains a Grid and two Ranges."
      },
      "Dynamics": {
        "name": "Dynamics",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/dynamics.js"],
        "id": "dynamics",
        "description": "Dynamics are based on Charts and display the characteristics of dynamic processors. They are square widgets drawing a Grid automatically based on the range."
      },
      "Window": {
        "name": "Window",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/window.js"],
        "id": "window"
      },
      "ValueKnob": {
        "name": "ValueKnob",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/valueknob.js"],
        "id": "valueknob"
      },
      "Container": {
        "name": "Container",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/container.js"],
        "id": "container",
        "description": "Container represents a <DIV> element."
      },
      "Label": {
        "name": "Label",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/label.js"],
        "id": "label",
        "description": "Label is a simple text field displaying strings"
      },
      "FrequencyResponse": {
        "name": "FrequencyResponse",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/frequencyresponse.js"],
        "id": "frequencyresponse",
        "description": "FrequencyResponse is a Chart drawing frequencies on the x axis and dB values on the y axis. This widget automatically draws a Grid depending on the ranges."
      },
      "Gauge": {
        "name": "Gauge",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/gauge.js"],
        "id": "gauge",
        "description": "Gauge simply puts a single Circular into a SVG image."
      },
      "Widget": {
        "name": "Widget",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/widget.js"],
        "id": "widget",
        "description": "Widget is the base class for all widgets drawing DOM elements. It provides basic functionality like delegating events, setting options and firing some events.Widget implements AudioMath, Options and Events."
      },
      "Clock": {
        "name": "Clock",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/clock.js"],
        "id": "clock",
        "description": "Clock shows a customized clock with circulars displaying hours, minutes and seconds. It has three free formatable labels."
      },
      "State": {
        "name": "State",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/state.js"],
        "id": "state",
        "description": "The State widget is a multi-functional adaption of a traditional LED. It is able to show different colors as well as on/off states. The \"brightness\" can be set seamlessly. Classes can be used to display different styles. State extends Widget."
      },
      "Fader": {
        "name": "Fader",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/fader.js"],
        "id": "fader"
      },
      "Select": {
        "name": "Select",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/select.js"],
        "id": "select",
        "description": "Select provides a button with a select list to choose from different entries."
      },
      "ResponseHandler": {
        "name": "ResponseHandler",
        "files": ["/home/markus/DeusO/toolkit/toolkit/widgets/responsehandler.js"],
        "id": "responsehandler"
      }
    },
    "description": "Widgets are fully functional elements to build user interfaces.\nThey typically rely on other elements like #Modules and #Implements and\nare somehow based on #Widget itself or other widgets."
  }
}