<template lang="pug">
  el-container
   el-aside(width="180px")
     template(v-if="activeName === 'book' ")
      el-button.asideButton(@click="clickAddBook") 增加商品
      el-button.asideButton(@click="clickSearchBook") 查找商品
     template(v-else-if="activeName === 'item' ") 
      el-button.asideButton(@click="clickAddItem") 增加商品属性
      el-button.asideButton(@click="clickSearchItem") 查找商品属性 
     template(v-else) 
      el-button.asideButton(@click="clickAddPublisher") 增加出版社
      el-button.asideButton(@click="clickSearchPublish") 查找出版社
   el-container
    el-header
      .tabChange
        el-tabs(v-model="activeName" @tab-click="handleClick")
          el-tab-pane(label="商品管理" name="book")
          el-tab-pane(label="商品属性管理" name="item")
          el-tab-pane(label="出版社管理" name="publisher")
          
      .userInfo
        p.headUser {{username}}
        el-button.outButton(@click="clickOut") 退出
    el-main(v-if="activeName === 'book' ")
      el-table(:data="bookList" style="width: 100%" key="book")
        el-table-column(prop="_id" label="Id")
        el-table-column(prop="type" label="类型")
        el-table-column(prop="name" label="名称")
        el-table-column(prop="title" label="标题")
        el-table-column(prop="marketPrice" label="市场价")
        el-table-column(prop="shopPrice" label="商城价")
        el-table-column(prop="promotionPrice" label="促销价")
        el-table-column(prop="promotionStartTime" label="促销开始时间")
        el-table-column(prop="promotionEndTime" label="促销结束时间")
        el-table-column(prop="image" label="图片")
          template(slot-scope="options")
            img.goodsImage(:src='options.row.image')
        el-table-column(prop="publisher" label="出版社")
        el-table-column(prop="commodityStatus" label="上架状态")
        el-table-column(label="操作" width="250px" fixed="right")
          template(slot-scope="scope")
            el-button(type="primary" size="small" @click="clickUpdate(scope.row)") 更新
            el-button(type="danger" size="small" @click="clickDelete(scope.row)") 删除
    el-main(v-else-if="activeName === 'item' ")
      el-table(:data="itemList" style="width: 100%" key="publisher")
        el-table-column(prop="_id" label="属性id" width="100")
        el-table-column(prop="itemName" label="属性名称" width="100")
        el-table-column(prop="typeFall" label="属性差价")
        el-table-column(prop="typeStock" label="属性库存")
        el-table-column(prop="typeVersion" label="属性版本")
        el-table-column(prop="typeTime" label="属性出版时间")
        el-table-column(prop="relatedGoodsId" label="关联商品id")
        el-table-column(label="操作" width="250px")
          template(slot-scope="scope")
            el-button(type="primary" size="small" @click="clickItemUpdate(scope.row)") 更新
            el-button(type="danger" size="small" @click="clickItemDelete(scope.row)") 删除
    el-main(v-else)
      el-table(:data="publisherList" style="width: 100%" key="item")
        el-table-column(prop="_id" label="出版社id" width="100")
        el-table-column(prop="publisherName" label="出版社名称" width="100")
        el-table-column(prop="publisherAddress" label="出版社地址")
        el-table-column(prop="publisherWeb" label="出版社官网")
        el-table-column(prop="publisherPhone" label="出版社电话")
        el-table-column(label="操作" width="250px")
          template(slot-scope="scope")
            el-button(type="primary" size="small" @click="clickPublisherUpdate(scope.row)") 更新
            el-button(type="danger" size="small" @click="clickPublisherDelete(scope.row)") 删除
    //- 修改出版社信息
    el-dialog(:title="publisherDialogTitle" :visible.sync="dialogFormVisible")
      el-form(:model="publisher")
        el-form-item(label="出版社名称" label-width="100px")
          el-input(v-model="publisher.publisherName" autocomplete="off")
        el-form-item(label="出版社地址" label-width="100px")
          el-input(v-model="publisher.publisherAddress" autocomplete="off")
        el-form-item(label="出版社官网" label-width="100px")
          el-input(v-model="publisher.publisherWeb" autocomplete="off")
        el-form-item(label="出版社电话" label-width="100px")
          el-input(v-model="publisher.publisherPhone" autocomplete="off")
      .dialog-footer(slot="footer")
        el-button(@click="dialogFormVisible = false") 取消
        el-button(type="primary" @click="clickConfirmAddPublisher()") 确定
    //- 修改商品属性信息
    el-dialog(:title="itemDialog.title" :visible.sync="itemDialog.formVisible")
      el-form(:model="item")
        el-form-item(label="名称" label-width="100px")
          el-input(v-model="item.itemName" autocomplete="off")
        el-form-item(label="差价" label-width="100px")
          el-input(v-model="item.typeFall" autocomplete="off")
        el-form-item(label="库存" label-width="100px")
          el-input(v-model="item.typeStock" autocomplete="off")
        el-form-item(label="版本" label-width="100px")
          el-input(v-model="item.typeVersion" autocomplete="off")
        el-form-item(label="出版时间" label-width="100px")
          el-date-picker(v-model="item.typeTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请设置出版时间")
        el-form-item(label="关联商品id" label-width="100px")
          el-input(v-model="item.relatedGoodsId" autocomplete="off")
      .dialog-footer(slot="footer")
        el-button(@click="itemDialog.formVisible = false") 取消
        el-button(type="primary" @click="clickConfirmAddItem()") 确定
    //- 修改商品信息
    el-dialog(:title="bookDialog.title" :visible.sync="bookDialog.formVisible")
      el-form(:model="book")
        el-form-item(label="商品名称" label-width="100px")
          el-input(v-model="book.name" autocomplete="off")
        el-form-item(label="商品标题" label-width="100px")
          el-input(v-model="book.title" autocomplete="off")
        el-form-item(label="商品市场价" label-width="100px")
          el-input(v-model="book.marketPrice" autocomplete="off")
        el-form-item(label="商品商城价" label-width="100px")
          el-input(v-model="book.shopPrice" autocomplete="off")
        el-form-item(label="商品促销价" label-width="100px")
          el-input(v-model="book.promotionPrice" autocomplete="off")
        el-form-item(label="促销开始时间" label-width="100px")
          el-date-picker(v-model="book.promotionStartTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请设置商品促销时间")
        el-form-item(label="促销结束时间" label-width="100px")
          el-date-picker(v-model="book.promotionEndTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请设置商品促销时间")
        el-form-item(label="商品图片" label-width="100px")
          el-input(v-model="book.image" autocomplete="off")
        el-form-item(label="商品出版社" label-width="100px")
          el-input(v-model="book.publisher" autocomplete="off")
        el-form-item(label="上架状态" label-width="100px")
          el-input(v-model="book.commodityStatus" autocomplete="off")
      .dialog-footer(slot="footer")
        el-button(@click="bookDialog.formVisible = false") 取消
        el-button(type="primary" @click="clickConfirmAddBook()") 确定
