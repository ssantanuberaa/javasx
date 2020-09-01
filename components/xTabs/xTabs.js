function xTabs(element){
	// Instance Properties --
	this.element = element;
	let tabHeader = null, tabContent = null;

	// Instance Methods --
	this.onTabChange = function(tabname){};
	this.tabHeaderItemFormatter = function(tab){
		let el = document.createElement("div");
			el.classList.add("xTabsHeaderItemContent");
			let label = document.createElement("div");
			label.textContent = tab.getAttribute("label");
			el.appendChild(label);

			if (tab.getAttribute("counter") != null) {
				let counter = document.createElement("div");
				counter.classList.add("xTabsCounter");
				counter.textContent = tab.getAttribute("counter");
				el.appendChild(counter);
			}
		return el;
	};
	this.addTab = function(tab){
		let label = tab.getAttribute("label");

		// Create a Header Item --
		let tabHeaderItem = document.createElement("div");
		tabHeaderItem.classList.add("xTabsHeaderItem");
		tabHeaderItem.setAttribute("for", label);
		tabHeaderItem.appendChild(this.tabHeaderItemFormatter(tab));
		tabHeader.appendChild(tabHeaderItem);
		// Create a Tab --
		let tabItem = document.createElement("div");
		tabItem.classList.add("xTabsContentItem");
		tabItem.setAttribute("label", label);
		tabItem.appendChild(tab);
		tabContent.appendChild(tabItem);

		if (tab.getAttribute("active") != null) {
			this.goToTab(label);
		}
	};
	this.goToTab = function(tabname){
		Array.prototype.forEach.call(tabHeader.children, function(tabHeaderItem){
			if (tabHeaderItem.getAttribute("for") == tabname) {
				tabHeaderItem.classList.add("active");
			}else{
				tabHeaderItem.classList.remove("active");
			}
		}.bind(this));
		Array.prototype.forEach.call(tabContent.children, function(tab){
			if (tab.getAttribute("label") == tabname) {
				tab.classList.add("active");
			}else{
				tab.classList.remove("active");
			}
		});		
		this.onTabChange(tabname);
	};
	this.setCounter = function(tabname, count){
		Array.prototype.forEach.call(tabHeader.children, function(tabHeaderItem){
			if (tabHeaderItem.getAttribute("for") == tabname) {
				let counterNode = tabHeaderItem.querySelector(".xTabsCounter");
				if (counterNode != null) {
					counterNode.textContent = count;
					if (count == "" || count == null || count == false) {
						counterNode.style.display = "none";
					}else{
						counterNode.style.display = "block";
					}
				}
			}
		});
	};
	this.getCurrentTabName = function(){
		let activeTab;
		activeTab = tabHeader.querySelector(".active");
		return activeTab.getAttribute("for");
	};

	// DOM --
	element.classList.add("xTabs");
		let tabContainer = document.createElement("div");
		tabContainer.classList.add("xTabsContainer");			
			tabHeader = document.createElement("div");
			tabHeader.classList.add("xTabsHeader");
			tabContainer.appendChild(tabHeader);

			tabContent = document.createElement("div");
			tabContent.classList.add("xTabsContent");
			tabContainer.appendChild(tabContent);

			if (element.children.length>0) {
				while(element.children.length){
					this.addTab(element.firstElementChild);
				}
			}
	element.appendChild(tabContainer);

	// Watching --
	tabHeader.addEventListener("click", function(event){
		if (event.target.closest(".xTabsHeaderItem")) {
			let tab = event.target.closest(".xTabsHeaderItem");
			this.goToTab(tab.getAttribute("for"));
		}
	}.bind(this));

	// Attribute Configuration --
	if (element.getAttribute("header") == "false") {
		tabHeader.style.display = "none";
	}

	return this;
}
export default xTabs;