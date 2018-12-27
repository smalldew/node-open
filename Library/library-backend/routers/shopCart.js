const KoaRouter = require("koa-router");
const router = new KoaRouter();
const shopCartCtl = require('../controllers/shopCart');


/**后台 */

// 查询购物车
router.post('/searchShopCart', async ctx => {
    ctx.body = await shopCartCtl.searchShopCart(ctx)
})

// 加入购物车 
router.post('/addShopCart', async ctx => {
    ctx.body = await shopCartCtl.addShopCart(ctx)
})

// 删除购物车
router.post('/deleteShopCart', async ctx => {
    ctx.body = await shopCartCtl.deleteShopCart(ctx)
})

// 结算购物车
router.post('/settleShopCart', async ctx => {
    ctx.body = await shopCartCtl.settleShopCart(ctx)
})



/**************************************************/

/**前端 */

// 清空购物车
router.post('/client/emptyShopCart', async ctx => {
    ctx.body = await shopCartCtl.clientEmptyShopCart(ctx)
})

// 加入购物车 
router.post('/client/addShopCart', async ctx => {
    ctx.body = await shopCartCtl.clientAddShopCart(ctx)
})

// 从购物车移除 
router.post('/client/deleteShopCart', async ctx => {
    ctx.body = await shopCartCtl.clientDeleteShopCart(ctx)
})

// 查询购物车
router.post('/client/searchShopCart', async ctx => {
    ctx.body = await shopCartCtl.clientSearchShopCart(ctx)
})

// 购物车详情
router.post('/client/shopCartItems', async ctx => {
    ctx.body = await shopCartCtl.clientShopCartItems(ctx)
})

module.exports = router;