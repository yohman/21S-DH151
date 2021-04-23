// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
// let path = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';


let path = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtXb-BG5Ee-AB8S8xjgEsLuEIoUGyvgtqrVsojnYkFePHy-VICUMkp9R16FHuPTv0uaRwHM29wbRxx/pub?gid=1347161303&single=true&output=csv"

let markers = L.featureGroup();
let csvdata;
let lastdate;
let JSONurl = "https://controllerdata.lacity.org/resource/ejf8-ekfc.json";
let googleurl = "https://spreadsheets.google.com/feeds/list/1wk6ylUHjbJDatNBeTZCFtpISVVwgxy9QEGplVVuh5_M/on2nzw1/public/values?alt=json"

// initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
	readCSV(path);
	// getJSON(JSONurl);
	// getGoogleSheet(googleurl);
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
			// put the data in a global variable
			csvdata = data;
			data.data.forEach(function(item){
				let marker = L.marker([item.latitude,item.longitude])
				markers.addLayer(marker)
			})
			markers.addTo(map)
			map.fitBounds(markers.getBounds())
			// // get the last date
			// lastdate = csvdata.meta.fields[csvdata.meta.fields.length-1];
			
			// // map the data
			// mapCSV(lastdate);

			// // create sidebar buttons
			// createSidebarButtons();

		}
	});
}

function mapCSV(date){

	// clear layers
	markers.clearLayers();

	// loop through each entry
	csvdata.data.forEach(function(item,index){
		if(item.Lat != undefined){
			// circle options
			let circleOptions = {
				radius: radiusSize(item[date]),
				weight: 1,
				color: 'white',
				fillColor: 'red',
				fillOpacity: 0.5
			}
			let marker = L.circleMarker([item.Lat,item.Long],circleOptions)
			.on('mouseover',function(){
				this.bindPopup(`${item['Country/Region']}<br>Total confirmed cases as of ${date}: ${item[date]}`).openPopup()
			})
			markers.addLayer(marker)	
		}
	});

	markers.addTo(map)
	map.fitBounds(markers.getBounds())

}

function radiusSize(value){

	let values = [];

	// get the min and max
	csvdata.data.forEach(function(item,index){
		if(item[lastdate] != undefined){
			values.push(Number(item[lastdate]))
		}
	})
	let min = Math.min(...values);
	let max = Math.max(...values)
	
	// per pixel if 100 pixel is the max range
	perpixel = max/100;
	return value/perpixel
}

function createSidebarButtons(){
	let dates = csvdata.meta.fields.slice(csvdata.meta.fields.length-100)
	dates.forEach(function(item){
		$('.sidebar').append(`<div onmouseover="mapCSV('${item}')" class="sidebar-item">${item}</div>`)
	})
}


function getJSON(url){
fetch(url)
	.then(response => {
		return response.json();
	})
	.then(data =>{
		console.log(data)
		mapJSON(data)
	});
}

function mapJSON(data){
	data.forEach(function(item,index){
		let marker = L.circleMarker([item.latitude,item.longitude])
		markers.addLayer(marker);
	})
	markers.addTo(map);
	map.fitBounds(markers.getBounds());

}


function getGoogleSheet(url){
fetch(url)
	.then(response => {
		return response.json();
	})
	.then(data =>{
		console.log(data)
		mapGoogleSheet(data);
	})
}


function mapGoogleSheet(data){
	data.feed.entry.forEach(function(item,index){
		let marker = L.circleMarker([item.gsx$latitude.$t,item.gsx$longitude.$t])
		.on('mouseover',function(){
			this.bindPopup(`${item.content.$t}`).openPopup();
		})
		markers.addLayer(marker);
	})
	markers.addTo(map);
	map.fitBounds(markers.getBounds());

}
