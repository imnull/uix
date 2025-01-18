module.exports = {
    plugins: [
        require('postcss-px-to-viewport')({
            unitToConvert: 'rpx',   // 设置转换的单位为 rpx
            viewportWidth: 750,     // 设计稿宽度
            // viewportHeight: 667,    // 设计稿高度（可以不设置）
            unitPrecision: 5,       // 转换后的精度
            propList: ['*'],        // 需要转换的属性，'*' 代表所有属性都进行转换
            selectorBlackList: [], // 黑名单，可以设置不需要转换的 CSS 类
            minPixelValue: 1,      // 小于此值的单位不会转换
            mediaQuery: false,     // 是否在媒体查询中转换
            replace: true,         // 是否直接替换原单位
            exclude: /node_modules/ // 排除的文件（通常是第三方库）
        }),
    ],
}
