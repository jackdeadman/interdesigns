function Circle(context, x, y, r) {
  this.context = context;
  this.x = x;
  this.y = y;
  this.radius = r;
}

Circle.prototype.draw = function () {
  this.context.beginPath();
  this.context.fillStyle = this.fillStyle || "#fff";
  this.context.arc(this.x, this.y, this.radius || 20, 0, 2 * Math.PI);
  this.context.fill();
  this.context.closePath();
};

Circle.prototype.getRadius = function () {
  return this.radius;
};

Circle.prototype.getY = function () {
  return this.y;
};

Circle.prototype.getX = function () {
  return this.x;
};

Circle.prototype.setY = function (y) {
  this.y = y;
};

Circle.prototype.setX = function (x) {
  this.x = x;
};

Circle.prototype.setColour = function (colour) {
  this.fillStyle = colour;
};