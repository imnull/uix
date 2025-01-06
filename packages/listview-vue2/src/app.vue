<template>
    <div class="root-wrapper">
        <h1 ref="title">ListView VUE2</h1>
        <h2 v-if="loading && list.length < 1">Loading</h2>
        <ListView v-else :height="height" bg-color="rgba(0,0,0,0.1)" use-pull-down use-load-more :use-loading="loading" @load-more="handleListLoadMore" @pull-down="handleListPullDown">
            <template slot="elastic" slot-scope="ui">
                <Elastic v-bind="ui" />
            </template>
            <template slot="loading" slot-scope="ui">
                <Loading v-bind="ui" />
            </template>
            <!-- <div class="desc">-- 下拉刷新 --</div> -->
            <h1 v-for="(item, index) in list" :key="index">[{{ index + 1 }}]{{ item }}</h1>
            <!-- <div class="desc">-- 上拉翻页 --</div> -->
        </ListView>
    </div>
</template>
<script lang="js">
import { ListView, Elastic, Loading } from './components/index'
export default {
    components: {
        ListView,
        Elastic,
        Loading,
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
        handleListPullDown() {
            console.log(111111, 'pull-down')
            this.loading = true
            this.loadMore(true).then(() => {
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
        }
    },
    mounted() {
        const { title } = this.$refs
        const { height } = title.getBoundingClientRect()
        this.height = window.innerHeight - height
        this.handleListPullDown()
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
}
</style>
