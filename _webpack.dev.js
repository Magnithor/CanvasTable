const path = require('path');
function app(file, target) {
    if (!target) { target = 'web'; }
    return {        
        entry: file,
        target: target,
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        watch: true,
        devtool: 'source-map',
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: '[name].js'
        }
    };
}
module.exports = [
    app('./app.ts'), 
    app('./appWithWorker.ts'), 
    app('./worker.ts', 'webworker')
];