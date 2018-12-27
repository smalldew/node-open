<template lang="pug">
  .app
    h1 登录页面
    el-input(placeholder="请输入登录账号" v-model="account" clearable) 
    el-input(placeholder="请输入登录密码" v-model="password" clearable type="password")
    el-button(type="primary" @click="clickLogin()") 登录
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
        clickLogin() {
            let that = this
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/login`,
                data: {
                    username: that.account,
                    password: that.password
                }
            }).then(res => {
                if(res.data.status) {
                  that.showToast('success', res.data.message)
                  localStorage.setItem('userId', res.data.data.userId)
                  localStorage.setItem('token', res.data.data.token)
                  that.$router.push('/bg/library')
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