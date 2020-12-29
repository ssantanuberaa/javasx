# X
The smallest and fastest Flutter like component framework you will ever meet :-)

[![Known Vulnerabilities](https://snyk.io/test/npm/javasx/2.0.1/badge.svg)](https://snyk.io/test/npm/javasx/2.0.1)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![npm version](https://badge.fury.io/js/javasx.svg)](https://www.npmjs.com/package/javasx/v/2.0.5)

This framework is used to make scalable javascript component that can be shared easily throughout the entire application. This framework is built purely on Vanilla Javascript and does not use HTML. The HTML DOM is created using Javascript. So you must have basic understanding of Javascript and must know how to manipulate DOM using JS.

## Install
```javascript
npm i javasx
```

## Require In Project
```javascript
import x from 'javasx';
```

## Create a Component
```javascript
// Demo.js
import x from 'javasx';
export default x({
	name: "Demo", // Property name is optional
	render(){ 
		// Must define a render method which must returns a DOM element
		let element = document.createElement("div");
		element.textContent = "Hello World";
		return element;
	},
	mounted(){
		// mounted method runs after the render() method 
		// You can query any child element and do something here
		// For example you can call any method which are defined in the method section below
		this.show("Hello World");
	},
	methods: {
		// Create any number of methods you want and access them using *this* keyword
		show: function(txt){
			alert(txt);
		}
	}
});
```

## Use a Component
```javascript
import Demo from "Demo.js";

let demo = new Demo(); // Instantiate the component using *new* keyword.

// You can call any method which are defined in the component and perform specific task --
demo.show("Hi..."); // will show alert

// The following code is needed only once for whole application --
let rootNode = document.getElementById("root");
rootNode.appendChild(demo.element);
```
