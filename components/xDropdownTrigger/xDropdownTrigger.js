import dom from "../../lib/xDOM.js";
function xDropdownTrigger(element){
	this.element = element;

	// DOM --
	element.classList.add("xDropdownTrigger");

		let icon = dom.createIcon(element);
		if (icon) {
			element.appendChild(icon);
		}

		let label = document.createElement("label");
		label.textContent = document.getAttribute("label");
		element.appendChild(label);

	this.openState = function(){

	};
	this.closeState = function(){};

	return this;
}
export default xDropdownTrigger;