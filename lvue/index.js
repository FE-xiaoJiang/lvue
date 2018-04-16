/**
 * 
 * 轻量级vue框架
 * 
 */

import LVueComponent from './component';

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
		this.rootComp = new LVueComponent(options, 'root');
		console.log(this.rootComp);
	}



}

