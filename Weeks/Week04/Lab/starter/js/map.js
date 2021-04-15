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
		let marker = L.marker([item.latitude,item.longitude])
		markers.addLayer(marker)
	})
	markers.addTo(map)
	map.fitBounds(markers.getBounds())
}