import { defineComponent } from 'vue'
import './app.scss'
import { Swiper } from './components'

export default defineComponent({
    name: 'App',
    methods: {
        handleTap(e: any) {
            console.log('tap', e)
        },
        handleChange(e: any) {
            console.log('change', e)
            this.current = e.index
        }
    },
    data() {
        return {
            current: 0,
        }
    },
    render() {
        return <div>
            <h1>Swiper Vue3</h1>
            <Swiper
                circular
                autoplay
                duration={3000}
                list={[1,2,3,4]}
                current={this.current}
                onTap={this.handleTap}
                onChange={this.handleChange}
            >
            {
                {
                    // item: (props: any) => <div style="border:1px solid #000;">{props.value}</div>,
                    // dots: (props: any) => <div class="dots-demo">{JSON.stringify(props)}</div>,
                }
            }
            </Swiper>
            <Swiper
                direction="vertical"
                list={['a', 'b', 'c', 'd']}
                circular
                onTap={this.handleTap}
                onChange={this.handleChange}
                rpxHeight={300}
                current={this.current}
            />
            <Swiper
                direction="horizontal"
                list={[0, 1, 2, 3]}
                circular={false}
                onTap={this.handleTap}
                onChange={this.handleChange}
                rpx-height={800}
                current={this.current}
            />
        </div>
    },
    mounted() {
        console.log(1111111, 'mounted')
    }
})