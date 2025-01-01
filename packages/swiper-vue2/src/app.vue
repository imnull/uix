<template>
    <div>
        <h1>Swiper VUE2</h1>
        <Swiper
            direction="horizontal"
            :list="[0, 1, 2, 3]"
            circular
            @change="handleSwiperChange"
            @tap="handleSwiperTap"
            :rpx-height="400"
        />
        <Swiper
            direction="vertical"
            :list="['a', 'b', 'c']"
            circular
            @change="handleSwiperChange"
            @tap="handleSwiperTap"
            :rpx-height="400"
        />
        <!-- <Swiper :list="[0, 1, 2, 3]" :circular="false" @change="handleSwiperChange" @tap="handleSwiperTap">
            <template slot="item" slot-scope="data">
                <p style="border:1px solid blue;">{{ data }}</p>
            </template>
            <template slot="dots" slot-scope="data">
                <p style="border:1px solid blue;">{{ data }}</p>
            </template>
        </Swiper> -->
    </div>
</template>
<script lang="js">
import Swiper from './components/swiper/index.vue'
export default {
    components: {
        Swiper,
    },
    methods: {
        handleSwiperChange(e) {
            console.log('swiper change:', e)
        },
        handleSwiperTap(e) {
            console.log('swiper tap:', e)
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
</style>
