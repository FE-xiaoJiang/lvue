import { parseHTML } from './html-parser';
import { parseText } from './text-parser';

let stack = []; //非unary标签的数组栈
let currentParent = null;

class Compiler {
	constructor(template) {
		this._template = template;
		// this.compile();
	}
	createASTElement(options={

	}) {
		return {
			tag: options.tag,
			unary: options.unary,
			attrs: options.attrs,
			children: []
		}
	}
	compile() {
		return this.parse();
	}
	parse() {
		let currentParent = null;
		parseHTML(this._template, {
			expectHTML: false,
			start: (tag, attrs, unary, start, end) => {
				console.log(tag, attrs, unary, start, end)
				const ele = this.createASTElement({
					tag,
					unary,
					attrs
				});
				if (!currentParent) {
					currentParent = ele;
				} else {
					currentParent.children.push(ele);
				}
				if (unary) {//无子节点tag
					
				} else {
					currentParent = ele;
					stack.push(ele);
				}
			},
			end: (tag, start, end) => {
				console.log('end: ', tag, start, end);
				let ele = null;
				if (stack.length) {
					ele = stack[stack.length - 1];
					if (ele.tag == tag) {
						stack.pop();
					}
				}
				if (stack.length) {
					currentParent = stack[stack.length - 1];
				}
				if (!stack.length) {
					console.log('解析完成节点:', currentParent);
				}
			},
			chars: (text) => {
				const result = parseText(text);
				text = result ? result : text;
				console.log('chars:',text);
				currentParent.children.push(text);
			}
		});
		return currentParent;
	}
}

export default Compiler;