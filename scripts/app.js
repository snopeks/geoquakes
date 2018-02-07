console.log("Let's get coding!");
// define globals
var weekly_quakes_endpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var monthly_quakes_endpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
var hourly_quakes_endpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

  // CODE IN HERE!
  // initMap();
  var endpointUrl = weekly_quakes_endpoint;
  getQuakes(endpointUrl);


  //want to swap in different endpoints based on button clicking.
  $('button').on('click', function(){
    if($(this).hasClass('btn-warning')){
      $("p").remove()
      endpointUrl = monthly_quakes_endpoint;
      console.log("want to pass in the monthly endpoint")
      getQuakes(endpointUrl)
    } else if($(this).hasClass('btn-primary')){
      $("p").remove()
      endpointUrl = weekly_quakes_endpoint;
      console.log("want to pass in the weekly endpoint")
      getQuakes(endpointUrl)
    } else if($(this).hasClass('btn-danger')){
      $("p").remove()
      endpointUrl = hourly_quakes_endpoint;
      console.log("want to get hourly quakes")
      getQuakes(endpointUrl)
    }
  })

function getQuakes(endpoint){
  //call the ajax function, see if it is successful or errors out
	  $.ajax({
				method: "GET",
				url: endpoint,
				dataType: 'JSON',
				success: onSuccess,
				error: onError
		});
	}

function onSuccess(json) {
  //sanity check for data
  console.log(json);

  //initialize map based on googlemaps API docs
	var map = new google.maps.Map(document.getElementById('map'), {
          // center: {lat: 37.78, lng: -122.44},
          //center based on the most recent quake data
          center: getRecentQuake(json),
          zoom: 2
        });

  //for every quake recorded in the data json
	json.features.forEach(function(quake){
    //get the magnitude of each quake
    var mag = quake.properties.mag;
    //get the title
    var fullTitle = quake.properties.title;
    //parse the title to only have the city and country
		var title = (fullTitle.split(" of "))[1];
    //sanity check: see how we are splitting the title
    // console.log(fullTitle.split(" of "));

    //get coordinates
		var longitude = quake.geometry.coordinates[0];
		var latitude = quake.geometry.coordinates[1];
    //get quake time
    var time = quake.properties.time;
    //get current time
		var now = new Date();
    //calculate difference between now and quake time, hour should be integer
    var hoursAgo = parseInt(((now.getTime()-time)/1000/60/60));

    //add a variable that will keep track of the quake magnitude
    //so we can add different colors to different magnitudes later

    // console.log(mag);
    //formatting the position of our markers to be at our calculated
    //latitude and longitude variables above.
    var quakePosition = {lat:latitude, lng:longitude};
    if(mag > 3){
      markQuake(quakePosition, map, mag);
    };
    //append the title and hours ago of each quake
    if (mag > 3){
		$("#info").append(`<p>${title} / ${hoursAgo} hours ago</p>`);

    };
    //sanity check: see how our lat and lng data looks
		// console.log(`latitude: ${latitude}, longitude: ${longitude}, time: ${time}, ${hoursAgo} hours ago`);
    //end of forEach loop
	});
  //end onSuccess function
}

function onError(xhr, status, errorThrown) {
	console.log("Error: " + errorThrown);
	console.log("Status: " + status);
	console.dir(xhr);
	console.log("Sorry, there was a problem!");
}

//We could run this function initMap() at the start of onSuccess to create map,
//but we are doing it directly :)

// function initMap() {
//         map = new google.maps.Map(document.getElementById('map'), {
//           center: {lat: 37.78, lng: -122.44},
//           zoom: 6
//         });

// }


function markQuake(position, map, mag) {
  var imageUrl = '';
  if(mag <= 4){
    imageUrl = "images/earthquake.png";
  } else if(mag <= 5){
    imageUrl = "images/yellow_mag.png";
  } else {
    imageUrl = "images/red_mag.png";
  }
  var markerImage = {
    url: imageUrl, // url of icon, based on the if statement above
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
//calculate the center position on map based on the most recent quake.
//this function is called when we are initializing the map (see center position)
function getRecentQuake(json){
  var recentLongitude = json.features[0].geometry.coordinates[0];
	var recentLatitude = json.features[0].geometry.coordinates[1];
	var recentPosition = {lat: recentLatitude, lng: recentLongitude};
	// console.log(recentPosition);
  //return the recentPosition so we can use it inside our onSuccess fn
	return recentPosition;
}
//add visual indicators for quake magnitude.
