<template>
    <div class="slider-wrapper" ref="root">
        <div ref="wrapper" :class="['wrapper', { ani: !manual }]" :style="wrapperCssText"><slot /></div>
        <div class="tools-wrapper">
            <div class="tools" ref="tools">
                <slot name="tools" />
            </div>
        </div>
    </div>
</template>
<script lang="js">
import { initGestureEvents } from '@imnull/ui-core'
const MAPPER = []

const unregist = (page) => {
    const idx = MAPPER.indexOf(page)
    if(idx > -1) {
        MAPPER.splice(idx, 1)
    }
}
const regist = (page) => {
    const idx = MAPPER.indexOf(page)
    if(idx < 0) {
        MAPPER.push(page)
    }
}

const trigger = (page, callback) => {
    MAPPER.forEach(p => {
        if(page === p) {
            return
        }
        callback(p)
    })
}

export default {
    computed: {
        wrapperCssText() {
            return `transform:translateX(${this.x}px);`
        },
    },
    data() {
        return {
            x: 0,
            manual: false,
        }
    },
    methods: {
        init() {
            const { root, tools } = this.$refs

            const { width } = tools.getBoundingClientRect()
            let x = 0
            const handler = initGestureEvents(root, {
                // direction: 1,
                movePenetration: true,
                onStart: () => {
                    x = this.x
                    this.manual = true
                },
                onMove: (e) => {
                    if(x === 0) {
                        this.x = -Math.min(width, Math.max(0, -e.x))
                    } else {
                        this.x = Math.max(x + Math.min(width, e.x), -width)
                    }
                },
                onEnd: () => {
                    this.manual = false
                    if(Math.abs(this.x) < width) {
                        x = 0
                        this.x = 0
                    } else {
                        trigger(this, otherPage => {
                            otherPage.x = 0
                        })
                    }
                    
                }
            }).init()
            this.handler = handler
        },
        destroy() {
            if(this.handler) {
                this.handler.dispose()
            }
        }
    },
    mounted() {
        regist(this)
        this.init()
    },
    beforeDestroy() {
        unregist(this)
        this.destroy()
    }
}
</script>
<style lang="scss" scoped>
.slider-wrapper {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    .wrapper {
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        position: relative;
        z-index: 5;
        background-color: #fff;
        &.ani {
            transition: transform 0.15s;
        }
    }
    .tools-wrapper {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: stretch;
        z-index: 1;
        .tools {
            position: relative;
            right: 0;
            top: 0;
            bottom: 0;
        }
    }
}
</style>