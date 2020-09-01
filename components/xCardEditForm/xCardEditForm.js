import dom from "../../lib/xDOM.js";
import xModal from "../../components/xModal/xModal.js";

function xCardEditForm(element){
	this.element = element;

	let cardContent, modal, formContent;

	this.render = function(){
		element.classList.add("xCardEditForm");
			cardContent = document.createElement("div");
			cardContent.classList.add("xCardEditFormCardContent");
			element.appendChild(cardContent);

			modal = dom.createXElement(xModal, {
				type: "xModal",
				"background-close" : true,
				'classNames' : "width600 fullheight"
			});
			element.appendChild(modal.element);

				let modalContent = document.createElement("div");
				modalContent.classList.add("ModalContent");

					let modalHeader = document.createElement("div");
					modalHeader.classList.add("ModalHeader");
					modalContent.appendChild(modalHeader);
						let modalTitle = document.createElement("div");
						modalTitle.classList.add("ModalTitle");
						modalHeader.appendChild(modalTitle);
						modalTitle.textContent = element.getAttribute("modal-title");

						let modalClose = document.createElement('div');
						modalClose.classList.add("ModalClose");
						modalHeader.appendChild(modalClose);
							let closeIcon = document.createElement("span");
							closeIcon.classList.add("material-icons");
							closeIcon.textContent = "close";
							modalClose.appendChild(closeIcon);

						modalClose.addEventListener("click", function(event){
							modal.close();
						});

					formContent = document.createElement("div");
					formContent.classList.add("FormContent");
					modalContent.appendChild(formContent);

			modal.setContent(modalContent);

			let editIcon = document.createElement("div");
			editIcon.classList.add("EditIcon");
			element.appendChild(editIcon);
				let icon = document.createElement("span");
				icon.textContent = "edit";
				icon.classList.add("material-icons");
				editIcon.appendChild(icon);

			let that = this;
			editIcon.addEventListener("click", function(event){
				that.onFormOpen();
				modal.open();
			});
	};

	this.onFormOpen = function(){};
	this.init = function(){
		this.render();
		this.setContent();
		this.setForm();
	};
	this.setContent = function(){
		Array.prototype.forEach.call(element.children, function(childNode, index){
			if (childNode.getAttribute("content") != null) {
				cardContent.innerHTML = "";
				cardContent.appendChild(childNode);
			}else if(childNode.getAttribute("form") != null){
				modal.setContent(childNode);
			}
		});
	};
	this.setForm = function(){
		Array.prototype.forEach.call(element.children, function(childNode, index){
			if(childNode.getAttribute("form") != null){
				formContent.appendChild(childNode);
			}
		});
	}
	this.init();
	return this;
}
export default xCardEditForm;