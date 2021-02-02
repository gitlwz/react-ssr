const webpack = require("webpack")
const withCss = require("@zeit/next-css");
const config = require("./config")
const withBunldAnalyzer = require("@zeit/next-bundle-analyzer")
const configs = {
    //编译文件的输出目录
    distDir: "build",
    //禁止 etag 生成根据你的缓存策略
    generateEtags: false,
    //页面内容缓存配置
    //这个只是在开发环境才有的功能。如果你在生成环境中想缓存 SSR 页面，请查看SSR-caching
    onDemandEntries: {
        //内容在内存中缓存的时长（ms）
        maxInactiveAge: 25 * 1000,
        //同时缓存多少个页面
        pagesBufferLength: 2
    },
    //在pages目录下那种后缀的文件会被认为是页面
    pageExtensions: ['jsx', 'js'],
    //Next.js 使用构建时生成的常量来标识你的应用服务是哪个版本。在每台服务器上运行构建命令时，可能会导致多服务器部署出现问题。为了保持同一个构建 ID，可以配置generateBuildId函数：
    generateBuildId: async () => {
        // return 'my-build-id'
        //返回null 使用默认的unique id
        return null
    },

    //手动修改webpack 配置
    webpack(config, options) {
        // Further custom configuration here
        return config
    },

    webpackDevMiddleware: config => {
        return config
    },
    //可以在页面上通过 procsess.env.customKey 获取value
    env: {
        customKey: "value"
    },

    //下面两个要通过 next/config 来读取
    //只有在服务端渲染时才会获取的配置
    serverRuntimeConfig: { // Will only be available on the server side
        mySecret: 'secret'
    },
    //属性在服务端和客户端可用
    publicRuntimeConfig: { // Will be available on both server and client
        staticFolder: '/static',
        mySecret: process.env.MY_SECRET // Pass through env variables
    }
}



if (typeof require !== "undefined") {
    require.extensions[".css"] = file => { }
}

module.exports = withBunldAnalyzer(withCss({
    webpack(config) {
        config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
        return config
    },
    publicRuntimeConfig: {
        GITHUB_OAUTN_URL: config.GITHUB_OAUTN_URL,
        OAUTH_URL: config.OAUTH_URL
    },
    analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
        server: {
            analyzerMode: "static",
            reportFilename: "../bundles/serve.html"
        },
        browser: {
            analyzerMode: "static",
            reportFilename: "../bundles/client.html"
        }
    }
}))