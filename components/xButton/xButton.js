import dom from "../../lib/xDOM.js";
import xIcon from "../xIcon/xIcon.js";
function xButton(element){
	this.element = element;
	let icon = null, buttonText = null, buttonContent;

	// DOM --
	element.classList.add("xButton");
		buttonContent = element.innerHTML;

		let button = document.createElement("button");
		button.setAttribute("type", "button");
		button.classList.add("xButtonElement");
		element.appendChild(button);

		// Icon for button --
		if (element.getAttribute("icon")) {
			icon = dom.createXElement(xIcon, {type: "xIcon", icon : element.getAttribute("icon")});
			button.appendChild(icon.element);
		}

		// Button text --
		if (element.getAttribute("label")) {
			buttonText = document.createElement("span");
			buttonText.textContent = element.getAttribute("label");
			button.appendChild(buttonText);
		}

		let loading = document.createElement("div");
		loading.classList.add("xButtonLoader");

	this.onClick = function(event){};
	this.addLoading = function(){
		this.disable();
		button.innerHTML = "";
		button.appendChild(loading);
	};
	this.disable = function(){
		button.setAttribute("disabled", "disabled");
	};
	this.enable = function(){
		button.removeAttribute("disabled");
	};
	this.setLabel = function(label){
		buttonText.textContent = label;
	};
	this.removeLoading = function(){
		this.enable();
		button.innerHTML = "";
		if(icon != null || buttonText != null){
			if (icon != null) {
				button.appendChild(icon.element);	
			}
			if (buttonText != null) {
				button.appendChild(buttonText);	
			}
		}else{
			button.appendChild(buttonContent);
		}
	};

	// If it is used for xForm, then the following code will execute --
	if (element.getAttribute("submit") != null) {
		// Registering the element to the closest form element --
		if (element.closest("form")) {
			let form = element.closest("form");
			form.xButton = this;
		}

		element.dispatchEvent(new CustomEvent("attachxbutton", {
			detail : this,
			bubbles : true,
			cancelable: false,
		}));
	}

	// Watching --
	dom.watch(button, "click", function(event){
		this.onClick(event);
	}.bind(this));

	return this;
}
export default xButton;