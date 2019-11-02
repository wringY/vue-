const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const copyWepacpkPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
    mode: 'development',
    entry: path.join(__dirname,'./main.js'),
    devtool: 'cheap-module-eval-source-map',
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'bundle.js'
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue'
        }
    },
    module: {
        rules: [
           {test: /\.s(a|c)ss$/, use: ['style-loader', 'css-loader', 'sass-loader']},
            { test:/\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader']}, 
            {test: /\.(ttf|svg|eot|woff|woff2)$/, use: 'url-loader'},
            {
                test: /\.(png|jpg|gif|bmp|jpeg)$/,
                loader: 'url-loader',
                options: {
                    limit: '5*1024',
                    outputPath: 'imgs', //把文件放置到imgs文件内（没有则进行创建）
                    name: '[name]-[hash：8].[ext]' //文件名
                }
            },
               
          {
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
            },
            exclude: '/node_modules/'
          },
          {test: /\.vue$/, use: 'vue-loader'}
        ]
    },
    //配置插件
    plugins: [
        new htmlWebpackPlugin({
            template: path.join(__dirname,'./pages/index.html'),
            filename: 'index.html'
        }),
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
        new copyWepacpkPlugin([
            { 
                from: path.join(__dirname,'assets'),                 //从哪里拷贝，推荐绝对路径
               to: 'assets'                   //拷贝到哪里,这是个相对路径，相对于output的path 
             }
           ]),
           new webpack.BannerPlugin('注释信息')
    ]
}