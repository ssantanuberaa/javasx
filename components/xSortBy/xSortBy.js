import dom from "../../lib/xDOM.js";
import system from "../../lib/xSystem.js";
import xDropDown from "../xDropDown/xDropDown.js";
function xSortBy(element){
	this.element = element;
	this.dataSet = [];
	let selectedSortNode = null;
	this.currentSort = null;

	// DOM --
	element.classList.add("xSortBy");

		let sortContainer = dom.createXElement(xDropDown, {type : "xDropDown", classNames : "xSortByContainer"});
		let trigger = document.createElement("div");
		trigger.classList.add("xSortByTrigger");
		sortContainer.setTrigger(trigger);
		element.appendChild(sortContainer.element);
			let icon = document.createElement("i");
			icon.classList.add("material-icons");
			icon.textContent = "sort";
			trigger.appendChild(icon);

			let label = document.createElement("label");
			label.textContent = element.getAttribute("label");
			trigger.appendChild(label);

			let sortByText = document.createElement("label");
			sortByText.classList.add("xSortByLabel");
			trigger.appendChild(sortByText);

		let content = document.createElement("div");
		content.classList.add("xSortByContent");
		sortContainer.setContent(content);		

	// Instance Methods --
	this.render = function(){
		content.innerHTML = "";
		this.dataSet.forEach(function(item, index){
			let node = document.createElement("div");
			node.textContent = item;
			node.setAttribute("index", index);
			node.classList.add("xSortItem");
			content.appendChild(node);
		});
	};
	this.setData = function(data){
		this.dataSet = data;
		this.render();
	};
	this.onSort = function(item){
		system.log("Override the method : onSort");
	};
	this.setCurrentSort = function(label){
		this.dataSet.forEach((item, index)=>{
			if (item == label) {
				if (selectedSortNode != null) {
					selectedSortNode.classList.remove("Selected");
				}
				selectedSortNode = content.querySelector("[index='"+index+"']");
				selectedSortNode.classList.add("Selected");
				sortByText.textContent = " : " + item;
				this.currentSort = item;
				this.onSort(item);
			}
		});
	};

	// Watching --
	content.addEventListener("click", function(event){
		if (event.target.closest(".xSortItem")) {
			if (selectedSortNode != null) {
				selectedSortNode.classList.remove("Selected");
			}
			selectedSortNode = event.target.closest(".xSortItem");
			selectedSortNode.classList.add("Selected");
			let index = parseInt(selectedSortNode.getAttribute("index"));
			let sortData = this.dataSet[index];
			sortByText.textContent = " : " + sortData;
			this.onSort(sortData);
			this.currentSort = sortData;
		}
	}.bind(this));


	return this;
}
export default xSortBy;