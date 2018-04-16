var path = require("path"),
	fs = require("fs"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	webpack = require("webpack"),
	Clean = require('clean-webpack-plugin');
ExtractTextPlugin = require("extract-text-webpack-plugin"),
	adaptive = require("postcss-adaptive"),
	autoprefixer = require("autoprefixer"),
	preplugins = [];
// const resolve = require('./resolve');
const static = '';

const BUILD = 'build',
	DEV = 'dev';
module.exports = (env)=> {
	let outputDir = +env.production ? BUILD : DEV;
	+env.production ? preplugins.push(new Clean([BUILD],{
		root:path.join(__dirname,'./')
	})):"";
	let htmls = ([{}]).map((item)=>htmlHelper(item));

	let newConfig = {
		entry:{
			index:'./example.js'
		}
		,output:Object.assign({
			filename:+env.production||+env.md5 ? '[name].[chunkhash].js' : '[name].js',
			path:path.resolve(__dirname,outputDir),
			chunkFilename:'[name].[chunkhash].js'
		},{})
		,resolve: {
			alias: {
				// 'vue$': 'vue/dist/vue.esm.js'
			}
		}
		,mode: +env.production?'production':'development'
		,module:{
			rules:[{
					test:/\.(less|css)$/,
					exclude:/(node_modules)/,
					use: ExtractTextPlugin.extract({
						use: [{
							loader: "css-loader"
						}, {
							loader: "postcss-loader"
						}, {
							loader: "less-loader"
						}],
						// use style-loader in development
						fallback: "style-loader"
					})
				}
				// ,{
				// 	test:/\.vue$/,
				// 	exclude:/(node_modules)/,
				// 	loader: 'vue-loader'
				// }
				,{
					test:/\.js$/,
					exclude:/(node_modules)/,
					loader: 'babel-loader'
				},
				{
					test:/\.(png|jpg|jpeg|gif|webp|svg)$/,
					loader:'url-loader?name=assets/images/[name].[hash:8].[ext]&limit=8192' // <8k的图片，输出为base64 dataurl
				},
				{
					test:/\.(eot|ttf|woff)$/,
					loader:'file-loader?name=assets/fonts/[name].[hash:8].[ext]' // 字体文件处理
				}]
		}
		,devtool:+env.production?'#source-map':'source-map' // 'eval'
		,plugins:preplugins.concat([
			// new ExtractTextPlugin(+env.production?'[name].[contenthash:8].css':'[name].css',{
			// 	allChunks:true
			// }),
			// new webpack.optimize.CommonsChunkPlugin({
   //              names: ['vendor', 'manifest'] // 指定公共 bundle 的名字。
   //          })
		].concat(htmls)),
		optimization: {
		     splitChunks: {
		     chunks: "initial", // 必须三选一： "initial" | "all"(默认就是all) | "async" 
		     minSize: 0, // 最小尺寸，默认0
		     minChunks: 1, // 最小 chunk ，默认1
		     maxAsyncRequests: 1, // 最大异步请求数， 默认1
		     maxInitialRequests : 1, // 最大初始化请求书，默认1
		     name: function(){}, // 名称，此选项可接收 function
		     cacheGroups:{ // 这里开始设置缓存的 chunks
		         priority: false, // 缓存组优先级
		         vendor: { // key 为entry中定义的 入口名称
		             chunks: "initial", // 必须三选一： "initial" | "all" | "async"(默认就是异步) 
		             test: /react|lodash/, // 正则规则验证，如果符合就提取 chunk
		             name: "vendor", // 要缓存的 分隔出来的 chunk 名称 
		             minSize: 0,
		             minChunks: 1,
		             enforce: true,
		             maxAsyncRequests: 1, // 最大异步请求数， 默认1
		             maxInitialRequests : 1, // 最大初始化请求书，默认1
		             reuseExistingChunk: true // 可设置是否重用该chunk（查看源码没有发现默认值）
		         	}
		     	}
		  	}
		},

	};

	return newConfig;
}

let htmlHelper = (htmlConfig)=>{
	return new HtmlWebpackPlugin({
		template:'./index.html'
		,filename:'index.html'
		,chunks:['index', 'vendor', 'manifest']
		// ,minify:true
		,inject:"body"
	})
}

