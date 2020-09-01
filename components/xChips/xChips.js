function xChips(element){
	this.element = element;
	this.dataSet = [];
	this.labelKey = "";

	let chipsContainer;

	this.render = function(){
		element.classList.add("xChips");
			let label = document.createElement("div");
			label.classList.add("LabelContainer");
			label.textContent = element.getAttribute("label");
			element.appendChild(label);

			chipsContainer = document.createElement("div");
			chipsContainer.classList.add("ChipsContainer");
			element.appendChild(chipsContainer);
	};
	this.setData = function(data, label){
		this.dataSet = data;
		this.labelKey = label;

		if(data.length > 0){
			chipsContainer.innerHTML = "";
			data.forEach(function(item, index){
				chipsContainer.appendChild(this.chipFormatter(item, index, label));
			}.bind(this));
		}
	};
	this.chipFormatter = function(item, index, label){
		let chip = document.createElement("div");
		chip.classList.add("xChipsChipItem");
		let labelString;
		if((typeof item) == "string"){
			labelString = item;
		}else{
			labelString = item[label];
		}
		chip.textContent = labelString;
		return chip;
	};
	this.init = function(){
		this.render();
	};
	this.init();
	return this;
}
export default xChips;