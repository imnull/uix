<template>
    <div ref="wrapper" class="swiper-wrapper" :style="wrapperCssText">
        <div :class="['list-wrapper', direction, { circular }]" :style="boxSizeCssText">
            <div ref="list" class="list" :style="listCssText">
                <div
                    class="item"
                    v-for="(item, index) in shadowList"
                    :style="getItemCssText(index)"
                    :key="index"
                >
                    <ItemDemo v-if="!hasSlot('item')" :value="item.value" :index="item.index" />
                    <slot name="item" :value="item.value" :index="item.index" />
                </div>
            </div>
        </div>
        <div :class="['bottom-wrapper', direction]">
            <DotsDemo v-if="!hasSlot('dots') && useDots" :count="list.length" :current="currentIndex" :direction="direction" />
            <slot name="dots" :count="list.length" :current="currentIndex" :direction="direction" />
        </div>
    </div>
</template>
<script lang="js">
import { initGestureEvents, calDampingOffset, rpxToVw } from '@imnull/ui-core'
import ItemDemo from './item-demo.vue'
import DotsDemo from './dots-demo.vue'

export default {
    components: {
        ItemDemo,
        DotsDemo,
    },
    props: {
        /**
         * horizontal | vertical
         */
        direction: {
            type: String,
            default: 'horizontal'
        },
        rpxWidth: {
            type: Number,
            default: -1,
        },
        rpxHeight: {
            type: Number,
            default: -1,
        },
        useDots: {
            typeof: Boolean,
            default: true,
        },
        autoplay: {
            type: Boolean,
            default: false,
        },
        duration: {
            type: Number,
            default: 3500,
        },
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
            default: 0.7
        },
        circular: {
            type: Boolean,
            default: false
        },
        tapRatio: {
            type: Number,
            default: 0.001
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
                return `transform:${translate}(${this.position + this.offset}px);`
            } else {
                return `transform:${translate}(${this.position}px);transition:transform ${this.transitionDuration/1000}s;`
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
        getItemCssText(index) {
            let css = this.boxSizeCssText
            return css
        },
        hasSlot(name) {
            return !!name && (!!this.$slots[name] || !!this.$scopedSlots[name])
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
        getStepIndex(step) {
            const nextIndex = this.circular
                ? (this.list.length + this.currentIndex + step) % this.list.length
                : Math.max(0, Math.min(this.list.length - 1, this.currentIndex + step))
            return nextIndex
        },
        go(step) {
            const currentIndex = this.getStepIndex(step)
            if(currentIndex !== this.currentIndex) {
                this.oldCureentIndex = this.currentIndex
                this.currentIndex = currentIndex
                const size = this.size
                if(this.circular) {
                    const sign = -Math.sign(step)
                    this.position = sign * size
                } else {
                    this.position = -currentIndex * size
                }
            }
        },
        play() {
            this.stop()
            if(!this.autoplay) {
                return
            }
            this.autoplayHandler = setTimeout(() => {
                this.manual = false
                if(!this.circular && this.currentIndex >= this.list.length - 1) {
                    this.go(-this.currentIndex)
                } else {
                    this.go(1)
                }
            }, this.duration)
        },
        stop() {
            clearTimeout(this.autoplayHandler)
        },
        init() {
            this.initShadowList()
            const { wrapper, list } = this.$refs
            if(!wrapper || !list) {
                return
            }
            
            const { width, height } = wrapper.getBoundingClientRect()
            const size = this.direction === 'vertical' ? height : width
            this.size = size
            const handler = initGestureEvents(wrapper, {
                onStart: () => {
                    this.manual = true
                    this.stop()
                },
                onEnd: () => {
                    const sign = Math.sign(this.offset)
                    const step = -sign
                    const abs = Math.abs(this.offset)
                    this.manual = false
                    const offsetRatio = Math.abs(this.offset) / size
                    this.offset = 0
                    if(abs > size * this.threshold) {
                        this.go(step)
                    } else {
                        if(offsetRatio < this.tapRatio) {
                            const index = this.currentIndex
                            const value = this.list[index]
                            this.$emit('tap', { value, index })
                            this.play()
                        }
                    }
                },
                onMove: (point) => {
                    const v = this.direction === 'vertical' ? point.y : point.x
                    this.offset = calDampingOffset(v, size, this.offsetLimit, this.threshold, this.damping)
                }
            })
            list.addEventListener('transitionend', e => {
                if(this.circular) {
                    this.manual = true
                    this.position = 0
                    this.initShadowList()
                }

                const changed = this.oldCureentIndex !== this.currentIndex
                this.oldCureentIndex = this.currentIndex
                handler.lock(false)

                if(changed) {
                    const index = this.currentIndex
                    const value = this.list[index]
                    this.$emit('change', { value, index })
                }
                this.play()
            })
            list.addEventListener('transitionstart', e => {
                handler.lock(true)
            })
            handler.init()
            this.handler = handler

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
        console.log(this.hasSlot('item'))
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
    user-select: none;
    .list-wrapper {
        position: relative;
        &.circular {
            transform: translateX(-100%);
        }
        .list {
            display: flex;
            flex-direction: row;
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
