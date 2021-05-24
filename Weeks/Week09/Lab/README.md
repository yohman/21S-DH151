# Week 9

## Code Review

Welcome to week 9! This week, we will do a code review.

### Your file structure

```
+ web root
+ -- index.html
+ -- css
	 + -- style.css
	 + -- other_libraries.css
+ -- js
	 + map.js
	 + other_libraries.js
+ -- data
	 + world.geojson
	 + indicators.csv
```

### Your HTML

```html
<!DOCTYPE html>
<html>
<head>
	<title>Your Page Title</title>
	<meta charset="utf-8" />

	<!-- your style sheet -->
	<link rel="stylesheet" href="css/style.css">

	<!-- leaflet -->
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
	<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>

	<!-- jquery -->
	<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>

	<!-- papaparse for csv data -->
	<script src="js/papaparse.min.js"></script>

	<!-- other libraries will go here -->

</head>
<body>

	<div class="header">
		Covid Confirmed Cases by Country
	</div>
	<div class="sidebar"></div>
	<div class="content">
		<div id="map"></div>
	</div>
	<div class="footer"></div>

	<!-- your javascript is at the bottom -->
	<script src="js/map.js"></script>

</body>
</html>
```

#### Class vs ID

Notice that your html has `divs` with classes. Classes give each div an identifier (like a tag) that allows you to style them in your css. Classes can be used on multiple elements (like `<div>`, `<span>`, `<p>`, etc).

ID's on the other hand, are unique identifiers. Since you will typically only have one map on your web page, it is considered unique, and therefore, rather than using classes, you use an `id`.

### Your CSS



### Your javascript


# Creating a dashboard

## Data!

<!-- We care about our planet, and would like to bring awareness as to which countries are the largest contributors to CO2 emissions. The World Bank's data center provides temporal information on CO2 emssions by country:

- https://data.worldbank.org/indicator/EN.ATM.CO2E.PC

After inspecting the metadata, and learning about the data, we can download it as a csv file. -->

For this lab, we will look to create data visualizations based on ACS data. The data was downloaded from Social Explorer, cleaned up extensively in Excel, and merged with a US County geojson layer. This data preparation step in itself took a few hours!

As a result, the starter files should produce a US County choropleth map. Open the console, and inspect the data fields that are available.


## Charts

Continuing from our Week 7 choropleth map.

- [Starter files](starter)

### Create a new dashboard panel

Add a new `div` with class `dashboard`, right above the footer div in the `index.html` file.

```html
<body>
	...
	<div class="dashboard"></div>
	<div class="footer"></div>
	...
</body>
```

Now that the container for the dashboard has been created, we need to give it some css.

```css
body {
	display: grid;
	grid-template-rows: 60px 1fr 1fr;
	grid-template-columns: 1fr 1fr;
	grid-template-areas: 
	"header header"
	"content dashboard"
	"footer footer";
}

.dashboard {
	grid-area: dashboard;
}
```
Nice! You should now have a new panel to the right of your map. This is where we will add a dashboard full of data as users interact with the map.

So how will the dashboard function? The UI dictates that as a user hovers over the map features, the dashboard will automatically create a report based on the feature highlighted. Our javascript already has a function that handles mouseover actions, so let's create a function call within it. At the bottom of the `highlightFeature()` function, add the call to `createDashboard()`, feeding it the properties of the highlighted feature.

```js
// on mouse over, highlight the feature
function highlightFeature(e) {
	...
	createDashboard(layer.feature.properties)
}
```

Next, we author the function itself. For now, create an empty function that dumps the data that is being fed into it into the console.

```js
function createDashboard(properties){
	console.log(properties)
}
```
Inspect the values in the console. This is what we have to work with to create our charts.

## Charts

There are many javascript charting libraries to use. Here are some of the free and open source projects:

- https://apexcharts.com/
- https://www.chartjs.org/
- https://gionkunz.github.io/chartist-js/index.html
- https://developers.google.com/chart (not open source but free)

Each library produces similar types of charts, but the code to produce the charts are slightly different. It is important to go over the documentation to see which library would work best with the data that you have.

For this lab, we will use Apex Charts.

Now that we have checked out what Apex Charts can do, let's put it into action. Modify the `createDashboard()` function by adding code to create a sample chart:

```js
function createDashboard(properties){

	// clear dashboard
	$('.dashboard').empty();

	console.log(properties)

	// chart title
	let title = 'Championships Won';

	// data values
	let data = [27,17,17,20];

	// data fields
	let fields = ['New York Yankees','LA Lakers','Boston Celtics','Manchester United'];

	// set chart options
	let options = {
		chart: {
			type: 'bar',
			height: 300,
			animations: {
				enabled: true,
			}
		},
		title: {
			text: title,
		},
		plotOptions: {
			bar: {
				horizontal: true
			}
		},
		series: [
			{
				data: data
			}
		],
		xaxis: {
			categories: fields
		}
	}
	
	// create the chart
	var chart = new ApexCharts(document.querySelector('.dashboard'), options)
	chart.render()

```

