const KoaRouter = require("koa-router");
const router = new KoaRouter();
const itemCtl = require('../controllers/item');


/**后台 */

// 获取所有子商品
router.get('/allItem', async ctx => {
    ctx.body = await itemCtl.allItem(ctx)
})

// 增加子商品
router.post('/addItem', async ctx => {
    ctx.body = await itemCtl.addItem(ctx)
})

// 更新子商品
router.post('/updateItem', async ctx => {
    ctx.body = await itemCtl.updateItem(ctx)
})

// 查找子商品
router.post('/searchItem', async ctx => {
    ctx.body = await itemCtl.searchItem(ctx)
})

// 删除子商品
router.post('/deleteItem', async ctx => {
    ctx.body = await itemCtl.deleteItem(ctx)
})

module.exports = router;