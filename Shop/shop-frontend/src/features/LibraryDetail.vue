<template lang="pug">
.app
  el-container 
    el-header 商品详情页
    el-main 
      .goodsDetail
        .goods
          .detailContent()
            img.detailImage(:src="goodsDetail.image")
          .detailContent()
            span 商品名称: {{goodsDetail.name}}
          .detailContent()
            span 商品的市场价: {{goodsDetail.marketPrice}}
          .detailContent()
            span 商品的商城价: {{goodsDetail.shopPrice}}
          .detailContent(v-if="goodsDetail.publisher")
            span 商品出版方: {{goodsDetail.publisher.publisherName}}
          .detailContent()
            span 是否促销: {{goodsDetail.isPromote ? "是" : "否"}}
        .items 
          el-table(:data="itemsDetail" style="width: 100%")
            el-table-column(prop="itemName" label="商品属性")
            el-table-column(prop="typeStock" label="商品库存")
            el-table-column(prop="typeVersion" label="商品版本")
            el-table-column(prop="typeFall" label="商品现价")
              template(slot-scope="props")
                span {{handleFinalPrice(goodsDetail.isPromote, goodsDetail.shopPrice, props.row.typeFall)}}
            el-table-column(label="操作" width="160px")
              template(slot-scope="props")
                el-button(size="mini" type="primary" @click="clickAddToShopCart(props.row._id)" :disabled="isAddShopCart(props.row._id)")  加入
                el-button(size="mini" type="danger" @click="clickDeleteShopCart(props.row._id)" :disabled="!isAddShopCart(props.row._id)")  移除
    
    el-footer
      el-button(type='primary' @click="clickEmpty()" :disabled="isEmptyShopCart()") 清空购物车
      el-badge(:value="shopCartNumber" class="item" type="primary")    
        el-button(type='danger' @click="clickSettle()") 去购物车结算
</template>


<script>
import axios from "axios"
import DOMAIN from "../utils/domain"

export default {
    data() {
        return {
            goodsId: '',
            goodsDetail: '',
            publisher: "",
            itemsDetail: [],
            // 购物车列表
            shopCartList: [],
            // 购物车商品数量
            shopCartNumber: 0
        }
    },
    watch: {
        shopCartNumber(n, o) {
          let that = this
          that.isEmptyShopCart()
        }
    },
    methods: {
        showToast(type, message) {
            this.$message({
                message: message,
                type: type
            });
        },
        // 点击结算
        clickSettle() {
            let that = this
            that.$router.push('/shopCart')
        },
        // 是否已经加入购物车
        isAddShopCart(itemId) {
            let that = this
            let itemIdsArray = []
            if(that.shopCartList.length > 0) {
              that.shopCartList.map(value => {
                value.itemIds.map(value => {
                  itemIdsArray.push(value)
                })
              })
              if(itemIdsArray.indexOf(itemId) === -1) {
                return false
              } else {
                return true
              }
            }
        },
        // 清空购物车是否可点击
        isEmptyShopCart() {
           let that = this
           if(that.shopCartNumber > 0) {
               return false
           } else {
               return true
           }
        },
        // 点击清空购物车
        clickEmpty() {
            let that = this
            that.postEmptyShopCart()
        },
        // 加入购物车
        clickAddToShopCart(itemId) {
          let that = this
          that.postAddShopCart(itemId)
        },
        // 从购物车中移除
        clickDeleteShopCart(itemId) {
            let that = this
            that.postDeleteShopCart(itemId)
        },
        // 商品的最终价格
        handleFinalPrice(isPromote, shopPrice, typeFall) {
            if(isPromote) {
                return shopPrice - typeFall
            } else {
                return shopPrice
            }
        },
        // 获取参数
        getQuery() {
            let that = this
            that.goodsId = that.$route.query.goodsId
        },
        // 获取单一商品
        getOneGoods() {
            let that = this
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/client/oneGoods`,
                data: {
                    goodsId: that.goodsId
                }
            }).then(res => {
                if(res.data.status) {
                    that.goodsDetail = res.data.data
                    that.itemsDetail = res.data.data.itemsDetail
                } else {
                    that.showToast('error', res.data.message)
                }
            })  
        },
        // 加入购物车
        postAddShopCart(itemId) {
            let that = this
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/client/addShopCart`,
                data: {
                    goodsId: that.goodsId,
                    itemId: itemId
                },
            }).then(res => {
                if(res.data.status) {
                  if(res.data.data) {
                    let goods = res.data.data.goods
                    that.shopCartNumber = 0
                    goods.map((value) => {
                        that.shopCartNumber += value.itemIds.length 
                    })
                    that.shopCartList = res.data.data.goods
                  }
                } else {
                    that.showToast('error', res.data.message)
                }
            })  
        },
        // 从购物车中移除
        postDeleteShopCart(itemId) {
            let that = this
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/client/deleteShopCart`,
                data: {
                    goodsId: that.goodsId,
                    itemId: itemId
                },
            }).then(res => {
                if(res.data.status) {
                  if(res.data.data) {
                    let goods = res.data.data.goods
                    that.shopCartNumber = 0
                    goods.map((value) => {
                        that.shopCartNumber += value.itemIds.length 
                    })
                    that.shopCartList = res.data.data.goods
                  }
                } else {
                    that.showToast('error', res.data.message)
                }
            })  
        },
        // 清空购物车
        postEmptyShopCart() {
            let that = this
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/client/emptyShopCart`
            }).then(res => {
                if(res.data.status) {
                    if(res.data.data) {
                        that.showToast('success', res.data.message)
                        that.getOneGoods()
                        that.getShopCart()
                    }
                } else {
                    that.showToast('error', res.data.message)
                }
            }) 
        },
        // 查询购物车
        getShopCart() {
            let that = this
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/client/searchShopCart`
            }).then(res => {
                if(res.data.status) {
                    if(res.data.data) {
                        let goods = res.data.data.goods
                        that.shopCartNumber = 0
                        goods.map((value) => {
                            that.shopCartNumber += value.itemIds.length 
                        })
                        that.shopCartList = res.data.data.goods
                    }
                } else {
                    that.showToast('error', res.data.message)
                }
            }) 
        },
    },
    mounted() {
        let that = this
        that.getQuery()
        that.getOneGoods()
        that.getShopCart()
    }
}
</script>



<style lang="stylus" scoped>
.el-header
    background-color #B3C0D1
    color #333
    text-align center
    line-height 60px
    display flex
    flex-direction row
    align-items center
    justify-content center
.el-footer
    min-height 80px
    display flex
    align-items center
    justify-content space-between
    background-color #F5F5F5
.goodsDetail
  border-radius 4px
  overflow hidden
  border 1px solid #ebeef5
  background-color #fff
  color #303133
  box-shadow 0 2px 12px 0 rgba(0,0,0,.1)
  display flex
  flex-direction column
  justify-content center
  align-items center
.goods
  display flex
  flex-direction column
  justify-content center
  text-align center
  .detailImage 
    margin-top 20px
    width 100px
    height 100px
  .detailContent
    color #808080		
    line-height 24px
  .items 
    margin-top 20px
</style>
