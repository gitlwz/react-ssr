import { useEffect } from "react"
import { Button, Icon, Tabs } from "antd"
import getConfig from "next/config"
import { connect } from "react-redux"
import Router, { withRouter } from "next/router"
import LRU from "lru-cache"
import Repo from "../components/repo"

const cache = new LRU({
    maxAge: 1000 * 60 * 10
})
let cachedUserRepos, cachedUserStaredRepos;
const isServer = typeof window === "undefined"
const { publicRuntimeConfig } = getConfig()
const api = require("../lib/api")
const Index = ({ userRepos, userStaredRepos, user, router }) => {
    const isLogin = user && user.id
    const tabKey = router.query.key || "1"
    const handleTabChange = (activeKey) => {
        Router.push(`/?key=${activeKey}`)
    }
    useEffect(() => {
        if (!isServer) {
            // cachedUserRepos = userRepos;
            // cachedUserStaredRepos = userStaredRepos;
            if (userRepos) {
                cache.set("userRepos", userRepos)
            }
            if (userStaredRepos) {
                cache.set("userRepos", userStaredRepos)
            }
        }
    }, [userRepos, userStaredRepos])
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
    return <div className="root">
        <div className="user-info">
            <img className="avatar" src={user.avatar_url}></img>
            <span className="login">{user.login}</span>
            <span className="name">{user.name}</span>
            <span className="bio">{user.bio}</span>
            <p className="email">
                <Icon type="mail" style={{ marginRight: 10 }}></Icon>
                <a href={`mailto:${user.email}`}>{user.email}</a>
            </p>
        </div>
        <div className="user-repos">
            <Tabs activeKey={tabKey} onChange={handleTabChange} animated={false}>
                <Tabs.TabPane tab="你的仓库" key="1">
                    {
                        Array.isArray(userRepos) && userRepos.map(repo => <Repo key={repo.id} repo={repo}></Repo>)
                    }
                </Tabs.TabPane>
                <Tabs.TabPane tab="你关注的仓库" key="2">
                    {
                        Array.isArray(userStaredRepos) && userStaredRepos.map(repo => <Repo key={repo.id} repo={repo}></Repo>)
                    }
                </Tabs.TabPane>
            </Tabs>
            {/* {
                userRepos.map(repo => <Repo repo={repo}></Repo>)
            } */}
        </div>
        <style jsx>{`
              .root{
                padding:20px 0;
                display: flex;
                align-items: flex-start;
              }  
              .user-info{
                width: 200px;
                margin-right: 40px;
                flex-shrink: 0;
                display: flex;
                flex-direction: column;
              }
            .login{
                font-weight: 800;
                font-size: 20px;
                margin-top: 20px;
            }
            .name{
                font-size: 16px;
                color: #777;
            }
            .bio{
                margin-top: 20px;
                color: #333;
            }
            .avatar{
                width: 100%;
                border-radius: 4px;
            }
            .user-repos{
                flex-grow:1;
            }
            `}</style>
    </div>
}

Index.getInitialProps = async ({ ctx, reduxStore }) => {
    const user = reduxStore.getState().user
    if (!(user && user.id)) {
        return {
            isLogin: false
        }
    }
    if (!isServer) {
        if (cache.get("userRepos") && cache.get("userStaredRepos")) {
            return {
                userRepos: cache.get("userRepos"),
                userStaredRepos: cache.get("userStaredRepos")
            }
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
export default withRouter(connect((state) => {
    return {
        user: state.user
    }
})(Index));