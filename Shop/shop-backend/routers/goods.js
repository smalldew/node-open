const KoaRouter = require("koa-router");
const router = new KoaRouter();
const goodsCtl = require('../controllers/goods');


/**后台 */
// 获取所有商品
router.get('/allGoods', async ctx => {
    ctx.body = await goodsCtl.allGoods(ctx)
})

// 增加商品
router.post('/addGoods', async ctx => {
    ctx.body = await goodsCtl.addGoods(ctx)
})

// 更新商品
router.post('/updateGoods', async ctx => {
    ctx.body = await goodsCtl.updateGoods(ctx)
})

// 查找商品
router.post('/searchGoods', async ctx => {
    ctx.body = await goodsCtl.searchGoods(ctx)
})

// 删除商品
router.post('/deleteGoods', async ctx => {
    ctx.body = await goodsCtl.deleteGoods(ctx)
})

/**************************************************/

/** 前端 */

// 获取商品详情
router.post('/client/oneGoods', async ctx => {
    ctx.body = await goodsCtl.clientOneGoods(ctx)
})

// 获取所有商品
router.get('/client/allGoods', async ctx => {
    ctx.body = await goodsCtl.clientAllGoods(ctx)
})

// 查找商品
router.post('/client/searchGoods', async ctx => {
    ctx.body = await goodsCtl.clientSearchGoods(ctx)
})



module.exports = router;


// 增加 post  查询 get  删除 delete 修改 put 