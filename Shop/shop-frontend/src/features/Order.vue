<template lang="pug">
.app
  el-container
    el-header 订单详情页
    el-main
      el-table(:data="orderList" style="width: 100%")
          el-table-column(label="商品图片")
            template(slot-scope="props")
              .items(v-for="(item, index) in props.row.itemIdsDetail" :key="index")
                img.itemImage(:src="item.relatedGoodsId.image")
          el-table-column(label="商品名称")
            template(slot-scope="props")
              .items(v-for="(item, index) in props.row.itemIdsDetail" :key="index")
                span {{item.relatedGoodsId.name}}
          el-table-column(label="商品属性")
            template(slot-scope="props")
              .items(v-for="(item, index) in props.row.itemIdsDetail" :key="index")
                span {{item.itemName}}
          el-table-column(label="商品原价")
            template(slot-scope="props")
              .items(v-for="(item, index) in props.row.itemIdsDetail" :key="index")
                span.originalPrice {{item.relatedGoodsId.shopPrice}}
          el-table-column(label="商品现价")
            template(slot-scope="props")
              .items(v-for="(item, index) in props.row.itemIdsDetail" :key="index")
                span {{handleCurrentPrice(item.relatedGoodsId.isPromote, item.relatedGoodsId.shopPrice, item.typeFall)}}
          el-table-column(label="订单状态")
            template(slot-scope="props")
                span {{handleOrderStatus(props.row.orderStatus)}}
    el-footer
      el-button(type='primary' @click="clickGoHome()") 返回首页
</template>


<script>
import axios from "axios"
import DOMAIN from "../utils/domain"


export default {
    data() {
        return {
            // 订单列表
            orderList: []
        }
    },
    methods: {
        // 商品打折价格
        handleCurrentPrice(isPromote, shopPrice,typeFall) {
           if(isPromote) {
               return parseInt(shopPrice) - parseInt(typeFall)
           } else {
               return parseInt(shopPrice)
           }
        },
        // 订单状态
        handleOrderStatus(orderStatus) {
            if(orderStatus === 'pay') {
                return "已支付"
            } else if (orderStatus === 'unpay') {
                return "未支付"
            } else if (orderStatus === 'cancel') {
                return "已取消"
            } else if (orderStatus === 'delete') {
                return "已删除"
            }
        },
        clickGoHome() {
            this.$router.push('/library')
        },
        // 解析数据
        getQuery() {
            let that = this
        },
        // 查找全部订单
        postSearchAllOrder() {
            let that = this
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/client/searchAllOrder`
            }).then(res => {
                if(res.data.status) {
                  that.orderList = res.data.data
                  that.showToast('success', res.data.message)
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
        that.postSearchAllOrder()
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
  .el-footer
    min-height 80px
    display flex
    align-items center
    justify-content center
    background-color #F5F5F5
  .itemImage
    width 50px
    height 50px 
    border 1px solid #D3DCE6
  .originalPrice
    text-decoration line-through
    color #C0C0C0	
</style>
