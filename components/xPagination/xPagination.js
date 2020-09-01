import dom from "../../lib/xDOM.js";
import url from "../../lib/xURL.js";
import xIcon from "../xIcon/xIcon.js";
function xPagination(element){
	this.element =  element;
	this.totalPages = 10;
	this.currentPage = 5;
	this.queryParameter = "";
	this.baseURL = "";
	this.url = "";

	let pages, page, prev, next, icon;

	this.render = function(){
		element.classList.add("xPagination");
			prev = document.createElement("a");
			prev.classList.add("xPaginationPrevious");
			element.appendChild(prev);
				icon = dom.createXElement(xIcon, {type: "xIcon", icon : "material-icon,keyboard_arrow_left"});
				prev.appendChild(icon.element);


			pages = document.createElement("div");
			pages.classList.add("xPaginationPages");
			element.appendChild(pages);

			next = document.createElement("a");
			next.classList.add("xPaginationNext");
			element.appendChild(next);
				icon = dom.createXElement(xIcon, {type : "xIcon", icon : "material-icon,keyboard_arrow_right"});
				next.appendChild(icon.element);
	};
	this.createPages = function(){
		let parameters = url.decodeQueryString(this.url);
		let href = "";
		let start = this.currentPage - 4;
		let end = this.currentPage + 4;

		pages.innerHTML = "";
		if (this.currentPage - 4 <= 0) {
			start = 1;
			if (start + 10 > this.totalPages) {
				end = this.totalPages;
			}else{
				end = start + 10;
			}
		}else{
			start = this.currentPage - 4;
			if (start + 10 > this.totalPages) {
				end = this.totalPages;
			}else{
				end = start + 10;
			}
		}
		
		for(let i=start; i<=end; i++){
			parameters[this.queryParameter] = i;
			href = url.createURL(this.baseURL, parameters);
			page = document.createElement("a");
			page.classList.add("xPaginationPageItem");
			if (this.currentPage == i) {
				page.classList.add("current");
			}
			page.textContent = i;
			page.setAttribute("href", href);
			pages.appendChild(page);
		}
		// -----
		if (this.totalPages == 1) {
			prev.classList.add("disabled");
			next.classList.add("disabled");
		}else{
			if (this.currentPage == 1) {
				prev.classList.add("disabled");
				next.classList.remove("disabled");
				parameters[this.queryParameter] = this.currentPage + 1;
				next.setAttribute("href", url.createURL(this.baseURL, parameters));			
			}else if (this.currentPage == this.totalPages) {
				next.classList.add("disabled");
				prev.classList.remove("disabled");
				parameters[this.queryParameter] = this.currentPage - 1;
				prev.setAttribute("href", url.createURL(this.baseURL, parameters));
			}else{
				next.classList.remove("disabled");
				prev.classList.remove("disabled");
			}
		}	
	};
	this.setURL = function(urlString){
		this.url = urlString;
		this.baseURL = url.trimQueryString(urlString);
		this.currentPage = url.getParameterByName(this.queryParameter, urlString);
		if (this.currentPage == null || this.currentPage == undefined) {
			this.currentPage = 1;
		}
		if (this.currentPage != null) {
			this.currentPage = parseInt(this.currentPage);
		}
	};
	this.init = function(){
		this.render();
	};
	this.init();
	return this;
}
export default xPagination;