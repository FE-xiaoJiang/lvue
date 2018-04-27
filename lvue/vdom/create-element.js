

import { camelize, capitalize } from '../shared/util';
import { isHTMLTag } from '../web/util/element';
import VNode from './VNode';
import Component from '../core/component';

let _CTag = 0;

export function createElement(
	context,
	tag,
	children
	) {
	
	return _createElement(context, tag, children);
}

function _createElement(
	context,
	tag,
	children
	) {
	let vnode = null;
	if (isHTMLTag(tag)) {
		vnode = new VNode(context, tag, children);
	} else {
		return _createComponent(context, tag, children);
	}
	return vnode;
}

/**
 * 创建组件 TODO
 * @param  {[type]} compName [description]
 * @return {[type]}          [description]
 */
function _createComponent(
	context,
	compName
	) {
	console.log('context--->' , context, '_createComponent----->', this);
	let ccCompName = capitalize(camelize(compName));
	let depComp = null;
	if(context.depComponents && context.depComponents.has(ccCompName)) {
		depComp = context.depComponents.get(ccCompName);
	}
	let ComponentCtor = depComp.Component,
		  vueComponentName = depComp.name,
		  options= Object.assign({}, depComp.options);
	let componentName = `${vueComponentName}`;
	options._isComponent = true;
	options.componentName = componentName;
	options.parentVm = context;
	options.ComponentCtor = ComponentCtor;
	// options.tag = componentName;
	return new VNode(context, compName, undefined, options, true);
}

export function createTextNode(text) {
	// body...
	return {
		text: text
	};
}


export function _s(text) {
  return text;
}