<template>
    <div class="loading-wrapper" :style="wrapperCssText">
        <div class="text">{{ text }} [{{ position }}]</div>
    </div>
</template>
<script lang="js">
export default {
    props: {
        height: {
            type: Number,
            default: 128,
        },
        text: {
            type: String,
            default: 'Loading'
        },
        position: {
            type: String,
            default: ''
        },
    },
    computed: {
        wrapperCssText() {
            const height = this.height
            return `height:${height}px;`
        }
    }
}
</script>
<style lang="scss" scoped>
.loading-wrapper {
    width: 100%;
    box-sizing: border-box;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    background-color: #aaa;
    .text {
        font-size: 26rpx;
    }
}
</style>