</template>

<script>
import axios from "axios"
import DOMAIN from "../utils/domain"

export default {
    data(){
        return {
            activeName: 'book',
            publisherDialogTitle: '',
            username: '',
            bookList: [],
            publisherList: [],
            itemList: [],
            inputSearch: '',
            dialogFormVisible: false,
            book: {
              _id: '',
              bookName: '',
              bookTitle: '',
              bookMarketPrice: '',
              bookShopPrice: '',
              bookPromotionPrice: '',
              bookPromotionTime: '',
              bookImage: '',
              publisher: '',
              commodityStatus: ''
            },
            bookStatus: 'create',
            publisher: {
              _id: '',
              publisherName: '',
              publisherAddress: '',
              publisherWeb: '',
              publisherPhone: ''
            },
            publisherStatus: 'create',
            item: {
              _id: '',
              relatedGoodsId: "",
              itemName: "",
              typeFall: "",
              typeStock: "",
              typeVersion: "",
              typeTime: "",
            },
            itemStatus: 'create',
            bookDialog: {
              title: '',
              formVisible: false
            },
            itemDialog: {
              title: '',
              formVisible: false
            }
        }
    },
    watch: {
        inputSearch(o, n) {
            let that = this
            axios({
                method: 'get',
                url: `${DOMAIN.domain}/me?bookname=${n}`
            }).then(res => {
                if(res.data.status) {
                    if(res.data.data.length > 0) {
                        that.bookList = res.data.data
                    }
                } else {
                    that.showToast('error', res.data.message)
                }
            })
        }
    },
    methods: {
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
        handleClick(tab, event) {
            let that = this
            if(tab.name === 'book') {
                that.getAllBooks()
            } else if(tab.name === 'publisher') {
                that.getAllPublishers()
            } else if(tab.name === 'item') {
                that.getAllItems()
            }
            console.log('tab.name' + tab.name )
        },
        clickConfirmAddPublisher() {
            let that = this
            if(that.publisherStatus === 'create') {
              that.addPublisher()
            } else {
              that.updatePublisher()
            }
        },
        // 点击更新商品属性
        clickItemUpdate(item) {
           let that = this
           that.itemDialog.title = "更新商品属性"
           that.itemDialog.formVisible = true
           that.itemStatus = 'update'
           that.searchItem(item.itemName)
        },
        // 点击删除商品属性
        clickItemDelete(item) {
            let that = this
            this.$alert(`确定删除商品“${item.itemName}”吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                that.deleteItem(item._id)
            }).catch(() => {
                that.showToast('info', '取消删除')
            })
        },
        // 点击增加属性
        clickAddItem() {
           let that = this
           that.itemDialog.title = "增加商品属性"
           that.itemDialog.formVisible = true
           that.itemStatus = 'create'
           for(let key in that.item){
             that.item[key]  = ''
           }
        },
        // 点击查找属性
        clickSearchItem() {
            let that = this
            that.itemStatus = 'search'
            this.$prompt(`请输入查找的属性名：`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                that.searchItem(value)
            }).catch(() => {
                that.showToast('info', '取消输入')
            })
        },
        // 点击确定修改商品属性
        clickConfirmAddItem() {
            let that = this
            if(!that.item.relatedGoodsId) {
                return that.showToast('warning', '必须填写关联商品id')
            }
            if(that.itemStatus === 'create') {
              that.addItem()
            } else {
              that.updateItem()
            }
        },
        // 发送删除属性
        deleteItem(itemId) {
            let that = this
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/deleteItem`,
                data: {
                    _id: itemId
                }
            }).then(res => {
                if(res.data.status) {
                    that.getAllItems()
                    that.itemDialog.formVisible = false
                    that.showToast('success', res.data.message)
                } else {
                    that.showToast('error', res.data.message)
                }
            }) 
        },
        // 发送查找属性属性
        searchItem(item) {
            let that = this
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/searchItem`,
                data: {
                    itemName: item
                }
            }).then(res => {
                if(res.data.status) {
                    if(that.itemStatus === 'update') {
                        that.item = res.data.data[0]
                    } else if(that.itemStatus === 'search') {
                        that.itemList = res.data.data
                    } else {
                        that.itemList = res.data.data
                        that.itemDialog.formVisible = false
                        that.showToast('success', res.data.message)
                    }
                } else {
                    that.showToast('error', res.data.message)
                }
            })  
        },
        // 发送确定增加商品属性
        addItem() {
            let that = this
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/addItem`,
                data: that.item
            }).then(res => {
                if(res.data.status) {
                    that.getAllItems()
                    that.itemDialog.formVisible = false
                    that.showToast('success', res.data.message)
                } else {
                    that.showToast('error', res.data.message)
                }
            })  
        },
        // 发送确定更新商品属性
        updateItem() {
            let that = this
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/updateItem`,
                data: that.item
            }).then(res => {
                if(res.data.status) {
                    that.getAllItems()
                    that.itemDialog.formVisible = false
                    that.showToast('success', res.data.message)
                } else {
                    that.showToast('error', res.data.message)
                }
            }) 
        },
        // 点击添加商品
        clickConfirmAddBook() {
            let that = this
            if(!that.book.publisher) {
                return that.showToast('warning', '必须输入出版社');
            }
            if(that.bookStatus === 'create') {
              that.addBook()
            } else {
              that.updateBook()
            }       
        },
        // 获取所有出版社
        getAllPublishers() {
            let that = this
            axios({
                method: 'get',
                url: `${DOMAIN.domain}/allPublishers`
            }).then(res => {
                if(res.data.status) {
                    that.publisherList = res.data.data
                } else {
                    that.showToast('error', res.data.message)
                }
            })           
        },
        // 增加出版社
        addPublisher() {
          let that = this
          if (that.publisher != '') {
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/addPublisher`,
                data: that.publisher
            }).then(res => {
                if(res.data.status) {
                    that.getAllPublishers()
                    that.dialogFormVisible = false
                    that.showToast('success', res.data.message)
                } else {
                    that.showToast('error', res.data.message)
                }
            })   
          }
        },
        // 更新出版社信息
        updatePublisher() {
          let that = this
          if (that.publisher != '') {
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/updatePublisher`,
                data: that.publisher
            }).then(res => {
                if(res.data.status) {
                    that.dialogFormVisible = false
                    that.getAllPublishers()
                    that.showToast('success', res.data.message)
                } else {
                    that.showToast('error', res.data.message)
                }
            })   
          }
        },
        // 查找某一出版社
        searchPublisher(publisherName) {
          let that = this
          if (publisherName !== '') {
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/searchPublisher`,
                data: {
                    publisherName: publisherName
                }
            }).then(res => {
                if(res.data.status) {
                    if(that.publisherStatus === 'update') {
                       that.publisher = res.data.data[0]
                    } else {
                      that.publisherList = res.data.data
                      that.dialogFormVisible = false
                      that.showToast('success', res.data.message)
                    }
                } else {
                    that.showToast('error', res.data.message)
                }
            })   
          }
        },
        // 查找某一本书
        searchBook(name) {
          let that = this
          if (name != '') {
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/searchGoods`,
                data: {
                    name: name
                }
            }).then(res => {
                if(res.data.status) {
                    if(that.bookStatus === 'update') {
                        that.book = res.data.data[0]
                    } else if(that.bookStatus === 'search') {
                        that.bookList = res.data.data
                    } else {
                        that.bookList = res.data.data
                        that.bookDialog.formVisible = false
                        that.showToast('success', res.data.message)
                    }
                } else {
                    that.showToast('error', res.data.message)
                }
            })   
          }
        },
        // 增加商品
        addBook() {
          let that = this
          if (that.book != '') {
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/addbook`,
                data: that.book
            }).then(res => {
                if(res.data.status) {
                    that.getAllBooks()
                    that.bookDialog.formVisible = false
                    that.showToast('success', res.data.message)
                } else {
                    that.showToast('error', res.data.message)
                }
            })   
          }
        },
        // 获取所有商品
        getAllBooks() {
            let that = this
            axios({
                method: 'get',
                url: `${DOMAIN.domain}/allGoods`
            }).then(res => {
                if(res.data.status) {
                    that.bookList = res.data.data
                } else {
                    that.showToast('error', res.data.message)
                }
            })           
        },
        // 获取所有商品属性
        getAllItems() {
            let that = this
            axios({
                method: 'get',
                url: `${DOMAIN.domain}/allItem`
            }).then(res => {
                if(res.data.status) {
                    that.itemList = res.data.data
                } else {
                    that.showToast('error', res.data.message)
                }
            })           
        },
        updateBook() {
            let that = this
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/updatebook`,
                data: that.book
            }).then(res => {
                if(res.data.status) {
                  that.bookDialog.formVisible = false
                  that.getAllBooks()
                  that.showToast('success', res.data.message)
                } else {
                  that.showToast('error', res.data.message)
                }
            })
        },
        postDelete(bookId) {
            let that = this
            axios({
                method: 'post',
                url: `${DOMAIN.domain}/deletebook`,
                data: {
                    bookId: bookId
                }
            }).then(res => {
                if(res.data.status) {
                  that.getAllBooks()
                  that.showToast('success', res.data.message)
                } else {
                  that.showToast('error', res.data.message)
                }
            })
        },
        // 获取参数
        getQuery() {
            let that = this
        },
        clickAddBook() {
           let that = this
           that.bookDialog.title = "增加商品"
           that.bookDialog.formVisible = true
           that.bookStatus = 'create'
           for(let key in that.book){
             that.book[key]  = ''
           }
        },
        clickAddPublisher() {
           let that = this
           that.publisherDialogTitle = "增加出版社"
           that.dialogFormVisible = true
           that.publisherStatus = 'create'
           for(let key in that.publisher){
             that.publisher[key]  = ''
           }
        },
        clickSearchBook() {
            let that = this
            that.bookStatus = 'search'
            this.$prompt(`请输入查找的书名：`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                that.searchBook(value)
            }).catch(() => {
                that.showToast('info', '取消输入')
            })
        },
        clickSearchPublish() {
            let that = this
            this.$prompt(`请输入查找的出版社名称：`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                that.searchPublisher(value)
            }).catch(() => {
                that.showToast('info', '取消输入')
            })
        },
        clickUpdate(item) {
            let that = this
            that.publisherDialogTitle = "更新商品"
            that.bookDialog.formVisible = true
            that.bookStatus = 'update'
            that.searchBook(item.name)
        },
        clickPublisherUpdate(item) {
            let that = this
            that.publisherDialogTitle = "更新出版社"
            that.dialogFormVisible = true
            that.publisherStatus = 'update'
            that.searchPublisher(item.publisherName)
            console.log('publisherName')
        },
        clickPublisherDelete(item) {
            console.log('publisherName')
        },
        clickDelete(item) {
            let that = this
            this.$alert(`确定删除商品“${item.bookName}”吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                that.postDelete(item._id)
            }).catch(() => {
                that.showToast('info', '取消删除')
            })
        },
        showToast(type, message) {
            this.$message({
                message: message,
                type: type
            });
        }
    },
    created() {
      let that = this
      that.activeName = 'book'
      that.getQuery()
      that.getAllBooks()
      that.getMe()
    },
    mounted() {

    }
}
</script>

<style lang="stylus" scoped>
  .el-header
    background-color #f9fafc
    color #333
    text-align center
    line-height 60px
    display flex
    flex-direction row

  .tabChange
    width 60%
  .userInfo
    margin-left 10%
    width 30%
    display flex
    flex-direction row
    text-align center
    align-items center
  .headUser
    width 100px
  .outButton
    width 80px
    height 40px
  .goodsImage
    width 40px
    height 40px
  .asideButton
    height 80px
    width 120px
    margin 40px auto
    text-align center
  .el-aside
    background-color #D3DCE6
    color #333
    text-align center
  
  .el-main 
    background-color #E9EEF3
    color #333
    text-align center

  
</style>
