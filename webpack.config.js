const path = require('path');
const fs = require('fs');
const nodemon = require('nodemon');
const Promise = require('promise');

const staticsPath = path.join(__dirname, 'dist', 'public', 'assets');
const serverPath = path.join(__dirname, 'dist');
const publicPath = 'assets/';

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const clientBuildPromiseResolve = {};

let serverBuildResolve;

const webpackConfigComplete = [
    // Promises
    new Promise(resolve => {
        clientBuildPromiseResolve['stats'] = resolve;
    }),
    new Promise(resolve => {
        serverBuildResolve = resolve;
    }),
];

const babelLoaderRule = () => ({
    test: /\.js$/,
    loader: 'babel-loader',
});

const imageLoaderRule = (emitFile = true) => ({
    test: /\.(gif|png|jpe?g|svg)$/i,
    use: [
        {
            loader: 'file-loader',
            options: {
                emitFile,
            },
        },
        {
            loader: 'image-webpack-loader',
            options: {
                disable: true,
            },
        },
    ],
});

const cssLoaderRule = () => ({
    test: /\.(le|c)ss$/,
    use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'less-loader',
    ],
});

const cssExtractPlugin = () =>
    new MiniCssExtractPlugin({
        filename: '[name]-[hash].css',
        chunkFilename: '[id]-[hash].css',
    });

const writeStatsPlugin = (watch, filename) =>
    function() {
        this.plugin('done', stats => {
            fs.writeFileSync(
                path.join(__dirname, 'dist', `${filename}.generated.json`),
                JSON.stringify(stats.toJson())
            );
            if (watch && clientBuildPromiseResolve[filename]) {
                clientBuildPromiseResolve[filename]();
            }
        });
    };

const bundleAnalyzer = analyzerConfig => {
    const list = [];
    if (process.env.ANALYZE_BUNDLE === 'true') {
        list.push(new BundleAnalyzerPlugin(analyzerConfig));
    }
    return list;
};

module.exports = (env, argv) => {
    if (argv.watch) {
        Promise.all(webpackConfigComplete).then(() => {
            nodemon({
                script: './dist/index.js',
            });
        });
    }

    return [
        {
            // The configuration for the client
            name: 'client',
            entry: './src/client/index.js',
            devtool: 'eval-source-map',
            output: {
                path: staticsPath,
                filename: 'client-[hash].js',
                publicPath,
            },
            plugins: [
                new webpack.DefinePlugin({
                    __DEV__: argv.watch ? true : false,
                    __CLIENT__: true,
                    'process.env':{
                        'NODE_ENV': JSON.stringify('production')
                    },
                }),
                cssExtractPlugin(),
                writeStatsPlugin(argv.watch, 'stats')
            ],
            module: {
                rules: [cssLoaderRule(), babelLoaderRule()],
            },
            optimization: {
                splitChunks: {
                    cacheGroups: {
                        styles: {
                            name: 'styles',
                            test: /\.less$/,
                            chunks: 'all',
                            enforce: true
                        }
                    }
                }
            },
        },
        {
            // The configuration for the server-side rendering
            name: 'server side render',
            entry: './src/server/index.js',
            target: 'node',
            node: {
                __dirname: false,
                __filename: false,
            },
            output: {
                path: serverPath,
                filename: 'index.js',
                // `publicPath` is necessary for file-loader url strings even though we aren't emitting any files
                publicPath,
            },
            externals: [
                nodeExternals({
                    whitelist: [],
                }),
            ],
            plugins: [
                new webpack.DefinePlugin({
                    __DEV__: false,
                    __CLIENT__: false,
                    'process.env':{
                        'NODE_ENV': JSON.stringify('production')
                    },
                }),
                function(compiler) {
                    this.plugin('done', stats => {
                        if (argv.watch) {
                            serverBuildResolve();
                        }
                    });
                },
            ],
            module: {
                rules: [
                    imageLoaderRule(false),
                    babelLoaderRule(),
                    {
                        test: /\.pug/,
                        loader: 'pug-loader',
                    },
                ],
            },
        },
    ];
};
