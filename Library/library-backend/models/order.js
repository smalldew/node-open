const mongoose = require('../db'),
      Schema = mongoose.Schema;

let OrderSchema = new Schema({
    userId: {
      type: String,
      comment: '用户Id'
    },
    itemIds : {
        type: [String],
        comment: '商品属性Id'
    },
    itemsOriginalPrice: {
      type: String,
      comment: '所有商品原价'
    },
    itemsPresentPrice: {
      type: String,
      comment: '所有商品购买价'
    },
    orderStatus: {
      type: String,
      enum: [
          'delete', // 删除订单
          'cancel', // 取消订单
          'unpay', // 待支付
          'pay'   // 已支付
      ],
      comment: '订单状态'
    },
    placeTime: {
      type: Date,
      comment: '下订单时间',
    },
    payTime:{
        type: Date,
        comment: '支付时间'
    }
}, {timestamps: true})

OrderSchema.index({userId: -1}, {background: true});
// 建立索引，优化查询效率

module.exports = mongoose.model('Order', OrderSchema);