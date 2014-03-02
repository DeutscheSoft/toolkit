 /* toolkit. provides different widgets, implements and modules for 
 * building audio based applications in webbrowsers.
 * 
 * Invented 2013 by Markus Schmidt <schmidt@boomshop.net>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General
 * Public License along with this program; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, 
 * Boston, MA  02110-1301  USA
 */

repositionSVGs = function () {
    // searches all svg that don't have the class "fixed" and re-positions them
    // for avoiding blurry lines
    $$("svg:not(.svg-fixed)").each(function (e) {
        repositionSVG(e);
    });
}
repositionSVG = function (e) {
    // move svgs if their positions in viewport is not int
    if (e.retrieve("margin-left") === null) {
        e.store("margin-left", e.getStyle("margin-left").toFloat());
    } else {
        e.style['margin-left'] = e.retrieve("margin-left");
    }
    var l = e.retrieve("margin-left").toFloat();
    var b = e.getBoundingClientRect();
    var x = b.left % 1;
    if (x) {
        
        if (x < 0.5) l -= x;
        else l += (1 - x);
    }
    if (e.getParent() && e.getParent().getStyle("text-align") == "center")
        l += 0.5;
    e.style["margin-left"] = l + "px";
    if (e.retrieve("margin-top") === null) {
        e.store("margin-top", e.getStyle("margin-top").toFloat());
    } else {
        e.style["margin-top"] = e.retrieve("margin-top");
    }
    var t = e.retrieve("margin-top").toFloat();
    var b = e.getBoundingClientRect();
    var y = b.top % 1;
    if (y) {
        if (x < 0.5) t -= y;
        else t += (1 - y);
    }
    e.style["margin-top"] = t + "px";
}
if (!Browser.firefox) {
    window.addEvent('load', repositionSVGs);
    window.addEvent('scroll', repositionSVGs);
    window.addEvent('resize', repositionSVGs);
}

makeSVG = function (tag, args) {
    // creates and returns an SVG object
    // 
    // arguments:
    // tag: the element to create as string, e.g. "line" or "g"
    // args: the options to set in the element
    // 
    // returns: the newly created object
    var el= document.createElementNS('http://www.w3.org/2000/svg', "svg:" + tag);
    for (var k in args)
        el.setAttribute(k, args[k]);
    return $(el);
}
/**
 * This method allow to easily add a CSS class to any SVG element
 * 
 * The classList parameter is a string of white space separated CSS class name.
 * 
 * Conveniently, this method return the object itself in order to easily chain
 * method call.
 *
 * @param classList string
 */
 
// Testing the existence of the global SVGElement object to safely extend it.
if (SVGElement && SVGElement.prototype) {
    SVGElement.prototype.addClass = function addClass(classList) {
        "use strict";

        // Because the className property can be animated through SVG, we have to reach
        // the baseVal property of the className SVGAnimatedString object.
        var currentClass = this.className.baseVal;

        // Note that all browsers which currently support SVG also support Array.forEach()
        classList.split(' ').forEach(function (newClass) {
            var tester = new RegExp('\\b' + newClass + '\\b', 'g');

            if (-1 === currentClass.search(tester)) {
                currentClass += ' ' + newClass;
            }
        });

        // The SVG className property is a readonly property so 
        // we must use the regular DOM API to write our new classes.
        this.setAttribute('class', currentClass);

        return this;
    };
}


/**
 * This method allow to easily remove a CSS class to any SVG element
 * 
 * The classList parameter is a string of white space separated CSS class name.
 * 
 * Conveniently, this method return the object itself in order to easily chain
 * method call.
 *
 * @param classList string
 */
  
// Testing the existence of the global SVGElement object to safely extend it.
if (SVGElement && SVGElement.prototype) {
    SVGElement.prototype.removeClass = function removeClass(classList) {
        "use strict";

        // Because the className property can be animated through SVG, we have to reach
        // the baseVal property of the className SVGAnimatedString object.
        var currentClass = this.className.baseVal;

        // Note that all browsers which currently support SVG also support Array.forEach()
        classList.split(' ').forEach(function (newClass) {
            var tester = new RegExp(' *\\b' + newClass + '\\b *', 'g');

            currentClass = currentClass.replace(tester, ' ');
        });

        // The SVG className property is a readonly property so 
        // we must use the regular DOM API to write our new classes.
        // Note that all browsers which currently support SVG also support String.trim()
        this.setAttribute('class', currentClass.trim());

        return this;
    };
}
