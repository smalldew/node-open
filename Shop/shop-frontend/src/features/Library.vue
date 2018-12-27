<template lang="pug">
  el-container
   el-aside(width="180px")
      el-button.asideButton(@click="clickAllOrder") 个人订单
      el-button.asideButton(@click="clickSet") 设置
   el-container
    el-header
      el-input(placeholder="请输入内容" v-model="inputSearch" clearable)
      el-button.buttonSearch(type="primary" icon="el-icon-search" @click="clickSearchBook") 点击搜索
      p.headUser {{username}}
      el-button.outButton(@click="clickOut") 退出
    el-main
      el-table(:data="goodsList" style="width: 100%" @row-click="clickRow")
        el-table-column(prop="image" label="商品图片")
          template(slot-scope="scope")
            img.goodsImage(:src="scope.row.image")
        el-table-column(prop="name" label="商品名称")
        el-table-column(prop="marketPrice" label="商品的市场价")
        el-table-column(prop="shopPrice" label="商品的商城价")
        el-table-column(prop="publisher" label="商品出版方")
        el-table-column(:formatter="isPromote" label="是否促销")
    

    

</template>

<script>
import axios from "axios"
import DOMAIN from "../utils/domain"
import { throwStatement, returnStatement } from 'babel-types';

export default {
    data(){
        return {
            username: '',
            // 商品列表
            goodsList: [],
            inputSearch: ''
        }
    },
    watch: {
        inputSearch(n, o) {
            if(!n) {
               let that = this
               that.getAllBooks()
            }
        },
        shopCartNumber(n, o) {
          let that = this
          that.isEmptyShopCart()
        }
    },
    methods: {
        // 点击cell
        clickRow(row, event, column) {
            let that = this
            that.$router.push({path: '/libraryDetail', query: {goodsId: row._id}})
            console.log(row._id, event, column)
        },
        // 是否是促销
        isPromote(row, column) {
            if(row.isPromote) {
                return '是'
            } else {
                return '否'
            }
        },
        clickExpandChange(row, expandedRows)  {
        //   console.log('row' + JSON.stringify(row) + 'expandedRows' + JSON.stringify(expandedRows))
        },
        clickOut() {
            let that = this
            that.$router.push('/')
        },
        getMe() {
            let that = this
            axios({
                method: 'get',
                url: `${DOMAIN.domain}/me`
            }).then(res => {
                if(res.data.status) {
                    that.username = res.data.data
                } else {
                    that.showToast('error', res.data.message)
                }
            }) 
        },
        getAllBooks() {
            let that = this
            axios({
                method: 'get',
                url: `${DOMAIN.domain}/client/allGoods`
            }).then(res => {
                if(res.data.status) {
                    that.goodsList = res.data.data
                } else {
                    that.showToast('error', res.data.message)
                }
            })           
        },
        clickAllOrder() {
            let that = this
            that.$router.push('/order')
            // that.$alert(`功能正在开发中...`, '提示', {
            // }).then(({ value }) => {
            //     console.log('确认')
            // }).catch(() => {
            //     console.log('取消')
            // })
        },
        clickSet() {
            let that = this
            that.$alert(`功能正在开发中...`, '提示', {
            }).then(({ value }) => {
                console.log('确认')
            }).catch(() => {
                console.log('取消')
            })
        },
        postSearchBook(bookName) {
            let that = this
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/client/searchGoods`,
                data: {
                    name: bookName
                }
            }).then(res => {
                if(res.data.status) {
                  that.goodsList = res.data.data
                  that.showToast('success', res.data.message)
                } else {
                  that.showToast('error', res.data.message)
                }
            })          
        },
        clickSearchBook() {
            let that = this
            that.postSearchBook(that.inputSearch)
        },
        showToast(type, message) {
            this.$message({
                message: message,
                type: type
            });
        }
    },
    created() {

    },
    mounted() {
      let that = this
      that.getAllBooks()
      that.getMe()
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
    justify-content flex-end
  .buttonSearch
    margin-left 20px
  .headUser
    width 100px
  .outButton
    width 100px
    height 40px

  .asideButton
    height 80px
    width 100px
  .el-aside
    background-color #D3DCE6
    color #333
    text-align center
    line-height 200px
  
  .el-main 
    background-color #E9EEF3
    color #333
    text-align center
  .demo-table-expand 
    font-size 0
  .demo-table-expand span 
    width 90px
    color #99a9bf
    margin-top 20px
  .demo-table-expand .el-form-item 
    margin-right 0
    margin-bottom 0
    width 50%
  .goodsImage
    width 50px
    height 50px 
    border 1px solid #D3DCE6
  .el-footer
    min-height 80px
    display flex
    align-items center
    justify-content space-between
    background-color #F5F5F5

</style>
