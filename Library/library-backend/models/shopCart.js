const mongoose = require('../db'),
      Schema = mongoose.Schema;

let ShopCartSchema = new Schema({
    userId : {
      type: String,
      comment: '用户Id'
    },
    goods : [
      {
        goodsId: String,
        itemIds: [String]
      }
    ]
}, {timestamps: true})

module.exports = mongoose.model('ShopCart', ShopCartSchema);