function xRadioGroup(element){
	this.radios = [];
	this.currentValue = "";

	this.init = function(){
		element.classList.add("xRadioGroup");
		element.addEventListener("xcomponent", function(event){
			let name = Object.keys(event.detail)[0];
			let component = event.detail[name];
			// Store the component --
			this.radios.push(event.detail);
			// Watch it's value --
			component.element.addEventListener("value", function(event){
				this.uncheckAll();
				component.checkSilent();
				this.currentValue = name;
			}.bind(this));
		}.bind(this));
	};
	this.uncheckAll = function(){
		this.radios.forEach((radio)=>{
			let name = Object.keys(radio)[0];
			let component = radio[name];
			component.uncheckSilent();
		});
	};
	this.init();
	return this;
}
export default xRadioGroup;