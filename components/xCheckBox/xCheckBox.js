function xCheckBox(element){
	this.element = element;
	this.value = false;
	this.defaultValue = false;
	let name = element.getAttribute("name");
	let key = element.getAttribute("key");
	if(key == null){
		key = new Date().valueOf() + name;
	}
	if (name == null) {name='value';}

	// DOM --
	element.classList.add("xCheckBoxContainer");
		let container = document.createElement("div");
		container.classList.add("xCheckBox");
		element.appendChild(container);
			let input = document.createElement("input");
			input.setAttribute("type", "checkbox");
			input.setAttribute("id", key);
			container.appendChild(input);

			let label = document.createElement("label");
			label.textContent = element.getAttribute("label");
			label.setAttribute("for", key);
			container.appendChild(label);

	// Instance Methods --
	this.onSelect = function(value){};
	let emitValue = function(newValue){
		let data = {};
		data[name] = newValue;
		element.dispatchEvent(new CustomEvent("value", {
			bubbles: true, 
			cancelable: false,
			detail : data
		}));
	};
	this.setValue = function(value){
		if (value == true) {
			input.classList.add("Checked");
			this.value = true;
		}else if (value == false || value == null || value == undefined) {
			input.classList.remove("Checked");
			this.value = false;
		}
		emitValue(this.value);
		this.onSelect(this.value);
	};
	this.getValue = function(){
		return this.value;
	};
	this.disable = function(){
		input.classList.add("Disabled");
	};
	this.enable = function(){
		input.classList.remove("Disabled");
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
		form.inputs[name] = this;
	}

	// Firing InputInitialized --
	let data = {};
	data[name] = this.value;
	element.dispatchEvent(new CustomEvent("inputinitialized", {
		bubbles : true,
		cancelable : false,
		detail : data
	}));

	return this;
}
export default xCheckBox;