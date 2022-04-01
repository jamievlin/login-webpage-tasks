const path = require('path');
// const webpack = require('webpack')

module.exports = {
    entry: {
        index: './frontend/app.tsx'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'ts-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', 'jsx', '.ts', '.tsx']
    },
    output: {
        path: path.resolve(__dirname, 'static/dist'),
        publicPath: 'static/dist',
        filename: 'bundle.js',
        clean: true
    },
}
