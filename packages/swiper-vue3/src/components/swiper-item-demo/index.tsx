import { defineComponent } from 'vue'
import style from './index.module.scss'

export default defineComponent({
    props: {
        value: {
            type: [Object, Number, String],
            required: true,
            default: ''
        },
        index: {
            type: Number,
            required: true,
            default: 0
        }
    },
    render() {
        const { value, index } = this
        const content = JSON.stringify({ value, index }, null, 2)
        return <div class={[style['item-demo'], index % 2 === 1 ? style.odd : '']}>
            <pre>{content}</pre>
        </div>
    },
})