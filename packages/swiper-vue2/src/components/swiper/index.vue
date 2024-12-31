<template>
    <div ref="wrapper" class="swiper-wrapper" :style="wrapperCssText">
        <div :class="['list-wrapper', { circular }]">
            <div ref="list" class="list" :style="listCssText">
                <div
                    class="item"
                    v-for="(item, index) in shadowList"
                    :key="index"
                >
                    {{ item }}
                </div>
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
            oldCureentIndex: 0,
            currentIndex: 0,
            offset: 0,
            position: 0,
            size: 0,
            shadowList: [],
        }
    },
    methods: {
        initShadowList() {
            if(!this.list || !this.list.length) {
                this.shadowList = []
            } else {
                const list = this.list.map((item, index) => ({ item, index }))
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
        init() {
            this.initShadowList()
            const { wrapper, list } = this.$refs
            if(!wrapper || !list) {
                return
            }
            
            const { width } = wrapper.getBoundingClientRect()
            const size = width
            this.size = size
            const handler = initGestureEvents(wrapper, {
                onStart: () => {
                    this.manual = true
                },
                onEnd: () => {
                    const sign = Math.sign(this.offset)
                    const step = -sign
                    const abs = Math.abs(this.offset)
                    this.manual = false
                    const offsetRatio = Math.abs(this.offset) / size
                    this.offset = 0
                    if(abs > size * this.threshold) {
                        const currentIndex = this.circular
                        ? (this.list.length + this.currentIndex + step) % this.list.length
                        : Math.max(0, Math.min(this.list.length - 1, this.currentIndex + step))
                        if(currentIndex !== this.currentIndex) {
                            this.oldCureentIndex = this.currentIndex
                            this.currentIndex = currentIndex
                            if(this.circular) {
                                this.position = sign * size
                            } else {
                                this.position = -currentIndex * size
                            }
                        }
                    } else {
                        // console.log({ offsetRatio })
                        if(offsetRatio < this.tapRatio) {
                            const index = this.currentIndex
                            const value = this.list[index]
                            this.$emit('tap', { value, index })
                        }
                    }
                },
                onMove: (point) => {
                    this.offset = calDampingOffset(point.x, size, this.offsetLimit, this.threshold, this.damping)
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
            })
            list.addEventListener('transitionstart', e => {
                handler.lock(true)
            })
            handler.init()

            this.handler = handler
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
                width: 100vw;
                height: 100vw;
                border: 2px solid #f00;
                box-sizing: border-box;
                flex-shrink: 0;
                text-align: center;
            }
        }
    }
}
</style>
