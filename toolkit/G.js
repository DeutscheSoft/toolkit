"use strict";
var Scheduler = function() {
    this.Q = [];
    this.tmp = [];
    this.debug = true;
};
Scheduler.prototype = {
    run : function() {
        var Q = this.Q;
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

        if (debug) {
            t = performance.now() - t;
            console.log("DOMScheduler did %d runs and %d calls: %f ms", runs, calls, t);
        }

        return runs;
    },
    enqueue : function(o, prio) {
        var Q = this.Q;
        prio = prio|0;
        var q = Q[prio];
        if (typeof(o) !== "function" && typeof(o) !== "object") throw("Bad argument.");
        if (!q) Q[prio] = q = [];
        q.push(o);
    },
    dequeue : function(o, prio) {
        var Q = this.Q;
        prio = prio|0;
        var q = Q[prio];
        if (typeof(o) !== "function" && typeof(o) !== "object") throw("Bad argument.");
        if (!q) return;
        var i = 0;
        while ((i = q.indexOf(o, i)) !== -1) {
            q.splice(i, 1);
        }
    }
};
var DOMScheduler = function() {
    Scheduler.call(this);
    this.will_render = false;
    this.rid = 0;
    this.bound_run = this.run.bind(this);
};
DOMScheduler.prototype = {
    enqueue : function(o, prio) {
        Scheduler.prototype.enqueue.call(this, o, prio);
        if (!this.will_render) {
            this.will_render = true;
            this.rid = window.requestAnimationFrame(this.bound_run);
        }
    },
    run : function() {
        this.will_render = false;
        this.rid = 0;
        Scheduler.prototype.run.call(this);
    },
    dequeue : Scheduler.prototype.dequeue
}
