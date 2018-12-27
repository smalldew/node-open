const KoaRouter = require("koa-router");
const router = new KoaRouter();
const publishctl = require('../controllers/publisher');

/**后台 */

// 获取所有出版社
router.get('/allPublishers', async ctx => {
    ctx.body = await publishctl.allPublishers()
})

// 增加出版社 
router.post('/addPublisher', async ctx => {
    ctx.body = await publishctl.addPublisher(ctx)
})

// 更新出版社
router.post('/updatePublisher', async ctx => {
    ctx.body = await publishctl.updatePublisher(ctx)
})

// 查找出版社
router.post('/searchPublisher', async ctx => {
    ctx.body = await publishctl.searchPublisher(ctx)
})


// 删除出版社
router.post('/deletePublisher', async ctx => {
    ctx.body = await publishctl.deletePublisher(ctx)
})


module.exports = router;