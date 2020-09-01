import system from "../../lib/xSystem.js";
function xForm(element){
	// Variables --
	this.element = element;
	this.formData = {};
	this.options = {};
	this.hasError = false;
	let that = this;

	// Methods --
	this.onFormDataChange = function(formData){};
	this.submitForm = function(formData, button){
		if (this.options.onSubmit == undefined) {
			return false;
		}
		// Validate Data --
		this.validateData();
		
		if (this.hasError == false) {
			button.addLoading();
			this.options.onSubmit(formData, button);
		}else{
			button.removeLoading();
		}
	};
	this.validateData = function(){
		this.hasError = false;
		Object.keys(element.inputs).forEach((inputKey)=>{
			if(element.inputs[inputKey].validateData() == false){
				this.hasError = true;
			}
		});
		return !this.hasError;
	};
	this.resetForm = function(){
		Object.keys(element.inputs).forEach((inputKey)=>{
			let input = element.inputs[inputKey];
			if (input.defaultValue == undefined) {
				system.log("Default value is not defined for : " + input.element.getAttribute("type"));
			}else{
				input.setValue(input.defaultValue);
			}
		});
	};
	this.init = function(options){
		this.options = options;
	};

	// Watching --
	element.addEventListener("inputinitialized", function(event){
		let value = event.detail;
		for(var key in value){
			this.formData[key] = value[key];
		}
	}.bind(this));
	element.addEventListener("value", function(event){
		let value = event.detail;
		for(var key in value){
			this.formData[key] = value[key];
		}
		this.onFormDataChange(this.formData);
	}.bind(this));	

	// Attach xButton --
	if (element.xButton == undefined) {
		element.addEventListener("attachxbutton", function(event){
			element.xButton = event.detail;
			element.xButton.onClick = function(event){
				that.submitForm(that.formData, element.xButton);
			};
		}.bind(this));
	}else{
		element.xButton.onClick = function(event){
			that.submitForm(that.formData, element.xButton);
		};
	}

	return this;
}
export default xForm;