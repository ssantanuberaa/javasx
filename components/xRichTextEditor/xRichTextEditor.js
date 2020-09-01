function xRichTextEditor(element){
	this.element = element;
	this.render = function(){
		let editorEl = document.createElement("div");
		editorEl.classList.add("xRichTextEditor");
		element.appendChild(editorEl);
	};
	this.init = function(){
		this.render();
		
	};
}