import x from "x";
import frame from "../../lib/xFrame.js";
import dom from "../../lib/xDOM.js";
import axios from "axios";
function xFrames(element){
	this.element = element;
	this.options = null;
	this.frames = [];
	this.frameStore = {};
	this.root = null;
	this.frameName = "";

	let componentSection, loader, styleContainer;

	this.onFrameLoaded = function(frameOptions){};
	this.render = function(){
		this.frameName = element.getAttribute("name");

		element.classList.add("xFrames");

			styleContainer = document.createElement("div");
			styleContainer.classList.add("xFramesStyleContainer");
			element.appendChild(styleContainer);

			loader = document.createElement("div");
			loader.classList.add("xFrameLoaderContainer");
			element.appendChild(loader);
				let loaderEl = document.createElement("div");
				loaderEl.classList.add("frameLoader");
				loader.appendChild(loaderEl);
					let temp = document.createElement("div");
					loaderEl.appendChild(temp);
					temp = document.createElement("div");
					loaderEl.appendChild(temp);

			componentSection = document.createElement("div");
			this.root = componentSection;
			frame.root = componentSection;
			componentSection.classList.add("xFrameComponentSection");
			componentSection.setAttribute("type", "xApp");
			componentSection.setAttribute("name", this.frameName);

			element.appendChild(componentSection);
	};
	this.onSignal = function(signalName, data){};
	this.init = function(options){
		this.options = options;
		this.render();
		this.removeLoading();
		this.setFrames(options.frames);
	};
	this.setFrames = function(frames){
		frame.setFrames(frames);
	};
	this.removePreviousxAppStyleForThisFrame = function(){
		let frameName = this.frameName;
		for(let i=0; i<document.head.children.length; i++){
			let styleElement = document.head.children[i];

			if(styleElement.getAttribute("id") == frameName){
				styleElement.outerHTML = "";
				break;
			}
		}
	};
	this.loadFrame = function(frameName, frameData){
		this.removePreviousxAppStyleForThisFrame();
		frame.frames.forEach((frameOptions, index)=>{
			if (frameOptions.name == frameName) {
				frame.frameOptions = frameOptions;
				if (frameOptions.compiledModule != undefined) {
					this.compileFrame(frameOptions.compiledModule, frameOptions, index, frameData);
				}else{
					this.fetchFrame(frameOptions).then(function(frameModule){
						frame.frameOptions.compiledModule = frameModule;
						this.compileFrame(frameModule, frameOptions, index, frameData);
					}.bind(this));
				}
			}
		});
	};
	this.fetchFrame = function(frameOptions){
		this.addLoading();
		let that = this;
		return new Promise(function(resolve, reject){
			if (frameOptions.url == undefined) {
				frameOptions.url = "/js/build/frames/" + frameOptions.name + ".min.js";
			}
			if(this.options.fetchMethod == "GET"){
				axios.get(frameOptions.url).then(function(res){
					let compiledModule = eval(res.data).default;
					resolve(compiledModule);
				}).catch(function(error){
					console.log(error);
					this.removeLoading();
				}.bind(this));
			}else{
				axios.post(frameOptions.url).then(function(res){
					let compiledModule = eval(res.data).default;
					resolve(compiledModule);
				}).catch(function(error){
					console.log(error);
					this.removeLoading();
				}.bind(this));
			}			
		}.bind(this));
	};
	this.compileFrame = function(frameModule, frameOptions, index, frameData){
		frame.frameOptions = frameOptions;
		componentSection.innerHTML = frameModule.template;
		if (frameModule.style != undefined) {
			styleContainer.innerHTML = frameModule.style;
		}
		x.init(componentSection, frameModule.components, frameModule.styles).then(function(s){
			frameModule.mounted(s, window['x'], frame, frameData);
			this.onFrameLoaded(frameOptions);
			this.removeLoading();
		}.bind(this));
	};
	this.addLoading = function(){
		loader.style.display = "flex";
	};
	this.removeLoading = function(){
		loader.style.display = "none";
	};
	return this;
}
export default xFrames;