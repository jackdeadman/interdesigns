function ScoreText(context, amount, x, y) {
  this.context = context;
  this.text = "+" + amount;
  this.visible = true;
  this.triggered = false;
  this.x = x;
  this.y = y;
}

ScoreText.prototype.display = function () {
  this.context.beginPath();
  this.context.font = '15pt Calibri';
  this.context.textAlign = 'center';
  this.context.fillStyle = '#000';
  this.context.fillText(this.text, this.x, this.y);
  this.context.closePath();

  // Hide the image once it has been shown for one second
  if (!this.triggered) {
    this.triggered = true;
    var that = this;
    setTimeout(function () { that.visible = false; }, 1000);
  }
};

ScoreText.prototype.setVisible = function (visible) {
  this.visible = visible;
};

ScoreText.prototype.isVisible = function () {
  return this.visible;
};