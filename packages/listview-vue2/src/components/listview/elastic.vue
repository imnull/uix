<template>
    <div :class="['elestic-wrapper', { reverse: progress >= 1 }]" :style="wrapperCssText">
        <div class="text" :style="textCssText">{{ text }} [{{ position }}]</div>
    </div>
</template>
<script lang="js">
export default {
    props: {
        progress: {
            type: Number,
            default: 1,
        },
        height: {
            type: Number,
            default: 128,
        },
        text: {
            type: String,
            default: '刷新'
        },
        position: {
            type: String,
            default: ''
        },
    },
    computed: {
        wrapperCssText() {
            const val = Math.min(1, Math.max(0, this.progress))
            const height = this.height * val
            return `height:${height}px;opacity:${val};`
        },
        textCssText() {
            return `transform:scale(${this.progress});`
        }
    }
}
</script>
<style lang="scss" scoped>
.elestic-wrapper {
    width: 100%;
    box-sizing: border-box;
    background-color: #ccc;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #333;
    transition: color 0.2s, background-color 0.2s;
    &.reverse {
        background-color: #f60;
        color: #fff;
    }
    .text {
        font-size: 26rpx;
    }
}
</style>