<img src="images/bar.png">

For a pie chart, replace the options with the following:

```js
	var options = {
		chart: {
			type: 'pie',
			height: 200,
			width: 400,			
			animations: {
				enabled: true,
			}
		},
		title: {
			text: title,
		},
		series: data,
		labels: fields,
		legend: {
			position: 'right',
			offsetY: 0,
			height: 230,
		  }
	};
```
<kbd><img src="images/pie.png"></kbd>

As you can see, each chart type has a different set of options that are slightly different in their configuration.

Now we need to replace these numbers with data that is driven by the user action.

Recall that the function already receives data, and that we are outputting the data into the console. Look at the variables that are related to Household Income:

<kbd><img src="images/incomevars.png"></kbd>

What would we have to do to create a pie chart with these variables? Modify the code in the `createDashboard()` function to generate the following pie charts:

<kbd><img src="images/pie2.png"></kbd>


## Tables

- https://gridjs.io/docs/examples/import-json
- http://js-grid.com/getting-started/

Adding tables allows you to visualize your data in tabular format. This may be useful when you want to display rankings of particular attributes in your data. Linking the table rows with the elements on the map is what makes spatial exploration powerful, essentially mapping the **what** with the **where**.

### Import the js and css files

For this lab, we will use js-grid. Add the javascript and css to your `index.html` file:

```html
	<!-- js-grid -->
	<link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid.min.css" />
	<link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid-theme.min.css" />
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid.min.js"></script>
```

### Create a function that generates the table

Create a new function that will create a table in the footer area. Since we want to display our GeoJSON data in table form, let us first determine how the data needs to be formatted.

According to the documentation, the data must be in an array of objects. Here is a sample output from their documentation:

```js
    var clients = [
        { "Name": "Otto Clay", "Age": 25, "Country": 1, "Address": "Ap #897-1459 Quam Avenue", "Married": false },
        { "Name": "Connor Johnston", "Age": 45, "Country": 2, "Address": "Ap #370-4647 Dis Av.", "Married": true },
        { "Name": "Lacey Hess", "Age": 29, "Country": 3, "Address": "Ap #365-8835 Integer St.", "Married": false },
        { "Name": "Timothy Henson", "Age": 56, "Country": 1, "Address": "911-5143 Luctus Ave", "Married": true },
        { "Name": "Ramona Benton", "Age": 32, "Country": 3, "Address": "Ap #614-689 Vehicula Street", "Married": false }
    ];
```

In order to get our data to work, we have to put maniputlate our data so that it adhere's to the data format requirement for the table otuput. So what does our GeoJSON data look like? Recall that we put the data in a global variable `geojson_data`. Output the data in the browser console to inspect it.

<kbd><img src="images/geojson.png"></kbd>

The output suggests that we need to do some work before we can get it into the format that the table can read, that is, into an array of objects. The current output is an object `geojson_data` with an array `features` which has multiple objects in it, once of which is `properties`, which contains the data we need. I know, it's confusing! But once we figure the structure out, we can reconfigure the data for the table.

Let's write a function script to do so:

```js
function createTable(){
	// empty array for our data
	let datafortable = [];

	// loop through the data and add the properties object to the array
	geojson_data.features.forEach(function(item){
		datafortable.push(item.properties)
	})
	console.log(datafortable)
}
```
Ah! Now our data `datafortable` is in a format that the table can read: objects in an array!

<kbd><img src="images/array.png"></kbd>

We can then add the rest of the code to generate the table. Most importantly, we need to define the fields that we want to use (columns).

```js

function createTable(){

	// empty array for our data
	let datafortable = [];

	// loop through the data and add the properties object to the array
	geojson_data.features.forEach(function(item){
		datafortable.push(item.properties)
	})

	// array to define the fields: each object is a column
	let fields = [
		{ name: "Qualifying Name", type: "text"},
		{ name: '% Households: Less than $25,000', type: 'number'},
		{ name: '% Households: $100,000 or More', type: 'number'},
		{ name: 'Median Household Income (In 2019 Inflation Adjusted Dollars)', type: 'number'},
	]
 
	// create the table in our footer
	$(".footer").jsGrid({
		width: "100%",
		height: "400px",
		
		editing: true,
		sorting: true,
		paging: true,
		autoload: true,
 
		pageSize: 10,
		pageButtonCount: 5,
 
		data: datafortable,
		fields: fields,
		rowClick: function(args) { 
			console.log(args);
		},
	});
}
```

### Clickable rows

It gets even better. Notice the argument for `rowClick`, which triggers a function everytime a row on the table is clicked. Click on a row and inspect the console output. What would you want a row click to do? Zoom to its location? Display data for that county? Maybe both?

The decision, of course, is up to you. The function below simply takes a geoid (FIPS code) and zooms the map to its boundary. Make the following function, and add a call to it from the `rowClick` event.

```js
function zoomTo(geoid){

	let zoom2poly = geojson_layer.getLayers().filter(item => item.feature.properties.GEO_ID === geoid)

	map.fitBounds(zoom2poly[0].getBounds())

}
```