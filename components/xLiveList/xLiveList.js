import dom from "../../lib/xDOM.js";
import obj from "../../lib/xObject.js";
import xSearchBar from "../xSearchBar/xSearchBar.js";
import xSortBy from "../xSortBy/xSortBy.js";
import request from "../../lib/xRequest.js";
import xLoadOnScroll from '../xLoadOnScroll/xLoadOnScroll.js';
import xStaticList from "../xStaticList/xStaticList.js";
function xLiveList(element){
	this.element = element;
	this.options = null;
	this.dataSets = [];
	this.currentDataSet = null;
	this.currentSort = "";	
	this.list = null;

	let loadingMoreIsActive = false, header, searchContainer, search, sortContainer, sort, loadOnScroll;

	// Instance Methods --
	this.onItemClick = function(item, index, event){};
	this.buildFormData = function(){
		let formData = {
			fromIndex : this.list.dataSet.length,
			fetchCount : this.currentDataSet.fetchCount,
			currentSort : this.currentDataSet.currentSort,
			searchString : this.currentDataSet.searchString,
		};
		return formData;
	};
	this.prepareFetch = function(){
		// Clear the list --
		this.list.setData([]);
		// Build FormData --
		let formData = this.buildFormData();
		// Fetch the data from the server and render the UI --
		this.fetchData(formData);
	};
	this.fetchData = function(formData){
		// Execute beforeFetch ---
		if (this.currentDataSet.beforeFetch !== undefined) {
			formData = this.currentDataSet.beforeFetch(formData);	
		}

		// Based on config disable the loadOnScroll --
		if (this.options.loadOnScroll != undefined) {
			if (this.options.loadOnScroll.buttonTrigger == true) {
				loadOnScroll.button.addLoading();
				loadOnScroll.button.disable();
			}else{
				loadOnScroll.show();
			}
		}

		// Fetch it from Server --
		request.post(this.currentDataSet.url, formData).then(function(res){
			// Data after executing afterFetch --
			let data = null;
			if (this.currentDataSet.afterFetch == undefined) {
				data = res;
			}else{
				data = this.currentDataSet.afterFetch(res);
			}

			// Controlling loadMoreButton or scrolling --
			if (this.options.loadOnScroll != undefined) {
				loadingMoreIsActive = false;
				if (this.options.loadOnScroll.buttonTrigger == true) {
					loadOnScroll.button.removeLoading();
					loadOnScroll.button.enable();
				}else{
					loadOnScroll.hide();
				}
			}

			// If no data is found the loadOnScroll should be disabled until the formData Changes --
			if (this.options.loadOnScroll != undefined) {
				if (res.length == 0) {
					if (this.options.loadOnScroll.buttonTrigger == true) {
						loadOnScroll.button.setLabel("No more data found");
						loadOnScroll.button.disable();
					}else{
						loadOnScroll.disable = true;
					}
				}else{
					loadOnScroll.button.setLabel("Load More");
				}
			}

			// Data Recieved --
			this.pushItems(data);

		}.bind(this)).catch(function(error){
			console.log(error);
		});
	};
	this.pushItems = function(items){
		items.forEach((item)=>{
			this.push(item);
		});
	};
	this.render = function(){
		element.classList.add("xLiveList");
			header = dom.createElement("div", {classNames : "xLiveListHeader"});
			element.appendChild(header);
				sortContainer = dom.createElement("div", {classNames : "xLiveListSortContainer"});
				header.appendChild(sortContainer);

				searchContainer = dom.createElement("div", {classNames : "xListListSearchContainer"});
				header.appendChild(searchContainer);

			this.list = dom.createXElement(xStaticList, {type: "xStaticList", classNames : "xLiveListContainer"});
			if (this.options.loadOnScroll == undefined) {
				element.appendChild(this.list.element);
			}else{
				if (this.options.loadOnScroll.buttonTrigger == true) {
					loadOnScroll = dom.createXElement(xLoadOnScroll, {type : "xLoadOnScroll", "button-trigger" : true});
				}else{
					loadOnScroll = dom.createXElement(xLoadOnScroll, {type : "xLoadOnScroll", relative : this.options.loadOnScroll.relative, offset : this.options.loadOnScroll.offset});
				}
				loadOnScroll.setContent(this.list.element);
				element.appendChild(loadOnScroll.element);

				loadOnScroll.load = function(button){
					this.loadMore();
				}.bind(this);
			}

		// Watching --
		this.list.onSelect = function(item, index, event){
			// When an item is clicked, execute corresponding dataset's onItemClick --
			if (this.currentDataSet.onItemClick != undefined) {
				this.currentDataSet.onItemClick(item, index, event);
			}
			// After that, execute global onItemClick method which is in options --
			if (this.options.onItemClick != undefined) {
				this.options.onItemClick(item, index, event);
			}
		}.bind(this);
	};
	this.createHeader = function(dataSet){
		let that = this;

		// Creating Sort element according to the dataSet config --
		if (dataSet.sort == undefined) {
			sortContainer.innerHTML = "";
		}else{
			sortContainer.innerHTML = "";
			sort = dom.createXElement(xSortBy, {type : "xSortBy", label : "Sort"});
			sort.setData(dataSet.sort);
			sortContainer.appendChild(sort.element);

			sort.onSort = function(item){
				// Save currentSort to dataSet --
				that.currentDataSet.currentSort = item;
				// Prepare fetch --
				that.prepareFetch();
			};
		}

		// Creating Search element according to the dataSet config --
		if (dataSet.search == undefined || dataSet.search == false) {
			searchContainer.innerHTML = "";
		}else{
			searchContainer.innerHTML = "";
			search = dom.createXElement(xSearchBar, {type: "xSearchBar"});
			searchContainer.appendChild(search.element);

			search.onSearch = function(str){
				that.search(str);
			};
			search.onCancelSearch = function(){
				that.search("");
			};
		}
	};
	this.hideHeader = function(){
		header.style.display = "none";
	};
	this.setDataSets = function(dataSets, options){
		this.dataSets = dataSets;
		// Default Dataset is the first dataset --
		if (options.defaultDataSet == undefined) {
			this.switchDataset(dataSets[0].name);
		}else{
			this.switchDataset(options.defaultDataSet);
		}
	};
	this.switchDataset = function(dataSetName){
		this.dataSets.forEach((dataSet)=>{
			if (dataSet.name == dataSetName) {
				this.loadDataSet(dataSet);
			}
		});
	};
	this.reviveState = function(dataSet){
		// Assign the custom list item formatter --
		if (dataSet.listItemFormatter != undefined) {
			this.list.listItemFormatter = dataSet.listItemFormatter;
		}

		// Check if there's any Search string available --
		if (this.currentDataSet.searchString == "" || this.currentDataSet.searchString == undefined) {
		}else{
			// This will silently set the text to the search box but won't fire onSearch method --
			search.setText(this.currentDataSet.searchString);
		}

		// The Component is ready now, it's time to set the sort to populate it with the data --
		// Setting sort based on dataSet config --
		// This will case the sort to trigger onSort method which will fetch the data from the server and load it --
		if (this.currentDataSet.sort == undefined) {
			// Sorting is not used, need another way to trigger the fetch --
			this.prepareFetch();
		}else{
			if (this.currentDataSet.currentSort == undefined) {
				sort.setCurrentSort(this.currentDataSet.sort[0]);
			}else{
				sort.setCurrentSort(this.currentDataSet.currentSort);
			}
		}
	};
	this.loadDataSet = function(dataSet){
		this.currentDataSet = dataSet;
		// Create Header based on the dataSet config --
		this.createHeader(dataSet);
		// Revive State --
		this.reviveState(dataSet);
	};
	this.search = function(str){
		// Save the search string to the dataSet --
		this.currentDataSet.searchString = str;
		// Clear the List --
		this.list.setData([]);
		// Build formData --
		// Fetch the data from the server and render the UI --
		this.fetchData(this.buildFormData());
	};
	this.loadMore = function(){
		if (loadingMoreIsActive == false) {
			if (this.options.loadOnScroll.buttonTrigger == true) {
				loadOnScroll.button.addLoading();
			}
			loadingMoreIsActive = true;
			this.fetchData(this.buildFormData());
		}
	};
	this.push = function(item){this.list.push(item)};
	this.unshift = function(item){this.list.unshift(item)};
	this.update = function(newItem){this.list.update(newItem)};
	this.updateById = function(newItem){this.list.updateById(newItem)};
	this.init = function(dataSets, options){
		this.options = options;
		this.render(options);
		this.setDataSets(dataSets, options);

		if (this.options.header == false) {
			this.hideHeader();
		}
	};

	return this;
}
export default xLiveList;