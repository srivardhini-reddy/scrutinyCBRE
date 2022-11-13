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
        const jsonCities = '{"Harris": {"totalNumber": "+8283", "numberOfPositveReviews": 8283, "numberOfNegativeReviews": 2793, "numberOfNeutralReviews": 2149}, "Los Angeles": {"totalNumber": "+6741", "numberOfPositveReviews": 6741, "numberOfNegativeReviews": 0, "numberOfNeutralReviews": 2190}, "Cook": {"totalNumber": "+11933", "numberOfPositveReviews": 11933, "numberOfNegativeReviews": 1848, "numberOfNeutralReviews": 1092}, "New York": {"totalNumber": "+3533", "numberOfPositveReviews": 3533, "numberOfNegativeReviews": 2458, "numberOfNeutralReviews": 608}, "Seattle": {"totalNumber": "+4976", "numberOfPositveReviews": 4976, "numberOfNegativeReviews": 1929, "numberOfNeutralReviews": 539}}';
        const cities = JSON.parse(jsonCities);
        var marker = addMarker(e.latLng);
        
        var lat = marker.getPosition().lat();
        var lng = marker.getPosition().lng();
        const fetchLocationName = async (lat,lng) => {
            await fetch(
            'https://www.mapquestapi.com/geocoding/v1/reverse?key=0pM2C9ZA4yXf5jyR8EYR2j9XZWZ6ZZTA&location='+lat+'%2C'+lng+'&outFormat=json&thumbMaps=false',
            )
            .then((response) => response.json())
            .then((responseJson) => {
                const text = JSON.stringify(responseJson)
                var city = JSON.parse(text).results[0].locations[0].adminArea4;
                console.log(city)
                const sign = cities[city].totalNumber[0];
                city = JSON.parse(text).results[0].locations[0].adminArea4;
                showContent(marker, cities[city], e.latLng);
                colorCircle(marker, sign, e.latLng, cities[city].numberOfPositveReviews)
                console.log(cities[city].totalNumber[0]);
            });
        };

        fetchLocationName(lat, lng);
    });
}

function addMarker(position) {
  var marker = new google.maps.Marker({
    position: position,
    map: map
  });
  return marker;
}

// This example displays a marker at the center of Australia.
// When the user clicks the marker, an info window opens.
function showContent(marker, details) {
    const contentString = `<ul class="list-group m-2 text-start"><li class="aligned list-group-item">Total # of reviews: ` + details.totalNumber + `<br>` + `<li class="aligned list-group-item">Total # of positive reviews: ` + details.numberOfPositveReviews + `<br>` + `<li class="aligned list-group-item">Total # of Neutral reviews: ` + details.numberOfNeutralReviews + `<br>` + `<li class="aligned list-group-item">Total # of Negative reviews: ` + details.numberOfNegativeReviews + `</ul>` + `<div><a href="">More Details</a></div>`;
    const infowindow = new google.maps.InfoWindow({
        content: contentString,
    });
  

    marker.addListener("mouseover", () => {
        infowindow.open({
            anchor: marker,
            map,
        });
    });
}

function colorCircle(marker, sign, position, radius) {
    if (sign === '+') {
        drawCircle(marker, "green", position, radius);
    } else if (sign === '-') {
        drawCircle(marker, "red", position, radius);
    } else {
        drawCircle(marker, "blue", position, radius);
    }
}  


function drawCircle(marker, color, position, radius) {
    if (color === "green") {
        color = '#00FF00'
    } else if (color === "red") {
        color = '#FF0000'
    } else {
        color = '#4c8bf5'
    }

    var markerCircle = new google.maps.Circle({
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color,
    fillOpacity: 0.5,
    center: position,
    radius: radius*100
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


/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
  
}

window.initMap = initMap;
