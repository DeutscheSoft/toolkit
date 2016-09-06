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
(function(w) {
function Scheduler() {
    this.Q_next = this.Q = [];
    this.Q_tmp = [];
    this.tmp = [];
    this.debug = 0;
    this.after_frame_cbs = [];
    this.frame_count = 0;
    this.current_priotity = -1;
    this.current_cycle = 0;
};
function low_add(Q, o, prio) {
    prio = prio|0;
    var q = Q[prio];
    if (typeof(o) !== "function" && (typeof(o) !== "object" || !o.next)) throw("Bad argument.");
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
        return;
    }
}
function low_has(Q, o, prio) {
    prio = prio|0;
    var q = Q[prio];
    if (typeof(o) !== "function" && typeof(o) !== "object") throw("Bad argument.");
    if (!q) return false;
    return -1 !== q.indexOf(o);
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
        var i;

        if (debug) t = performance.now();

        while (!empty) {
            runs++;

            this.current_cycle = runs;

            if (runs > 20) throw("something is not right");

            empty = true;

            for (i = 0; i < Q.length; i++) {
                var q = Q[i], o, ret, v;

                if (!q || !q.length) continue;

                empty = false;
                this.current_priority = i;

                Q[i] = this.tmp;
                this.tmp = q;

                for (var j = 0; j < q.length; j++) {
                    o = q[j];
                    calls++;
                    if (typeof(o) === "function") {
                        try {
                            o = o();
                        } catch (e) {
                            TK.warn("rendering method", o, "threw an error", e);
                        }
                        if (typeof(o) === "object") {
                            if (typeof(o.next) !== "function") {
                                TK.warn("rendering method", q[j], "did not return generator");
                                continue;
                            }
                            Q[i].push(o);
                        } else continue;
                    }
                    try {
                        ret = o.next();
                    } catch (e) {
                        TK.warn("rendering generator", o, "threw an error",  e);
                        continue;
                    }
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
            var after_frame_cbs = this.after_frame_cbs;

            if (after_frame_cbs.length) {
                this.after_frame_cbs = [];
                empty = false;

                for (i = 0; i < after_frame_cbs.length; i++)
                    after_frame_cbs[i]();
            }
        }

        this.Q = this.Q_next;
        this.Q_tmp = Q;

        if (debug) {
            t = performance.now() - t;
            if (t > debug)
                TK.log("DOMScheduler did %d runs and %d calls: %f ms", runs, calls, t);
        }

        this.running = false;
        this.current_priority = -1;

        this.frame_count++;

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
    },
    has: function(o, prio) {
        return low_has(this.Q, o, prio);
    },
    has_next: function(o, prio) {
        return low_has(this.Q_next, o, prio);
    },
    after_frame: function(fun) {
        this.after_frame_cbs.push(fun);
        if (!this.will_render) request_frame.call(this);
    },
    get_frame_count: function() {
        return this.frame_count;
    },
    get_current_priority: function() {
        return this.current_priority;
    },
    get_current_cycle: function() {
        return this.current_cycle;
    },
    describe_now: function() {
        if (this.running) {
            return TK.sprintf("<frame: %d, prio: %d, cycle: %d>",
                              this.get_frame_count(),
                              this.get_current_priority(),
                              this.get_current_cycle());
        } else {
            return "<not scheduled>";
        }
    },
};
function DOMScheduler() {
    Scheduler.call(this);
    this.will_render = false;
    this.rid = 0;
    this.running = false;
    this.bound_run = this.run.bind(this);
};
DOMScheduler.prototype = Object.create(Scheduler.prototype);
DOMScheduler.prototype.add_next = function(o, prio) {
    Scheduler.prototype.add_next.call(this, o, prio);
    if (!this.will_render) request_frame.call(this);
};
DOMScheduler.prototype.add = function(o, prio) {
    Scheduler.prototype.add.call(this, o, prio);
    if (!this.running && !this.will_render) request_frame.call(this);
};
DOMScheduler.prototype.run = function() {
    this.will_render = false;
    this.rid = 0;
    this.running = true;
    Scheduler.prototype.run.call(this);
    this.running = false;
};
DOMScheduler.prototype.after_frame = function(fun) {
    Scheduler.prototype.after_frame.call(this, fun);
    if (!this.running && !this.will_render) request_frame.call(this);
};
w.Scheduler = Scheduler;
w.DOMScheduler = DOMScheduler;
})(this);
