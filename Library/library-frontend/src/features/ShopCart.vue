<template lang="pug">
.main
    el-header 购物车详情
    el-main
      el-table(:data="itemsDetail" style="width: 100%")
          el-table-column(label="商品图片")
            template(slot-scope="props")
              img.itemImage(:src="props.row.goodsIdDetail.image")
          el-table-column(label="商品名称") 
            template(slot-scope="props")
              span {{props.row.goodsIdDetail.name}}
          el-table-column(label="商品属性")
            template(slot-scope="props")
              .items(v-for="(item, index) in props.row.itemIdsDetail" :key="index")
                span {{item.itemName}}
          el-table-column(label="商品原价")
            template(slot-scope="props")
              .items(v-for="(item, index) in props.row.itemIdsDetail" :key="index")
                span.originalPrice {{handleOrigialPrice(props.row.goodsIdDetail.shopPrice)}}
          el-table-column(label="商品现价")
            template(slot-scope="props")
              .items(v-for="(item, index) in props.row.itemIdsDetail" :key="index")
                span {{handleCurrentPrice(props.row.goodsIdDetail.isPromote, props.row.goodsIdDetail.shopPrice, item.typeFall)}}
    el-footer
      span.originalPrice 商品总原价：{{shopOriginalPrice()}} 元
      span 商品总现价：{{shopCurrentPrice()}} 元
      el-button(type='danger' @click="clickPay()" v-if="!orderStatus") 提交订单
      el-button(type='danger' disabled=true v-else) 已支付
    
    //-   span 当前订单状态：{{orderStatus? '已支付' : '未支付'}}

      
</template>


<script>
import axios from "axios"
import DOMAIN from "../utils/domain"


export default {
    data() {
        return {
           orderStatus: '',
           itemsDetail: []
        }
    },
    methods: {
        // 商品总现价
        shopCurrentPrice() {
          let that = this
          let price = 0
          that.itemsDetail.map(value => {
              value.itemIdsDetail.map(element => {
                  if(value.goodsIdDetail.isPromote) {
                    price += parseInt(value.goodsIdDetail.shopPrice) - parseInt(element.typeFall)
                  } else {
                    price += parseInt(value.goodsIdDetail.shopPrice)
                  }
              })
            
          })
          return price
        },
        // 商品总原价
        shopOriginalPrice() {
          let that = this
          let price = 0
          that.itemsDetail.map(value => {
            price += parseInt(value.goodsIdDetail.shopPrice) * value.itemIdsDetail.length
          })
          return price
        },
        // 商品打折价格
        handleCurrentPrice(isPromote, shopPrice,typeFall) {
           if(isPromote) {
               return parseInt(shopPrice) - parseInt(typeFall)
           } else {
               return parseInt(shopPrice)
           }
        },
        // 商品的原始价格
        handleOrigialPrice(shopPrice) {
            return parseInt(shopPrice)
        },
        // 点击支付
        clickPay() {
          let that = this
          that.postClientOrder()
        },
        confirmPay(orderId) {
          let that = this
          that.$confirm('请确认是否支付', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            that.showToast('success', '已确认支付')
            that.payOrder(orderId, 'pay')
          }).catch(() => {
            that.payOrder(orderId, 'cancel')
            that.showToast('info', '已取消支付')
          })
        },
        // 解析数据
        getQuery() {
            let that = this
        },
        // 查看当前订单的状态
        searchOrder(orderId) {
            let that = this
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/client/searchOrder`,
                data: {
                  orderId: orderId
                }
            }).then(res => {
                if(res.data.status) {
                    that.showToast('success', res.data.message)
                    if(res.data.data && res.data.data.orderStatus === 'pay') {
                        that.orderStatus = true
                    } else {
                        that.orderStatus = false
                    }
                } else {
                    that.showToast('error', res.data.message)
                }
            })
        },
        // 支付订单
        payOrder(orderId, orderStatus) {
            let that = this
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/client/payOrder`,
                data: {
                  _id: orderId,
                  orderStatus: orderStatus
                }
            }).then(res => {
                if(res.data.status) {
                    that.searchOrder(orderId)
                    that.$router.push('/paySuccess')
                    that.showToast('success', res.data.message)
                } else {
                    that.showToast('error', res.data.message)
                }
            })
        },
        // 下订单
        postClientOrder() {
            let that = this
            let itemIdsArray = []
            that.itemsDetail.map(value => {
                value.itemIds.map(value => {
                  itemIdsArray.push(value)
                })
            })
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/client/placeOrder`,
                data: {
                  itemIds: itemIdsArray,
                  itemsOriginalPrice: that.shopCurrentPrice(),
                  itemsPresentPrice: that.shopOriginalPrice(),
                  orderStatus: 'unpay'
                }
            }).then(res => {
                if(res.data.status) {
                    that.$router.push({path: '/shopCart', query: { orderId: res.data.data._id }})
                    that.showToast('success', res.data.message)
                    setTimeout(() => {
                        that.confirmPay(res.data.data._id)
                    }, 1500)
                } else {
                    that.showToast('error', res.data.message)
                }
            })
        },
        // 获取购物车商品
        getItems() {
            let that = this
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/client/shopCartItems`
            }).then(res => {
                if(res.data.status) {
                    if(res.data.data.goods.length > 0) {
                      that.itemsDetail = res.data.data.goods
                    }
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
    },
    mounted() {
        let that = this
        that.getQuery()
        that.getItems()
        that.searchOrder(this.$route.query.orderId)
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
.originalPrice
  text-decoration line-through
  color #C0C0C0	
.itemImage
  width 50px
  height 50px 
.el-footer
    min-height 80px
    display flex
    align-items center
    justify-content space-between
    background-color #F5F5F5
</style>
