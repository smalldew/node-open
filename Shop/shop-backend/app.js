
const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const jwt = require('koa-jwt');

const router = require("./router")
// 本地接口
const hostname = '10.8.201.154'
const port = 1993

app.use(cors())
app.use(jwt({secret: 'library_token'}).unless({path: [/^\/login/]}))
app.use(logger())
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())


app.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`)
})