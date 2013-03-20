/**
 * FastClick: Set up handling of fast clicks
 *
 * On touch WebKit (eg Android, iPhone) onclick events are usually 
 * delayed by ~300ms to ensure that they are clicks rather than other
 * interactions such as double-tap to zoom.
 *
 * To work around this, add a document listener which converts touches
 * to clicks on a global basis, excluding scrolls and gestures.  The 
 * default click events are then cancelled to prevent double-clicks.
 *
 * This function automatically adapts if no action is required (eg if 
 * touch events are not supported), and also handles functionality such
 * as preventing actions in the page while the section selector
 * is displaying.
 *
 * One alternative is to use ontouchend events for everything, but that
 * prevents non-touch interaction, and
 * requires checks everywhere to ensure that a touch wasn't a 
 * scroll/swipe/etc.
 *
 * ------
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the 
 * "Software"), to deal in the Software without restriction, including 
 * without limitation the rights to use, copy, modify, merge, publish, 
 * distribute, sublicense, and/or sell copies of the Software, and to 
 * permit persons to whom the Software is furnished to do so, subject 
 * to the following conditions:
 * 
 * The below copyright notice and this permission notice shall be 
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS 
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN 
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
 *
 * @licence MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @copyright (c) 2011 Assanka Limited
 * @author Rowan Beentje <rowan@assanka.net>, Matt Caruana Galizia <matt@assanka.net>
 */

var FastClick = (function() {

    // Determine whether touch handling is supported
    var touchSupport = 'ontouchstart' in window;

    return function(layer) {
        if (!(layer instanceof HTMLElement)) {
            throw new TypeError('Layer must be instance of HTMLElement');
        }

        // Set up event handlers as required
        if (touchSupport) {
            layer.addEventListener('touchstart', onTouchStart, true);
            layer.addEventListener('touchmove', onTouchMove, true);
            layer.addEventListener('touchend', onTouchEnd, true);
            layer.addEventListener('touchcancel', onTouchCancel, true);
        }
        layer.addEventListener('click', onClick, true);

        // If a handler is already declared in the element's onclick attribute, it will be fired before
        // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
        // adding it as listener.
        if (layer.onclick instanceof Function) {
            layer.addEventListener('click', layer.onclick, false);
            layer.onclick = '';
        }

        // Define touch-handling variables
        var clickStart = { x: 0, y: 0, scroll: 0 }, trackingClick = false;
    
        // On touch start, record the position and scroll offset.
        function onTouchStart(event) {
            trackingClick = true;
            clickStart.x = event.targetTouches[0].clientX;
            clickStart.y = event.targetTouches[0].clientY;
            clickStart.scroll = window.pageYOffset;
    
            return true;
        }
    
        // If the touch moves more than a small amount, cancel any derived clicks.
        function onTouchMove(event) {
            if (trackingClick) {
                if (Math.abs(event.targetTouches[0].clientX - clickStart.x) > 10 || Math.abs(event.targetTouches[0].clientY - clickStart.y) > 10) {
                    trackingClick = false;
                }
            }
    
            return true;
        }
    
        // On touch end, determine whether to send a click event at once.
        function onTouchEnd(event) {
            var targetElement, clickEvent;
    
            // If the touch was cancelled (eg due to movement), or if the page has scrolled in the meantime, return.
            if (!trackingClick || Math.abs(window.pageYOffset - clickStart.scroll) > 5) {
                return true;
            }
    
            // Derive the element to click as a result of the touch.
            targetElement = document.elementFromPoint(clickStart.x, clickStart.y);
    
            // If the targeted node is a text node, target the parent instead.
            if (targetElement.nodeType === Node.TEXT_NODE) {
                targetElement = targetElement.parentNode;
            }
    
            // Unless the element is marked as only requiring a non-programmatic click, synthesise a click
            // event, with an extra attribute so it can be tracked.
            if (!(targetElement.className.indexOf('clickevent') !== -1 && targetElement.className.indexOf('touchandclickevent') === -1)) {
                clickEvent = document.createEvent('MouseEvents');
                clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0, clickStart.x, clickStart.y, false, false, false, false, 0, null);
                clickEvent.forwardedTouchEvent = true;
                targetElement.dispatchEvent(clickEvent);
            }
    
            // Prevent the actual click from going though - unless the target node is marked as requiring
            // real clicks or if it is a SELECT, in which case only non-programmatic clicks are permitted
            // to open the options list and so the original event is required.
            if (!(targetElement instanceof HTMLSelectElement) &&
                targetElement.className.indexOf('clickevent') === -1) {
                event.preventDefault();
            } else {
                return false;
            }
        }

        function onTouchCancel(event) {
            trackingClick = false;
        }
    
        // On actual clicks, determine whether this is a touch-generated click, a click action occurring 
        // naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
        // an actual click which should be permitted.
        function onClick(event) {
            if (!window.event) {
                return true;
            }
    
            var allowClick = true;
            var targetElement;
            var forwardedTouchEvent = window.event.forwardedTouchEvent;
    
            // For devices with touch support, derive and check the target element to see whether the
            // click needs to be permitted; unless explicitly enabled, prevent non-touch click events
            // from triggering actions, to prevent ghost/doubleclicks.
            if (touchSupport) {
                targetElement = document.elementFromPoint(clickStart.x, clickStart.y);
                if (!targetElement ||  
                    (!forwardedTouchEvent && targetElement.className.indexOf('clickevent') == -1)) {
                    allowClick = false;
                }
            }

            // If clicks are permitted, return true for the action to go through.
            if (allowClick) {
                return true;
            }
    
            // Otherwise cancel the event
            event.stopPropagation();
            event.preventDefault();

            // Prevent any user-added listeners declared on FastClick element from being fired.
            event.stopImmediatePropagation();

            return false;
        }
    }

})();