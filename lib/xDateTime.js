function xDateTime(){
	this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	this.shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	this.monthMaxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	this.monthMaxDaysLeap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	this.calculateExperience = function(sinceYear, sinceMonth){
			let experience;
			// Get current date --
			var today = new Date();
			var todayYear = today.getFullYear();
			var todayMonth = today.getMonth()+1;
			let m = sinceMonth;

			// When Year is Same
			if (sinceYear == todayYear) {
				// When choosen month is less than today month --
				if (todayMonth > m) {
					experience = 1 + " Year";
				}
				// When choosen month is equal to today month --
				else if (todayMonth == m) {
					experience = "0 Months";
				}
				// When choosen Month is bigger than Today's month. Hence invalid.
				else{
					experience = "0 Months";
				}
			}

			// When Year is Less than Today's Year --
			else{
				// When month is not selected -
				let totalMonth = 12;
				// When total Month is selected -
				if (sinceMonth > 0) {
					totalMonth = 12 - sinceMonth;
				}
				let totalYear = 0;
				sinceYear++;
				let yeardif = todayYear - sinceYear;
				totalMonth = totalMonth + yeardif*12 + todayMonth;
				totalYear = parseInt(totalMonth/12);
				totalMonth = (totalMonth - totalYear*12)
				experience = totalYear + " Year " +totalMonth + " Months";
			}
			return experience;
	};
	this.isToday = function(givenDate){
		let date = new Date();
		let day = date.getDate();
		let month = date.getMonth();
		let year = date.getFullYear();
		if (day<10) {
			day = "0"+day;
		}
		if ((month+1)<10) {
			month = "0"+(month+1);
		}
		date = year+"-"+month+"-"+day;
		
		if (date == givenDate.substr(0, 10)) {
			return true;
		}else{
			return false;
		}
	};
	this.isTomorrow = function(givenDate){
		let today = new Date();
		let tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1);

		let day = tomorrow.getDate();
		let month = tomorrow.getMonth();
		let year = tomorrow.getFullYear();
		if (day<10) {
			day = "0"+day;
		}
		if ((month+1)<10) {
			month = "0"+(month+1);
		}
		let date = year+"-"+month+"-"+day;

		if (date == givenDate.substr(0, 10)) {
			return true;
		}else{
			return false;
		}
	};
	this.getToday = function(){
		let date = new Date();

		// Short Date String --
		let d = date.getDate();
		let m = date.getMonth() + 1;
		let y = date.getFullYear();
		if (d < 10) {
			d = "0" + d;
		}
		if (m < 10) {
			m = "0" + m;
		}
		let hour = date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours();
		let minute = date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes();
		let second = date.getSeconds() < 10 ? ("0" + date.getSeconds()) : date.getSeconds();
		let str = y + "-" + m + "-" + d;

		return {
			date : str,
			time : hour +":"+minute+":"+second,
			day : parseInt(d),
			month : parseInt(m) - 1,
			year : parseInt(y),
			hour : parseInt(hour),
			minute : parseInt(minute),
			second : parseInt(second),
			get datetime(){
				return this.date + " " + this.time;
			}
		};
	};
	this.getDateSummary = function(date){
		date = date.substr(0, 10);
		let d = new Date(date);
		let month = d.getMonth();
		let year = d.getFullYear();
		let maxDays = this.getDaysPerMonth(month, year);
		let monthName = this.months[month];
		month = month + 1;
		if (month<10) {
			month = "0"+month;
		}
		return {
			date : date,
			dayName : this.days[d.getDay()],
			day : d.getDate(),
			month : parseInt(month) - 1,
			year : year,
			monthName : monthName,
			fromDate : year+"-"+month+"-01",
			toDate : year+"-"+month+"-"+maxDays,
			isToday : this.isToday(date)
		};
	};
	this.getTomorrow = function(){
		let tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		// Short Date String --
		let d = tomorrow.getDate();
		let m = tomorrow.getMonth() + 1;
		let y = tomorrow.getFullYear();
		if (d < 10) {
			d = "0" + d;
		}
		if (m < 10) {
			m = "0" + m;
		}
		let str = y + "-" + m + "-" + d;

		return {
			date : str
		};
	};
	this.getDaysPerMonth = function(month, year){
		if ((year % 4) == 0){
			if ((year % 100) == 0 && (year % 400) != 0){
				return this.monthMaxDays[month];
			}
			return this.monthMaxDaysLeap[month];
		}else{
			return this.monthMaxDays[month];
		}
	};
	this.getDayIndex = function(day, month, year){
		let d = new Date(year + "-" + (month+1) + "-" + day);
		return d.getDay();
	};
	this.getNextMonth = function(month, year){
		if (month == 11) {
			return {
				month : 0,
				year : year + 1
			};
		}
		else{
			return {
				month : month + 1,
				year : year
			}
		}
	};
	this.getPreviousMonth = function(month, year){
		if (month == 0) {
			return {
				month : 11,
				year : year - 1
			};
		}else{
			return {
				month : month - 1,
				year : year
			}
		}
	};
}
let datetime = new xDateTime();
export default datetime;