$(function () {
  var ROT_STRENGTH = 40;
  function setupLogin () {
    var $movingBg = $('.moving-bg');
    var width = $movingBg.width();
    var rotx = 0;
    var vx = 0;

    function alignBg () {
      // ease vx
      vx = (vx + rotx) / 2;
      $movingBg.css('margin-left', (ROT_STRENGTH * vx) + (-width / 2));
    }

    setInterval(function () {
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
  }

  setupLogin();
});