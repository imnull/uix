const path = require('path')
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = options => {
    const { WEBPACK_SERVE } = options
    return {
        mode: WEBPACK_SERVE ? 'development' : 'production',
        entry: './src/index.ts',
        // 输出配置
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'main.js',
        },
        // 模块规则
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                },
                {
                    test: /\.[jt]s$/,
                    exclude: /node_modules/,
                    loader: 'esbuild-loader',
                    options: {
                        loader: 'tsx', // 指定 JavaScript 类型
                    }
                },
                {
                    test: /\.(css|s[ac]ss)$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                },
            ]
        },

        // 插件配置
        plugins: [
            new HtmlWebpackPlugin({
                template: './template.html',
                filename: `index.html`,
                hash: true,
                title: 'Swiper VUE2',
            }),
            new VueLoaderPlugin(),
            new CleanWebpackPlugin(),
            // new CopyWebpackPlugin({
            //     patterns: [
            //         { from: 'static' }
            //     ]
            // })
        ],

        // 解析选项
        resolve: {
            extensions: ['.ts', '.vue', '.js'],
            // alias: {
            //     '~': path.resolve('./src'),
            //     '@images': path.resolve('./src/images'),
            // }
        },
        devServer: {
            port: 5501,
            hot: true,
            allowedHosts: 'all',
            // static: path.resolve('static'),
        },
    };

}