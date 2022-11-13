var map;
var markers = [];
var circles = [];

var empdata = {
    "Harris":{"list":
        [{"name":"Tom Harris","Empid":"X22343","Rating":"9.3"},
         {"name":"Sam Willson","Empid":"H45743","Rating":"8.6"},
         {"name":"Martha Colbey","Empid":"F25783","Rating":"8.5"},
         {"name":"Tyler Hunt","Empid":"K98343","Rating":"8.2"},
         {"name":"Don Smith","Empid":"Y20943","Rating":"8.0"},
         ],
         "keywords":["Realtor","Best neighborhoods","Buying vs building a house","Closing costs","open houses work","Best Realtor","Best time to sell a house","look for when buying a house","Closing costs for seller"]
    },
    "Cook":{"list":
        [{"name":"Cathy Backer","Empid":"X78923","Rating":"9.8"},
         {"name":"Robert Dawm","Empid":"U82343","Rating":"8.9"},
         {"name":"Sheldon Cooper","Empid":"D48343","Rating":"8.7"},
         {"name":"Kamla Fransis","Empid":"K52398","Rating":"8.5"},
         {"name":"Micheal Les","Empid":"F89343","Rating":"8.0"},
         ],
         "keywords":["cost to sell a house","Curb appeal","get preapproved for a home loan","my house worth?","Best time to buy a house","How long does it take to sell a house?"]
    },
    "Los Angeles":{"list":
        [{"name":"Peter Hopper","Empid":"X79923","Rating":"9.8"},
         {"name":"Erick Timber","Empid":"U33343","Rating":"8.5"},
         {"name":"Bruce Cooper","Empid":"D48943","Rating":"8.3"},
         {"name":"Peter Ganther","Empid":"K52358","Rating":"8.2"},
         {"name":"Snooper camel","Empid":"F89433","Rating":"8.0"},
         ],
         "keywords":["Best time to buy a house","FHA loans","sell your house without a Realtor?","Staging a house","FHA vs conventional loans"
,"good time to buy a house","get preapproved for a home loan"]
    },
    "New York":{"list":
        [{"name":"Harry Norm","Empid":"H59923","Rating":"9.9"},
         {"name":"Matt Timber","Empid":"U33043","Rating":"9.7"},
         {"name":"Bradely Deu","Empid":"D40743","Rating":"8.8"},
         {"name":"Charles Watson","Empid":"K52848","Rating":"8.5"},
         {"name":"Elon Dusk","Empid":"F89433","Rating":"8.4"},
         ],
         "keywords": ["cost to sell a house","Curb appeal","get preapproved for a home loan","my house worth?","Best time to buy a house","How long does it take to sell a house?"]
    }
}  

var myModal = document.getElementById('exampleModal');
    var myInput = document.getElementById('myInput');
    myModal.addEventListener('shown.bs.modal', function () {
    myInput.focus();
    });


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), { 
        zoom: 4, 
        center: {lat: 38, lng: -97},
        region: 'US'
        
    });

    new google.maps.Marker({
        position: {lat: 29.7604, lng: -95.3698},
        map,
        title: "Hello World!",
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
                showContent(marker,city, cities[city], e.latLng);
                colorCircle(marker, sign, e.latLng, cities[city].numberOfPositveReviews)
                console.log(cities[city].totalNumber[0]);
                getEmpData(city);
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

function getEmpData(city) {
    //console.log(empdata.Harris);
    var list,keys;
    Object.keys(empdata[city]).forEach(function(key){
        list = empdata[city].list;
        keys = empdata[city].keywords;
    });
    document.getElementById("exampleModalLabel").innerHTML=city
    var emp = document.getElementById("empdetails");
        var table="";
        table += 
        `<table class="table">
        <thead>
            <tr>
                <th scope="col">Employee name</th>
                <th scope="col">Rating</th>
            </tr>
        </thead>
        <tbody>
        `;
        for (var i=0; i < list.length; i++){
            table +=`  
            <tr>         
              <td>`+ list[i].name+`</td>
              <td>`+ list[i].Rating+`</td>
              </tr>
              `;
        }
        table+=`     
          </tbody>
        </table>`;
        emp.innerHTML = table;
    var keywords= document.getElementById("keywords");
    var kw="";
    kw+=`<div>
    <h4>Keywords</h4>
    <p>`;
    for( var i=0; i < keys.length; i++){
        kw+=keys[i]+`<br>`;
    }
    kw+=`</p></div>`;
    keywords.innerHTML=kw;
}



// This example displays a marker at the center of Australia.
// When the user clicks the marker, an info window opens.
function showContent(marker,city, details) {
    const contentString = `<h3>`+city+`</h3><ul class="list-group m-2 text-start"><li class="aligned list-group-item">Total # of reviews: ` 
    + details.totalNumber + `<br>` + `<li class="aligned list-group-item">Total # of positive reviews: ` 
    + details.numberOfPositveReviews + `<br>` + `<li class="aligned list-group-item">Total # of Neutral reviews: ` 
    + details.numberOfNeutralReviews + `<br>` + `<li class="aligned list-group-item">Total # of Negative reviews: ` 
    + details.numberOfNegativeReviews + `</ul>` + `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">More details</button>`;
    
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
