var meal;
var cuisine;

var locationToFind;

$("#submit").click(function () {
    $('#imageGallery').empty();
    removeMarkers();

    meal = $('#mealOption').val();
    cuisine = $('#cuisineOption').val();

    console.log("meal: " + meal);
    console.log("cuisine: " + cuisine);

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: locationToFind,
        radius: 5000, //check default distance metric
        type: ['restaurant'],
        keyword: [meal, cuisine]
    }, callback);

});

var map;
var service;
var infowindow;

function initMap() {
    var toronto = {lat: 43.6532, lng: -79.3832}; //Toronto lat-long

    map = new google.maps.Map(document.getElementById('gmap'), {
        center: toronto,
        zoom: 15
    });

    infowindow = new google.maps.InfoWindow();
    /*
     var service = new google.maps.places.PlacesService(map);
     service.nearbySearch({
     location: toronto,
     radius: 500, //check default distance metric
     type: ['restaurant']
     }, callback);
     */

    initAutocomplete();
}

var markers = [];

function initAutocomplete() {
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {

        var places = searchBox.getPlaces();

        console.log(places);

        var latitude = places[0].geometry.location.lat();
        var longitude = places[0].geometry.location.lng();

        console.log("latitude: " + latitude);
        console.log("longitude: " + longitude);

        locationToFind = {lat: latitude, lng: longitude};

        //console.log(places);

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.

        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}


function removeMarkers(){
    for(i = 0; i < markers.length; i++){
        markers[i].setMap(null);
    }
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            //console.log(results[i]);
            //console.log(results[i].name);
            //console.log("Rating: " + results[i].rating);
            createMarker(results[i]);
            addImages(results[i].photos[0].getUrl({'maxWidth': 350, 'maxHeight': 350}), results[i].name, results[i].rating);
        }
    }
}

function createMarker(place) {

    console.log("createMarker");

    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    //when user clicks on the map do this
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function addImages(url, name, rating) {
    
    $("#imageGallery").append('<div class="imageTile" ><img src="' + url + '" /><p class="restaurantName" >' + name + '</p><p class="restaurantName" >' + "Rating: " + rating + '</p></div>');
}


//firebase part for comment form
//Comment fom the user with firebase database
var config = {
    apiKey: "AIzaSyBwGifSlsAmc0Cv3oc4g_P8ww2StDUxC2o",
    authDomain: "form-enter.firebaseapp.com",
    databaseURL: "https://form-enter.firebaseio.com",
    storageBucket: "form-enter.appspot.com"
};
firebase.initializeApp(config);
database = firebase.database();


//var commentRef = firebase.database().ref("comment");

$("#form-submit").on("click", function(e)
{ 
    e.preventDefault();

        var name = $("#name").val().trim();
        var email = $("#email").val().trim();
        var comment = $("#comment").val().trim();
       
    database.ref().push({
        name: name,
        email: email,
        comment: comment
    }); 
 
    $("#name").val(" ");
    $("#email").val(" ");
    $("#comment").val(" ");
   
});


database.ref().limitToLast(4).on("child_added", function(snapshot)
{
    
    var ss = snapshot.val();

    $("#user-comments").prepend("<div id='cmnt'><div ><h6 class='headerToBeAnimated'><span>" + ss.name + "</span></h6></div><div><p class='text-justify headerToBeAnimated'>" 
    + ss.comment + "<p></div></div>");    
});
