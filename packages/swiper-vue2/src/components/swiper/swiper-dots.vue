<template>
  <div v-if="count > 0" :class="['dots-demo-wrapper', direction]">
    <div
      :class="['dot', { sel: index === current }]"
      v-for="(item, index) in list"
      :key="item"
    ></div>
  </div>
</template>
<script lang="js">
export default {
    computed: {
        list() {
            if(this.count > 0) {
                return Array(this.count).fill(0).map((v, i) => v + i)
            } else {
                return []
            }
        }
    },
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
    }
}
</script>
<style lang="scss" scoped>
.dots-demo-wrapper {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 48rpx;
  flex-shrink: 0;
  &.vertical {
    height: 100%;
    width: 48rpx;
    flex-direction: column;
    .dot {
      margin: 6rpx 0;
      &.sel {
        width: 12rpx;
        height: 24rpx;
      }
    }
  }
  .dot {
    width: 12rpx;
    height: 12rpx;
    box-sizing: border-box;
    border-radius: 6rpx;
    background-color: rgba(255, 255, 255, 0.4);
    margin: 0 6rpx;
    box-shadow: 0 0 3px 0px rgba(0, 0, 0, 0.2);
    transition: width 0.2s, background-color 0.2s;
    &.sel {
      width: 24rpx;
      height: 12rpx;
      background-color: rgba(255, 255, 255, 1);
    }
  }
}
</style>