const axios = require("axios")
const github_base_url = "https://api.github.com"
module.exports = (server) => {
    server.use(async (ctx, next) => {
        const path = ctx.path
        if (path.startsWith("/github")) {
            const githubAuth = ctx.session.githubAuth
            const githubPath = `${github_base_url}${ctx.url.relpace("/github/", "/")}`
            const token = githubAuth && githubAuth.access_token
            let headers = {};
            if (token) {
                headers["Authorization"] = `${githubAuth.token_type} ${token}`
            }
            try {
                const result = await axios({
                    method: "GET",
                    url: githubPath,
                    headers
                })
                if (result.status === 200) {
                    ctx.body = result.data;
                    ctx.set('Content-Type', 'application/json')
                } else {
                    ctx.set('Content-Type', 'application/json')
                    ctx.status = result.status
                    ctx.body = {
                        success: false
                    }
                }
            } catch (error) {
                console.error(error)
                ctx.status = result.status
                ctx.set('Content-Type', 'application/json')
                ctx.body = {
                    success: false
                }
            }
        } else {
            await next()
        }
    })
}