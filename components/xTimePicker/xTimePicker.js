import dom from "../../lib/xDOM.js";
import xDropDown from "../xDropDown/xDropDown.js";
function xTimePicker(element){
	// Validation --
	if (element.getAttribute("type") != "xTimePicker" || element.getAttribute("name") == null) {
		return false;
	}

	// Private Variables --
	let icon = null, selectedHourNode = null, selectedMinuteNode = null;
	let mobileModal = element.getAttribute("mobile-modal");
	if (mobileModal == null) {
		mobileModal = false;
	}else{
		mobileModal = true;
	}

	this.element = element;
 	this.defaultValue = "";
 	this.value = "";

	// DOM --
	element.classList.add("xTimePickerWrapper");
		let container = dom.createElement("div", {type : "xDropDown", name : "innerDropdown", classNames : "xTimePickerGroup"});
		if (mobileModal) {
			container.setAttribute("mobile-modal", "true");
		}
		element.appendChild(container);
		let containerDropdown = new xDropDown(container);
			let triggerContent = document.createElement("div");
			containerDropdown.setTrigger(triggerContent);
				let label = document.createElement("label");
				label.textContent = element.getAttribute("label");
				triggerContent.appendChild(label);

				let error = dom.createElement("div", {"classNames" : "error"});
				triggerContent.appendChild(error);

				let input = dom.createElement("input", {type : "time"});
				triggerContent.appendChild(input);


				// Adding Date Time Input --
				let timePreview = document.createElement("div");
				timePreview.classList.add("timePreview");
				triggerContent.appendChild(timePreview);
					// Icon --
					if (element.getAttribute("font-awesome-icon") != null) {
						icon = dom.createElement("i", {'classNames' : "fa"});
						icon.classList.add(element.getAttribute("font-awesome-icon"));
						input.style.paddingLeft = "25px";
						timePreview.appendChild(icon);
					}else if (element.getAttribute("material-icon") != null) {
						icon = dom.createElement("i", {'classNames' : "material-icons"});
						icon.textContent = element.getAttribute("material-icon");
						input.style.paddingLeft = "25px";
						timePreview.appendChild(icon);
					}
					if (icon == null) {
						label.classList.remove("hasIcon");
					}else{
						label.classList.add("hasIcon");
						timePreview.appendChild(icon);
					}
					let hourPreview = dom.createElement("div", {'classNames' : "hourPreview"});
					timePreview.appendChild(hourPreview);

					let minutePreview = dom.createElement("div", {"classNames" : "minutePreview"});
					timePreview.appendChild(minutePreview);


			// Adding TimePicker Container --
			let timePickerWrapper = dom.createElement("div", {"classNames" : "timePickerWrapper"});
			containerDropdown.setContent(timePickerWrapper);
					let timePickerHeader = dom.createElement("div", {"classNames" : "timePickerHeader"});
					timePickerWrapper.appendChild(timePickerHeader);
						let timePickerHeaderLeft = dom.createElement("div");
						timePickerHeaderLeft.textContent = "Hour";
						timePickerHeader.appendChild(timePickerHeaderLeft);

						let timePickerHeaderRight = dom.createElement("div");
						timePickerHeaderRight.textContent = "Minute";
						timePickerHeader.appendChild(timePickerHeaderRight);

					let timePicker = dom.createElement("div", {"classNames" : "timePicker"});
					timePickerWrapper.appendChild(timePicker);
						let hourContainer = dom.createElement("div", {"classNames" : "hourContainer"});
						timePicker.appendChild(hourContainer);
							let eachHour = null;
							for(let i=0; i<=23;i++){
								 eachHour = document.createElement("div");
								if (i<10) {
									eachHour.setAttribute("index", ("0"+i));
									eachHour.textContent = ("0"+i);	
								}else{
									eachHour.setAttribute("index", i);
									eachHour.textContent = i;
								}		
								hourContainer.appendChild(eachHour);
							}

						let minuteContainer = document.createElement("div");
						minuteContainer.classList.add("minuteContainer");
						timePicker.appendChild(minuteContainer);
							let eachMinute = null;
							for(let i=0;i<=59;i++){
								eachMinute = document.createElement("div");
								if (i<10) {
									eachMinute.setAttribute("index", ("0"+i));
									eachMinute.textContent = ("0"+i);
								}else{
									eachMinute.setAttribute("index", i);
									eachMinute.textContent = i;
								}
								minuteContainer.appendChild(eachMinute);
							}

					let timePickerFooter = dom.createElement("div", {"classNames" : "timePickerFooter"});
					timePickerWrapper.appendChild(timePickerFooter);
						let currentTimeIcon = dom.createElement("i", {"classNames" : "material-icons"});
						timePickerFooter.appendChild(currentTimeIcon);
						currentTimeIcon.textContent = "access_time";
						
						let currentTimeText = document.createElement("span");
						currentTimeText.textContent = "Current Time";
						timePickerFooter.appendChild(currentTimeText);

	// Instance Methods --
	let updateTimePreview = function(selectedValue){
		if (selectedValue.hour == undefined) {
			hourPreview.textContent = "";
			minutePreview.textContent = "";
		}else{
			hourPreview.textContent = selectedValue.hour + " : ";
			minutePreview.textContent = selectedValue.minute;
		}
		timePreview.style.display = "flex";		
	};
	let controlLabelPosition = function(forceRaised){
		if (forceRaised) {
			label.classList.add("Raised");
			label.classList.remove("hasIcon");
		}else{
			if (input.value == "" || input.value == undefined || input.value == null) {
				label.classList.remove("Raised");
				if (icon == null) {
					label.classList.remove("hasIcon");
				}else{
					label.classList.add("hasIcon");
				}
			}else{
				label.classList.add("Raised");
			}
		}
	};
	let emitValue = function(newValue){
		let data = {};
		data[input.getAttribute('name')] = newValue;
		input.dispatchEvent(new CustomEvent("value", {
			bubbles: true, 
			cancelable: false,
			detail : data
		}));
	};
	let updateTimePickerSelection = function(value){
		if (selectedHourNode != null) {
			selectedHourNode.classList.remove("SelectedHour");
		}
		if (selectedMinuteNode != null) {
			selectedMinuteNode.classList.remove("SelectedMinute");
		}
		if (input.value == "") {
			selectedHourNode = null;
			selectedMinuteNode = null;
		}else{
			Array.prototype.forEach.call(hourContainer.children, function(item){
				if (item.getAttribute("index") == value.hour) {
					item.classList.add("SelectedHour");
					selectedHourNode = item;
				}			
			});
			
			Array.prototype.forEach.call(minuteContainer.children, function(item){
				if (item.getAttribute("index") == value.minute) {
					selectedMinuteNode = item;
					item.classList.add("SelectedMinute");
				}
			});
		}	
	};
	this.setError = function(errorMessage){
		error.textContent = errorMessage;
		element.classList.add("Error");
	};
	this.removeError = function(){
		error.textContent = "";
		element.classList.remove("Error");
	};
	this.setValue = function(newValue){
		if (newValue == "") {
			this.value = this.defaultValue;
			input.value = "";
			controlLabelPosition(false);
		}else if (typeof newValue == 'string') {
			let h = newValue.substr(0, 2);
			let m = newValue.substr(3, 2);
			this.value = {
				"hour" : h,
				"minute" : m,
				'time' : h + ":" + m
			};
			input.value = newValue;
			controlLabelPosition(true);
		}else{
			input.value = newValue.hour+":"+newValue.minute;
			if (newValue.time == undefined) {
				newValue.time = input.value;
			}
			this.value = newValue;
			controlLabelPosition(true);
		}			
		updateTimePreview(this.value);
		updateTimePickerSelection(this.value);
		emitValue(this.value);
	};	
	this.open = function(){
		containerDropdown.open();
	};
	this.close = function(){
		containerDropdown.close();
	};
	this.disable = function(){
		containerDropdown.disable();
		container.classList.add("xTimePickerDisabled");
	};
	this.enable = function(){
		containerDropdown.enable();
		container.classList.remove("xTimePickerDisabled");
	};
	this.validateData = function(value){
		return true;
	};

	// Watching --
	input.addEventListener("mouseleave", function(event){
		controlLabelPosition(false);
	});
	timePicker.addEventListener("click", function(event){
		if (event.target.closest(".hourContainer")) {
			if (selectedHourNode != null) {
				selectedHourNode.classList.remove("SelectedHour");
			}
			selectedHourNode = event.target;
			selectedHourNode.classList.add("SelectedHour");
			let selectedHour = selectedHourNode.getAttribute("index");
			if (this.value == "") {
				this.value = {"hour" : selectedHour, "minute" : "00", "time" : selectedHour+":"+"00"};
			}else{
				this.value.hour = selectedHour;
				this.value.time = selectedHour + ":" + this.value.minute;
			}
			
			emitValue(this.value);
			updateTimePreview(this.value);
			controlLabelPosition(true);
			input.value = this.value.text;
		}else if (event.target.closest(".minuteContainer")) {
			if (selectedMinuteNode != null) {
				selectedMinuteNode.classList.remove("SelectedMinute");
			}
			selectedMinuteNode = event.target;
			selectedMinuteNode.classList.add("SelectedMinute");
			let selectedMinute = selectedMinuteNode.getAttribute("index");
			if (this.value == "") {
				this.value = {"hour" : "00", "minute" : selectedMinute, "time" : "00"+":"+selectedMinute};
			}else{
				this.value.minute = selectedMinute;
				this.value.time = this.value.hour + ":" + selectedMinute;
			}
			
			emitValue(this.value);
			updateTimePreview(this.value);
			this.close();
			controlLabelPosition(true);
			input.value = this.value.text;
		}		
	}.bind(this));
	timePickerFooter.addEventListener("click", function(event){
		let d = new Date();
		let dHour = d.getHours();
		if (dHour<=9) {
			dHour = "0" + dHour;
		}
		let dMinute = d.getMinutes();
		if (dMinute<=9) {
			dMinute = "0" + dMinute;
		}
		this.value = {
			hour : dHour,
			minute : dMinute,
			time : dHour + ":" + dMinute
		};
		
		input.value = this.value.hour + ":" + this.value.minute;
		updateTimePreview(this.value);
		this.close();
		controlLabelPosition(true);
		updateTimePickerSelection(this.value);
	}.bind(this));

	// Registering the element to the closest form element --
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

	dom.loadStyle(container);

	return this;
}
export default xTimePicker;