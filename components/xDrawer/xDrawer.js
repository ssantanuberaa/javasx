import dom from "../../lib/xDOM.js";
function xDrawer(element){
	// Variables --
	this.element = element;
	this.active = false;

	// DOM --	
	element.classList.add("xDrawer");
		let drawerOverlay = document.createElement("div");
		drawerOverlay.classList.add("xDrawerOverlay");

		let drawer = dom.createElement("div", {classNames : "xDrawerContent"});
		while(element.children.length){
			drawer.appendChild(element.firstElementChild);
		}
		element.appendChild(drawerOverlay);
		element.appendChild(drawer);

	// Option -> position
	if (element.getAttribute("position") == "right") {
		element.classList.add("drawerRight");
	}else{
		element.classList.add("drawerLeft");
	}

	// ----
	let drawerClose = element.querySelector("[close]");
	if (drawerClose != null) {
		drawerClose.addEventListener("click", function(event){
			this.close();
		}.bind(this));
	}

	// Instance Methods --
	this.open = function(){
		let behaviour = element.getAttribute("behaviour");
		let position = element.getAttribute("position");
		element.style.display = "block";

		if (behaviour == "dock") {
			if (screen.width>600) {
				if (position == "right") {
					document.documentElement.style.paddingRight = element.style.width = drawer.clientWidth+"px";
				}else{
					document.documentElement.style.paddingLeft = element.style.width = drawer.clientWidth+"px";
				}
			}
		}

		this.active = true;
	};
	this.close = function(){
		let behaviour = element.getAttribute("behaviour");
		let position = element.getAttribute("position");
		element.style.display = "none";

		if (behaviour == "dock") {
			if (screen.width>600) {
				if (position == "right") {
					document.documentElement.style.paddingRight = "0px";
				}else{
					document.documentElement.style.paddingLeft = "0px";
				}
			}
		}
		this.active = false;
	};
	this.toggle = function(){
		if (this.active) {
			this.close();
		}else{
			this.open();
		}
	};

	// Watching --
	drawerOverlay.addEventListener("click", function(event){
		this.close();
	}.bind(this));

	return this;
}
export default xDrawer;