import dom from "../../lib/xDOM.js";
import xIcon from "../xIcon/xIcon.js";
function xInputWrapper(element){
	this.element = element;
	let inputContainer, iconPrefixContainer, icon, fieldContainer, label, inputField, bar, infoSection, infoText, counterContainer;

	// Extracting Attributes --
	let attr = dom.extractAttributes(element, ['label', 'icon', 'expand-collapse-icon', 'required']);

	this.render = function(){
		element.classList.add("xInputWrapper");

			inputContainer = dom.createElement("div", {classNames : "xInputWrapperInputContainer"});
			element.appendChild(inputContainer);

				iconPrefixContainer = dom.createElement("div", {classNames : "xInputWrapperIconPrefixContainer"});
				inputContainer.appendChild(iconPrefixContainer);

					icon = dom.createXElement(xIcon, {type : "xIcon", icon : attr.icon});
					iconPrefixContainer.appendChild(icon.element);

				fieldContainer = dom.createElement("div", {classNames : "xInputWrapperFieldContainer"});
				inputContainer.appendChild(fieldContainer);

					label = dom.createElement("div", {classNames : "xInputWrapperLabel"});
					fieldContainer.appendChild(label);
						if(attr.label != "" && attr.label != undefined && attr.label != null){
							let labelNode = document.createElement("span");
							labelNode.textContent = attr.label;
							label.appendChild(labelNode);
						
							if(attr.required == true){
								let requiredNode = document.createElement("span");
								requiredNode.classList.add("xInputRequiredMark");
								requiredNode.textContent = "*";
								label.appendChild(requiredNode);
							}
						}

					inputField = dom.createElement("div", {classNames: "xInputWrapperInputField"});
					fieldContainer.appendChild(inputField);

				bar = dom.createElement("div", {classNames: "xInputWrapperInputBar"});
				inputContainer.appendChild(bar);

			infoSection = dom.createElement("div", {classNames : "xInputWrapperInfoSection"});
			element.appendChild(infoSection);
				infoText = dom.createElement("div", {classNames : "xInputWrapperInfoText"});
				infoSection.appendChild(infoText);

				counterContainer = dom.createElement("div", {classNames : "xInputWrapperCounterContainer"});
				infoSection.appendChild(counterContainer);
	};
	this.setInput = function(inputNode){
		inputField.appendChild(inputNode);
	};
	this.controlLabelPosition = function(forceRaised){
		let left = iconPrefixContainer.clientWidth;
		if (forceRaised) {
			label.classList.add("raised");
			label.style.left = "-" + left + "px";
		}else{
			label.classList.remove("raised");
			label.style.left = "0px";
		}
	};
	this.playBarAnimation = function(control){
		if (control == true) {
			bar.classList.add("active");	
		}else{
			bar.classList.remove("active");
		}
	};
	this.setCounter = function(first, second){
		if (second == undefined) {
			counterContainer.textContent = first;
		}else{
			counterContainer.textContent = first + "/" + second;
		}
	};
	this.removeCounter = function(){
		counterContainer.textContent = "";
	};
	this.setError = function(errorMessage){
		element.classList.add("error");
		infoText.classList.remove("help");
		infoText.classList.add("error");
		infoText.textContent = errorMessage;
	};
	this.removeError = function(){
		element.classList.remove("error");
		infoText.classList.remove("error");
		infoText.textContent = "";
	};
	this.setHelp = function(helpMessage){
		infoText.textContent = helpMessage;
		infoText.classList.remove("error");
		infoText.classList.add("help");
	};
	this.removeHelp = function(){
		infoText.classList.remove("help");
		infoText.textContent = "";
	};
	this.registerInput = function(component){
		let node = component.element;
		// Registering the element to the closest form element --
		if (node.closest("form") != null) {
			let form = node.closest("form");
			if (form.inputs == undefined) {
				form.inputs = {};
			}
			form.inputs[node.getAttribute("name")] = component;
		}

		// Firing InputInitialized --
		let data = {};
		data[node.getAttribute('name')] = component.value;
		node.dispatchEvent(new CustomEvent("inputinitialized", {
			bubbles : true,
			cancelable : false,
			detail : data
		}));
	};
	this.enable = function(){
		element.classList.remove("disabled");
	};
	this.disable = function(){
		element.classList.add("disabled");
	};
	this.focus = function(){
		if (attr['expand-collapse-icon'] == true) {
			inputContainer.classList.add("expand");
		}
	};
	this.blur = function(){
		if (attr['expand-collapse-icon'] == true) {
			inputContainer.classList.remove("expand");
		}
	};
	this.addLoading = function(){
		bar.classList.add("barAnimation");
	};
	this.removeLoading = function(){
		bar.classList.remove("barAnimation");
	};
	this.setPrefix = function(prefixNode){
		iconPrefixContainer.appendChild(prefixNode);
	};
	this.setSuffix = function(suffixNode){
		inputContainer.appendChild(suffixNode);
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
	this.validateData = function(data, validations){
		let hasError = false;
		let keys = Object.keys(validations);
		for(let i=0; i<keys.length; i++){
			let validationName = keys[i];
			if (validationName == "required") {
				if (data == "" || data == undefined || data == null) {
					hasError = true;
					this.setError(validations.required.message);
					return false;
				}
			}else if (validationName == "email") {
				const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				if (!pattern.test(data)){
					hasError = true;
					this.setError(validations.email.message);
				}
			}else if (validationName == "number") {
				let d = Number(data);
				if (isNaN(d) == true) {
					hasError = true;
					this.setError(validations.number.message);
				}
			}
		}
		if (hasError == true) {
			return false;
		}else{
			this.removeError();	
			return true;
		}
	};
	this.init = function(){
		this.render();
		if (attr['expand-collapse-icon'] == true) {
			element.classList.add("showExpand");
		}
		// Watching --
		label.addEventListener("click", function(event){
			this.focus();
			this.onLabelClick(event);
		}.bind(this));
	};
	this.onLabelClick = function(){};

	this.init();
	return this;
}
export default xInputWrapper;