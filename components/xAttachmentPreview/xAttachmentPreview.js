import dom from "../../lib/xDOM.js";
import xIcon from "../xIcon/xIcon.js";
import xButton from "../xButton/xButton.js";
function xAttachmentPreview(element){
	this.element = element;
	this.data = null;

	// DOM --
	element.classList.add("xAttachmentPreview");

	// Instance Properties --
	this.setData = function(data){
		this.data = data;
		this.updatePreview();
	};
	this.downloadURI = function(uri, name){
		var link = document.createElement("a");
		document.body.appendChild(link);
		link.download = name;
		link.href = uri;
		link.style.display = "none";
		link.click();
	};
	this.updatePreview = function(){
		let that = this;
		element.innerHTML = "";
		let name = document.createElement("div");
		name.classList.add("AttachmentName");
		name.textContent = this.data.name;
		element.appendChild(name);

		let download = document.createElement("div");
		download.classList.add("DownloadContainer");
		element.appendChild(download);
			let downloadButton = dom.createXElement(xButton, {type : "xButton", "icon" : "font-awesome-icon, fa-download", theme: "vidhikarya.default.blue.circle.small"});
			download.appendChild(downloadButton.element);
			downloadButton.onClick=function(){
				that.downloadURI(that.data.url, that.data.name);
			};
	};
}
export default xAttachmentPreview;