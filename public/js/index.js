$(function () {
  var ROT_STRENGTH = 40;
  var rotateInterval;
  function setupLogin () {
    var $movingBg = $('.moving-bg');
    var width = $movingBg.width();
    var rotx = 0;
    var vx = 0;

    function alignBg () {
      // ease vx
      vx += (rotx - vx) * 0.05;
      $movingBg.css('margin-left', (ROT_STRENGTH * vx) + (-width / 2));
    }

    rotateInterval = setInterval(function () {
      alignBg();
    }, 17);

    if (window.DeviceMotionEvent !== undefined) {
      window.ondevicemotion = function(e) {
        rotx = e.accelerationIncludingGravity.x;
      };
    }
  }

  function teardownLogin () {
    window.ondevicemotion = null;
    clearInterval(rotateInterval);
  }

  setupLogin();
});