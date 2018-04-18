
/**
 * tag:div,
 */
import LVue from './lvue';
import TestComp from './components/testComp';
// import parseHtml from './lvue/html-compiler/parseHtmlTest'

new LVue({
	el: '#app',
	template: '<div><test-comp/><span class="myName" :name="name">name:{{name}}</span>6666666<aside>aside123</aside><input value="haha" type="text" /><div test=1><span>no:</span>123</div></div>',
	data() {
		return {
			name: 'me, LVue'
		}
	},
	props: ['prop1'],
	components: {
		TestComp,
	},
	computed: {

	},
	methods: {
		setName() {
			setTimeout(() => {
				console.log('......', this.name);
				this.name = 'jxf';
			}, 300);
		},
	},
	/**
	 * 众生命周期函数
	 * @return {[type]} [description]
	 */
	beforeCreate() {
		this.setName();
	},
	created() {

	}
});