const KoaRouter = require("koa-router");
const router = new KoaRouter();
const userctl = require('../controllers/user');


/**前&后端 */
router.post('/register', async ctx => {
    ctx.body = await userctl.register({username: ctx.request.body.username, password: ctx.request.body.password})
})

router.post('/login', async ctx => {
    ctx.body = await userctl.login({username: ctx.request.body.username, password: ctx.request.body.password})
})

router.get('/me', async ctx => {
    ctx.body = await userctl.me(ctx)
})
module.exports = router;