<template>
    <div>
        <h1>Swiper VUE2</h1>
        <Swiper />
    </div>
</template>
<script lang="js">
import Swiper from './components/swiper/index.vue'
export default {
    components: {
        Swiper,
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