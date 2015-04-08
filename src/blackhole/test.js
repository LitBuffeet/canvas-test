// Generated by CoffeeScript 1.9.1
(function() {
  var Particle, RAF, animate, blackholes, bufferCanvas, bufferCtx, canvas, ctx, execAnimate, particles;

  canvas = document.getElementById('cas');

  ctx = canvas.getContext("2d");

  bufferCanvas = document.createElement("canvas");

  bufferCanvas.width = bufferCanvas.height = canvas.width;

  bufferCtx = bufferCanvas.getContext("2d");

  RAF = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  })();

  Particle = (function() {
    function Particle(options) {
      this.x = options.x, this.y = options.y, this.r = options.r;
      this._init();
    }

    Particle.prototype._init = function() {
      this.vx = Math.random() * 4 - 2;
      this.vy = Math.random() * 4 - 2;
      this.ax = 0;
      return this.ay = 0;
    };

    Particle.prototype.move = function() {
      var maxSpeed;
      this.vx += this.ax;
      this.vy += this.ay;
      maxSpeed = 10;
      this.vx = Math.abs(this.vx) > maxSpeed ? maxSpeed * Math.abs(this.vx) / this.vx : this.vx;
      this.vy = Math.abs(this.vy) > maxSpeed ? maxSpeed * Math.abs(this.vy) / this.vy : this.vy;
      this.oldx = this.x;
      this.oldy = this.y;
      this.x += this.vx;
      this.y += this.vy;
      if (this.x <= 0 || this.x >= canvas.width + this.r * 2) {
        this.vx = -this.vx;
      }
      if (this.y <= 0 || this.y >= canvas.height + this.r * 2) {
        return this.vy = -this.vy;
      }
    };

    Particle.prototype.attract = function() {
      var angle, bh, cx, cy, dis, j, lax, lay, len, power, results;
      this.ax = this.ay = 0;
      results = [];
      for (j = 0, len = blackholes.length; j < len; j++) {
        bh = blackholes[j];
        cx = bh.x - this.x;
        cy = bh.y - this.y;
        angle = Math.atan(cx / cy);
        dis = Math.sqrt(cx * cx + cy * cy);
        dis = dis < 200 ? 200 : dis;
        power = bh.power * dis / 5000;
        lax = Math.abs(power * Math.sin(angle));
        lay = Math.abs(power * Math.cos(angle));
        this.ax += cx > 0 ? lax : -lax;
        results.push(this.ay += cy > 0 ? lay : -lay);
      }
      return results;
    };

    Particle.prototype.draw = function() {
      bufferCtx.save();
      bufferCtx.strokeStyle = "#FFF";
      bufferCtx.lineCap = bufferCtx.lineJoin = "round";
      bufferCtx.lineWidth = this.r;
      bufferCtx.beginPath();
      bufferCtx.moveTo(this.oldx - this.r, this.oldy - this.r);
      bufferCtx.lineTo(this.x - this.r, this.y - this.r);
      bufferCtx.stroke();
      return bufferCtx.restore();
    };

    return Particle;

  })();

  particles = [];

  blackholes = [];

  execAnimate = function() {
    var i, j;
    for (i = j = 1; j < 100; i = ++j) {
      particles.push(new Particle({
        x: canvas.width * Math.random(),
        y: canvas.height * Math.random(),
        r: 2
      }));
    }
    return animate();
  };

  animate = function() {
    var bh, j, k, len, len1, p;
    bufferCtx.save();
    bufferCtx.globalCompositeOperation = 'destination-out';
    bufferCtx.globalAlpha = 0.3;
    bufferCtx.fillRect(0, 0, canvas.width, canvas.height);
    bufferCtx.restore();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (j = 0, len = blackholes.length; j < len; j++) {
      bh = blackholes[j];
      ctx.beginPath();
      ctx.fillStyle = "#000";
      ctx.arc(bh.x - 5, bh.y - 5, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    for (k = 0, len1 = particles.length; k < len1; k++) {
      p = particles[k];
      p.attract();
      p.move();
      p.draw();
    }
    ctx.drawImage(bufferCanvas, 0, 0);
    return RAF(animate);
  };

  execAnimate();

  canvas.onclick = function(e) {
    var x, y;
    x = e.clientX - this.offsetLeft;
    y = e.clientY - this.offsetTop;
    return blackholes.push({
      x: x,
      y: y,
      power: 1
    });
  };

}).call(this);

//# sourceMappingURL=test.js.map
