// intial map settings
var mymap = L.map('map',
	{
	zoomControl:false,//custom zoom control
    }).setView([41.65, 14.58], 10);

L.control.zoom({
    position:'topleft'// default is topleft
}).addTo(mymap);

L.control.scale().addTo(mymap); // add scale bar

mymap.attributionControl.addAttribution('Realizzato da <a href="https://www.linkedin.com/in/ludovicofrate/" target="_blank"> Ludovico Frate</a> | Fonte dati: <a href="https://elezioni2023.regione.molise.it/" target="_blank">Elezioni Molise 2023')

//L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//}).addTo(mymap);


// create a function with if statement to creare categories
function categorical_legend(feature) {
	if (feature.properties['coalizione'] === "Centrodestra") {
		return {
			opacity: 1,
			color: '#ffffff',
			weight: 1.0,
			fill: true,
			fillOpacity: 0.7,
			fillColor: '#1a6aff',
		}
	};
	if (feature.properties['coalizione'] === "Centrosinistra") {
		return {
			opacity: 1,
			color: '#ffffff',
			weight: 1.0,
			fill: true,
			fillOpacity: 0.7,
			fillColor: '#ff4a43',
		}
	};
}


function getColor(d) {
        return d === 'ROBERTI'  ? "#1a6aff" :
               d === 'GRAVINA'  ? "#ff4a43" :
                            "#ff7f00";
    }

// graduated legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (mymap) {

    var div = L.DomUtil.create('div', 'info legend');
    labels = [],
    categories = ['ROBERTI','GRAVINA'];

    for (var i = 0; i < categories.length; i++) {

            div.innerHTML += 
            labels.push(
                '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
            (categories[i] ? categories[i] : '+'));

        }
        div.innerHTML = labels.join('<br>');
    return div;
    };
legend.addTo(mymap);






// load geojson and apply the style

var molise;

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#ffffff',
        dashArray: '',
        fillOpacity: 0.9
    });

    layer.bringToFront();
	info.update(layer.feature.properties);
}

function resetHighlight(e) {
    molise.resetStyle(e.target);
	info.update();
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}


molise = L.geoJson(molise, {
	style: categorical_legend,
	onEachFeature: onEachFeature
}).addTo(mymap);

// control

var info = L.control();

info.onAdd = function (mymap) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = (props ?
        '<h3>' + props.COMUNE + '<br><br>' + props.presidente+'</h3><br><table><tr><th><h4>Candidato</h4></th><th><h4>%</h4></th><th><h4>Voti</h4></th></tr><tr><th>Roberti</th><th>'+ props.percent_roberti+'</th><th>'+ props.voti_roberti+'</th></tr><tr><th>Gravina</th><th>'+ props.percent_gravina+'</th><th>'+ props.voti_gravina+'</th></tr><tr><th>Izzo</th><th>'+ props.percent_izzo+'</th><th>'+ props.voti_izzo+'</th></tr></table>'
        : 'Scorri il mouse sopra un comune');
};
info.addTo(mymap);



// load geojson and apply the style
//var molise = new L.geoJson(molise, {
//	style: categorical_legend,
//	onEachFeature: function (feature, layer) {
//		layer.bindPopup('<table><tbody><tr><th scope="row"><td>Zona geografica: '+feature.properties.coalizione+'</td></th></tr></tbody><tr><th scope="row"></th></tr></tbody>')}
//}).addTo(mymap);


