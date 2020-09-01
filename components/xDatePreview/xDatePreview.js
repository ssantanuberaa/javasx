import datetime from "../../lib/xDateTime.js";
function xDatePreview(element){
	this.element = element;
	this.date = "";

	element.classList.add("xDatePreview");
		let dayNode = document.createElement("div");
		dayNode.classList.add("dayPreview");
		element.appendChild(dayNode);

		let monthNode = document.createElement("div");
		monthNode.classList.add("monthPreview");
		element.appendChild(monthNode);

		let yearNode = document.createElement("div");
		yearNode.classList.add("yearPreview");
		element.appendChild(yearNode);

		let dayNameNode = document.createElement("div");
		dayNameNode.classList.add("dayNamePreview");
		element.appendChild(dayNameNode);

		let seperator = document.createElement("div");
		seperator.classList.add("xDatePreviewSeperator");
		element.appendChild(seperator);

		let hourNode = document.createElement("div");
		hourNode.classList.add("xDatePreviewHourNode");
		element.appendChild(hourNode);

		let minuteNode = document.createElement("div");
		minuteNode.classList.add("xDatePreviewMinuteNode");
		element.appendChild(minuteNode);

		let secondNode = document.createElement("div");
		secondNode.classList.add("xSecondPreviewNode");
		element.appendChild(secondNode);


	this.updatePreview = function(){
		let d = new Date(this.date);

		dayNode.textContent = d.getDate();
		monthNode.textContent = datetime.months[d.getMonth()];
		yearNode.textContent = d.getFullYear()+", ";
		dayNameNode.textContent = datetime.days[d.getDay()];

		if (element.getAttribute("show-time") != null) {
			seperator.textContent = ", ";
			hourNode.textContent = d.getHours()<10 ? ("0" + d.getHours()) : d.getHours();
			minuteNode.textContent = ":" + (d.getMinutes()<10 ? ("0" + d.getMinutes()) : d.getMinutes());
			secondNode.textContent = ":" + (d.getSeconds()<10 ? ("0" + d.getSeconds()) : d.getSeconds());

			hourNode.style.display = "flex";
			minuteNode.style.display = "flex";
			secondNode.style.display = "flex";
		}else{
			hourNode.style.display = "none";
			minuteNode.style.display = "none";
			secondNode.style.display = "none";
		}
	};
	this.setDate = function(date){
		if (date == "" || date == null || date == undefined) {return;}
		this.date = date;	
		this.updatePreview();
	}
	return this;
}
export default xDatePreview;