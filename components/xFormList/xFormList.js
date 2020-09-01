import dom from "../../lib/xDOM.js";
import xStaticList from "../xStaticList/xStaticList.js";
import xIcon from "../xIcon/xIcon.js";

function xFormList(element){
	this.element = element;
	this.dataSet = [];
	this.value = [];

	let formContainer;
	let list;
	let attr = dom.extractAttributes(element, ['required']);
	let infoContainer;


	this.render = function(){
		element.classList.add("xFormList");
			let headingContainer = document.createElement("div");
			headingContainer.classList.add("HeadingContainer");
			element.appendChild(headingContainer);
				let heading = document.createElement("div");
				heading.classList.add("xFormListHeading");
				heading.textContent = element.getAttribute("label");
				headingContainer.appendChild(heading);

				if(attr.required == true){
					let requiredMark = document.createElement("span");
					requiredMark.classList.add("xInputRequiredMark");
					requiredMark.textContent = "*";
					headingContainer.appendChild(requiredMark);
				}

			formContainer = document.createElement("div");
			formContainer.classList.add("xFormListFormContainer");
			element.appendChild(formContainer);

			infoContainer = document.createElement("div");
			infoContainer.classList.add("xFormListInfoContainer");
			element.appendChild(infoContainer);

			list = dom.createXElement(xStaticList, {
				"type" : "xStaticList",
			});
			this.refreshList();
			element.appendChild(list.element);

			let that = this;
			list.listItemFormatter = function(data, index){
				let container = document.createElement("div");
				container.classList.add("xFormListItem");
					let content = document.createElement("div");
					content.classList.add("xFormListItemContent");
					container.appendChild(content);
					content.appendChild(that.listItemFormatter(data, index));

					let icon = dom.createXElement(xIcon, {type: "xIcon", icon: "material-icon, delete"});
					container.appendChild(icon.element);
					icon.element.addEventListener("click", function(event){
						that.removeItem(index);
					});
				return container;
			};
	};
	this.listItemFormatter = function(data, index){
	};
	this.setData = function(data){
		this.dataSet = [];
		data.forEach(function(item, index){
			this.addItem(item);
		}.bind(this));
	}
	this.addItem = function(value){
		this.dataSet.unshift(value);
		this.refreshList();
	};
	this.refreshList = function(){
		this.value = this.dataSet;
		this.validateData();
		list.setData(this.dataSet);
		this.onValueChange(this.dataSet);
		this.emitValue(this);
	};
	this.removeItem = function(index){
		this.dataSet.splice(index, 1);
		this.refreshList();
	};
	this.setForm = function(){
		formContainer.innerHTML = "";
		formContainer.appendChild(this.formFormatter());
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
	this.emitValue = function(component){
		let data = {};
		data[component.element.getAttribute('name')] = component.value;
		component.element.dispatchEvent(new CustomEvent("value", {
			bubbles: true, 
			cancelable: false,
			detail : data
		}));
	};
	this.setError = function(message){
		infoContainer.classList.add("error");
		infoContainer.textContent = message;
		infoContainer.style.display = "block";
	};
	this.removeError = function(){
		infoContainer.classList.remove("error");
		infoContainer.style.display = "none";
	};
	this.validateData = function(){
		if(element.getAttribute("required") != null){
			if(this.value.length == 0){
				this.setError("Pleas add one or more entry !");
				return false;
			}else{
				this.removeError();
				return true;
			}
		}
		this.removeError();
		return true;
	};
	this.init = function(){
		this.render();
		this.removeError();
		this.registerInput(this);
	};
	this.onValueChange = function(dataSet){};

	this.init();
	return this;
}
export default xFormList;