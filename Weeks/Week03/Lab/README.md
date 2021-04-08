# Week 3 Lab

## Getting started

To begin, copy the maproom files you created from your Week 2 lab into a Week3 folder.

1. Open VSCode and make sure you have your `DH151` repository open
1. Create a `Week3` folder
1. Copy your `Week2/index.html` file and the `Week2/css` folder to your `Week3` folder
1. Open the `Week3/index.html` file


## Additional map functions
### Changing basemaps

### Changing markers

### Using circles

### Map events

## jQuery

### Add jQuery
What is [jQuery](https://jquery.com/)?
jQuery is a fast, small, and feature-rich JavaScript library. It makes things like HTML document traversal and manipulation, event handling, animation, and Ajax much simpler with an easy-to-use API that works across a multitude of browsers. With a combination of versatility and extensibility, jQuery has changed the way that millions of people write JavaScript.

Add jQuery using the CDN (link provided [here](https://code.jquery.com/)) to the `<head></head>` area of your `index.html` file.

```html
<!-- jquery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
```

### Selecting elements
jQuery makes it easy to select elements (like a `<div>`) and do *something* with it. Let's experiment using your browser's developer tools.
1. Open `Week3/index.html` in a chrome browser
1. Access the developer tools (ctrl/command+shift+i)

#### Selecting elements by class name

Our `index.html` file has elements with `class` attributes in them. A `class` is a way to identify an element in your website. You should have div's with the following `class` attributes:
- header
- sidebar
- content

Let's do some magic. Note that selecting a class element uses the dot `.` notation:

```js
$('.header').hide()
```
Wow! Now take a wild guess, and figure out how to bring the header back.

```js
$('.header').show()
```

Try these other fun ones:

```js
$('.header').fadeOut()
```
```js
$('.header').fadeIn()
```
You can also manipulate the content.
```js
$('.header').prepend('Hello!')
```
```js
$('.header').append('Goodbye!')
```
```js
$('.header').html("I'm a brand <b>new</b> header!")
```
Try these functions on the sidebar as well.

#### Selecting elements by id
Your `index.html` file has one div with an `id` attribute:
- map

Selecting an element by id uses a hashtag `#` notation:

```js
// fade out slowly, like 1000 milliseconds
$('#map').fadeOut(1000)
```
```js
// fade in slowly, like 2000 milliseconds
$('#map').fadeIn(2000)
```

> **NOTE**: Remember, `.` for classes, and `#` for ids. This notation is the same for stylesheet declarations, which we will cover later.

### Adding dynamic content to the sidebar

So how is all this useful for our maproom? While we learned how to add markers from an array of objects, we can use the same logic to add content to the sidebar.

If you were successful in your Week 2 lab, you should have a loop in your code that looks like this:

```js
// loop through data
data.forEach(function(item){
	// add marker to map
	L.marker([item.lat,item.lon]).addTo(map)
		.bindPopup(item.title)
})
```

You can use this same loop to add content to the sidebar:

```js
// loop through data
data.forEach(function(item){
	// add marker to map
	L.marker([item.lat,item.lon]).addTo(map)
		.bindPopup(item.title)

	// add data to sidebar
	$('.sidebar').append(item.title)
})
```
Notice how `.append` adds the title of each location to the sidebar, but it does not consider text spacing, new lines, or layout. 

Let's create a "card" like style for each item in the sidebar. To do so, wrap the content in a `<div></div>` container, adding a class attribute `class="sidebar-item"` so that we can style it later. Also notice how we are concatenating string values with variables (yes, it's getting complicated):

```js
// loop through data
data.forEach(function(item){
	// add marker to map
	L.marker([item.lat,item.lon]).addTo(map)
		.bindPopup(item.title)

	// add data to sidebar
	$('.sidebar').append('<div class="sidebar-item">'+item.title+'</div>')
})
```
Next, we need to create a css entry in our stylesheet to style our divs with class `sidebar-item`.

Add the following css in your `Week3/css/style.css` file:

```css
.sidebar-item {
    padding: 10px; /* adds inner padding */
    background: gainsboro; /* background color */
    border: 1px solid gray; /* border width, style, and color */
    margin: 5px; /* outer padding */
}
```
Refresh your page in your browser to see your new css style applied to the sidebar elements. Take some time to adjust the css components to match your site design and layout.

## Adding an ID key

In order to be able to easily identify each element in our data, we need to create a unique ID field.

Modify the data objects and add an `id` key with unique identifyers:

```js

// let's create some data
let data = [
	{
		'id': 0,
		'title':'Osaka',
		'lat': 34.6937,
		'lon': 135.5023,
		'image': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Osaka_Castle_02bs3200.jpg/320px-Osaka_Castle_02bs3200.jpg'
	},
	{
		'id': 1,
		'title':'Cali',
		'lat': 3.4516,
		'lon': -76.5320,
		'image': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Pascual_Guerrero_U-20WC_2011_CMR-NZL.JPG/320px-Pascual_Guerrero_U-20WC_2011_CMR-NZL.JPG'
	},
	etc...
]
```

Now we know that we can access different objects in our data array in the following way:

```js
// to get the lat/lon for the first location
data[0].lat
data[0].lon
```

## On click events

The HTML `onclick` attribute allows you to assign an action to an element (like a `<div>`). Take a look at the loop that generated the cards in the sidebar, and add the following onclick event to each `<div>` in the loop `onclick=alert("you clicked me!")`.

```js
// loop through data
data.forEach(function(item){
	// add marker to map
	L.marker([item.lat,item.lon]).addTo(map)
		.bindPopup(item.title)

	// add data to sidebar
	$('.sidebar').append('<div class="sidebar-item" onclick="alert(\"you clicked me!\")">'+item.title+'</div>')
})
```

## Flying around the world

Alerts are fun, but what we **really** want the map to do is to *fly* to each location that is clicked. Leaflet has a snazzy feature that allows you to fly to any latitude/longitude in the world.

Let's try it out. Open the developer's tools console, and type the following command:

```js
map.flyTo([0,0],12)
```
Try to fly to other places, like the north/south pole.

## Creating a function

Next, let's create a function that *flies to* a location in our data by feeding it an id value.

*If you need a refresher on javascript function, read [this section of the textbook](https://geobgu.xyz/web-mapping2/javascript-basics.html#functions).*

```js
// function to fly to a location by a given id number
function flyByID(id){
	map.flyTo([data[id].lat,data[id].lon],12)
}
```

Now we need to activate this function as on `onclick` event from the sidebar. To do so, add the event to the code that generates the div in the sidebar:

```js
// loop through data
data.forEach(function(item){
	// add marker to map
	L.marker([item.lat,item.lon]).addTo(map)
		.bindPopup(item.title)

	// add data to sidebar with onclick event
	$('.sidebar').append('<div class="sidebar-item" onclick="flyByID('+item.id+')">'+item.title+'</div>')
})
```

## Cleanup work

### Default to the extent of markers

### CSS cleanup

```css
.sidebar {
	grid-area: sidebar;
	padding:10px;
	background-color: #555;
	overflow: auto;
}
```

```css
.sidebar-item {
    padding: 10px; /* adds inner padding */
    background: gainsboro; /* background color of the card */
    border: 1px solid gray; /* border width and color */
    margin: 5px; /* outer padding */
	cursor: pointer; /* change cursor to hand on hover */
}
```