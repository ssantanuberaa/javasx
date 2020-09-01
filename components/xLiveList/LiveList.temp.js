import dom from "../../lib/xDOM.js";
import obj from "../../lib/xObject.js";
import system from "../../lib/xSystem.js";
import xSearchBar from "../xSearchBar/xSearchBar.js";
import xDropDown from "../xDropDown/xDropDown.js";
import xSortBy from "../xSortBy/xSortBy.js";
import request from "../../lib/xRequest.js";
import xLoadOnScroll from '../xLoadOnScroll/xLoadOnScroll.js';
import xStaticList from "../xStaticList/xStaticList.js";
function xLiveList(element){
	this.element = element;
	this.options = null;
	this.searchString = ""; 
	this.currentSort = "";
	this.dataSets = [];
	this.list = null;

	let loadingMoreIsActive = false, header, search, sort, loadOnScroll;

	// Instance Methods --
	this.onItemClick = function(item, index, event){};
	this.fetchData = function(formData){
		// Execute beforeFetch ---
		if (this.options.beforeFetch !== undefined) {
			formData = this.options.beforeFetch(formData);	
		}	
		// Fetch it from Server --
		request.post(this.options.url, formData).then(function(res){
			// Data after executing afterFetch --
			let data = null;
			if (this.options.afterFetch == undefined) {
				data = res;
			}else{
				data = this.options.afterFetch(res);
			}

			// Controlling loadMoreButton or scrolling --
			loadingMoreIsActive = false;
			if (this.options.loadOnScroll.buttonTrigger == true) {
				loadOnScroll.button.removeLoading();
			}else{
				loadOnScroll.hide();
			}

			// If no data is found the loadOnScroll should be disabled until the formData Changes --
			if (res.length == 0) {
				if (this.options.loadOnScroll.buttonTrigger == true) {
					loadOnScroll.button.setLabel("No more data found");
					loadOnScroll.button.disable();
				}else{
					loadOnScroll.disable = true;
				}
			}

			// Data Recieved --
			this.pushItems(data);

		}.bind(this)).then(function(error){
			console.log(error);
		});
	};
	this.pushItems = function(items){
		items.forEach((item)=>{
			this.push(item);
		});
	};
	this.push = function(item){this.list.push(item)};
	this.unshift = function(item){this.list.unshift(item)};
	this.update = function(newItem){this.list.update(newItem)};
	this.updateById = function(newItem){
		// Find the item --
		let matchFound = false;
		let index = -1;
		for(let i=0; i<this.dataSet.length; i++){
			if (newItem.id == this.dataSet[i].id) {
				index = i;
				matchFound = true;
				break;
			}
		}
		if (matchFound) {
			// Update the current Dataset --
			obj.replaceItem(this.dataSet, this.dataSet[index], newItem);

			// Update the list --
			
		}
	};
	this.buildFormData = function(){
		loadOnScroll.disable = false;
		let formData = {
			fromIndex : this.dataSet.length,
			fetchCount : this.options.fetchCount,
			currentSort : this.currentSort,
			searchString : this.searchString,
		};
		return formData;
	};
	this.render = function(){
		element.classList.add("xLiveList");
			header = dom.createElement("div", {classNames : "xLiveListHeader"});
			element.appendChild(header);

			this.list = dom.createXElement(xStaticList, {type: "xStaticList", classNames : "xLiveListContainer"});
			element.appendChild(this.list.element);
	};
	this.init = function(options){
		this.render();
		let that = this;
		this.options = options;

		if (options.onItemClick != undefined) {
			this.onItemClick = options.onItemClick;
		}
		if (options.listItemFormatter != undefined) {
			this.list.listItemFormatter = options.listItemFormatter;
		}
		if(options.sort != undefined){
			sort = dom.createXElement(xSortBy, {type : "xSortBy", label : "Sort"});
			sort.setData(options.sort);
			header.appendChild(sort.element);

			this.currentSort = this.options.defaultSort;

			sort.onSort = function(item){
				that.currentSort = item;
				that.dataSet = [];
				// Build FormData --
				let formData = that.buildFormData();
				that.fetchData(formData);
			};
		}
		if (options.search == true) {
			search = dom.createXElement(xSearchBar, {type: "xSearchBar", theme: 'vidhikarya'});
			dom.loadStyle(search.element);
			header.appendChild(search.element);


			search.onSearch = function(str, event){
				that.dataSet = [];
				that.searchString = str;
				let formData = that.buildFormData();
				let searchIsActive = true;
				that.fetchData(formData);
			};
			search.onCancelSearch = function(){
				that.dataSet = [];
				that.searchString = "";
				let formData = that.buildFormData();
				let searchIsActive = true;
				that.fetchData(formData);
			};
		}
		if (options.loadOnScroll != undefined) {
			if (options.loadOnScroll.buttonTrigger == true) {
				loadOnScroll = dom.createXElement(xLoadOnScroll, {type : "xLoadOnScroll", "button-trigger" : true});
			}else{
				loadOnScroll = dom.createXElement(xLoadOnScroll, {type : "xLoadOnScroll", relative : options.loadOnScroll.relative, offset : options.loadOnScroll.offset});
			}
			loadOnScroll.setContent(this.list.element);
			element.appendChild(loadOnScroll.element);

			loadOnScroll.load = function(button){
				if (loadingMoreIsActive == false) {
					if (this.options.loadOnScroll.buttonTrigger == true) {
						button.addLoading();
					}
					loadingMoreIsActive = true;
					this.fetchData(this.buildFormData());
				}
			}.bind(this);
		}
		if (this.options.defaultSort == undefined) {
			that.dataSet = [];
			// Build FormData --
			let formData = that.buildFormData();
			that.fetchData(formData);
		}else{
			sort.setCurrentSort(this.options.defaultSort)
		}
		if (this.options.header == false) {
			header.style.display = "none";
		}

		// Watching --
		this.list.onSelect = function(item, index){
			that.onItemClick(item, index);
		};
	};
	this.setDataSets = function(dataSets, dataSetName){
		this.dataSets = dataSets;
		// Default Dataset is the first dataset --
		if (dataSetName == undefined) {
			this.switchDataset(dataSets[0].name);
		}else{
			this.switchDataset(dataSetName);
		}
	};
	this.switchDataset = function(dataSetName){
		this.dataSets.forEach((dataSet)=>{
			if (dataSet.name == dataSetName) {
				this.init(dataSet);
			}
		});
	};

	return this;
}
export default xLiveList;