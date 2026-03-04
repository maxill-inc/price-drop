"use strict";

var Confetti = function () {
var t = function () {
    return function () {
        this.gravity = 10, this.particle_count = 75, this.particle_size = 1, this.explosion_power = 25, this.destroy_target = !0, this.fade = !1;
    };
    }(),
    e = function () {
    function e(n) {
        var r = this;
        if (this.bursts = [], this.setCount = function (t) {
        if ("number" != typeof t) throw new Error("Input must be of type 'number'");
        e.CONFIG.particle_count = t;
        }, this.setPower = function (t) {
        if ("number" != typeof t) throw new Error("Input must be of type 'number'");
        e.CONFIG.explosion_power = t;
        }, this.setSize = function (t) {
        if ("number" != typeof t) throw new Error("Input must be of type 'number'");
        e.CONFIG.particle_size = t;
        }, this.setFade = function (t) {
        if ("boolean" != typeof t) throw new Error("Input must be of type 'boolean'");
        e.CONFIG.fade = t;
        }, this.destroyTarget = function (t) {
        if ("boolean" != typeof t) throw new Error("Input must be of type 'boolean'");
        e.CONFIG.destroy_target = t;
        }, this.setupCanvasContext = function () {
        if (!e.CTX) {
            var t = document.createElement("canvas");
            e.CTX = t.getContext("2d"), t.width = 2 * window.innerWidth, t.height = 2 * window.innerHeight, t.style.position = "fixed", t.style.top = "0", t.style.left = "0", t.style.width = "calc(100%)", t.style.height = "calc(100%)", t.style.margin = "0", t.style.padding = "0", t.style.zIndex = "10000", t.style.pointerEvents = "none", document.body.appendChild(t), window.addEventListener("resize", function () {
            t.width = 2 * window.innerWidth, t.height = 2 * window.innerHeight;
            });
        }
        }, this.setupElement = function (t) {
        var n;
        r.element = document.getElementById(t), null === (n = r.element) || void 0 === n || n.addEventListener("click", function (t) {
            //var n = new o(2 * t.clientX, 2 * t.clientY);
            // KS - Find center point of screen
            var confettiX = 2*(window.innerWidth / 2);
            var confettiY = 2*(window.innerHeight / 2);
            var n = {x: confettiX, y: confettiY};
            // ////////////////////////////////////////////                     
            r.bursts.push(new i(n)), e.CONFIG.destroy_target && (r.element.style.visibility = "hidden");
        });
        }, this.update = function (t) {
        r.delta_time = (t - r.time) / 1e3, r.time = t;
        for (var e = r.bursts.length - 1; e >= 0; e--) r.bursts[e].update(r.delta_time), 0 == r.bursts[e].particles.length && r.bursts.splice(e, 1);
        r.draw(), window.requestAnimationFrame(r.update);
        }, !n) throw new Error("Missing id");
        e.CONFIG || (e.CONFIG = new t()), this.time = new Date().getTime(), this.delta_time = 0, this.setupCanvasContext(), this.setupElement(n), window.requestAnimationFrame(this.update);
    }
    return e.prototype.draw = function () {
        s.clearScreen();
        for (var t = 0, e = this.bursts; t < e.length; t++) {
        e[t].draw();
        }
    }, e;
    }(),
    i = function () {
    function t(t) {
        this.particles = [];
        for (var i = 0; i < e.CONFIG.particle_count; i++) this.particles.push(new n(t));
    }
    return t.prototype.update = function (t) {
        for (var e = this.particles.length - 1; e >= 0; e--) this.particles[e].update(t), this.particles[e].checkBounds() && this.particles.splice(e, 1);
    }, t.prototype.draw = function () {
        for (var t = this.particles.length - 1; t >= 0; t--) this.particles[t].draw();
    }, t;
    }(),
    n = function () {
    function t(t) {

        this.size = new o((16 * Math.random() + 4) * e.CONFIG.particle_size, (4 * Math.random() + 4) * e.CONFIG.particle_size), this.position = new o(t.x - this.size.x / 2, t.y - this.size.y / 2), this.velocity = r.generateVelocity(), this.rotation = 360 * Math.random(), this.rotation_speed = 10 * (Math.random() - .5), 
        this.opacity = 100, this.lifetime = Math.random() + .25,
        // KS - Set custom colur array to randomly choose from
        this.hslValsArray = ["127.16deg, 40.61%, 32.35%,", "125.66deg, 63.86%, 16.27%,", "48.83deg, 82.46%, 55.29%,", "114.55deg, 100%, 97.84%,"];
        this.hslVal = this.hslValsArray[Math.floor(Math.random() * 4)];
    }
    return t.prototype.update = function (t) {
        this.velocity.y += e.CONFIG.gravity * (this.size.y / (10 * e.CONFIG.particle_size)) * t, this.velocity.x += 25 * (Math.random() - .5) * t, this.velocity.y *= .98, this.velocity.x *= .98, this.position.x += this.velocity.x, this.position.y += this.velocity.y, this.rotation += this.rotation_speed, e.CONFIG.fade && (this.opacity -= this.lifetime);
    }, t.prototype.checkBounds = function () {
        return this.position.y - 2 * this.size.x > 2 * window.innerHeight;
    }, t.prototype.draw = function () {
        s.drawRectangle(this.position, this.size, this.rotation, this.opacity, this.hslVal);
    }, t;
    }(),
    o = function () {
    return function (t, e) {
        this.x = t || 0, this.y = e || 0;
    };
    }(),
    r = function () {
    function t() {}
    return t.generateVelocity = function () {
        var t = Math.random() - .5,
        i = Math.random() - .7,
        n = Math.sqrt(t * t + i * i);
        return i /= n, new o((t /= n) * (Math.random() * e.CONFIG.explosion_power), i * (Math.random() * e.CONFIG.explosion_power));
    }, t;
    }(),
    s = function () {
    function t() {}
    return t.clearScreen = function () {
        e.CTX && e.CTX.clearRect(0, 0, 2 * window.innerWidth, 2 * window.innerHeight);
    }, t.drawRectangle = function (t, i, n, r, hslVal) {
        e.CTX && (e.CTX.save(), e.CTX.beginPath(), e.CTX.translate(t.x + i.x / 2, t.y + i.y / 2), e.CTX.rotate(n * Math.PI / 180), 
        /* KS - Draw shamrock */
        e.CTX.beginPath(),
        e.CTX.lineWidth = 0.070004,
        e.CTX.moveTo(22.759060, 27.339737),
        e.CTX.bezierCurveTo(23.007770, 34.091907, 22.319850, 40.436617, 19.838060, 46.656967),
        e.CTX.bezierCurveTo(19.737520, 46.839527, 19.541730, 46.992987, 19.361810, 46.926837),
        e.CTX.lineTo(16.004250, 45.715047),
        e.CTX.bezierCurveTo(19.478230, 39.925967, 20.893750, 33.081197, 21.182150, 26.530117),
        e.CTX.bezierCurveTo(20.152920, 29.996157, 18.972880, 33.687087, 16.501670, 36.253547),
        e.CTX.bezierCurveTo(15.520070, 37.174297, 14.424690, 37.962757, 13.080610, 38.256447),
        e.CTX.bezierCurveTo(12.114880, 38.468117, 11.098878, 38.499867, 10.111982, 38.293447),
        e.CTX.bezierCurveTo(7.773065, 37.806617, 5.918336, 35.980987, 5.312440, 33.684407),
        e.CTX.bezierCurveTo(4.955253, 32.332387, 5.119294, 31.014757, 5.513524, 29.707717),
        e.CTX.bezierCurveTo(5.764878, 28.879577, 4.777982, 29.019797, 3.402149, 27.887387),
        e.CTX.bezierCurveTo(1.216690, 26.085577, 0.748378, 22.762407, 1.999857, 20.203887),
        e.CTX.bezierCurveTo(3.108461, 17.941697, 5.778107, 16.309217, 8.296940, 16.176927),
        e.CTX.bezierCurveTo(11.635982, 16.002297, 13.718250, 18.801597, 16.655130, 20.262097),
        e.CTX.bezierCurveTo(17.078460, 20.473757, 17.459460, 20.651027, 17.901310, 20.823007),
        e.CTX.bezierCurveTo(14.948570, 18.452347, 12.720770, 14.928097, 11.120044, 11.401197),
        e.CTX.bezierCurveTo(10.635857, 10.337577, 10.429482, 9.326867, 10.426836, 8.162697),
        e.CTX.bezierCurveTo(10.416256, 4.686077, 13.115000, 1.828577, 16.602210, 1.701577),
        e.CTX.bezierCurveTo(18.136790, 1.645977, 19.544380, 2.090507, 20.716480, 3.069467),
        e.CTX.lineTo(21.867420, 4.029907),
        e.CTX.lineTo(23.034230, 3.085347),
        e.CTX.bezierCurveTo(23.777710, 2.484737, 24.666710, 1.963507, 25.643020, 1.817987),
        e.CTX.bezierCurveTo(26.447350, 1.698927, 27.315190, 1.656597, 28.132750, 1.812987),
        e.CTX.bezierCurveTo(30.471670, 2.252197, 32.403130, 3.987857, 33.051350, 6.276507),
        e.CTX.bezierCurveTo(34.641500, 11.896257, 28.947670, 16.772527, 25.116500, 20.024257),
        e.CTX.bezierCurveTo(25.994920, 19.682947, 26.743690, 19.262257, 27.582420, 18.873317),
        e.CTX.bezierCurveTo(30.349960, 17.587447, 33.532900, 16.494717, 36.604710, 16.804277),
        e.CTX.bezierCurveTo(39.075920, 17.052987, 41.102630, 18.553177, 42.076290, 20.820657),
        e.CTX.bezierCurveTo(43.261630, 23.580257, 42.396440, 26.789657, 39.785000, 28.295137),
        e.CTX.lineTo(38.115480, 29.258217),
        e.CTX.lineTo(38.462080, 30.716067),
        e.CTX.bezierCurveTo(39.171170, 33.689987, 37.663040, 36.708887, 34.845230, 37.902157),
        e.CTX.bezierCurveTo(34.429830, 38.076777, 33.998560, 38.280507, 33.543480, 38.322837),
        e.CTX.bezierCurveTo(32.649190, 38.410137, 31.731080, 38.489527, 30.852670, 38.306937),
        e.CTX.bezierCurveTo(27.812600, 37.679887, 25.711810, 34.795927, 24.526480, 32.113047),
        e.CTX.bezierCurveTo(23.801520, 30.570527, 23.394060, 29.014777, 22.756420, 27.334677),
        e.CTX.closePath(),
        e.CTX.fillStyle = "hsla("+ hslVal + r + "%)", e.CTX.fill(), e.CTX.restore());
    }
        , t;
    }();
return e;

}();

        // Confetti call and attributes
        let confetti = new Confetti('s2w-prize-popup-confetti');
        confetti.setCount(500);
        confetti.setSize(0.5);
        confetti.setPower(30);
        confetti.setFade(false);
        confetti.destroyTarget(false);

        