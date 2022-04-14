const path = require('path');
// const webpack = require('webpack')

module.exports = {
    entry: {
        index: './frontend/index.html.tsx',
        user_page: './frontend/userpage.html.tsx'
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
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', 'jsx', '.ts', '.tsx'],
        modules: [ path.join(__dirname, './frontend'), 'node_modules']
    },
    output: {
        path: path.resolve(__dirname, 'static/dist'),
        publicPath: 'static/dist',
        filename: '[name].bundle.js',
        clean: true
    },
}
