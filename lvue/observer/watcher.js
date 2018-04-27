
let wid = 1;


import { watcherQueue } from './scheduler';

export default class Watcher {
	constructor(vm, handler, option) {
		this.$option = option;
		this.context = vm;
		this.handler = handler; // handler中进行update生命周期处理
		this.taskQueue = new Map(); // 相同id的任务只执行一次
		this.init();
	}
	init() {
		let $option = this.$option;
		this.id = wid++;
		this.depIds = new Set(); // 依赖
		this.deps = [];
		//收集依赖
		// this.addDep(this);
	}
	defineReactive(value) {
		for(const key in value) {
			Object.defineProperty(value, key, {
				enumerable: true,
				configure: true,
				get: () => {
					console.log('^^^^^^^^^^^^^*************');
					// return value[key];
				},
				set: () => {
					this.notify();
				}
			})
		}
	}
	notify() {
		console.log('start notify...');
		watcherQueue(this);
		//依赖渲染
		
	}
	run() {
		this.handler.call(this.context, this.context);
	}
	addDep(dep) {
		var id = dep.id;
		if (!this.depIds.has(id)) {
		  dep.push(this);
		}
	}
}