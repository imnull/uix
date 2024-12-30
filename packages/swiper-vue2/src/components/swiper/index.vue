<template>
    <div ref="wrapper" class="swiper-wrapper" :style="wrapperCssText">
        <div class="list-wrapper">
            <div ref="list" class="list" :style="listCssText">
                <div class="item" v-for="(item, index) in list" :key="index">{{ item }}</div>
            </div>
        </div>
    </div>
</template>
<script lang="js">
import { initGestureEvents, calDampingOffset } from '@imnull/ui-core'
export default {
    props: {
        list: {
            type: Array,
            default: [],
        },
        transitionDuration: {
            type: Number,
            default: 200,
        },
        threshold: {
            type: Number,
            default: 0.2,
        },
        damping: {
            type: Number,
            default: 0.2,
        },
        offsetLimit: {
            type: Number,
            default: 0.5
        }
    },
    computed: {
        wrapperCssText() {
            return ''
        },
        listCssText() {
            if(this.manual) {
                return `transform:translateX(${this.position + this.offset}px);`
            } else {
                return `transform:translateX(${this.position}px);transition:transform ${this.transitionDuration/1000}s;`
            }
        },
    },
    data() {
        return {
            manual: false,
            currentIndex: 0,
            offset: 0,
            position: 0,
        }
    },
    methods: {
        init() {
            const { wrapper, list } = this.$refs
            if(!wrapper || !list) {
                return
            }
            const { width } = wrapper.getBoundingClientRect()
            this.handler = initGestureEvents(wrapper, {
                onStart: () => {
                    this.manual = true
                },
                onEnd: () => {
                    const sign = Math.sign(this.offset)
                    const step = -sign
                    const abs = Math.abs(this.offset)
                    this.manual = false
                    this.offset = 0
                    if(abs > width * this.threshold) {
                        this.currentIndex = Math.max(0, Math.min(this.list.length - 1, this.currentIndex + step))
                        this.position = -this.currentIndex * width
                    }
                },
                onMove: (point) => {
                    this.offset = calDampingOffset(point.x, width, this.offsetLimit, this.threshold, this.damping)
                }
            })
            this.handler.init()
        },
        destory() {
            if(this.handler) {
                this.handler.dispose()
            }
        }
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {
        this.destory()
    }
}
</script>
<style lang="scss" scoped>
.swiper-wrapper {
    width: 100vw;
    height: 100vw;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    .list-wrapper {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        .list {
            display: flex;
            flex-direction: row;
            .item {
                width: 100vw;
                height: 100vw;
                border: 2px solid #f00;
                box-sizing: border-box;
                flex-shrink: 0;
            }
        }
    }
}
</style>