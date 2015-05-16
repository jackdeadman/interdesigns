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