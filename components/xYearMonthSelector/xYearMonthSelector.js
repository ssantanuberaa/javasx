import xInputWrapper from "../common/xInputWrapper.js";
import xDropDown from "../xDropDown/xDropDown.js";
import xStaticList from "../xStaticList/xStaticList.js";
import obj from "../../lib/xObject.js";
import dom from "../../lib/xDOM.js";
import datetime from "../../lib/xDateTime.js";

function xYearMonthSelector(element){
	this.element = element;
	this.wrapper = null;
	this.dropdown = null;
	this.validations = null;
	this.value = {
		year: 0,
		month: 0,
	};

	this.render = function(){
		let label = element.getAttribute("label");
		let attr = dom.extractAttributes(element, ['required']);

		element.classList.add("xYearMonthSelector");
			this.wrapper = dom.createXElement(xInputWrapper, {
				type: "xInputWrapper",
				"expand-collapse-icon": true,
				label: label,
				required: attr.required
			});
			element.appendChild(this.wrapper.element, {});

			this.dropdown = dom.createXElement(xDropDown, {
				type: "xDropDown"
			});
			this.dropdown.setTrigger(this.buildTriggerNode(this.value));

			this.dropdown.setContent(this.createContent());

			this.wrapper.setInput(this.dropdown.element);
		this.validations = dom.buildValidation(element);
		this.wrapper.registerInput(this);
	};
	this.validateData = function(){
		if(element.getAttribute("required") != null){
			if(this.value.year == 0 && this.value.month == 0){
				this.wrapper.setError("This field is required !");
				return false;
			}
		}
		this.wrapper.removeError();
		return true;
	};
	this.setError = function(errorMessage){
		this.wrapper.setError(errorMessage);
	};
	this.removeError = function(){
		this.wrapper.removeError();
	};
	this.buildTriggerNode = function(value, experienceText){
		if(value.year == 0 && value.month == 0){
			this.wrapper.controlLabelPosition(false);
			let el = document.createElement("div");
			el.classList.add("YearMonthBlankContainer");
			return el;
		}else{
			this.wrapper.controlLabelPosition(true);
			return this.triggerFormatter(value, experienceText);
		}
	};
	this.triggerFormatter = function(value, experienceText){
		let el = document.createElement("div");
		el.classList.add("YearMonthBlankContainer");
			let yearMonthInfo = document.createElement("div");
			let monthName;
			this.monthData.forEach(function(item, index){
				if(item.value == value.month){
					monthName = item.label;
				}
			})
			yearMonthInfo.textContent = monthName + ", " + value.year;
			el.appendChild(yearMonthInfo);

			let experienceTextNode = document.createElement("div");
			experienceTextNode.textContent = "Experience : " + experienceText;
			el.appendChild(experienceTextNode);
		return el;
	};
	this.updateValue = function(value){
		let experience, previewNode;

		if(value == ""){
			this.value = {
				year: 0,
				month: 0
			};
			previewNode = this.buildTriggerNode(this.value);
		}else{
			if(value.year != undefined){
				this.value.year = value.year;
			}else if(value.month != undefined){
				this.value.month = value.month;
			}
			experience = this.calculateDateExperience(this.value);
			previewNode = this.buildTriggerNode(this.value, experience);
		}
		
		this.dropdown.setTrigger(previewNode);
		this.validateData();
	};
	this.setValue = function(value){
		this.updateValue(value);
	};
	this.calculateDateExperience = function(value){
		let now = new Date();
		let nowYear = now.getFullYear();
		
		if(value.year == 0){
			value.year = nowYear;
		}

		let month = "";
		if(value.month == 0){
			month = 1;
		}else{
			month = value.month;
		}
		value.month = month;

		let experience = datetime.calculateExperience(value.year, value.month);
		return experience;
	};
	this.createContent = function(){
		let that = this;
		let content = document.createElement("div");
		content.classList.add("YearMonthContainer");
			let yearList = dom.createXElement(xStaticList, {
				type: "xStaticList",
			});

			let yearData = [];
			let i = 0;
			for(i = 1970; i <= 2020; i++){
				yearData.push({"label": i + "", "value": i});
			}
			yearList.setData(yearData, "label");
			content.appendChild(yearList.element);

			yearList.onSelect = function(item, index){
				that.updateValue({year: item.value});
			};

			let monthList = dom.createXElement(xStaticList, {
				type: "xStaticList",
			});
			this.monthData = [
				{"value": 1, "label": "January"},
				{"value": 2, "label": "February"},
				{"value": 3, "label": "March"},
				{"value": 4, "label": "April"},
				{"value": 5, "label": "May"},
				{"value": 6, "label": "June"},
				{"value": 7, "label": "July"},
				{"value": 8, "label": "August"},
				{"value": 9, "label": "September"},
				{"value": 10, "label": "October"},
				{"value": 11, "label": "November"},
				{"value": 12, "label": "December"},
			];
			monthList.setData(this.monthData, "label");
			content.appendChild(monthList.element);
			monthList.onSelect = function(item, index){
				that.updateValue({month: item.value});
			}

		return content;
	};
	this.init = function(){
		this.render();
	};

	this.init();
	return this;
}
export default xYearMonthSelector;