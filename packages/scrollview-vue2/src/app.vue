<template>
    <div class="root-wrapper">
        <h1 ref="title">ScrollView VUE2</h1>
        <ScrollView :height="height" bg-color="rgba(0,0,0,0.1)" use-pull-down use-load-more :use-loading="loading" @load-more="handleListLoadMore" @pull-down="handleListPullDown">
            <div class="item" v-for="(item, index) in list" :key="index + item">
                <h1>[{{ index + 1 }}]{{ item }}</h1>
            </div>
        </ScrollView>
    </div>
</template>
<script lang="js">
import { ScrollView } from './components/index'
export default {
    components: {
        ScrollView
    },
    data() {
        return {
            loading: false,
            height: 0,
            list: [],
        }
    },
    methods: {
        handleListLoadMore() {
            console.log(111111, 'load-more')
            this.loading = true
            this.loadMore().then(() => {
                this.loading = false
            })
        },
        handleListPullDown(count = 20) {
            this.loading = true
            this.loadMore(true, count).then(() => {
                this.loading = false
            })
        },
        loadMore(reset = false, count = 20) {
            return new Promise(resolve => {
                setTimeout(() => {
                    if(reset) {
                        this.list = Array(count).fill(0).map(v => v + Math.random())
                    } else {
                        const arr = Array(count).fill(0).map(v => v + Math.random())
                        this.list.push(...arr)
                    }
                    resolve()
                }, 1000)
            })
        },
        handleRemove(index) {
            this.list.splice(index, 1)
        }
    },
    mounted() {
        const { title } = this.$refs
        const { height } = title.getBoundingClientRect()
        this.height = window.innerHeight - height
        this.handleListPullDown(10)
    }
}
</script>
<style lang="scss">
body {
    margin: 0;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
h1 {
    color: blue;
    margin: 0;
    padding: 20rpx;
    font-size: 48rpx;
}
h2 {
    margin: 0;
    padding: 0;
    font-size: 28rpx;
    font-weight: normal;
    color: #aaa;
    text-align: center;
    padding: 30rpx 0;
}
.desc {
    text-align: center;
    font-size: 24rpx;
    color: #aaa;
    padding: 30rpx 0;
}
.root-wrapper {
    box-sizing: border-box;
    width: 100%;
    .item {
        border-bottom: 1px solid #ccc;
        &:first-of-type {
            border-top: 1px solid #ccc;
        }
    }
    .tools {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-self: stretch;
        background-color: #f60;
        button {
            display: block;
            width: 100rpx;
            margin: 20rpx;
        }
    }
}
</style>
