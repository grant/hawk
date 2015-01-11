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
    // Sets up map view
    $('.back-page').click(function (e) {
      if ($(e.target).hasClass('back-page')) {
        $('.back-page').toggleClass('map-view');
      }
    });

    var lastTime = $('.events.list').data('time');
    var map;
    function initialize() {

      function updateCenter () {
        $.get('/api/location', function (location) {
          console.log('update: ');
          console.log(location);
          map.setCenter(google.maps.LatLng(location.lat, location.lng));
        });
      }

      function updateAlerts () {
        $.get('/api/alerts', function (alerts) {
          alerts = alerts.filter(function (a) {
            return a.time > lastTime;
          });

          for (var i in alerts) {
            var alert = alerts[i];
            $alert = $('<li class="event"> <div class="top line"></div> <div class="bottom line"></div> <div class="icon-area"> <div class="icon"><i class="fa fa-power-off"></i></div> <div class="pic"><img src="/img/hannah.jpg" width="25px"/></div> </div> <div class="info"> <h3 class="title">title</h3> <div class="description">d</div> </div> <div class="time">time</div> </li>'); $alert.find('.title').text(alert.name);
            $alert.find('.description').text(alert.info);
            $alert.find('.time').text(alert.relative_time);
            $('.events.list').prepend($alert.hide().fadeIn().css('margin-top', '-90px').animate({
              'margin-top': '0'
            }, 500));
            $.post('/twilio', {
              msg: 'Watch your kids! ' + alert.name + '! ' + alert.info + '.'
            });
          }
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
        updateAlerts();
      }, 15000);
    }
    google.maps.event.addDomListener(window, 'load', initialize);
  }

  setupLogin();
  setupHome();

});