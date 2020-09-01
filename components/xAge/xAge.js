import dom from "../../lib/xDOM.js";
function xAge(element){
	this.element = element;

	this.render = function(){
		element.classList.add("xAge");
	};
	this.init = function(){
		this.render();

		let sinceYear = element.getAttribute("year");
		let sinceMonth = element.getAttribute("month");
		let age = this.calculateExperience(sinceYear, sinceMonth);
		element.textContent = age;
	};
	this.calculateExperience = function(sinceYear, sinceMonth){
			if (sinceYear == null || sinceYear == undefined || sinceYear == "") {
				return;
			}
			sinceYear = parseInt(sinceYear);
			sinceMonth = parseInt(sinceMonth);
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
                    experience = (todayMonth - sinceMonth) + " Months";
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
                if (totalYear == 1) {
                    return totalYear + " Year"
                }else if (totalYear > 1) {
                    return totalYear + " Years"
                }else if (totalYear == 0) {
                    return totalMonth + " Months"
                }
                experience = totalYear + " Year " +totalMonth + " Months";
            }
            return experience;
    };
    this.setValue = function(sinceYear, sinceMonth){
    	let age = this.calculateExperience(sinceYear, sinceMonth);
    	element.textContent = age;
    };
	this.init();

	return this;
}
export default xAge;