import axios from "axios";
import dom from "../../lib/xDOM.js";
import obj from "../../lib/xObject.js";
import xDropDown from "../xDropDown/xDropDown.js";
import xStaticList from "../xStaticList/xStaticList.js";
import xTextBox from "../xTextBox/xTextBox.js";
function xAutoComplete(element){
	// Variables --
	let textbox, dropdown, list, attr, searchResults = [], searching = false;

	// Instance Properties --
	this.isCurrentValueFromDropDown = "";
	this.element = element;
	this.value = "";
	this.defaultValue = "";
	this.preSelectedNode = null;
	this.preSelectedIndex = -1;
	this.disabled = false;
	this.hidden = false;
	this.validation;

	// Instance Methods --
	this.onValueChange = function(value){};
	this.onNewSuggetion = function(searchString, searchResults){
		return searchResults;
	};
	this.listItemFormatter = function(item, index){};
	this.valueFormatter = function(item){};
	this.render = function(){
		attr = dom.extractAttributes(element, ['url', 'allow-all']);

		// DOM --
		element.classList.add("xAutoComplete");
			dropdown = dom.createXElement(xDropDown, {type : "xDropDown"});
			element.appendChild(dropdown.element);
				textbox = dom.createXElement(xTextBox, obj.mergeObject({type : "xTextBox"}, dom.extractAttributes(element, ['icon', 'label', 'required', 'help-text', 'format', "expand-collapse-icon", "autocomplete", "placeholder"])));
				list = dom.createXElement(xStaticList, {type : "xStaticList"});

				dropdown.setTrigger(textbox.element);
				dropdown.setContent(list.element);

		// Watching --
		let that = this;
		textbox.onInput = function(value){
			that.isCurrentValueFromDropDown = false;
			if (value == "") {
				// Value is empty, clear the selection in the list --
				list.select();
				that.value = value;
			}else if (value.length > 2) {
				// If allow-all is true, then it will update it's value --
				if (attr['allow-all'] == true) {
					that.value = value;
				}
				that.updateSuggetion(value);
			}
			that.onValueChange(that.value);
			textbox.wrapper.emitValue(that);
		};
		textbox.onKeyup = function(value, event){
			if (event.code == "ArrowDown") {
				that.preSelectNext();
			}else if(event.code == "ArrowUp"){
				that.preSelectPrev();
			}else if (event.code == "Enter") {
				if (that.preSelectedIndex != -1) {
					list.select(searchResults[that.preSelectedIndex]);
				}
			}else if (event.code == "Tab") {
			}
		};
		textbox.onBlur = function(){
			setTimeout(function(){
				dropdown.close();
			}, 200);
		};
		textbox.onFocus = function(){
			dropdown.open();
		};
		list.onSelect = function(item){
			if (item == null) {
				that.value = "";
				textbox.setValue("");
				that.isCurrentValueFromDropDown = false;
			}else{
				that.isCurrentValueFromDropDown = true;
				that.value = item;
				let formattedText = that.valueFormatter(that.value);
				if (formattedText == undefined) {
					textbox.setValue(item);
				}else{
					textbox.setValue(formattedText);
				}
				dropdown.close();
			}
			textbox.wrapper.emitValue(that);
			that.onValueChange(that.value);
		};

		dropdown.onOpen = function(){
			textbox.focus();
		};
		dropdown.onClose = function(){
			if (attr['allow-all'] == true) {
				if (that.isCurrentValueFromDropDown == true) {
					let formattedText = that.valueFormatter(that.value);
					if (formattedText == undefined) {
						textbox.setValue(that.value);
					}else{
						textbox.setValue(formattedText);
					}
				}else{
					textbox.setValue(that.value);
				}
			}else{
				if (that.isCurrentValueFromDropDown == false) {
					textbox.setValue("");
				}
			}
		};

		list.element.addEventListener("mousemove", function(event){
			if (event.target.closest(".xStaticListItem")) {
				let node = event.target.closest(".xStaticListItem");
				let index = parseInt(node.getAttribute("index"));
				that.preSelect(index);
			}
		});

		// Registering the Input --
		textbox.wrapper.registerInput(this);
	};
	this.updateSuggetion = function(text){
		// If the component is already searching for suggetion, then don't initiate another one, let the first one complete first, so ignore--
		if (searching == true) {
			return;
		}
		// If the url is not set, then it will get the data from the provided dataset --
		if (attr.url == "") {
			// Getting from its own dataset will be implemented in future --
			return;
		}
		// Search data from the server --
		searching = true;
		axios.post(attr.url, {'searchString' : text}).then(function(response){
			searching = false;
			this.updateList(this.onNewSuggetion(text, response.data));
		}.bind(this)).catch(function(error){
			searching = false;
		});
	};
	this.preSelect = function(preIndex){
		Array.prototype.forEach.call(list.element.children, function(listItem, index){
			listItem.classList.remove("preSelect");
			if (index == preIndex) {
				listItem.classList.add("preSelect");
				this.preSelectedNode = listItem;
				this.preSelectedIndex = index;
			}
		}.bind(this));
	};
	this.preSelectNext = function(){
		this.preSelectedIndex = this.preSelectedIndex + 1;
		if (this.preSelectedIndex == searchResults.length) {
			this.preSelectedIndex = 0;
		}
		this.preSelect(this.preSelectedIndex);
	};
	this.preSelectPrev = function(){
		this.preSelectedIndex = this.preSelectedIndex - 1;
		if (this.preSelectedIndex == -1) {
			this.preSelectedIndex = searchResults.length - 1;
		}
		this.preSelect(this.preSelectedIndex);
	};
	this.updateList = function(data){
		// Config list --
		list.listItemFormatter = this.listItemFormatter;
		searchResults = data;
		list.setData(data);
		if (data.length == 0) {
			this.preSelectedIndex = -1;
			this.preSelectedNode = null;
		}	
	};
	this.setValue = function(value){
		if (value == null) {
			value = "";
		}
		if (attr['allow-all'] == true) {
			this.isCurrentValueFromDropDown = false;
			if (value == "") {
				list.select();
			}else{
				this.value = value;
				textbox.setValue(value);
				textbox.wrapper.emitValue(this);
				this.onValueChange(this.value);
			}
		}
	};
	this.makeURL = function(){
		let origin = window.location.origin;
		if (attr.url[0] == "/") {
			attr.url = origin + attr.url;
		}else{
			attr.url = origin + "/" + attr.url;
		}
	};
	this.enable = function(){
		this.disabled = false;
		element.classList.remove("disabled");
		textbox.enable();
	};
	this.disable = function(){
		this.disabled = true;
		element.classList.add("disabled");
		textbox.disable();
	};
	this.hide = function(){
		this.hidden = true;
		element.classList.add("hidden");
	};
	this.show = function(){
		this.hidden = false;
		element.classList.remove("hidden");
	};
	this.init = function(){
		this.validation = dom.buildValidation(element);
		this.render();
		this.makeURL();
	};
	this.validateData = function(){
		return textbox.wrapper.validateData(this.value, this.validation);
	};
	this.setError = function(errorMessage){
		textbox.wrapper.setError(errorMessage);
	};
	this.removeError = function(){
		textbox.wrapper.removeError();
	}
	this.init();

	return this;
}
export default xAutoComplete;