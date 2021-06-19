function x(options){
	let singleStyle = false;
	function init(props, options){
		let component = {};

		globalTask(options);

		// CSS --
		if(options.css !== undefined){
			loadCSS(options);
		}

		// $emit, $on --
		component.$listeners = [];
		component.$on = function(command, callback){
			component.$listeners.push({command, callback});
		};
		component.$emit = function(command, payload){
			component.$listeners.forEach((item)=>{
				if(item.command == command){
					item.callback(payload);
				}
			});
		};

		// Set Child --
		component.$setChild = function(child){
			if(child.$css !== undefined){
				createStyleTag(child.$css);
			}
			this.setChild(child);
		};

		// Binding Props --
		component.props = props;

		// Setting name --
		component.name = options.name;

		// Binding Data --
		if(options.data !== undefined){
			Object.keys(options.data).forEach(function(dataName){
				component[dataName] = options.data[dataName];
			});
		}

		// Binding Methods --
		if(options.methods !== undefined){
			Object.keys(options.methods).forEach(function(methodName){
				component[methodName] = options.methods[methodName];
			});
		}

		// Binding Scope --
		component.$scope = [];
		if(options.scope !== undefined){
			createScope(options.scope, component);
		}

		// Render --
		if(options.render != undefined){
			component.render = options.render;
			component.element = component.render();
			if(component.element.nodeType !== Node.ELEMENT_NODE){
				console.log(component.element);
				throw new Error("Must Return DOM Element : " + component.name);
			}
		}

		// Mounted --
		if(options.mounted != undefined){
			component.mounted = options.mounted;
			component.mounted();
		}

		// Apply root style --
		if(props.style != undefined){
			if(typeof props.style == "string"){
				component.element.setAttribute("style", component.element.getAttribute("style") + props.style);
			}else if(typeof props.style == "object"){
				// Object implementation --
			}
		}

		// Check Option ClassNames --
		if(props.classNames != undefined){
			applyClassName(props, component);	
		}

		if(component.props.onInit !== undefined && isFunction(component.props.onInit)){
			component.props.onInit(component);
		}

		add_component(options);

		return component;
	}
	function globalTask(options){
		let $x = window['$x'];
		if($x === undefined){
			$x = window['$x'] = {
				"unique_components" : new Set(),
			};
		}
	}
	function add_component(options){
		// Add Unique components --
		let $x = window['$x'];
		$x.unique_components.add(options.name);
	}
	function isFunction(functionToCheck) {
		return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
	}
	function createStyleTag(options){
		let $x = window['$x'];
		if(!$x.unique_components.has(options.name)){
			let el = document.createElement("style");
			el.setAttribute("type", "text/css");
			el.textContent = options.css;
			document.documentElement.firstChild.appendChild(el);
		}
	}
	function loadCSS(options){
		if(singleStyle == true){
			if(window['x-style'] !== undefined){
				window['x-style'] = window['x-style'] + options.css;
			}else{
				window['x-style'] = options.css;
			}	
		}else{
			createStyleTag(options);
		}
	}
	function createScope(scope, component){
		component.$scope.push(scope);
	}
	function applyClassName(props, component){
		let classNames = props.classNames.split(" ");
		classNames.forEach(function(name){
			component.element.classList.add(name);
		});
	}
	return function(props){
		return init(props, options);
	}
}
export default x;