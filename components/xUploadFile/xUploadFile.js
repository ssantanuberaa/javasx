import dom from "../../lib/xDOM.js";
import request from "../../lib/xRequest.js";
import obj from "../../lib/xObject.js";
import axios from "axios";
function xUploadFile(element){
	this.element = element;
	this.file = null;
	this.config = {};
	let bar, uploadStatus, progressBar;

	// DOM --
	element.classList.add("xUploadFile");

	this.onFileUploaded = function(response){};
	this.render = function(){
		let fileName = document.createElement("div");
		fileName.classList.add("xFileName");
		fileName.textContent = this.file.name;
		element.appendChild(fileName);

		let fileSize = document.createElement("div");
		fileSize.classList.add("xFileSize");
		fileSize.textContent = Math.round((this.file.size / 1024)) + " KB";
		element.appendChild(fileSize);

		progressBar = document.createElement("div");
		progressBar.classList.add("xUploadFileProgressBar");
		element.appendChild(progressBar);
			let track = dom.createElement("div", {classNames : "xUploadFileTrack"});
			progressBar.appendChild(track);
				bar = dom.createElement("div", {classNames : "xUploadFileBar"});
				track.appendChild(bar);

		uploadStatus = dom.createElement("div", {classNames : "xUploadFileUploadStatus"});
		element.appendChild(uploadStatus);
	};
	this.startUploading = function(){
		progressBar.classList.add("show");
		let formData = obj.mergeObject(this.config.formData, {file : this.file});
		this.uploadFile(this.config.url, formData, function(value){
			bar.style.width = value + "%";
			if (value == 100) {
				setTimeout(function(){
					progressBar.outerHTML = "";
					uploadStatus.classList.add("success");
					uploadStatus.textContent = "Successfully Uploaded !";
				}, 1000);
			}
		}).then(function(res){
			this.onFileUploaded(res.data);
		}.bind(this)).catch(function(error){
		});
	};
	this.setData = function(file, config){
		this.config = config;
		this.file = file;
		this.render();
		if (this.config.autoUpload) {
			this.startUploading();
		}
	};
	this.uploadFile = function(url, data, progressCallback){
		return new Promise(function(resolve, reject){
			let formData = new FormData();
			if (data == undefined) {
			}else{
				Object.keys(data).forEach((key)=>{
					formData.append(key, data[key]);
				});
			}

			var config = {
				onUploadProgress: function(progressEvent) {
					var percentCompleted = Math.round( (progressEvent.loaded *100)/ progressEvent.total );
					progressCallback(percentCompleted);
				},
				headers: {'Content-Type': 'multipart/form-data'}
			};

			axios.post(url, formData, config).then(function (res) {
				resolve(res);
			}).catch(function(error){
				resolve(error);
			});
		});
	};

	return this;
}
export default xUploadFile;