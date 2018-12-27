const mongoose = require('mongoose')
const crypto = require("crypto")
const moment = require('moment')


let GoodsSchema = require('../models/goods')
let PublisherSchema = require('../models/publisher')
let ItemSchema = require('../models/item')


// 获取所有商品
exports.allGoods = async () => {
    let GoodsSchemaData = await GoodsSchema.find().populate('publisher').lean()
        
    GoodsSchemaData.map(async (value, index, array) => {
        value.publisher = value.publisher.publisherName
        value.isPromition
    })

    let status, message
    if(GoodsSchemaData.length > 0) {
        status = true
        message =  '找到商品~'
    } else {
        status = false
        message = '没有任何商品！'
    }
    return {
        status: status,
        message: message,
        data: GoodsSchemaData
    }
}

// 增加商品
exports.addGoods = async (ctx) => {
    let body = ctx.request.body
    let PublisherSchemaData = await PublisherSchema.findOne({publisherName: body.publisher})

    const GoodsObj = {
            type: body.type,
            name: body.name,
            title: body.title,
            marketPrice: body.marketPrice,
            shopPrice: body.shopPrice,
            promotionPrice: body.promotionPrice,
            promotionTime: body.promotionTime,
            image: body.image,
            publisher: PublisherSchemaData._id,
            commodityStatus: body.commodityStatus	
    }
    let GoodsSchemaData = await GoodsSchema.find({name:body.name})

    let status, message
    if(GoodsSchemaData.length > 0) {
        status = false
        message =  '该商品已存在！'
    } else {
        await GoodsSchema.create(GoodsObj)
        status = true
        message = '恭喜！添加商品成功！'
    }
    return {
        status: status,
        message: message
    }
}

// 更新商品
exports.updateGoods = async (ctx) => {
    let body = ctx.request.body
    let PublisherSchemaData = await PublisherSchema.findOne({publisherName: body.publisher})

    let GoodsSchemaData = await GoodsSchema.update(
        {_id: body._id},
        {$set:
            {
                    type: body.type,
                    name: body.name,
                    title: body.title,
                    marketPrice: body.marketPrice,
                    shopPrice: body.shopPrice,
                    promotionPrice: body.promotionPrice,
                    promotionTime: body.promotionTime,
                    image: body.image,
                    publisher: PublisherSchemaData._id,
                    commodityStatus: body.commodityStatus	
            }
        }
    )
    
    return {
        status: true,
        message: '已更新'
    }
}

// 查找商品
exports.searchGoods = async (ctx) => {
    let body = ctx.request.body
    let GoodsSchemaData = await GoodsSchema.find({name: body.name}).lean()
    
    let PublisherSchemaData = await PublisherSchema.findOne({_id: GoodsSchemaData[0].publisher})

    GoodsSchemaData[0].publisher = PublisherSchemaData.publisherName

    let status, message, data
    if(GoodsSchemaData) {
        status = true
        message =  '此商品存在！'
    } else {
        status = false
        message = '此商品不存在！'
    }
    return {
        status: status,
        message: message,
        data: GoodsSchemaData
    }
}

// 删除商品

exports.deleteGoods= async (ctx) => {
    let body = ctx.request.body
    await GoodsSchema.remove({_id: body._id})

    return {
        status: true,
        message: '已删除'
    }
}


/**前端 */

// 客户端查看商品详情
exports.clientOneGoods = async (ctx) => {
    let body = ctx.request.body
    let GoodsSchemaData = await GoodsSchema.findOne({_id: body.goodsId}).populate('publisher').lean()
    
    let isPromote
    if(moment().isBetween(GoodsSchemaData.promotionStartTime, GoodsSchemaData.promotionEndTime)) {
      isPromote = true
    } else {
      isPromote = false
    } 
    GoodsSchemaData.isPromote = isPromote
    GoodsSchemaData.itemsDetail = []

    let itemsSchemaData = await ItemSchema.find({relatedGoodsId: body.goodsId}).lean()
    GoodsSchemaData.itemsDetail = itemsSchemaData

    return {
        status: true,
        message: '查到详情信息',
        data: GoodsSchemaData
    }
}
// 客户端查找商品
exports.clientSearchGoods = async (ctx) => {
    let body = ctx.request.body
    let GoodsSchemaData = await GoodsSchema.find({name: body.name}).populate('publisher').lean()

   // 商品的属性
    await Promise.all(
        GoodsSchemaData.map(async (value, index, array) => {
            value.publisher = value.publisher.publisherName
            // 是否是促销时间
            let isPromote, itemsSchemaData
            if(moment().isBetween(value.promotionStartTime, value.promotionEndTime)) {
              isPromote = true
            } else {
              isPromote = false
            } 
            value.isPromote = isPromote
            itemsSchemaData = await ItemSchema.find({relatedGoodsId: value._id}).lean()
            value.items = itemsSchemaData
        })
    ) 

    let status, message
    if(GoodsSchemaData.length > 0) {
        status = true
        message =  '找到商品~'
    } else {
        status = false
        message = '没有任何商品！'
    }
    return {
        status: status,
        message: message,
        data: GoodsSchemaData
    }
}

// 客户端获取所有商品
exports.clientAllGoods = async (ctx) => {
    let body = ctx.request.body
    let GoodsSchemaData = await GoodsSchema.find().populate('publisher').lean()

   // 商品的属性
    await Promise.all(
        GoodsSchemaData.map(async (value, index, array) => {
            value.publisher = value.publisher.publisherName
            // 是否是促销时间
            let isPromote, itemsSchemaData
            if(moment().isBetween(value.promotionStartTime, value.promotionEndTime)) {
              isPromote = true
            } else {
              isPromote = false
            } 
            value.isPromote = isPromote
        })
    ) 

    let status, message
    if(GoodsSchemaData.length > 0) {
        status = true
        message =  '找到商品~'
    } else {
        status = false
        message = '没有任何商品！'
    }
    return {
        status: status,
        message: message,
        data: GoodsSchemaData
    }
}

