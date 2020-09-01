function xRequest(){
	this.post = function(url, data){
		return new Promise(function(resolve, reject){
			let http = new XMLHttpRequest();
			http.open("POST", url, false);
			http.setRequestHeader('Content-type', 'application/json; charset=utf-8');


			let that = this;
			http.onreadystatechange = function() {//Call a function when the state changes.
				if(http.readyState == 4 && http.status == 200) {
					if (that.IsJsonString(http.responseText)) {
						resolve(JSON.parse(http.responseText));
					}else{
						resolve(http.responseText);
					}					
				}else{
					if (that.IsJsonString(http.responseText)) {						
						reject(JSON.parse(http.responseText));
					}else{
						reject(http.responseText);
					}
				}
			};

			let formData = new FormData();
			if (data == undefined) {
				http.send(JSON.stringify());
			}else{
				Object.keys(data).forEach((key)=>{
					formData.append(key, data[key]);
				});
				http.send(JSON.stringify(data));
			}
		}.bind(this));
	};
	this.IsJsonString = function(str){
		try {
			JSON.parse(str);
		} catch (e) {
			console.log("Cannot Parse the Data");
			return false;
		}
		return true;
	};
}
let request = new xRequest();
export default request;