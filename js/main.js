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

/*Module for using the canvas game*/
var game = (function () {
  "use strict";

  var canvas;
  var context;

  var HEIGHT = 500;
  var WIDTH = 800;
  var TIME_PER_LEVEL = 5000;
  var SHAPE_SIZE = 60;
  var SHAPE_COLOUR = "#F08811";

  var cursor;
  var score;
  var objects;
  var points;
  var numberOfObjectToSpawn;
  var level;

  var time;

  // frame ticker
  var id;

  //flags
  var inGame;
  var firstGo;
  // checks if the player cursor has come between 30 pixels of a shape
  var checkShapeCollision = function () {
    for (var i = 0; i < objects.length; i++) {
      var object = objects[i];
      var collisionSlack = 30;

      if (cursor.getX() <= object.getX() + collisionSlack && cursor.getX() >= object.getX() - collisionSlack) {
        if (cursor.getY() <= object.getY() + collisionSlack && cursor.getY() >= object.getY() - collisionSlack) {
          if (cursor.currentShape.constructor == object.constructor) {
            objects.splice(i, 1);

            if (objects.length === 0) {
              // Stop the timer immediately so player 
              // doesnt lose a level unfairly while 
              // level finishes processing.
              time.stop();
            }

            var scoreInTurn = 100-Math.floor(time.getPercentage());
            score += scoreInTurn;

            var scorePoint = new ScoreText(context, scoreInTurn, cursor.getX(), cursor.getY());
            points.push(scorePoint);
          }
        }
      }
    }
  };
  /*clears the screen of all the score text nodes that have expired*/
  var removeExpiredPoints = function() {
    for (var i = 0; i < points.length; i++) {
      if (!points[i].visible) {
        points.splice(i, 1);
      }
    }
  };

  // handles all the objects that need to be updated during a frame
  var updateFrame = function() {
    checkShapeCollision();
    removeExpiredPoints();
  };
  /*draws all the shapes stored in the array to the screen*/
  var drawShapes = function() {
    for (var i = 0; i < objects.length; i++) {
      var circle = objects[i];
      circle.draw();
    }
  };
  /*drars all the point nodes to the screen that are stored in the array*/
  var drawPoints = function () {
    for (var i = 0; i < points.length; i++) {
      if (points[i].visible) {
        points[i].display();
      }
    }
  };
  // Handles all drawing for a single frame
  var drawFrame = function() {
    drawShapes();
    cursor.draw();
    drawMenu();
    drawPoints();

    if (firstGo) {
      context.beginPath();
      context.font = '15pt Calibri';
      context.textAlign = 'center';
      context.fillStyle = '#222';
      context.fillText("Use the number keys to change shape", canvas.width/2, 400);
      context.closePath();
    }
  };

  // checks if coords have already been taken
  var fitScreen = function(x, y, closeness) {
    for (var i = 0; i < objects.length; i++) {
        var object = objects[i];
        if (x <= object.getX() + closeness && 
            x >= object.getX() - closeness && 
            y <= object.getY() + closeness && 
            y >= object.getY() - closeness) {
          return false;
        }
    }
    return true;
  };
  /*generates the random objects for a round*/
  var generateObjects = function() {

    var choice = Math.floor(Math.random() * 3) + 1, y, x;
    var closeness = 100;

    var tries = 0;
    do {
      x = 100+(Math.random()*(WIDTH-200));
      y = 100+(Math.random()*(HEIGHT-200));
      tries++;
    } while(!fitScreen(x,y,closeness) && tries < 50);

    switch (choice) {
      case 1:
        var circle = new Circle(context, x, y, 30);
        circle.setColour(SHAPE_COLOUR);
        objects.push(circle);
        break;

      case 2:
        var square = new Square(context, x, y, 60);
        square.setColour(SHAPE_COLOUR);
        objects.push(square);
        break;
      case 3:
        var triangle = new Triangle(context, x, y, 80);
        triangle.setColour(SHAPE_COLOUR);
        objects.push(triangle);
        break;
    }
  };

  var clearScreen = function() {
    context.beginPath();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.closePath();
  };

  var drawBackground = function() {
    clearScreen();
    context.beginPath();
    context.fillStyle = "#2980b9";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.stroke();
    context.closePath();
  };
  /*ends the end and draws the ending message*/
  var endScreen = function() {
    inGame = false;
    clearInterval(id);

    drawBackground();

    context.beginPath();

    var x = WIDTH / 2;
    var y = HEIGHT / 2;

    context.beginPath();
    context.font = '52pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = '#fff';
    context.fillText('Score: '+score, x, y);
    context.font = '16pt Calibri';
    context.fillText('Click to play again', x, y+40);
    context.closePath();
  };
  /* draws the menu at the top of the game screen */
  var drawMenu = function() {

    // draw top bar
    context.beginPath();
    context.fillStyle = "#666";
    context.fillRect(0, 0, canvas.width, 50);
    context.stroke();
    context.closePath();

    var square = new Square(context, 50, 25, 40);
    
    if (cursor.currentShape instanceof Square) {
      square.fillStyle = "#ccc";
    }
    square.draw();

    context.beginPath();
    context.font = '15pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = '#000';
    context.fillText("1", 50, 32);
    context.closePath();


    var circle = new Circle(context, 100, 25);

    if (cursor.currentShape instanceof Circle) {
      circle.setColour("#ccc");
    }

    circle.draw();

    context.beginPath();
    context.font = '15pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = '#000';
    context.fillText("2", 100, 32);
    context.closePath();

    var triangle = new Triangle(context, 150, 25);

    if (cursor.currentShape instanceof Triangle) {
      triangle.setColour("#ccc");
    }

    triangle.draw();

    context.beginPath();
    context.font = '15pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = '#000';
    context.fillText("3", 150, 32);

    context.fillStyle = '#fff';
    context.fillText(score, canvas.width - 100, 35);
    context.closePath();

  };
  /* starts the next level of the game and increments the amount of objects to spawn */
  var nextLevel = function () {
    time.stop();

    if (firstGo) {
      firstGo = false;
    }
    level++;

    numberOfObjectToSpawn += 0.5;

    for (var i = 0; i < numberOfObjectToSpawn; i++) {
      generateObjects();  
    }

    time.start();
  };

  var loadStarterShape = function () {
    // Start will circle as it is different from default shape, therefore teaches player
    // how to change shape under no pressure
    var x = canvas.width / 2;
    var y = 250;
    var starterShape = new Circle(context, x, y, SHAPE_SIZE / 2);
    starterShape.setColour(SHAPE_COLOUR);
    objects.push(starterShape);
  };

  // resets all the variables needed to start a game from fresh
  var resetVariables = function () {
    cursor = new Cursor(context);
    score = 0;
    level = 1;
    objects = [];
    points = [];
    numberOfObjectToSpawn = 1;
    inGame = true;
    firstGo = true;

    time = new Timer(context, function () { 
      endScreen();
    }, TIME_PER_LEVEL);
  };

  // Main method for controlling the flow of the game
  var loadGame = function() {
    resetVariables();
    loadStarterShape();

    id = setInterval(function(){
      
      // Next level begins when all shapes are destroyed
      if (objects.length === 0) {
        nextLevel();
      }

      drawBackground();
      time.draw();
      drawFrame();
      updateFrame();
    }, 40);
  };

  // Events
  var mousemove = function(e) {
    cursor.setX(e.pageX - canvas.offsetLeft);
    cursor.setY(e.pageY - canvas.offsetTop);
  };

  var click = function() {
    if (!inGame) {
      loadGame();
      inGame = true;
    }
  };

  var keydown = function(e) {

    switch (e.keyCode) {
      case 49: // 1
      case 56: // 8
        cursor.changeShape(1);
        break;
      case 50: // 2
      case 57: // 9
        cursor.changeShape(2);
        break;
      case 51: // 3
      case 48: // 0
        cursor.changeShape(3);
        break;
    }
  };
  /* binds the dom event to the game events */
  var bindEvents = function() {
    canvas.addEventListener('click', click);
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('touchstart', mousemove);
    window.addEventListener('keydown', keydown);
  };
  /* initialises the game with document */
  var init = function (canvasRef) {
    canvas = canvasRef;
    canvas.height = HEIGHT;
    canvas.width = WIDTH;
    context = canvasRef.getContext('2d');
    bindEvents();
    loadGame();
  };

  // public methods
  return {
    init: init
  };

})();

/*Main part of the script waits for the dom to be loaded before any of the script is executed*/
document.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('demo');

  if (canvas) {
    game.init(canvas);
  }

  var form = document.getElementById('contact-form');

  if (form) {
    var charsLeft = document.getElementById('chars-left');
    var textarea = form.getElementsByTagName('textarea')[0];
    var charsLeftAmount;

    // Shows below the input form the amount of characters they have left
    // before it reaches the maximum amount allowed
    var setCharsLeft = function () {
      var length = textarea.value.length;
      var max = textarea.getAttribute('data-max');

      charsLeftAmount = max - length;
      charsLeft.innerHTML = charsLeftAmount;

      if (charsLeftAmount < 0) {
          charsLeft.className = "text-error";
      }
      else if (charsLeftAmount < 0.2 * max) {
        charsLeft.className = "text-warning";
      }
      else {
        charsLeft.className = "text-success";
      }
    };
    setCharsLeft();
    textarea.addEventListener('input', setCharsLeft);

    form.addEventListener('submit', function (e) {
      if (charsLeftAmount < 0) {
        e.preventDefault();
      }
    });
  }

});