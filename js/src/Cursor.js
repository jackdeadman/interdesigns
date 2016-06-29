function Cursor(context, x, y) {
  this.context = context;

  this.x = x;
  this.y = y;

  this.shape = {
    square: new Square(context),
    circle: new Circle(context),
    triangle: new Triangle(context)
  };

  this.currentShape = this.shape.square;
}

Cursor.prototype.draw = function () {
  this.currentShape.setX(this.x);
  this.currentShape.setY(this.y);
  this.currentShape.setColour("#fff");
  this.currentShape.draw();
};

Cursor.prototype.setX = function (x) {
  this.x = x;
};
Cursor.prototype.setY = function (y) {
  this.y = y;
};

Cursor.prototype.getX = function () {
  return this.x;
};
Cursor.prototype.getY = function () {
  return this.y;
};


Cursor.prototype.changeShape = function (value) {
  switch (value) {
  case 1:
    this.currentShape = this.shape.square;
    break;

  case 2:
    this.currentShape = this.shape.circle;
    break;

  case 3:
    this.currentShape = this.shape.triangle;
    break;
  }
};