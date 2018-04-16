export default {
	template: '<div>comp name: {{name}}</div>',
	data() {
		return {
			name: 'me, test component'
		}
	},
	props: ['prop1'],
	components: {

	},
	computed: {

	},
	methods: {

	},
	/**
	 * 众生命周期函数
	 * @return {[type]} [description]
	 */
	beforeCreated() {
		this.name = 'me, test component ...';
	},
	created() {

	}
}