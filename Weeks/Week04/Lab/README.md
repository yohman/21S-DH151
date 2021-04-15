# Week 4 Lab

## Getting started

## Starter files

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

### Create a csv file

Create a `Week4/data` folder. Download and add the `dunitz.csv` file from [here](data/dunitz.csv).

### Create a `readCSV()` function

```js
let path = "data/dunitz.csv"

function readCSV(path){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			mapCSV(data);
		}
	});
}

Note that the path can lead to a local file via a relative path, or it can be a csv file hosted on the web, like on a github account. 
