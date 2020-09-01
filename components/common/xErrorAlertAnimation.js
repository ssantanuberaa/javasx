function xErrorAlertAnimation(element){
	this.element = element;

	// DOM --
	element.classList.add("xErrorAlertAnimation");
	let container = document.createElement("div");
	container.className = "swal2-icon swal2-error swal2-animate-error-icon";
	element.appendChild(container);
		let mark = document.createElement("span");
		mark.classList.add("swal2-x-mark");
		container.appendChild(mark);
			let lineLeft = document.createElement("span");
			lineLeft.className = "swal2-x-mark-line-left";
			mark.appendChild(lineLeft);

			let lineRight = document.createElement("span");
			lineRight.className = "swal2-x-mark-line-right";
			mark.appendChild(lineRight);	  

	return this;
}
export default xErrorAlertAnimation;