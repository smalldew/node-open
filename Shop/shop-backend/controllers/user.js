const mongoose = require('mongoose');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
let UserSchema = require('../models/user');
mongoose.Promise = global.Promise;

exports.register = async ({username, password}) => {
    //密码加密
    const md5 = crypto.createHash("md5");
    const newPas = md5.update(password).digest("hex");
    //通过账号验证
    const updatestr = {username: username, userpsw:newPas};
    if(username == ''){
        status = false
        message = '用户名不能为空！'
    }
    let UserSchemaData = await UserSchema.findOne({username})
    let status, message
    if(!UserSchemaData) {
        await UserSchema.create(updatestr)
        status = true
        message = '恭喜！注册成功！'
    } else {
        status = false
        message = '该用户已注册！'
    }

    return {
        status: status,
        message: message
    }
}


exports.login = async({username, password}) => {
    //密码加密
    const md5 = crypto.createHash("md5");
    const newPas = md5.update(password).digest("hex");
    //通过账号验证
    const updatestr = {username: username, userpsw:newPas};
    let status, message, data, token

    if(username == ''){
        status = false
        message = '用户名不能为空'
    }
    if(password == '') {
        status = false
        message = '请输入密码'
    }
    // 查询账号是否存在
    let userNameData = await UserSchema.findOne({username})
    let userData = await UserSchema.findOne(updatestr)

    if(userData) {
        token = jwt.sign({
            name: username,
            id: userData._id
        }, 'library_token', {expiresIn: '1h'})
        
        status = true
        message = '登录成功！'
        data = {userId: userData._id, token: token}
    } else {
        if(userNameData) {
            status = false
            message = '密码错误！'
        } else {
            status = false
            message = '账号不存在，请先去注册！'
        }
    }

    return {
        status: status,
        message: message,
        data: data
    }
}

exports.me = async(ctx) => {
    
    const userIdOne = {_id: ctx.request.header.userid}

    let status, message
    let userData = await UserSchema.findOne(userIdOne)
    return {
        status: true,
        message: '获取成功',
        data: userData.username
    }
}