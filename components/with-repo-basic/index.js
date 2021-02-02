import { useEffect } from "react"
import Repo from "../repo"
import Link from "next/link"
import { withRouter } from "next/router"
import { get, set } from "../../lib/repo-basic-cache"
const api = require("../../lib/api")
const makeQuery = (queryObject) => {
    const query = Object.entries(queryObject)
        .reduce((result, entry) => {
            result.push(entry.join("="))
            return result
        }, []).join("&")
    return `?${query}`
}
const isServer = typeof window === "undefined"
export default (Comp, type = "index") => {
    const WithDetail = ({ repoBasic, router, pageData }) => {
        const query = makeQuery(router.query)
        useEffect(() => {
            if (!isServer) {
                set(repoBasic)
            }
        })
        return <div className="root">
            <div className="repo-basic">
                <Repo repo={repoBasic} />
                <div className="tabs">
                    <Link href={`/detail${query}`}>
                        <a className="tab index">Readme</a>
                    </Link>
                    <Link href={`/detail/issues${query}`}>
                        <a className="tab issues">Issues</a>
                    </Link>
                </div>
            </div>
            <div>
                <Comp {...pageData} />
            </div>
            <style jsx>{`
                .root{
                    padding-top:20px;
                }
                .repo-basic{
                    padding:20px;
                    border:1px solid #eee;
                    margin-bottom:20px;
                    border-radius:5px;
                }
                .tab + .tab{
                    margin-left:20px
                }
                `}</style>
        </div>
    }

    WithDetail.getInitialProps = async (context) => {
        const { ctx } = context
        const { owner, name } = ctx.query
        const full_name = `${owner}/${name}`


        let pageData = {}
        if (Comp.getInitialProps) {
            pageData = await Comp.getInitialProps(context)
        }
        if (get(full_name)) {
            return {
                repoBasic: get(full_name),
                pageData
            }
        }

        const repoBasic = await api.request({
            url: `/repos/${owner}/${name}`
        }, ctx.req, ctx.res)

        return {
            repoBasic: repoBasic.data,
            pageData
        }
    }
    return withRouter(WithDetail)
}