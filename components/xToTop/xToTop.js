import dom from "../../lib/xDOM.js";
function xToTop(element){	
	// Instance Properties --
	this.element = element;

	// Private variables --
	let height = screen.height;
	
	// Creating DOM --
	element.classList.add("xToTop");
		let icon = document.createElement("i");
		icon.classList.add("material-icons");
		icon.textContent = "arrow_upward";
		element.appendChild(icon);

	// Watching --
	window.addEventListener("scroll", function(){
		if (document.documentElement.scrollTop > height) {
			element.classList.add("Show");
		}else{
			element.classList.remove("Show");
		}
	});
	dom.watch(element, "click", function(){
		window.scroll({
			top: 0, 
			left: 0,
			behavior: 'smooth'
		});
	});

	// Load Style --
	dom.loadStyle(element);

	return this;
}
export default xToTop;