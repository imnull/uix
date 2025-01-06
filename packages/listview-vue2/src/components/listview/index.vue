<template>
    <div ref="root" class="listview-wrapper" :style="wrapperCssText">
        <div class="list-wrapper">
            <div v-if="usePullDown" :class="['elastic', 'up']" :style="elasticUpCssText">
                <slot v-if="useLoading" name="loading" :height="elasticSize" position="start" />
                <slot v-else name="elastic" :progress="Math.abs(elasticRuntime) / elasticSize" :height="elasticSize" position="start" />
            </div>
            <div ref="list" class="list" :style="listCssText">
                <slot />
            </div>
            <div v-if="useLoadMore" :class="['elastic', 'down']" :style="elasticDownCssText">
                <slot v-if="useLoading" name="loading" :height="elasticSize" position="end" />
                <slot v-else name="elastic" :progress="Math.abs(elasticRuntime) / elasticSize" :height="elasticSize" position="end" />
            </div>
        </div>
    </div>
</template>
<script lang="js">
import { initGestureEvents, rpxToPx } from '@imnull/ui-core'

export default {
    props: {
        elasticSize: {
            type: Number,
            default: 48,
        },
        usePullDown: {
            type: Boolean,
            default: false,
        },
        useLoadMore: {
            type: Boolean,
            default: false,
        },
        useLoading: {
            type: Boolean,
            default: false,
        },
        bgColor: {
            type: String,
            default: 'transparent',
        },
        rpxHeight: {
            type: Number,
            default: -1,
        },
        height: {
            type: Number,
            default: -1,
        },
        moveRatio: {
            type: Number,
            default: 4,
        }
    },
    watch: {
        useLoading: {
            handler(val) {
                if(!val) {
                    this.manual = false
                    this.elastic = 0
                }
            }
        }
    },
    computed: {
        elasticRuntime() {
            const sign = Math.sign(this.elastic)
            const abs = Math.abs(this.elastic) / this.moveRatio
            return sign * Math.min(this.elasticSize, abs)
        },
        elasticUpCssText() {
            let cssText = this.elastic <= 0 ? `height:0;` : `height:${this.elasticRuntime}px;`
            if(this.elastic <= 0 && !this.manual) {
                cssText += `transition:height 0.2s;`
            }
            return cssText
        },
        elasticDownCssText() {
            let cssText = this.elastic >= 0 ? `height:0;` : `height:${-this.elasticRuntime}px;`
            if(this.elastic >= 0 && !this.manual) {
                cssText += `transition:height 0.2s;`
            }
            return cssText
        },
        listCssText() {
            const e = this.elasticRuntime
            let cssText = `transform:translateY(${e > 0 ? 0 : e}px);`
            if(this.elastic === 0) {
                cssText += 'transition:transform 0.2s;';
            }
            return cssText
        },
        wrapperCssText() {
            let cssText = `background-color:${this.bgColor};`
            if(this.height >= 0) {
                cssText += `height:${this.height}px;`
            } else if(this.rpxHeight > 0) {
                cssText += `height:${rpxToPx(this.rpxHeight)}px;`
            }
            return cssText
        }
    },
    data() {
        return {
            elastic: 0,
            manual: false,
        }
    },
    
    methods: {
        init() {
            const { root, list } = this.$refs
            if(!root) {
                return
            }
            let scrollHeight = root.scrollHeight
            let isOnEdge = false
            const handler = initGestureEvents(root, {
                direction: 2,
                trigger: (p) => {
                    if(!isOnEdge) {
                        return false
                    }
                    if(this.useLoading) {
                        return false
                    }
                    if(p.y > 0) {
                        return this.usePullDown && root.scrollTop <= 0
                    } else {
                        return this.useLoadMore && root.clientHeight + root.scrollTop >= scrollHeight
                    }
                },
                onStart: () => {
                    isOnEdge = root.scrollTop <= 0 || root.clientHeight + root.scrollTop >= scrollHeight
                    scrollHeight = root.scrollHeight
                    this.manual = true
                },
                onMove: (e) => {
                    this.elastic = e.y
                },
                onEnd: () => {
                    this.manual = false

                    if(this.useLoading) {
                        return
                    }

                    const sign = Math.sign(this.elastic)
                    const abs = Math.abs(this.elastic) / this.moveRatio
                    const size = this.elasticSize

                    if(abs >= size) {
                        const eventName = sign < 0 ? 'load-more' : 'pull-down'
                        this.$emit(eventName)
                    } else {
                        this.elastic = 0
                    }
                }
            }).init()
            this.handler = handler
        },
        destroy() {
            if(this.handler) {
                this.handler.dispose()
            }
        }
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {
        this.destroy()
    }
}
</script>
<style lang="scss" scoped>
.listview-wrapper {
    box-sizing: border-box;
    width: 100%;
    position: relative;
    overflow: auto;
    height: 50vh;
    .list-wrapper {
        position: relative;
        .elastic {
            width: 100%;
            height: 0px;
            overflow: hidden;
            width: 100%;
            box-sizing: border-box;
            &.top {
                position: absolute;
                top: 0;
            }
            &.down {
                position: absolute;
                bottom: 0;
            }
        }
        .list {
            box-sizing: border-box;
            position: relative;
        }
    }
    
}
</style>
