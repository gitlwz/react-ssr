import { memo, isValidElement, useEffect } from "react"
import { withRouter } from "next/router"
import { Row, Col, List, Pagination } from "antd"
import Router from "next/router"
import Link from "next/link"
import Repo from "../components/repo"
import { cacheArray } from "../lib/repo-basic-cache"
const api = require("../lib/api")
/**
 * 
 * sort :排序方式
 * order:
 * lang: 仓库的项目开发主语言
 * page
 */
const LANGUAGES = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Rust']
const SORT_TYPES = [
    {
        name: "Best Match"
    },
    {
        name: "Most Stars",
        value: "stars",
        order: "desc"
    },
    {
        name: "Fewest Stars",
        value: "stars",
        order: "asc"
    },
    {
        name: "Most Forks",
        value: "forks",
        order: "desc"
    },
    {
        name: "Fewest Forks",
        value: "forks",
        order: "asc"
    }
]
const noop = () => {

}
const per_page = 20;
const selectItemStyle = {
    borderLeft: "2px solid #e36209",
    fontWeight: 100
}
const isServer = typeof window === "undefined"
const FilterLink = memo(({ name, query, sort, order, lang, page }) => {
    let queryString = `?query=${query}`
    if (lang) queryString += `&lang=${lang}`;
    if (sort) queryString += `&sort=${sort}&order=${order || "desc"}`;
    if (page) queryString += `&page=${page}`;
    queryString += `&per_page=${per_page}`
    return isValidElement(name) ? name : <Link href={`/search${queryString}`}><a>{name}</a></Link>
})
const search = ({ router, repos }) => {
    const { ...querys } = router.query
    useEffect(() => {
        !isServer && cacheArray(repos.items)
    }, [repos])
    return <div className="root">
        <Row gutter={20}>
            <Col span={6}>
                <List
                    style={{ marginBottom: 20 }}
                    bordered
                    header={<span className="list-header">语言</span>}
                    dataSource={LANGUAGES}
                    renderItem={item => {
                        const selected = querys.lang === item
                        return <List.Item
                            style={selected ? selectItemStyle : null}
                        >
                            <FilterLink
                                {...querys}
                                name={item}
                                lang={item}
                            />
                        </List.Item>
                    }}
                />
                <List
                    bordered
                    header={<span className="list-header">排序</span>}
                    dataSource={SORT_TYPES}
                    renderItem={item => {
                        let selected = false
                        if (item.name === "Best Match" & !querys.sort) {
                            selected = true
                        } else if (item.value === querys.sort && item.order === querys.order) {
                            selected = true
                        }
                        return <List.Item
                            style={selected ? selectItemStyle : null}
                        >
                            <FilterLink
                                {...querys}
                                name={item.name}
                                sort={item.value}
                                order={item.order}
                            />
                        </List.Item>
                    }}
                />
            </Col>
            <Col span={18}>
                <h3 className="repos-title">{repos && repos.total_count} 个仓库</h3>
                {
                    repos && Array.isArray(repos.items) && repos.items.map(repo => <Repo key={repo.id} repo={repo}></Repo>)
                }
                <div className="pagination">
                    <Pagination
                        pageSize={per_page}
                        current={Number(querys.page) || 1}
                        total={repos.total_count > 1000 ? 1000 : repos.total_count}
                        onChange={noop}
                        itemRender={
                            (page, type, ol) => {
                                const p = type === "page" ? page : type === "prev" ? page - 1 : page + 1
                                const name = type === "page" ? page : ol;
                                return <FilterLink
                                    {...querys}
                                    page={p}
                                    name={name}
                                />
                            }
                        }
                    ></Pagination>
                </div>
            </Col>
        </Row>
        <style jsx>
            {`
            .root {
                padding: 20px 0;
            }

            .list-header {
                font-weight: 800;
                font-size: 16px;
            }  
            .repos-title{
                border-bottom:1px solid #eee;
                font-size:24px;
                line-height:50px;
            }
            .pagination{
                padding:20px;
                text-align:center;
            }
            `}
        </style>
    </div>
}

search.getInitialProps = async ({ ctx }) => {
    const { query, sort, lang, order, page } = ctx.query
    if (!query) {
        return {
            total_count: 0
        }
    }
    let queryString = `?q=${query}`
    if (lang) {
        queryString += `+language:${lang}`
    }
    if (sort) {
        queryString += `&sort=${sort}&order=${order || "desc"}`
    }
    if (page) {
        queryString += `&page=${page}`
    }
    queryString += `&per_page=${per_page}`
    const result = await api.request({
        url: `/search/repositories${queryString}`
    }, ctx.req, ctx.res)

    return {
        repos: result.data
    }
}

export default withRouter(search);