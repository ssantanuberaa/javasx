function xRelativeTime(element) {
	this.element = element;
	// Validation --
	if (element.getAttribute("type") != "xRelativeTime") {
		return false;
	}
	// Variables --
	this.datetimeString = element.getAttribute("datetime");
	let timer = null;

	// Instance Methods --
	this.updateDOM = function(node, relativeTimeObj){
		if (relativeTimeObj.sign == "+") {
			node.textContent = relativeTimeObj.text + "left";
		}else{
			node.textContent = relativeTimeObj.text + "ago";
		}
	};
	this.calculateRelativeTime = function(futureTimeStamp){
		let currentTimeStamp = (new Date()).valueOf();
		let secondsRemaining = parseInt((futureTimeStamp - currentTimeStamp)/1000), relativeTimeObj = {}, days, hours, minutes, seconds, str="", compactString;
		
		if (secondsRemaining<0) {
			relativeTimeObj.sign = "-";
			secondsRemaining = -secondsRemaining;
		}else{
			relativeTimeObj.sign = "+";
		}
		while(secondsRemaining>0){
			if (secondsRemaining>=86400) {
				relativeTimeObj.day = parseInt((secondsRemaining/86400));
				secondsRemaining = secondsRemaining%86400;
			}else if (secondsRemaining>=3600) {
				relativeTimeObj.hour = parseInt((secondsRemaining/3600));
				secondsRemaining = secondsRemaining%3600;
			}else if (secondsRemaining>=60) {
				relativeTimeObj.minute = parseInt((secondsRemaining/60));
				secondsRemaining = secondsRemaining % 60;
			}else{
				relativeTimeObj.second = secondsRemaining;
				secondsRemaining = 0;
			}
		}

		if (relativeTimeObj.day == undefined) {
		}else if (relativeTimeObj.day == 1) {
			str = "1 day ";
		}else if (relativeTimeObj.day > 1) {
			str = relativeTimeObj.day + " days ";
		}

		if (relativeTimeObj.hour == undefined) {
		}else if (relativeTimeObj.hour == 1) {
			str = str+"1 hour ";
		}else if (relativeTimeObj.hour > 1) {
			str = str + relativeTimeObj.hour + " hours ";
		}

		if (relativeTimeObj.minute == undefined) {
		}else if (relativeTimeObj.minute == 1) {
			str = str+"1 minute ";
		}else if (relativeTimeObj.minute > 1) {
			str = str + relativeTimeObj.minute + " minutes ";
		}

		if (relativeTimeObj.second == undefined) {
		}else if (relativeTimeObj.second == 1) {
			str = str+"1 second ";
		}else if (relativeTimeObj.second > 1) {
			str = str + relativeTimeObj.second + " seconds ";
		}
		relativeTimeObj.text = str;

		if (relativeTimeObj.day !== undefined) {
			if (relativeTimeObj.day == 1) {
				compactString = "1 day";
			}else{
				compactString = relativeTimeObj.day + " days";
			}			
		}else if (relativeTimeObj.hour !== undefined) {
			if (relativeTimeObj.hour == 1) {
				compactString = "1 hour";
			}else{
				compactString = relativeTimeObj.hour + " hours";
			}			
		}else if (relativeTimeObj.minute !== undefined) {
			if (relativeTimeObj.minute == 1) {
				compactString = "1 minuite";
			}else{
				relativeTimeObj.minuite = relativeTimeObj.minute + " minutes";
			}
		}else{
			compactString = "few seconds";
		}
		if (relativeTimeObj.sign == "+") {
			compactString = compactString + " left";
		}else{
			compactString = compactString + " ago";
		}
		relativeTimeObj.compatText = compactString;

		return relativeTimeObj;
	};
	this.refresh = function(){
		if (this.datetimeString == null || this.datetimeString == "") {
			return;
		}else{
			let result = this.calculateRelativeTime((new Date(this.datetimeString)).valueOf());
			this.updateDOM(element, result);
		}
	};
	this.setDatetime = function(value){
		if (typeof value == "string") {
			this.datetimeString = value;
			this.refresh();
		}else{
			
		}
	};
	this.refresh();

	// Finishing Up --
	timer = setInterval(function(){
		this.refresh();
	}.bind(this), 1000);

	return this;
}
export default xRelativeTime;