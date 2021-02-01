import { memo } from "react"
import { withRouter } from "next/router"
import { Row, Col, List } from "antd"
import Router from "next/router"
import Link from "next/link"
import Repo from "../components/repo"
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
const selectItemStyle = {
    borderLeft: "2px solid #e36209",
    fontWeight: 100
}

const FilterLink = memo(({ name, query, sort, order, lang }) => {
    let queryString = `?query=${query}`
    if (lang) {
        queryString += `&lang=${lang}`
    }
    if (sort) {
        queryString += `&sort=${sort}&order=${order || "desc"}`
    }
    return <Link href={`/search${queryString}`}>
        <a>
            {name}
        </a>
    </Link>
})
const search = ({ router, repos }) => {
    const { ...querys } = router.query
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

    const result = await api.request({
        url: `/search/repositories${queryString}`
    }, ctx.req, ctx.res)

    return {
        repos: result.data
    }
}

export default withRouter(search);