import config from "../x.config.js";
function xDOM(){
	this.config = config;
	this.hide = function(component){
		component.element.style.display = "none";
	};
	this.hideElement = function(element){
		let style = window.getComputedStyle(element);
		let display = style.display;
		if (display == "" || display == null) {
			display = "block";
		}
		element.setAttribute("display", display);
		element.style.display = "none";
	};
	this.lazyLoading = function(){
		let images = document.querySelectorAll("img[data-src]");
		Array.prototype.forEach.call(images, function(image){
			image.setAttribute("src", image.getAttribute('data-src'));
		});
	};
	this.show = function(component){
		component.element.style.display = "block";
	};
	this.showElement = function(element){
		let display = element.getAttribute("display");
		element.style.display = display;
	};
	this.emitSelf = function(component){
		let data = {};
		let name = component.element.getAttribute("name");
		data[name] = component;
		component.element.dispatchEvent(new CustomEvent("xcomponent", {
			bubbles: true, 
			cancelable: false,
			detail : data
		}));
	};
	this.emit = function(name, data){
		
	};
	this.loadStyle = async function(element){
		let moduleName = element.getAttribute("type");
		let theme = element.getAttribute("theme");

		if (window['xStyles'] == undefined) {
			window['xStyles'] = new Set();
		}
		if (moduleName == null) {
			console.log("Cannot Recognize Module for the Element :");
			console.log(element);
			return;
		}

		// Style Name --
		let styleName = "";
		let fileName = "";
		let fileExtension = "";
		if (this.config.env == "production") {
			fileExtension = ".min.css";
		}else{
			fileExtension = ".css";
		}
		if (theme == undefined || theme == null) {
			styleName = this.config.basePath + "/css/themes/" + this.config.theme + "/" + moduleName + "/" + moduleName + ".default" + fileExtension + "?version=" + this.config.version;
			element.classList.add(this.config.theme);
			element.classList.add("default");
			fileName = moduleName + ".default" + fileExtension;
		}else{
			let themes = theme.split(".");
			themes.forEach((themeName)=>{
				element.classList.add(themeName);
			});
			
			if (themes.length==1) {
				fileName = moduleName+".default" + fileExtension;
				element.classList.add("default");
			}else{
				fileName = moduleName + "." + themes[1] + fileExtension;
			}
			styleName = this.config.basePath + "/css/themes/" + themes[0] + "/" + moduleName + "/" + fileName + "?version=" + this.config.version;
		}

		// Loading Style if Style doesn't exists --
		if (!window['xStyles'].has(fileName)) {
			this.addLink(styleName);
			window['xStyles'].add(fileName);
		}
	};
	this.applyTheme = function(node){
		let theme = node.getAttribute("theme");
		if (theme == undefined || theme == null) {
			node.classList.add("default");
		}else{
			let themes = theme.split(".");
			themes.forEach((themeName)=>{
				node.classList.add(themeName);
			});
		}
	};
	this.buildValidation = function(element){
		let validations = {};

		// Required --
		let required = element.getAttribute("required");
		if (required != null) {
			let requiredMessage = element.getAttribute("required-message") == null ? "This is a required field" : element.getAttribute("required-message");
			validations.required = {
				message : requiredMessage
			};
		}

		// Validations --
		let validationString = element.getAttribute("validations");
		if (validationString != null) {
			let validationObj = JSON.parse(validationString);
			Object.keys(validationObj).forEach((rule)=>{
				validations[rule] = validationObj[rule];
			});
		}

		return validations;
	};
	this.loadCSS = function(name){
		if(window["PageStyles"] == undefined) {
			window['PageStyles'] = new Set();
		}
		if (!window['PageStyles'].has(name)) {
			window['PageStyles'].add(name);

			name = "/css/themes/"+this.config.theme+"/pages/"+name+".css?version="+this.config.version;

			this.addLink(name);
		}
	};
	this.addLink = function(styleName){
		let link = document.createElement("link");
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");
		link.setAttribute("href", styleName);
		document.documentElement.appendChild(link); 
	};
	this.watch = function(element, eventName, callback){
		let name = element.getAttribute("name");
		if (name == null) {
			name = "value";
		}
		element.addEventListener(eventName, function(event){
			if (event.detail == null) {
				callback(null, event);	
			}else{
				callback(event.detail[name], event);
			}			
		});
	};
	this.createXElement = function(module, config){
		let element = document.createElement("div");
		if (config != undefined) {
			Object.keys(config).forEach((attribute)=>{
				if (attribute == "classNames") {
					config.classNames.split(" ").forEach((name)=>{
						if (name != "") {
							element.classList.add(name);
						}
					});
				}else{
					element.setAttribute(attribute, config[attribute]);
				}
			});
		}
		return new module(element);
	};
	this.createElement = function(elementName, config){
		let element = document.createElement(elementName);
		if (config != undefined) {
			Object.keys(config).forEach((attribute)=>{
				if (attribute == "classNames") {
					config.classNames.split(" ").forEach((name)=>{
						name != "" && element.classList.add(name);
					});
				}else{
					element.setAttribute(attribute, config[attribute]);
				}
			});
		}		
		return element;
	};
	this.createIcon = function(element){
		if (element.getAttribute("font-awesome-icon")) {
			let icon = document.createElement("i");
			icon.className = "fa xInputIcon " + element.getAttribute("font-awesome-icon");
			return icon;
		}else if (element.getAttribute("material-icon")) {
			let icon = document.createElement("i");
			icon.className = "xInputIcon material-icons";
			icon.textContent = element.getAttribute("material-icon");
			return icon;
		}else if (element.getAttribute("image-icon")) {

		}else if (element.getAttribute("image-icon") == null) {
			return null;
		}
	};
	this.extractAttributes = function(element, attributes){
		let attribute = {};
		attributes.forEach((item)=>{
			let attValue = element.getAttribute(item);
			if (attValue == null) {
			}else if (attValue == "true") {
				attribute[item] = true;
			}else if (attValue == "false") {
				attribute[item] = false;
			}else if(attValue == ""){
				// It's a boolean attribute --
				attribute[item] = true;
			}else{
				attribute[item] = attValue;
			}
		});
		return attribute;
	};
	this.mergeObject = function(obj1, obj2){
		let obj = {};
		Object.keys(obj1).forEach((key)=>{
			obj[key] = obj1[key];
		});
		Object.keys(obj2).forEach((key)=>{
			obj[key] = obj2[key];
		});
		return obj;
	};
}
let dom = new xDOM();
export default dom;