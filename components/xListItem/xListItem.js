import dom from "../../lib/xDOM.js";
function xListItem(element){
	this.element = element;

	// DOM --
	element.classList.add("xListItem");
		let icon = dom.createIcon(element);
		if (icon) {
			element.appendChild(icon);
		}

		let label = dom.createElement("div", {classNames : "xListItemLabel"});
		label.textContent = element.getAttribute("label");
		element.appendChild(label);

	return this;
}
export default xListItem;