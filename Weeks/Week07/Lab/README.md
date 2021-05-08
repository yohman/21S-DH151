# Week 7 Lab


Welcome to week 7!

## Getting started

### Starter files

- starter files available [here](starter)

Or, you can create the files as indicated here:

### `Week4/index.html`

Notice the added `footer` class that include a link to the data source.

```html
<!DOCTYPE html>
<html>
<head>
	<title>World Covid Map</title>
	<meta charset="utf-8" />

	<!-- style sheets -->
	<link rel="stylesheet" href="css/style.css">

	<!-- leaflet -->
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
	<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>

	<!-- jquery -->
	<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>

	<!-- papaparse for csv data -->
	<script src="js/papaparse.min.js"></script>

</head>
<body>

	<div class="header">
		Covid Confirmed Cases by Country
	</div>
	<div class="sidebar">
		
	</div>
	<div class="content">
		<div id="map"></div>
	</div>
	<div class="footer">
	</div>

	<script src="js/map.js"></script>

</body>
</html>
```

### `Week4/js/map.js`
Notice the updated structure in the `map.js` code:

```js
// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = '';
let markers = L.featureGroup();

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

```

### `Week4/css/style.css`
Notice the added css for the `footer` class and the 50/50 split.

```css
body,html {
	margin:0;
	height:100%;
	width:100%;
}

#map {
	height: 100%;
}

body {
	display: grid;
	grid-template-rows: 60px 1fr 40px;
	grid-template-columns: 300px 1fr;
	grid-template-areas: 
	"header header"
	"sidebar content"
	"footer footer";
}

.header {
	grid-area: header;
	padding:10px;
	background-color: #333;
	color: white;
	font-size: 2em;
}

.sidebar {
	color: white;
	grid-area: sidebar;
	padding:10px;
	background-color: #555;
	overflow: auto;
}

.content {
	grid-area: content;
}

.footer {
	grid-area: footer;
	padding:10px;
	background-color: rgb(175, 175, 175);
}
```

## Mapping GeoJSON data

- Global source: https://geojson-maps.ash.ms/
- Local source: https://boundaries.latimes.com/sets/

```js
// put this in your global variables
let geojsonPath = 'data/world.json';
let geojson_data;
let geojson_layer;
let fieldtomap = 'pop_est';

// function to get the geojson data
function getGeoJSON(){

	$.getJSON(myGeoJSONPath,function(data){
		console.log(data)

		// put the data in a global variable
		geojson_data = data;

		// call the map function
		mapGeoJSON()
	})

}

// function to map a geojson file
function mapGeoJSON(){

	// create the layer and add to map
	geojson_layer = L.geoJson(geojson_data).addTo(map);

	// fit to bounds
	map.fitBounds(geojson_layer.getBounds())
}
```

## Creating a choropleth map

The documentation provided by leaflet:

```js
function mapGeoJSON(){

	// create the layer and add to map
	geojson_layer = L.geoJson(geojson_data).addTo(map);

	// set the style for the choropleth
	geojson_layer.setStyle(getStyle)

	// fit to bounds
	map.fitBounds(geojson.getBounds())
}

function getStyle(feature){
	return {
		stroke: true,
		color: 'white',
		weight: 1,
		fill: true,
		fillColor: getColor(feature.properties['pop_est']),
		fillOpacity: 0.8
	}
}
function getColor(d) {

	return d > 1000000000 ? '#800026' :
		   d > 500000000  ? '#BD0026' :
		   d > 200000000  ? '#E31A1C' :
		   d > 100000000  ? '#FC4E2A' :
		   d > 50000000   ? '#FD8D3C' :
		   d > 20000000   ? '#FEB24C' :
		   d > 10000000   ? '#FED976' :
					  '#FFEDA0';
}
```

## Classybrew to the rescue

