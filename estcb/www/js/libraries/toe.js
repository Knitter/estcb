/*!
 * toe.js
 * version 2.0.0
 * author: Damien Antipa
 * https://github.com/dantipa/toe.js
 */
(function(t) {
    var n = {Event: function(n) {
            var e = {timestamp: (new Date).getTime(),
                target: n.target,
                point: []
                }, a = n.changedTouches || n.originalEvent.changedTouches || n.touches || n.originalEvent.touches;
            return t.each(a, function(t, n) {
                e.point.push({
                    x: n.pageX,
                    y: n.pageY
                })
            }), e
        },
        State: function(t) {
            var n = t.point[0];
            return{
                start: t,
                move: [],
                end: null,
                pageX: n.x,
                pageY: n.y
            }
        },
        track: function(e) {
            var a, o = function(t) {
                var o = n.Event(t);
                a = n.State(o), e.touchstart(t, a, o)
            }, i = function(t) {
                var o = n.Event(t);
                a.move.push(o), e.touchmove(t, a, o)
            }, r = function(t) {
                var o = n.Event(t);
                a.end = o, e.touchend(t, a, o)
            };
            return e.setup = function(n) {
                t(this).on("touchstart", n, o).on("touchmove", n, i).on("touchend touchcancel", n, r)
            }, e.teardown = function() {
                t(this).off("touchstart", o).off("touchmove", i).off("touchend touchcancel", r)
            }, e
        },
        calc: {
            getDuration: function(t, n) {
                return n.timestamp - t.timestamp
            },
            getDistance: function(t, n) {
                return Math.sqrt(Math.pow(n.x - t.x, 2) + Math.pow(n.y - t.y, 2))
            },
            getAngle: function(t, n) {
                return 180 * Math.atan2(n.y - t.y, n.x - t.x) / Math.PI
            },
            getDirection: function(t) {
                return-60 > t && t > -120 ? "top" : t >= -30 && 30 >= t ? "right" : t >= 60 && 120 > t ? "down" : t >= 150 || -150 >= t ? "left" : "unknown"
            },
            getScale: function(t, n) {
                var e = t.point, a = n.point;
                return 2 === e.length && 2 === a.length ? (Math.sqrt(Math.pow(a[0].x - a[1].x, 2) + Math.pow(a[0].y - a[1].y, 2)) / Math.sqrt(Math.pow(e[0].x - e[1].x, 2) + Math.pow(e[0].y - e[1].y, 2))).toFixed(2) : 0
            },
            getRotation: function(t, n) {
                var e = t.point, a = n.point;
                return 2 === e.length && 2 === a.length ? (180 * Math.atan2(a[0].y - a[1].y, a[0].x - a[1].x) / Math.PI - 180 * Math.atan2(e[0].y - e[1].y, e[0].x - e[1].x) / Math.PI).toFixed(2) : 0
            }
        }
    };
    t.toe = n
})(jQuery, this), function(t, n) {
    t.event.special.swipe = function() {
        var e = {
            distance: 40,
            duration: 300,
            direction: "all",
            finger: 1
        };
        return n.track({
            touchstart: function(t, n) {
                n.finger = n.start.point.length
            },
            touchmove: function(t, n, e) {
                n.finger = e.point.length > n.finger ? e.point.length : n.finger
            },
            touchend: function(a, o, i) {
                var r, c, u = t.extend(e, a.data);
                r = n.calc.getDuration(o.start, i), c = n.calc.getDistance(o.start.point[0], i.point[0]), u.duration > r && c > u.distance && (o.angle = n.calc.getAngle(o.start.point[0], i.point[0]), o.direction = n.calc.getDirection(o.angle), o.finger !== u.finger || "all" !== u.direction && o.direction !== u.direction || t(a.target).trigger(t.Event("swipe", o)))
            }
        })
    }()
}(jQuery, jQuery.toe, this), function(t, n) {
    t.event.special.tap = function() {
        var e = {
            distance: 10,
            duration: 300,
            finger: 1
        };
        return n.track({
            touchstart: function(t, n, e) {
                n.finger = e.point.length
            },
            touchmove: function(t, n, e) {
                n.finger = e.point.length > n.finger ? e.point.length : n.finger
            },
            touchend: function(a, o, i) {
                var r, c, u = t.extend(e, a.data);
                r = n.calc.getDuration(o.start, i), c = n.calc.getDistance(o.start.point[0], i.point[0]), u.duration > r && u.distance > c && o.finger === u.finger && t(a.target).trigger(t.Event("tap", o))
            }
        })
    }()
}(jQuery, jQuery.toe, this), function(t, n) {
    t.event.special.taphold = function() {
        var e, a, o = {
            distance: 20,
            duration: 500,
            finger: 1
        };
        return n.track({
            touchstart: function(n, i, r) {
                var c = t.extend(o, n.data);
                a = !1, i.finger = r.point.length, clearTimeout(e), e = setTimeout(function() {
                    a || i.finger === c.finger && t(n.target).trigger(t.Event("taphold", i))
                }, c.duration)
            },
            touchmove: function(e, i, r) {
                var c, u = t.extend(o, e.data);
                i.finger = r.point.length > i.finger ? r.point.length : i.finger, c = n.calc.getDistance(i.start.point[0], r.point[0]), c > u.distance && (a = !0)
            },
            touchend: function() {
                a = !0, clearTimeout(e)
            }
        })
    }()
}(jQuery, jQuery.toe, this), function(t, n) {
    t.event.special.transform = function() {
        var e, a = {
            scale: .1,
            rotation: 15
        };
        return n.track({
            touchstart: function() {
                e = !1
            },
            touchmove: function(o, i, r) {
                var c = t.extend(a, o.data);
                return 2 !== r.point.length ? (i.move.pop(), undefined) : (2 !== i.start.point.length && 2 === r.point.length && (i.start = t.extend({
                }, r)), i.rotation = n.calc.getRotation(i.start, r), i.scale = n.calc.getScale(i.start, r), (Math.abs(1 - i.scale) > c.scale || Math.abs(i.rotation) > c.rotation) && (e || (t(o.target).trigger(t.Event("transformstart", i)), e = !0), t(o.target).trigger(t.Event("transform", i))), undefined)
            },
            touchend: function(a, o, i) {
                e && (e = !1, 2 !== i.point.length && (o.end = t.extend({
                }, o.move[o.move.length - 1])), o.rotation = n.calc.getRotation(o.start, o.end), o.scale = n.calc.getScale(o.start, o.end), t(a.target).trigger(t.Event("transformend", o)))
            }
        })
    }()
}(jQuery, jQuery.toe, this);