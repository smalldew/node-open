<template lang="pug">
  el-container
    el-button(type="primary" @click="clickLogin()") 登录
    el-button(type="primary" @click="clickRegister()") 注册
</template>

<script>
export default {
    data(){
        return {
          info: '主界面'
        }
    },
    methods: {
      clickLogin() {
        this.$router.push('/bg/login')
      },
      clickRegister() {
        this.$router.push('/bg/register')
      },
    }
}
</script>

<style lang="stylus" scoped>
.el-container
  position relative
  width 400px
  height 400px
  margin 0 auto
  background-color #E9EEF3
  display flex
  flex-direction row
  justify-content center
  align-items center
</style>
