<template>
    <div ref="wrapper" class="swiper-wrapper" :style="wrapperCssText">
        <div class="list-wrapper">
            <div ref="list" class="list" :style="listCssText">
                <div class="item">1</div>
                <div class="item">2</div>
                <div class="item">3</div>
            </div>
        </div>
    </div>
</template>
<script lang="js">
import { initGestureEvents } from '@imnull/ui-core'
export default {
    props: {
        transitionDuration: {
            type: Number,
            default: 300,
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
            this.handler = initGestureEvents(wrapper, {
                onStart: () => {
                    this.manual = true
                },
                onEnd: () => {
                    this.manual = false
                    this.offset = 0
                },
                onMove: (point) => {
                    console.log(11111, point)
                    this.offset = point.x
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
    border: 2px solid #000;
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
                flex-shrink: 0;
            }
        }
    }
}
</style>