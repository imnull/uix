<template>
    <div class="swiper-wrapper" :style="wrapperCssText">
        <div ref="wrapper" class="swiper-wrapper-container">
            <div
                :class="['list-wrapper', direction, { circular }]"
                :style="boxSizeCssText"
            >
                <div
                    ref="list"
                    :class="['list', { ani: !manual }]"
                    :style="listCssText"
                >
                    <div
                        class="item"
                        v-for="(item, index) in shadowList"
                        :style="getItemCssText(index)"
                        :key="index"
                    >
                        <ItemDemo
                            v-if="!hasSlot('item')"
                            :value="item.value"
                            :index="item.index"
                        />
                        <slot name="item" :value="item.value" :index="item.index" />
                    </div>
                </div>
            </div>
        </div>
        <div :class="['bottom-wrapper', direction]">
            <SwiperDots
                v-if="!hasSlot('dots') && useDots"
                :count="list.length"
                :current="currentIndex"
                :direction="direction"
            />
            <slot
                name="dots"
                :count="list.length"
                :current="currentIndex"
                :direction="direction"
            />
        </div>
    </div>
</template>
<script lang="js">
import { initGestureEvents, calDampingOffset, rpxToVw, runAnimate } from '@imnull/ui-core'
import ItemDemo from './item-demo.vue'
import SwiperDots from './swiper-dots.vue'

