/*
 * This file is part of Toolkit.
 *
 * Toolkit is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * Toolkit is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU General
 * Public License along with this program; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA  02110-1301  USA
 */
"use strict";
(function (w, TK) {

TK.ListItem = TK.class({
    /**
     * TK.ListItem is a member {@link TK.Container} of {@TK.List}s. The
     * element is a LI instead of a DIV.
     * 
     * @class TK.List
     * 
     * @extends TK.Container
     */
    _class: "ListItem",
    Extends: TK.Container,
    
    initialize: function (options) {
        this.element = TK.element("li", "toolkit-list-item");
        TK.Container.prototype.initialize.call(this, options);
    },
});
    
})(this, this.TK);
