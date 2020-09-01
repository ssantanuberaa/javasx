function xIcon(element){
	this.element = element;
	this.icon = null;

	// DOM --
	element.classList.add("xIcon");
		
	this.render = function(){
		element.innerHTML = "";
		if (element.getAttribute("font-awesome-icon") != null) {
			this.icon = document.createElement("i");
			this.icon.className = "fa " + element.getAttribute("font-awesome-icon");
		}else if (element.getAttribute("material-icon") != null) {
			this.icon = document.createElement("i");
			this.icon.className = "material-icons";
			this.icon.textContent = element.getAttribute("material-icon");
		}else if (element.getAttribute("image-icon") != null) {
			this.icon = document.createElement("img");
			this.icon.classList.add("image-icon");
			this.icon.setAttribute("src", element.getAttribute("image-icon"));
		}else if (element.getAttribute("icon")) {
			let iconName = element.getAttribute("icon");
			if (iconName == null) {}else{
				let iconType = iconName.split(",")[0];
				iconName = iconName.split(",")[1];
				if(iconType == "font-awesome-icon"){
					this.icon = document.createElement("i");
					this.icon.className = "fa " + iconName;
				}else if (iconType == "material-icon") {
					this.icon = document.createElement("i");
					this.icon.className = "material-icons";
					this.icon.textContent = iconName;
				}else if (iconType == "image-icon") {
					this.icon = document.createElement("img");
					this.icon.classList.add("image-icon");
					this.icon.setAttribute("src", element.getAttribute("image-icon"));
				}
			}
		}
		if (this.icon != null) {
			element.classList.add("hasIcon");
			element.appendChild(this.icon);
		}
	};
	this.changeIcon = function(iconName){
		element.setAttribute("icon", iconName);
		this.render();
	};

	this.render();
	return this;
}
export default xIcon;