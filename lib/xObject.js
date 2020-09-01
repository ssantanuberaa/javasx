function xObject(){
	this.calculateInsertionPointInSortedArray = function(array, newItem, key, dataType, sortOrder){
		let index = -1;
		if(dataType == "Date"){
			let bDate = (new Date(newItem[key])).valueOf();
			for(let i=0; i<array.length; i++){
				let aDate = (new Date(array[i][key])).valueOf();
				if (sortOrder == true) { // Ascending Order --
					if (aDate >= bDate) {
						index = i;
						break;
					}
				}else{ // Descending Order --
					if (aDate >= bDate) {
					}else{
						index = i;
						break;
					}
				}
			}
		}
		if (index == -1) {
			index = array.length;
		}
		return index;
	};
	this.mergeObject = function(obj1, obj2){
		let obj = {};
		if (obj1 != undefined) {
			Object.keys(obj1).forEach((key)=>{
				obj[key] = obj1[key];
			});
		}
		if (obj2 != undefined) {
			Object.keys(obj2).forEach((key)=>{
				obj[key] = obj2[key];
			});
		}
		return obj;
	};
	this.groupBy = function(dataSet, key, dataType){
		if (dataSet == null || dataSet == undefined || dataSet.length == 0){
			return [];
		}
		let group = [];
		dataSet.forEach((data)=>{
			let value = data[key];

			if (value == null) {
				value = "null";
			}
			if (dataType == "Date") {
				if (value != null) {
					value = value.substr(0, 10);	
				}				
			}

			let matchFound = false;
			for(let i = 0; i<group.length; i++){
				if (group[i].name == value) {
					group[i].data.push(data);
					matchFound = true;
					break;
				}
			}
			if (matchFound == false) {
				group.push({
					name : value,
					data : [data],
				});
			}
		});
		return group;
	};
	this.findItem = function(data, key, value){
		let matchFound = false;
		let item = null;
		for(let i = 0; i < data.length; i++){
			if (data[i][key] == value) {
				matchFound = true;
				item = data[i];
				break;
			}
		}
		if (matchFound) {
			return item;
		}else{
			return null;
		}
	};
	this.replaceItem = function(data, oldItem, newItem){
		if (oldItem == null) {
			return;
		}
		let index = data.indexOf(oldItem);
		if (index >= 0) {
			data[index] = newItem;
		}
	};
	this.sort = function(data, key, dataType, order){
		dataType = dataType.toLowerCase();
		if (dataType == "date" || dataType == "time" || dataType == "datetime" || dataType == "timestamp") {
			data.sort(function(a, b){
				if (a == null || b == null) {
					return 0;
				}
				if (order == false) { // DESC --
					return new Date(b[key]) - new Date(a[key]);
				}else{ // ASC --
					return new Date(a[key]) - new Date(b[key]);
				}		
			});
		}else if (dataType == "string") {
			data.sort(function(a, b){
				if (a[key] == null || a[key] == "" || b[key] == null || b[key] == "") {
					return 0;
				}
				if (order == true) {
					if (a[key].toLowerCase() >= b[key].toLowerCase()) {
						return 1;
					}else{
						return -1;
					}
				}else{
					if (a[key].toLowerCase() <= b[key].toLowerCase()) {
						return 1;
					}else{
						return -1;
					}
				}
			});
		}else if (dataType == "number") {
			data.sort((a, b)=>{
				if (order == true) {
					if (parseInt(a[key]) >= parseInt(b[key])) {
						return 1;
					}else{
						return -1;
					}
				}else{
					if (parseInt(a[key]) <= parseInt(b[key])) {
						return 1;
					}else{
						return -1;
					}
				}
			});
		}
	};
	this.removeItem = function(dataSet, data){
		let removed = false;
		if (dataSet != undefined || dataSet != undefined) {
			dataSet.forEach((item, index)=>{
				if (item == data) {
					removed = true;
					dataSet.splice(index, 1);
				}
			});
		}
		return removed;
	};
}
let obj = new xObject();
export default obj;