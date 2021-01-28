import { useState, useCallback } from "react"
import { Layout, Icon, Input, Avatar } from "antd"
const { Header, Content, Footer } = Layout

const githubIconStyle = {
    color: "white",
    fontSize: 40,
    display: "block",
    paddingTop: 10,
    marginRight: 20
}
const footerSryle = {
    textAlign: "center"
}
export default ({ children }) => {
    const [search, setSearch] = useState("")
    const handleSearchChange = useCallback((evnet) => {
        setSearch(evnet.target.value)
    }, [])
    const handleOnSearch = useCallback(() => {

    })
    return (<Layout>
        <Header >
            <div className="header-inner">
                <div className="header-left">
                    <div className="logo">
                        <Icon type="github" style={githubIconStyle}></Icon>
                    </div>
                    <div>
                        <Input.Search
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="搜索仓库"
                            onSearch={handleOnSearch}
                        />
                    </div>
                </div>
                <div className="header-right">
                    <div className="user">
                        <Avatar size={40} icon="user"></Avatar>
                    </div>
                </div>
            </div>
        </Header>
        <Content>
            {children}
        </Content>
        <Footer style={footerSryle}>
            develp by liuwenzhu
        </Footer>
        <style jsx>
            {`
            .header-inner{
                display:flex;
                justify-content:space-between;
            }
            .header-left{
                display:flex;
                justify-content:flex-start;
            }
        `}
        </style>
        <style jsx global>{`
            #__next{
                height:100%;
            }
            .ant-layout{
                height:100%;
            }
        `}
        </style>
    </Layout>)
}