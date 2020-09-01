import datetime from "../../lib/xDateTime.js";
import dom from "../../lib/xDOM.js";
import xCalendar from "../xCalendar/xCalendar.js";
function xDatePicker(element){
	// Variables --
	this.element = element;
	this.defaultValue = {};
	let icon = null;
	this.value = {};
	let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	// Checking Required Attributes --
	if (element.getAttribute("type") != "xDatePicker" || element.getAttribute("name") == null) {
		return false;
	}

	// Building DOM --
	element.classList.add("xDatePickerWrapper");
		let container = document.createElement("div");
		container.classList.add("xDatePickerGroup");
		element.appendChild(container);
			let input = document.createElement("input");
			input.setAttribute("type", "date");
			container.appendChild(input);

			let label = document.createElement("label");
			label.textContent = element.getAttribute("label");
			container.appendChild(label);

			let error = document.createElement("div");
			error.classList.add("error");
			container.appendChild(error);

			// Adding Date Time Input --
			let datePreview = document.createElement("div");
			datePreview.classList.add("datePreview");
				let dayPreview = document.createElement("div");
				dayPreview.classList.add("dayPreview");
				let monthPreview = document.createElement("div");
				monthPreview.classList.add("monthPreview");
				let yearPreview = document.createElement("div");
				yearPreview.classList.add("yearPreview");
				let dayNamePreview = document.createElement("div");
				dayNamePreview.classList.add("dayNamePreview");
				if (element.getAttribute("font-awesome-icon") != null) {
					icon = document.createElement("i");
					icon.classList.add("fa");
					icon.classList.add(element.getAttribute("font-awesome-icon"));
					icon.classList.add("xDropDownInputIcon");
					datePreview.appendChild(icon);
					input.classList.add("hasIcon");
					label.classList.add("hasIcon");
				}else if (element.getAttribute("material-icon") != null) {
					icon = document.createElement("i");
					icon.classList.add("material-icons");
					icon.textContent = element.getAttribute("material-icon");
					icon.classList.add("xDropDownInputIcon");
					datePreview.appendChild(icon);
					input.classList.add("hasIcon");
					label.classList.add("hasIcon");
				}else{
					label.classList.remove("hasIcon");
				}	
				datePreview.appendChild(dayPreview);
				datePreview.appendChild(monthPreview);
				datePreview.appendChild(yearPreview);
				datePreview.appendChild(dayNamePreview);

			// Adding Calendar Container --
			let calendarContainer = document.createElement("div");
			calendarContainer.classList.add("calendarContainer");
				let calendar = document.createElement("div");
				calendar.setAttribute("type", "xCalendar");
				calendar.setAttribute("theme", "vidhikarya.float");
				calendar.setAttribute("render-today", "yes");
				calendarContainer.appendChild(calendar);
				let calendarX = new xCalendar(calendar);

			container.appendChild(calendarContainer);
			container.appendChild(datePreview);

	// Methods --
	let updateCalendarPreview = function(value){
		if (value.date == undefined) {
			datePreview.style.display = "flex";
			dayPreview.textContent = "";
			monthPreview.textContent = "";
			yearPreview.textContent = "";
			dayNamePreview.textContent = "";
		}else{
			datePreview.style.display = "flex";
			dayPreview.textContent = value.day;
			monthPreview.textContent = value.monthName;
			yearPreview.textContent = value.year+", ";
			dayNamePreview.textContent = value.dayName.substr(0, 3);
		}
	};
	let emitValue = function(newValue){
		let data = {};
		data[element.getAttribute("name")] = newValue;
		input.dispatchEvent(new CustomEvent("value", {
			bubbles: true, 
			cancelable: false,
			detail : data
		}));
	};
	this.setError = function(errorMessage){
		error.textContent = errorMessage;
		datePreview.style.borderBottomColor = "#ff3860";
		label.style.color = "#ff3860";
	};
	this.removeError = function(){
		error.textContent = "";
		datePreview.style.borderBottomColor = "#757575";
		label.style.color = "#4a4a4a";
	};
	this.setValue = function(newValue){
		// Set value to value property --
		if (newValue == "" || newValue == null) {
			this.value = {};
			input.value = "";
		}else if (typeof newValue == "string") {
			let dateSummary = datetime.getDateSummary(newValue);
			this.value = dateSummary;
			input.value = dateSummary.date;
		}else if (typeof newValue == "object"){
			input.value = newValue.date;
			this.value = newValue;
		}else{
			return false;
		}
		// Update Preview --
		updateCalendarPreview(this.value);
		controlLabelPosition(false);

		// Dispatching value event --
		emitValue(this.value);
		this.validateData();
	};
	this.disable = function(){
		element.classList.add("xDatePickerDisabled");
	};
	this.enable = function(){
		element.classList.remove("xDatePickerDisabled");
	};
	this.getValue = function(){
		return this.value;
	};
	let controlLabelPosition = function(forceRaised){
		if (forceRaised) {
			label.classList.add("Raised");
			label.classList.remove("hasIcon");
		}else{
			if (input.value == "" || input.value == undefined || input.value == null) {
				// Remove raised --
				label.classList.remove("Raised");
				if (icon == null) {
					label.classList.remove("hasIcon");
				}else{
					label.classList.add("hasIcon");
				}
			}else{
				// Add raised --
				label.classList.remove("hasIcon");
				label.classList.add("Raised");
			}
		}
	};
	this.openCalendar = function(){
		calendarContainer.style.display = "flex";

		calendarContainer.style.left = "0";
		calendarContainer.style.top = "unset";
		calendarContainer.style.bottom = "unset";

		if (screen.width > 700) {
			// Get Top position of the element --
			let viewportOffset = input.getBoundingClientRect();
			let triggerFromTop = viewportOffset.top;
			// Get Element Height --
			let triggerHeight = input.offsetHeight;
			// Screen Height --
			let windowHeight = document.documentElement.clientHeight;
			// Popup Height --
			let contentHeight = calendarContainer.clientHeight;
			if ( (windowHeight - (triggerFromTop+triggerHeight)) > contentHeight) {
				// Can be placed at the bottom --
				calendarContainer.style.bottom = "unset";
				calendarContainer.style.top = triggerHeight+"px";			
			}else{
				// cannot be placed at the bottom, show upwards --
				// check if the content can be placed at the top --
				if (triggerFromTop >= contentHeight) {
					// Show at the top --
					calendarContainer.style.top = "unset";
					calendarContainer.style.bottom = triggerHeight+"px";
				}else{
					// It cannot be placed even at the top --
					// Showing it at the bottom --
					calendarContainer.style.bottom = "unset";
					calendarContainer.style.top = triggerHeight+"px";
				}
			}
		}else{
			calendarContainer.style.top = "0";
			calendarContainer.style.bottom = "0";
		}
	};
	this.closeCalendar = function(){
		calendarContainer.style.display = "none";		
	};
	
	this.validateData = function(data){
		if (element.getAttribute("required") != null) {
			if (this.value.date == undefined) {
				this.setError("This field is required");
				return false;
			}
		}
		this.removeError();
		return true;
	}

	// Watching --
	datePreview.addEventListener("click", function(){		
		this.openCalendar();
	}.bind(this));
	datePreview.addEventListener("mouseleave", function(event){		
		controlLabelPosition(false);
	});	
	calendar.addEventListener("datechanged", function(event){
		let value = event.detail.day;
		this.value = value;

		this.closeCalendar();
		updateCalendarPreview(value);
		emitValue(this.value);
		this.validateData();
		input.value = value.date;
		
		controlLabelPosition(true);
	}.bind(this));
	document.addEventListener("click", function(event){
		if (event.target.closest(".xDatePickerGroup")) {}else{
			this.closeCalendar();
		}
	}.bind(this));

	// Registering the Component in it's outer form element --
	if (element.closest("form")) {
		let form = element.closest("form");
		if (form.inputs == undefined) {
			form.inputs = {};
		}
		form.inputs[element.getAttribute("name")] = this;
	}

	// Firing InputInitialized --
	let data = {};
	data[element.getAttribute('name')] = this.value;
	element.dispatchEvent(new CustomEvent("inputinitialized", {
		bubbles : true,
		cancelable : false,
		detail : data
	}));

	dom.loadStyle(calendar);

	return this;
}
export default xDatePicker;