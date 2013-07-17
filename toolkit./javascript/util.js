UTIL = {};
if (window.Base) {
    UTIL.Test = Base.extend({
 __errors : 0,
 __succs : 0,
 run : function(cb) {
     var tests = [];
     for (var x in this) {
  if (!UTIL.has_prefix(x, "test_")) continue;
  tests.push(x);
     }
     tests = tests.sort();
     this.__done = function(fatal) {
  delete this.success;
  delete this.error;
  delete this.__done;
  if (cb)
      UTIL.call_later(cb, window, this.__succs, this.__errors, tests.length, fatal);
  else
      UTIL.log("%s finished, %d successful, %d error(s), %d total, %d in testsuite.",
    this.toString(), this.__succs, this.__errors, this.__succs + this.__errors, tests.length);
     }
     UTIL.call_later(this.step, this, tests, 0);
 },
 step : function(tests, num) {
     if (num >= tests.length) {
  return this.__done(false);
     }
     UTIL.silence(20);
     this.success = function() {
  this.stop_time = new Date();
  console.log("%s took: %f s", tests[num], (this.stop_time-this.start_time)/1000);
  ++this.__succs;
  UTIL.forget();
  UTIL.call_later(this.step, this, tests, num + 1);
     };
     this.error = function(err) {
  ++this.__errors;
  UTIL.scream();
  UTIL.log.apply(window, [ "error in test %o: "+err,
          tests[num] ].concat(Array.prototype.slice.call(arguments, 1)));
  UTIL.call_later(this.step, this, tests, num + 1);
     };
     this.fatal = function(err) {
  ++this.__errors;
  UTIL.scream();
  UTIL.log("fatal error in test %o: %o.", tests[num], err);
  this.__done(true);
     };
     try {
  var fun = this[tests[num]];
  this.start_time = new Date();
  fun.call(this);
     } catch(e) {
  this.fatal(e);
     }
 },
 toString : function() {
     var l = [];
     for (var x in this) {
  if (UTIL.has_prefix(x, "test_")) {
      l.push(x.substr(5));
  }
     }
     return "UTIL.Test(" + l.join(", ") + ")";
 }
    });
    UTIL.run_tests = function() {
 var l = Array.prototype.slice.apply(arguments);
 var c = 0;
 var cb = function() {
     if (c == l.length) return;
     l[c++].run(cb);
 };
 cb();
    };
}
UTIL.array_unique = function(a) {
    var ret = [];
    OUT: for (var i = 0; i < a.length; i++) {
 var j;
 for (j = i-1; j >= 0; j--) if (a[j] === a[i]) continue OUT;
 ret.push(a[i]);
    }
    return ret;
};
UTIL.array_to_set = function(a) {
    var set = {};
    for (var i = 0; i < a.length; i++) set[a[i]] = 1;
    return set;
};
UTIL.sort = function(a) {
    return a.sort(function(one, two) {
 if (one == two) return 0;
 if (UTIL.numberp(one) && UTIL.numberp(two)) return one - two;
 if (typeof(one) != typeof(two)) {
     one = typeof(one);
     two = typeof(two);
 }
 return (one > two) ? 1 : -1;
    });
};
UTIL.array_and = function(a, b) {
    var ret = [];
    if (a.length > b.length) {
 var s = a;
 a = b;
 b = s;
    }
    b = UTIL.array_to_set(b);
    for (var i = 0; i < a.length; i++)
 if (b.hasOwnProperty(a[i])) ret.push(a[i]);
    return ret;
};
UTIL.array_or = function(a, b) {
    return UTIL.array_unique(a.concat(b));
};
UTIL.create = function(myclass, args) {
 var f = function() {
     myclass.apply(this, args);
 };
 f.prototype = myclass.prototype;
 return new f();
};
UTIL.profiled = function(fun) {
    return function() {
 UTIL.profile();
 fun.apply(this, Array.prototype.slice.call(arguments));
 UTIL.profileEnd();
    };
};
UTIL.timed = function(fun) {
    var t = new Date().getTime();
    return function() {
 UTIL.log("took %f ms", new Date().getTime() - t);
 fun.apply(this, Array.prototype.slice.call(arguments));
    };
};
UTIL.once = function(fun) {
    var called = false;
    var cp = Array.prototype.slice.call(arguments);
    return function() {
 if (called) {
     if (cp.length >= 2) {
  UTIL.error("Callback called twice! (%o)", cp[1]);
     } else {
  UTIL.error("Callback called twice!");
     }
 }
 called = true;
 return fun.apply(this, Array.prototype.slice.call(arguments));
    };
};
UTIL.safe = function(fun) {
    return function() {
 try {
     return fun.apply(window, Array.prototype.slice.call(arguments));
 } catch(e) {
     UTIL.log("safe call failed: %o", e);
 };
    };
};
UTIL.cached = function(fun) {
    var c = [ ];
    return function() {
 if (!c.length) c[0] = fun.apply(this, Array.prototype.slice.call(arguments));
 return c[0];
    };
};
UTIL.call_later = function(fun) {
    if (arguments.length > 1 && arguments[1]) {
 fun = UTIL.make_method(arguments[1], fun);
    }
    if (arguments.length > 2) {
 var a = Array.prototype.slice.call(arguments, 2);
 window.setTimeout(function() {
     fun.apply(window, a);
 }, 0);
    } else window.setTimeout(fun, 0);
};
UTIL.gauge = function(fun) {
    var t = (new Date()).getTime();
    fun.call(this);
    return ((new Date()).getTime() - t)/1000;
};
UTIL.agauge = function(obj, fun, cb) {
    var t = (new Date()).getTime();
    cb = UTIL.once(cb);
    fun.call(obj, function() {
 cb.apply(obj, [((new Date()).getTime() - t) / 1000].concat(Array.prototype.slice.call(arguments)));
    });
};
UTIL.keys = function(o) {
    if (Object.keys) return Object.keys(o);
    var a = [];
    for (var i in o) if (o.hasOwnProperty(i)) {
 a.push(i);
    }
    return a;
};
UTIL.values = function(o) {
    var a = [];
    for (var i in o) if (o.hasOwnProperty(i)) {
 a.push(o[i]);
    }
    return a;
};
UTIL.intp = function(i) { return (typeof(i) == "number" && i%1 == 0); };
UTIL.floatp = function(i) { return (typeof(i) == "number" && i%1 != 0.0); };
UTIL.numberp = function(i) { return typeof(i) == "number"; };
UTIL.arrayp = function(a) { return (typeof(a) == "object" && a instanceof Array); };
UTIL.stringp = function(s) { return (typeof(s) === "string" || (s) instanceof String); };
UTIL.functionp = function(f) { return (typeof(f) == "function" || f instanceof Function); };
UTIL.objectp = function(o) { return typeof(o) == "object"; }
UTIL.copy = function(o) {
    if (UTIL.arrayp(o)) {
 o = o.concat();
 for (var i = 0; i < o.length; i ++) o[i] = UTIL.copy(o[i]);
 return o;
    }
    if (UTIL.objectp(o) && o.constructor == Object) {
 var n = {};
 for (var i in o) if (o.hasOwnProperty(i)) {
     n[i] = UTIL.copy(o[i]);
 }
 return n;
    }
    return o;
};
UTIL.replace = function(reg, s, cb) {
 var res;
 var last = 0;
 var ret = "";
 var extra;
 if (arguments.length > 3) {
  extra = Array.prototype.slice.call(arguments, 3);
 }
 while (null != (res = reg.exec(s))) {
  ret += s.substr(last, reg.lastIndex - res[0].length - last);
  ret += (extra ? cb.apply(null, [res].concat(extra)) : cb(res)) || res[0];
  if (!reg.global) {
      last = res[0].length;
      break;
  } else last = reg.lastIndex;
 }
 if (last < s.length) {
  ret += s.substr(last);
 }
 return ret;
};
UTIL.split_replace = function(reg, s, cb) {
 var res;
 var last = 0;
 var ret = [];
 var extra;
 if (arguments.length > 3) {
  extra = [];
  for (var i = 3; i < arguments.length; i++) extra[i-3] = arguments[i];
 }
 while (null != (res = reg.exec(s))) {
  ret.push(s.substr(last, reg.lastIndex - res[0].length - last));
  ret.push(extra ? cb.apply(null, [res].concat(extra)) : cb(res));
  last = reg.lastIndex;
 }
 if (last < s.length) {
  ret.push(s.substr(last));
 }
 return ret;
};
UTIL.has_prefix = function(s, n) {
 if (s.length < n.length) return false;
 return (n == s.substr(0, n.length));
};
UTIL.has_suffix = function(s, n) {
 if (s.length < n.length) return false;
 return (n == s.substr(s.length-n.length, n.length));
};
UTIL.search_array = function(a, n) {
 for (var i = 0; i < a.length; i++) {
     if (n == a[i]) return i;
 }
 return -1;
};
UTIL.replaceClass = function(o, cl1, cl2) {
 var classes = o.className.length ? o.className.split(' ') : [];
 var i = UTIL.search_array(classes, cl1);
 var j = UTIL.search_array(classes, cl2);
 if (i == -1 && j == -1) {
     if (cl2) classes.push(cl2);
 } else if (i == -1) {
     return;
 } else if (j == -1 && cl2) {
     classes[i] = cl2;
 } else {
     classes.splice(i, 1);
 }
 o.className = classes.join(" ");
};
UTIL.addClass = function(o, cl) {
 var classes = o.className.length ? o.className.split(' ') : [];
 var i = UTIL.search_array(classes, cl);
 if (i == -1) {
     classes.push(cl);
     o.className = classes.join(" ");
 }
};
UTIL.hasClass = function(o, cl) {
 var classes = o.className.split(' ');
 return (-1 != UTIL.search_array(classes, cl));
};
UTIL.removeClass = function(o, cl) {
 UTIL.replaceClass(o, cl);
};
UTIL.render_html = function(template, vars) {
 var reg = /\[[\w-\|]+\]/g;
 var cb = function(result) {
     var s = result[0].substr(1, result[0].length-2);
     if (vars.hasOwnProperty(s)) {
  return XSS.strip_html(vars[s]);
     } else return "";
 };
 return UTIL.split_replace(reg, template, cb).join("");
};
UTIL.render_into = function(node, template, vars) {
 var reg = /\[[\w-\|]+\]/g;
 var cb = function(result) {
     var s = result[0].substr(1, result[0].length-2);
     var l = s.split("|");
     var tag;
     if (l.length > 1) {
  tag = l[0];
  s = l[1];
     } else {
  tag = "span";
     }
     if (vars.hasOwnProperty(s)) {
  var node = document.createElement(tag);
  UTIL.addClass(node, s);
  node.appendChild(document.createTextNode(vars[s]));
  return node;
     } else return 0;
 };
 var a = UTIL.split_replace(reg, template, cb);
 for (var i = 0; i < a.length; i++) {
  if ((typeof(a[i]) === "string" || (a[i]) instanceof String)) node.appendChild(document.createTextNode(a[i]));
  else if (UTIL.objectp(a[i])) node.appendChild(a[i]);
 }
};
UTIL.url_escape = function(s) {
     return escape(s).replace(/\+/g, "%2B").replace(new RegExp("/", "g"), "%2F");
};
UTIL.make_url = function(url, vars) {
     var list = [];
 var key;
 if (vars) for (key in vars) if (vars.hasOwnProperty(key)) {
     var a = vars[key];
     if (UTIL.arrayp(a)) {
  for (var i = 0; i < a.length; i++) list.push(UTIL.url_escape(key) + "=" + UTIL.url_escape(a[i]));
     } else list.push(UTIL.url_escape(key) + "=" + UTIL.url_escape(a));
 } else return url;
 return url + "?" + list.join("&");
};
UTIL.make_method_keep_this = function(obj, fun) {
     if (arguments.length > 2) {
     var list = Array.prototype.slice.call(arguments, 2);
     return (function() {
      return fun.apply(obj, [ this ].concat(list).concat(Array.prototype.concat.call(arguments)));
     });
 }
 return (function() {
  return fun.apply(obj, [ this ].concat(Array.prototype.concat.call(arguments)));
 });
};
if ((function(){}).bind) {
    UTIL.make_method = function(obj, fun) {
 return fun.bind.apply(fun, [ obj ].concat(Array.prototype.slice.call(arguments, 2)));
    };
} else {
    UTIL.make_method = function(obj, fun) {
     if (arguments.length > 2) {
  var list = Array.prototype.slice.call(arguments, 2);
  return (function () {
   return fun.apply(obj, list.concat(Array.prototype.slice.call(arguments)));
  });
     }
     return (function () {
      return fun.apply(obj, Array.prototype.slice.call(arguments));
     });
    };
}
UTIL.make_external = function(a, obj, fun) {
 if (!UTIL.App.is_ie) return UTIL.make_method.apply(this, Array.prototype.slice.call(arguments, 1));
 if (arguments.length > 3) {
     var list = a.slice();
     for (var j = 3; j < arguments.length; j++) largs.push(arguments[j]);
     return (function () {
      for (var i = 0; i < arguments.length; i++) largs.push(arguments[i]);
      return fun.apply(obj, list.concat(Array.prototype.slice.call(arguments)));
     });
 }
 return (function () {
  var largs = a;
  largs = largs.splice();
  for (var i = 0; i < arguments.length; i++) largs.push(arguments[i]);
  return fun.apply(obj, largs);
 });
};
UTIL.getDateOffset = function(date1, date2) {
 return (date2||new Date)-date1;
}
UTIL.Audio = function (params) {
 if (UTIL.App.has_vorbis && !!params.ogg) {
  this.url = params.ogg;
 } else if (UTIL.App.has_mp3 && !!params.mp3) {
  this.url = params.mp3;
 } else if (UTIL.App.has_wav && !!params.wav) {
  this.url = params.wav;
 }
 if (this.url) {
     this.play = function() {
  this.audio = new Audio;
  this.audio.preload = !!params.autobuffer;
  this.audio.autoplay = !!params.autoplay;
  this.audio.loop = !!params.loop;
  this.audio.controls = !!params.controls;
  this.audio.src = this.url;
  if (this.div) {
      if (this.div.firstChild) {
   this.div.replaceChild(this.audio, this.div.firstChild);
      } else {
   this.div.appendChild(this.audio);
      }
  }
  this.audio.play();
     };
     this.stop = function() {
  this.audio.pause();
     };
     if (!!params.controls || !!params.hidden) {
  this.div = document.createElement("div");
  this.getDomNode = function () {
      return this.div;
  };
     }
 } else {
     if (!params.wav) UTIL.error("You are trying to use UTIL.Audio without html5 and a wav file. This will not work.");
     if (UTIL.App.is_opera || navigator.appVersion.indexOf("Mac") != -1) {
  this.div = document.createElement("div");
  if (params.hidden) {
      this.div.style.width = 0;
      this.div.style.height = 0;
  }
  if (navigator.appVersion.indexOf("Linux") != -1) {
      this.play = function () {
   this.div.innerHTML = "<embed src=\""+params.wav+"\" type=\"application/x-mplayer2\" autostart=true height=0 width=0 hidden=true>";
      };
  } else {
      this.play = function() {
   this.div.innerHTML = "<embed src=\""+params.wav+"\" type=\"audio/wav\" autostart=true height=0 width=0 hidden=true cache=true>";
      }
  }
  this.getDomNode = function() {
      return this.div;
  };
     } else if (UTIL.App.is_ie) {
  this.url = params.wav;
  if (!document.all.sound) {
      var bgsound = document.createElement("bgsound");
      bgsound.id = "sound";
      document.body.appendChild(bgsound);
  }
  this.play = function () {
      document.all.sound.src = this.url;
  }
  this.stop = function () {
      document.all.sound.src = null;
  }
     } else {
  this.div = document.createElement("div");
  this.div.style.width = 0;
  this.div.style.height = 0;
  this.embed = document.createElement("embed");
  this.embed.type = "audio/wav";
  this.embed.autostart = params.hasOwnProperty("autoplay") ? !!params.autoplay : false;
  this.embed.width = 0;
  this.embed.height = 0;
  this.embed.enablejavascript = true;
  this.embed.cache = params.hasOwnProperty("autobuffer") ? !!params.autobuffer : true;
  this.div.appendChild(this.embed);
  this.getDomNode = function () { return this.div; }
  if (this.embed.Play) {
      this.play = function () { this.embed.Play(); }
  } else if (this.embed.DoPlay) {
      this.play = function () { this.embed.DoPlay(); }
  } else UTIL.error("embed does not have a play method. Something is wrong.");
  this.stop = function () { this.embed.Stop(); }
     }
 }
};
UTIL.merge_objects = function() {
    var o = {};
    var i;
    var key;
    for (var i = 0; i < arguments.length; i++) for (key in arguments[i]) if (arguments[i].hasOwnProperty(key)) o[key] = arguments[i][key];
    return o;
};
UTIL.get_random_key = function (length) {
 var a = [];
 for (var i = 0; i < length; i++) {
  a.push(65 + Math.floor(Math.random() * 24));
 }
 return String.fromCharCode.apply(window, a);
};
UTIL.get_unique_key = function (length, set) {
 var id;
 while (set.hasOwnProperty((id = UTIL.get_random_key(length)))) { }
 return id;
};
UTIL.Event = Base.extend({
    constructor : function() {
 this.q = [];
    },
    bind : function(cb) {
 this.q.push(cb);
    },
    trigger : function() {
 if (!this.q.length) return;
 var a = Array.prototype.slice.call(arguments);
 for (var i = 0; i < this.q.length; i++) {
     try {
  this.q[i].apply(this, a);
     } catch(e) {
  UTIL.log("calling %o failed: %o", this.q[i], e);
     }
 }
    },
    trigger_later : function() {
 if (!this.q.length) return;
 var a = Array.prototype.slice.call(arguments);
 UTIL.call_later(function() {
       this.trigger.apply(this, a);
   }, this);
    },
    unbind : function(cb) {
 for (var i = 0; i < this.q.length; i++)
     if (this.q[i] === cb) this.q.splice(i, 1);
    }
});
UTIL.EventAggregator = Base.extend({
 constructor : function() {
  this.counter = 0;
  this.is_started = 0;
  this.result = {};
  this.q = Array.prototype.slice.call(arguments);
 },
 progress : function(cb) {
     if (!this.p) {
  this.p = new UTIL.Event();
     }
     this.p.bind(cb);
 },
 get_cb : function(name) {
  ++this.counter;
  return UTIL.make_method(this,
   function() {
       if (name) {
    if (this.result[name]) UTIL.error("You can't use this cb twice.");
    this.result[name] = Array.prototype.slice.call(arguments);
       }
       if (!--this.counter) this._ready();
       else if (this.p) {
    if (!this.step || (this.num_all % this.step) == 0)
        this.p.trigger(this.num_all - this.counter, this.num_all);
       }
   });
 },
 wrap_cb : function(name, cb) {
     if (UTIL.functionp(name)) {
  cb = name;
  name = undefined;
     }
     var f = this.get_cb();
     return function() {
  f();
  cb.apply(this, Array.prototype.slice.call(arguments));
     };
 },
 start : function() {
  if (this.is_started) return;
  this.is_started = 1;
  this.num_all = this.counter;
  if (this.num_all > 100) {
      this.step = Math.floor(this.num_all / 100);
  }
  if (!this.counter) {
      this._ready();
  } else if (this.p) this.p.trigger(0, this.num_all);
 },
 ready : function(f) {
     if (this.q) this.q.push(f);
     else f(this.result);
 },
 _ready : function() {
     if (this.is_started) {
  if (this.p) {
      this.p.trigger(this.num_all, this.num_all);
      delete this.p;
  }
  var q = this.q;
  delete this.q;
  for (var i = 0; i < q.length; i++)
   q[i](this.result);
     }
 }
});
UTIL.EventSource = Base.extend({
 constructor : function() {
  this.events = new HigherDMapping;
 },
 registerEvent : function(name, fun) {
  return this.events.set(name, fun);
 },
 unregisterEvent : function(id) {
  return this.events.remove(id);
 },
 trigger : function(name) {
  var list = this.events.get(name);
  var arg;
  if (arguments.length > 1) {
      arg = Array.prototype.slice.call(arguments, 1);
  } else {
      arg = [];
  }
  for (var i = 0; i < list.length; i++) {
      try {
   list[i].apply(this, arg);
      } catch(e) {
      }
  }
 }
});
UTIL.App = {
    getUTCOffset : function(d1) {
 if (!d1) d1 = new Date();
 return (new Date(d1.toGMTString()) - new Date(d1.toGMTString().substr(0,25)))/1000;
    }
};
UTIL.App.UTCOffset = UTIL.App.getUTCOffset();
UTIL.App.has_dst = function(d1) {
    if (!d1) d1 = new Date();
    return UTIL.App.getUTCOffset(new Date(d1.getFullYear(), 0, 1))
       !== UTIL.App.getUTCOffset(arguments.length ? d1 : new Date(d1.getFullYear(), 6, 1));
};
UTIL.App.DST = UTIL.App.has_dst(new Date());
UTIL.App.is_opera = !!window.opera;
UTIL.App.is_ie = !!document.all && !UTIL.is_opera;
UTIL.App.is_safari = /a/.__proto__=='//';
UTIL.App.is_chrome = !!window.chrome;
UTIL.App.is_firefox = false;
UTIL.App.is_ipad = !!(navigator.userAgent.match(/iPad/));
UTIL.App.is_iphone = !!(navigator.userAgent.match(/iPhone/));
try {
    UTIL.App.has_local_database = !!window.openDatabase;
} catch (e) {
    UTIL.App.has_local_database = false;
}
try {
    UTIL.App.has_local_storage = !!window.localStorage;
} catch (e) {
    UTIL.App.has_local_storage = false;
}
try {
    UTIL.App.has_indexedDB = !!(window.indexedDB);
} catch (e) {
    UTIL.App.has_indexedDB = false;
}
try {
    UTIL.App.audio = document.createElement('audio');
    UTIL.App.has_audio = !!UTIL.App.audio && !!UTIL.App.audio.canPlayType && !!UTIL.App.audio.play;
    UTIL.App.has_vorbis = UTIL.App.has_audio && UTIL.App.audio.canPlayType("audio/ogg") != "" && UTIL.App.audio.canPlayType("audio/ogg") != "no";
    UTIL.App.has_mp3 = UTIL.App.has_audio && UTIL.App.audio.canPlayType("audio/mpeg") != "" && UTIL.App.audio.canPlayType("audio/mpeg") != "no";
    UTIL.App.has_wav = UTIL.App.has_audio && UTIL.App.audio.canPlayType("audio/wav") != "" && UTIL.App.audio.canPlayType("audio/wav") != "no";
} catch (e) {
    UTIL.App.has_audio = false;
    UTIL.App.has_vorbis = false;
    UTIL.App.has_mp3 = false;
    UTIL.App.has_wav = false;
}
delete UTIL.App.audio;
if (navigator.hasOwnProperty("onLine")) {
    UTIL.App.is_online = function() { return navigator.onLine; }
} else UTIL.App.is_online = function() { return true; }
try {
    UTIL.App.video = document.createElement('video');
    UTIL.App.has_video = !!UTIL.App.video && !!UTIL.App.video.canPlayType && !!UTIL.App.video.play;
    UTIL.App.has_theora = UTIL.App.has_video && UTIL.App.video.canPlayType("video/ogg") != "" && UTIL.App.video.canPlayType("video/ogg") != "no";
} catch (e) {
    UTIL.App.has_video = false;
    UTIL.App.has_theora = false;
}
delete UTIL.App.video;
UTIL.nchars = function(c, n) {
    if (n < 0) UTIL.error("bad argument");
    var t = (typeof(c) === "string" || (c) instanceof String) ? c : String.fromCharCode(c);
    var ret = "";
    while (n) {
 if (n & 1) ret += t;
 t += t;
 n >>>= 1;
    }
    return ret;
};
UTIL.sprintf_var = function(type, v, p, filler) {
    var ret;
    switch (type) {
    case 98 :
 if (UTIL.intp(v)) {
     if (v & (1 << 31)) {
  v ^= (1 << 31);
  ret = v.toString(2);
  ret = "1" + UTIL.nchars(48, 32 - v.length - 1) + ret;
     } else {
  ret = v.toString(2);
     }
 } else if ((typeof(v) === "string" || (v) instanceof String)) {
     ret = "";
     for (var i = 0; i < v.length; i++) {
  var b = v.charCodeAt(i).toString(2);
  if (b.length < 16) b = UTIL.nchars(48, 16 - b.length) + b;
  ret += b;
     }
 }
 break;
    case 99 :
 if (UTIL.intp(v) && v >= 0 && v < 1<<16) ret = String.fromCharCode(v);
 break;
    case 100 :
 if (UTIL.intp(v)) ret = v.toString(10);
 break;
    case 101 :
 if (UTIL.numberp(v)) ret = v.toExponential();
 break;
    case 102 :
 if (UTIL.numberp(v)) ret = p ? v.toFixed(p) : v.toString();
 break;
    case 111 :
 ret = v.toString();
 break;
    case 115 :
 if ((typeof(v) === "string" || (v) instanceof String)) ret = v;
 break;
    }
    if (!filler) filler = 32;
    if (!(typeof(ret) === "string" || (ret) instanceof String))
 UTIL.error("Bad type %s for %c", typeof(v), type);
    if (p && ret.length < p) {
 ret = UTIL.nchars(filler, p - ret.length) + ret;
    }
    return ret;
};
UTIL.sprintf = function(fmt) {
    var i = 0;
    var args = Array.prototype.slice.call(arguments, 1);
    return UTIL.replace(/%(\d+)?(\*)?([bcdefgos%])/g, fmt, function(a) {
 if (a[3] == "%") return "%";
 if (i >= args.length) return;
 var c = [a[3].charCodeAt(0), args[i]];
 if (a[1]) c.push(a[1]*1, a[1].charCodeAt(0) === 48 ? 48 : 32);
 var s = UTIL.sprintf_var.apply(window, c);
 if (!a[2]) i++;
 return s;
    });
};
UTIL.describe_error = function(e) {
    if (e instanceof Error)
 return UTIL.sprintf("%s(%s) at %s:%d", e.name, e.message, e.fileName||"-", e.lineNumber||-1);
    else return UTIL.sprintf("%o", e);
};
if (window.console && window.console.log) {
    if (window.console.firebug || UTIL.App.is_chrome || UTIL.App.is_opera || UTIL.App.is_safari) {
 UTIL.log = UTIL.make_method(window.console, window.console.log);
 UTIL.trace = UTIL.make_method(window.console, window.console.trace);
 UTIL.profile = UTIL.make_method(window.console, window.console.profile);
 UTIL.profileEnd = UTIL.make_method(window.console, window.console.profileEnd);
    } else {
 UTIL.log = function(err) {
     try {
  window.console.log((typeof(err) === "string" || (err) instanceof String) ? err : (err.toString ? err.toString() : "UNKNOWN"));
     } catch (e) {}
 };
 UTIL.trace = function() {};
    }
} else
    UTIL.profile = UTIL.profileEnd = UTIL.trace = UTIL.log = function() {};
