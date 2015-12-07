 /* toolkit provides different widgets, implements and modules for 
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
"use strict";
(function(w){ 
w.GlobalCursor = $class({
    /* @class: GlobalCursor
     * @description: GlobalCursor adds global cursor classes to enshure
     * one of the standard cursors (http://www.echoecho.com/csscursors.htm)
     * is shown in the overall application */
    _class: "GlobalCursor",
    global_cursor: function (cursor) {
        /* @method: global_cursor
         * @parameter: cursor; String; undefined; The decriptor of the cursor to show (http://www.echoecho.com/csscursors.htm)
         * @description: Adds a specific class to the body DOM node to show a specific cursor */
        TK.add_class(document.body, "toolkit-cursor-" + cursor);
        /* @event: globalcursor; Cursor, Widget; Is fired when a cursor gets set */
        this.fire_event("globalcursor", cursor);
    },
    remove_cursor: function (cursor) {
        /* @method: remove_cursor
         * @parameter: cursor; String; undefined; The decriptor of the cursor to remove (http://www.echoecho.com/csscursors.htm)
         * @description: Removes a specific class to the body DOM node to show a specific cursor */
        TK.remove_class(document.body, "toolkit-cursor-" + cursor);
        /* @event: cursorremoved; Cursor, Widget; Is fired when a cursor is removed */
        this.fire_event("cursorremoved", cursor);
    }
});
})(this);
