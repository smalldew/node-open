

const mongoose = require('mongoose')
const crypto = require("crypto")
const moment = require('moment')
const _ = require('lodash')

let ShopCartSchema = require('../models/shopCart')
let OrderSchema = require('../models/order')
let ItemSchema = require('../models/item')
let GoodsSchema = require('../models/goods')

mongoose.Promise = global.Promise

// 加入到购物车
exports.addShopCart = async (ctx) => {
    let body = ctx.request.body
    let ShopCartSchemaData = await ShopCartSchema.find({userId: ctx.request.header.userid})
    let status, message
    
    const shopCart = {
        userId: ctx.request.header.userid,
        itemIds: body.itemIds
    }

    if(ShopCartSchemaData.length > 0) {
        let ItemSchemaData = await ShopCartSchema.update(
            {$set:
                {
                  itemIds: body.itemIds
                }
            }
        )
        status = true
        message = '恭喜！更新购物车成功！'
    } else {
        await ShopCartSchema.create(shopCart)
        status = true
        message = '恭喜！添加到购物车成功！'
    }

    return {
        status: status,
        message: message
    }
}

// 查询购物车
exports.searchShopCart = async (ctx) => {
    let body = ctx.request.body
    let ShopCartSchemaData = await ShopCartSchema.findOne({userId: ctx.request.header.userid})
    let status, message
    
    status = true
    message = '恭喜！查询成功！'

    return {
        status: status,
        message: message,
        data: ShopCartSchemaData
    }
}

// 删除购物车
exports.deleteShopCart = async (ctx) => {
    let body = ctx.request.body
    let ShopCartSchemaData = await ShopCartSchema.findByIdAndRemove({userId: ctx.request.header.userid})
    let status, message
    
    status = true
    message = '恭喜！删除成功！'

    return {
        status: status,
        message: message,
        data: ShopCartSchemaData
    }
}

/**前端界面 */

// 清空购物车
exports.clientEmptyShopCart = async (ctx) => {
    let ShopCartSchemaData = await ShopCartSchema.findOneAndUpdate({userId: ctx.request.header.userid}, 
        {$set: {
            "goods": []
        }
    }, {new: true}).lean()
    // 把更新后的对象返回
    
    return {
        status: true,
        message: "清空购物车成功",
        data: ShopCartSchemaData
    }
}

// 从购物车移除
exports.clientDeleteShopCart = async (ctx) => {
    let body = ctx.request.body
    let ShopCartSchemaData = await ShopCartSchema.findOne({userId: ctx.request.header.userid}).lean()
    
    let shopCardItem = {
        goodsId: body.goodsId,
        itemIds: [body.itemId]
    }
    let status
    let message 

    await Promise.all(
        ShopCartSchemaData.goods.map(async (value, index, array) => {
            if(value.goodsId === body.goodsId) {
                _.pull(value.itemIds, body.itemId)
                await ShopCartSchema.update({userId: ctx.request.header.userid}, 
                        {$set: {
                            "goods": ShopCartSchemaData.goods
                        }
                    }).lean()
                    status = true
                    message = "移除购物车成功"
            }
        })
      )
    return {
        status: status,
        message: message,
        data: ShopCartSchemaData
    }
}
// 加入购物车
exports.clientAddShopCart = async (ctx) => {
    let body = ctx.request.body
    let ShopCartSchemaData = await ShopCartSchema.findOne({userId: ctx.request.header.userid}).lean()
    
    let shopCardItem = {
        goodsId: body.goodsId,
        itemIds: [body.itemId]
    }
    let status
    let message 

    if(ShopCartSchemaData) {
        // 当前记录不包含对应goodIds
        let isGoodsId = false

        await Promise.all(
            ShopCartSchemaData.goods.map(async (value, index, array) => {
                if(value.goodsId === body.goodsId) {
                    isGoodsId = true
                }
            })
        )

        if(isGoodsId) {
          await Promise.all(
            ShopCartSchemaData.goods.map(async (value, index, array) => {
                if(value.goodsId === body.goodsId) {
                    if(value.itemIds.indexOf(body.itemId) === -1) {
                        value.itemIds.push(body.itemId)
                        await ShopCartSchema.update({userId: ctx.request.header.userid}, 
                            {$set: {
                                "goods": ShopCartSchemaData.goods
                            }
                        }).lean()
                        status = true
                        message = "添加成功"
                    } else {
                        status = false
                        message = '不可重复添加商品'
                    }
                }
            })
          )
        } else {
            await ShopCartSchema.update({userId: ctx.request.header.userid}, 
                {$push: {
                    "goods": shopCardItem
                }
            })
            ShopCartSchemaData = await ShopCartSchema.findOne({userId: ctx.request.header.userid}).lean()
            status = true
            message = "添加成功"
        }
    } else {
        const shopCartObj = {
            userId: ctx.request.header.userid,
            goods: shopCardItem
        }
        await ShopCartSchema.create(shopCartObj)
        ShopCartSchemaData = await ShopCartSchema.findOne({userId: ctx.request.header.userid}).lean()
        status = true
        message = "添加成功"
    }

    return {
        status: status,
        message: message,
        data: ShopCartSchemaData
    }
}


exports.clientSearchShopCart = async (ctx) => {

    let ShopCartSchemaData = await ShopCartSchema.findOne({userId: ctx.request.header.userid})
    let status, message
    
    status = true
    message = '恭喜！查询成功！'

    return {
        status: status,
        message: message,
        data: ShopCartSchemaData
    }
}

// 购物车详情
exports.clientShopCartItems = async (ctx) => {

    let ShopCartSchemaData = await ShopCartSchema.findOne({userId: ctx.request.header.userid}).lean()
    await Promise.all(
        ShopCartSchemaData.goods.map(async (value, index, array) => {
            let GoodsSchemaData = await GoodsSchema.findOne({_id: value.goodsId}).lean()
            value.goodsIdDetail = GoodsSchemaData

            // 是否是促销时间
            let isPromote
            if(moment().isBetween(GoodsSchemaData.promotionStartTime, GoodsSchemaData.promotionEndTime)) {
              isPromote = true
            } else {
              isPromote = false
            } 
            value.goodsIdDetail.isPromote = isPromote

            value.itemIdsDetail = []
            
            await Promise.all(
                value.itemIds.map(async (element) => {
                    let ItemSchemaData = await ItemSchema.findOne({_id: element}).lean()
                    value.itemIdsDetail.push(ItemSchemaData)
                })
            )
        })
    ) 

    let status, message
    
    status = true
    message = '恭喜！查询购物车详情成功！'

    return {
        status: status,
        message: message,
        data: ShopCartSchemaData
    }
}





