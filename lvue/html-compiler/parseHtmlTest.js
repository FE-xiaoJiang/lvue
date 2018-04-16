let { parseHTML } = require('./html-parser');

let html = '<comp>6666666<aside>aside123</aside><input value="haha" type="text" /><div test=1><span>no:</span>123</div></comp>';
let stack = []; //非unary标签的数组栈
let currentParent = null;
function createASTElement(options={

}) {
	return {
		tag: options.tag,
		unary: options.unary,
		attrs: options.attrs,
		children: []
	}
}
let results = parseHTML(html, {
	expectHTML: false,
	start: function(tag, attrs, unary, start, end) {
		console.log(tag, attrs, unary, start, end)
		const ele = createASTElement({
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
	end: function(tag, start, end){
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
	chars: function(text) {
		console.log('chars:',text);
		currentParent.children.push(text);
	}
});

console.log(html );