const path = require("path");
// const webpack = require("webpack");

module.exports = {
	mode: "development",
	entry: {
		app: "./app.ts",
		appWithWorker: "./appWithWorker.ts",		
		kjartan: "./kjartan.ts",
		worker: "./worker.ts",
	},

	output: {
		// filename: "[name].[chunkhash].js",
		filename: "dist/[name].js",
		path: path.resolve(__dirname, "./dist"),
	},

	// plugins: [new webpack.ProgressPlugin(), new HtmlWebpackPlugin()],
	devtool: "source-map",	
	module: {
		rules: [
			{
				exclude: [ /node_modules/ ],
				include: [ path.resolve(__dirname, "./../") ],
				loader: "ts-loader",
				test: /.(ts|tsx)?$/,
			},
		],
	},
	devServer: {
		host: "127.0.0.1",
		hot: false,
		inline: false,
		open: true,
		port: 9000,
	},

	resolve: {
		extensions: [ ".tsx", ".ts", ".js" ],
	},
};
