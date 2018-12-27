const mongoose = require('../db'),
      Schema = mongoose.Schema;

let GoodsSchema = new Schema({
    type: {
      type: String,
      comment: '商品类型/video/book'
    }, 
    name: {
      type: String,
      comment: "商品名称"
    },
    title: {
      type: String,
      comment: '商品的标题'
    },
    marketPrice: {
      type: String,
      comment: '商品的市场价'
    },
    shopPrice: {
      type: String,
      comment: '商品的商城价'
    },
    promotionPrice: {
      type: String,
      comment: '商品的促销价'
    },
    promotionStartTime: {
      type: String,
      comment: '商品的促销开始时间'
    },
    promotionEndTime: {
      type: String,
      comment: '商品的促销结束时间'
    },
    image: {
      type: String,
      comment: '商品图片'
    },
    publisher: {
      type: Schema.Types.ObjectId,
      ref: "Publisher",
      comment: '商品出版社'
    },
    commodityStatus: {
      type: String,
      comment: '上架状态'
    }
}, {timestamps: true})

module.exports = mongoose.model('Goods', GoodsSchema);