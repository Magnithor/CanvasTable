const path = require('path');
// const webpack = require('webpack');

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

// const HtmlWebpackPlugin = require('html-webpack-plugin');

/*
 * We've enabled HtmlWebpackPlugin for you! This generates a html
 * page for you when you compile webpack, which will make you start
 * developing and prototyping faster.
 *
 * https://github.com/jantimon/html-webpack-plugin
 *
 */

module.exports = {
	mode: 'development',

	entry: {
		app: './src/app.ts',
		worker: './src/worker.ts',
		appWithWorker: './src/appWithWorker.ts'
	},

	output: {
//		filename: '[name].[chunkhash].js',
		filename: 'dist/[name].js',
		path: path.resolve(__dirname, './dist')
	},

	//plugins: [new webpack.ProgressPlugin(), new HtmlWebpackPlugin()],

	module: {
		rules: [
			{
				test: /.(ts|tsx)?$/,
				loader: 'ts-loader',
				include: [path.resolve(__dirname, './../')],
				exclude: [/node_modules/]
			}
		]
	},
	devServer: {
		open: true,
		port: 9000,
		host: '127.0.0.1',
		hot: false,
		inline: false
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	}
};
