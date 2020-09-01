import dom from "../../lib/xDOM.js";
function xRadioButton(element){
	// Instance Properties ----------
	this.element = element;
	this.value = "";
	this.defaultValue = "";
	this.key = (new Date()).valueOf();

	let radioInput, label;

	// Instance Methods ---
	this.render = function(){
		element.classList.add("xRadioButton");

			let container = document.createElement("div");
			container.classList.add("md-radio");
			element.appendChild(container);
				radioInput = document.createElement("input");
				radioInput.setAttribute("key", this.key);
				radioInput.setAttribute("type", "radio");
				container.appendChild(radioInput);

				label = document.createElement("label");
				label.setAttribute("for", this.key);
				label.textContent = element.getAttribute("label");
				container.appendChild(label);

		container.addEventListener("click", function(event){
			if (this.value == false) {
				this.check();
			}else{
				this.uncheck();
			}
		}.bind(this));

		dom.emitSelf(this);
	};
	this.init = function(){
		this.render();
	};
	this.checkSilent = function(){
		this.value = true;
		radioInput.setAttribute("checked", "checked");
	};
	this.check = function(){
		this.checkSilent();
		this.emitValue(this);		
	};
	this.uncheck = function(){
		this.uncheckSilent();
		this.emitValue(this);
	};
	this.uncheckSilent = function(){
		this.value = false;
		radioInput.removeAttribute("checked");
	};
	this.toggle = function(){
		if (this.value == true) {
			this.uncheck();
		}else{
			this.check();
		}
	};
	this.emitValue = function(component){
		let data = {};
		data[component.element.getAttribute('name')] = component.value;
		component.element.dispatchEvent(new CustomEvent("value", {
			bubbles: true, 
			cancelable: false,
			detail : data
		}));
	};
	this.setLabel = function(element){
		if (element.nodeType == Node.ELEMENT_NODE) {
			label.appendChild(element);	
		}else if (typeof element == "string") {
			label.innerHTML = element;
		}
	};
	this.init();

	return this;
}
export default xRadioButton;