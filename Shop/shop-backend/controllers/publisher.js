const mongoose = require('mongoose');
const crypto = require("crypto");
let PublisherSchema = require('../models/publisher');
mongoose.Promise = global.Promise;

// 获取所有出版社
exports.allPublishers = async () => {
    
    let PublisherSchemaData = await PublisherSchema.find()

    let status, message
    if(PublisherSchemaData.length > 0) {
        status = true
        message =  '找到出版社~'
    } else {
        status = false
        message = '没有任何出版社！'
    }
    return {
        status: status,
        message: message,
        data: PublisherSchemaData
    }
}

// 增加出版社
exports.addPublisher = async (ctx) => {
    let body = ctx.request.body

    const PublisherNameObj = {
        publisherName:body.publisherName, 
        publisherAddress: body.publisherAddress, 
        publisherWeb: body.publisherWeb,
        publisherPhone: body.publisherPhone
    };

    let PublisherSchemaData = await PublisherSchema.find({publisherName: body.publisherName})
    
    let status, message
    if(PublisherSchemaData.length > 0) {
        status = false
        message =  '该出版社已存在！'
    } else {
        await PublisherSchema.create(PublisherNameObj)
        status = true
        message = '恭喜！添加出版社成功！'
    }
    return {
        status: status,
        message: message
    }
}

// 更新书籍
exports.updatePublisher = async (ctx) => {
    let body = ctx.request.body

    let PublisherSchemaData = await PublisherSchema.update(
        {_id: body._id},
        {$set:
            {
                publisherName: body.publisherName, 
                publisherAddress: body.publisherAddress, 
                publisherWeb: body.publisherWeb, 
                publisherPhone: body.publisherPhone
            }
        },
    )
    return {
        status: true,
        message: '已更新'
    }
}

// 查找书籍
exports.searchPublisher = async (ctx) => {
    let body = ctx.request.body
    const PublisherNameObj = {publisherName: body.publisherName}
    let PublisherSchemaData = await PublisherSchema.find(PublisherNameObj)
    
    let status, message, data
    if(PublisherSchemaData.length > 0) {
        status = true
        message =  '此出版社存在！'
    } else {
        status = false
        message = '此出版社不存在！'
    }
    return {
        status: status,
        message: message,
        data: PublisherSchemaData
    }
}

// 删除书籍
exports.deletePublisher = async (ctx) => {
    let body = ctx.request.body
    await PublisherSchema.remove({_id: body._id})

    return {
        status: true,
        message: '已删除'
    }
}