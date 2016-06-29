function Triangle(context, x, y, width) {
  this.context = context;
  this.width = width || 50;
  this.x = x;
  this.y = y;
}

Triangle.prototype.draw = function () {
  this.context.beginPath();
  this.context.fillStyle = this.fillStyle || "#fff";
  this.context.moveTo(this.x + 5 - (this.width / 2), this.y + (this.width / 2) - 5);

  this.context.lineTo(this.x - 5 + (this.width / 2), this.y + (this.width / 2) - 5);
  this.context.lineTo(this.x, this.y - (this.width / 2) + 5);
  this.context.fill();
  this.context.closePath();
};

Triangle.prototype.getY = function () {
  return this.y;
};

Triangle.prototype.getX = function () {
  return this.x;
};

Triangle.prototype.setY = function (y) {
  this.y = y;
};

Triangle.prototype.setX = function (x) {
  this.x = x;
};

Triangle.prototype.setColour = function (colour) {
  this.fillStyle = colour;
};