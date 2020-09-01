import xButton from "../xButton/xButton.js";
import xStaticList from "../xStaticList/xStaticList.js";
import xUploadFile from "../xUploadFile/xUploadFile.js";
import dom from "../../lib/xDOM.js";
import axios from "axios";
function xFileUploader(element){
	this.element = element;
	this.config = {};
	this.config.autoUpload = false;

	// Getting Attributes --
	let labelText = element.getAttribute("label");

	// DOM --
	element.classList.add("xFileUploader");
		let trigger = document.createElement("div");
		trigger.classList.add("xFileUploaderTrigger");
		element.appendChild(trigger);
			let triggerButton = dom.createXElement(xButton, {type : "xButton", icon : "font-awesome-icon,fa-upload", label: "Upload File", theme:"vidhikarya.default.blue.medium"});
			trigger.appendChild(triggerButton.element);

		let fileList = dom.createXElement(xStaticList, {type : "xStaticList"});
		element.appendChild(fileList.element);
		
		fileList.listItemFormatter = function(file){
			let fileComponent = dom.createXElement(xUploadFile, {type: "xUploadFile"});
			fileComponent.setData(file, this.config);
			return fileComponent.element;
		}.bind(this);

		// Hidden trigger Input --
		let triggerInput = document.createElement("input");
		triggerInput.setAttribute("type", "file");
		triggerInput.style.display = "none";

	trigger.addEventListener("click", function(event){
		triggerInput.click();
	});
	triggerInput.addEventListener("change", function(event){		
		Array.prototype.forEach.call(event.target.files, function(file){
			fileList.unshift(file);
		});
	}.bind(this));

	this.setTrigger = function(element){
		trigger.innerHTML = "";
		trigger.appendChild(element);
	};
	this.getFiles = function(){
		return fileList.dataSet;
	};
	this.onUpload = function(percentage){
		console.log(percentage);
	};
	this.uploadFiles = function(url, extraData){
		let that = this;
		let files = this.getFiles();
		return new Promise(function(resolve, reject){
			let formData = new FormData();
			Object.keys(extraData).forEach((key)=>{
				formData.append(key, extraData[key]);
			});
			files.forEach(function(file, index){
				formData.append("file"+index, file);
			});
			var config = {
				onUploadProgress: function(progressEvent) {
					var percentCompleted = Math.round( (progressEvent.loaded *100)/ progressEvent.total );
					that.onUpload(percentCompleted);
				},
				headers: {'Content-Type': 'multipart/form-data', "enctype" : "multipart/form-data"}
			};

			axios.post(url, formData, config).then(function (res) {
				resolve(res);
			}).catch(function(error){
				resolve(error);
			});
		}.bind(this));
	};
	this.deleteFiles = function(){
		fileList.removeAll();
	};

	return this;
}
export default xFileUploader;