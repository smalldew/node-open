<template lang="pug">
  .app
    h1 注册页面
    el-input(placeholder="请输入注册账号" v-model="account" clearable) 
    el-input(placeholder="请输入注册密码" v-model="password" clearable type="password")
    el-button(type="primary" @click="clickRegister()") 注册
</template>

<script>
import axios from "axios"
import DOMAIN from "../utils/domain"


export default {
    data(){
        return {
            account: '',
            password: ''
        }
    },
    methods: {
        clickRegister() {
            let that = this
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/register`,
                data: {
                    username: that.account,
                    password: that.password
                }
            }).then(res => {
                if(res.data.status) {
                  that.showToast('success', res.data.message)
                  that.$router.push('/')
                } else {
                  that.showToast('error', res.data.message)
                }
            })           
        },
        showToast(type, message) {
            this.$message({
                message: message,
                type: type
            });
        }
    }
}
</script>

<style lang="stylus" scoped>
.app 
  width 400px
  height 400px
  margin 0 auto
  display flex
  flex-direction column
  align-items center
  justify-content center
  .el-input
    margin-top 20px
  .el-button
    width 200px
    margin-top 40px
</style>
