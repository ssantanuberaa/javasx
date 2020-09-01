function xOptions(element){
	// Validation --
	if (element.getAttribute("type") != "xOptions" || element.getAttribute("name") == null) {
		return false;
	}

	// Variables --
	this.element = element;
	this.value = null;
	this.dataSet = [];
	this.defaultValue = {};
	let selectedOption = null;


	// DOM --	
	element.classList.add("xOptions");

		let labelContainer = document.createElement("div");
		labelContainer.classList.add("xOptionsLabelContainer");
		element.appendChild(labelContainer);
			let label = document.createElement("label");
			label.classList.add("OptionsLabel");
			label.textContent = element.getAttribute("label");
			labelContainer.appendChild(label);
				if(element.getAttribute("required") != null){
					let requiredEl = document.createElement("span");
					requiredEl.classList.add("xOptionsRequired")
					requiredEl.textContent = "*";
					labelContainer.appendChild(requiredEl);
				}

		let optionContainer = document.createElement("div");
		optionContainer.classList.add("OptionContainer");
		element.appendChild(optionContainer);

		let error = document.createElement("div");
		error.classList.add("error");
		element.appendChild(error);
	
	// Instance Methods --
	let emitValue = function(value){
		let data = {};
		data[element.getAttribute("name")] = value;
		element.dispatchEvent(new CustomEvent("value", {
			bubbles : true,
			cancelable: false,
			detail : data
		}));
	};
	this.refreshData = function(data){
		this.dataSet = data;
		data.forEach((item, index)=>{
			let node = document.createElement("div");
			node.classList.add("EachOption");
			node.setAttribute("index", index);
			node.textContent = item.title;
			optionContainer.appendChild(node);
		});
	};
	this.setError = function(errorMessage){
		error.textContent = errorMessage;
	};
	this.removeError = function(){
		error.textContent = "";
		label.style.color = "#4a4a4a";
	};
	this.setValue = function(value){
		if (value == null || value == "") {
			if (selectedOption != null) {
				selectedOption.classList.remove("SelectedOption");
			}
			selectedOption = null;
			this.value = this.defaultValue;
		}else if (typeof value == "string"){
			this.dataSet.forEach((item, index)=>{
				if (item.title == value) {
					if (selectedOption != null) {
						selectedOption.classList.remove("SelectedOption");
					}
					selectedOption = optionContainer.children[index];
					selectedOption.classList.add("SelectedOption");
					this.value = item;
				}
			});
		}else if (typeof value == "object") {
			this.dataSet.forEach((item)=>{
				if (item == value) {
					this.value = value;
				}
			});
		}
		emitValue(this.value);
		this.validateData();
	};
	this.validateData = function(){
		if (this.value == null || this.value == undefined || this.value == "") {
			if (element.getAttribute("required") != null) {
				this.setError("This field is requried !");
				return false;
			}
		}
		this.removeError();
		return true;
	};

	// Watching --
	optionContainer.addEventListener("click", function(event){
		if (event.target.parentNode == optionContainer) {
			if (selectedOption != null) {
				selectedOption.classList.remove("SelectedOption");
			}
			selectedOption = event.target;
			selectedOption.classList.add("SelectedOption");
			this.value = this.dataSet[parseInt(selectedOption.getAttribute("index"))];
			emitValue(this.value);
			this.validateData();
		}		
	}.bind(this));

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
export default xOptions;