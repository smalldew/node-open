const KoaRouter = require("koa-router");
let router = new KoaRouter();


router.use(require('./routers/users').routes()); // 登录注册用户

router.use(require('./routers/goods').routes()); // 商品处理

router.use(require('./routers/item').routes()); // 商品属性处理

router.use(require('./routers/shopCart').routes()); // 购物车处理

router.use(require('./routers/order').routes()); // 订单处理

router.use(require('./routers/pulishers').routes()); // 出版社处理

module.exports = router;
