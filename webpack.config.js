const path = require('path');
// const webpack = require('webpack')

module.exports = {
    entry: './frontend/app.tsx',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', 'jsx', '.ts', '.tsx']
    },
    output: {
        path: path.resolve(__dirname, 'static/dist'),
        publicPath: 'static/dist',
        filename: 'bundle.js'
    },
}
