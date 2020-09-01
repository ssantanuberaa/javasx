function xList(element){
	this.element = element;
	let currentListItem = null;
	let dataSet = [];
	let name = element.getAttribute("name");
	this.value = null;
	this.listItemFormatter = null;
	if (name == null) {name="value";}
	this.labelKey = element.getAttribute("label-key");
	if (this.labelKey == null) {
		this.labelKey = "label";
	}

	// DOM --
	element.classList.add("xListContainer");

	// Instance Methods --
	let emitValue = function(value){
		let data = {};
		data[name] = value;
		element.dispatchEvent(new CustomEvent("xlistitem", {
			bubbles: true, 
			cancelable: false,
			detail : data
		}));
	};
	this.onSelect = function(value){};
	this.setData = function(data, key){
		dataSet = data;
		if (key == undefined) {
			key = this.labelKey;
		}
		let listItem = null;
		element.innerHTML = "";
		currentListItem = null;
		if (typeof data[0] == "string") {
			data.forEach((item, index)=>{
				listItem = document.createElement("div");
				listItem.classList.add("xListItem");
				listItem.setAttribute("index", index);
				if (this.listItemFormatter == null) {
					listItem.textContent = item;
				}else{
					listItem.appendChild(this.listItemFormatter(item, index));
				}
				element.appendChild(listItem);
			});
		}else{
			data.forEach((item, index)=>{
				listItem = document.createElement("div");
				listItem.classList.add("xListItem");
				listItem.setAttribute("index", index);
				if (this.listItemFormatter == null) {
					listItem.textContent = item[key];
				}else{
					listItem.appendChild(this.listItemFormatter(item, index));
				}
				element.appendChild(listItem);
			});	
		}		
	};
	this.select = function(index){
		// If value is an index --
		if (index == null || index == undefined || index == "") {
			if (currentListItem != null) {
				currentListItem.classList.remove("xListCurrentItem");
				currentListItem = null;
				this.value = null;
				emitValue(this.value);
			}
		}else if(!isNaN(index)){
			index = parseInt(index);
			if (index > dataSet.length) {
				return false;
			}
			if (currentListItem != null) {
				currentListItem.classList.remove("xListCurrentItem");
			}
			currentListItem = element.children[index];
			currentListItem.classList.add("xListCurrentItem");
			this.value = dataSet[index];
			emitValue(this.value);
		}
	};
	this.setValue = function(value){
		if (value == "") {
			this.select(null);
		}else if (typeof value == "string") {
			if (currentListItem != null) {
				currentListItem.classList.remove("xListCurrentItem");
			}
			// Find the Item --
			let i = null;
			dataSet.forEach((item, index)=>{
				if (value == item[this.labelKey]) {
					i = index;
				}
			});
			currentListItem = element.children[i];
			currentListItem.classList.add("xListCurrentItem");
			this.value = dataSet[index];
			emitValue(this.value);
		}else{
			if (currentListItem != null) {
				currentListItem.classList.remove("xListCurrentItem");
			}
			let i = null;
			dataSet.forEach((item, index)=>{
				if (item == value) {
					i = index;
				}
			});
			currentListItem = element.children[i];
			currentListItem.classList.add("xListCurrentItem");
			this.value = value;
			emitValue(value);
		}
	};

	// Watching --
	element.addEventListener("click", function(event){
		if (event.target.closest(".xListItem")) {
			let listItem = event.target.closest(".xListItem");
			if (currentListItem != null) {
				currentListItem.classList.remove("xListCurrentItem");
			}
			currentListItem = listItem;
			listItem.classList.add("xListCurrentItem");
			this.value = dataSet[parseInt(listItem.getAttribute("index"))];
			emitValue(this.value);
			this.onSelect(this.value);
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
export default xList;