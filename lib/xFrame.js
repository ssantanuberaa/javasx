function xFrame(){
	this.frames = [];
	this.frameOptions = null;
	this.emit = function(name, payload){
		let signals = this.frameOptions.on;
		if (signals != undefined) {
			Object.keys(signals).forEach(function(signalName){
				if (signalName == name) {
					signals[name](payload);
				}
			});
		}
	};
	this.setFrames = function(frames){
		this.frames = frames;
	};
}
let frame = new xFrame();
export default frame;