import dom from "../../lib/xDOM.js";
function xTextArea(element){
	this.element = element;
	this.value = "";
	this.defaultValue = "";
	this.disabled = false;
	let icon = null;
	let maxChar = 0;
	let counter = null, counterMax = null, counterCount = null, required = false, validations = [];
	let preventOverflow = false;
	if (element.getAttribute("prevent-overflow") == "true") {
		preventOverflow = true;
	}else{
		preventOverflow = false;
	}
	if (element.getAttribute("required") != null) {
		required = true;
	}
	if (element.getAttribute("validations") != null) {
		let temp = element.getAttribute("validations").split(",");
		temp.forEach((val)=>{
			validations.push(val.trim());
		});
	}
	if (element.getAttribute("disabled") != null) {
		this.disabled = true;
	}


	// DOM --
	element.classList.add("xTextArea");
		let container = document.createElement("div");
		container.classList.add("xTextAreaGroup");
		element.appendChild(container);

			let bar = document.createElement("span");
			bar.classList.add("bar");
			container.appendChild(bar);

			let label = document.createElement("label");
			label.classList.add("xTextAreaLabel");
			container.appendChild(label);
				let labelNode = document.createElement("span");
				labelNode.textContent = element.getAttribute("label");
				label.appendChild(labelNode);

				if(element.getAttribute("required") != null){
					let requiredNode = document.createElement("span");
					requiredNode.classList.add("RequiredMark");
					requiredNode.textContent = "*";
					label.appendChild(requiredNode);
				}

			let error = document.createElement("div");
			error.classList.add("error");
			container.appendChild(error);
		
			let input = document.createElement("textarea");
			container.appendChild(input);
			
			icon = dom.createIcon(element);
			if (icon == null) {
				label.style.left = "0px";
			}else{
				label.style.left = "25px";
				input.style.paddingLeft = "25px";
				container.appendChild(icon);
			}
			// Icon --
			if (element.getAttribute("counter") != null) {
				maxChar = parseInt(element.getAttribute("counter"));
				counter = document.createElement("div");
				counter.classList.add("counter");
				counterMax = document.createElement("span");
				counterCount = document.createElement("span");
				let seperator = document.createElement("span");
				seperator.textContent = "/";
				counter.appendChild(counterCount);
				counter.appendChild(seperator);
				counter.appendChild(counterMax);
				counterMax.textContent = maxChar;
				counterCount.textContent = 0;
				
				container.appendChild(counter);
			}

	// Methods --
	let emitValue = function(value){
		let data = {};
		data[element.getAttribute('name')] = value;
		element.dispatchEvent(new CustomEvent("value", {
			bubbles: true, 
			cancelable: false,
			detail : data
		}));
	};
	let hideCounter = function(){
		if (counter != null) {
			counter.style.display = "none";	
		}		
	};
	let showCounter = function(){
		if (counter != null) {
			counter.style.display = "block";
		}
	};
	this.setError = function(errorMessage){
		error.textContent = errorMessage;
		this.element.classList.add("Error");
	};
	this.removeError = function(){
		error.textContent = "";
		this.element.classList.remove("Error");
	};
	this.setValue = function(value){
		if (value == undefined || value == null) {
		}else if (value == "") {
			input.value = value;
			controlLabelPosition(false);
			this.value = value
		}else{
			input.value = value;
			controlLabelPosition(true);
			this.value = value;
		}
		emitValue(this.value);
	};
	this.getValue = function(){
		return this.value;
	};
	this.enable = function(){
		this.disabled = false;
		this.element.classList.remove("Disabled");
	};
	this.disable = function(){
		this.disabled = true;
		this.element.classList.add("Disabled");
		this.removeError();
	};
	let controlLabelPosition = function(forceRaised){
		if (forceRaised) {
			label.classList.add("raised");
			label.style.top = "-18px";
			label.style.fontSize = "12px";
			label.style.left = "0px";
			label.style.bottom = "unset";
		}else{
			if (input.value == "" || input.value == undefined || input.value == null) {
				// Remove raised --
				label.style.top = "3px";
				label.style.fontSize = "17px";
				label.classList.remove("raised");
				if (icon == null) {
					label.style.left = "0px";
				}else{
					label.style.left = "25px";
				}
				label.style.bottom = "unset";
			}else{
				// Add raised --
				label.style.top = "-18px";
				label.style.fontSize = "12px";
				label.style.left = "0px";
				label.style.bottom = "unset";
				label.classList.add("raised");
			}
		}
	};
	this.validateData = function(value){
		let hasError = false;
		if (value == undefined) {
			value = this.value;
		}
		if (required == true && (value == "" || value == null)) {
			this.setError("This field is required");
			hasError = true;
		}else{
			if (value == "") {
				this.removeError();
				return true;
			}
			validations.forEach((validation)=>{
				if (validation == "email") {
					const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					if (!pattern.test(value)){
						hasError = true;
						this.setError("Invalid email provided !");
					}
				}
			});
		}
		if (hasError == false) {
			this.removeError();
			return true;
		}else{
			return false;
		}
	};

	// Watching --
	if (this.disabled) {
		this.disable();
	}
	input.addEventListener("focus", function(event){
		bar.classList.add("barActive");
		controlLabelPosition(true);
		if (counter != null) {
			showCounter();
		}
	}.bind(this));
	input.addEventListener("blur", function(event){
		bar.classList.remove("barActive");
		controlLabelPosition(false);
		if (counter != null) {
			hideCounter();
		}
		this.validateData();
	}.bind(this));
	input.addEventListener("input", function(event){
		if (event.target.value != null || event.target.value != undefined) {
			if(preventOverflow && input.value.length>maxChar){
				input.value = this.value;
				if (counter != null) {
					counterCount.textContent = event.target.value.length;	
				}				
			}else{
				if (input.value.length>maxChar) {
					this.value = event.target.value;
					if (counter != null) {
						counterCount.textContent = event.target.value.length;	
					}					
				}else{
					this.value = event.target.value;
					if (counter != null) {
						counterCount.textContent = event.target.value.length;
					}
				}
			}
			emitValue(this.value);
		}
		this.validateData();
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
export default xTextArea;