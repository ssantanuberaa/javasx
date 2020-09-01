function xSwitch(element){
	this.element = element;
	let key = new Date().valueOf();
	this.value = false;
	this.defaultValue = false;

	// DOM --
	element.classList.add("xSwitchInputContainer");
		let container = document.createElement("div");
		container.classList.add("xSwitchInputWrapper");
		element.appendChild(container);
			let label = document.createElement("label");
			label.classList.add("xSwitchInputLabel");
			label.textContent = element.getAttribute("label");
			container.appendChild(label);

			let control = document.createElement("div");
			control.classList.add('xSwitchControl');
			container.appendChild(control);
				let input = document.createElement("input");
				input.classList.add("xSwitchCheckbox");
				input.setAttribute("type", "checkbox");
				input.setAttribute("id", key);
				control.appendChild(input);

				let controlLabel = document.createElement("label");
				controlLabel.classList.add("xSwitchLabel");
				control.appendChild(controlLabel);
				controlLabel.setAttribute("for", key);

	// Instance Methods --
	let emitValue = function(value){
		let data = {};
		data[element.getAttribute('name')] = value;
		element.dispatchEvent(new CustomEvent("value", {
			bubbles: true, 
			cancelable: false,
			detail : data
		}));
	};
	this.setValue = function(value){
		if (value === true || value == "on") {
			input.classList.add("Checked");
			this.value = true;
		}else if (value == "off" || value == false || value == null || value == undefined) {
			input.classList.remove("Checked");
			this.value = false;
		}
		emitValue(this.value);
	};
	this.getValue = function(){
		return this.value;
	};
	this.disable = function(){

	};
	this.enable = function(){

	};
	this.validateData = function(){
		return true;
	};

	// Watching --
	input.addEventListener("change", function(event){
		this.setValue(!this.value);
	}.bind(this));

	// Checking Attributes --
	if (element.getAttribute("checked") != null) {
		this.setValue(true);
	}else{
		this.setValue(false);
	}

	// Registering the element to the closest form element --
	if (element.closest("form")) {
		let form = element.closest("form");
		if (form.inputs == undefined) {
			form.inputs = {};
		}
		form.inputs[element.getAttribute("name")] = this;
	}

	// Firing InputInitialized --
	let data = {};
	data[element.getAttribute('name')] = this.value;
	element.dispatchEvent(new CustomEvent("inputinitialized", {
		bubbles : true,
		cancelable : false,
		detail : data
	}));

	return this;
}
export default xSwitch;