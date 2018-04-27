/**
 * 
 * 轻量级vue框架
 * 顶级入口
 * 		第一步：分析依赖组件
 * 		第二步：混合config，创建入口组件
 * 		第三步：初始化入口组件
 * 
 */

import HTMLCompiler from '../html-compiler';
import { generate } from '../html-compiler/genCode';
import * as nodeOps from '../run-time/node-ops';
import Watcher from '../observer/watcher';
import { createElement, _s, createTextNode } from '../vdom/create-element';
import { hyphenate } from '../shared/util';
import LVue from './component';

//生命周期
const lifeEnum = ['beforeCreate', 'created'];

export default class LVueInit {
	/**
	 * 初始化组件
	 * @param  {[type]} options [description]
	 * @param  {[type]} type    类型，根组件or普通组件
	 * @return {[type]}         [description]
	 */
	constructor(options) {
		// super(options);
		this.el = options.el;
		this._init(options);
	}
	_init(options) {
		let LVueComp = LVue.extend(options);
		new LVueComp(options);
	}
	initPorps() {

	}



}