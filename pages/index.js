import { Button } from "antd"
import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig()
const api = require("../lib/api")
const Index = ({ userRepos, userStaredRepos, isLogin }) => {
    if (!isLogin) {
        return <div className="root">
            <p>还没有登陆</p>
            <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>点击登陆</Button>
            <style jsx>
                {`
                        .root{
                            height: 400px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: column;
                        }
                    `}
            </style>
        </div>
    }
    return <span>index </span>
}


Index.getInitialProps = async ({ ctx, reduxStore }) => {
    const user = reduxStore.getState().user
    if (!(user && user.id)) {
        return {
            isLogin: false
        }
    }
    const [userRepos, userStaredRepos] = await Promise.all([
        api.request({
            url: "/user/repos"
        }, ctx.req, ctx.res),
        api.request({
            url: "/user/starred"
        }, ctx.req, ctx.res)
    ])
    return {
        isLogin: true,
        userRepos: userRepos.data,
        userStaredRepos: userStaredRepos.data
    }
}
export default Index;