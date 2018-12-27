const mongoose = require('../db'),
      Schema = mongoose.Schema;

let ItemSchema = new Schema({
    relatedGoodsId: {
      type: Schema.Types.ObjectId,
      ref: "Goods",
      comment: '关联商品Id'
    },
    itemName: {
      type: String,
      comment: '名称'
    },
    typeFall: {
      type: String,
      comment: '差价'
    },
    typeStock: {
      type: Number,
      comment: '库存'
    },
    typeVersion: {
      type: String,
      comment: '版本号'
    },
    typeTime: {
      type: String,
      comment: '出版时间'
    }
}, {timestamps: true})

module.exports = mongoose.model('Item', ItemSchema);