import datetime from "../../lib/xDateTime.js";
import xStaticList from "../xStaticList/xStaticList.js";
import xDropDown from "../xDropDown/xDropDown.js";
import dom from "../../lib/xDOM.js";
import obj from "../../lib/xObject.js";
function xCalendar(element){
	this.element = element;
	this.cellFormatter = null;
	
	this.today = null;
	this.CalendarDays = [];
	// ---------------
	// Current Month Year ---
	let currentMonthInfo, currentYearInfo;
	this.currentYear = null;
	this.currentMonth = null;
	// Selected Date --
	let selectedDateNode = null;
	this.selectedDate = null;
	// Events --
	this.events = [];
	this.eventGroups = [];
	this.groupBy = null;

	// DOM --
	element.classList.add("xCalendar");
		let CalendarHeader = document.createElement("div");
		CalendarHeader.classList.add("xCalendarHeader");
		element.appendChild(CalendarHeader);

		let TodayNavigationContainer = document.createElement("div");
		TodayNavigationContainer.classList.add("TodayNavigationContainer");
		element.appendChild(TodayNavigationContainer);

		let WeekNameContainer = document.createElement("div");
		WeekNameContainer.classList.add("WeekNameContainer");
		element.appendChild(WeekNameContainer);

		let CalendarWeeksContainer = document.createElement("div");
		CalendarWeeksContainer.classList.add("CalendarWeeksContainer");
		element.appendChild(CalendarWeeksContainer);
	this.deleteEventFromEvents = function(eventId){
		// Delete the event from events --
		for(let i=0; i<this.events.length; i++){
			if (this.events[i].id == eventId) {
				// Remove item --
				this.events.splice(i, 1);
				break;
			}
		}
	};
	this.deleteEventFromEventGroups = function(eventId){
		// Delete the event from eventGroups --
		let group = null;
		for(let j=0; j<this.eventGroups.length; j++){
			let events = this.eventGroups[j].data;
			let match = false;
			for(let i=0; i<events.length; i++){
				if (events[i].id == eventId) {
					// Remove item --
					group = this.eventGroups[j];
					match = true;
					group.data.splice(i, 1);
					break;
				}
			}
			if (match == true) {
				break;
			}
		}
		return group;
	};
	this.pushEventToEventGroups = function(event, date){
		let matchFound = false;
		let groupData = null;
		this.eventGroups.forEach((group)=>{
			if (date == group.name) {
				groupData = group;
				// Add to existing group --
				matchFound = true;
				group.data.unshift(event);
			}
		});
		if (matchFound == false) {
			// Create Group and add event--
			groupData = {
				name : date,
				data : [event]
			};
			this.eventGroups.unshift(groupData);
		}
		return groupData;
	};
	this.onMonthChange = function(month, year){};
	this.onYearChange = function(month, year){};
	this.onDateChange = function(dayItem){};
	this.onEventChanged = function(dayItem){};
	this.getEventsOfTheDay = function(date){
		let matchFound = false;
		let dayEvents = null;
		for(let i=0; i<this.eventGroups.length; i++){
			if (this.eventGroups[i].name == date) {
				matchFound = true;
				dayEvents = this.eventGroups[i].data;
				break;
			}
		}
		if (matchFound == false) {
			// Create a New Group and add it to event groups --
			let group = {
				name : date,
				data : []
			};
			this.eventGroups.push(group);
			dayEvents = group.data;
		}
		return dayEvents;
	};
	this.setEvents = function(data, groupBy, dataType){
		this.events = data;
		this.groupBy = groupBy;
		this.eventGroups = obj.groupBy(data, groupBy, dataType);
		this.refresh();
	};
	this.silentPushEvent = function(event, date){
		// Push the event to the event arrays --
		this.events.push(event);

		// Push it to group events --
		this.pushEventToEventGroups(event, date);

		// Update the counter --
		this.updateEventCounter(date, "increment");
	};
	this.pushEvent = function(event, date){
		this.silentPushEvent(event, date);
		// onEventChanged --
		this.onEventChanged(this.getDayItem(date));
	};
	this.deleteEvent = function(event){
		let eventId = event.id;
		this.deleteEventFromEvents(eventId);
		let group = this.deleteEventFromEventGroups(eventId);				
		// Decrement the counter of the node --
		this.updateEventCounter(group.name, "decrement");
		// onEventChanged --
		this.onEventChanged(this.getDayItem(group.name));
	};
	this.moveEvent = function(event, date){
		// First delete the event --
		this.deleteEventFromEvents(event.id);
		let group = this.deleteEventFromEventGroups(event.id);
		this.updateEventCounter(group.name, "decrement");
		// After delete the old event, push the new event to create move operation --
		// Push the event to the event arrays --
		this.events.push(event);
		// Push it to group events --
		this.pushEventToEventGroups(event, date);
		// Update the counter --
		this.updateEventCounter(date, "increment");
		// Fire onEventChange with new Event --
		this.onEventChanged(this.getDayItem(group.name));
	};
	this.updateEventCounter = function(date, command){
		let dateNode = this.getCellNode(date);
		if (dateNode != null) {
			dateNode = dateNode.querySelector(".DateCell");
			let counterNode = dateNode.querySelector(".EventCounter");
			if (command == "increment") {
				if (counterNode == null) {
					dateNode.classList.add("hasEvent");
					counterNode = document.createElement("div");
					counterNode.classList.add("EventCounter");
					counterNode.textContent = 1;
					dateNode.appendChild(counterNode);
				}else{
					counterNode.textContent = parseInt(counterNode.textContent) + 1;
				}
			}else if (command == "decrement") {
				let counter = parseInt(counterNode.textContent);
				if (counter == 1) {
					counterNode.outerHTML = "";
				}else{
					counterNode.textContent = counter - 1;
				}
			}
		}
	};
	this.getDayItem = function(date){
		let data = null;
		this.CalendarDays.forEach((week)=>{
			week.forEach((day)=>{
				if (day.day == undefined) {
					// Empty Cell
				}else if(day.day.date == date){
					data = day;
				}
			});
		});
		return data;
	};
	this.createCalendarHeader = function(){
		let icon;
		// Rendering Previous Navigation --
		let prevContainer = document.createElement("div");
		prevContainer.classList.add("PreviousMonthNavigationContainer");
		CalendarHeader.appendChild(prevContainer);
			let prev = document.createElement("div");
			prev.classList.add("MonthNavigation");
			prevContainer.appendChild(prev);
				icon = document.createElement("i");
				icon.className = "fa fa-angle-left";
				prev.appendChild(icon);

		// Rendering Year and Month Selector --
		let middleContainer = document.createElement("div");
		middleContainer.classList.add("MiddleItemContainer");
		CalendarHeader.appendChild(middleContainer);
			let CurrentDateYearInfo = document.createElement("div");
			CurrentDateYearInfo.classList.add("CurrentDateYearInfo");
			middleContainer.appendChild(CurrentDateYearInfo);

				let CurrentDateYearInfoIcon = document.createElement("i");
				CurrentDateYearInfoIcon.className = "fa fa-calendar-check-o";
				CurrentDateYearInfo.appendChild(CurrentDateYearInfoIcon);

				let monthDropDown = dom.createXElement(xDropDown, {type: "xDropDown"});
				CurrentDateYearInfo.appendChild(monthDropDown.element);
					currentMonthInfo = document.createElement("span");
					currentMonthInfo.classList.add("CurrentMonthInfo");
					monthDropDown.setTrigger(currentMonthInfo);

					let MonthSelector = dom.createXElement(xStaticList, {'type' : "xStaticList", classNames : "MonthSelector"});
					MonthSelector.setData(datetime.months);
					monthDropDown.setContent(MonthSelector.element);

				let yearDropDown = dom.createXElement(xDropDown, {type : "xDropDown"});
				CurrentDateYearInfo.appendChild(yearDropDown.element);
					currentYearInfo = document.createElement("span");
					currentYearInfo.classList.add("CurrentYearInfo");
					yearDropDown.setTrigger(currentYearInfo);

					let YearSelector = dom.createXElement(xStaticList, {'type' : "xStaticList", classNames : "YearSelector"});
					let Years = [];
					for(let i=this.currentYear - 50; (i<this.currentYear+50); i++){
						Years.push(i);
					}
					YearSelector.setData(Years);
					yearDropDown.setContent(YearSelector.element);

		// Rendering Next Navigation --
		let nextContainer = document.createElement("div");
		nextContainer.classList.add("NextMonthNavigationContainer");
		CalendarHeader.appendChild(nextContainer);
			let next = document.createElement("div");
			next.classList.add("MonthNavigation");
			nextContainer.appendChild(next);
				icon = document.createElement("i");
				icon.className = "fa fa-angle-right";
				next.appendChild(icon);		

		YearSelector.onSelect = function(year){
			this.goToMonth(this.currentMonth, year);
		}.bind(this);
		MonthSelector.onSelect = function(month){
			this.goToMonth(datetime.months.indexOf(month), this.currentYear);
		}.bind(this);
		monthDropDown.onOpen = function(){
			yearDropDown.close();
		};
		yearDropDown.onOpen = function(){
			monthDropDown.close();
		};
		prev.addEventListener("click", function(event){
			this.goToPreviousMonth();
		}.bind(this));
		next.addEventListener("click", function(event){
			this.goToNextMonth();
		}.bind(this));
	};
	this.createTodayNavigationContainer = function(){
		let today = document.createElement("div");
		today.classList.add("TodayNavigation");
		TodayNavigationContainer.appendChild(today);
			let icon = document.createElement("i");
			icon.className = "fa fa-calendar";
			today.appendChild(icon);

			let text = document.createElement("span");
			text.textContent = "Today";
			today.appendChild(text);

		today.addEventListener("click", function(event){
			this.goToToday();
		}.bind(this));
	};
	this.createWeekNameContainer = function(){
		// WeekNameContainer --
		datetime.days.forEach((day, index)=>{
			let weekNameNode = document.createElement("div");
			weekNameNode.classList.add("WeekName");
			weekNameNode.textContent = datetime.shortDays[index];
			WeekNameContainer.appendChild(weekNameNode);
		});
	};
	this.dateItemFormatter = function(dayItem){
		let dayNode = document.createElement("div");
		dayNode.classList.add("DateCell");
		dayNode.setAttribute("date", dayItem.day.date);
		if (dayItem.day.isToday == true) {
			dayNode.classList.add("Today");
		}
		if (dayItem.events.length > 0) {
			dayNode.classList.add("hasEvent");
				let dayNumber = document.createElement("div");
				dayNumber.classList.add("DayNumber");
				dayNumber.textContent = dayItem.day.day;
				dayNode.appendChild(dayNumber);

				let eventCounter = document.createElement("div");
				eventCounter.classList.add("EventCounter");
				eventCounter.textContent = dayItem.events.length;
				dayNode.appendChild(eventCounter);
		}else{
			let dayNumber = document.createElement("div");
			dayNumber.classList.add("DayNumber")
			dayNumber.textContent = dayItem.day.day;
			dayNode.appendChild(dayNumber);
		}
		return dayNode;
	};
	this.createCalendarDateCell = function(dayItem){
		let dayNode = document.createElement("div");
		dayNode.classList.add("CalendarDay");
		
		if (dayItem.render == false) {
			let emptyCell = document.createElement("div");
			emptyCell.classList.add("EmptyCell");
			dayNode.appendChild(emptyCell);
		}else{
			dayNode.appendChild(this.dateItemFormatter(dayItem));
		}		
		return dayNode;
	};
	this.calculateDaysOfTheMonth = function(month, year){
		let totalDays = datetime.getDaysPerMonth(month, year);
		let dayIndex = datetime.getDayIndex(1, month, year);
		
		let i = 0;
		let arr = [];
		let weekArr = [];
		let skipDayIndex = 0;

		let totalWeek = 1;
		let currentDay = 1;

		let dateStr = month+1;
		if (dateStr < 10) {
			dateStr = "0"+dateStr;
		}
		dateStr = year+"-"+dateStr+"-";

		while(true){
			// -------------------------
			let day = 0;
			weekArr = [];
			while(day<7){
				// -----------------------
				if (totalWeek == 1 && (skipDayIndex<dayIndex)) {
					while(skipDayIndex<dayIndex){
						weekArr.push({
							"render" : false
						});
						skipDayIndex++;
						day++;
					}
				}else{
					if (currentDay<=totalDays) {
						let d = currentDay;
						if (d<10) {
							d = "0"+d;
						}
						weekArr.push({
							"render" : true,
							"day" : datetime.getDateSummary(dateStr + d),
							"events" : this.getEventsOfTheDay(dateStr + d)
						});
						currentDay++;
					}else{
						weekArr.push({
							"render" : false,
						});
					}
					day++;
				}
				// -----------------------
			}
			arr.push(weekArr);
			// -------------------------
			if (currentDay>totalDays) {
				break;
			}
			totalWeek++;
		}
		this.CalendarDays = arr;
		return arr;
	};
	this.renderCalendarView = function(calendarMonthDays){
		CalendarWeeksContainer.innerHTML = "";

		calendarMonthDays.forEach((week)=>{

			let weekRow = document.createElement("div");
			weekRow.classList.add("CalendarWeek");

			week.forEach((day)=>{
				weekRow.appendChild(this.createCalendarDateCell(day));
			});

			CalendarWeeksContainer.appendChild(weekRow);
		});
	};
	this.createCalendar = function(month, year){
		let calendarMonthDays = this.calculateDaysOfTheMonth(month, year);
		this.renderCalendarView(calendarMonthDays);
		// Updating Current Date and Month --
		if (this.currentYear != year) {
			this.onYearChange(this.currentMonth, year);
		}
		this.currentYear = year;

		if (this.currentMonth != month) {
			this.onMonthChange(month, this.currentYear);
		}
		this.currentMonth = month;

		// Updating Current Month and Year info in CalendarHeader --
		currentMonthInfo.textContent = datetime.months[month];
		currentYearInfo.textContent = year;

		// Previous selected node doesn't exist --
		selectedDateNode = null;
		this.selectedDate = null;
	};
	this.dateSelected = function(date){
		// Date has been selected, emit Event --
		let data = this.getDayItem(date);
		element.dispatchEvent(new CustomEvent("datechanged", {
			detail : data
		}));
		this.onDateChange(data);
	};
	this.goToMonth = function(month, year){
		// Render the Calendar UI --
		this.createCalendar(month, year);
	};
	this.goToNextMonth = function(){
		let nextMonth = datetime.getNextMonth(this.currentMonth, this.currentYear);
		this.goToMonth(nextMonth.month, nextMonth.year);
	};
	this.goToPreviousMonth = function(){
		let previousMonth = datetime.getPreviousMonth(this.currentMonth, this.currentYear);
		this.goToMonth(previousMonth.month, previousMonth.year);
	};
	this.goToToday = function(){
		this.goToMonth(this.today.month, this.today.year);
	};
	this.refresh = function(){
		if (this.selectedDate != null) {
			this.selectDate(this.selectedDate);
		}else{
			this.goToMonth(this.currentMonth, this.currentYear);
		}
	};
	this.getCellNode = function(date){
		let cell = null;
		Array.prototype.forEach.call(CalendarWeeksContainer.querySelectorAll("*"), function(node){
			if (node.classList.contains("DateCell") && node.getAttribute("date") == date) {
				cell = node;
			}
		}.bind(this));
		if (cell == null) {
			return null;
		}else{
			return cell.parentNode;
		}
	};
	this.selectDate = function(date){
		// Render the calendar with month and year --
		let dateSummary = datetime.getDateSummary(date);
		this.goToMonth(dateSummary.month, dateSummary.year);
		// Select the Date Node --
		selectedDateNode = this.getCellNode(date);
		this.selectedDate = date;
		selectedDateNode.classList.add("SelectedDate");
		this.dateSelected(date);	
	};
	this.init = function(){
		// Setting Current Month and Year --
		this.today = datetime.getToday();
		this.currentMonth = this.today.month;
		this.currentYear = this.today.year;

		// Creating Calendar Component --
		this.createWeekNameContainer();
		this.createCalendarHeader();
		this.createTodayNavigationContainer();

		// Binding Listener --
		element.addEventListener("click", function(event){
			if (event.target.closest(".CalendarDay")) {
				// Clicked on a day --
				let dayNode = event.target.closest(".CalendarDay");
				this.selectedDate = dayNode.querySelector(".DateCell").getAttribute("date");
				// Remove selected  --
				if (selectedDateNode!=null) {
					selectedDateNode.classList.remove("SelectedDate");
				}
				// Add Selected to new selected cell --
				dayNode.classList.add("SelectedDate");
				selectedDateNode = dayNode;

				this.dateSelected(this.selectedDate);
			}
		}.bind(this));

		// Now Render Calendar with days --
		this.goToMonth(this.currentMonth, this.currentYear);
	};
	this.init();

	return this;
}
export default xCalendar;