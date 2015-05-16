function Square(context, x, y, size) {
  this.context = context;
  this.x = x;
  this.y = y;
  this.size = size || 40;
}

Square.prototype.draw = function () {
  this.context.beginPath();
  this.context.fillStyle = this.fillStyle || "#fff";
  this.context.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  this.context.closePath();
};

Square.prototype.getY = function () {
  return this.y;
};

Square.prototype.getX = function () {
  return this.x;
};

Square.prototype.setY = function (y) {
  this.y = y;
};

Square.prototype.setX = function (x) {
  this.x = x;
};

Square.prototype.setColour = function (colour) {
  this.fillStyle = colour;
};