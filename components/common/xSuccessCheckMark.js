function xSuccessCheckMark(element){
	this.element = element;
	// Private Variable --
	element.classList.add("xSuccessCheckMark");
	element.classList.add("success-checkmark");
		let check = document.createElement("div");
		check.classList.add("check-icon");
		element.appendChild(check);
			let lineTip = document.createElement("span");
			lineTip.classList.add("icon-line");
			lineTip.classList.add("line-tip");
			check.appendChild(lineTip);

			let lineLong = document.createElement("span");
			lineLong.classList.add("icon-line");
			lineLong.classList.add("line-long");
			check.appendChild(lineLong);

			let iconCircle = document.createElement("div");
			iconCircle.classList.add("icon-circle");
			check.appendChild(iconCircle);

			let iconFix = document.createElement("div");
			iconFix.classList.add("icon-fix");
			check.appendChild(iconFix);

	return this;
}
export default xSuccessCheckMark;