UTIL.error = function(msg) {
    var a = Array.prototype.slice.call(arguments);
    UTIL.log.apply(this, a);
    UTIL.trace();
    throw(window, UTIL.sprintf.apply(window, a));
};
UTIL.silence = function(n) {
    if (UTIL.scream) return;
    if (!arguments.length) {
 n = 20;
    } else n = Math.max(n, 0);
    var log = UTIL.log;
    var queue = [];
    UTIL.log = function() {
 queue.push(Array.prototype.slice.apply(arguments));
 if (queue.length > n) {
     queue = queue.slice(n - queue.length);
 }
    }
    UTIL.forget = function() {
 UTIL.log = log;
 delete UTIL.scream;
    }
    UTIL.scream = function() {
 log("======= replaying %d lines of debug =======", queue.length);
 for (var i = 0; i < queue.length; i++) {
     log.apply(this, queue[i]);
 }
 if (queue.length)
     log("=================== end ==================");
 UTIL.forget();
    }
}
UTIL.Hash = Base.extend(
    {
    array_digest : function() {
 if (!this.final)
     this.final = this.digest();
 var a = new Array(this.final.length*4);
 for (var i = 0; i < this.final.length; i++) {
     a[i*4] = (this.final[i] >>> 24);
     a[i*4+1] = (this.final[i] >> 16) & 0xff;
     a[i*4+2] = (this.final[i] >> 8) & 0xff;
     a[i*4+3] = (this.final[i]) & 0xff;
 }
 return a;
    },
    string_digest : function() {
 return String.fromCharCode.apply(window, this.array_digest());
    },
    hex_digest : function() {
 if (!this.final)
     this.final = this.digest();
 var hex_digits = "0123456789abcdef";
 var output = new String();
 for(var i = 0; i < this.final.length; i++) {
     for(var j = 28; j >= 0; j -= 4)
      output += hex_digits.charAt((this.final[i] >>> j) & 0x0f);
 }
 return output;
    }
});
UTIL.image_type = function(data) {
    if (UTIL.has_prefix(data, "\xff\xd8"))
 return "image/jpeg";
    if (UTIL.has_prefix(data, "\u0089\u0050\u004e\u0047\u000d\u000a\u001a\u000a"))
 return "image/png";
    if (UTIL.has_prefix(data, "GIF")) return "image/gif";
    return undefined;
};
UTIL.image_to_dataurl = function(data) {
    var type = UTIL.image_type(data);
    if (!type) UTIL.error("unknown image type.");
    return "data:"+type+";base64,"+UTIL.Base64.encode(data);
};
UTIL.curry = function(f) {
    return function() {
 var l = Array.prototype.slice.call(arguments);
 return function() {
     return f.apply(this, l.concat(Array.prototype.slice.call(arguments)));
 };
    };
};
UTIL.StringBuilder = function() {
    var ret = [], C = new Array(256), i = 0;
    this.putchar = function() {
 for (var j = 0; j < arguments.length; j++)
     C[i++] = arguments[j];
 if (i == C.length) {
     ret.push(String.fromCharCode.apply(String, C));
     i = 0;
 }
    };
    this.add = function(s) {
 if (i > 0) {
     ret.push(String.fromCharCode.apply(String, C.slice(0, i)));
     i = 0;
 }
 ret.push(s);
    };
    this.get = function() {
 if (i > 0) {
     ret.push(String.fromCharCode.apply(String, C.slice(0, i)));
     i = 0;
 }
 return ret.join("");
    };
};
UTIL.FunQueue = Base.extend({
    constructor : function(m) {
 this.q = [];
 this.rq = [];
 this.m = m;
 this.cnt = 0;
    },
    queue : function() {
 var m = this.m;
 var v;
 if (!this.cnt++) {
     for (var x in m) {
  if (!m.hasOwnProperty(x)) continue;
  v = m[x];
  this.queuefun(v[0], x, v[1]);
     }
 }
    },
    queuefun : function(obj, fun, minargs) {
 var oldfun;
 var me = this;
 if (obj["::UTIL::" + fun]) throw("fun is prequeued.");
 oldfun = obj[fun];
 obj[fun] = function() {
     if (arguments.length >= minargs) {
  me.q.push(UTIL.make_method.apply(UTIL, [this, oldfun].concat(Array.prototype.slice.call(arguments))));
     } else {
  var r;
  UTIL.log("executing " + fun + "with "+Array.prototype.slice.call(arguments).join(", "));
  r = oldfun.apply(this, Array.prototype.slice.call(arguments));
  return r;
     }
 };
 obj[fun].oldfun = oldfun;
 obj["::UTIL::" + fun] = this;
    },
    dequeuefun : function(obj, fun) {
 if (!obj["::UTIL::" + fun] || obj["::UTIL::" + fun] != this) throw("Not queued by me.");
 obj[fun] = obj[fun].oldfun;
 delete obj["::UTIL::" + fun];
    },
    dequeue : function() {
 if (!--this.cnt) {
     var v, m = this.m;
     for (var x in m) {
  if (!m.hasOwnProperty(x)) continue;
  v = m[x];
  this.dequeuefun(v[0], x);
     }
     this.flush();
 }
    },
    flush : function() {
 var q, cnt;
 if (cnt = this.cnt) {
     this.cnt = 1;
     this.dequeue();
     this.queue();
     this.cnt = cnt;
     return;
 }
 q = this.q;
 this.q = [];
 UTIL.log("FunQueue flushing %d entries.", q.length);
 for (var i = 0; i < q.length; i++)
     q[i]();
 q = this.rq;
 this.rq = [];
 for (i = 0; i < q.length; i++) {
     try {
  q[i]();
     } catch (e) {
     }
 }
    },
    ready : function(cb) {
 this.rq.push(cb);
    }
});
