import xIcon from "../xIcon/xIcon.js";
import dom from "../../lib/xDOM.js";
function xMobileNav(element){
	this.element = element;
	this.selectedItem = null;
	this.options = null;

	// DOM --
	element.classList.add("xMobileNav");

	this.onClick = function(label){};
	this.setData = function(data){
		this.options = data;
		data.forEach(function(item){
			let node = dom.createElement("div", { classNames : "xMobileNavItem", label : item.label});
				let icon = dom.createXElement(xIcon, {type : "xIcon", icon : item.icon});
				node.appendChild(icon.element);
				let label = dom.createElement("div", {classNames : "xMobileNavItemText"});
				label.textContent = item.label;
				node.appendChild(label);
			element.appendChild(node);
		});
	};
	this.hideItem = function(label){
		let node = element.querySelector("[label='"+ label +"']");
		if (node != null) {
			node.classList.add("hide");
		}
	};
	this.showItem = function(label){
		let node = element.querySelector("[label='"+ label +"']");
		if (node != null) {
			node.classList.remove("hide");
		}
	};
	this.highlightItem = function(label){
		let node = element.querySelector("[label='"+ label +"']");
		if (node != null) {
			if (this.selectedItem != null) {
				this.selectedItem.classList.remove("highlight");
			}
			node.classList.add("highlight");
			this.selectedItem = node;
		}
	};

	// Watching --
	element.addEventListener("click", function(event){
		if (event.target.closest(".xMobileNavItem")) {
			let node = event.target.closest(".xMobileNavItem");
			let label = node.getAttribute("label");
			this.options.forEach((item)=>{
				if (item.label == label) {
					if (item.onClick == undefined) {
						this.onClick(label);
					}else{
						item.onClick();
					}
				}
			});
		};
	}.bind(this));

	return this;
}
export default xMobileNav;