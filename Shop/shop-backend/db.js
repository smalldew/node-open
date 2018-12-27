var mongoose = require('mongoose')

//数据库地址
DB_URL = 'mongodb://localhost:27017/blog';


mongoose.connect(DB_URL,{useMongoClient:true},function (err) {
    if(err){
        console.log("数据库连接失败！");
    }else{
        console.log("数据库连接成功！");
    }
});

mongoose.connection.on('disconnected',function(){
    console.log('connect wrong');
})

module.exports = mongoose;