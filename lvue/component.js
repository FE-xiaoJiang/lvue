/**
 * 
 * 轻量级vue框架
 * 
 */

import HTMLCompiler from './html-compiler';
import * as nodeOps from './run-time/node-ops';
import Watcher from './observer/watcher';

//未初始化生命周期
const lifeCycleBeforeInitHook = ['beforeCreate', 'created', 'beforeMount', 'render', 'mounted'];
//初始化完成后生命周期
const lifeCycleInitedHook = ['beforeUpdate', 'render', 'updated', 'activated'];

const LIFECYCLEHOOKS = [
	'beforeCreate',
	'created',
	'beforeMount',
	'mounted',
	'beforeUpdate',
	'updated',
	'beforeDestroy',
	'destroyed',
	'activated',
	'deactivated',
	'errorCaptured'
];

class LVueComponent {

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
		this.init(options);
	}
	init(options) {
		const vm = this;
		vm.$options = options;
		vm.children = [];
		let { data, el, template, components } = options;
		if (typeof data === 'function') {
			this.data = data();
		} else if(typeof data === 'object') {
			this.data = data;
		} else {
			throw 'data type error';
		}
		this.dataGetSetter = {};
		this.initLifeCycle();
		this.initMethods(vm);
		this.callHook(vm, 'beforeCreate');
		this.initState();
		this.callHook(vm, 'created');
		vm.$root = this.compileHtml(vm);
		this.iterateAnalysisComps(vm);
		this.initWatchData(vm);
		this.render(vm);
		// document.querySelector(el).innerHTML = (template);
	}
	compileHtml(vm) {
		let { template } = vm.$options;
		return new HTMLCompiler(template).compile();
	}
	initLifeCycle() {

	}
	/**
	 * methods函数族作用域提升
	 * @param  {[type]} vm [description]
	 * @return {[type]}    [description]
	 */
	initMethods(vm) {
		const options = vm.$options;
		const { methods } = options;
		for(const name in methods) {
			vm[name] = methods[name].bind(vm);
		}
	}
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
				get() {
					return data[key];
				},
				set(value) {
					console.log(`set ${key}:${value}`);
					// 数据更新，触发数据的watch handler
					this._watcher.notify();
				}
			})
			this.dataGetSetter[key] = data[key];
		}
	}
	render(vm) {
		let { $root } = vm;
		let ele = nodeOps.createElements($root);
		console.log('render:', ele);
	}
	initWatchData(vm) {
		this._watcher = new Watcher(vm, this.render, {

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
			vm.children.push(new LVueComponent(components[name]));
		}
	}

}

module.exports = LVueComponent;