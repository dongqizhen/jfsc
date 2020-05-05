// vue.config.js 配置说明 这里只列一部分，具体配置惨考文档
// https://cli.vuejs.org/zh/config/#publicpath
const webpack = require('webpack');
const path = require('path')
const API = require('./src/config/API.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
console.log(API)
const resolve = (dir) => {
    return path.join(__dirname, dir)
}
const productionGzipExtensions = ['js', 'css'];

module.exports = {
    // baseUrl  type:{string} default:'/' 将部署应用程序的基本URL 将部署应用程序的基本URL。 默认情况下，Vue
    // CLI假设您的应用程序将部署在域的根目录下。
    // https://www.my-app.com/。如果应用程序部署在子路径上，则需要使用此选项指定子路径。例如，如果您的应用程序部署在https://www.
    // foobar.com/my-app/，集baseUrl到'/my-app/'.

    publicPath: process.env.NODE_ENV === 'production' ?
        '/' : '/',

    // assetsDir: '../assets/', outputDir: 在npm run build时 生成文件的目录 type:string,
    // default:'dist' outputDir: 'dist', pages:{ type:Object,Default:undfind }
    // indexPath:指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。type:string,
    // default:'index.html'
    /*
      构建多页面模式的应用程序.每个“页面”都应该有一个相应的JavaScript条目文件。该值应该是一
      个对象，其中键是条目的名称，而该值要么是指定其条目、模板和文件名的对象，要么是指定其条目
      的字符串，
      注意：请保证pages里配置的路径和文件名 在你的文档目录都存在 否则启动服务会报错的
    */
    // pages: { index: { entry for the page entry: 'src/index/main.js', the source
    // template template: 'public/index.html', output as dist/index.html filename:
    // 'index.html' }, when using the entry-only string format, template is inferred
    // to be `public/subpage.html` and falls back to `public/index.html` if not
    // found. Output filename is inferred to be `subpage.html`. subpage:
    // 'src/subpage/main.js' },   lintOnSave：{ type:Boolean default:true }
    // 问你是否使用eslint
    lintOnSave: false,
    // productionSourceMap：{ type:Bollean,default:true } 生产源映射
    // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
    productionSourceMap: false,
    // devServer:{type:Object} 3个属性host,port,https 它支持webPack-dev-server的所有选项

    transpileDependencies: [
        'vue-echarts', 'resize-detector', 'vuex-along', 'swiper', 'ant-design-vue'
    ],
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.plugins.push(new CompressionWebpackPlugin({
                algorithm: 'gzip',
                test: new RegExp(`\\.(${productionGzipExtensions.join('|')})$`),
                threshold: 10240,
                minRatio: 0.8,
                deleteOriginalAssets: false
            }));
            config.plugins.push(new BundleAnalyzerPlugin())

            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        }

        return {
            resolve: {
                extensions: [
                    '.js', '.vue', '.json', '.ts'
                ],
                alias: {
                    // 定义全局引入路径标识符
                    'vue$': 'vue/dist/vue.esm.js',
                    '@': resolve('src'),
                    '#': resolve('src/components'),
                    '^': resolve('src/module'),
                    '%': resolve('src/common'),
                    'static': path.resolve(__dirname, '../static')
                }
            },
            module: {
                // rules: [{
                //     test: /\.tsx?$/,
                //     loader: 'ts-loader',
                //     exclude: /node_modules/,
                //     options: {
                //         appendTsSuffixTo: [/\.vue$/]
                //     }
                // }]
            },

            plugins: [
                new webpack.DefinePlugin({
                    'env': API
                })
            ]
        }
    },

    chainWebpack: config => {
        //  tsx Loader
        config.module
            .rule('tsx')
            .test(/\.tsx?$/)
            .use('ts-loader')
            .loader('ts-loader')
            .options({
                appendTsSuffixTo: [/\.vue$/]
            })
            .end()

        //config.entry('main').add('babel-polyfill')
        // 压缩图片
        config.module
            .rule('images')
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .options({
                bypassOnDebug: true
            })
            .end()

        // 移除 prefetch 插件
        config.plugins.delete("prefetch");
        // 移除 preload 插件
        config.plugins.delete('preload');

        // 分割代码
        // config.optimization.splitChunks({
        //     chunks: 'all'
        // })
    },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        },
        // // 是否使用css分离插件 ExtractTextPlugin
        // extract: true,
        // // 开启 CSS source maps?
        // sourceMap: false,
        // // 启用 CSS modules for all css / pre-processor files.
        // modules: false
    },
    devServer: {
        port: 8085, // 端口号
        host: 'localhost',
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
        proxy: {
            '/api': {
                target: 'http://106.13.39.6:8083',
                ws: false,
                changeOrigin: true
            },

        }, // 配置多个代理
    }
}