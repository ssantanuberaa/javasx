import dom from "../../lib/xDOM.js";
import system from "../../lib/xSystem.js";
function xSearchBar(element){
	this.element = element;
	this.active = false;

	// DOM --
	element.classList.add("xSearchBar");
		let input = dom.createElement("input", {classNames : "xSearchBarInput", placeholder : "Type and Enter to Search..."});
		element.appendChild(input);

		let icon = dom.createElement("i", {classNames : "fa fa-search"});
		element.appendChild(icon);

		let cross = dom.createElement("i", {classNames : "CancelSearch material-icons"});
		cross.textContent = "close";
		element.appendChild(cross);


	// Instance Methods --
	this.onSearch = function(string, event){
		system.log("Override the method : onSearch");
	};
	this.setText = function(text){
		input.value = text;
		this.showCross();
		this.active = true;
	};
	this.onCancelSearch = function(event){
		system.log("Override the method : onCancelSearch");
	};
	this.showCross = function(){
		cross.style.display = "block";
		icon.style.display = "none";
	};
	this.hideCross = function(){
		cross.style.display = "none";
		icon.style.display = "block";
	};
	// Watching --
	cross.addEventListener("click", function(event){
		// Clear Search --
		this.hideCross();
		this.active = false;
		input.value = "";
		this.onCancelSearch();
	}.bind(this));
	input.addEventListener("keyup", function(event){
		let code = (event.keyCode ? event.keyCode : event.which);
		if (code == 13) { // 13 For Enter Key
			this.active = true;
			this.showCross();
			this.onSearch(event.target.value, event);
		}
	}.bind(this));
	icon.addEventListener("click", function(event){
		this.active = true;
		this.showCross();
		this.onSearch(input.value, event);
	}.bind(this));

	return this;
}
export default xSearchBar;