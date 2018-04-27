

export function generate(ast) {
	let _render = genElement(ast);
	return _render;
}

function genElement(vnode) {
	let elm = null;
	if (typeof vnode == 'string') {
		elm = `createTextNode("${vnode}")`;
	} else if (!vnode.tag) {
		elm = `createTextNode(${vnode.expression})`;
	} else {
		if (vnode.unary || !vnode.children.length) {//一元标签或者子元素为空
			elm = `createElement("${vnode.tag}")`;
			// return elm;
		} else {
			let children = '[';
			for(let i = 0; i < vnode.children.length; i++) {
				if (!vnode.children[i]) {
					continue;
				}
				children = `${children}${genElement(vnode.children[i])},`;
			}
			children = `${children.substring(0, children.length - 1)}]`;
			elm = `createElement('${vnode.tag}', ${children})`;
		}
	}
	return elm;
}


// (function() {
// with(this) {console.log('********:', name);return createElement('div', createElement("test-comp"),createElement('span', createTextNode("name:"+_s(name))),createTextNode("click"),createElement('aside', createTextNode("aside123")),createElement("input"),createElement('div', createElement('span', createTextNode("no:")),createTextNode("123"))); }
// })