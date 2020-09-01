function xSlider(element){
	this.element = element;
	this.sliderNodes = [];
	this.currentSlideIndex = 0;
	this.currentSlideNode = null;
	this.currentSlideName = "";

	this.render = function(){
		element.classList.add("xSlider");
	};
	this.onSlide = function(slideName, index, slideNode){};
	this.init = function(){
		this.render();

		// ---------
		Array.prototype.forEach.call(element.children, function(slider){
			this.sliderNodes.push(slider);
		}.bind(this));

		// ---------
		this.goToSlide(0);
	};
	this.goToSlide = function(slideIndex){
		if (typeof slideIndex == "number") {
			this.sliderNodes.forEach((slider, index)=>{
				if (index == slideIndex) {
					if (this.currentSlideNode != null) {
						this.currentSlideNode.classList.remove("active");
					}
					slider.classList.add("active");
					this.currentSlideNode = slider;
					this.currentSlideIndex = index;

					// --
					let slideName = slider.getAttribute("key");
					this.currentSlideName = slideName;
					this.onSlide(slideName, index, slider);
				}
			});
		}else if (typeof slideIndex == "string") {
			this.sliderNodes.forEach((slider, index)=>{
				if (slider.getAttribute("key") == slideIndex) {
					if (this.currentSlideNode != null) {
						this.currentSlideNode.classList.remove("active");
					}
					slider.classList.add("active");
					this.currentSlideNode = slider;
					this.currentSlideIndex = index;

					// --
					this.currentSlideName = slideIndex;
					this.onSlide(slideIndex, index, slider);
				}
			});
		}
	};
	this.init();

	return this;
}
export default xSlider;