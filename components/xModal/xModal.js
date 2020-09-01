function xModal(element){
	this.element = element;
	let animationOpen = "xModalOpen";
	let animationClose = "xModalClose";
	this.active = false;
	let backgroundClose = element.getAttribute("background-close");
	if (backgroundClose == null) {
		backgroundClose = false;
	}else{
		backgroundClose = true;
	}
	let freezePage = element.getAttribute("freeze-page");
	if (freezePage == null) {
		freezePage = false;
	}else{
		freezePage = true;
	}

	// DOM --	
	element.classList.add("xModal");
		let modalContainer = document.createElement("div");
		modalContainer.classList.add("xModalContainer");

			let modalOverlay = document.createElement("div");
			modalOverlay.classList.add("xModalOverlay");
			modalContainer.appendChild(modalOverlay);

			let modalContent = document.createElement("div");
			modalContent.classList.add("xModalContent");
			while(element.children.length){
				modalContent.appendChild(element.firstElementChild);
			}
			modalContainer.appendChild(modalContent);

			element.appendChild(modalContainer);
	
	let closeButton = element.querySelector("[close]");
	if (closeButton != null) {
		closeButton.addEventListener("click", function(event){
			this.close();
		}.bind(this));
	}

	// Methods --
	this.onClose = function(){};
	this.onOpen = function(){};
	this.open = function(){
		modalContent.classList.remove(animationClose);
		modalContent.classList.add(animationOpen);
		element.style.display = "flex";
		this.active = true;
		if (freezePage == true) {
			document.documentElement.style.overflowY = "hidden";
		}
		this.onOpen();
	};
	this.close = function(){
		modalContent.classList.remove(animationOpen);
		modalContent.classList.add(animationClose);
		setTimeout(function(){
			element.style.display = "none";
			this.onClose();
			if (freezePage == true) {
				document.documentElement.style.overflowY = "scroll";
			}
		}.bind(this), 250);
		this.active = false;
	};
	this.toggle = function(){
		if (this.active) {
			this.close();
		}else{
			this.open();
		}
	};
	this.setContent = function(content){
		modalContent.innerHTML = "";
		modalContent.appendChild(content);
	};

	// Watching --
	modalOverlay.addEventListener("click", function(event){
		if (backgroundClose == true) {
			this.close();
		}
	}.bind(this));

	return this;
}
export default xModal;