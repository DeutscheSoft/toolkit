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
