
var map;

// Marker Colors:
//  fauna - red
//  flora - green
//  scenery - blue
var redMarker = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var greenMarker = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var blueMarker = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    html: '<div style="background-color: #0000ff; border-radius: 50%; width: 25px; height: 25px;"></div>',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var markerTypes = {
    'fauna': redMarker,
    'flora': greenMarker,
    'scenery': blueMarker
}

var custom_markers = {
    //51.5125253&lon=-0.2186964&z=20
    'rick': {
        'meta': {
            'DateTime': '<a target="_blank" href="https://www.google.com/maps/@51.5126095,-0.2190288,3a,90y,84.83h,57.89t/data=!3m6!1e1!3m4!1s8iYE31vEA6IM69HBBqtA-g!2e0!7i16384!8i8192">Google Street View</a>',
            'GPSInfo': {
                'latitude': 51.5125397546801,
                'longitude': -0.2190452814102173,
                'altitude': 20
            }
        },
        'name': 'Interesting Bridge',
        'file': 'bridge.mp4',
        'extra': '',
        'type': 'scenery'
    }
}

var clusterIcon = L.DivIcon.extend({
    options: {    
        iconSize: [36, 58],
        iconAnchor: [18, 58],
        popupAnchor: [1, -34],
        shadowSize: [58, 58]
    }
});

var markers = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {

        var childCount = cluster.getChildCount();
        var clusterMarkers = cluster.getAllChildMarkers();

        var c = ' marker-cluster-';
        if (childCount < 10) {
            c += 'small';
        } else if (childCount < 100) {
            c += 'medium';
        } else {
            c += 'large';
        }

        // Pick a random url from the cluster markers

        let rand = Math.floor(Math.random() * clusterMarkers.length);
        let url = clusterMarkers[rand].options.path;

        return new clusterIcon({ 
            iconSize: new L.Point(100, 100),    
            iconUrl: 'https://robsweb.site/files/photos/thumbnails/' + url,
            html: `<div><span style="position:absolute;color:white">${childCount}</span>
                <img src="https://robsweb.site/files/photos/thumbnails/${url}" style="width: 100px;height: 100px;border-radius: 20%;">
            </div>`, 
            className: 'marker-cluster' + c, 
        });
    },
    spiderfyDistanceMultiplier: 4.5 // Increase the expansion distance
});

var markerArray = [];

function load_photo(photo) {
    let name = photo.name;
    let type = photo.type;


    let path = type + '/';

    if(photo.file) {
        path += photo.file;
    } else {
        path += photo.name;
    }
    
    thumb_path = path
    if(path.indexOf('.mp4') > -1) {
        thumb_path = path.replace('.mp4', '.png');
    }

    let date = photo.meta.DateTime;
    let lat = photo.meta.GPSInfo.latitude;
    let lon = photo.meta.GPSInfo.longitude;

    let markerIcon = L.divIcon({
        className: 'html-marker',
        html: '<div><img src="https://robsweb.site/files/photos/thumbnails/' + thumb_path + '" style="width: 100px;height: 100px;border-radius: 20%;"></div>',
        iconSize: [100, 20] // Set the size of the marker
    });

    let marker = L.marker([lat, lon], { icon: markerIcon });

    // icon width and height
    // marker.options.icon.options.iconSize = [50, 82];
    // marker.options.icon.options.iconAnchor = [25, 82];
    // marker.options.icon.options.popupAnchor = [1, -34];
    // marker.options.icon.options.shadowSize = [82, 82];

    marker.options.icon.options.iconSize = [36, 58];
    marker.options.icon.options.iconAnchor = [18, 58];
    marker.options.icon.options.popupAnchor = [1, -34];
    marker.options.icon.options.shadowSize = [58, 58];

    marker.bindPopup(`
        <b>${name}</b><br>
        <small>${date}</small>
        <br>
        <a target="_blank" href="https://robsweb.site/files/photos/${path}" title="View Image">
            <img src="https://robsweb.site/files/photos/${thumb_path}" width="100%">
        </a>
        <br>
        ${photo.extra ? photo.extra : ''}
        <br>
        <i>Click image to view full size</i>
    `,
    {
        minWidth: 500
    }
    );
    
    marker.options.url = `https://robsweb.site/files/photos/${path}`;
    marker.options.path = path;

    // On click, update the url with the coordinates
    // marker.on('click', function() {
    //     let url = new URL(window.location.href);
    //     url.searchParams.set('lat', lat);
    //     url.searchParams.set('lon', lon);
    //     // zoom
    //     url.searchParams.set('z', map.getZoom());
    //     window.history.pushState({}, '', url);
    // });

    markerArray.push(marker);
}

function loadMarkers() {
    let bbox = map.getBounds();
    let center = map.getCenter();
    let min_lat = bbox._southWest.lat;
    let min_lon = bbox._southWest.lng;
    let max_lat = bbox._northEast.lat;
    let max_lon = bbox._northEast.lng;


    fetch('https://api.robsweb.site/photos/all_photos_metadata')
        .then(res => res.json())
        .then(data => {

            let photos = data.result.forEach(photo => {
                load_photo(photo);
            });
        })
        .then(() => {
            
            // load_photo(custom_markers.rick);

            loadMarkerArray();

            // On any move of the map, update the url
            map.on('moveend', function () {
                let url = new URL(window.location.href);
                let center = map.getCenter();
                url.searchParams.set('lat', center.lat);
                url.searchParams.set('lon', center.lng);
                // zoom
                url.searchParams.set('z', map.getZoom());
                // window.history.pushState({}, '', url);
                window.history.replaceState({}, '', url);
            });
        });
}


function loadMarkerArray() {
    markers.addLayers(markerArray);
    // markers grouping icon size
    map.addLayer(markers);
}

function parseUrl() {
    let lat, lon, z;
    let url = new URL(window.location.href);
    lat = url.searchParams.get('lat');
    lon = url.searchParams.get('lon');
    z = url.searchParams.get('z');

    return {
        valid: lat && lon && z,
        lat: lat,
        lon: lon,
        z: z
    }
}
document.addEventListener('DOMContentLoaded', () => {

    let url = parseUrl();
    if (url.valid) {
        map = L.map('map').setView([url.lat, url.lon], url.z);
    }
    else {
        let center = {
            "lat": 32.50643214779361,
            "lng": -93.75011444091798
        };

        map = L.map('map').setView([center.lat, center.lng], 6);
    }
    googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);

    loadMarkers();

});