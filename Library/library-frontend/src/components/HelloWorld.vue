<template lang="pug">
  .userinfo {{nickname}}
    
</template>


<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      nickname: 'lucien'
    }
  },
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.userinfo
   position fixed
   top 10px
   right 20px
   width 100px
   height 50px
   line-height 50px
   text-align center
   background #DCDCDC	
</style>

