<template lang="pug">
.app
  el-container
    el-header 支付成功啦
    el-main 
      el-button(@click="clickGoHome") 点击回首页
</el-container>
  
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        clickGoHome() {
          this.$router.push('/library')
        }
    }
}
</script>


<style lang="stylus" scoped>
  .el-header
    background-color #B3C0D1
    color #333
    text-align center
    line-height 60px
  .el-main
    background-color #E9EEF3
    color #333
    text-align center
    line-height 160px
</style>
