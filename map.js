var map;
var markers = [];
var circles = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), { 
        zoom: 4, 
        center: {lat: 38, lng: -97},
        region: 'US'
    });
    
    map.addListener('click', function(e) {
        addMarker(e.latLng);
    });
}

function addMarker(position) {
  var marker = new google.maps.Marker({
    position: position,
    map: map
  });
  
  
  var markerCircle = new google.maps.Circle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    center: position,
    radius: 500000
  });
  
  circles.push(markerCircle);
  markers.push(marker);
  
  marker.addListener('mouseover', function() {
    var index = markers.indexOf(marker);
    circles[index].setMap(map);
  });
  
  marker.addListener('mouseout', function(){
     var index = markers.indexOf(marker);
      circles[index].setMap(null);
  });
  
  return marker;
}