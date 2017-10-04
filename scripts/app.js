// define globals
var weekly_quakes_endpoint = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

$(document).ready(function() {
  console.log("Let's get coding!");
  // CODE IN HERE!
  // initMap();
  getQuakes();



});

function getQuakes(){
	  $.ajax({
				method: "GET",

				url: "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson",

				dataType: 'JSON',

				//data: $("form").serialize(),

				success: onSuccess,

				error: onError
		});
	}

function onSuccess(json) {

	console.log(json);


	var map = new google.maps.Map(document.getElementById('map'), {
          // center: {lat: 37.78, lng: -122.44},
          center: getRecentQuake(json),
          zoom: 2
        });

	// markQuake(map.center, map);

	json.features.forEach(function(quake){
		var fullTitle = quake.properties.title;
		var title = (fullTitle.split(" of "))[1];
		console.log(fullTitle.split(" of "));
		var longitude = quake.geometry.coordinates[0];
		var latitude = quake.geometry.coordinates[1];
		var time = quake.properties.time;
		var now = new Date();
		var quakePosition = {lat:latitude, lng:longitude};
		markQuake(quakePosition, map);
		console.log(now.getTime());
		var hoursAgo = parseInt(((now.getTime()-time)/1000/60/60));

		console.log(`latitude: ${latitude}, longitude: ${longitude}, time: ${time}, ${hoursAgo} hours ago`);

		// console.log(title);
		$("#info").append(`<p>${title} / ${hoursAgo} hours ago</p>`);
	});

	// for(var i=0; i<json.data.length; i++){
	// 	img_url = json.data[i].images.fixed_height_small.url;
	// 	$('.gif-gallery').append('<img src="'+img_url+'">');
	// }
}

function onError(xhr, status, errorThrown) {
	console.log("Error: " + errorThrown);
	console.log("Status: " + status);
	console.dir(xhr);
	alert("Sorry, there was a problem!");
	
}

// function initMap() {
//         map = new google.maps.Map(document.getElementById('map'), {
//           center: {lat: 37.78, lng: -122.44},
//           zoom: 6
//         });
        
// }

function markQuake(position, map) {
	var markerImage = {
    url: "images/earthquake.png", // url
    scaledSize: new google.maps.Size(20, 20), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
		};
	var marker = new google.maps.Marker({
          position: position,
          map: map,
          icon: markerImage,
          title: 'Hello World!'
        });
}

function getRecentQuake(json){
	var recentLatitude = json.features[0].geometry.coordinates[1];
	var recentLongitude = json.features[0].geometry.coordinates[0];
	var recentPosition = {lat: recentLatitude, lng: recentLongitude};
	console.log(recentPosition);
	return recentPosition;
}