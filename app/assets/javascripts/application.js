
$(function(){
    var map, infoWindow;
    var imageMap = {
        "Conflito": "/assets/icon_shock_black.png",
        "Depedração": "/assets/icon_flire_black.png",
        "Encontro": "/assets/icon_flag_black.png",
        "Polícia": "/assets/icon_police_black.png",
    };
    function setupMap() {
      if (navigator.geolocation) {
          map = navigator.geolocation.getCurrentPosition(initialize);
        } else {
          alert("Geolocation not available");
        }
      }   

    function initialize(position) {
        var mapOptions = {
            center: new google.maps.LatLng(position.coords.latitude,  position.coords.longitude),
            zoom: 19,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        $('<div/>').addClass('centerMarker').appendTo(map.getDiv())
             //do something onclick
            .click(function(){
            });
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);


        google.maps.event.addDomListener(window, 'load', initialize);

        infoWindow = new google.maps.InfoWindow();
        load_markers();

        $('#loading').addClass('hide');
    }
    
    function add_marker_to_map(point){
        var marker = new google.maps.Marker({
                position: new google.maps.LatLng(point.latitude,  point.longitude),
                map: map,
                icon: imageMap[point.marker_type]}),
            infoWindow,
            content = "<b>"+ point.marker_type +"</b><br/>" + point.description;
        infoWindow = new google.maps.InfoWindow({
            content: content
        });
        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open(map,marker);
        });
    }
    
    function load_markers () {
        $.getJSON("/markers.json", function(data){
            $.each(data, function(){
                add_marker_to_map(this);
            });
        });
    }
    
    google.maps.event.addDomListener(window, 'load', setupMap);
    
    var marker_types = $("#marker-types");
    
    $("#menu-button").on('click', function(){
        marker_types.removeClass('hide');
    });
    
    marker_types.find("a").on("click", function(){
        var params = {}, element = $(this);
        params['marker_type'] = element.attr("data-name");
        marker_types.addClass('hide');
        if (params['marker_type']=="Cancel"){
            return false;
        }
        var center = map.getCenter();
        params['longitude'] = center.lng();
        params['latitude'] = center.lat();
        params['description'] = "";
        $.post("/markers.json", {marker: params}, function(data){
            add_marker_to_map(params);
            google.maps.event.removeListener(listenerHandle);
        });
        
    });
    
   window.setTimeout(load_markers, 60000);







/* This part comes from index.html.erb, MERGE NEEDED */
  // -- Declarations
  
  // -- Static calls
  $('#menu-items').hide();

  // -- Declarations
  function expandMenu() {
    $('#menu').removeClass('collapsed');
    $('#menu').addClass('expanded');

    $('#menu-handle-icon').attr('src', '/assets/btn_button_alert_main_pressed.png');

    $('#menu-items').show();
  }

  function collapseMenu() {
    $('#menu').removeClass('expanded');
    $('#menu').addClass('collapsed');

    $('#menu-handle-icon').attr('src', '/assets/btn_button_alert_main_normal.png');

    $('#menu-items').hide();
  }

  function buttonClicked(btnType) {
    console.log("button clicked"+btnType);
    var params = {}, element = $(this);
    params['marker_type'] = btnType;
    var center = map.getCenter();
    params['longitude'] = center.lng();
    params['latitude'] = center.lat();
    params['description'] = "";
    $.post("/markers.json", {marker: params}, function(data){
        add_marker_to_map(params);
    });

    collapseMenu();
  }

  function arrangeMenuItems() {
    var togglePos = $('#menu-handle-icon').offset();
    var toggleTop = togglePos.top;
    var toggleLeft = togglePos.left;
    var menuItemWidth = 76;
    var menuItemHeight = 77;

    // handle = top -4, width 68px

    $('#btn-encontro').css({
      top: toggleTop+ 'px',
      left: Math.round(toggleLeft - menuItemWidth) + 'px'
    });

    $('#btn-policia').css({
      top: Math.round(toggleTop - (menuItemHeight / 2)) + 'px', // 496
      left: Math.round(toggleLeft - (menuItemWidth / 2)) + 'px' // 117
    });

    // $('#btn-conflito').css({
    //   position: 'absolute',
    //   top: (togglePos.top - ($('#btn-conflito').height() * 2) ) + 'px',
    //   left: togglePos.left - ($('#btn-conflito').outerWidth() * 0.5) + 'px'
    // });
    // $('#btn-depedracao').css({
    //   position: 'absolute',
    //   top: (togglePos.top - $('#btn-depedracao').height()) + 'px',
    //   left: togglePos.left + $('#btn-depedracao').outerWidth() + 'px'
    // });
  }
  
  // -- Callbacks
  $('#menu-handle-icon').on({
    click: function () {
      if ($('#menu').hasClass('collapsed')) {
        expandMenu();
      } else {
        collapseMenu();
      }
    }
  });

  $('#btn-depedracao').on({
    click: function () {
      buttonClicked('Depedração');
    }
  });

  $('#btn-policia').on({
    click: function () {
      buttonClicked('Polícia');
    }
  });

  $('#btn-encontro').on({
    click: function () {
      buttonClicked('Encontro');
    }
  });

  $('#btn-conflito').on({
    click: function () {
      buttonClicked('Conflito');
    }
  });

});
