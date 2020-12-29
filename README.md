# X
The smallest and fastest Flutter like component framework you will ever meet :-)

This framework is used to make scalable javascript component that can be shared easily throughout the entire application. This framework is built purely on Native Javascript and does not use HTML. The HTML DOM is created using Javascript. So you must have basic understanding of Javascript and must know how to manipulate DOM using JS.

## Install
```javascript
npm i javasx
```

## Require In Project
```javascript
import x from 'javasx';
```

## Example: Create a Component
```javascript
import x from 'javasx';
export default x({
	name: "Text", // Property name is optional
	render(){ 
		// Must define a render method which must returns a DOM element
		let element = document.createElement("div");
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