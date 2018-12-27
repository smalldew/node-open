const mongoose = require('mongoose')
const crypto = require("crypto")
const ItemSchema = require('../models/item')
const GoodsSchema = require('../models/goods')

mongoose.Promise = global.Promise

// 获取所有商品属性
exports.allItem = async (ctx) => {
    let body = ctx.request.body
    let ItemSchemaData = await ItemSchema.find()

    let status, message
    status = true
    message = '恭喜！查询商品属性成功！'
    
    return {
        status: status,
        message: message,
        data: ItemSchemaData
    }
}


// 增加商品属性
exports.addItem = async (ctx) => {
    let body = ctx.request.body

    const ItemObj = {
        relatedGoodsId: body.relatedGoodsId,
        itemName: body.itemName,
        typeFall: body.typeFall,
        typeStock: body.typeFall,
        typeVersion: body.typeVersion,
        typeTime: body.typeTime
    }

    let ItemSchemaFindData = await ItemSchema.find({itemName:body.itemName})

    let status, message, data
    if(ItemSchemaFindData.length > 0) {
        status = false
        message =  '该商品属性已存在！'
        data = ItemSchemaFindData
    } else {
        data = await ItemSchema.create(ItemObj)
        status = true
        message = '恭喜！添加商品属性成功！'
    }
    return {
        status: status,
        message: message,
        data: data
    }
}

// 查找子属性
exports.searchItem = async (ctx) => {
    let body = ctx.request.body

    let ItemSchemaData = await ItemSchema.find({itemName: body.itemName})

    let status, message
    status = true
    message = '恭喜！查找商品属性成功！'

    return {
        status: status,
        message: message,
        data: ItemSchemaData
    }
}

// 删除商品属性
exports.deleteItem = async (ctx) => {
    let body = ctx.request.body

    let ItemSchemaData = await ItemSchema.remove({_id: body._id})

    let status, message
    status = true
    message = '恭喜！查找商品属性成功！'

    return {
        status: status,
        message: message,
        data: ItemSchemaData
    }
}


