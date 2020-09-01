function xListener(){
	this.listeners = [];
	this.emit = function(name, data){
		console.log(this.listeners);
		this.listeners.forEach((listener)=>{
			if (listener.name == name) {
				listener.handler(data);
			}
		});
	};
	this.on = function(name, f){
		this.listeners.push({
			name,
			handler : f
		});
	};
}
let listener = new xListener();
export default listener;