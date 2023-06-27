// intial map settings
var mymap = L.map('map',
	{
		zoomControl:false,//custom zoom control
    }).setView([41.65, 14.25], 06);

L.control.zoom({
    position:'topleft'// default is topleft
}).addTo(mymap);

L.control.scale().addTo(mymap); // add scale bar

var mapbox = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		  maxZoom: 21,attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		  id: 'mapbox/streets-v11',
		  tileSize: 512,
		  zoomOffset: -1}).addTo(mymap);

// create a function that returns a color based on population density
function getColor(d) {
	return	d > 332  ? '#E31A1C' :
	d > 201  ? '#FC4E2A' :
	d > 123   ? '#FD8D3C' :
	d > 79   ? '#FEB24C' :
	d > 38   ? '#FED976' :
	'#FFEDA0';
}

// create a function which define a styling function for our GeoJSON layer so that its fillColor depends on feature.properties.DENS_ABITA
function graduated_color(feature) {
    return {
        fillColor: getColor(feature.properties.DENS_ABITA),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

// graduated legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 38, 79, 123, 201, 332],
        labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(mymap);

// load geojson and apply the style
var regions = new L.geoJson(regions, {
	style: graduated_color,
	onEachFeature: function (feature, layer) {
		layer.bindPopup('<table><tbody><tr><th scope="row"><td>Densità abitativa: '+feature.properties.DENS_ABITA+' abitanti/km2'+'</td></th></tr></tbody><tr><th scope="row"></th></tr></tbody>')}
}).addTo(mymap);
