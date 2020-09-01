import dom from "../../lib/xDOM.js";
import obj from "../../lib/xObject.js";
import xIcon from "../xIcon/xIcon.js";
import xDropDown from "../xDropDown/xDropDown.js";
import xStaticList from "../xStaticList/xStaticList.js";
import xCheckBox from "../xCheckBox/xCheckBox.js";
import xInputWrapper from "../common/xInputWrapper.js";
function xSelect(element){
	this.element = element;
	this.value = "";
	this.dataSet = [];
	this.validations = dom.buildValidation(element);
	this.isLoading = false;
	this.defaultValue = "";
	this.labelKey = "";
	this.selectionType = "";
	this.values = [];

	let dropDown, list, wrapper, select, icon = null;
	let disabled = element.getAttribute("disabled"), helpText = element.getAttribute("help-text");
	disabled = disabled == null ? false : true;
	
	// Methods --
	this.onValueChange = function(value){};
	this.render = function(){
		// DOM --
		element.classList.add("xSelect");
			dropDown = dom.createXElement(xDropDown, {type : "xDropDown"});
			element.appendChild(dropDown.element);
				wrapper = dom.createXElement(xInputWrapper, obj.mergeObject({type : "xInputWrapper", "expand-collapse-icon" : true}, dom.extractAttributes(element, ['icon', 'label', 'required', 'help-text'])));
					select = document.createElement("div");
					select.classList.add("xSelectInput");
					wrapper.setInput(select);

				list = dom.createXElement(xStaticList, {type: "xStaticList"});

			dropDown.setTrigger(wrapper.element);
			dropDown.setContent(list.element);

		// When User selects an Item on the list --
		let that = this;
		list.onSelect = function(value){
			if (that.selectionType == "single") {
				that.close();
				if (value == null) {
					that.value = that.defaultValue;
					wrapper.controlLabelPosition(false);
				}else{
					that.value = value;
					wrapper.controlLabelPosition(true);
				}
				that.renderPreview(value);
				wrapper.emitValue(that);
				that.onValueChange(that.value);
			}
		};

		// If disabled attribute is present, disabled the component --
		if (disabled) {this.disable()}

		// When the dropdown is opened you want to change the expand icon to collapse icon, and vice versa
		dropDown.onOpen = function(){
			wrapper.focus();
		};
		dropDown.onClose = function(){
			wrapper.blur();
		};

		// Register the element --
		wrapper.registerInput(this);
	};
	this.updateMultipleValues = function(){
		if (this.values.length == 0) {
			wrapper.controlLabelPosition(false);
		}else{
			wrapper.controlLabelPosition(true);
		}
		this.renderPreview(this.values);
		this.validateData();
		this.value = this.values;
		wrapper.emitValue(this);
		this.onValueChange(this.values);
	};
	this.renderPreview = function(data){
		if(this.selectionType == "single"){
			this.renderPreviewFormatter(data);
		}else{
			this.renderMultiplePreviewFormatter(data);
		}
	};
	this.renderMultiplePreviewFormatter = function(data){
		select.innerHTML = "";
		let el = document.createElement("div");
		el.classList.add("MultipleValuesContainer");
		data.forEach(function(item, index){			
			let itemBox = document.createElement("div");
			itemBox.textContent = item[this.labelKey];
			el.appendChild(itemBox);
		}.bind(this));
		select.appendChild(el);
	};
	this.renderPreviewFormatter = function(selectedItem){
		if (selectedItem == "" || selectedItem == null) {
			select.textContent = "";
		}else if (typeof this.dataSet[0] == "string") {
			select.textContent = selectedItem;
		}else if (typeof this.dataSet[0] == "object"){
			select.textContent = selectedItem[this.labelKey];
		}
	};
	this.setData = function(data, labelKey){
		if (labelKey == undefined) {
			this.labelKey = "label";
		}else{
			this.labelKey = labelKey;
		}
		this.dataSet = data;
		if(this.selectionType == "single"){
			list.setData(data, this.labelKey);	
		}else{
			let keyIndex = 0;
			let that = this;
			let name = element.getAttribute("name");
			let key = keyIndex + name;

			list.listItemFormatter = function(item, index){
				let el = document.createElement("div");
				let label = item[this.labelKey];
				el.classList.add("MultipleListItem");
					let checkbox = dom.createXElement(xCheckBox, {
						'type': "xCheckBox",
						'label': label,
						'key': key+keyIndex,
						'classNames': "small",
					});
					el.appendChild(checkbox.element);

				checkbox.onSelect = function(value){
					if(value == true){
						// Add item --
						that.values.push(item);
						that.updateMultipleValues();
					}else{
						// remove Item --
						let i = 0;
						for(i = 0; i< that.values.length; i++){
							if(that.values[i].id == item.id){
								that.values.splice(i, 1);
								break;
							}
						}
						that.updateMultipleValues();
					}
				};
				keyIndex++;
				return el;
			};
			list.setData(data, this.labelKey);
		}
		
	};
	this.close = function(){
		dropDown.close();
	};
	this.addLoading = function(){
		this.isLoading = true;
		wrapper.addLoading();
	};
	this.removeLoading = function(){
		this.isLoading = false;
		wrapper.removeLoading();
	};
	this.disable = function(){
		wrapper.disable();
		dropDown.disable();
		this.element.classList.add("disabled");
	};
	this.enable = function(){
		wrapper.enable();
		dropDown.enable();
		this.element.classList.remove("disabled");
	};
	this.setError = function(errorMessage){
		wrapper.setError(errorMessage);
	};
	this.removeError = function(){
		wrapper.removeError();
	};
	this.setHelp = function(helpText){
		wrapper.setHelp(helpText);
	};
	this.removeHelp = function(){
		wrapper.removeHelp();
	};
	this.setPrefix = function(prefixNode){
		wrapper.setPrefix(prefixNode);
	};
	this.setSuffix = function(suffixNode){
		wrapper.setSuffix(suffixNode);
	};
	this.setValue = function(value){
		list.select(value);
	};
	this.validateData = function(){
		if(this.selectionType == "single"){
			if(this.value == undefined || this.value == null || this.value == ""){
				this.setError("This field is required");
				return false;
			}else{
				this.removeError();
				return true;
			}
		}else{
			if(element.getAttribute("required") != null){
				if(this.values.length == 0){
					this.setError("This field is required");
					return false;
				}else{
					this.removeError();
					return true;
				}
			}
			this.removeError();
			return true;
		}
	};
	this.focus = function(){
		dropDown.open();
		wrapper.focus();
	};
	this.init = function(){
		if(element.getAttribute("selection-type") == "multiple"){
			this.selectionType = "multiple";
			element.classList.add("multiple");
		}else{
			element.classList.add("single");
			this.selectionType = "single";
		}
		this.render();
	};
	this.init();

	return this;
}
export default xSelect;