
/**
 * tag:div,
 */
import LVue from './lvue';
import TestComp from './components/testComp';
// import parseHtml from './lvue/html-compiler/parseHtmlTest'

new LVue({
	el: '#app',
	template: '<div><test-comp/><span class="myName" :name="name" @click="testClick">name:{{name}}</span>click<aside>aside123</aside><input value="haha" type="text" /><div test=1><span>no:</span>123</div><test-comp/></div>',
	data() {
		return {
			name: 'me, LVue',

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
			// setTimeout(() => {
				console.log('......', this.name);
				this.name = 'jxf';
				this.name = '333333';
				this.name = '6666666';
			// }, 3000);
		},
		testClick() {
			this.name = 'click name';
		}
	},
	/**
	 * 众生命周期函数
	 * @return {[type]} [description]
	 */
	beforeCreate() {
		this.name = '22222';
		this.name = '333333';
		this.name = '6666666';
	},
	created() {

	},
	beforeMount() {
		// this.setName();
	},
	mounted() {
		// for(var i = 0; i < 1000; i++) {
			this.setName();
		// }
	},

});