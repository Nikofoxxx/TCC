var MapScript = (function () {

    var map;
    var marker;
    var markers = [];

    initMap = function () {

        var resolution = $(window).width();

        if (resolution >= 952){
            $("#mapDiv").width(700);

            map = new google.maps.Map($('#mapDiv')[0], {
                center: {lat: -14.718, lng: -56.449},
                zoom: 4
            });
        }else{
            $("#mapDiv").width(500);

            map = new google.maps.Map($('#mapDiv')[0], {
                center: {lat: -15.000, lng: -54.449},
                zoom: 4
            });
        }

    };

    getLocationByAddress = function (address, keyword) {
        if (address != "") {

            var data = { address: address };

            $.ajax({
                url: 'https://maps.googleapis.com/maps/api/geocode/json',
                data: data,
                success: function (result) {
                    setMaker(result, keyword);
                }
            });
        }
    };

    setMaker = function (placeObject, keyword) {

        if (placeObject.results.length > 0) {

            var latitude = placeObject.results[0].geometry.location.lat;
            var longitude = placeObject.results[0].geometry.location.lng;
            var location = placeObject.results[0].address_components[0].long_name;

            marker = new google.maps.Marker({
                position: {lat: latitude, lng: longitude},
                map: map,
                title: location + ". Palavra-chave: " + keyword,
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

    handleMapAccordingScreenResolution = function () {
        var resolution = $(window).width();
        if (resolution >= 952){
            $("#mapDiv").width(700);
            var newLatLng = new google.maps.LatLng(-14.718, -56.449);
            map.setCenter(newLatLng);
        }else{
            $("#mapDiv").width(500);
            var newLatLng = new google.maps.LatLng(-15.000, -54.449);
            map.setCenter(newLatLng);
        }
    };

    setMapEvents = function () {

        $(window).resize(function () {
            handleMapAccordingScreenResolution();
        });

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