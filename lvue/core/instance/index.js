/**
 * 
 * TODO 收集依赖
 * 
 */

import HTMLCompiler from '../../html-compiler';
import { generate } from '../../html-compiler/genCode';
import * as nodeOps from '../../run-time/node-ops';
import Watcher from '../../observer/watcher';
import { createElement, _s, createTextNode } from '../../vdom/create-element';
import { hyphenate } from '../../shared/util';
import { isHTMLTag } from '../../web/util/element';

//生命周期
const lifeEnum = ['beforeCreate', 'created'];

export default class LVue {
	/**
	 * 初始化组件
	 * @param  {[type]} options [description]
	 * @param  {[type]} type    类型，根组件or普通组件
	 * @return {[type]}         [description]
	 */
	constructor(options, type) {
		this.type = type;
		this.watchers = new Set();
		this._watcher = null;
		this.depComponents = this.depComponents || new Map();
		this.init(options);
	}
	init(options) {
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
		const vm = this;
		vm.$options = options;
		vm.children = [];
		let { data, el, template, components, _isComponent } = options;
		vm._isComponent = _isComponent;
		if (typeof data === 'function') {
			this.data = data();
		} else if(typeof data === 'object') {
			this.data = data;
		} else {
			throw 'data type error';
		}
		if (el) {
			vm.parentNode = document.querySelector(el);
		}
		this.dataGetSetter = {};
		this.initLifeCycle();
		this.callHook(vm, 'beforeCreate');
		this.initState();
		this.callHook(vm, 'created');
		this.initWatchData(vm);
		this.compileHtml(vm);
		// this.genCode(vm);
		this.$forceUpdate(vm);
		console.log('((((((((((',this);
		// this.iterateAnalysisComps(vm);
		// document.querySelector(el).innerHTML = (template);
	}
	compileHtml(vm) {
		let { template } = vm.$options;
		let ast = new HTMLCompiler(template).compile();
		let _render = generate(ast);
		vm._renderFn = new Function(`with(this) {console.log('********:', name);return ${_render}; }`);
		console.log('render:', vm._renderFn);
	}
	initLifeCycle() {

	}
	mountComponent() {

	}
	/**
	 * methods函数族作用域提升
	 * @param  {[type]} vm [description]
	 * @return {[type]}    [description]
	 */
	initState() {
		this.dealData();
	}
	/**
	 * data需要作用域提升到顶层
	 * @return {[type]} [description]
	 */
	dealData() {
		let data = this.data;
		for (const key in data) {
			Object.defineProperty(this, key, {
				enumerable: true,
				configurable: true,
				get() {
					return data[key];
				},
				set(value) {
					console.log(`set ${key}:${value}`);
					data[key] = value;
					this._watcher.notify();
				}
			});
			this.dataGetSetter[key] = data[key];
		}
	}
	render(vm) {
		vm.createElement = createElement.bind(null, vm);
		vm._s = _s;
		vm.createTextNode = createTextNode;
		let vDom = vm._renderFn.call(vm);
		// vDom.componentInst = vm.vDom && vm.vDom.componentInst ? vm.vDom.componentInst : null;
		console.log('vDom------->', vDom);
		vm.vDom = vDom;
	}
	$forceUpdate(vm) {
		// this.render(vm);
		// let vDom = vm.vDom;
		// let rDom = this.patch(vDom);
		// let parentNode = null;
		// if (vm._isComponent) {
		// 	console.log('--------------');
		// 	parentNode = document.querySelector(vm.componentName);
		// 	parentNode.outerHTML = (rDom);
		// } else {
		// 	parentNode = document.body;
		// 	parentNode.appendChild(rDom);
		// }
		// console.log('占位--------->',document.querySelector('vuecomponent-testcomp-0'));
		// console.log('update ele------>', rDom);
		this._watcher.notify();
	}

	$mount(vm) {
		
	}

	patch(context, oldVDom, vDom, $parent) {
		if (!vDom.tag) {
			return nodeOps.createTextNode(vDom.text);
		}else if(vDom.isComponent) {
			vDom.componentOptions.tag = `${vDom.componentOptions.componentName}-${Math.random().toString().substring(2)}`;
			$parent.appendChild(nodeOps.createElement(vDom.componentOptions.tag));
			if (!vDom.componentInst && !(oldVDom && oldVDom.componentInst)) {
				let componentOptions = vDom.componentOptions;
				let ComponentCtor = componentOptions.ComponentCtor;
				vDom.componentInst = new ComponentCtor(componentOptions);
				context.children.push(vDom.componentInst);
			} else {
				vDom.componentInst = !vDom.componentInst ? oldVDom.componentInst : vDom.componentInst;
				vDom.componentInst.$options = vDom.componentOptions; //覆盖原实例中的options
				vDom.componentInst.updateComponent(vDom.componentInst);
			}
			return;
		}
		let ele = nodeOps.createElement(vDom.tag);
		if($parent) {
			$parent.parentNode.replaceChild(ele, $parent);
			context.mountNode = ele; //记录挂载节点
			// mounted hook
			if (!context.ismounted) {
				this.callHook(context, 'mounted');
				context.ismounted = true; //标记已挂载
			}
			
		}
		for(var i = 0; vDom.children && i < vDom.children.length; i++) {
			let childEle = vDom.children[i];
			let oldChildELe = oldVDom && oldVDom.children[i];
			if (childEle.tag && !isHTMLTag(childEle.tag)) {
				this.patch(context, oldChildELe, childEle, ele);
			} else {
				nodeOps.appendChild(ele, this.patch(context, oldChildELe, vDom.children[i]));
			}
			
		}
		if(!$parent) {
			return ele;
		}
		
	}
	initEventListeners(vnode) {
		if (vnode.tag && vnode.events) {
			vnode.events.forEach((value, key, map) => {

			});
		}
	}
	updateComponent(vm) {
		if (!vm.ismounted) {
			// beforeMount hook
			this.callHook(vm, 'beforeMount');
		}
		vm.prevVDom = vm.vDom;
		this.render(vm);
		// let realDom = this.patch(vm.vDom);
		if(vm.$options.el) {
			if (!vm.ismounted) {
				this.patch(vm, vm.prevVDom, vm.vDom, document.querySelector(vm.$options.el));
			}else {
				this.patch(vm, vm.prevVDom, vm.vDom, vm.mountNode);
			}
		} else {
			// if (!vm.ismounted) {
				this.patch(vm, vm.prevVDom, vm.vDom, document.querySelector(vm.$options.tag));
			// }else {
			// 	this.patch(vm, vm.prevVDom, vm.vDom, vm.mountNode);
			// }
		}
	}
	initWatchData(vm) {
		this._watcher = new Watcher(vm, this.updateComponent, {

		});
	}
	callHook(vm, hook) {
		const hookFun = vm.$options[hook];
		hookFun && hookFun.call(vm);
	}
	/**
	 * 递归分析组件
	 * @return {[type]} [description]
	 */
	iterateAnalysisComps(vm) {
		const { components } = vm.$options;
		for (const name in components) {
			const subVm = new LVueComponent(components[name]);
			subVm.parentVm = vm;
			subVm.componentName = name;
			vm.children.set(name, subVm);
		}
	}



}