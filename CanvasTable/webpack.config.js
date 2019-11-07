const path = require('path');
module.exports = {
	mode: 'production',

	entry: {
		CanvasTable: [
			'./src/CanvasTable.ts'
			]
	},

	output: {
		filename: 'CanvasTable.js',
		path: path.resolve(__dirname, './lib'),
		libraryTarget: 'umd',
		library: 'mthb-canvas-table',
		umdNamedDefine: true
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
				include: [path.resolve(__dirname, './'), path.resolve(__dirname, './../share') ],
				exclude: [/node_modules/]
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	}
};
