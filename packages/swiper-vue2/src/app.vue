<template>
    <div>
        <h1>Swiper VUE2</h1>
        <Swiper
            direction="horizontal"
            :list="[0, 1, 2, 3]"
            circular
            :autoplay="true"
            :current="current"
            :duration="2000"
            @change="handleSwiperChange"
            @tap="handleSwiperTap"
            :rpx-height="400"
        />
        <Swiper
            direction="horizontal"
            :list="[0, 1, 2, 3]"
            :circular="false"
            @change="handleSwiperChange"
            @tap="handleSwiperTap"
            :rpx-height="400"
            :current="current"
        >
            <template slot="dots" slot-scope="dots">
                <SwiperDots :count="dots.count" :current="dots.current" :direction="dots.direction" />
                <div class="btns">
                    <button :disabled="current < 2" @click="handleGoPage(0)">Page1</button>
                    <button :disabled="current > 1" @click="handleGoPage(2)">Page2</button>
                </div>
            </template>
        </Swiper>
        <Swiper
            direction="vertical"
            :list="['a', 'b', 'c', 'd']"
            circular
            @change="handleSwiperChange"
            @tap="handleSwiperTap"
            :rpx-height="400"
            :current="current"
        />
    </div>
</template>
<script lang="js">
import { Swiper, SwiperDots } from './components/index'
export default {
    components: {
        Swiper,
        SwiperDots,
    },
    data() {
        return {
            current: 1
        }
    },
    methods: {
        handleSwiperChange(e) {
            console.log('swiper change:', e)
            this.current = e.index
        },
        handleSwiperTap(e) {
            console.log('swiper tap:', e)
        },
        handleGoPage(index) {
            this.current = index
        }
    }
}
</script>
<style lang="scss">
body {
    margin: 0;
}
h1 {
    color: blue;
}
.btns {
    padding-bottom: 20rpx;
}
</style>
