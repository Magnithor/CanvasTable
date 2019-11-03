const path = require('path');
// const webpack = require('webpack');



module.exports = {
	mode: 'development',

	entry: {
		app: './app.ts',
		appWithWorker: './appWithWorker.ts',
		worker: './worker.ts'
	},

	output: {
//		filename: '[name].[chunkhash].js',
		filename: 'dist/[name].js',
		path: path.resolve(__dirname, './dist')
	},

	//plugins: [new webpack.ProgressPlugin(), new HtmlWebpackPlugin()],
	devtool: 'source-map',	
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
