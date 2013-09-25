var wssocket = new WebSocket('ws://localhost:3000');

var map, marker;

navigator.geolocation.getCurrentPosition(function(position) {
    var latlng = positionToArray(position);

    var current = new google.maps.LatLng(latlng[0], latlng[1]);

    var map = new google.maps.Map(document.querySelector('.map'), {
        center: current, zoom: 14
    });

    var marker = new google.maps.Marker({
        position: current, map: map
    });

    wssocket.send(JSON.stringify(latlng));
});

wssocket.addEventListener('open', function(message) {

});

wssocket.addEventListener('message', function(message) {

});

function positionToArray(position) {
    var array = [];

    array.push(position.coords.latitude);
    array.push(position.coords.longitude);

    return array;
}
