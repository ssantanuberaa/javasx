import system from "./xSystem.js";
function xLocation(){
	this.detectLocation = function(){
		return new Promise(function(resolve, reject){
			if (navigator.geolocation) {

				let onSuccess = function(location){
					resolve(location);
				};
				let onError = function(error){
					switch(error.code){
						case error.PERMISSION_DENIED:
							system.log("Permission has been rejected by user");
							break;
						case error.POSITION_UNAVAILABLE:
							system.log("Position is not available");
							break;
						case error.TIMEOUT:
							system.log("Timeout while detecting the location");
							break;
						case error.UNKNOWN_ERROR:
							system.log("Unknown error has occured while detecting location");
							break;
					}
					reject(error);
				};
				let options = {maximumAge:10000, timeout:5000, enableHighAccuracy: true};
				navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
			}else{
				system.log("Navigator is not supported by the browser");
			}
		});
	};
};
let location = new xLocation();
export default location;