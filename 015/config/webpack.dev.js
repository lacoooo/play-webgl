var webpack = require('webpack');
var path = require('path');

var LIB_PATH = path.resolve(__dirname, '../src/index.ts')
var BUILD_PATH = path.resolve(__dirname, '../dist')


module.exports = {

    mode: 'development',
    devtool: 'source-map',

    entry: {
        draw: LIB_PATH
    },

    output: {
        library: 'index',
        libraryTarget: 'umd',
        path: BUILD_PATH,
        filename: 'index.js'
    },

    watchOptions: { poll: true },

    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },

    plugins: [
        new webpack.BannerPlugin( `MIT @License\n`),
    ]

};