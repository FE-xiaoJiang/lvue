/**
 * 
 * 轻量级vue框架
 * 
 */

import LVue from './instance/index';
import { hyphenate } from '../shared/util';

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

LVue.extend = function extend(options) {
	class LVueComponent extends LVue{

		/**
		 * 初始化组件
		 * @param  {[type]} options [description]
		 * @param  {[type]} type    类型，根组件or普通组件
		 * @return {[type]}         [description]
		 */
		constructor(options, type) {
			super(options, type);
		}

	}

	let _proto = Object.create(LVueComponent.prototype);
	_proto.depComponents = new Map();
	initMethods(_proto, options);
	initComputed(_proto, options);
	iterateAnalysisComps(_proto, options);
	LVueComponent.prototype = _proto;
	return LVueComponent;
}

function initMethods(_proto, options) {
	let methods = options.methods;
	if (!methods) {
		return;
	}
	for(let funName in methods) {
		_proto[funName] = methods[funName];
	}
}

function initComputed(_proto, options) {
	let computed = options.computed;
	if (!computed) {
		return;
	}
	for(let funName in computed) {
		_proto[funName] = computed[funName];
	}
}
/**
 * 递归分析组件
 * @return {[type]} [description]
 */
function iterateAnalysisComps(_proto, options) {
	const { components } = options;
	if (!components) {
		return;
	}
	for (const name in components) {
		let componentInst = {
			name: `vue-component-${hyphenate(name)}`,
			options: components[name],
			Component: LVue.extend(components[name])
		};
		_proto.depComponents.set(name, componentInst);
	}
}

export default LVue;