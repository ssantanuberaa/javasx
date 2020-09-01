import dom from "../../lib/xDOM.js";
import xIcon from "../xIcon/xIcon.js";
function xExpand(element){
	this.element = element;
	this.active = false;
	let trigger, triggerIcon, triggerText, triggerExpandIcon = null;

	// DOM --
	element.classList.add("xExpand");
		trigger = document.createElement("div");
		trigger.classList.add("Trigger");
			// If label is present it means it should render the trigger otherwise the trigger will be empty --
			if (element.getAttribute("label")) {
				triggerIcon = dom.createXElement(xIcon, dom.mergeObject({type : "xIcon"}, dom.extractAttributes(element, ['font-awesome-icon', 'material-icon', 'image-icon', 'icon'])));
				trigger.appendChild(triggerIcon.element);
			
				triggerText = document.createElement("div");
				triggerText.classList.add("TriggerText");
				triggerText.textContent = element.getAttribute("label");
				trigger.appendChild(triggerText);			
				
				triggerExpandIcon = document.createElement("div");
				triggerExpandIcon.classList.add("TrigerExpandIcon");
				trigger.appendChild(triggerExpandIcon);
			}

		let content = document.createElement("div");
		content.classList.add("Content");
		while(element.children.length){
			content.appendChild(element.firstElementChild);
		}

		element.appendChild(trigger);
		element.appendChild(content);

	// Instance Methods --
	this.onClick = function(event){};
	this.hide = function(){
		this.active = false;
		content.style.display = "none";
		if (triggerExpandIcon != null) {
			triggerExpandIcon.classList.remove("Rotate");
		}
	};
	this.show = function(){
		this.active = true;
		content.style.display ="block";
		if(triggerExpandIcon != null){
			triggerExpandIcon.classList.add("Rotate");
		}
	};
	this.toggle = function(){
		if (this.active == true) {
			this.hide();
		}else{
			this.show();
		}
	};
	this.setContent = function(element){
		content.innerHTML = "";
		content.appendChild(element);
	};
	this.setTrigger = function(element){
		trigger.innerHTML = "";
		trigger.appendChild(element);
	}

	this.hide();

	// Watching --
	trigger.addEventListener("click", function(event){
		this.toggle();
		this.onClick(event);
	}.bind(this));

	return this;
}
export default xExpand;