// FIX THIS
$(function() {
    navigator.geolocation.getCurrentPosition(initialize);
});

// Set Global vars
var data,
    msg_data,
    map,
    newPins = [],
    iconBase = 'https://maps.google.com/mapfiles/',
    allMarkers = [],
    selfmsgWindow,
    curLatLng;

// Vars for various type of markers
var bluMarker = {
    url: 'assets/img/pins/pin1.png',
    scaledSize: new google.maps.Size(48, 48)
},
    redMarker = {
        url: 'assets/img/pins/pin4.png',
        scaledSize: new google.maps.Size(48, 48)
    },
    grnMarker = {
        url: 'assets/img/pins/pin8.png',
        scaledSize: new google.maps.Size(48, 48)
    },
    filMarker = {
        url: 'assets/img/pins/pin6.png',
        scaledSize: new google.maps.Size(48, 48)
    },
    homeMarker = {
        url: 'assets/img/pins/pin9.png',
        scaledSize: new google.maps.Size(48, 48)
    };

// Initial/default latLng
var latLng = new google.maps.LatLng(null, null);

/**
 * Initialize the app
 *
 * @param  {cord}   position Current location
 */

function initialize(position) {
    latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var myOptions = {
        panControl: false,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,
        draggable: true,
        disableDoubleClickZoom: true,
        scrollwheel: true,
        zoom: 14,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map"), myOptions);

    var markerlatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var marker = new google.maps.Marker({
        position: markerlatlng,
        title: "I am here!",
        icon: homeMarker,
        zIndex: 1000
    });

    selfmsgWindow = addInfoWindow(marker, "<h3>Me</h3>");

    allMarkers.push(marker);

    marker.setMap(map);

    // Create a connection to the server
    var socket = io.connect(document.URL);

    var latLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    socket.emit("join", latLng, function(successful, markers) {
        updateView(markers, 'text');

        // Send chat messages
        $("#msg-submit").click(function(ev) {
            // Prevent the browser from submitting the form via HTTP
            ev.preventDefault();

            // Send the message to the server
            socket.emit("chat", {
                latLng: latLng,
                message: $("#msg").val()
            });

            addToPlaylist($("#msg").val())

            // Clear the text-box
            $("#msg").val("");
            $('.counter').html('100')
        });

        /**
         * Bind to file upload
         *
         * @param  {event}  e
         * @param  {file}   addData
         */
        $('#fileupload').bind('fileuploadadd', function(e, addData) {
            var marker = addMarker(curLatLng, true, 'file', addData.files[0].name);
            marker.setIcon(redMarker);

            if (marker !== null) {

                /**
                 * If upload failed, remove the currently drop marker
                 *
                 * @param  {event}  e
                 * @param  {file}   data
                 */
                $('#fileupload').bind('fileuploadfail', function(e, failData) {
                    if (addData.files[0] === failData.files[0]) {
                        removeMarker(marker);
                    }
                });

                /**
                 * If upload successful, add the marker to marker array
                 *
                 * @param  {event}  e
                 * @param  {file}   data
                 */
                $('#fileupload').bind('fileuploaddone', function(e, data) {
                    marker.setDraggable(false);
                    if (isWithinBounds(allMarkers[0], marker)) {
                        marker.setIcon(bluMarker);
                        addDownload(marker, data.files[0].name);
                    } else {
                        marker.setIcon(grnMarker);
                    }

                    var latLng = {
                        lat: marker.position.lat(),
                        lng: marker.position.lng()
                    };

                    socket.emit("chat", {
                        latLng: latLng,
                        message: 'FILE' + data.files[0].name
                    });
                });
            }

        });

        // Handle chat messages
        socket.on("chat", function(message) {
            var obj = new google.maps.LatLng(message.sender.lat, message.sender.lng);
            addMarker(obj, false, 'text', message.message);
            selfmsgWindow.setContent(message.message);
        });
    });

    google.maps.event.addListener(map, 'mousemove', function(event) {
        updateCurLatLong(event);
    });

    $("#zo").click(function(event) {
        event.preventDefault();
        map.setZoom(map.getZoom() - 1);
    });

    $("#zi").click(function(event) {
        event.preventDefault();
        map.setZoom(map.getZoom() + 1);
    });

    $("#gt").click(function(event) {
        event.preventDefault();
        var lt1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.panTo(lt1);
    });
}

// function allowDrop(event) {
//     updateCurLatLong(event);
//     event.preventDefault();
// }

/**
 * Update the lat and long
 *
 * @param  {event} event
 */

function updateCurLatLong(event) {
    curLatLng = event.latLng;
}

$('.msg').bind('keyup blur', function() {
    $('.counter').html(100 - $('.msg').val().length)
})



/**
 * Check two markers are within bounds
 *
 * @param  {marker}  marker1
 * @param  {marker}  marker2
 * @return {Boolean}
 */

function isWithinBounds(marker1, marker2) {
    var sw = new google.maps.LatLng(marker1.getPosition().lat() - 0.025, marker1.getPosition().lng() - 0.025);
    var ne = new google.maps.LatLng(marker1.getPosition().lat() + 0.025, marker1.getPosition().lng() + 0.025);
    var marker1Bounds = new google.maps.LatLngBounds(sw, ne);

    return marker1Bounds.contains(marker2.getPosition());
}

/**
 * Remove a marker from the map
 *
 * @param  {marker} marker
 */

function removeMarker(marker) {
    marker.setMap(null);
    marker = null;
}

/**
 * Add a marker to the map

 * @param {marker}  obj       
 * @param {Boolean} draggable 
 * @param {string}  type      
 * @param {string}  filename  
 */

function addMarker(obj, draggable, type, filename) {
    for (var j = 0; j < allMarkers.length; j++) {
        if (allMarkers[j].position.equals(obj)) {
            return null;
        }
    }

    var mType = type === 'text' ? grnMarker : filMarker;

    var marker = new google.maps.Marker({
        position: obj,
        map: map,
        draggable: draggable,
        animation: google.maps.Animation.DROP,
        icon: mType
    });

    if (isWithinBounds(allMarkers[0], marker)) {
        marker.setIcon(bluMarker);
        if (type === 'file') {
            addDownload(marker, filename);
        }
    }

    allMarkers.push(marker);
    var info = addInfoWindow(marker, "<p>" + filename + "</p>");
    if (type === 'text') {
        info.open(map, marker);
    }

    return marker;
}

/**
 * Update the map
 *
 * @param  {markers} data
 * @param  {string}  type kind of marker ('file', 'text')
 */

function updateView(data, type) {
    for (var i = 0; i < data.length; i++) {
        var obj = new google.maps.LatLng(data[i].lat, data[i].lng);

        if (data[i].text.slice(0, 4) === 'FILE') {
            addMarker(obj, false, 'file', data[i].text.slice(4));
        } else {
            addMarker(obj, false, 'text', data[i].text);
        }
    }
}

/**
 * Add an info window
 *
 * @param {marker}  marker
 * @param {string]} html
 */

function addInfoWindow(marker, html) {
    var iWin = new google.maps.InfoWindow({
        disableAutoPan: true,
        content: html,
    });

    google.maps.event.addListener(marker, 'mouseover', function() {
        iWin.open(map, marker);
    });
    google.maps.event.addListener(marker, 'mouseout', function() {
        iWin.close();
    });

    return iWin;
}

/**
 * Marker for download
 *
 * @param {marker} marker
 * @param {string} filename
 */

function addDownload(marker, filename) {
    google.maps.event.addListener(marker, 'click', function(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        e.stop();
        window.open("http://107.170.16.7:8888/files/" + filename);
    });
}

/**
 * Function to refresh the embeded player
 *
 * Really just hacked something to make the rdio API work
 *
 * @param {string} track
 */

function addToPlaylist(track) {

    window.open("http://priteshgupta.com/rdio/examples/web-based.php?track=" + track);
    var html = '<iframe width="400" height="400" src="https://rd.io/i/Rl5p0Ecv11xt/" frameborder="0" class="rdio"></iframe>';
    $('.rdio').html('');
    $('.rdio').html(html);
}
