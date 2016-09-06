/*
 * This file is part of toolkit.
 *
 * toolkit is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * toolkit is distributed in the hope that it will be useful,
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
/**
 * GlobalCursor adds global cursor classes to ensure
 * one of the standard cursors (http://www.echoecho.com/csscursors.htm)
 * is shown in the overall application.
 *
 * @mixin TK.GlobalCursor
 */
w.TK.GlobalCursor = w.GlobalCursor = $class({
    _class: "GlobalCursor",
    /**
     * Adds a class <code>"toolkit-cursor-" + cursor</code> to the <code>document.body</code> to show a specific cursor.
     * @method TK.GlobalCursor#global_cursor
     * @param {string} cursor - The name of the cursor to show (http://www.echoecho.com/csscursors.htm)
     * @emits TK.GlobalCursor#globalcursor
     */
    global_cursor: function (cursor) {
        TK.add_class(document.body, "toolkit-cursor-" + cursor);
        /**
         * Is fired when a cursor gets set.
         * @event TK.GlobalCursor#globalcursor
         * @type {string}
         */
        this.fire_event("globalcursor", cursor);
    },
    /**
     * Removes the class from <code>document.body</code> node.
     *
     * @method TK.GlobalCursor#remove_cursor
     * @param {string} cursor - The name of the cursor to remove (http://www.echoecho.com/csscursors.htm)
     */
    remove_cursor: function (cursor) {
        TK.remove_class(document.body, "toolkit-cursor-" + cursor);
        /**
         * Is fired when a cursor is removed.
         * @event TK.GlobalCursor#cursorremoved
         * @type {string}
         */
        this.fire_event("cursorremoved", cursor);
    }
});
})(this);
