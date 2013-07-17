
var CritBit = {};
CritBit.Test = {};
CritBit.Test.Simple = UTIL.Test.extend({
    constructor : function(keys) {
 this.keys = keys.concat();
 this.tree = new CritBit.Tree();
    },
    test_0_insert : function() {
 for (var i = 0; i < this.keys.length; i++) {
     this.tree.insert(this.keys[i], i);



     if (this.tree.index(this.keys[i]) != i)
  return this.error("foo");
 }
 if (this.tree.length() != this.keys.length)
     return this.fatal(UTIL.sprintf("wrong size (%d vs %d).", this.tree.length(),
         this.keys.length));
 this.success();
    },
    test_1_lookup : function() {
 var t;
 for (var i = 0; i < this.keys.length; i++)
     if ((t = this.tree.index(this.keys[i])) != i)
  return this.error("lookup failed: %o gave %o. should be %o",
      this.keys[i], t, i);
 this.success();
    },
    test_2_next : function() {
 var t;
 for (var i = 0; i < this.keys.length-1; i++)
     if ((t = this.tree.next(this.keys[i])) != this.keys[i+1])
  return this.error("next failed. next(%o) gives %o. should be: %o", this.keys[i], t, this.keys[i+1]);
 this.success();
    },
    test_3_next : function() {
 this.tree = new CritBit.Tree();
 for (var i = 1; i < this.keys.length; i+=2) {
     this.tree.insert(this.keys[i], i);
 }

 for (var i = 0; i < this.keys.length-1; i+=2) {
     var t;
     if ((t = this.tree.next(this.keys[i])) != this.keys[i+1]) {
  return this.error("next failed: %o gave %o. should be %o", this.keys[i], t, this.keys[i+1]);
     }
 }

 this.success();
    },
});
CritBit.Test.RangeSet = UTIL.Test.extend({
    constructor : function(keys) {
 this.keys = keys.concat();
 this.keys.sort(function(a, b) {
     if (a <= b && a >= b) return 0;
     else if (a >= b) return 1;
     else return -1;
 });
 this.n = keys.length >> 1;
    },
    test_0_merge : function() {
 var s = new CritBit.RangeSet();
 for (var i = 0; i < this.n; i++) {
     var r = new CritBit.Range(this.keys[this.n-1-i],
          this.keys[this.n+i]);
     s.insert(r);



     if (!s.contains(r))
  return this.error("Does not contain %o after inserting it.", r);
     if (s.size() != 1)
  return this.error("%o suddenly has more than one range (has %d).\n",
      s, s.size());
 }
 this.success();
    },
    test_1_merge : function() {
 var s = new CritBit.RangeSet();
 for (var i = 1; i < this.keys.length; i++) {
     if (this.keys[i] <= this.keys[i-1])
  UTIL.error("%o is badly sorted at pos %d", this.keys, i);
 }
 for (var i = 1; i+1 < this.keys.length-1; i+=2) {
     s.insert(new CritBit.Range(this.keys[i],
           this.keys[i+1]));



     if (s.size() != (i+1)/2)
  return this.error("%o suddenly has wrong amount of ranges (%d vs %d).\n",
      s, i, s.ranges().length);
 }
 s.insert(new CritBit.Range(this.keys[0], this.keys[this.keys.length-1]));

 if (s.size() != 1)
     return this.error("%o suddenly has wrong amount of ranges.\n", s);
 this.success();
    }
});
CritBit.Test.RangeMinus = UTIL.Test.extend({
    _low_minus : function(a, change, check) {
 var t1 = new CritBit.RangeSet();
 var t2 = new CritBit.RangeSet();
 var fail = false;;

 for (var i = 0; i < a.length - 1; i+=2) {
     var r = new CritBit.Range(a[i], a[i+1]);
     t1.insert(r);
     t2.insert(change(r));
 }

 t2 = t1.minus(t2);

 var c = 0;
 t2.tree.foreach(UTIL.make_method(this, function(a, range) {
     if (!check(c, range.a, range.b)) {
  this.error("Check says no to range %d [%o...%o]", c, range.a, range.b);
  fail = true;
  return true;
     }

     c++;
 }));
 return fail;
    },
    test_2_minus : function() {
 this.l = [ 1, 19, 23, 30, 90, 180, 3000, 7000 ];
 this.success();
    },
    test_3_minus : function() {
 var l = this.l;
 if (this._low_minus(l, function(r) {
     return new CritBit.Range(r.a+2, r.b-2);
 }, function(c, a, b) {
     if ((c-1) & 1)
  return (a == l[c] && b == l[c]+2);
     else
  return (a == l[c]-2 && b == l[c]);
 })) return;
 this.success();
    },
    test_4_minus : function() {
 var l = this.l;
 if (this._low_minus(l, function(r) {
     return new CritBit.Range(r.a-2, r.b-2);
 }, function(c, a, b) {
     return (a == l[2*c+1]-2 && b == l[2*c+1]);
 })) return;

 this.success();
    }
});
CritBit.sizeof = function(key) {
    return ((((typeof(key) === "number") && ((key) % 1 == 0)) || key instanceof Date) ? new CritBit.Size(1, 0) : ((typeof(key) === "string" || (key) instanceof String)) ? new CritBit.Size(key.length, 0) : (key.sizeof) ? key.sizeof() : UTIL.error("don't know the size of %o", key));
};
CritBit.get_bit = function(key, size) {
    return ((((typeof(key) === "number") && ((key) % 1 == 0)) ? (key & (1 << (31-size.bits))) : (typeof(key) === "string" || (key) instanceof String) ? (key.charCodeAt(size.chars) & (1 << (15-size.bits))) : (key instanceof Date) ? (Math.floor(key.getTime()/1000) & (1 << (31-size.bits))) : !!key.get_bit ? key.get_bit(size) : error("bad argument to GET_BIT()") ? 1 : 0) ? 1 : 0);
};
CritBit.Size = function(chars, bits) {
 this.chars = chars;
 this.bits = bits;
};
CritBit.Size.prototype = {
    eq : function(b) {
 return this.chars == b.chars && this.bits == b.bits;
    },
    lt : function(b) {
 return this.chars < b.chars || (this.chars == b.chars && this.bits < b.bits);
    },
    ge : function(b) {
 return b.le(this);
    },
    gt : function(b) {
 return b.lt(this);
    },
    le : function(b) {
 return this.eq(b) || this.lt(b);
    },
    min : function(b) {
 return b.lt(this) ? b : this;
    },
    max : function(b) {
 return b.lt(this) ? this : b;
    },
    toString : function() {
 return "S("+this.chars+":"+this.bits+")";
    }
};
CritBit.clz = function(x) {
    if (x < 0)
 x = (2*(x >>> 1)) + (x&1);
    else if (x == 0) return 0;
    return Math.floor(Math.log(x)/Math.LN2)+1;
};
CritBit.count_prefix = function(key1, key2, start) {
    if (!start) start = new CritBit.Size(0,0);
    if (typeof(key1) == typeof(key2)) {
 if ((typeof(key1) === "string" || (key1) instanceof String)) {
     if (key1 == key2) return new CritBit.Size(key1.length, 0);
     if (key1.length > key2.length) {
  var t = key1;
  key1 = key2;
  key2 = t;
     }
     for (var i = start.chars; i < key1.length; i++) {
  if (key1.charCodeAt(i) != key2.charCodeAt(i)) {
      return new CritBit.Size(i, 16 - CritBit.clz(key1.charCodeAt(i) ^ key2.charCodeAt(i)));
  }
     }
     return ((((typeof(key1) === "number") && ((key1) % 1 == 0)) || key1 instanceof Date) ? new CritBit.Size(1, 0) : ((typeof(key1) === "string" || (key1) instanceof String)) ? new CritBit.Size(key1.length, 0) : (key1.sizeof) ? key1.sizeof() : UTIL.error("don't know the size of %o", key1));
 } else if (((typeof(key1) === "number") && ((key1) % 1 == 0))) {
     if (key1 == key2) return new CritBit.Size(1,0);
     return new CritBit.Size(0, 32 - CritBit.clz(key1 ^ key2));
 } else if (key1 instanceof Date) {
     key1 = Math.floor(key1.getTime()/1000);
     key2 = Math.floor(key2.getTime()/1000);
     return CritBit.count_prefix(key1, key2, start);
 }
    } else if (UTIL.objectp(key1) && key1.count_prefix) {
 return key1.count_prefix(key2);
    } else if (UTIL.objectp(key2) && key2.count_prefix) {
 return key2.count_prefix(key1);
    }
    UTIL.error("Cannot count common prefix of %o and %o.", key1, key2);
};
CritBit.add = function(key, length) {
    if ((typeof(key) === "string" || (key) instanceof String)) {
 UTIL.error("we ont have a string metric yet!");
    } else if (((typeof(key) === "number") && ((key) % 1 == 0))) {
 return key + length;
    } else if (key instanceof Date) {
 var t = new Date();
 t.setTime(key.getTime() + length*1000);
 return t;
    }
};
CritBit.dist = function(a, b) {
    if ((typeof(a) === "string" || (a) instanceof String) && (typeof(b) === "string" || (b) instanceof String)) {
 UTIL.error("we ont have a string metric yet!");
    } else if (((typeof(a) === "number") && ((a) % 1 == 0)) && ((typeof(b) === "number") && ((b) % 1 == 0))) {
 return Math.abs(a-b);
    } else if (a instanceof Date && b instanceof Date) {
 return Math.floor(Math.abs((a-b)/1000));
    }
};
CritBit.min = function(a, b) {
    if (a > b) return b;
    return a;
};
CritBit.max = function(a, b) {
    if (a > b) return a;
    return b;
};
CritBit.lt = function(a, b) { return (a instanceof Date && b instanceof Date) ? a.getTime() < b.getTime() : a < b; };
CritBit.gt = function(a, b) { return (a instanceof Date && b instanceof Date) ? a.getTime() > b.getTime() : a > b; };
CritBit.eq = function(a, b) { return (a instanceof Date && b instanceof Date) ? a.getTime() === b.getTime() : a === b; };
CritBit.le = function(a, b) { return (a instanceof Date && b instanceof Date) ? a.getTime() <= b.getTime() : a <= b; };
CritBit.ge = function(a, b) { return (a instanceof Date && b instanceof Date) ? a.getTime() >= b.getTime() : a >= b; };
CritBit.Node = function(key, value) {
    this.key = key;
    this.len = ((((typeof(key) === "number") && ((key) % 1 == 0)) || key instanceof Date) ? new CritBit.Size(1, 0) : ((typeof(key) === "string" || (key) instanceof String)) ? new CritBit.Size(key.length, 0) : (key.sizeof) ? key.sizeof() : UTIL.error("don't know the size of %o", key));
    this.value = value;
    this.has_value = (arguments.length >= 2);
    this.size = this.has_value ? 1 : 0;
    this.C = [ null, null ];
    this.P = null;
};
CritBit.Node.prototype = {
    toString : function() {
 return UTIL.sprintf("Node(%o, len(%d,%d), %o)", this.key,
       this.len.chars, this.len.bits, this.has_value);
    },
    copy : function() {
 var n;
 if (this.has_value) n = new CritBit.Node(this.key, this.value);
 else n = new CritBit.Node(this.key);
 if (this.C[0]) n.child(0, this.child(0).copy());
 if (this.C[1]) n.child(1, this.child(0).copy());
 return n;
    },
    child : function(bit, node) {
 if (arguments.length >= 2) {
     this.C[(!bit) ? 0 : 1] = node;
     node.P = this;
 } else return this.C[(!bit) ? 0 : 1];
    },
    depth : function() {
 var a = 0, b = 0;
 if (this.C[0]) a = this.C[0].depth();
 if (this.C[1]) b = this.C[1].depth();
 return 1 + Math.max(a, b);
    },
    first : function() {
 if (!this.has_value && this.C[0]) return this.C[0].first();
 return this;
    },
    last : function() {
 if (this.C[1]) return this.C[1].last();
 if (this.C[0]) return this.C[0].last();
 return this;
    },
    nth : function(n) {
 var ln;
 if (n > this.size-1) return null;
 if (n <= 0 && this.has_value) return this;
 if (this.has_value) n --;
 if (this.C[0]) {
     ln = this.C[0].size;
     if (n < ln) {
  return this.C[0].nth(n);
     }
     n -= ln;
 }
 return this.C[1].nth(n-ln);
    },
    up : function(sv) {
 if (sv && this.has_value) return this;
 if (this.P) return this.P.up(true);
 return null;
    },
    forward : function() {
 if (this.C[0]) {
     return this.C[0].first();
 }
 if (this.C[1]) {
     return this.C[1].first();
 }
 return this.up_left();
    },
    backward : function() {
 if (this.P) {
     var n = this;
     while (n.P) {
  var bit = (n.P.C[1] == n);
  if (bit && n.P.C[0])
      return n.P.C[0].last();
  n = n.P;
  if (n.has_value) return n;
     }
 }
 return null;
    },
    up_left : function() {
 var n = this;
 while (n.P) {
     if (n.P.C[0] === n && n.P.C[1])
  return n.P.C[1].first();
     n = n.P;
 }
 return null;
    },
    find_best_match : function(key, start) {
 if (!start) start = new CritBit.Size(0,0);
 var len = CritBit.count_prefix(key, this.key, start);
 var klen = ((((typeof(key) === "number") && ((key) % 1 == 0)) || key instanceof Date) ? new CritBit.Size(1, 0) : ((typeof(key) === "string" || (key) instanceof String)) ? new CritBit.Size(key.length, 0) : (key.sizeof) ? key.sizeof() : UTIL.error("don't know the size of %o", key));
 len = len.min(this.len).min(klen);
 if (len.le(start)) return null;
 if (len.eq(this.len)) {
     if (len.eq(klen)) {
  return this;
     }
     var bit = ((((typeof(key) === "number") && ((key) % 1 == 0)) ? (key & (1 << (31-this.len.bits))) : (typeof(key) === "string" || (key) instanceof String) ? (key.charCodeAt(this.len.chars) & (1 << (15-this.len.bits))) : (key instanceof Date) ? (Math.floor(key.getTime()/1000) & (1 << (31-this.len.bits))) : !!key.get_bit ? key.get_bit(this.len) : error("bad argument to GET_BIT()") ? 1 : 0) ? 1 : 0);
     if (this.C[bit]) {
  var n = this.C[bit].find_best_match(key, len);
  if (n) return n;
     }
     return this;
 }
 return null;
    },
    find_next_match : function(key, start) {
 if (!start) start = new CritBit.Size(0,0);
 var len = CritBit.count_prefix(key, this.key, start);
 len = len.min(this.len).min(((((typeof(key) === "number") && ((key) % 1 == 0)) || key instanceof Date) ? new CritBit.Size(1, 0) : ((typeof(key) === "string" || (key) instanceof String)) ? new CritBit.Size(key.length, 0) : (key.sizeof) ? key.sizeof() : UTIL.error("don't know the size of %o", key)));
 if (len.lt(start)) return null;
 if (len.eq(((((typeof(key) === "number") && ((key) % 1 == 0)) || key instanceof Date) ? new CritBit.Size(1, 0) : ((typeof(key) === "string" || (key) instanceof String)) ? new CritBit.Size(key.length, 0) : (key.sizeof) ? key.sizeof() : UTIL.error("don't know the size of %o", key))))
     return (len.eq(this.len)) ? this.forward() : this.first();
 var bit = ((((typeof(key) === "number") && ((key) % 1 == 0)) ? (key & (1 << (31-len.bits))) : (typeof(key) === "string" || (key) instanceof String) ? (key.charCodeAt(len.chars) & (1 << (15-len.bits))) : (key instanceof Date) ? (Math.floor(key.getTime()/1000) & (1 << (31-len.bits))) : !!key.get_bit ? key.get_bit(len) : error("bad argument to GET_BIT()") ? 1 : 0) ? 1 : 0);
 if (len.eq(this.len)) {
     if (this.C[bit]) {
  var n = this.C[bit].find_next_match(key, len);
  if (n) return n;
     }
     if (!bit && this.C[1]) {
  return this.C[1].first();
     }
     return this.up_left();
 }
 if (bit == 0) {
     return this.first();
 }
 return this.up_left();
    },
    find_prev_match : function(key, start) {
 if (!start) start = new CritBit.Size(0,0);
 var len = CritBit.count_prefix(key, this.key, start);
 var klen = ((((typeof(key) === "number") && ((key) % 1 == 0)) || key instanceof Date) ? new CritBit.Size(1, 0) : ((typeof(key) === "string" || (key) instanceof String)) ? new CritBit.Size(key.length, 0) : (key.sizeof) ? key.sizeof() : UTIL.error("don't know the size of %o", key));
 len = len.min(this.len).min(klen);
 if (len.lt(start)) {
     return null;
 }
 if (len.eq(klen))
     return this.backward();
 var bit = ((((typeof(key) === "number") && ((key) % 1 == 0)) ? (key & (1 << (31-len.bits))) : (typeof(key) === "string" || (key) instanceof String) ? (key.charCodeAt(len.chars) & (1 << (15-len.bits))) : (key instanceof Date) ? (Math.floor(key.getTime()/1000) & (1 << (31-len.bits))) : !!key.get_bit ? key.get_bit(len) : error("bad argument to GET_BIT()") ? 1 : 0) ? 1 : 0);
 if (len.eq(this.len)) {
     if (this.C[bit]) {
  var n = this.C[bit].find_prev_match(key, len);
  if (n) return n;
     }
     if (bit && this.C[0]) {
  return this.C[0].last();
     }
     return this.backward();
 } else if (bit)
     return this.last();
 return this.backward();
    },
    insert : function(node, start) {
 if (!node.has_value) return this;
 if (!start) start = new CritBit.Size(0,0);
 var bit, k, l;
 var len = CritBit.count_prefix(node.key, this.key, start);
 len = len.min(this.len).min(node.len);
 if (len.lt(start)) UTIL.error("something is really bad.");
 if (len.eq(this.len)) {
     if (len.eq(node.len)) {
  this.value = node.value;
  this.key = node.key;
  if (!this.has_value) this.size ++;
  this.has_value = true;
  return this;
     }
     k = node.key;
     l = this.len;
     bit = ((((typeof(node.key) === "number") && ((node.key) % 1 == 0)) ? (node.key & (1 << (31-this.len.bits))) : (typeof(node.key) === "string" || (node.key) instanceof String) ? (node.key.charCodeAt(this.len.chars) & (1 << (15-this.len.bits))) : (node.key instanceof Date) ? (Math.floor(node.key.getTime()/1000) & (1 << (31-this.len.bits))) : !!node.key.get_bit ? node.key.get_bit(this.len) : error("bad argument to GET_BIT()") ? 1 : 0) ? 1 : 0);
     if (this.C[bit]) {
  var oldsize = this.C[bit].size;
  this.child(bit, this.C[bit].insert(node, len));
  if (this.C[bit].size > oldsize) this.size++;
  return this;
     } else {
  this.child(bit, node);
  this.size++;
     }
     return this;
 }
 k = this.key;
 bit = ((((typeof(k) === "number") && ((k) % 1 == 0)) ? (k & (1 << (31-len.bits))) : (typeof(k) === "string" || (k) instanceof String) ? (k.charCodeAt(len.chars) & (1 << (15-len.bits))) : (k instanceof Date) ? (Math.floor(k.getTime()/1000) & (1 << (31-len.bits))) : !!k.get_bit ? k.get_bit(len) : error("bad argument to GET_BIT()") ? 1 : 0) ? 1 : 0);
 if (len.eq(node.len)) {
     node.child(bit, this);
     node.size += this.size;
     return node;
 } else {
     var n = new CritBit.Node(node.key);
     n.len = len;
     n.size = this.size + node.size;
     n.P = this.P;
     n.child(bit, this);
     n.child(!bit, node);
     return n;
 }
    }
};
CritBit.Tree = Base.extend({
    constructor : function() {
 this.root = null;
    },
    copy : function() {
 var t = new CritBit.Tree();
 if (this.root) t.root = this.root.copy();
 return t;
    },
    index : function(key) {
 var node = this.low_index(key);
 if (node && node.has_value) return node.value;
 return null;
    },
    low_index : function(key) {
 var node = this.root;
 var len = ((((typeof(key) === "number") && ((key) % 1 == 0)) || key instanceof Date) ? new CritBit.Size(1, 0) : ((typeof(key) === "string" || (key) instanceof String)) ? new CritBit.Size(key.length, 0) : (key.sizeof) ? key.sizeof() : UTIL.error("don't know the size of %o", key));
 while (node) {
     var l = node.len;
     if (l.lt(len)) {
  var bit = ((((typeof(key) === "number") && ((key) % 1 == 0)) ? (key & (1 << (31-l.bits))) : (typeof(key) === "string" || (key) instanceof String) ? (key.charCodeAt(l.chars) & (1 << (15-l.bits))) : (key instanceof Date) ? (Math.floor(key.getTime()/1000) & (1 << (31-l.bits))) : !!key.get_bit ? key.get_bit(l) : error("bad argument to GET_BIT()") ? 1 : 0) ? 1 : 0);
  node = node.C[bit];
  continue;
     } else if (node.key == key
      || (node.key >= key && node.key <= key)) {
  return node;
     }
     break;
 }
 return null;
    },
    depth : function() {
 if (this.root) return this.root.depth();
 return 0;
    },
    last : function() {
 if (this.root) return this.root.last().key;
 return null;
    },
    first : function() {
 if (this.root) return this.root.first().key;
 return null;
    },
    nth : function(n) {
 if (this.root) {
     var node = this.root.nth(n);
     return node ? node.key : null;
 }
 return null;
    },
    ge : function(key) {
 if (!this.root) return null;
 var node = this.low_index(key);
 if (node) return node;
 return this.root.find_next_match(key);
    },
    gt : function(key) {
 if (!this.root) return null;
 var node = this.low_index(key);
 if (node) return node.forward();
 return this.root.find_next_match(key);
    },
    next : function(key) {
 var node = this.gt(key);
 return node ? node.key : null;
    },
    lt : function(key) {
 if (!this.root) return null
 var node = this.low_index(key);
 if (node) return node.backward();
 return this.root.find_prev_match(key);
    },
    le : function(key) {
 if (!this.root) return null
 var node = this.low_index(key);
 if (node) return node;
 return this.root.find_prev_match(key);
    },
    previous : function(key) {
 var node = this.lt(key);
 return node ? node.key : null;
    },
    insert : function(key, value) {
 this.root = this.root ? this.root.insert(new CritBit.Node(key, value)) : new CritBit.Node(key, value);
    },
    set : function(key, value) {
       this.insert(key, value);
    },
    get_subtree : function(key) {
    },
    remove : function(key) {
 var n = this.low_index(key);
 if (n) {
     n.value = undefined;
     n.has_value = false;
     while (n) {
  if (!(--n.size)) {
      if (!n.P) {
   this.root = null;
   return;
      }
      var bit = (n.P.C[1] === n ? 1 : 0);
      n.P.C[bit] = null;
  }
  n = n.P;
     }
 }
    },
    length : function() {
 return this.root ? this.root.size : 0;
    },
    foreach : function(fun, start, stop) {
 var node;
 if (!this.root) return;
 if (arguments.length >= 2) {
     node = this.ge(start);
     if (arguments.length == 3) {
  stop = this.le(stop);
     }
 }
 if (!node) node = this.root.first();
 if (!node) return;
 do {
     if (fun(node.key, node.value) || node == stop) return;
 } while (node = node.forward());
    },
    forEach : function(cb) {
       this.foreach(cb);
    },
    backeach : function(fun, start, stop) {
 var node;
 if (!this.root) return;
 if (arguments.length >= 2) {
     node = this.le(start);
     if (arguments.length == 3) {
  stop = this.ge(stop);
     }
 }
 if (!node) node = this.root.last();
 if (!node) return;
 do {
     if (fun(node.key, node.value) || node == stop) return;
 } while (node = node.backward());
    },
    find_best_match : function(key) {
 if (!this.root) return null;
 return this.root.find_best_match(key);
    },
    keys : function() {
 if (!this.root) return [];
 var ret = new Array(this.root.size);
 var i = 0;
 var node = this.root.first();
 do {
     ret[i++] = node.key;
 } while(node = node.forward());
 return ret;
    },
    values : function() {
 if (!this.root) return [];
 var ret = new Array(this.root.size);
 var i = 0;
 var node = this.root.first();
 do {
     ret[i++] = node.value;
 } while(node = node.forward());
 return ret;
    }
});
CritBit.Range = function(a, b, value) {
    this.a = a;
    this.b = b;
    if (arguments.length > 1) {
 if (a >= b && !(a <= b))
     UTIL.error("Bad range. Ends before it starts [%o..%o].\n", a, b);
 if (arguments.length > 2)
     this.value = value;
    }
};
CritBit.Range.prototype = {
    toArray : function() {
 return [ this.a, this.b ];
    },
    overlaps : function(range) {
 return CritBit.le(range.a, this.b) && CritBit.ge(range.b, this.a);
    },
    touches : function(range) {
 return this.overlaps(range);
    },
    contains : function(i) {
 if (i instanceof CritBit.Range)
     return CritBit.le(this.a, i.a) && CritBit.ge(this.b, i.b);
 return CritBit.le(this.a, i) && CritBit.ge(this.b, i);
    },
    length : function() {
 if (this.a instanceof Date) {
     return Math.floor((this.b-this.a)/1000);
 }
 return this.b-this.a;
    },
    toString : function() {
 if (this.hasOwnProperty("value"))
     return UTIL.sprintf("[%o..%o]<%o>", this.a, this.b, this.value);
 else
     return UTIL.sprintf("[%o..%o]", this.a, this.b);
    },
    eq : function(o) {
 return o.value == this.value && CritBit.eq(o.a, this.a) && CritBit.eq(o.b, this.b);
    }
};
CritBit.min = function(a, b) {
    return CritBit.le(a, b) ? a : b;
};
CritBit.max = function(a, b) {
    return CritBit.ge(a, b) ? a : b;
};
CritBit.RangeSet = Base.extend({
    constructor : function(tree) {
 this.tree = (tree instanceof CritBit.Tree) ? tree : new CritBit.Tree();
 if (tree instanceof CritBit.MultiRangeSet) {
     var r = tree.ranges();
     for (var i = 0; i < r.length; i++) {
  this.insert(r[i]);
     }
 }
    },
    index : function(key) {
 if (key instanceof CritBit.Range)
     return this.contains(key);
 var next = this.tree.ge(key);
 if (!next) return undefined;
 return next.value.contains(key);
    },
    insert : function(range) {
 this.merge(range);
    },
    ranges : function() {
 return this.tree.values();
    },
    merge : function(range) {
 var a = [];
 this.tree.foreach(function (s, i) {
     UTIL.log("%o touches %o == %o", i, range, i.touches(range));
     if (!i.touches(range)) return true;
     a.push(i);
 }, range.a);
 if (a.length) {
     for (var i = 0; i < a.length; i++)
  this.tree.remove(a[i].b);
     range = new CritBit.Range(CritBit.min(a[0].a, range.a),
          CritBit.max(a[a.length-1].b, range.b));
 }
 this.tree.insert(range.b, range);
    },
    overlaps : function(range) {
 var n = this.tree.ge(range.a);
 if (n) return n.value.overlaps(range);
 return false;
    },
    contains : function(range) {
 var n = this.tree.ge(range.a);
 if (n) return n.value.contains(range);
 return false;
    },
    size : function() {
 return this.tree.length();
    },
    length : function() {
 var ret = 0;
 this.tree.foreach(function (k, range) {
     ret += range.length();
 });
 return ret;
    },
    minus : function(r) {
 if (!this.tree.length() || !r.tree.length()) return this;
 var tree = new CritBit.Tree();
 var n1, n2, r1, r2;
 n1 = this.tree.root.first();
 n2 = r.tree.root.first();
 do {
     var insert = true;
     r1 = n1.value;
     while (n2 && CritBit.gt(r1.a, n2.value.b)) n2 = n2.forward();
     while (n2) {
  r2 = n2.value;
  if (r2.contains(r1)) {
      insert = false;
      break;
  } else if (r1.overlaps(r2)) {
      if (CritBit.lt(r1.a, r2.a)) {
   tree.insert(r2.a, new CritBit.Range(r1.a, r2.a));
      }
      if (CritBit.gt(r1.b, r2.b)) {
   r1 = new CritBit.Range(r2.b, r1.b);
      }
  } else {
      break;
  }
  n2 = n2.forward();
     }
     if (insert)
  tree.insert(r1.a, r1);
     n1 = n1.forward()
 } while(n1);
 return new CritBit.RangeSet(tree);
    },
    intersect : function(rangeset) {
 var tree = new CritBit.Tree();
 var start, end, current;
 var n1 = this.tree.root.first(), n2 = rangset.tree.root.first();
 do {
     r1 = n1.value;
     r2 = n2.value;
     if (r1.overlaps(r2)) {
  tree.insert(new CritBit.Range(
    CritBit.max(r1.a, r2.a),
    CritBit.min(r1.b, r2.b)));
     }
     if (CritBit.lt(r1.b, r2.b))
  n2 = n2.forward();
     else
  n1 = n1.forward();
 } while (n1 && n2);
 if (current) tree.insert(current);
 return tree;
    },
    find_first : function(length) {
 var found;
 this.tree.foreach(function(key, r) {
     if (r.length() >= length) {
  found = r;
  return 1;
     }
 });
 return found;
    },
    truncate : function(length, start) {
 var tree = new CritBit.Tree();
 var left = length;
 var loop = function(key, value) {
     var l = value.length();
     if (l < left) {
  tree.insert(value.b, value);
  left -= l;
  if (!left) return 1;
     } else {
  var r = new CritBit.Range(value.a, CritBit.add(value.a, left));
  tree.insert(r.b, r);
  left = 0;
  return 1;
     }
 };
 if (arguments.length > 1) {
     this.tree.foreach(loop, start);
 } else
     this.tree.foreach(loop);
 return new CritBit.RangeSet(tree);
    },
    copy : function() {
 var set = new CritBit.RangeSet();
 set.tree = this.tree.copy();
 return set;
    }
});
CritBit.MultiRangeSet = Base.extend({
    constructor : function(tree, max_len) {
 this.tree = tree || new CritBit.Tree();
 this.max_len = (arguments.length < 2) ? 0 : max_len;
    },
    insert : function(range) {
 var v;
 this.max_len = Math.max(this.max_len, range.length());
 if (v = this.tree.index(range.a)) {
     for (var i = 0; i < v.length; i++)
  if (v[i].eq(range)) return;
     v.push(range);
 } else {
     this.tree.insert(range.a, [ range ]);
 }
    },
    remove : function(range) {
 var v = this.tree.index(range.a);
 var n = [];
 if (!v) return false;
 for (var i = 0; i < v.length; i++) {
     if (v[i].b != range.b) {
  n.push(v[i]);
     }
 }
 if (n.length != v.length) {
     this.tree.insert(range.a, n);
     return range;
 }
 return false;
    },
    overlaps : function(range) {
 var ret = [];
 this.tree.backeach(UTIL.make_method(this, function(start, i) {
     if (CritBit.le(i[0].a, range.a)
  && CritBit.dist(range.a, i[0].a) > this.max_len) {
  return true;
     }
     for (var j = 0; j < i.length; j++)
  if (range.overlaps(i[j])) ret.push(i[j]);
 }), range.b);
 return ret;
    },
    ranges : function() {
 var ret = [];
 var a = this.tree.values();
 for (var i = 0; i < a.length; i ++)
     ret.concat(a[i]);
 return ret;
    },
    foreach : function(fun) {
 var a = this.ranges();
 for (var i = 0; i < a.length; i ++) {
     if (fun(a[i])) return;
 }
    }
});
if (window.serialization) {
serialization.Range = serialization.Tuple.extend({
    constructor : function(type, vtype) {
 var m= [
     "_range", CritBit.Range,
     type, type
 ];
 if (vtype) {
     this.has_value = true;
     m.push(vtype);
 }
 this.base.apply(this, m);
    },
    encode : function(range) {
 if (this.has_value)
     return this.base([ range.a, range.b, range.value ]);
 else
     return this.base([ range.a, range.b]);
    },
    toString : function() {
 return UTIL.sprintf("serialization.Range()");
    }
});
serialization.RangeSet = serialization.Array.extend({
    constructor : function(type) {
 this.base(type);
 this.type = "_rangeset";
    },
    decode : function(atom) {
 var a = this.base(atom);
 var t = new CritBit.RangeSet();
 for (var i = 0; i < a.length; i++)
     t.insert(a[i]);
 return t;
    },
    encode : function(t) {
 return this.base(t.ranges());
    },
    can_encode : function(t) {
 return t instanceof CritBit.RangeSet || this.base(t);
    }
});
serialization.CritBit = serialization.Mapping.extend({
    constr : CritBit.Tree
});
serialization.MultiRangeSet = serialization.RangeSet.extend({
    decode : function(atom) {
 var a = this.base(atom);
 var t = new CritBit.MultiRangeSet();
 for (var i = 0; i < a.length; i++)
     t.insert(a[i]);
 return t;
    },
    can_encode : function(t) {
 return o instanceof CritBit.MultiRangeSet || this.base(t);
    }
});
}
