import obj from "../../lib/xObject.js";
function xStaticList(element){
	this.element = element;
	this.dataSet = [];
	this.selectedNode = null;
	this.labelKey = "";

	// DOM --
	element.classList.add("xStaticList");

	this.onSelect = function(data, index){};
	this.listItemFormatter = function(item, index){
		let el = document.createElement("div");
		if (typeof item == "string" || typeof item == "number") {
			el.textContent = item;
		}else if (typeof item == "object") {
			if (this.labelKey == "") {
				el.textContent = item["label"];
			}else{
				el.textContent = item[this.labelKey];	
			}		
		}
		return el;
	};
	this.createListItem = function(item, index){
		let listItem = document.createElement("div");
		listItem.classList.add("xStaticListItem");
		listItem.setAttribute("index", index);
		listItem.appendChild(this.listItemFormatter(item, index));
		return listItem;
	};
	this.render = function(){
		element.innerHTML = "";
		if (this.dataSet.forEach == undefined) {
			Array.prototype.forEach.call(this.dataSet, function(item, index){
				element.appendChild(this.createListItem(item, index));
			}.bind(this));
		}else{
			this.dataSet.forEach((item, index)=>{
				element.appendChild(this.createListItem(item, index));
			});
		}
	};
	this.push = function(item){
		element.appendChild(this.createListItem(item, this.dataSet.length));
		this.dataSet.push(item);
	};
	this.unshift = function(item){
		this.dataSet.unshift(item);
		Array.prototype.forEach.call(element.children, function(listItem){
			listItem.setAttribute("index", (parseInt(listItem.getAttribute("index")) + 1) );
		});
		element.insertBefore(this.createListItem(item, 0), element.firstElementChild);
	};
	this.removeAll = function(){
		element.innerHTML = "";
		this.dataSet = [];
	};
	this.update = function(newItem){
		// Updating the dataset first --
		let itemIndex = -1;
		for(let i=0; i<this.dataSet.length; i++){
			let oldItem = this.dataSet[i];
			if (oldItem == newItem) {
				itemIndex = i;
				obj.replaceItem(this.dataSet, oldItem, newItem);
				break;
			}
		}
		// Updating the DOM --
		if (itemIndex != -1) {
			let itemNode = element.querySelector("[index='"+ itemIndex +"']");
			if (itemNode != null) {
				if (itemNode.nextElementChild == null) {
					itemNode.outerHTML = "";
					element.appendChild(this.createListItem(newItem, itemIndex));
				}else{
					let nextNode = itemNode.nextElementChild;
					itemNode.outerHTML = "";
					element.insertBefore(this.createListItem(newItem, itemIndex), nextNode);
				}	
			}
		}
	};
	this.updateById = function(itemData){
		let index = -1;
		for(let i=0; i<this.dataSet.length; i++){
			if (itemData.id == this.dataSet[i].id) {
				index = i;
				break;
			}
		}
		if (index != -1) {
			// Update the Dataset --
			obj.replaceItem(this.dataSet, this.dataSet[index], itemData);
			// Update the DOM --
			// Item found, Check if the item is rendered in the list --
			let itemNode = null;
			let matchFound = false;
			for(let i=0; i<element.children.length; i++){
				itemNode = element.children[i];
				if (index == parseInt(itemNode.getAttribute("index"))) {
					matchFound = true;
					break;
				}
			}
			if (matchFound == true) {
				if (itemNode.nextElementSibling == null) {
					itemNode.outerHTML = "";
					element.appendChild(this.createListItem(itemData, index));
				}else{
					let nextNode = itemNode.nextElementSibling;
					itemNode.outerHTML = "";
					let node = this.createListItem(itemData, index);
					element.insertBefore(node, nextNode);
				}
			}
		}
	};
	this.setData = function(data, labelKey){
		this.dataSet = data;
		this.labelKey = labelKey;
		this.render();
	};
	this.select = function(data){
		if (data == "" || data == null || data == undefined) {
			this.clearSelect();
		}else{
			this.dataSet.forEach((item, index)=>{
				if (data == item) {
					if (this.selectedNode != null) {
						this.selectedNode.classList.remove("Selected");
					}
					this.selectedNode = element.querySelector("[index='"+ index +"']");
					this.selectedNode.classList.add("Selected");
					this.onSelect(data);
				}
			});
		}
	};
	this.clearSelect = function(){
		if (this.selectedNode != null) {
			this.selectedNode.classList.remove("Selected");
			this.selectedNode = null;
		}
		this.onSelect(null);
	};
	this.init = function(){
		element.addEventListener("click", function(event){
			if (event.target.closest(".xStaticListItem")) {
				let el = event.target.closest(".xStaticListItem");
				let index = parseInt(el.getAttribute("index"));
				this.select(this.dataSet[index], index);
			}
		}.bind(this));
	};
	this.init();

	return this;
}
export default xStaticList;