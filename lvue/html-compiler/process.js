
const EVTATTRReg = /^@[a-z]\w*/;

export function processRawAttrs(element) {

}

export function processEventAttr(elm, attr) {
	elm.events = elm.events ? elm.events : new Map();
	let { name, value } = attr;
	if(EVTATTRReg.test(name)) {
		elm.events.set(name.substring(1), value);
		return true;
	}
}

export function processAttrs(elm) {
	elm.events = elm.events ? elm.events : new Map();
	const { attrs } = elm;
	let attr = null;
	for(let i = 0; i < attrs.length; i++) {
		attr = attrs[i];
		if(processEventAttr(elm, attr)) {
			continue;
		}
	}
}