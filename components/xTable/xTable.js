import axios from "axios";
import dom from "../../lib/xDOM.js";
import obj from "../../lib/xObject.js";
import xIcon from "../xIcon/xIcon.js";
import xButton from "../xButton/xButton.js";
import xStaticList from "../xStaticList/xStaticList.js";
import xDropDown from "../xDropDown/xDropDown.js";
import xFuzzySort from "../../lib/xFuzzySort.js";
import TableExcel from "./TableExcel.js";
function xTable(element){
	// Data --
	this.dataSets = {};
	this.selectedRow = null;
	this.currentDataSet  = null;
	this.element = element;
	this.previousData = [];
	this.options = null;
	this.value = null;

	// Dataset Blueprint --
	this.dataSetBlueprint = {
		name : "Dataset Name", // All dataset must contain unique dataset name
		columns : [
			{
				key : "created_at", // This field represents the key name of the object for which the column will be rendered. It must be unique across the same dataset.
				title : "Posted On", // Title specifies the column header title --
				width : 250, // The value is in pixel. This specifies the width of the column.
				sort : true, // If the value is true, the column will have the ability to it's data when the user clicks on this column header.
				dataType : "datetime",  // If the sort is true, then you must use this property to specify the datatype of the cell which will be used to sort the data.
				format : function(rowData, rowIndex, colIndex){ // Format function is used to format the column cell for each row. This method must return a DOM element, representing the cell.
					// rowData represents the item data which is an object --
					// rowIndex and colIndex specifies the row and col index within the grid --
					let element = document.createElement("div");
					return element;
				},
			}
		], // Contains definition of each column
		numberOfFixedColumns : false, // Number of fixed column from the beginning --
		dataSource : {}, // An Object which specifies the url and fetchCount to get the data from the server
		selection : "single", // This specifies the selection behaviour. single means the user can select only one row at a time, another value is multiple, which specifies multiple selection.
		numberOfRowsPerPage : 25, // This specifies the number of rows that will be fetched from the server. If the value is 0, it loads all the data at once.
		pageNumber : 1, // This specifies the current page number, in one page, the total number of records is equal to numberOfRowsPerPage property
		totalPages : 100, // The total number of pages, this is required in order to display the pagination --
		totalRecords : 100, // This represents total number of records available for this dataSet.
		sortByKey : "created_at", // This specifies the sort field
		sortByOrder : true, // This specifies the sort order, true for ASC and false for DESC,
		sortByDataType : "Date", // Can also be string or number. This specifies the data type of the field which will be used for sorting
		data : [], // This is the main data storage for each dataset.
		dataBucket : [], // This is the subset of main data storage. The number of item is calculated based on numberOfRowsPerPage and pageNumber property
		filteredData : [], // This property contains the filtered data here --
		search : false, // When user searches for data, this property becomes true, when user clears all the search field, it becomes false automatically, you should not modify this property manually.
		globalSearch : false, // This indicates the global search state.
		searchString : "",
		filters : {}, // This property contains all the active filters for the current dataSet. Each key specifies the field name of the object and value specifies the search text for the object.
		onRowSelect : function(selectedRowItem, rowIndex, colIndex, currentDataSet){}, // This handler is called whenever user select one or multple row.
		beforeFetch : function(formData){}, // This handler is called before making request to fetch the data, this method recieves the formData, you can updated it and then return the updated formData which will be used to customized the fetching --
		afterFetch : function(responseData){}, // This handler is called when new data is fetched from the server and before adding it to its main data storage.
	};

	// Private Variables --
	let tableHeader, actionHeader, tableGridContainer, tableGrid, tableFooter, loadingButton, currentSortedCell, pagesDropdown, pages, pageCount, leftNavigation, rightNavigation, globalInput, totalRecordsLabel, totalPagesLabel, CellToolTip;
	let lastColumnWidth, totalColumnWidth = 0;
	let pointerX = 0, pointerY = 0;

	// Methods --
	this.onRowSelect = function(rowData, rowIndex, colIndex, currentDataSet){};
	this.addLoading = function(){
		loadingButton.element.style.display = "flex";
	};
	this.removeLoading = function(){
		loadingButton.element.style.display = "none";
	};
	this.generateSortConfig = function(cell, dataSet){
		// Get headerCell index --
		let nodeIndex = -1;
		Array.prototype.forEach.call(tableHeader.children, function(eachCell, index){
			if (cell == eachCell) {
				nodeIndex = index;
			}
		});
		// Getting Column configuration --
		let columnConfig = dataSet.columns[nodeIndex];
		// 
		if (columnConfig.sort == true) {
			if (currentSortedCell != null) {
				currentSortedCell.classList.remove("sortActive");
			}
			currentSortedCell = cell;
			currentSortedCell.classList.add("sortActive");
			let icon = cell.querySelector(".material-icons");
			
			let order;
			if (icon != null) {
				if (icon.textContent == "keyboard_arrow_up") {
					icon.textContent = "keyboard_arrow_down";
					order = true;
				}else{
					icon.textContent = "keyboard_arrow_up";
					order = false;
				}
			}
			dataSet.sortByKey = columnConfig.key;
			dataSet.sortByDataType = columnConfig.dataType;
			dataSet.sortByOrder = order;
			return true;
		}else{
			return false;
		}
	};
	this.getTotalFixedColumnWidth = function(dataSet){
		let totalColumns = dataSet.numberOfFixedColumns;
		let width = 0;
		Array.prototype.forEach.call(tableHeader.children, function(headerCell, index){
			if (index < totalColumns) {
				width = width + headerCell.offsetWidth;
			}
		});
		return width;
	};
	// ------------------------------------------------------------
	this.fetchDataForLocalDataset = function(dataSet){
		let formData = {
			fetchCount : 0,
			fromIndex : 0
		};
		// beforeFetch --
		if (dataSet.beforeFetch != undefined) {
			formData = dataSet.beforeFetch(formData);
		}
		this.addLoading();
		axios.post(dataSet.dataSource.url, formData).then(function(res){
			if (dataSet.afterFetch == undefined) {
				dataSet.data = res.data;
			}else{
				dataSet.data = dataSet.afterFetch(res.data);
			}
			this.removeLoading();
		}.bind(this)).catch(function(error){
			dataSet.data = [];
			this.removeLoading();
		}.bind(this));
	};
	this.globalFuzzySort = function(searchText, searchData){
		let keys = Object.keys(searchData[0]);
		let results = [];
		let temp;
		let SearchEngine = xFuzzySort();
		keys.forEach((key)=>{
			temp = SearchEngine.go(searchText, searchData, {"key": key});
			results = results.concat(temp);
		});
		let sortedResults = results.sort((a,b)=>{
			return b["score"] - a["score"];
		});
		results = [];
		sortedResults.forEach((item)=>{
			let match = false;
			for(let i = 0; i<results.length; i++){
				if (item.obj==results[i]) {
					match = true;
					break;
				}
			}
			if (match == false) {
				results.push(item.obj);
			}
		});
		return results;
	};
	this.pullData = function(dataSet){
		// In this method we will pull the data from either from local dataset or fetch from the server, depending on mode --
		if (dataSet.mode == "local") {
			// pull data from local dataset --
			if (dataSet.data != undefined && dataSet.data.length == 0) {
				// The local dataset is empty, pull the data from the server --
				this.fetchDataForLocalDataset();
			}else{
				// pull data from local dataset based on search, sort, pageNumber configuration --
			}
		}else if (dataSet.mode == "server") {
			// Pull data from the server --
			this.fetchFromDataSouce(this.currentDataSet);
		}
	};
	// -----------------------------------------------
	this.init = function(dataSets){
		this.render();
		this.dataSets = dataSets;

		// Hiding the loading button initially --
		this.removeLoading();

		this.switchDataSet(dataSets[0].name);
	};
	this.render = function(){
		element.classList.add("xTable");
			tableGridContainer = document.createElement("div");
			tableGridContainer.classList.add("xTableGridContainer");
			element.appendChild(tableGridContainer);
				tableHeader = document.createElement("div");
				tableHeader.classList.add("xTableHeader");
				tableGridContainer.appendChild(tableHeader);
			
				tableGrid = document.createElement("div");
				tableGrid.classList.add("xTableGrid");
				tableGridContainer.appendChild(tableGrid);

			tableFooter = document.createElement("div");
			tableFooter.classList.add("xTableFooter");
			element.appendChild(tableFooter);
				let globalSearch = dom.createElement("div", {classNames : "xTableGlobalSearch"});
				tableFooter.appendChild(globalSearch);
					globalInput = dom.createElement("input", {classNames : "xTableGlobalSearchInput"});
					globalInput.setAttribute("placeholder", "Search...");
					globalSearch.appendChild(globalInput);

				let pagination = dom.createElement("div", {classNames : "xTablePagination"});
				tableFooter.appendChild(pagination);
					leftNavigation = dom.createElement("div", {classNames : "xTableLeftNavigation"});
					pagination.appendChild(leftNavigation);
						leftNavigation.appendChild(dom.createXElement(xIcon, {type : "xIcon", icon : "material-icon,keyboard_arrow_left"}).element);

					pagesDropdown = dom.createXElement(xDropDown, {type : "xDropDown"});
					pagination.appendChild(pagesDropdown.element);
						pageCount = dom.createElement("div", {classNames : "xTablePageCount"});
						pageCount.setAttribute("contenteditable", "true");
						pageCount.textContent = "";
						pages = dom.createXElement(xStaticList, {type : "xStaticList"});
						pagesDropdown.setContent(pages.element);
						pagesDropdown.setTrigger(pageCount);

					rightNavigation = dom.createElement("div", {classNames : "xTableRightNavigation"});
					pagination.appendChild(rightNavigation);
						rightNavigation.appendChild(dom.createXElement(xIcon, {type : "xIcon", icon : "material-icon,keyboard_arrow_right"}).element);

				let spacer = document.createElement("div");
				spacer.classList.add("xTableFooterSpacer");
				tableFooter.appendChild(spacer);

				let downloadExcel = document.createElement("div");
				downloadExcel.classList.add("ExcelDownloadContainer");
				tableFooter.appendChild(downloadExcel);
					let downloadExcelIcon = document.createElement("i");
					downloadExcelIcon.classList.add("fa");
					downloadExcelIcon.classList.add("fa-file-excel-o");
					downloadExcel.appendChild(downloadExcelIcon);

				let statusContainer = dom.createElement("div", {classNames : "xTableStatusContainer"});
				tableFooter.appendChild(statusContainer);
					totalRecordsLabel = dom.createElement("div", {classNames : "xTableTotalRecords"});
					statusContainer.appendChild(totalRecordsLabel);

					totalPagesLabel = dom.createElement("div", {classNames : "xTableTotalPagesCount"});
					statusContainer.appendChild(totalPagesLabel);

				downloadExcel.addEventListener("click", function(event){
					var xls;
					if(this.currentDataSet.search == true){
						xls = new TableExcel(this.currentDataSet.filteredData, this.currentDataSet.name);
					}else{
						xls = new TableExcel(this.currentDataSet.data, this.currentDataSet.name);
					}
					xls.exportToXLS('export.xls');
				}.bind(this));

			loadingButton = dom.createXElement(xButton, {type : "xButton", label : "", classNames:"GridLoader"});
			element.appendChild(loadingButton.element);
			loadingButton.addLoading();

		// Listener for when user types on the header search input --
		tableHeader.addEventListener("input", function(event){
			let dataSet = this.currentDataSet;

			// Clear Global Search --
			this.clearGlobalSearchInput(dataSet);

			let input = event.target;
			let key = input.getAttribute("name");
			if (input.value == "") {
				// Remove it from filters
				delete dataSet.filters[key];
				input.parentNode.classList.remove("active");
				if (Object.keys(dataSet.filters).length == 0) {
					this.clearSearch(dataSet);
				}else{
					dataSet.search = true;
					dataSet.searchString = "";
					this.searchDataSet(dataSet);
					this.createPage(dataSet);
				}
			}else{
				// Add or Update it 
				input.parentNode.classList.add("active");
				dataSet.filters[key] = input.value;
				dataSet.search = true;
				dataSet.searchString = "";
				this.searchDataSet(dataSet);
				this.createPage(dataSet);
			}
		}.bind(this));

		// Listener for when user clicks on the header title --
		tableHeader.addEventListener("click", function(event){
			if (event.target.closest(".xTableHeaderTitle")) {
				// Sort the data accroding to the column --
				let clickedHeaderCell = event.target.closest(".xTableHeaderCell");
				let dataSet = this.currentDataSet;
				if (this.generateSortConfig(clickedHeaderCell, dataSet)) {
					this.sortData(dataSet);
					dataSet.pageNumber = 1;
					this.createPage(dataSet);
				}
			}
		}.bind(this));

		// 
		tableGrid.addEventListener("click", function(event){
			// When Click happen on a row --
			if (event.target.closest(".xTableRow") && event.target.closest(".xTableCell")) {
				// Clicked On Row --
				if (this.currentDataSet.selection == undefined || this.currentDataSet.selection == "single") {
					let row = event.target.closest(".xTableRow");
					let column = event.target.closest(".xTableCell");
					let rowIndex = parseInt(row.getAttribute("index"));
					let colIndex = parseInt(column.getAttribute("index"));
					if (this.selectedRow != null) {
						this.selectedRow.classList.remove("xTableSelectedRow")
					}
					this.selectedRow = row;
					row.classList.add("xTableSelectedRow");
					// Get Clicked Cell --
					if (this.currentDataSet.onRowSelect == undefined) {
						this.onRowSelect(this.currentDataSet.dataBucket[rowIndex], rowIndex, colIndex, this.currentDataSet);
					}else{
						this.currentDataSet.onRowSelect(this.currentDataSet.dataBucket[rowIndex], rowIndex, colIndex, this.currentDataSet);
					}
				}
			}
		}.bind(this));

		leftNavigation.addEventListener("click", function(event){
			let dataSet = this.currentDataSet;
			if (dataSet.pageNumber != 1) {
				dataSet.pageNumber = dataSet.pageNumber - 1;
				this.createPage(dataSet);
			}
		}.bind(this));

		rightNavigation.addEventListener("click", function(event){
			let dataSet = this.currentDataSet;
			if (dataSet.pageNumber != dataSet.totalPages) {
				dataSet.pageNumber = dataSet.pageNumber + 1;
				this.createPage(dataSet);
			}
		}.bind(this));

		// Page Count in Pagination --
		pageCount.addEventListener("input", function(event){
			let pageNumber = parseInt(event.target.textContent)
			if (isNaN(pageNumber)) {
				return;
			}
			let dataSet = this.currentDataSet;
			
			if (pageNumber > 0 && pageNumber <= dataSet.totalPages) {
				pages.select(pageNumber);
			}
		}.bind(this));

		globalInput.addEventListener("input", function(event){
			let value = event.target.value;
			let dataSet = this.currentDataSet;
			if (value == "") {
				this.clearSearch(dataSet);
			}else{
				globalInput.classList.add("active");
				this.clearFilterInputs(dataSet);
				dataSet.globalSearch = true;
				dataSet.pageNumber = 1;
				dataSet.searchString = value;
				dataSet.filteredData = this.searchInAll(dataSet, value);
				this.createPage(dataSet);
			}
		}.bind(this));

		let that = this;
		pages.onSelect = function(item){
			// Update the dataset --
			that.currentDataSet.pageNumber = item;
			that.createPage(that.currentDataSet);
		};

		// Initializing tooltip --
		this.initTooltip();
	};
	this.initTooltip = function(){

		document.addEventListener('mousemove', function(event){
			pointerX = event.pageX - document.documentElement.scrollLeft;
			pointerY = event.pageY - document.documentElement.scrollTop;
		});

		CellToolTip = document.createElement('div');
		CellToolTip.classList.add("CellToolTip");
		element.appendChild(CellToolTip);


		// When mouse pointer enter the Grid Viewport --
		tableGrid.addEventListener('mouseenter', function(event){
			if (CellToolTip != null) {
				CellToolTip.style.display = "flex";
			}
		});

		// When mouse pointer leave from the Grid viewport --
		tableGrid.addEventListener('mouseleave', function(event){
			if (CellToolTip != null) {
				CellToolTip.style.display = "none";
			}
		});


		// When mouse hover over Grid Viewport --
		tableGrid.addEventListener('mousemove', function(event){
			// Showing CellToolTip --
			CellToolTip.innerHTML = event.target.classList.contains('xTableCell') ? event.target.textContent : "";
			// CellToolTip.style.top = (window.pointerY+5)+"px";
			// CellToolTip.style.left = (window.pointerX+5)+"px";
			if ((document.documentElement.clientWidth - ((pointerX+5)+CellToolTip.clientWidth))<0) {
				CellToolTip.style.removeProperty('left');
				CellToolTip.style.right = ((document.documentElement.clientWidth - pointerX) + 5) + "px";
			}else{
				CellToolTip.style.removeProperty('right');
				CellToolTip.style.left = (pointerX+5)+'px';
			}	

			if (document.documentElement.clientHeight - ((pointerY + 5) + CellToolTip.clientHeight) < 0) {
				CellToolTip.style.removeProperty("top");
				CellToolTip.style.bottom = ((document.documentElement.clientHeight - pointerY) + 5) + "px";
			}else{
				CellToolTip.style.removeProperty("bottom");
				CellToolTip.style.top = (pointerY + 5) + "px";
			}
		});
	}
	this.switchDataSet = function(dataSetName){
		// If the dataset is alredy rendered then no need to switch --
		if (this.currentDataSet != null && dataSetName == this.currentDataSet.name) {
			return;
		}
		// Switch to the matched dataset --
		this.dataSets.forEach((dataSet, index)=>{
			if (dataSet.name == dataSetName) {
				this.currentDataSet = dataSet;
				this.configDataSet(dataSet);
				this.createTable(dataSet);
				this.createPage(dataSet);
			}
		});
	};
	this.configDataSet = function(dataSet){
		// In this method we need to bring back dataset specific settings --
		// Default setting of the Database --
		if (dataSet.filters == undefined) {
			dataSet.filters = {};
		}
		if (dataSet.dataBucket == undefined) {
			dataSet.dataBucket = [];
		}
		if (dataSet.pageNumber == undefined) {
			dataSet.pageNumber = 1;
		}
		if (dataSet.data == undefined) {
			dataSet.data = [];
		}
		if (dataSet.totalPages == undefined) {
			dataSet.totalPages = 0;
		}
		if (dataSet.totalRecords == undefined) {
			dataSet.totalRecords = 0;
		}
		if (dataSet.search == undefined) {
			dataSet.search = false;
		}
		if (dataSet.globalSearch == undefined) {
			dataSet.globalSearch = false;
		}
		if (dataSet.searchString == undefined) {
			dataSet.searchString = "";
		}
		if (dataSet.numberOfFixedColumns == undefined) {
			dataSet.numberOfFixedColumns = 1;
		}
		if (dataSet.mode == undefined) {
			dataSet.mode = "local";
		}
	};
	this.createTable = function(dataSet){
		this.createHeader(dataSet);
		// Sometimes if the grid contains very few column but the total grid width is more than total width of all column,
		// then the remaining space on the right side of the grid remains empty and doesn't look good. So what we need to do is to distribute the remaining space to the last column, 
		// so that even though the last column is having a fixed with, it might be larger than this and will take up the whole remaining space. But if the grid doesn't have any remaining space left, then the columns will have width what is given to each column.
		// So lastColumnWidth is dynamically calculated with for last column only.
		this.tryToFitToFullScreenWidth(dataSet);
		// We are going to update the rows after receving the data, so current grid should be cleared --
		tableGrid.innerHTML = "";
	};
	this.createPage = function(dataSet){
		tableGrid.innerHTML = "";

		dataSet.totalFixedColumnWidth = this.getTotalFixedColumnWidth(dataSet);
		this.analyzeData(dataSet).then(function(){
			dataSet.dataBucket.forEach((rowData, rowIndex)=>{
				// Check fixed Column --
				tableGrid.appendChild(this.createRow(rowData, rowIndex, dataSet));
			});
			this.updateFooter(dataSet);
		}.bind(this));
	};
	this.createHeader = function(dataSet){
		// Rendering Header --
		tableHeader.innerHTML = "";
		totalColumnWidth = 0;
		let fixedLeft = 0;
		dataSet.columns.forEach((column, colIndex)=>{
			let headerCell = document.createElement("div");
			headerCell.classList.add("xTableHeaderCell");
			headerCell.style.width = column.width + "px";
			headerCell.style.minWidth = column.width + "px";
			headerCell.style.maxWidth = column.width + "px";
			tableHeader.appendChild(headerCell);
				let headerTitle = document.createElement("div");
				headerTitle.className = "xTableHeaderTitle";
				totalColumnWidth = totalColumnWidth + column.width;
				headerCell.appendChild(headerTitle);
				if (column.sort == true) {
					let titleNode = document.createElement("div");
					titleNode.textContent = column.title;
					headerTitle.appendChild(titleNode);

					let headerSortNode = document.createElement("div");
					headerSortNode.className = "xTableHeaderSort";
					headerTitle.appendChild(headerSortNode);
						let sortIcon = dom.createXElement(xIcon, {type : "xIcon", icon : "material-icon,keyboard_arrow_up"});
						headerSortNode.appendChild(sortIcon.element);
						headerCell.sortIcon = sortIcon;
				}else{
					headerTitle.textContent = column.title;
				}

				let headerSearch = document.createElement("div");
				headerSearch.classList.add("xTableHeaderSearchContainer");
				headerCell.appendChild(headerSearch);
					let searchIcon = document.createElement("i");
					searchIcon.className = "fa fa-search";
					headerSearch.appendChild(searchIcon);

					let searchInput = document.createElement("input");
					searchInput.setAttribute("type", "text");
					searchInput.setAttribute("placeholder", "Search");
					searchInput.setAttribute("for", column.title);
					searchInput.setAttribute("name", column.key);
					headerSearch.appendChild(searchInput);
					// If the search is true, that means the user has searched the dataset and then switched to another dataset, so when the user comes back to this dataset, the search settings must be revive --
					if (dataSet.search == true && dataSet.filters[column.key] != undefined) {
						searchInput.value = dataSet.filters[column.key];
						headerSearch.classList.add("active");
					}

			if (dataSet.sortByKey == column.key) {
				currentSortedCell = headerCell;
				headerCell.classList.add("sortActive");
			}
			if (colIndex < dataSet.numberOfFixedColumns) {
				headerCell.classList.add("fixed");
				headerCell.style.left = fixedLeft + "px";
				fixedLeft = (fixedLeft + column.width);
			}
		});
	};
	this.tryToFitToFullScreenWidth = function(dataSet){
		// Stretching Last Column if there is any available space --
		let width = element.getBoundingClientRect().width;
		let specifiedWidth = dataSet.columns[dataSet.columns.length - 1].width;
		if (totalColumnWidth < width) {
			// There is empty space on the right side of the grid --
			lastColumnWidth = (specifiedWidth + (width - totalColumnWidth));
			tableHeader.lastElementChild.style.width = lastColumnWidth + "px";
			tableHeader.lastElementChild.style.minWidth = lastColumnWidth + "px";
			tableHeader.lastElementChild.style.maxWidth = lastColumnWidth + "px";
			totalColumnWidth = (totalColumnWidth - specifiedWidth) + lastColumnWidth;
		}else{
			lastColumnWidth = specifiedWidth;
		}
		
		// Setting Total Width --
		tableGrid.style.width = tableHeader.style.width = totalColumnWidth + "px";
	};
	this.updateFooter = function(dataSet){
		// Updating the pagination dropdown list --
		this.updatePagination(dataSet);
		// Updating Global Search --
		if (dataSet.globalSearch == true) {
			globalInput.classList.add("active");
			globalInput.value = dataSet.searchString;
		}else{
			globalInput.classList.remove("active");
			globalInput.value = dataSet.searchString;
		}
		// Update total Records --
		if (dataSet.search == true || dataSet.globalSearch == true) {
			totalRecordsLabel.textContent = dataSet.filteredData.length + " Filtered Records";
		}else{
			totalRecordsLabel.textContent = dataSet.totalRecords + " Records";
		}
		// Update total Pages count --
		totalPagesLabel.textContent = dataSet.totalPages + " Pages";
	};
	this.analyzeData = function(dataSet){
		return new Promise(function(resolve, reject){
			if (dataSet.mode == "local") {
				// Check if the data is already fetched,
				if (dataSet.data.length == 0) {
					// Data needs to be fetched --
					this.fetchFromDataSouce(dataSet).then(function(data){
						dataSet.data = data;
						// If the sort is enabled, then sort the data --
						// Check if sort is enabled --
						if (dataSet.sortByKey !== undefined) {
							this.sortData(dataSet);
						}
						// Now the data is ready --
						// Update the dataset config and calculate the databucket --
						// Updating the dataSet config --
						this.calculateDataBucket(dataSet);
						resolve();
					}.bind(this));
				}else{
					this.calculateDataBucket(dataSet);
					resolve();
				}
			}else if (dataSet.mode == "server") {
				// Fetch data from the server --
				// this.fetchFromDataSouce(dataSet).then(function(data){
				// 	dataSet.data = data;
				// });
			}
		}.bind(this));		
	};
	this.createRow = function(rowData, rowIndex, dataSet){
		let row = document.createElement("div");
		row.classList.add("xTableRow");
		row.setAttribute("index", rowIndex);
		let cell = null;
		let fixedLeft = 0;
		dataSet.columns.forEach((column, colIndex)=>{
			cell = document.createElement("div");
			cell.classList.add("xTableCell");
			cell.setAttribute("index", colIndex);
			if (colIndex == (dataSet.columns.length - 1)) {
				cell.style.width = lastColumnWidth + "px";
				cell.style.minWidth = lastColumnWidth + "px";
				cell.style.maxWidth = lastColumnWidth + "px";
			}else{
				cell.style.width = column['width'] + "px";
				cell.style.minWidth = column['width'] + "px";
				cell.style.maxWidth = column['width'] + "px";
			}
			if(column.format == undefined){
				cell.textContent = rowData[column["key"]];
				row.appendChild(cell);
			}else{
				let formattedCell = column['format'](rowData, rowIndex, colIndex);
				cell.appendChild(formattedCell);
			}
			row.appendChild(cell);

			if (colIndex < dataSet.numberOfFixedColumns) {
				cell.classList.add("fixed");
				cell.style.left = fixedLeft + "px";
				fixedLeft = (fixedLeft + column.width);
			}
		});
		return row;
	};
	this.updatePagination = function(dataSet){
		if (dataSet.totalPages == 0 || dataSet.totalPages == undefined) {
			if (dataSet.totalRecords > 0) {
				dataSet.totalPages = Math.ceil(dataSet.totalRecords/dataSet.numberOfRowsPerPage);	
			}else{
				dataSet.totalRecords = dataSet.data.length;
				dataSet.totalPages = Math.ceil(dataSet.totalRecords/dataSet.numberOfRowsPerPage);
			}			
		}
		if (isNaN(dataSet.totalPages)) {
			dataSet.totalPages = 0;
			pages.setData([]);
		}else if (dataSet.totalPages == 0) {
			pages.setData([]);
		}else if (dataSet.totalPages > 1000) {
			let temp = [];
			for(let i=1; i<=1000; i++){
				temp.push(i);
			}
			pages.setData(temp);
		}else{
			let temp = [];
			for(let i=1; i<=dataSet.totalPages; i++){
				temp.push(i);
			}
			pages.setData(temp);
		}
		// Update Page Number input --
		pageCount.textContent = dataSet.pageNumber;
		if (dataSet.pageNumber == 1) {
			leftNavigation.classList.add("disabled");
		}else{
			leftNavigation.classList.remove("disabled");
		}
		if (dataSet.pageNumber == dataSet.totalPages) {
			rightNavigation.classList.add("disabled");
		}else{
			rightNavigation.classList.remove("disabled");
		}
	};
	this.fetchFromDataSouce = function(dataSet){
		let that = this;
		return new Promise(function(resolve, reject){
			// Use Datasource --
			let formData = {
				fetchCount : dataSet.dataSource.fetchCount,
				fromIndex : (dataSet.pageNumber - 1) * dataSet.numberOfRowsPerPage
			};
			// beforeFetch --
			if (dataSet.beforeFetch != undefined) {
				formData = dataSet.beforeFetch(formData);
			}
			that.addLoading();
			axios.post(dataSet.dataSource.url, formData).then(function(res){
				if (dataSet.afterFetch == undefined) {
					dataSet.data = res.data;
				}else{
					dataSet.data = dataSet.afterFetch(res.data, dataSet);
				}
				that.removeLoading();
				resolve(res.data);
			}).catch(function(error){
				dataSet.data = [];
				that.removeLoading();
				reject(error);
				console.log(error);
			});
		});
	};
	this.sortData = function(dataSet){
		let data;
		if (dataSet.search == true || dataSet.globalSearch == true) {
			data = dataSet.filteredData;
		}else{
			data = dataSet.data;
		}
		obj.sort(data, dataSet.sortByKey, dataSet.sortByDataType, dataSet.sortByOrder);
	};
	this.calculateDataBucket = function(dataSet){
		if(dataSet.search == true || dataSet.globalSearch == true){
			if (dataSet.numberOfRowsPerPage == 0) {
				dataSet.dataBucket = dataSet.filteredData;
			}else{
				let startIndex = dataSet.numberOfRowsPerPage * (dataSet.pageNumber-1);
				let endIndex = startIndex + dataSet.numberOfRowsPerPage;
				dataSet.dataBucket = dataSet.filteredData.slice(startIndex, endIndex);
			}			
		}else{
			if (dataSet.numberOfRowsPerPage == 0) {
				dataSet.dataBucket = dataSet.data;
			}else{
				let startIndex = dataSet.numberOfRowsPerPage * (dataSet.pageNumber-1);
				let endIndex = startIndex + dataSet.numberOfRowsPerPage;
				dataSet.dataBucket = dataSet.data.slice(startIndex, endIndex);
			}
		}
	};
	this.setTotalRecords = function(dataSetName, totalRecords){
		this.dataSets.forEach((dataSet)=>{
			if (dataSet.name == dataSetName) {
				dataSet.totalRecords = totalRecords;
				dataSet.totalPages = Math.ceil(totalRecords/dataSet.numberOfRowsPerPage);
				if (this.currentDataSet.name == dataSetName) {
					this.updatePagination(dataSet);
				}
			}
		});
	};
	this.searchDataSet = function(dataSet){
		let filteredData = dataSet.data;
		Object.keys(dataSet.filters).forEach((searchKey) => {
			let searchString = dataSet.filters[searchKey];
			filteredData = filteredData.filter((item)=>{
				if (item[searchKey] == null || item[searchKey] == "" || item[searchKey] == undefined) {
					return false;
				}else if (typeof item[searchKey] == "string") {
					return !(item[searchKey].toLowerCase().indexOf(searchString.toLowerCase()) == -1);
				}else if(typeof item[searchKey] == 'number'){
					return parseInt(item[searchKey]) == parseInt(searchString);
				}
			});
		});
		if (dataSet.sortByKey == "" || dataSet.sortByKey == undefined || dataSet.sortByKey == null) {
		}else{
			obj.sort(filteredData, dataSet.sortByKey, dataSet.sortByDataType, dataSet.sortByOrder);
		}

		// Updating the dataSet --
		dataSet.filteredData = filteredData;
		dataSet.pageNumber = 1;
	};
	this.searchInAll = function(dataSet, searchString){
		return dataSet.data.filter(function(item){
			let keys = Object.keys(item);
			let value = "";
			let matchFound = false;
			for(let i=0; i<keys.length; i++){
				matchFound = false;
				value = item[keys[i]];
				if (value != 0 && (value == null || value == undefined || value == "")) {
					matchFound = false;
				}else if (typeof value == "string") {
					matchFound = !(value.toLowerCase().indexOf(searchString.toLowerCase()) == -1);
				}else if (typeof value == "number") {
					matchFound = parseInt(value) == parseInt(searchString);
				}
				if (matchFound) {
					break;
				}
			}
			return matchFound;
		});
	};
	this.clearSearch = function(dataSet){
		dataSet.pageNumber = 1;
		this.clearFilterInputs(dataSet);
		this.clearGlobalSearchInput(dataSet);
		this.createPage(dataSet);
	};
	this.clearFilterInputs = function(dataSet){
		dataSet.search = false;
		dataSet.filters = {};
		Array.prototype.forEach.call(tableHeader.children, function(header){
			let headerSearch = header.querySelector(".xTableHeaderSearchContainer");
			let searchInput = header.querySelector(".xTableHeaderSearchContainer input");
			if (headerSearch != null) {
				headerSearch.classList.remove("active");
				searchInput.value = "";
			}
		});
	};
	this.clearGlobalSearchInput = function(dataSet){
		globalInput.classList.remove("active");
		globalInput.value = "";
		dataSet.globalSearch = false;
		dataSet.searchString = "";
	};

	return this;
}
export default xTable;