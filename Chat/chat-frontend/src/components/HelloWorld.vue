<template lang="pug">  
.app
  el-header.header 
    h1.headerH1 {{msg}}
    //- el-button.headerButton(type="danger") 断开
  .hello 
    p {{connected}}  {{user}}进入聊天室
    .list(v-for="item in sendDataList")
      p.message {{item.message}}
      p.time {{item.time}}
    el-footer.footer
      el-input.footerInput(v-model="sendData" placeholder="请输入发送内容")
      el-button.footerButton(@click="clickSend()" type="primary") 发送
</template>

<script>
import Moment from 'moment'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      connected:'',
      user: '',
      sendData:'',
      sendDataList:[]
    }
  },
  sockets: {
    //不能改,j建立连接自动调用connect
    connect: function() {
      //与socket.io连接后回调
      let that = this
      that.connected = '已建立连接'
       console.log("client socket connected");
    },
    userConnect(user) {
      this.user = user
    },
    //服务端向客户端发送login事件
    login: function(value) {
       console.log('client value' + value);
    },
    server(value) {
      let that = this
      let time = {
        time: Moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
      }
      let message = Object.assign(value, time)
      that.sendDataList.push(message)
      console.log('sendDataList' + JSON.stringify(value))
    }
  },
  methods: {
    // 当前时间
    nowTime() {
      return 
    },
    clickSend() {
      let that = this
      console.log('点击发送');
      that.$socket.emit('send',{message: that.sendData});
      that.sendData = ''
    }
  },
  mounted() {

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.header
  margin-top 0
  width 100%
  display flex
  justify-content flex-end
  align-items center
  background #E9EEF3
  .headerH1
    width 80%
    text-align center
  .headerButton
    width 100px
    height 40px
.list
  display flex
  flex-direction row
  justify-content space-between
.message
  text-align left 
.footer 
  width 100%
  height 10%
  position fixed
  bottom 0
  left 0
  .footerInput 
    margin-left 0
    width 80%
    height auto
  .footerButton 
    width 18%
    margin-left 2%
    height auto


</style>
