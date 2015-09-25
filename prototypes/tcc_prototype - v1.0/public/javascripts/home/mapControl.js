var MapScript = (function () {

    var map;
    var marker;
    var markers = [];

    initMap = function () {
        map = new google.maps.Map($('#mapDiv')[0], {
                center: {lat:  -14.718, lng: -56.449},
                zoom: 4
        });
    };

    getLocationByAddress = function(address){
        if(address != ""){
            var data = { address: address };

            $.ajax({
                url: 'https://maps.googleapis.com/maps/api/geocode/json',
                data: data,
                success: function (result) {  setMaker(result); }
            });
        }
    };

    setMaker = function(placeObject){

        if(placeObject.results.length > 0){

            var latitude = placeObject.results[0].geometry.location.lat;
            var longitude = placeObject.results[0].geometry.location.lng;

            marker = new google.maps.Marker({

                position: { lat: latitude, lng: longitude },
                map: map,
                title: placeObject.results[0].address_components[0].long_name,
                animation: google.maps.Animation.DROP
            });
            markers.push(marker);
        }
    };

    clearMarkers = function () {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    };

    setMapEvents = function(){
        $("#clearMakers").attr("onclick", "clearMarkers()");
    };

    //Public Methods
    return {
        initMap: initMap,
        setMapEvents: setMapEvents
    };
})();

$(document).ready(function () {
    MapScript.setMapEvents();
});