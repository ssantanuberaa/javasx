import xInputWrapper from "../common/xInputWrapper.js";
import dom from "../../lib/xDOM.js";
function xTestBox(element){
	this.element = element;

	// DOM --
	element.classList.add("xTestBox");
		// TextBox --
		let input = document.createElement("input");
		input.setAttribute("type", "text");
		container.appendChild(input);

		// Input Wrapper --
		let wrapper = dom.createXElement(xInputWrapper, {type : "xInputWrapper"});
		wrapper.setInput(input);

	return this;
}
export default xTestBox;