const mongoose = require('../db'),
      Schema = mongoose.Schema;

let PublisherSchema = new Schema({
    publisherName: {
      type: String,
      comment: "出版社名称"
    },
    publisherAddress: {
        type: String,
        comment: "出版社地址"
    },
    publisherWeb: {
        type: String,
        comment: "出版社官网"
    },
    publisherPhone: {
        type: String,
        comment: "出版社电话"
    }
}, {timestamps: true})

module.exports = mongoose.model('Publisher',PublisherSchema);