$(function () {
  var ROT_STRENGTH = 20;
  function setupLogin () {
    var $movingBg = $('.moving-bg');
    var width = $movingBg.width();
    var ax = 0;

    function alignBg () {
      $movingBg.css('margin-left', (ROT_STRENGTH * ax) + (-width / 2));
    }

    setInterval(function () {
      alignBg();
    }, 17);

    if (window.DeviceMotionEvent !== undefined) {
      window.ondevicemotion = function(e) {
        ax = e.accelerationIncludingGravity.x;
      };
    }
  }

  function teardownLogin () {
    window.ondevicemotion = null;
  }

  setupLogin();
});