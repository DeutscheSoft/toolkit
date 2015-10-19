"use strict";
(function(w) {
function Scheduler() {
    this.Q_next = this.Q = [];
    this.Q_tmp = [];
    this.tmp = [];
    this.debug = 10;
};
function low_add(Q, o, prio) {
    prio = prio|0;
    var q = Q[prio];
    if (typeof(o) !== "function" && typeof(o) !== "object") throw("Bad argument.");
    if (!q) Q[prio] = q = [];
    q.push(o);
}
function low_remove(Q, o, prio) {
    prio = prio|0;
    var q = Q[prio];
    if (typeof(o) !== "function" && typeof(o) !== "object") throw("Bad argument.");
    if (!q) return;
    var i = 0;
    while ((i = q.indexOf(o, i)) !== -1) {
        q.splice(i, 1);
    }
}
function request_frame() {
    this.will_render = true;
    this.rid = window.requestAnimationFrame(this.bound_run);
}
Scheduler.prototype = {
    run : function() {
        var Q = this.Q;
        this.Q_next = this.Q_tmp;
        var empty;
        var runs = 0;
        var debug = this.debug;
        var calls = 0;
        var t;

        if (debug) t = performance.now();

        while (!empty) {
            var i;
            runs++;

            empty = true;

            for (i = 0; i < Q.length; i++) {
                var q = Q[i], o, ret, v;

                if (!q || !q.length) continue;

                empty = false;

                Q[i] = this.tmp;
                this.tmp = q;

                for (var j = 0; j < q.length; j++) {
                    o = q[j];
                    calls++;
                    if (typeof(o) === "function") {
                        o = o();
                        if (typeof(o) === "object")
                            Q[i].push(o);
                        else continue;
                    }
                    ret = o.next();
                    if (ret.done || (v = ret.value) === false) {
                        continue;
                    }
                    if (v !== undefined) {
                        v = v|0;
                        if (v !== i) {
                            ret = Q[v];
                            if (!ret) Q[v] = ret = [];
                            ret.push(o);
                        }
                    }
                }

                q.length = 0;
            }
        }

        this.Q = this.Q_next;
        this.Q_tmp = Q;

        if (debug) {
            t = performance.now() - t;
            if (t > debug)
                console.log("DOMScheduler did %d runs and %d calls: %f ms", runs, calls, t);
        }

        return runs;
    },
    add : function(o, prio) {
        low_add(this.Q, o, prio);
    },
    add_next : function(o, prio) {
        low_add(this.Q_next, o, prio);
    },
    remove : function(o, prio) {
        low_remove(this.Q, o, prio);
    },
    remove_next : function(o, prio) {
        low_remove(this.Q_next, o, prio);
    }
};
function DOMScheduler() {
    Scheduler.call(this);
    this.will_render = false;
    this.rid = 0;
    this.running = false;
    this.bound_run = this.run.bind(this);
};
DOMScheduler.prototype = {
    add_next : function(o, prio) {
        Scheduler.prototype.add_next.call(this, o, prio);
        if (!this.will_render) request_frame.call(this);
    },
    add : function(o, prio) {
        Scheduler.prototype.add.call(this, o, prio);
        if (!this.running && !this.will_render) request_frame.call(this);
    },
    run : function() {
        this.will_render = false;
        this.rid = 0;
        this.running = true;
        Scheduler.prototype.run.call(this);
        this.running = false;
    },
}
w.Scheduler = Scheduler;
w.DOMScheduler = DOMScheduler;
})(this);
