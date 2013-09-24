navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    var current = new google.maps.LatLng(lat, lng);

    var map = new google.maps.Map(document.querySelector('.map'), {
        center: current, zoom: 14
    });

    var marker = new google.maps.Marker({
        position: current, map: map
    });
});
