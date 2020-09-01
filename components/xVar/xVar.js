function xVar(element){
	this.element = element;
	this.element.classList.add("xVar");

	this.setValue = function(value){
		if (value == null || value == undefined || value == "") {
			element.innerHTML = "";
		}else if (typeof value == "string") {
			element.innerHTML = value;
		}else if (value.nodeType == Node.ELEMENT_NODE) {
			element.appendChild(value);
		}else if (typeof value == "number") {
			element.textContent = value;
		}
	};

	return this;
}
export default xVar;