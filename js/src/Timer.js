function Timer(context, callback, time) {
  this.context = context;
  this.time = time;
  this.callback = callback;
  this.stopped = true;
}

Timer.prototype.getPercentage = function () {
  if (this.timeStarted) {
    return (Date.now() - this.timeStarted) / this.time * 100;
  }
  return 0;
};

Timer.prototype.setTimer = function (time) {
  this.time = time;
};

Timer.prototype.start = function () {
  this.stopped = false;
  this.y = 0; // Start at top of the screen
  this.timeStarted = Date.now();

  var that = this;

  this.id = setTimeout(function () {
    that.stopped = true;
    that.callback();
  }, this.time);
};

Timer.prototype.stop = function () {
  this.stopped = true;
  clearTimeout(this.id);
};

Timer.prototype.reset = function () {
  this.stop();
  this.start();
};

Timer.prototype.draw = function () {
  if (!this.stopped) {
    this.y = 60 + (Date.now() - this.timeStarted) / this.time * 450;
  }

  this.context.beginPath();
  this.context.fillStyle = "#6AC0F7";
  this.context.fillRect(0, this.y, 10000, 10000);
  this.context.stroke();
  this.context.closePath();
};
