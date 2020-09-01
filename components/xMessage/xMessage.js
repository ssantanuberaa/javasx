import dom from "../../lib/xDOM.js";
import xIcon from "../xIcon/xIcon.js";
function xMessage(element){
	this.element = element;

	let state = "", icon, messageContent;

	this.render = function(){
		this.element.classList.add("xMessage");
		state = element.getAttribute("state");
		if (state == "" || state == null) {
			state = "success";
		}
		if (state == "success") {
			element.classList.add("success");
			icon = dom.createXElement(xIcon, {type : "xIcon", icon : "material-icon,check"});
		}else if (state == "error") {
			element.classList.add("error");
			icon = dom.createXElement(xIcon, {type: "xIcon", icon: "material-icon,error"});
		}else if (state == "info") {
			element.classList.add("info");
			icon = dom.createXElement(xIcon, {type : "xIcon", icon: "material-icon,info"});
		}

		messageContent = document.createElement("div");
		messageContent.classList.add("xMessageContent");
		while(element.children.length){
			messageContent.appendChild(element.firstElementChild);
		}
		element.appendChild(icon.element);		
		element.appendChild(messageContent);
	};
	this.init = function(){
		this.render();
	};
	this.hide = function(){
		element.style.display = "none";
	};
	this.show = function(){
		element.style.display = "flex";
	};
	this.init();

	return this;
}
export default xMessage;