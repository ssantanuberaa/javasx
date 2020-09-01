import dom from "../../lib/xDOM.js";
import system from "../../lib/xSystem.js";
function xFloatButton(element){
	this.element = element;

	// DOM --
	element.classList.add("xFloatButtonContainer");
		let button = document.createElement("button");
		button.classList.add("xFloatButton");
		button.setAttribute("type", "button");
		element.appendChild(button);
			let icon = document.createElement("i");
			icon.classList.add("fa");
			icon.classList.add("fa-plus");
			button.appendChild(icon);
	// Instance Methods --
	this.onClick = function(){
		system.log("Override the method : onClick");
	};

	// Watching --
	element.addEventListener("click", function(event){
		this.onClick(event);
	}.bind(this));

	return this;
}
export default xFloatButton;