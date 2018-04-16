/**
 * 虚拟dom节点
 */

class VNode {
	tag: string = '';
	parent: VNode = null;
	children: Array<VNode> = [];

	constructor(
		tag?: string,
		children?: Array<VNode>
		) {
		this.tag = tag;
		this.children = children;
	}
}