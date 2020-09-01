import dom from "../../lib/xDOM.js";
function xMenuDrawer(element){
	this.element = element;
	this.active = false;
	let nav = element.querySelector("[nav]");
	let content = element.querySelector("[content]");

	// DOM --
	element.classList.add("xMenuDrawer");
		let container = dom.createElement("div", {classNames : "xMenuDrawerContainer"});
		element.appendChild(container);
			if (nav == null) {
				nav = dom.createElement("div", {classNames : "xMenuDrawerNav"});
				container.appendChild(nav);
			}else{
				nav.classList.add("xMenuDrawerNav");
			}
			if (content == null) {
				content = dom.createElement("div", {classNames : "xMenuDrawerContent"});
				container.appendChild(content);
			}else{
				content.classList.add("xMenuDrawerContent");
			}

	this.setNav = function(el){
		nav.innerHTML = "";
		nav.appendChild(el);
	};
	this.setContent = function(el){
		content.innerHTML = "";
		content.appendChild(el);
	};
	this.open = function(){
		element.classList.add("active");
		this.active = true;
	};
	this.close = function(){
		element.classList.remove("active");
		this.active = false;
	};
	this.toggle = function(){
		if (this.active) {
			this.close();
		}else{
			this.open();
		}
	};
	this.positionToBottom = function(){
		var vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		element.style.top = (vh - 50) + "px";
		container.style.top = (vh - 50) + "px";
	};
	this.positionToBottom();

	if (element.getAttribute("mobile-only") != null) {
		if (screen.width >= 700) {
			element.style.display = "none";
		}
	}

	element.addEventListener("click", function(event){
		if (event.target == element.firstElementChild) {
			this.close();
		}
	}.bind(this));

	window.addEventListener('onorientationchange', this.positionToBottom, true);
	window.addEventListener('resize', this.positionToBottom, true);

	return this;

}
export default xMenuDrawer;