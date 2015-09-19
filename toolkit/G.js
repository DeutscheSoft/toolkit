"use strict";
var Scheduler = function() {
    this.Q = [];
    this.tmp = [];
};
Scheduler.prototype = {
    run : function() {
        var Q = this.Q;
        var not_done = true;
        var runs = 0;

        while (not_done) {
            var i;
            runs++;

            not_done = false;

            for (i = 0; i < Q.length; i++) {
                var q = Q[i], o, ret, v;

                if (!q || !q.length) continue;

                Q[i] = this.tmp;
                this.tmp = q;

                for (var j = 0; j < q.length; j++) {
                    o = q[j];
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
                    not_done = true;
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