[ClassyBrew](http://tannerjt.github.io/geotanner/javascript/color-theory/2014/10/29/classybrew-jenks-heart-colorbrewer.html) on GitHub

Create the file classbrew.js and save it in your `data/js` folder from their GitHub page:

https://raw.githubusercontent.com/tannerjt/classybrew/master/src/classybrew.js

Add it to your `index.html` file:

```html
	<!-- classy brew -->
	<script src="js/classybrew.js"></script>
```

Now you are ready to brew!

```js
function mapGeoJSON(field){

	// clear layers in case it has been mapped already
	if (geojson_layer){
		geojson_layer.clearLayers()
	}
	
	// globalize the field to map
	fieldtomap = field;

	// create an empty array
	let values = [];

	// based on the provided field, enter each value into the array
	geojson_data.features.forEach(function(item,index){
		values.push(item.properties[field])
	})

	// set up the "brew" options
	brew.setSeries(values);
	brew.setNumClasses(5);
	brew.setColorCode('Blues');
	brew.classify('equal_interval');

	// create the geojson layer
	geojson_layer = L.geoJson(geojson_data);

	// set the style
	geojson_layer.setStyle(getStyle).addTo(map)

	map.fitBounds(geojson_layer.getBounds())
}

function getStyle(feature){
	return {
		stroke: true,
		color: 'white',
		weight: 1,
		fill: true,
		fillColor: brew.getColorInRange(feature.properties[fieldtomap]),
		fillOpacity: 0.8
	}
}
```

### Brew options

Classification methods:

```js
brew.getClassificationMethods(); //returns
/*
["equal_interval", "quantile", "jenks"]
*/
```

Colors:

```js
var brew = new classyBrew();
brew.getColorCodes();  // returns
/*
["OrRd", "PuBu", "BuPu", "Oranges", 
"BuGn", "YlOrBr", "YlGn", "Reds", 
"RdPu", "Greens", "YlGnBu", "Purples", 
"GnBu", "Greys", "YlOrRd", "PuRd", "Blues", 
"PuBuGn", "Spectral", "RdYlGn", "RdBu", 
"PiYG", "PRGn", "RdYlBu", "BrBG", 
"RdGy", "PuOr", "Set2", "Accent", 
"Set1", "Set3", "Dark2", "Paired", 
"Pastel2", "Pastel1"];
*/
```

### Adding a legend

First, the css:
```css
/* legend styles */
.info {
	padding: 6px 8px;
	font: 14px/16px Arial, Helvetica, sans-serif;
	background: white;
	background: rgba(255,255,255,0.8);
	box-shadow: 0 0 15px rgba(0,0,0,0.2);
	border-radius: 5px;
	min-width: 250px;
	min-height: 50px;
}
.info h4 {
	margin: 0 0 5px;
	color: #777;
}

.legend {
	line-height: 18px;
	color: #555;
}
.legend i {
	width: 18px;
	height: 18px;
	float: left;
	margin-right: 8px;
	opacity: 0.7;
}
```

The javascript:

```js
function createLegend(){
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
		percents = brew.getBreaks(),
		labels = [],
		from, to;
		
		for (var i = 0; i < percents.length; i++) {
			from = percents[i];
			to = percents[i + 1];
			if(to) {
				labels.push(
					'<i style="background:' + brew.getColorInRange(from) + '"></i> ' +
					from.toFixed(2) + '% &ndash; ' + to.toFixed(2) + '%');
				}
			}
			
			div.innerHTML = labels.join('<br>');
			return div;
		};
		
		legend.addTo(map);
}
```

Finally, make sure to add a call to create the legend at the end of your `mapGeoJSON()` function:

```js
function mapGeoJSON(field,num_classes,color,scheme){

	...

	// create the legend
	createLegend();
}
```

### Adding hover actions

First, set the stage to enable hover actions on each feature in your geojson layer.

Locate the code within the `mapGeoJSON()` function that creates the `geojson_layer`, and add the `onEachFeature` argument as shown below:

```js
	// create the geojson layer
	geojson_layer = L.geoJson(geojson_data,{
		style: getStyle,
		onEachFeature: onEachFeature
	}).addTo(map);

```

Next, you create the `onEachFeature` function that will enable `mouseover`, `mouseout` and `click` events. You will then create a function for each one of these events.

```js
// Function that defines what will happen on user interactions with each feature
function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

// on mouse over, highlight the feature
function highlightFeature(e) {
	var layer = e.target;

	// style to use on mouse over
	layer.setStyle({
		weight: 2,
		color: '#666',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
}

// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
	geojson_layer.resetStyle(e.target);
}

// on mouse click on a feature, zoom in to it
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}
```

You see the pattern here? You are in control of user interaction! Each one of these action functions can be modified to fit your user interface design ideas.

### To pop-up or not to pop-up

Thus far, many of us have been using marker popups as a way to reveal information about features on the map. Perhaps a more informative, cleaner, and elegant approach is to use an info panel to display data about features you are hovering over.

#### Create an "info control"

First create a global variable for the control panel:

```js
let info_panel = L.control();
```

Then, create a function to add the control panel:

```js
function createInfoPanel(){

	info_panel.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info_panel.update = function (properties) {
		// if feature is highlighted
		if(properties){
			this._div.innerHTML = `<b>${properties.name}</b><br>${fieldtomap}: ${properties[fieldtomap]}`;
		}
		// if feature is not highlighted
		else
		{
			this._div.innerHTML = 'Hover over a country';
		}
	};

	info_panel.addTo(map);
}
```

Then, in the `highlightFeature(e)` function, which is triggered when a user hovers over a feature, add the following:

```js
function highlightFeature(e){
	...
	info_panel.update(layer.feature.properties)
}

function resetHighlight(e){
	...
	info_panel.update()
}
```

## Class exercise

Now that we are 'brewing, let's add some additional (useful) arguments to the function. For example, aside from the field to be choropleth'ed, why don't we also request a color pallette, number of classes, and a classfication scheme?

Complete the following function with the added arguments:

```js
function mapGeoJSON(field,num_classes,color,scheme){
	...
}
```


