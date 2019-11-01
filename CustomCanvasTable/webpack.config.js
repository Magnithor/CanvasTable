const path = require('path');
module.exports = {
	mode: 'production',

	entry: {
		CustomCanvasTable: [
			'./src/CanvasContext2D.ts',
			'./src/Drawable.ts',
			'./src/CustomCanvasTable.ts',
			'./src/ScrollView.ts'
			]
	},

	output: {
		filename: 'CustomCanvasTable.js',
		path: path.resolve(__dirname, './lib'),
		libraryTarget: 'commonjs2',
	},    
	optimization: {
        minimize: false
    },
/*    plugins: [new DtsBundleWebpack({
        name: 'CustomCanvasTable',
        baseDir: 'lib',
        main: './src/CustomCanvasTable.d.ts',
        out : 'CustomCanvsTable.d.ts',
        externals: false
    })], */
	module: {
		rules: [
			{
				test: /.(ts|tsx)?$/,
				loader: 'ts-loader',
				include: [path.resolve(__dirname, './')],
				exclude: [/node_modules/]
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	}
};
