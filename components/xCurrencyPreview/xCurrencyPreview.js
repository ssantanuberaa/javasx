import dom from "../../lib/xDOM.js";
import xIcon from "../xIcon/xIcon.js";
function xCurrencyPreview(element){
	this.element = element;

	let label = "";

	// Instance Methods --
	this.render = function(){
		element.classList.add("xCurrencyPreview");
			let icon = dom.createXElement(xIcon, {type : "xIcon", icon : "font-awesome-icon,fa-inr"})
			element.appendChild(icon.element);

			label = document.createElement("div");
			label.classList.add("xCurrencyPreviewValue");
			element.appendChild(label);

			let prefix = document.createElement("div");
			prefix.classList.add("xCurrencyPreviewPrefix");
			prefix.textContent = " /-";
			element.appendChild(prefix);
	};
	this.init = function(){
		this.render();
	};
	this.setValue = function(amount){
		label.textContent = amount;
	};
	this.init();
}
export default xCurrencyPreview;