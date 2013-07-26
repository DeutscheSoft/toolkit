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
 

Array.implement({
    _binarySearch: function (arr, val, insert) {
        var high = arr.length, low = -1, mid;
        while (high - low > 1) {
            mid = (high + low) >> 1;
            if (arr[mid] < val) low = mid;
            else high = mid;
        }
        if (arr[high] == val || insert) {
            return high;
        } else {
            return -1;
        }
    },
    next: function (val, sort) {
        if (sort)
        var arr = this.slice(0).sort(function(a,b){return a-b;});
        else var arr = this;
        // Get index
        var i = this._binarySearch(arr, val, true);
        // Check boundaries
        return (i >= 0 && i < arr.length) ? arr[i] : arr[arr.length - 1];
    }

});
