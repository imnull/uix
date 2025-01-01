<template>
  <div :class="['item-demo', { odd: index % 2 === 1 }]">
    <pre>{{ content }}</pre>
  </div>
</template>
<script lang="js">

export default {
    computed: {
        content() {
            return JSON.stringify({ value: this.value, index: this.index }, null, '  ')
        }
    },
    props: {
        value: {
            type: [Object, Number, String],
            default: '',
        },
        index: {
            type: Number,
            default: 0
        }
    }
}
</script>
<style lang="scss" scoped>
.item-demo {
  text-align: left;
  padding: 10px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 2px solid #a30;
  color: #fff;
  background-color: #c60;
  &.odd {
    border: 2px solid #03a;
    background-color: #06c;
    color: #fff;
  }
}
</style>