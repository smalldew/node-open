
const mongoose = require('mongoose')
const crypto = require("crypto")
const moment = require('moment')

let OrderSchema = require('../models/order')
let ItemSchema = require('../models/item')
let ShopCartSchema = require('../models/shopCart')


let OrderSetTimeoutId, ItemIds




// 查询订单
exports.searchOrder = async (ctx) => {
    let OrderSchemaData = await OrderSchema.find({userId: ctx.request.header.userid})

    let status, message
    status = true
    message = '恭喜！查询订单成功！'

    return {
        status: status,
        message: message,
        data: OrderSchemaData
    }
}

// 取消订单
exports.cancelOrder = async (ctx) => {
    let body = ctx.request.body

    let OrderSchemaData = await OrderSchema.findByIdAndUpdate(
        {_id: body._id},
        {$set: {
            orderStatus: body.orderStatus,
            updatedAt: Date.now()
        }
    })

    let status, message
    status = true
    message = '恭喜！取消订单成功！'

    return {
        status: status,
        message: message
    }
}

// 删除订单
exports.deleteOrder = async (ctx) => {
    let body = ctx.request.body

    let OrderSchemaData = await OrderSchema.findByIdAndUpdate(
        {_id: body._id},
        {$set: {
            orderStatus: body.orderStatus,
            updatedAt: Date.now()
        }
    })

    let status, message
    status = true
    message = '恭喜！删除订单成功！'

    return {
        status: status,
        message: message
    }
}

/**前端方法 */


// 下订单
exports.clientPlaceOrder = async (ctx) => {
    let body = ctx.request.body

    const orderObj = {
        userId: ctx.request.header.userid,
        itemIds : body.itemIds,
        itemsOriginalPrice: body.itemsOriginalPrice,
        itemsPresentPrice: body.itemsPresentPrice,
        orderStatus: body.orderStatus,
        placeTime: Date.now()
    }
    // 下订单的时候就开始减库存
    // 支付成功后确认减，支付失败(取消失败或者30分钟未支付)后,返还库存
    ItemIds = body.itemIds
    await Promise.all(
        // 减库存 
        ItemIds.map(async (value) => {
            let ItemSchemaData =  await ItemSchema.findOneAndUpdate({_id: value},
                {
                    $inc: {
                       typeStock: -1
                    }
                }
            )
        })
    )
    let OrderSchemaData = await OrderSchema.create(orderObj)
   
    OrderSetTimeoutId = OrderSchemaData._id
    // 30分钟后自动取消
    setTimeout(async () => {
      let OrderSchemaDataNew = await OrderSchema.findOne({_id: OrderSetTimeoutId})
      if(OrderSchemaDataNew.orderStatus === 'unpay') {
         // 取消订单
         let OrderSchemaDataUpdate = await OrderSchema.findOneAndUpdate(
            {_id: OrderSetTimeoutId},
            {$set: {
                orderStatus: 'cancel',
                updatedAt: Date.now()
            }
        }, {new: true})
        // 返还库存
        await Promise.all(
            ItemIds.map(async (value) => {
                let ItemSchemaData =  await ItemSchema.findOneAndUpdate({_id: value},
                    {
                        $inc: {
                           typeStock: 1
                        }
                    }
                )
            }) 
        )
      }
    }, 1000 * 60 * 30)
    
    let status, message
    status = true
    message = '恭喜！下订单成功！'

    return {
        status: status,
        message: message,
        data: OrderSchemaData
    }
}

// 支付订单
exports.clientPayOrder = async (ctx) => {
    let body = ctx.request.body
    let OrderSchemaDataObj
    let status, message

    if(body.orderStatus === 'cancel') {
        // 返还库存
        await Promise.all(
            ItemIds.map(async (value) => {
                let ItemSchemaData =  await ItemSchema.findOneAndUpdate({_id: value},
                    {
                        $inc: {
                           typeStock: 1
                        }
                    }
                )
            }) 
        )
        status = false
        message = '您已取消订单！'
    } else {
        let OrderSchemaData = await OrderSchema.findOneAndUpdate(
            {_id: body._id},
            {$set: {
                orderStatus: body.orderStatus,
                payTime: Date.now()
            }
        })
        OrderSchemaDataObj =  await OrderSchema.findOne({_id: body._id}).lean()
        
        await ShopCartSchema.findOneAndRemove({userId: OrderSchemaData.userId})

        status = true
        message = '恭喜！支付订单成功！'
    }


    return {
        status: status,
        message: message,
        data: OrderSchemaDataObj
    }
}

// 查询订单
exports.clientSearchOrder = async (ctx) => {
    let body = ctx.request.body

    let OrderSchemaData = await OrderSchema.findOne({_id: body.orderId}).lean()


    let status, message
    status = true
    message = '恭喜！查询订单成功！'

    return {
        status: status,
        message: message,
        data: OrderSchemaData
    }
}


// 查询所有订单
exports.clientSearchAllOrder = async (ctx) => {

    let OrderSchemaData = await OrderSchema.find({userId: ctx.request.header.userid}).lean()
    await Promise.all(
        OrderSchemaData.map(async (value) => {
            value.itemIdsDetail = []
            await Promise.all(
                value.itemIds.map(async (element) => {
                    let ItemSchemaData = await ItemSchema.findOne({_id: element}).populate('relatedGoodsId').lean()
                    // 是否是促销时间
                    let isPromote
                    if(moment().isBetween(ItemSchemaData.relatedGoodsId.promotionStartTime, ItemSchemaData.relatedGoodsId.promotionEndTime)) {
                      isPromote = true
                    } else {
                      isPromote = false
                    } 
                    ItemSchemaData.relatedGoodsId.isPromote = isPromote

                    value.itemIdsDetail.push(ItemSchemaData)
                })
            ) 
        })
    )

    let status, message
    status = true
    message = '恭喜！查询订单成功！'

    return {
        status: status,
        message: message,
        data: OrderSchemaData
    }
}



