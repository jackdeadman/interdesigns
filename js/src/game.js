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