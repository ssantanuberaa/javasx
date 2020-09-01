import vue from "vue";
import VueRouter from "vue-router";
function xVueFrame(element){
	this.element = element;
	this.frames = [];
	
	this.render = function(){
		element.classList.add("xVueRouter");
	}
	this.init = function(){
		this.render();
	};
	this.setFrames = function(frames){
		this.frames = frames;
	};
	this.init();
}
export default xVueFrame;