import dom from "../../lib/xDOM.js";
import xButton from "../xButton/xButton.js";
function xSubmit(element){
	this.element = element;
	this.submit = null;

	// DOM --
	element.classList.add("xSubmitContainer");
		this.submit = dom.createXElement(xButton, dom.mergeObject({type: "xButton"}, dom.extractAttributes(element, ["icon", "position", "label", "theme"])));
		element.appendChild(this.submit.element);

	this.addLoading = function(){
		this.submit.addLoading();
	};
	this.removeLoading = function(){
		this.submit.removeLoading();
	};
	this.onClick = function(event){};

	// Watching --
	let that = this;
	this.submit.onClick = function(event){
		that.onClick(event);
	};

	// Registering the element to the closest form element --
	if (element.closest("form")) {
		let form = element.closest("form");
		form.xSubmit = this;
	}

	element.dispatchEvent(new CustomEvent("xbuttoninitialized", {
		detail : this,
		bubbles : true,
		cancelable: false,
	}));

	return this;
}
export default xSubmit;