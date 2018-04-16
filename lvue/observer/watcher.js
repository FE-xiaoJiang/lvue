
let wid = 1;

export default class Watcher {
	constructor(vm, handler, option) {
		this.$option = option;
		this.vm = vm;
		this.handler = handler; // handler中进行update生命周期处理
		this.init();
	}
	init() {
		let $option = this.$option;
		this.id = wid++;
		this.depIds = new Set(); // 依赖
		this.deps = [];
	}
	notify() {
		console.log('start notify...');
		this.handler.call(this.vm, this.vm);
	}
	addDepId(dep) {
		var id = dep.id;
		if (!this.depIds.has(id)) {
		  dep.addSub(this);
		}
	}
}