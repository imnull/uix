<template>
    <div>
        <h1>Swiper VUE2</h1>
        <Swiper :list="[0, 1, 2, 3]" circular @change="handleSwiperChange" @tap="handleSwiperTap" />
        <Swiper :list="[0, 1, 2, 3]" :circular="false" @change="handleSwiperChange" @tap="handleSwiperTap" />
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
