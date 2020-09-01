function xDropDown(element){
	this.element = element;
	this.disabled = false;
	this.active = false;
	// Variables --
	let position = element.getAttribute("position"), hover = element.getAttribute("hover"), mobileModal = element.getAttribute("mobile-modal");
	if (position == null) {position = "left";}
	if (hover == null) {
		hover = false;
	}else{
		hover = true;
	}
	if (mobileModal == null) {
		mobileModal = false;
	}else{
		mobileModal = true;
	}

	// DOM --
	element.classList.add("xDropDown");
		let trigger = element.querySelector("[trigger]");
		if (trigger == null) {
			trigger = document.createElement("div");
			trigger.setAttribute("trigger", "trigger");
			element.appendChild(trigger);
		}
		trigger.classList.add("xDropdownTrigger");

		let container = document.createElement("div");
		container.classList.add("xDropdownContentContainer");
		element.appendChild(container);
			let content = element.querySelector("[content]");
			if (content == null) {
				content = document.createElement("div");
				content.setAttribute("content", "content");
			}
			content.classList.add("xDropdownContent");
			container.appendChild(content);
	

	// Methods --
	this.onClick = function(event){};
	this.onOpen = function(){};
	this.onClose = function(){};
	this.open = function(){
		if (this.disabled == true) {
			return;
		}
		this.active = true;
		element.classList.add("active");
		if (screen.width < 700 && mobileModal == true) {
			container.style.display = "block";
			container.classList.add("MobileModal");
		}else{
			container.style.display = "block";
			if (position == "left") {
				container.style.left = "0";
				container.style.right = "unset";
			}else if (position == "right") {
				container.style.right = "0";
				container.style.left = "unset";
			}

			// Get Top position of the element --
			let viewportOffset = trigger.getBoundingClientRect();
			let triggerFromTop = viewportOffset.top;
			// Get Element Height --
			let triggerHeight = trigger.offsetHeight;
			// Screen Height --
			let windowHeight = document.documentElement.clientHeight;
			// Popup Height --
			let contentHeight = container.clientHeight;
			if ( (windowHeight - (triggerFromTop+triggerHeight)) > contentHeight) {
				// Can be placed at the bottom --
				container.style.bottom = "unset";
				container.style.top = triggerHeight+"px";			
			}else{
				// cannot be placed at the bottom, show upwards --
				// check if the content can be placed at the top --
				if (triggerFromTop >= contentHeight) {
					// Show at the top --
					container.style.top = "unset";
					container.style.bottom = triggerHeight+"px";
				}else{
					// It cannot be placed even at the top --
					// Showing it at the bottom --
					container.style.bottom = "unset";
					container.style.top = triggerHeight+"px";
				}
			}
		}

		this.onOpen();
	};
	this.close = function(){
		this.active = false;
		element.classList.remove("active");
		container.style.display = "none";
		this.onClose();
	};
	this.toggle = function(){
		if (container.style.display == "none") {
			this.open();
		}else{
			this.close();
		}
	};
	this.setTrigger = function(element){
		if (element.nodeType === Node.ELEMENT_NODE) {
			trigger.innerHTML = "";
			trigger.appendChild(element);
		}else if (typeof trigger == "string") {
			trigger.textContent = element;
		}
	};
	this.setContent = function(element){
		if (element.nodeType === Node.ELEMENT_NODE) {
			content.innerHTML = "";
			content.appendChild(element);
		}else if (typeof content == "string") {
			content.textContent = element;
		}
	};
	this.disable = function(){
		this.disabled = true;
		element.classList.add("disabled");
	};
	this.enable = function(){
		this.disabled = false;
		element.classList.remove("disabled");
	};

	element.addEventListener("mouseenter", function(event){
		if (hover == true) {
			this.open();
		}
	}.bind(this));
	element.addEventListener("mouseleave", function(event){
		if (hover == true) {
			this.close();
		}
	}.bind(this));
	element.addEventListener("click", function(event){
		if (event.target.closest(".xDropdownTrigger") == trigger) {
			this.open();
		}else if (event.target.closest(".xDropdownContent") == content) {
			this.onClick(event);
		}
	}.bind(this));
	container.addEventListener("click", function(event){
		if (event.target == container && mobileModal == true) {
			this.close();
			event.preventDefault();
		}
	}.bind(this));
	document.addEventListener("click", function(event){
		let parent = event.target;
		let matchFound = false;
		while(true){
			if (parent == element) {
				matchFound = true;
				break;
			}
			if (parent == document.body || parent == null) {
				break;
			}
			parent = parent.parentNode;
		}
		if (matchFound == false) {
			if (this.active == true) {
				this.close();
			}			
		}
	}.bind(this));
	this.close();

	return this;
}
export default xDropDown;