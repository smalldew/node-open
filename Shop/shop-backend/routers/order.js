
const KoaRouter = require("koa-router");
const router = new KoaRouter();
const orderCtl = require('../controllers/order');



/**后台 */

// 未支付订单
router.post('/unpayOrder', async ctx => {
    ctx.body = await orderCtl.unpayOrder(ctx)
})

// 查看订单
router.post('/searchOrder', async ctx => {
    ctx.body = await orderCtl.searchOrder(ctx)
})

// 取消订单
router.post('/cancelOrder', async ctx => {
    ctx.body = await orderCtl.cancelOrder(ctx)
})

// 删除订单
router.post('/deleteOrder', async ctx => {
    ctx.body = await orderCtl.deleteOrder(ctx)
})


/**************************************************/

/**前端 */

// 下订单
router.post('/client/placeOrder', async ctx => {
    ctx.body = await orderCtl.clientPlaceOrder(ctx)
})
// 支付订单
router.post('/client/payOrder', async ctx => {
    ctx.body = await orderCtl.clientPayOrder(ctx)
})

// 查看订单
router.post('/client/searchOrder', async ctx => {
    ctx.body = await orderCtl.clientSearchOrder(ctx)
})

// 查看订单
router.post('/client/searchAllOrder', async ctx => {
    ctx.body = await orderCtl.clientSearchAllOrder(ctx)
})

module.exports = router;