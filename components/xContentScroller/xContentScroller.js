function xContentScroller(element, options){
	if (options == undefined) {
		options = {};
	}
	this.el = element;
	let scrollBy = options.scrollBy == undefined ? 600 : options.scrollBy;
	this.el.classList.add("xContentScrollerContent");
	let container = document.createElement("div");
	container.classList.add("xContentScrollerContainer");
	let leftSection = document.createElement("div");
	let rightSection = document.createElement("div");
	leftSection.classList.add("xContentScrollerLeftSection");
	rightSection.classList.add("xContentScrollerRightSection");

	let leftIconContainer = document.createElement("div");
	leftIconContainer.classList.add("xContentScrollerIconContainer");
	let leftIcon = document.createElement("i");
	leftIcon.classList.add("material-icons");	
	leftIcon.textContent = "keyboard_arrow_left";

	let rightIconContainer = document.createElement("div");
	rightIconContainer.classList.add("xContentScrollerIconContainer");
	let rightIcon = document.createElement("i");
	rightIcon.classList.add("material-icons");
	rightIcon.textContent = "keyboard_arrow_right";

	leftIconContainer.appendChild(leftIcon);
	rightIconContainer.appendChild(rightIcon);
	leftSection.appendChild(leftIconContainer);
	rightSection.appendChild(rightIconContainer);

	this.el.parentNode.insertBefore(container, this.el.nextSibling);
	container.appendChild(leftSection);
	container.appendChild(this.el);
	container.appendChild(rightSection);

	rightIconContainer.style.visibility = "hidden";
	leftIconContainer.style.visibility = "hidden";

	let scrollAmount = 0;

	this.scrollRight = function(value){
		if (value==undefined) {
			scrollAmount = scrollAmount + scrollBy;
		}else{
			scrollAmount = scrollAmount + value;
		}
		this.el.scroll({
			top: 0, 
			left: scrollAmount,
			behavior: 'smooth'
		});
		this.checkScroll();
	}

	this.scrollLeft = function(value){
		if (value==undefined) {
			scrollAmount = scrollAmount - scrollBy;
		}else{
			scrollAmount = scrollAmount - value;
		}
		this.el.scroll({
			top: 0, 
			left: scrollAmount,
			behavior: 'smooth'
		});
		this.checkScroll();	
	}

	leftIconContainer.addEventListener("click", function(e){
		this.scrollLeft();
	}.bind(this));
	rightIconContainer.addEventListener("click", function(e){
		this.scrollRight();
	}.bind(this));

	this.checkScroll =  function(){
		let availableScroll = this.el.scrollWidth - this.el.clientWidth;
		if (scrollAmount>availableScroll) {
			scrollAmount = availableScroll;
			rightIconContainer.style.visibility = "hidden";
			leftIconContainer.style.visibility = "visible";
		}else if (scrollAmount<0) {
			scrollAmount = 0;
			leftIconContainer.style.visibility = "hidden";
			rightIconContainer.style.visibility = "visible";
		}else{
			rightIconContainer.style.visibility = "visible";
			leftIconContainer.style.visibility = "visible";
		}
	};

	this.resetNavigationVisibility = function(){
		if (this.el.scrollWidth == 0) {
			return false;
		}
		let availableScroll = this.el.scrollWidth - this.el.clientWidth;
		if (availableScroll <=0 ) {
			rightIconContainer.style.visibility = "hidden";
			leftIconContainer.style.visibility = "hidden";
		}else{
			rightIconContainer.style.visibility = "visible";
			leftIconContainer.style.visibility = "hidden";
		}
		this.el.scrollLeft = 0;
	};
	if (document.readyState == "complete") {
		this.resetNavigationVisibility();
	}else{
		let timer = null;
		if (this.resetNavigationVisibility() == false) {
			timer = setInterval(function(){				
				if (this.resetNavigationVisibility() == undefined) {
					clearInterval(timer);
				}
			}.bind(this), 10);
		}
	}	
	return this;
}
export default xContentScroller;