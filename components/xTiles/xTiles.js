function xTiles(element){
	this.render = function(){
		element.classList.add("xTiles");
	};
	this.init = function(){
		this.render();
	};
	this.init();

	return this;
}
export default xTiles;