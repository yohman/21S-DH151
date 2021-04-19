# Week 4 Lab

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
	<title>World</title>
	<meta charset="utf-8" />

	<!-- style sheets -->
	<link rel="stylesheet" href="css/style.css">

	<!-- leaflet -->
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
	<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>

	<!-- jquery -->
	<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>

</head>
<body>

	<div class="header">
		Robin Dunitz Slides of Los Angeles Murals, 1925-2002
	</div>
	<div class="sidebar">
		
	</div>
	<div class="content">
		<div id="map"></div>
	</div>
	<div class="footer">
		Source: <a href="http://digitallibrary.usc.edu/cdm/landingpage/collection/p15799coll15">USC Libraries</a>
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

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
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
	grid-template-rows: 80px 1fr 50px;
	grid-template-columns: 50% 50%;
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

## Mapping CSV data

In previous labs, we have created our own data using javascript objects. Here, we will learn how to import data from a csv file.

### Import PapaParse

CSV is not natively supported by javascript. In order to import CSV, we will use an open source in-browser CSV parser library called [PapaParse](https://www.papaparse.com/).

To use PapaParse, download the source js file, and save it in your `Week4/js` folder:

- https://unpkg.com/papaparse@5.3.0/papaparse.min.js

Then, add the file to your `index.html` file in the header section:

```html
<script src="js/papaparse.min.js"></script>
```
> **Question:** Why download the file when you can link to it remotely?

### Create a csv file

Create a `Week4/data` folder. Download and add the `dunitz.csv` file from [here](https://raw.githubusercontent.com/yohman/21S-DH151/main/Weeks/Week04/Lab/data/dunitz.csv).

### Create a `readCSV()` function

First, add the path as a global variable in the `//global variable` section of `map.js`.

```js
// path to csv data
let path = "data/dunitz.csv";
```

Next, create a function that will read the csv file using PapaParse. You can put the function under the `createMap` function.

```js
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
```
Finally, add the call to the newly created `readCSV(path)` function inside the initialize code, right after the `createMap()` call:

```js
// initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
	readCSV(path);
});
```

Open the developer's tools and checkout the console output. How is the data structured?

### Sidenote about hosting csv files on GitHub

Note that the path can lead to a local file via a relative path, or it can be a csv file hosted on the web, like on a github account. If you are linking to a csv file on a GitHub account ([example](https://github.com/yohman/21S-DH151/blob/main/Weeks/Week04/Lab/data/dunitz.csv)), make sure you link to the raw url link:

<kbd><img src="images/raw.png"></kbd>

### Create the function to map the csv data

Notice that the `readCSV` function ends with a call to yet another function `mapCSV()`, hence, creating an error in your console because it is asking for a function that does not exist. So let's create the `mapCSV()` function, that takes in the data from the csv file, creates a marker for each element, and maps it.

First, we need to create a global variable for our featuregroup. Why? Note that variables created *within* a function are only available *within* that function and cannot be accessed outside of it. Therefore, if you create the variable as a global variable, it can be accessed within any other function you create.

In the global variables area up top, add the following entry:

```js
// global variables
let markers = L.featureGroup();
```

Next, create the `mapCSV` function:

```js
function mapCSV(data){
	
	// loop through each entry
	data.data.forEach(function(item,index){
		// create marker
		let marker = L.marker([item.latitude,item.longitude])

		// add marker to featuregroup
		markers.addLayer(marker)
	})

	// add featuregroup to map
	markers.addTo(map)

	// fit markers to map
	map.fitBounds(markers.getBounds())
}
```
<img src="images/markers.png">

### Changing markers to circles

The icon marker is now overcrowding the map. While you can design your own icons, another option is to use `circleMarker`.

- [CircleMarker documentation](https://leafletjs.com/reference-1.7.1.html#circlemarker)

```js
function mapCSV(data){
	
	// circle options
	let circleOptions = {
		radius: 5,
		weight: 1,
		color: 'white',
		fillColor: 'dodgerblue',
		fillOpacity: 1
	}

	// loop through each entry
	data.data.forEach(function(item,index){
		// create marker
		let marker = L.circleMarker([item.latitude,item.longitude],circleOptions)

		// add marker to featuregroup		
		markers.addLayer(marker)
	})

	// add featuregroup to map
	markers.addTo(map)

	// fit markers to map
	map.fitBounds(markers.getBounds())
}
```
<img src="images/circles.png">

### Adding on hover event (instead of on click)

```js
function mapCSV(data){

	// circle options
	let circleOptions = {
		radius: 5,
		weight: 1,
		color: 'white',
		fillColor: 'dodgerblue',
		fillOpacity: 1
	}

	// loop through each entry
	data.data.forEach(function(item,index){
		// create a marker
		let marker = L.circleMarker([item.latitude,item.longitude],circleOptions)
		.on('mouseover',function(){
			this.bindPopup(`${item.title}<br><img src="${item.thumbnail_url}">`).openPopup()
		})

		// add marker to featuregroup
		markers.addLayer(marker)
	})

	// add featuregroup to map
	markers.addTo(map)

	// fit map to markers
	map.fitBounds(markers.getBounds())
}
```
<img src="images/popup.png">

### Add images to sidebar

Below, notice the code added within the `forEach` loop that adds the thumbnail image to the sidebar, along with a function to pan to it.

```js
function mapCSV(data){

// circle options
	let circleOptions = {
		radius: 5,
		weight: 1,
		color: 'white',
		fillColor: 'dodgerblue',
		fillOpacity: 1
	}

	// loop through each entry
	data.data.forEach(function(item,index){
		// create a marker
		let marker = L.circleMarker([item.latitude,item.longitude],circleOptions)
		.on('mouseover',function(){
			this.bindPopup(`${item.title}<br><img src="${item.thumbnail_url}">`).openPopup()
		})

		// add marker to featuregroup
		markers.addLayer(marker)

		// add entry to sidebar
		$('.sidebar').append(`<img src="${item.thumbnail_url}" onmouseover="panToImage(${index})">`)
	})

	// add featuregroup to map
	markers.addTo(map)

	// fit map to markers
	map.fitBounds(markers.getBounds())
}
```

Images are now in the sidebar with a call to a new function to pan to the image. Notice that the `panTo` function, unlike the `flyTo` function, does not include a zoomlevel option, so it has to be defined as a separate line of code.

```js
function panToImage(index){
	// zoom to level 17 first
	map.setZoom(17);
	// pan to the marker
	map.panTo(markers.getLayers()[index]._latlng);
}
```

For reference, the source code for the completed lab is available [here](completed).

# Storyboard Exercise

## Part 1: Mindmap (5 minutes)

You have identified a problem, written up a proposal, selected preliminary datasets, and introduced a methodology for your project.

Begin to visualize the different components of the user experience: the user, the web interface, the interactions, the workflow, the navigation, and the end result. This is an individual exercise. With paper and pen, sketch the user experience as best as you can. No mind map will be the same. Some may be all images, all text, diagrams, arrows, illustrations, it's all good.

### Reflection (10 minutes)

Share your mindmap with your groupmates and vote on the elements that resonate with you.

## Part 2: Crazy Eights (10 minutes)

Get a piece of paper and fold it in half four times to get eight panels. Each panel is an "idea" that may or may not flow with the next panel. Sketch the idea (it might be the entire site, a search bar, an image, an interaction, etc). This is also an individual exercise, and each group member should create their own crazy eights.

### Reflection (10 minutes)

Share your crazy eight panels with your groupmates and vote on the elements that resonate with you.

## Part 3: Storyboard with Wireframing (20 minutes)

Now think of the site in a more complete sense. Sketch (or use your computer) to create at least three panels: First this, then this, and then that. Each panel does not need to be of the same element of your site. One panel may lead to a different element of your site that kicks you back out to the next panel. Describe each panel's components in as much detail as you can. Use annotations, bubbles notes, colors, etc.

This is a group exercise. You may choose to individually draw separate storyboard wireframes, or you may designate a "drawer" with everybody else contributing ideas as he/she sketches away.

- [source for inspiration](https://flickr.com/photos/soxiam/albums/224126/)

### Submission

Note that all three parts of this exercise are part of [Group Assignment #2](https://github.com/yohman/21S-DH151/blob/main/Group%20Assignments/GroupAssignment2.md).