export default {
    components: {
        ItemDemo,
        SwiperDots,
    },
    props: {
        /**
         * 翻页方向
         * - horizontal 水平方向
         * - vertical 垂直方向
         */
        direction: {
            type: String,
            default: 'horizontal'
        },
        /**
         * 基于`750rpx`设备宽度作为单位的宽度值
         */
        rpxWidth: {
            type: Number,
            default: -1,
        },
        /**
         * 基于`750rpx`设备宽度作为单位的高度值
         */
        rpxHeight: {
            type: Number,
            default: -1,
        },
        /**
         * 是否显示底部圆点页标
         */
        useDots: {
            typeof: Boolean,
            default: true,
        },
        /**
         * 是否自动播放
         */
        autoplay: {
            type: Boolean,
            default: false,
        },
        /**
         * 自动播放间隔
         */
        duration: {
            type: Number,
            default: 3500,
        },
        list: {
            type: Array,
            default: [],
        },
        /**
         * 动画时长
         */
        transitionDuration: {
            type: Number,
            default: 150,
        },
        /**
         * 翻页阈值。当松开时，如果拖拽偏移大于该比例，触发翻页。
         */
        threshold: {
            type: Number,
            default: 0.2,
        },
        /**
         * 弹性阻滞阈值。当拖拽偏移大于该比例，则开始增加阻滞效果。
         */
        damping: {
            type: Number,
            default: 0.2,
        },
        /**
         * 翻页前拖拽偏移上限
         */
        offsetLimit: {
            type: Number,
            default: 0.5
        },
        /**
         * 循环播放
         */
        circular: {
            type: Boolean,
            default: false
        },
        /**
         * 当移动量小于该值，且未触发翻页，则触发`tap`事件
         */
        tapRatio: {
            type: Number,
            default: 0.001
        },
        /**
         * 指定当前索引
         */
        current: {
            type: Number,
            default: 0,
        }
    },
    watch: {
        current: {
            handler(val) {
                if(val === this.currentIndex) {
                    return
                }
                const step = val - this.currentIndex
                this.animateGo(step)
                this.play()
            }
        }
    },
    computed: {
        boxSizeCssText() {
            const rpxWidth = this.rpxWidth > 0 ? this.rpxWidth : 750
            const rpxHeight = this.rpxHeight > 0 ? this.rpxHeight : 750
            return `width:${rpxToVw(rpxWidth)};height:${rpxToVw(rpxHeight)};`
        },
        wrapperCssText() {
            return this.boxSizeCssText
        },
        listCssText() {
            const translate = this.direction === 'vertical' ? 'translateY' : 'translateX'
            if(this.manual) {
                return `transform:translateZ(0px) ${translate}(${this.position + this.offset}px);`
            } else {
                return `transform:translateZ(0px) ${translate}(${this.position}px);`
            }
        },
    },
    data() {
        return {
            manual: false,
            oldCureentIndex: 0,
            currentIndex: 0,
            offset: 0,
            position: 0,
            size: 0,
            shadowList: [],
        }
    },
    methods: {
        initRef() {
            const { wrapper, list } = this.$refs
            if(!wrapper || !list) {
                return false
            }
            const { width, height } = wrapper.getBoundingClientRect()
            const size = this.direction === 'vertical' ? height : width
            this.size = size
            return true
        },
        initCurrentIndex() {
            const current = (this.current + this.list.length) % this.list.length
            if(current === this.currentIndex) {
                return
            }
            this.oldCureentIndex = this.currentIndex
            this.currentIndex = current
        },
        initPosition() {
            if(!this.circular) {
                this.position = -this.currentIndex * this.size
            } else {
                this.position = 0
            }
        },
        initShadowList() {
            if(!this.list || !this.list.length) {
                this.shadowList = []
            } else {
                const list = this.list.map((value, index) => ({ value, index }))
                if(this.circular) {
                    for(let i = 0; i < this.currentIndex; i++) {
                        list.push(list.shift())
                    }
                    const tail = list[0]
                    const head = list[list.length - 1]
                    list.push(tail)
                    list.unshift(head)
                }
                this.shadowList = list
            }
        },
        initHandler() {
            const size = this.size
            const { wrapper } = this.$refs
            const handler = initGestureEvents(wrapper, {
                onStart: () => {
                    this.manual = true
                    this.stop()
                },
                onEnd: () => {
                    const sign = Math.sign(this.offset)
                    const step = -sign
                    const abs = Math.abs(this.offset)
                    const offsetRatio = Math.abs(this.offset) / size
                    // this.offset = 0
                    this.manual = false
                    if(abs > size * this.threshold) {
                        this.animateGo(step)
                    } else {
                        this.animateGo(0)
                        if(offsetRatio < this.tapRatio) {
                            const index = this.currentIndex
                            const value = this.list[index]
                            this.$emit('tap', { value, index })
                        }
                    }
                },
                onMove: (point) => {
                    const v = this.direction === 'vertical' ? point.y : point.x
                    this.offset = calDampingOffset(v, size, this.offsetLimit, this.threshold, this.damping)
                }
            })
            handler.init()
            this.handler = handler
        },
        getItemCssText(index) {
            let css = this.boxSizeCssText
            return css
        },
        hasSlot(name) {
            return !!name && (!!this.$slots[name] || !!this.$scopedSlots[name])
        },
        
        getStepIndex(step) {
            const nextIndex = this.circular
                ? (this.list.length + this.currentIndex + step) % this.list.length
                : Math.max(0, Math.min(this.list.length - 1, this.currentIndex + step))
            return nextIndex
        },
        animateGo(step) {
            const currentIndex = this.getStepIndex(step)
            this.oldCureentIndex = this.currentIndex
            this.currentIndex = currentIndex
            const size = this.size
            const start = this.position + this.offset
            let end = start
            if(this.circular) {
                const sign = -Math.sign(step)
                end = sign * size
            } else {
                end = -currentIndex * size
            }
            const distande = end - start
            this.manual = false
            this.offset = false
            runAnimate({
                duration: this.transitionDuration,
                onProgress: params => {
                    this.position = distande * params.progress + start
                },
                onEnd: () => {
                    if(this.circular) {
                        this.manual = true
                        this.position = 0
                        this.initShadowList()
                    }
                    const changed = this.oldCureentIndex !== this.currentIndex
                    this.oldCureentIndex = this.currentIndex
                    if(this.handler) {
                        this.handler.lock(false)
                    }
                    if(changed) {
                        const index = this.currentIndex
                        const value = this.list[index]
                        this.$emit('change', { value, index })
                    }
                    this.play()
                }
            })
        },
        play() {
            this.stop()
            if(!this.autoplay) {
                return
            }
            this.autoplayHandler = setTimeout(() => {
                this.manual = false
                if(!this.circular && this.currentIndex >= this.list.length - 1) {
                    this.animateGo(-this.currentIndex)
                } else {
                    this.animateGo(1)
                }
            }, this.duration)
        },
        stop() {
            clearTimeout(this.autoplayHandler)
        },
        init() {
            if(!this.initRef()) {
                return
            }
            this.initCurrentIndex()
            this.initShadowList()
            this.initPosition()
            this.initHandler()
            this.play()
        },
        destory() {
            this.stop()
            if(this.handler) {
                this.handler.dispose()
            }
        },
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
    flex-grow: 0;
    flex-shrink: 0;
    width: 100vw;
    height: 100vw;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    user-select: none;
    perspective: 800px;
    will-change: transform;
    .swiper-wrapper-container {
        position: relative;
    }
    .list-wrapper {
        position: relative;
        overflow: visible;
        &.circular {
            transform: translateZ(0px) translateX(-100%);
        }
        .list {
            will-change: transform;
            display: flex;
            flex-direction: row;
            perspective: 0;
            //   &.ani {
            //     transition: transform 0.2s;
            //   }
            .item {
                display: block;
                position: relative;
                box-sizing: border-box;
                flex-shrink: 0;
                text-align: center;
                overflow: hidden;
            }
        }
        &.vertical {
            &.circular {
                transform: translateY(-100%);
            }
            .list {
                flex-direction: column;
            }
        }
    }
    .bottom-wrapper {
        position: absolute;
        z-index: 5;
        width: 100%;
        box-sizing: border-box;
        bottom: 0;
        left: 0;
        right: auto;
        top: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        &.vertical {
            width: auto;
            height: 100%;
            bottom: auto;
            left: auto;
            right: 0;
            top: 0;
        }
    }
}
</style>
