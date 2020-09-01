function SAnimate(elementQuery, options){
	this.elementQuery = elementQuery;
	this.element = document.querySelector(elementQuery);
	this.animatables = [];
	this.options = options;
	this.defaultConfig = (this.element.dataset == undefined)?{}:this.element.dataset;
	this.totalTAT = 0;
	this.startAnimation = function(animatables){
		if (animatables == undefined || animatables == null) {
				this.removeAnimations();
				if (this.options.beforeAnimation != undefined) {
					this.beforeAnimation();
				}
				let totalTAT = 0;
				let elementTAT = 0;
				[].forEach.call(this.animatables, function(element, index){
					// Calculate Delay--
					let delay = 0;
					if (element.dataset.delay != undefined) {
						delay = element.dataset.delay;
					}else if (this.defaultConfig.delay != undefined){
						delay = this.defaultConfig.delay;
					}else if (this.defaultConfig.delayStart != undefined){
						delay = Number(this.defaultConfig.delayStart) + (index * Number(this.defaultConfig.delayIncrement));
					}
					// Calculate Duration--
					let duration = 0;
					if (element.dataset.duration != undefined) {
						duration = element.dataset.duration;
					}else if (this.defaultConfig.duration != undefined) {
						duration = this.defaultConfig.duration;
					}else if (this.defaultConfig.durationStart != undefined){
						duration = Number(this.defaultConfig.durationStart) + (Number(this.defaultConfig.durationIncrement) * index);
					}

					// Assign Property to the Elemeent --
					element.style.animationDuration = element.style.transitionDuration = duration + "ms";
					element.style.animationDelay = delay + "ms";
					element.classList.add(element.dataset.animation);

					// TAT = Total time for animation, Turn around time
					elementTAT = (Number(duration) + Number(delay));
					this.totalTAT = totalTAT = (totalTAT>elementTAT)?totalTAT:elementTAT; // max ElementTAT = totalTAT
					setTimeout(function(){
						element.classList.remove(element.dataset.animation);
					}.bind(this), elementTAT);
				}.bind(this));
				// After Animation Hook--
				if (this.options.afterAnimation != undefined) {
					setTimeout(function(){
						this.options.afterAnimation(this);
					}.bind(this), totalTAT);
				}
		}else{
				this.setAnimatables(animatables).startAnimation();
		}
		return this;
	};
	this.beforeAnimation = function(){
		this.options.beforeAnimation(this);
	};
	this.removeAnimation = function(element){
		element.classList.remove(element.dataset.animation);
	};
	this.removeAnimations = function(){
		[].forEach.call(this.animatables, function(element, index){
			element.classList.remove(element.dataset.animation);
		}.bind(this));
		return this;
	};
	this.setAnimatables = function(data){
		this.removeAnimations();
		this.animatables = data;
		return this;
	};
	this.handleOptions = function(){
		if (this.options.beforeAnimation != undefined) {}
		return this;
	};
	this.init = function(){
		this.animatables = document.querySelectorAll(this.elementQuery + " [data-animation]");
		return this.handleOptions();
	}
	return this.init();
}