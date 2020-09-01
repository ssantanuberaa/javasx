import config from "../x.config.js";
function xSystem(){
	this.log = function(message){
		if (config.log == true) {
			console.log(message);
		}
	}
}
let system = new xSystem();
export default system;