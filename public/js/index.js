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
      vx += (rotx - vx) * 0.1;
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

  function setupHome () {
    $('.back-page').click(function (e) {
      if ($(e.target).hasClass('back-page')) {
        $('.back-page').toggleClass('map-view');
      }
    });

    var map;
    function initialize() {

      function updateCenter () {
        $.get('/api/location', function (location) {
          console.log('update: ');
          console.log(location);
          map.setCenter(google.maps.LatLng(location.lat, location.lng));
        });
      }

      // Setup first time
      $.get('/api/location', function (location) {
        console.log(location);
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
          panControl: false,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          overviewMapControl: false,
          center: new google.maps.LatLng(location.lat, location.lng),
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(mapCanvas, mapOptions);
      });

      setInterval(function () {
        updateCenter();
      }, 15000);
    }
    google.maps.event.addDomListener(window, 'load', initialize);
  }

  setupLogin();
  setupHome();

});