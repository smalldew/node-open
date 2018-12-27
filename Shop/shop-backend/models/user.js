const mongoose = require('../db'),
      Schema = mongoose.Schema;

let UserSchema = new Schema({
    username : {
      type: String,
      comment: '用户昵称'
    },
    userpsw : {
      type: String,
      comment: '用户密码'
    },
    logindate : {
      type: Date,
      comment: '登录时间'
    }
}, {timestamps: true})

module.exports = mongoose.model('User', UserSchema);