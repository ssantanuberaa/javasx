import dom from "../../lib/xDOM.js";
import obj from "../../lib/xObject.js";
import xModal from "../xModal/xModal.js";
import xButton from "../xButton/xButton.js";
import xSuccessCheckMark from "../common/xSuccessCheckMark.js";
import xErrorAlertAnimation from "../common/xErrorAlertAnimation.js";
function xAlert(element){
	this.element = element;
	let titleText = element.getAttribute("title");
	let messageText = element.getAttribute("message");
	let alertSymbol = null;
	
	// DOM --
	element.classList.add("xAlert");
		let modal = dom.createXElement(xModal, obj.mergeObject({type : "xModal"}, dom.extractAttributes(element, ['background-close', 'freeze-page'])));
		element.appendChild(modal.element);

			let contentContainer = document.createElement("div");
			contentContainer.classList.add("xAlertContent");
				let headerContainer = document.createElement("div");
				headerContainer.classList.add("xAlertHeader");
				contentContainer.appendChild(headerContainer);

					if (element.getAttribute("state") == "success") {
						element.classList.add("success");
						alertSymbol = dom.createXElement(xSuccessCheckMark, {type : "xSuccessCheckMark", theme: "vidhikarya.default"});
						headerContainer.appendChild(alertSymbol.element);
					}else if (element.getAttribute("state") == "error") {
						element.classList.add("error");
						alertSymbol = dom.createXElement(xErrorAlertAnimation, {type : "xErrorAlertAnimation", theme: "vidhikarya.default"});
						headerContainer.appendChild(alertSymbol.element);
					}

					let title = document.createElement("div");
					title.classList.add("xAlertTitle");
					title.textContent = titleText;
					headerContainer.appendChild(title);

				let alertContent = document.createElement("div");
				alertContent.classList.add("AlertContent");
				contentContainer.appendChild(alertContent);
					let message = document.createElement("div");
					message.classList.add("xAlertMessage");
					message.innerHTML = messageText;
					alertContent.appendChild(message);

				let button = dom.createXElement(xButton, {type: "xButton", label: "Ok"});
				contentContainer.appendChild(button.element);

			modal.setContent(contentContainer);

	// Instance Methods --
	this.onClose = function(event){
		this.close();
	};
	this.close = function(){
		modal.close();
	};
	this.open = function(){
		element.style.display = "block";
		if (alertSymbol == null) {
		}else{
			alertSymbol.element.display = "block";
		}
		modal.open();
	};
	this.setTitle = function(value){
		titleText = value;
		title.innerHTML = value;
	};
	this.setMessage = function(value){
		messageText = value;
		message.innerHTML = value;
	};
	modal.onClose = function(){
		element.style.display = "none";
		if(alertSymbol == null){
		}else{
			alertSymbol.element.display = "none";
		}
	}
	// Watching --
	button.onClick = function(event){
		this.onClose(event);
	}.bind(this);

	return this;
}
export default xAlert;