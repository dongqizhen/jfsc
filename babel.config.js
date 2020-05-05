module.exports = {
    presets: ["@vue/app", ['@babel/preset-env', {
        useBuiltIns: 'entry'
    }]],
    plugins: [
        [
            "import",
            { libraryName: "ant-design-vue", libraryDirectory: "es", style: true }, "ant-design-vue"
        ],
        [
            'component',
            {
                'libraryName': 'element-ui',
                'styleLibraryName': 'theme-chalk'
            },
            'element-ui'
        ],
        ["import", {
            "libraryName": "vant",
            "libraryDirectory": "es",
            "style": true
        }, 'vant']

        // [
        //     'import',
        //     {
        //         'libraryName': 'iview',
        //         'libraryDirectory': 'src/components'
        //     },
        //     'iview'
        // ],
    ]
};