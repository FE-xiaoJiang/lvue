/**
 * 虚拟dom节点
 */

export default class VNode {
	constructor(
		context,
		tag,
		children,
		componentOptions,
		isComponent,
		) {
		this.tag = tag;
		this.children = children;
		this.context = context;
		this.isComponent = isComponent;
		this.componentOptions = componentOptions;
	}
}