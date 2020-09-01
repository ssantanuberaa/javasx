import xButton from "../xButton/xButton.js";
import dom from "../../lib/xDOM.js";
function xLoadOnScroll(element){
	this.element = element;
	this.disable = false;
	this.buttonTrigger = element.getAttribute("button-trigger");
	this.button = null;
	let relative = element.getAttribute("relative");
	let offset = element.getAttribute("offset");
	if (relative == null) {
		relative = "window";
	}
	if (offset == null) {
		offset = 300;
	}else{
		offset = parseInt(offset);
	}
	if (this.buttonTrigger == null) {
		this.buttonTrigger = false;
	}else{
		this.buttonTrigger = true;
	}

	// DOM --
	element.classList.add("xLoadOnScroll");
		let statusContainer = document.createElement("div");
		statusContainer.classList.add("xLoadOnScrollStatus");
		element.appendChild(statusContainer);

	// Watching --
	if (this.buttonTrigger) {
		let button = dom.createXElement(xButton, {type : "xButton", 'theme' : "vidhikarya.default.blue.small", label: "Load More"});
		statusContainer.appendChild(button.element);
		button.onClick = function(){
			button.addLoading();
			this.load(button);
		}.bind(this);
		this.button = button;
	}else{
		let status = document.createElement("span");
		status.textContent = "Loading...";
		statusContainer.appendChild(status);

		// If the button loading is not active, then the default behaviour is scrolling --
		if (relative == "window") {
			window.addEventListener("scroll", function(event){
				let el = document.documentElement;
				let scrollDif = (el.scrollHeight - (el.scrollTop));
				if (scrollDif<offset && !this.disable) {
					this.show();
					this.load();
				}
			}.bind(this));
		}
	}

	this.setContent = function(node){
		element.insertBefore(node, element.firstChild);
	};
	this.load = function(button){};
	this.hide = function(){
		statusContainer.classList.remove("Active");
	};
	this.show = function(){
		statusContainer.classList.add("Active");
	};

	if (this.buttonTrigger) {
		// If the button trigger is active, it means user will click on the button to load more data... That's why we must show the container in order to show the button visible all the time.
		this.show();
	}

	return this;
}
export default xLoadOnScroll;