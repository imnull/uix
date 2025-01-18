import { defineComponent } from 'vue'
import './index.scss'

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
        return <div class={`dots-demo-wrapper ${direction}`}>{
            list.map((item, index) => (
                <div class={`dot ${index === current ? 'sel' : ''}`} key={index}></div>
            ))
        }</div>
    },
})