<template>
    <div ref="root" class="scrollview-wrapper" :style="wrapperCssText">
        <div class="list-wrapper" :style="listCssText">
            <div class="list">
                <slot />
            </div>
        </div>
    </div>
</template>
<script lang="js">
import { initGestureEvents, rpxToPx } from '@imnull/ui-core'

export const calDistance = (speed, acceleration) => {
    let v0 = speed
    const a = -Math.sign(v0) * Math.abs(acceleration)
    const t = Math.abs(v0) / Math.abs(a)
    const s = v0 * t + 0.5 * a * t * t
    return s
}

export default {
    props: {
        bgColor: {
            type: String,
            default: 'transparent',
        },
        rpxHeight: {
            type: Number,
            default: -1,
        },
        height: {
            type: Number,
            default: -1,
        },
    },
    computed: {
        listCssText() {
            let css = `transform:translateY(${this.position + this.offset}px);`
            if(!this.manual) {
                css += `transition:transform 1s;`
            }
            return css
            
        },
        wrapperCssText() {
            return ''
        }
    },
    data() {
        return {
            elastic: 0,
            manual: false,
            offset: 0,
            position: 0,
        }
    },
    
    methods: {
        init() {
            const { root } = this.$refs
            this.handler = initGestureEvents(root, {
                onStart: () => {
                    this.offset = 0
                    this.manual = true
                },
                onMove: options => {
                    this.offset = options.y
                },
                onEnd: (res) => {
                    this.manual = false
                    const S = calDistance(res.speed.y, 0.01)
                    console.log(1122233, S)
                    this.position = this.position + this.offset + S
                    this.offset = 0
                }
            }).init()
        }
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {
        if(this.handler) {
            this.handler.dispose()
        }
    }
}
</script>
<style lang="scss" scoped>
.scrollview-wrapper {
    box-sizing: border-box;
    width: 100%;
    position: relative;
    overflow: visible;
    height: 50vh;
    border: 2px solid #000;
    .list-wrapper {
        position: relative;
        .list {
            box-sizing: border-box;
            position: relative;
        }
    }
    
}
</style>
