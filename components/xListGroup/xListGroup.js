import dom from "../../lib/xDOM.js";
import system from "../../lib/xSystem.js";
import obj from "../../lib/xObject.js";
function xListGroup(element){
	// Private Variables --
	let container, emptySection;

	// Instance Variables --
	this.element = element;
	this.dataSet = [];
	this.listGroupData = [];
	this.options = {
		// Group by config --
		groupByKey : "created_at",
		groupByDataType : "Date",
		// Group Sorting config --
		groupSort : false,
		groupSortByKey : "",
		groupSortDataType : "",
		groupSortOrder : true,
		// Item Sort Config --
		itemSort : false,
		itemSortByKey : "",
		itemSortDataType : "",
		itemSortOrder : true, // ASC = true, DESC = false
	};
	this.emptyDataSet = false;

	// Instance Methods --
	this.onDataReceived = function(){};
	this.onEmptyDataReceived = function(){};
	this.onListItemClick = function(data, node, groupIndex, itemIndex){};
	// ----------------------------------------------------------------------
	this.buildGroupData = function(dataSet){
		this.listGroupData = obj.groupBy(dataSet, this.options.groupByKey, this.options.groupByDataType);

		// Sorting the groups --
		if (this.options.groupSort == true) {
			this.sortGroups();
		}
		// Sorting all group lists --
		if (this.options.itemSort == true) {
			this.sortAllGroupItems();
		}
		return this.listGroupData;
	};
	this.sortGroups = function(){
		obj.sort(this.listGroupData, this.options.groupSortByKey, this.options.groupSortDataType, this.options.groupSortOrder);
	};
	this.sortAllGroupItems = function(sortByKey, sortByDataType, sortOrder){
		this.listGroupData.forEach((group)=>{
			this.sortGroupItems(group, this.options.itemSortByKey, this.options.itemSortDataType, this.options.itemSortOrder);
		});
	};
	this.sortGroupItems = function(group, sortByKey, sortByDataType, sortOrder){
		obj.sort(group.data, sortByKey, sortByDataType, sortOrder);
	};
	this.showEmptySection = function(){
		container.style.display = "none";
		emptySection.style.display = "block";
	};
	this.hideEmptySection = function(){
		container.style.display = "block";
		emptySection.style.display = "none";
	};
	this.renderEmptySection = function(){
		emptySection.appendChild(this.emptySectionFormatter());
	};
	this.emptySectionFormatter = function(){};
	this.renderGroups = function(){
		container.innerHTML = "";
		this.listGroupData.forEach((group, index)=>{
			container.appendChild(this.createGroup(group, index));
		});
	};
	this.createGroup = function(group, index){
		let groupContainer = dom.createElement("div", {classNames : "xListGroupItem", index});

			let groupHeader = dom.createElement("div", {classNames: "xListGroupItemHeader"});
			groupHeader.appendChild(this.groupHeaderFormatter(group));
			groupContainer.appendChild(groupHeader);

			let groupListContainer = dom.createElement("div", {classNames : "xGroupItemListContainer"});
			this.createGroupList(groupListContainer, group);
			groupContainer.appendChild(groupListContainer);
		return groupContainer;
	};
	this.groupHeaderFormatter = function(group){
		let header = document.createElement("div");
		header.textContent = group.name;
		return header;
	};
	this.createGroupList = function(container, group){
		group.data.forEach((groupListItem, index)=>{
			container.appendChild(this.createListItem(groupListItem, index));
		});
	};
	this.createListItem = function(groupListItem, index){
		let listNode = dom.createElement("div", {classNames : "xListGroupListItem", index});
		listNode.appendChild(this.groupListItemFormatter(groupListItem));
		return listNode;
	};
	this.groupListItemFormatter = function(groupListItem){
		let listContent = document.createElement("div");
		listContent.textContent = groupListItem.title;
		return listContent;
	};
	this.setData = function(data){
		if (data == null || data.length == 0) {
			this.emptyDataSet = true;
			this.showEmptySection();
			this.onEmptyDataReceived();
			return;
		}else{
			this.emptyDataSet = false;
			this.hideEmptySection();
			this.onDataReceived();
		}
		// Setting Data --
		this.dataSet = data;

		// Building Group Data --
		this.buildGroupData(data);
		
		// Rendering UI --
		this.renderGroups();
	};
	this.insertItem = function(newItem, groupIndex, itemIndex){
		// Get the group node --
		let itemContainer = container.querySelector(".xListGroupItem[index='"+groupIndex+"'] .xGroupItemListContainer");
		let newItemNode = this.createListItem(newItem, itemIndex);

		// Increment the index of successive element node --
		Array.prototype.forEach.call(itemContainer.children, function(itemNode, index){
			if (index >= itemIndex) {
				itemNode.setAttribute("index", (parseInt(itemNode.getAttribute("index")) + 1));
			}
		});
		// Append the child at the itemIndex --
		itemContainer.insertBefore(newItemNode, itemContainer.children[itemIndex]);
		// Updating the Main array --
		this.dataSet.push(newItem);
		// Insert the item in the group array --
		this.listGroupData[groupIndex].data.splice(itemIndex, 0, newItem);
	};
	this.insertGroup = function(group){
		// Check if the groupSort is enabled --
		if (this.options.groupSort == true) {
			// Sort is enabled, so calculate the insertion point and then add it --
			let index = obj.calculateInsertionPointInSortedArray(this.listGroupData, group, this.options.groupSortByKey, this.options.groupSortDataType, this.options.groupSortOrder);
			// Insert the group in that index --
			this.listGroupData.splice(index, 0, group);
			// Create the group element --
			let groupNode = this.createGroup(group, index);
			// Correcting the index --
			Array.prototype.forEach.call(container.children, (eachGroupNode, eachGroupIndex)=>{
				if (eachGroupIndex >= index) {
					eachGroupNode.setAttribute("index", (parseInt(eachGroupNode.getAttribute("index")) + 1));
				}
			});
			// Append the Element --
			container.insertBefore(groupNode, container.children[index]);
		}else{
			// groupSort is disabled, adding group as the first group --
			this.listGroupData.unshift(group);
			// Render the Group --
			let groupNode = this.createGroup(group, 0);
			// Append the group as the first group --
			container.insertBefore(groupNode, container.firstElementChild);
		}
		// Appending group item to the main list --
		group.data.forEach((groupListItem)=>{
			this.dataSet.push(groupListItem);
		});
		this.hideEmptySection();
	};
	this.removeGroup = function(groupIndex){
		// Get the group node --
		let groupNode = container.children[groupIndex];
		// Group is empty, delete the group as well --
		this.listGroupData.splice(groupIndex, 1);
		// Correcting the group index --
		Array.prototype.forEach.call(container.children, function(eachGroup, eachIndex){
			if(eachIndex > groupIndex){
				eachGroup.setAttribute("index", (parseInt(eachGroup.getAttribute("index")) - 1));
			}
		});
		// Deleting the group node from DOM --
		groupNode.outerHTML = "";
	};
	this.removeAllGroup = function(){
		this.listGroupData = [];
		this.dataSet = [];
		container.innerHTML = "";
	};
	this.addItems = function(items){
		items.forEach((item)=>{
			this.addItem(item);
		});
	};
	this.addItem = function(newItem){
		// Determining the group name. Now we now in which group the newItem will go --
		let groupData = obj.groupBy([newItem], this.options.groupByKey, this.options.groupByDataType);
		let groupName = groupData[0].name;
		// Check if the group exists or not --
		let group = null;
		let groupIndex = -1;
		let matchFound = false;
		for(let i=0; i<this.listGroupData.length; i++){
			if (this.listGroupData[i].name == groupName) {
				matchFound = true;
				group = this.listGroupData[i];
				groupIndex = i;
				break;
			}
		}
		if (matchFound == true) {
			// Group found, we need to add the item to that group, now we need to determine if the group is sorted, if the itemSort is true, then the item will be inserted in sorted order --
			if (this.options.itemSort == true) {
				// Sort is enabled, so calculate the insertion point and then add it --
				let itemIndex = obj.calculateInsertionPointInSortedArray(group.data, newItem, this.options.itemSortByKey, this.options.itemSortDataType, this.options.itemSortOrder);
				// Update the UI --
				this.insertItem(newItem, groupIndex, itemIndex);
			}else{
				// Update the UI --
				this.insertItem(newItem, groupIndex, 0);
			}
		}else{
			// Group not found, insert the new group --
			this.insertGroup(groupData[0]);
		}
	};
	this.findItem = function(item){
		let groupIndex = 0;
		let itemIndex = 0;
		let matchFound = false;
		for(let i=0; i<this.listGroupData.length; i++){
			let groupItems = this.listGroupData[i].data;
			for(let j=0; j<groupItems.length; j++){
				if (groupItems[j].id == item.id) {
					itemIndex = j;
					groupIndex = i;
					matchFound = true;
					break;
				}
			}
			if (matchFound == true) {
				break;
			}
		}
		if (matchFound) {
			// Find Group Node --
			let groupNode = container.children[groupIndex];
			// Find Item Node --
			let itemNode = groupNode.querySelector(".xGroupItemListContainer").children[itemIndex]
			return {
				groupIndex,
				itemIndex,
				groupNode,
				itemNode
			};
		}else{
			return false;
		}
	};
	this.removeItem = function(item){
		let index = this.findItem(item);
		if (index !== false) {
			// Correcting the Index --
			Array.prototype.forEach.call(index.itemNode.parentNode.children, function(eachItemNode, eachItemIndex){
				if (eachItemIndex > index.itemIndex) {
					eachItemNode.setAttribute("index", (parseInt(eachItemNode.getAttribute("index")) - 1));
				}
			});
			// Deleting the node from the DOM --
			index.itemNode.outerHTML = "";
			// Deleting from group data --
			this.listGroupData[index.groupIndex].data.splice(index.itemIndex, 1);
			// Deleting from main data --
			this.dataSet.forEach((eachItem, index)=>{
				if (eachItem.id == item.id) {
					this.dataSet.splice(index, 1);
				}
			});
			// If there is no data in the group, delete it as it is empty --
			if (this.listGroupData[index.groupIndex].data.length == 0) {
				// Remove the group --
				this.removeGroup(index.groupIndex);
			}
		}else{
		}
	};
	this.updateItem = function(item){
		// Remove the item first --
		this.removeItem(item);
		// Add this item --
		this.addItem(item);
	};
	this.render = function(){
		element.classList.add("xListGroup");
			container = dom.createElement("div", {'classNames' : "xListGroupContainer"});
			element.appendChild(container);

			emptySection = dom.createElement("div", {"classNames" : "xListGroupEmptySection"});
			element.appendChild(emptySection);

		element.addEventListener("click", function(event){
			if (event.target.closest(".xListGroupListItem")) {
				let node = event.target.closest(".xListGroupListItem");
				let itemIndex = node.getAttribute("index");

				let groupNode = node.closest(".xListGroupItem");
				let groupIndex = groupNode.getAttribute("index");

				let data = this.listGroupData[groupIndex].data[itemIndex];

				this.onListItemClick(data, node, groupIndex, itemIndex);
			}
		}.bind(this));
	};
	this.init = function(options){
		this.options = obj.mergeObject(this.options, options);

		// Assigning options --
		if (this.options.groupHeaderFormatter != undefined) {
			this.groupHeaderFormatter = this.options.groupHeaderFormatter;
		}
		if (this.options.groupListItemFormatter != undefined) {
			this.groupListItemFormatter = this.options.groupListItemFormatter;
		}
		if (this.options.onListItemClick != undefined) {
			this.onListItemClick = this.options.onListItemClick;
		}
		if (this.options.onEmptyDataReceived != undefined) {
			this.onEmptyDataReceived = this.options.onEmptyDataReceived;
		}
		if (this.options.onDataReceived != undefined) {
			this.onDataReceived = this.options.onDataReceived;
		}
		if (this.options.emptySectionFormatter != undefined) {
			this.emptySectionFormatter = this.options.emptySectionFormatter;
		}

		// Render Empty section --
		this.renderEmptySection();
	};

	this.render();

	return this;
}
export default xListGroup;