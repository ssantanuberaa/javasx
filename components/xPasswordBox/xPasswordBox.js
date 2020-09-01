import dom from "../../lib/xDOM.js";
import obj from "../../lib/xObject.js";
import xTextBox from "../xTextBox/xTextBox.js";
import xIcon from "../xIcon/xIcon.js";
function xPasswordBox(element){
	this.element = element;
	this.textVisibile = false;
	this.value = "";
	this.defaultValue = "";
	this.validations;

	let textbox, passwordVisibility;

	this.render = function(){
		element.classList.add("xPasswordBox");
		
		textbox = dom.createXElement(xTextBox, obj.mergeObject({type : "xTextBox", icon : "material-icon,lock"}, dom.extractAttributes(element, ['label', 'help-text', 'required'])));

		passwordVisibility = dom.createXElement(xIcon, {type : "xIcon", icon : "material-icon,visibility"});
		textbox.setSuffix(passwordVisibility.element);

		element.appendChild(textbox.element);

		// Add Event Listener --
		let that = this;
		passwordVisibility.element.addEventListener("click", function(event){
			if (this.textVisibile == true) {
				this.hideText();
			}else{
				this.showText();
			}
		}.bind(this));
		textbox.onValueChange = function(value){
			that.value = value;
			textbox.wrapper.emitValue(that);
		};
	};
	this.setError = function(errorMessage){
		textbox.setError(errorMessage);
	};
	this.removeError = function(){
		textbox.removeError();
	};
	this.showText = function(){
		textbox.input.setAttribute("type", "text");
		passwordVisibility.changeIcon("material-icon,visibility_off");
		this.textVisibile = true;
	};
	this.hideText = function(){
		textbox.input.setAttribute("type", "password");
		passwordVisibility.changeIcon("material-icon,visibility");
		this.textVisibile = false;
	};
	this.validateData = function(){
		return textbox.wrapper.validateData(this.value, this.validations);
	};
	this.init = function(){
		this.render();
		this.hideText();
		this.validations = dom.buildValidation(element);
		textbox.wrapper.registerInput(this);
	};
	this.init();
	return this;
}
export default xPasswordBox;