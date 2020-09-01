function xURL(){
	this.decodeUrl = function(url){

	};
	this.decodeQueryString = function(url){
		let parameters = {};
		if (url.indexOf("?") == -1) {
			return parameters;
		}
		url = url.substr(url.indexOf("?")+1);
		url = url.split("&");
		url.forEach((pair)=>{
			let temp = pair.split("=");
			parameters[temp[0]] = temp[1];
		});
		return parameters;
	};
	this.trimQueryString = function(url){
		if (url.indexOf("?") !== -1) {
			return url.substr(0, url.indexOf("?"));
		}else{
			return url;
		}
	};
	this.createURL = function(url, parameters){
		let query = "?";
		Object.keys(parameters).forEach((param)=>{
			query = query + param + "=" + encodeURIComponent(parameters[param]) + "&";
		});
		query = query.substr(0, (query.length - 1));
		return url + query;
	};
	this.prependOrigin = function(url){
		let origin = window.location.origin;
		if (url[0] == "/") {
			url = origin + url;
		}else{
			url = origin + "/" + url;
		}
		return url;
	};
	this.getParameterByName = function(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	};
}
let url = new xURL();
export default url;