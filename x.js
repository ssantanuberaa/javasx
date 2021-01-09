function x(options){
	function init(props, options){
		let component = {};

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
			component.element.setAttribute("style", props.style);
		}

		// Check Option ClassNames --
		if(props.classNames != undefined){
			applyClassName(props, component);	
		}

		uniqueComponents(options);

		return component;
	};
	function createStyleTag(css){
		let el = document.createElement("style");
		el.setAttribute("type", "text/css");
		el.textContent = css;
		document.documentElement.firstChild.appendChild(el);
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
	function applyRootStyle(props, component){
		component.element.setAttribute("style", props.style);
	}
	function uniqueComponents(options){
		let ucom = window['unique_components'];
		if(ucom == undefined){
			ucom = window['unique_components'] = new Set();
		}

		if(!ucom.has(options.name)){
			ucom.add(options.name);
			// CSS --
			if(options.css !== undefined){
				console.log(options.name);
				let node = document.createElement("style");
				node.setAttribute("component", options.name);
				node.setAttribute("type", "text/css");
				node.textContent = options.css;
				document.documentElement.firstChild.appendChild(node);
			}
		}
	}
	
	return function(props){
		return init(props, options);
	}
}
export default x;