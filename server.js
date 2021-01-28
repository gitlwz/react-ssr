const Koa = require("koa")
const Router = require("koa-router")
const next = require("next")
const session = require("koa-session")
const Redis = require("ioredis");
const RedisSessionStroe = require("./server/session-store")
const auth = require("./server/auth")

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
    // router.get("/a/:id", async (ctx) => {
    //     const id = ctx.params.id;
    //     await handle(ctx.req, ctx.res, {
    //         pathname: "/a",
    //         query: { id }
    //     })
    //     ctx.respond = false;
    // })

    // router.get("/api/user/info", async (ctx) => {
    //     const user = ctx.session.userInfo;
    //     if (!user) {
    //         ctx.status = 401
    //         ctx.body = 'Need login'
    //     } else {
    //         ctx.body = user
    //         ctx.set("Content-Type", 'aoolication/json')
    //     }
    // })

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