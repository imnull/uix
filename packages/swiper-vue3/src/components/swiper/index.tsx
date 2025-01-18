import { defineComponent, reactive, ref, VNodeRef } from 'vue'
import ItemDemo from '../swiper-item-demo'
import SwiperDots from '../swiper-dots'
import { initGestureEvents, calDampingOffset, rpxToVw, runAnimate } from '@imnull/ui-core'
import style from './index.module.scss'

export default defineComponent({
    name: 'Swiper',
    props: {
        onTap: {
            type: Function,
            default: (params: { value: any, index: number }) => { }
        },
        onChange: {
            type: Function,
            default: (params: { value: any, index: number }) => { }
        },
        list: {
            type: Array,
            required: true,
            default: [],
        },
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
            handler(val: number) {
                if(val === this.currentIndex) {
                    return
                }
                const step = val - this.currentIndex
                this.animateGo(step)
                this.play()
            }
        }
    },
    methods: {
        initRef() {
            const { root, wrapper, list } = this.refs
            if (!root || !wrapper || !list) {
                return false
            }
            const { width, height } = wrapper.getBoundingClientRect()
            const size = this.direction === 'vertical' ? height : width
            this.size = size
            return true
        },
        initCurrentIndex() {
            const current = (this.current + this.list.length) % this.list.length
            if (current === this.currentIndex) {
                return
            }
            this.oldCureentIndex = this.currentIndex
            this.currentIndex = current
        },
        initPosition() {
            if (!this.circular) {
                this.position = -this.currentIndex * this.size
            } else {
                this.position = 0
            }
        },
        initShadowList() {
            if (!this.list || !this.list.length) {
                this.shadowList = []
            } else {
                const list = this.list.map((value, index) => ({ value, index }))
                if (this.circular) {
                    for (let i = 0; i < this.currentIndex; i++) {
                        list.push(list.shift()!)
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
            this.destory()
            const size = this.size
            const { wrapper } = this.refs
            const handler = initGestureEvents(wrapper, {
                direction: this.direction === 'vertical' ? 2 : 1,
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
                    if (abs > size * this.threshold) {
                        this.animateGo(step)
                    } else {
                        this.animateGo(0)
                        if (offsetRatio < this.tapRatio) {
                            const index = this.currentIndex
                            const value = this.list[index]
                            this.emitTap({ value, index })
                        }
                    }
                },
                onMove: (offset) => {
                    const v = this.direction === 'vertical' ? offset.y : offset.x
                    this.offset = calDampingOffset(v, size, this.offsetLimit, this.threshold, this.damping)
                }
            })
            handler.init()
            this.handler = handler
        },
        getItemCssText() {
            let css = this.boxSizeCssText
            return css
        },
        hasSlot(name: string) {
            return !!name && !!this.$slots[name]// (!!this.$slots[name] || !!this.$scopedSlots[name])
        },
        getStepIndex(step: number) {
            const nextIndex = this.circular
                ? (this.list.length + this.currentIndex + step) % this.list.length
                : Math.max(0, Math.min(this.list.length - 1, this.currentIndex + step))
            return nextIndex
        },
        animateGo(step: number) {
            const currentIndex = this.getStepIndex(step)
            this.oldCureentIndex = this.currentIndex
            this.currentIndex = currentIndex
            const size = this.size
            const start = this.position + this.offset
            // const translate = this.direction === 'vertical' ? 'translateY' : 'translateX'
            let end = start
            if (this.circular) {
                const sign = -Math.sign(step)
                end = sign * size
            } else {
                end = -currentIndex * size
            }
            const distande = end - start
            this.manual = false
            this.offset = 0
            runAnimate({
                duration: this.transitionDuration,
                onProgress: params => {
                    this.position = distande * params.progress + start
                    // list.style.cssText = `${translate}(${distande * params.progress + start}px);`
                },
                onEnd: () => {
                    this.position = distande + start
                    if (this.circular) {
                        this.manual = true
                        this.position = 0
                        this.initShadowList()
                    }
                    const changed = this.oldCureentIndex !== this.currentIndex
                    this.oldCureentIndex = this.currentIndex
                    if (this.handler) {
                        this.handler.lock(false)
                    }
                    if (changed) {
                        const index = this.currentIndex
                        const value = this.list[index]
                        this.emitChange({ value, index })
                    }
                    this.play()
                }
            })
        },
        play() {
            this.stop()
            if (!this.autoplay) {
                return
            }
            this.autoplayHandler = setTimeout(() => {
                this.manual = false
                if (!this.circular && this.currentIndex >= this.list.length - 1) {
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
            if (!this.initRef()) {
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
            if (this.handler) {
                this.handler.dispose()
            }
        },
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
        listCssText(): string {
            const translate: string = this.direction === 'vertical' ? 'translateY' : 'translateX'
            if (this.manual) {
                return `transform:translateZ(0px) ${translate}(${this.position + this.offset}px);`
            } else {
                return `transform:translateZ(0px) ${translate}(${this.position}px);`
            }
        }
    },
    data() {
        return {
            manual: false,
            oldCureentIndex: 0,
            currentIndex: 0,
            offset: 0,
            position: 0,
            size: 0,
            shadowList: [] as any[],
            handler: null as any,
            autoplayHandler: null as any,
        }
    },
    setup(props, { emit }) {
        const emitTap = (params: { value: any, index: number }) => {
            emit('tap', params)
        }
        const emitChange = (params: { value: any, index: number }) => {
            emit('change', params)
        }
        
        const refs = reactive<{
            root: VNodeRef | undefined,
            wrapper: VNodeRef | undefined,
            list: VNodeRef | undefined,
        }>({
            root: undefined,
            wrapper: undefined,
            list: undefined,
        })
        
        return {
            emitTap,
            emitChange,
            refs,
        }
    },
    render() {

        const setRoot = (el: any) => {
            this.refs.root = el
        }
        const setWrapper = (el: any) => {
            this.refs.wrapper = el
        }
        const setList = (el: any) => {
            this.refs.list = el
        }

        return <div ref={setRoot} class={style['swiper-wrapper']} style={this.wrapperCssText}>
            <div ref={setWrapper} class={style['swiper-wrapper-container']}>
                <div
                    class={[style['list-wrapper'], style[this.direction], this.circular ? style['circular'] : '']}
                    style={this.boxSizeCssText}
                >
                    <div ref={setList} class={style.list} style={this.listCssText}>
                        {
                            this.shadowList.map((item, index) => (
                                <div class={style.item}  style={this.boxSizeCssText} key={index}>{
                                    !this.$slots.item ? <ItemDemo value={item.value as any} index={item.index} /> : this.$slots.item({
                                        value: item.value,
                                        index: item.index,
                                    })
                                }</div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div class={[style['bottom-wrapper'], style[this.direction]]}>
                {!this.$slots.dots ? <SwiperDots
                    count={this.list.length}
                    current={this.currentIndex}
                    direction={this.direction}
                /> : this.$slots.dots({
                    count: this.list.length,
                    current: this.currentIndex,
                    direction: this.direction
                })}
            </div>
        </div>
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {
        this.destory()
    }
})
