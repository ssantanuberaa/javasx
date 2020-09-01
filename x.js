import dom from "./lib/xDOM.js";
import listener from "./lib/xListener.js";
function X(){
	this.dom = dom;
	this.allComponentPromises = [];

	// Private Methods --
	let extractNode = function(element){
		let allNodes = [];
		if (element.getAttribute("type") == null) {
		}else if (element.getAttribute("type") == "xApp") {
			return allNodes;
		}else if (element.getAttribute("type").charAt(0) == "x") {
			allNodes.push(element);
		}
		Array.prototype.forEach.call(element.children, (item)=>{
			allNodes = allNodes.concat(extractNode(item));
		});
		return allNodes;
	};
	this.constructGlobalRef = function(){
		// Create ref --
		if (window.x == undefined){
			window.x = {};
		} 
		if(window.x.apps == undefined){
			window.x.apps = {};
		}
		if (window.x.store == undefined){
			window.x.store = {};
		}
		if (window.x.listener == undefined) {
			window.x.listener = listener;
		}
	};
	// Instance Variables --
	this.init = function(element, components, styles){

		this.constructGlobalRef();

		// Generating a Random key
		let key = element.getAttribute("name");
		if (key == null || key == undefined || key == "") {
			key = new Date().valueOf();
		}

		return new Promise(function(resolve, reject){
			// window[x][key]
			let s = window.x.apps[key] = {};

			if (element == null || element == undefined) {
				console.log("X : Node is not found !");
				resolve(s);
				return;
			}else{
				// Load the element --
			}
			// Extracting all nodes whose type starts with "x" --
			let allNodes = [];
			Array.prototype.forEach.call(element.children, (item)=>{
				allNodes = allNodes.concat(extractNode(item));
			});

			
			if (allNodes.length == 0) {
				resolve(s);
			}
			allNodes.forEach((node, index)=>{
				// Getting Information from the xElement --
				let type = node.getAttribute("type");
				let name = node.getAttribute("name");
				let theme = node.getAttribute("theme");
				if (name == null || name == undefined) {
					name = new Date().valueOf();
				}

				// Creating xComponent and Storing the reference within s --
				if (components[type] == undefined) {
					console.log("Import : " + type);
				}else{
					this.allComponentPromises.push(this.buildModule(components[type], node, s, name));
				}

				// Loading Style --
				if(styles == undefined || styles == null){
					dom.loadStyle(node);	
				}else{
					dom.applyTheme(node);
				}
			});
			Promise.all(this.allComponentPromises).then(function(){
				if(styles != undefined){
					this.bundleCss(key, styles);
				}
				resolve(s);
			}.bind(this));

		}.bind(this));
	};
	this.bundleCss = function(appName, styles){
		let styleString = "";
		Object.keys(styles).forEach(function(style, index){
			styleString = styleString + styles[style];
		});
		let styleEl = document.createElement("style");
		styleEl.setAttribute("type", "text/css");
		styleEl.setAttribute("id", appName);
		styleEl.textContent = styleString;
		document.head.appendChild(styleEl);
	};
	this.buildModule = function(module, node, s, name){
		return new Promise(function(resolve, reject){
			try{
				s[name] = new module(node);
			}catch(error){
				console.log("Error:");
				console.log(node);
				console.log(error);
			}
			resolve();
		});
	};
	this.processing = function(element){
		if (element == undefined) {
			document.documentElement.style.opacity = "0";
			document.documentElement.style.visiblity = "hidden";
			document.documentElement.style.display = "none";	
		}else{
			element.style.opacity = "0";
			element.style.visiblity = "hidden";
			element.style.display = "none";
		}		
	};
	this.processed = function(element){
		if (element == undefined) {
			document.documentElement.style.opacity = "1";
			document.documentElement.style.visiblity = "visible";
			document.documentElement.style.display = "block";
		}else{
			element.style.opacity = "1";
			element.style.visiblity = "visible";
			element.style.display = "block";
		}
		console.log("Processed");
	};
}
let x = new X();
export default x;