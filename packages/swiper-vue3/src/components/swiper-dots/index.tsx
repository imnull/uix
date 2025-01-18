import { defineComponent } from 'vue'
import style from './index.module.scss'

export default defineComponent({
    name: 'SwiperDots',
    props: {
        direction: {
            type: String,
            default: ''
        },
        count: {
            type: Number,
            default: 0,
        },
        current: {
            type: Number,
            default: 0,
        }
    },
    render() {
        const { direction, count, current } = this
        const list = count > 0 ? Array(count).fill(0).map((v, i) => v + i) : []
        return <div class={[style['dots-demo-wrapper'], style[direction]]}>{
            list.map((item, index) => (
                <div class={[style.dot, index === current ? style.sel : '']} key={index}></div>
            ))
        }</div>
    },
})