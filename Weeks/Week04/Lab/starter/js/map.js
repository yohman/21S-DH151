// Global variables
let lat = 0;
let lon = 0;
let zl = 3;

// path to csv data
let path = "data/dunitz.csv"

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
    readCSV(path);
});

// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

// function to read csv data
function readCSV(path){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			
			// map the data
			mapCSV(data);
		}
	});
}

function mapCSV(data){
	let markers = L.featureGroup();
	data.data.forEach(function(item){
		let circleOptions = {
			radius: 6,
			weight: 1,
			color: 'white',
			opacity: 0.8,
			fillColor: 'dodgerblue',
			fillOpacity: 1
		}
		let marker = L.circleMarker([item.latitude,item.longitude],circleOptions)
		.on('mouseover',function(){
			this.bindPopup(`${item.title}<br><img src="${item.thumbnail_url}">`).openPopup()
		})
		markers.addLayer(marker)
	})
	markers.addTo(map)
	map.fitBounds(markers.getBounds())
}
