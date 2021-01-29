const Koa = require("koa")
const Router = require("koa-router")
const next = require("next")
const session = require("koa-session")
const Redis = require("ioredis");
const RedisSessionStroe = require("./server/session-store")
const auth = require("./server/auth")
const api = require("./server/api")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

//创建redisCline
const redis = new Redis();

app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();

    server.keys = ['suibian1 suibian2 suibian3']
    const SESSION_CONFIG = {
        key: "jid",
        store: new RedisSessionStroe(redis)
    }
    server.use(session(SESSION_CONFIG, server))

    //配置处理github OAuth登陆
    auth(server)
    api(server)
    server.use(router.routes())
    server.use(async (ctx, next) => {
        ctx.req.session = ctx.session
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    })
    server.listen(3000, () => {
        console.log("koa serve 启动 3000")
    })
})